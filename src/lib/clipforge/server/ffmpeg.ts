/**
 * ClipForge — FFmpeg / ffprobe domain helpers.
 *
 * Thin wrappers that turn raw subprocess output into typed domain objects.
 * All time values are seconds (float).
 */
import { runFfmpeg, runFfprobe } from './subprocess'

export interface ProbeResult {
  duration: number
  width: number
  height: number
  codec: string
  fps: number
  bitrate: number
  hasAudio: boolean
  /** Pretty format string from ffprobe. */
  formatLong: string
}

interface FfprobeOutput {
  streams?: Array<{
    codec_type?: string
    codec_name?: string
    width?: number
    height?: number
    avg_frame_rate?: string
    r_frame_rate?: string
    bit_rate?: string
  }>
  format?: {
    duration?: string
    bit_rate?: string
    format_long_name?: string
  }
}

function parseFps(rate: string | undefined): number {
  if (!rate) return 0
  const [num, den] = rate.split('/').map(Number)
  if (!den || den === 0) return 0
  return num / den
}

/** Probe a video file for duration, dimensions, codec, audio presence. */
export async function probeVideo(filePath: string): Promise<ProbeResult> {
  const result = await runFfprobe([
    '-show_format',
    '-show_streams',
    filePath,
  ])
  const data: FfprobeOutput = JSON.parse(result.stdout || '{}')
  const videoStream = data.streams?.find((s) => s.codec_type === 'video')
  const audioStream = data.streams?.find((s) => s.codec_type === 'audio')

  return {
    duration: parseFloat(data.format?.duration ?? '0') || 0,
    width: videoStream?.width ?? 0,
    height: videoStream?.height ?? 0,
    codec: videoStream?.codec_name ?? 'unknown',
    fps: parseFps(videoStream?.avg_frame_rate || videoStream?.r_frame_rate),
    bitrate: parseInt(data.format?.bit_rate ?? '0', 10) || 0,
    hasAudio: !!audioStream,
    formatLong: data.format?.format_long_name ?? 'unknown',
  }
}

/** Extract a single thumbnail at `atSeconds` into outPath. */
export async function extractThumbnail(
  inputPath: string,
  outPath: string,
  atSeconds = 1,
  width = 640,
): Promise<void> {
  await runFfmpeg([
    '-ss', String(Math.max(0, atSeconds)),
    '-i', inputPath,
    '-frames:v', '1',
    '-vf', `scale=${width}:-2`,
    '-q:v', '3',
    outPath,
  ])
}

/** Extract audio to a 16kHz mono WAV (Whisper's expected input). */
export async function extractAudioForWhisper(
  inputPath: string,
  outPath: string,
): Promise<void> {
  await runFfmpeg([
    '-i', inputPath,
    '-vn',
    '-ac', '1',
    '-ar', '16000',
    '-c:a', 'pcm_s16le',
    outPath,
  ])
}
