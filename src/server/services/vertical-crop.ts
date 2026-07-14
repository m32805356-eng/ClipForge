/**
 * ClipForge — vertical crop service.
 *
 * Crops a clip to 1080x1920 vertical format for social media (TikTok, Reels, Shorts).
 *
 * Approach:
 *   - If source is wider than 9:16 → center-crop horizontally (keep full height,
 *     crop sides). This is the safest default for talking-head content.
 *   - If source is taller than 9:16 → center-crop vertically (rare for video).
 *   - If source is exactly 9:16 → just scale.
 *   - Final output: scaled to exactly 1080x1920, H.264 + AAC, faststart.
 *
 * Preserves any burned-in subtitles (they're already in the frame pixels).
 *
 * For a future enhancement: MediaPipe face tracking to keep the speaker centered
 * even when they move. For now, center crop is a robust baseline.
 */
import path from 'node:path'
import { promises as fs } from 'node:fs'
import { db } from '@/lib/db'
import { runFfmpeg, runFfprobe } from '@/lib/clipforge/server/subprocess'
import { resolveStoredPath } from '@/lib/clipforge/paths'
import { VERTICAL_WIDTH, VERTICAL_HEIGHT } from '@/lib/clipforge/constants'
import { logger } from '@/lib/clipforge/server/logger'

const log = logger.scoped('vertical-crop')

const TARGET_W = VERTICAL_WIDTH // 1080
const TARGET_H = VERTICAL_HEIGHT // 1920
const TARGET_RATIO = TARGET_W / TARGET_H // 9:16 ≈ 0.5625

export class VerticalCropError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'VerticalCropError'
  }
}

/**
 * Crop a clip to 1080x1920 vertical format.
 * Replaces the clip file in place (the original horizontal version is overwritten).
 */
export async function cropClipVertical(clipId: string): Promise<{
  id: string
  width: number
  height: number
  sizeBytes: number
  duration: number
}> {
  const clip = await db.clip.findUnique({ where: { id: clipId } })
  if (!clip) throw new VerticalCropError(`Clip not found: ${clipId}`)

  const clipAbs = resolveStoredPath(clip.filePath)
  const clipDir = path.dirname(clipAbs)
  const tempOutput = path.join(clipDir, `${clipId}_vertical.mp4`)

  // Probe source to get current dimensions.
  const probeResult = await runFfprobe(['-show_streams', clipAbs], { timeoutMs: 15_000 })
  const probe = JSON.parse(probeResult.stdout || '{}')
  const videoStream = (probe.streams ?? []).find((s: { codec_type?: string }) => s.codec_type === 'video')
  const srcW = videoStream?.width ?? clip.width ?? 0
  const srcH = videoStream?.height ?? clip.height ?? 0
  if (!srcW || !srcH) {
    throw new VerticalCropError(`Could not determine clip dimensions for ${clipId}`)
  }

  // Compute crop rectangle.
  // We want to extract a 9:16 region from the source, then scale to 1080x1920.
  const srcRatio = srcW / srcH
  let cropW: number
  let cropH: number

  if (srcRatio > TARGET_RATIO) {
    // Source is wider than 9:16 → crop width (keep full height).
    cropH = srcH
    cropW = Math.round(srcH * TARGET_RATIO)
    // Ensure even dimensions (required by many codecs).
    cropW = cropW - (cropW % 2)
  } else if (srcRatio < TARGET_RATIO) {
    // Source is taller than 9:16 → crop height (keep full width).
    cropW = srcW
    cropH = Math.round(srcW / TARGET_RATIO)
    cropH = cropH - (cropH % 2)
  } else {
    // Already 9:16 → no crop needed.
    cropW = srcW
    cropH = srcH
  }

  // Center the crop.
  const cropX = Math.round((srcW - cropW) / 2)
  const cropY = Math.round((srcH - cropH) / 2)

  log.info('Cropping clip to vertical', {
    clipId,
    src: `${srcW}x${srcH}`,
    crop: `${cropW}x${cropH}+${cropX}+${cropY}`,
    target: `${TARGET_W}x${TARGET_H}`,
  })

  // Build filter chain: crop first, then scale to exact target.
  // Using crop + scale ensures pixel-perfect 1080x1920 output.
  const vf = `crop=${cropW}:${cropH}:${cropX}:${cropY},scale=${TARGET_W}:${TARGET_H}:flags=lanczos`

  await runFfmpeg([
    '-i', clipAbs,
    '-vf', vf,
    '-c:v', 'libx264',
    '-preset', 'medium',
    '-crf', '23',
    '-pix_fmt', 'yuv420p',
    '-c:a', 'aac',
    '-b:a', '128k',
    '-movflags', '+faststart',
    '-y',
    tempOutput,
  ], { timeoutMs: 180_000 })

  // Replace original.
  await fs.unlink(clipAbs)
  await fs.rename(tempOutput, clipAbs)

  // Probe new size + confirm dimensions.
  const newProbeResult = await runFfprobe(['-show_format', '-show_streams', clipAbs], { timeoutMs: 15_000 })
  const newProbe = JSON.parse(newProbeResult.stdout || '{}')
  const newSize = parseInt(newProbe.format?.size ?? '0', 10) || (await fs.stat(clipAbs)).size
  const newDuration = parseFloat(newProbe.format?.duration ?? '0') || clip.duration

  // Update DB.
  const updated = await db.clip.update({
    where: { id: clipId },
    data: {
      width: TARGET_W,
      height: TARGET_H,
      sizeBytes: newSize,
      duration: newDuration,
    },
  })

  // Regenerate thumbnail at new aspect ratio.
  try {
    const thumbAbs = path.join(clipDir, `${clipId}.jpg`)
    await runFfmpeg([
      '-ss', String(Math.min(1, newDuration / 2)),
      '-i', clipAbs,
      '-frames:v', '1',
      '-vf', `scale=${TARGET_W / 3}:${TARGET_H / 3}`,
      '-q:v', '3',
      thumbAbs,
    ], { timeoutMs: 30_000 })
    log.info('Regenerated vertical thumbnail', { clipId })
  } catch (e) {
    log.warn('Thumbnail regeneration failed (non-fatal)', { clipId, error: (e as Error).message })
  }

  log.info('Vertical crop complete', {
    clipId,
    newSize,
    dimensions: `${TARGET_W}x${TARGET_H}`,
  })

  return {
    id: updated.id,
    width: updated.width,
    height: updated.height,
    sizeBytes: updated.sizeBytes,
    duration: updated.duration,
  }
}
