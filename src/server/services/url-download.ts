/**
 * ClipForge — URL download service.
 *
 * Downloads a video from a URL (YouTube, Vimeo, etc.) using yt-dlp (Python),
 * then runs the same ingest pipeline as file upload: probe → thumbnail → DB.
 */
import path from 'node:path'
import { promises as fs } from 'node:fs'
import { createId as createCuid } from '@paralleldrive/cuid2'
import { createVideo, updateVideoStatus } from '@/server/db/repositories'
import { probeVideo, extractThumbnail } from '@/lib/clipforge/server/ffmpeg'
import { runPythonJson, SubprocessError } from '@/lib/clipforge/server/subprocess'
import { UPLOADS_DIR, OUTPUTS_DIR, toStoredPath } from '@/lib/clipforge/paths'
import { logger } from '@/lib/clipforge/server/logger'

const log = logger.scoped('url-download')

const SCRIPTS_DIR = path.join(process.cwd(), 'scripts')
const DOWNLOAD_SCRIPT = path.join(SCRIPTS_DIR, 'download_url.py')

export interface UrlDownloadResult {
  id: string
  filename: string
  storageName: string
  filePath: string
  thumbnail: string | null
  duration: number | null
  width: number | null
  height: number | null
  status: string
  title: string
  uploader: string
}

export class UrlDownloadError extends Error {
  constructor(message: string, public readonly stderr?: string) {
    super(message)
    this.name = 'UrlDownloadError'
  }
}

/**
 * Download a video from a URL and ingest it into the ClipForge library.
 */
export async function downloadVideoFromUrl(url: string): Promise<UrlDownloadResult> {
  // Validate URL.
  try {
    new URL(url)
  } catch {
    throw new UrlDownloadError(`Invalid URL: ${url}`)
  }

  log.info('Downloading video from URL', { url })

  // Download via Python yt-dlp.
  let downloadResult
  try {
    downloadResult = await runPythonJson<{
      filePath: string
      filename: string
      title: string
      duration: number
      uploader: string
      viewCount: number
      description: string
    }>(DOWNLOAD_SCRIPT, { url, output_dir: UPLOADS_DIR }, {
      timeoutMs: 10 * 60 * 1000, // 10 min ceiling
    })
  } catch (e) {
    const stderr = e instanceof SubprocessError ? e.stderr : undefined
    const msg = `Download failed: ${(e as Error).message}`
    log.error('URL download failed', { url, stderr: stderr?.slice(0, 500) }, e)
    throw new UrlDownloadError(msg, stderr)
  }

  // The downloaded file is already in UPLOADS_DIR, but with yt-dlp's filename.
  // Rename it to a safe cuid-based name for consistency.
  const downloadedAbs = downloadResult.filePath
  const ext = path.extname(downloadedAbs).toLowerCase() || '.mp4'
  const storageName = `${createCuid()}${ext}`
  const finalAbs = path.join(UPLOADS_DIR, storageName)
  await fs.rename(downloadedAbs, finalAbs)

  // Create DB record.
  const video = await createVideo({
    filename: downloadResult.title || downloadResult.filename,
    storageName,
    filePath: finalAbs,
    mimeType: 'video/mp4',
    sizeBytes: (await fs.stat(finalAbs)).size,
  })

  try {
    // Probe.
    await updateVideoStatus(video.id, 'PROBING', { progress: 30 })
    const probe = await probeVideo(finalAbs)
    log.info('Probed downloaded video', {
      id: video.id,
      duration: probe.duration,
      w: probe.width,
      h: probe.height,
    })

    // Thumbnail.
    const thumbAt = Math.min(1, Math.max(0, probe.duration / 2))
    const thumbDir = path.join(OUTPUTS_DIR, video.id)
    await fs.mkdir(thumbDir, { recursive: true })
    const thumbAbs = path.join(thumbDir, 'thumb.jpg')
    await extractThumbnail(finalAbs, thumbAbs, thumbAt, 640)
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
      title: downloadResult.title,
      uploader: downloadResult.uploader,
    }
  } catch (err) {
    log.error('Post-download processing failed', { id: video.id }, err)
    await updateVideoStatus(video.id, 'FAILED', {
      progress: 0,
      message: (err as Error).message,
    })
    throw err
  }
}
