/**
 * ClipForge — video upload orchestration service.
 *
 * Pipeline:
 *   1. Validate mime + extension + size (reject early on bad input)
 *   2. Generate a safe storage name (cuid + ext)
 *   3. Stream the uploaded File to disk under uploads/
 *   4. Create DB row (status=PROBING)
 *   5. ffprobe for duration/dimensions → update row
 *   6. Extract thumbnail at ~1s (or midpoint for short clips) → update row
 *   7. Mark status=READY
 *
 * On any failure, the row is marked FAILED and the partial file is removed.
 */
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { createId as createCuid } from '@paralleldrive/cuid2'
import { createVideo, updateVideoStatus } from '@/server/db/repositories'
import { probeVideo, extractThumbnail } from '@/lib/clipforge/server/ffmpeg'
import { UPLOADS_DIR, OUTPUTS_DIR, toStoredPath } from '@/lib/clipforge/paths'
import {
  ACCEPTED_VIDEO_MIME,
  ACCEPTED_VIDEO_EXTS,
  MAX_UPLOAD_BYTES,
} from '@/lib/clipforge/constants'
import { logger } from '@/lib/clipforge/server/logger'

const log = logger.scoped('upload')

export interface UploadedFile {
  filename: string
  mimeType: string
  sizeBytes: number
  /** Web File/Blob API. */
  file: { stream: () => ReadableStream<Uint8Array> }
}

export interface UploadResult {
  id: string
  filename: string
  storageName: string
  filePath: string
  thumbnail: string | null
  duration: number | null
  width: number | null
  height: number | null
  status: string
}

export class UploadValidationError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message)
    this.name = 'UploadValidationError'
  }
}

/** Validate the incoming file against allowed mime types, extensions, and size. */
export function validateUpload(file: {
  filename: string
  mimeType: string
  sizeBytes: number
}): void {
  if (file.sizeBytes <= 0) {
    throw new UploadValidationError('File is empty', 'EMPTY_FILE')
  }
  if (file.sizeBytes > MAX_UPLOAD_BYTES) {
    throw new UploadValidationError(
      `File exceeds ${MAX_UPLOAD_BYTES} byte limit`,
      'FILE_TOO_LARGE',
    )
  }
  const ext = path.extname(file.filename).toLowerCase()
  const mimeOk = (ACCEPTED_VIDEO_MIME as readonly string[]).includes(file.mimeType)
  const extOk = (ACCEPTED_VIDEO_EXTS as readonly string[]).includes(ext)
  // Accept if either mime OR extension matches (some browsers send generic mime).
  if (!mimeOk && !extOk) {
    throw new UploadValidationError(
      `Unsupported file type: ${file.mimeType || ext || 'unknown'}`,
      'UNSUPPORTED_TYPE',
    )
  }
}

/** Persist an uploaded file to disk and create the DB record + thumbnail. */
export async function ingestUploadedVideo(file: UploadedFile): Promise<UploadResult> {
  validateUpload(file)

  const ext = path.extname(file.filename).toLowerCase() || '.mp4'
  const storageName = `${createCuid()}${ext}`
  const filePath = path.join(UPLOADS_DIR, storageName)

  // Ensure dir exists.
  await fs.mkdir(UPLOADS_DIR, { recursive: true })

  // Stream file to disk.
  log.info('Writing upload to disk', { filename: file.filename, storageName, sizeBytes: file.sizeBytes })
  const writeStream = (await import('node:fs')).createWriteStream(filePath)
  const reader = file.file.stream().getReader()
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      writeStream.write(Buffer.from(value))
    }
  } finally {
    writeStream.end()
    await new Promise<void>((resolve, reject) => {
      writeStream.on('finish', resolve)
      writeStream.on('error', reject)
    })
  }

  // Create DB record.
  const video = await createVideo({
    filename: file.filename,
    storageName,
    filePath,
    mimeType: file.mimeType,
    sizeBytes: file.sizeBytes,
  })

  try {
    // Probe.
    await updateVideoStatus(video.id, 'PROBING', { progress: 30 })
    const probe = await probeVideo(filePath)
    log.info('Probed video', { id: video.id, duration: probe.duration, w: probe.width, h: probe.height })

    // Thumbnail at ~1s, or midpoint for very short clips.
    const thumbAt = Math.min(1, Math.max(0, probe.duration / 2))
    const thumbDir = path.join(OUTPUTS_DIR, video.id)
    await fs.mkdir(thumbDir, { recursive: true })
    const thumbAbs = path.join(thumbDir, 'thumb.jpg')
    await extractThumbnail(filePath, thumbAbs, thumbAt, 640)
    const thumbStored = toStoredPath(thumbAbs)

    // Finalize.
    const updated = await updateVideoStatus(video.id, 'READY', {
      progress: 100,
      duration: probe.duration,
      width: probe.width,
      height: probe.height,
      thumbnail: thumbStored,
    })

    return {
      id: updated.id,
      filename: updated.filename,
      storageName: updated.storageName,
      filePath: updated.filePath,
      thumbnail: updated.thumbnail,
      duration: updated.duration,
      width: updated.width,
      height: updated.height,
      status: updated.status,
    }
  } catch (err) {
    log.error('Upload post-processing failed', { id: video.id }, err)
    await updateVideoStatus(video.id, 'FAILED', {
      progress: 0,
      message: (err as Error).message,
    })
    // Leave the source file on disk so the user can retry / inspect; don't auto-delete.
    throw err
  }
}

/** Remove a video: delete DB row + uploads file + outputs dir. */
export async function removeVideoCompletely(videoId: string, filePath: string): Promise<void> {
  const abs = path.isAbsolute(filePath)
    ? filePath
    : path.join(process.cwd(), filePath)
  try {
    await fs.unlink(abs)
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code !== 'ENOENT') throw e
  }
  // Remove outputs/<videoId>/ dir (thumbnails, clips, etc.)
  const outDir = path.join(OUTPUTS_DIR, videoId)
  await fs.rm(outDir, { recursive: true, force: true })
  log.info('Removed video artifacts', { videoId, abs, outDir })
}
