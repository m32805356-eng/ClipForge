/**
 * ClipForge — clip generation service.
 *
 * For each highlight on a video, cuts a clip file from the source using FFmpeg
 * and generates a thumbnail. Persists a Clip row linked to the highlight.
 *
 * Pipeline (per highlight):
 *   1. Compute clip time range (highlight start/end, padded by `padSeconds`)
 *   2. FFmpeg: -ss <start> -to <end> -c copy (fast stream copy when possible)
 *      Falls back to re-encode if the container/codec needs it.
 *   3. FFmpeg: extract a thumbnail at the clip's midpoint
 *   4. Probe the output clip for duration + dimensions + size
 *   5. Persist Clip row (status=READY)
 *
 * All clips are stored under outputs/<videoId>/clips/<clipId>.mp4
 */
import path from 'node:path'
import { promises as fs } from 'node:fs'
import { createId as createCuid } from '@paralleldrive/cuid2'
import { db } from '@/lib/db'
import { listHighlights, getVideo, updateVideoStatus } from '@/server/db/repositories'
import { runFfmpeg, runFfprobe } from '@/lib/clipforge/server/subprocess'
import { extractThumbnail } from '@/lib/clipforge/server/ffmpeg'
import { OUTPUTS_DIR, resolveStoredPath, toStoredPath } from '@/lib/clipforge/paths'
import { logger } from '@/lib/clipforge/server/logger'

const log = logger.scoped('clips')

export interface GenerateClipsOptions {
  /** Pad each clip's start/end by this many seconds (default 0.5). */
  padSeconds?: number
  /** Only generate clips for these highlight IDs (default: all). */
  highlightIds?: string[]
  /** Re-generate clips that already exist (default: false — skip existing). */
  force?: boolean
}

export interface GeneratedClip {
  id: string
  highlightId: string | null
  title: string
  filePath: string
  thumbnail: string | null
  width: number
  height: number
  duration: number
  sizeBytes: number
  status: string
}

export class ClipGenerationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ClipGenerationError'
  }
}

/**
 * Generate clips for all highlights on a video.
 * Returns the list of generated (or pre-existing) clips.
 */
export async function generateClips(
  videoId: string,
  opts: GenerateClipsOptions = {},
): Promise<{ generated: GeneratedClip[]; skipped: number }> {
  const padSeconds = opts.padSeconds ?? 0.5
  const force = opts.force ?? false

  const video = await getVideo(videoId)
  if (!video) throw new ClipGenerationError(`Video not found: ${videoId}`)

  const highlights = await listHighlights(videoId)
  if (highlights.length === 0) {
    throw new ClipGenerationError('No highlights found — run highlight detection first.')
  }

  const targetHighlights = opts.highlightIds
    ? highlights.filter((h) => opts.highlightIds!.includes(h.id))
    : highlights

  if (targetHighlights.length === 0) {
    return { generated: [], skipped: 0 }
  }

  await updateVideoStatus(videoId, 'ANALYZING', { progress: 10, message: `Generating ${targetHighlights.length} clips…` })

  const sourceAbs = resolveStoredPath(video.filePath)
  const clipsDir = path.join(OUTPUTS_DIR, videoId, 'clips')
  await fs.mkdir(clipsDir, { recursive: true })

  // Fetch existing clips to skip unless force=true.
  const existingClips = await db.clip.findMany({ where: { videoId } })
  const existingByHighlight = new Map(
    existingClips.filter((c) => c.highlightId).map((c) => [c.highlightId, c]),
  )

  const generated: GeneratedClip[] = []
  let skipped = 0
  const total = targetHighlights.length

  for (let i = 0; i < total; i++) {
    const h = targetHighlights[i]
    const progress = 10 + Math.round(((i + 1) / total) * 80)
    await updateVideoStatus(videoId, 'ANALYZING', {
      progress,
      message: `Cutting clip ${i + 1}/${total}: ${h.title.slice(0, 40)}`,
    })

    // Skip if already exists and not forced.
    if (!force && existingByHighlight.has(h.id)) {
      const existing = existingByHighlight.get(h.id)!
      log.info('Skipping existing clip', { clipId: existing.id, highlightId: h.id })
      generated.push({
        id: existing.id,
        highlightId: existing.highlightId,
        title: existing.title,
        filePath: existing.filePath,
        thumbnail: existing.thumbnail,
        width: existing.width,
        height: existing.height,
        duration: existing.duration,
        sizeBytes: existing.sizeBytes,
        status: existing.status,
      })
      skipped++
      continue
    }

    // Compute padded time range, clamped to video duration.
    const start = Math.max(0, h.start - padSeconds)
    const end = video.duration ? Math.min(video.duration, h.end + padSeconds) : h.end + padSeconds
    const duration = Math.max(0.5, end - start)
    if (duration < 0.5) {
      log.warn('Skipping highlight with near-zero duration', { highlightId: h.id, start, end })
      continue
    }

    const clipId = createCuid()
    const clipFilename = `${clipId}.mp4`
    const clipAbs = path.join(clipsDir, clipFilename)

    log.info('Cutting clip', {
      clipId,
      highlightId: h.id,
      start,
      end,
      duration,
      title: h.title,
    })

    // Try stream copy first (fast). If that fails (e.g. keyframe misalignment), re-encode.
    try {
      await runFfmpeg([
        '-ss', start.toFixed(3),
        '-i', sourceAbs,
        '-t', duration.toFixed(3),
        '-c', 'copy',
        '-avoid_negative_ts', 'make_zero',
        clipAbs,
      ], { timeoutMs: 60_000 })
    } catch (streamCopyErr) {
      log.warn('Stream copy failed, re-encoding', { clipId, error: (streamCopyErr as Error).message })
      // Remove partial file if any.
      await fs.unlink(clipAbs).catch(() => {})
      await runFfmpeg([
        '-ss', start.toFixed(3),
        '-i', sourceAbs,
        '-t', duration.toFixed(3),
        '-c:v', 'libx264',
        '-preset', 'ultrafast',
        '-crf', '23',
        '-c:a', 'aac',
        '-b:a', '128k',
        '-avoid_negative_ts', 'make_zero',
        clipAbs,
      ], { timeoutMs: 120_000 })
    }

    // Probe the output clip.
    const probeResult = await runFfprobe(['-show_format', '-show_streams', clipAbs], { timeoutMs: 15_000 })
    const probe = JSON.parse(probeResult.stdout || '{}')
    const videoStream = (probe.streams ?? []).find((s: { codec_type?: string }) => s.codec_type === 'video')
    const clipDuration = parseFloat(probe.format?.duration ?? '0') || duration
    const clipWidth = videoStream?.width ?? video.width ?? 0
    const clipHeight = videoStream?.height ?? video.height ?? 0
    const clipSizeBytes = parseInt(probe.format?.size ?? '0', 10) || (await fs.stat(clipAbs)).size

    // Thumbnail at clip midpoint.
    const thumbAbs = path.join(clipsDir, `${clipId}.jpg`)
    try {
      await extractThumbnail(clipAbs, thumbAbs, clipDuration / 2, 480)
    } catch {
      // Non-fatal — clip still usable without thumbnail.
      log.warn('Thumbnail extraction failed for clip', { clipId })
    }
    const thumbStored = (await fs.stat(thumbAbs).then(() => true).catch(() => false))
      ? toStoredPath(thumbAbs)
      : null

    // Persist Clip row.
    const clip = await db.clip.create({
      data: {
        id: clipId,
        videoId,
        highlightId: h.id,
        title: h.title,
        filePath: toStoredPath(clipAbs),
        thumbnail: thumbStored,
        width: clipWidth,
        height: clipHeight,
        duration: clipDuration,
        sizeBytes: clipSizeBytes,
        hasSubtitles: false,
        status: 'READY',
      },
    })

    generated.push({
      id: clip.id,
      highlightId: clip.highlightId,
      title: clip.title,
      filePath: clip.filePath,
      thumbnail: clip.thumbnail,
      width: clip.width,
      height: clip.height,
      duration: clip.duration,
      sizeBytes: clip.sizeBytes,
      status: clip.status,
    })
  }

  await updateVideoStatus(videoId, 'READY', { progress: 100, message: null })
  log.info('Clip generation complete', { videoId, generated: generated.length, skipped })

  return { generated, skipped }
}

/** Delete a single clip: file + thumbnail + DB row. */
export async function deleteClip(clipId: string): Promise<void> {
  const clip = await db.clip.findUnique({ where: { id: clipId } })
  if (!clip) throw new ClipGenerationError(`Clip not found: ${clipId}`)

  const clipAbs = resolveStoredPath(clip.filePath)
  await fs.unlink(clipAbs).catch(() => {})

  if (clip.thumbnail) {
    const thumbAbs = resolveStoredPath(clip.thumbnail)
    await fs.unlink(thumbAbs).catch(() => {})
  }

  await db.clip.delete({ where: { id: clipId } })
  log.info('Deleted clip', { clipId })
}
