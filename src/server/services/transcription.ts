/**
 * ClipForge — transcription orchestration service.
 *
 * Pipeline:
 *   1. Mark video status=EXTRACTING_AUDIO
 *   2. Extract 16kHz mono WAV via FFmpeg (Whisper's expected input)
 *   3. Mark video status=TRANSCRIBING
 *   4. Spawn Python transcribe.py with the WAV path
 *   5. Persist Transcript row (text + segments JSON + language + duration)
 *   6. Mark video status=READY
 *
 * On failure: mark video FAILED, rethrow so the API route can return 500.
 */
import path from 'node:path'
import { promises as fs } from 'node:fs'
import { getVideo, updateVideoStatus, createTranscriptRow } from '@/server/db/repositories'
import { extractAudioForWhisper } from '@/lib/clipforge/server/ffmpeg'
import { runPythonJson, SubprocessError } from '@/lib/clipforge/server/subprocess'
import { OUTPUTS_DIR, resolveStoredPath, MODELS_DIR } from '@/lib/clipforge/paths'
import { logger } from '@/lib/clipforge/server/logger'

const log = logger.scoped('transcribe')

const SCRIPTS_DIR = path.join(process.cwd(), 'scripts')
const TRANSCRIBE_SCRIPT = path.join(SCRIPTS_DIR, 'transcribe.py')

export interface TranscribeOptions {
  /** faster-whisper model size. Default: base. */
  modelSize?: 'tiny' | 'base' | 'small' | 'medium' | 'large-v3'
  /** ISO language code (e.g. "en"). Default: auto-detect. */
  language?: string | null
  /** Generate per-word timestamps. Default: true. */
  wordTimestamps?: boolean
}

export interface TranscribeResult {
  transcriptId: string
  language: string
  languageProbability: number
  duration: number
  segmentCount: number
  textPreview: string
}

export class TranscribeError extends Error {
  constructor(message: string, public readonly stderr?: string) {
    super(message)
    this.name = 'TranscribeError'
  }
}

/**
 * Run the full transcription pipeline for a video.
 * Throws TranscribeError on any failure (video is marked FAILED).
 */
export async function transcribeVideo(
  videoId: string,
  opts: TranscribeOptions = {},
): Promise<TranscribeResult> {
  const modelSize = opts.modelSize ?? 'base'
  const language = opts.language ?? null
  const wordTimestamps = opts.wordTimestamps ?? true

  const video = await getVideo(videoId)
  if (!video) throw new TranscribeError(`Video not found: ${videoId}`)
  if (video.status === 'TRANSCRIBING' || video.status === 'EXTRACTING_AUDIO') {
    throw new TranscribeError(`Video is already being processed (status=${video.status})`)
  }

  const sourceAbs = resolveStoredPath(video.filePath)

  // 1. Extract audio.
  await updateVideoStatus(videoId, 'EXTRACTING_AUDIO', { progress: 10, message: 'Extracting audio…' })
  const audioDir = path.join(OUTPUTS_DIR, videoId)
  await fs.mkdir(audioDir, { recursive: true })
  const audioPath = path.join(audioDir, 'audio.wav')
  log.info('Extracting audio', { videoId, audioPath })
  try {
    await extractAudioForWhisper(sourceAbs, audioPath)
  } catch (e) {
    const msg = `Audio extraction failed: ${(e as Error).message}`
    await updateVideoStatus(videoId, 'FAILED', { progress: 0, message: msg })
    throw new TranscribeError(msg)
  }

  // 2. Run Whisper via Python subprocess.
  await updateVideoStatus(videoId, 'TRANSCRIBING', { progress: 40, message: `Transcribing with ${modelSize} model…` })
  log.info('Running Whisper', { videoId, modelSize, language })

  let whisperResult
  try {
    whisperResult = await runPythonJson<{
      text: string
      language: string
      language_probability: number
      duration: number
      segments: Array<{ id: number; start: number; end: number; text: string; words: unknown[] }>
    }>(TRANSCRIBE_SCRIPT, {
      audio_path: audioPath,
      model_size: modelSize,
      language,
      output_dir: MODELS_DIR,
      word_timestamps: wordTimestamps,
    }, {
      timeoutMs: 20 * 60 * 1000, // 20 min ceiling for long videos
    })
  } catch (e) {
    const stderr = e instanceof SubprocessError ? e.stderr : undefined
    const msg = `Whisper failed: ${(e as Error).message}`
    log.error('Whisper failed', { videoId, stderr: stderr?.slice(0, 500) }, e)
    await updateVideoStatus(videoId, 'FAILED', { progress: 0, message: msg })
    throw new TranscribeError(msg, stderr)
  }

  // 3. Persist transcript.
  await updateVideoStatus(videoId, 'ANALYZING', { progress: 90, message: 'Saving transcript…' })
  const transcript = await createTranscriptRow({
    videoId,
    text: whisperResult.text,
    language: whisperResult.language,
    model: modelSize,
    segments: JSON.stringify(whisperResult.segments),
    duration: whisperResult.duration,
  })

  // 4. Done.
  await updateVideoStatus(videoId, 'READY', { progress: 100, message: null })
  log.info('Transcription complete', {
    videoId,
    transcriptId: transcript.id,
    language: whisperResult.language,
    segments: whisperResult.segments.length,
  })

  // Clean up the intermediate WAV to save disk.
  fs.unlink(audioPath).catch(() => {})

  return {
    transcriptId: transcript.id,
    language: whisperResult.language,
    languageProbability: whisperResult.language_probability,
    duration: whisperResult.duration,
    segmentCount: whisperResult.segments.length,
    textPreview: whisperResult.text.slice(0, 200),
  }
}
