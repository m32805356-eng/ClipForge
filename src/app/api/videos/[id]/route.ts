/**
 * GET /api/videos/[id]
 * Returns a single video with transcript, highlights, and clips.
 *
 * DELETE /api/videos/[id]
 * Removes the video file, outputs dir, and DB record.
 */
import { NextRequest } from 'next/server'
import { getVideo, deleteVideo } from '@/server/db/repositories'
import { removeVideoCompletely } from '@/server/services/video-upload'
import { ok, fail, failInternal, failNotFound } from '@/server/api/responses'

export const dynamic = 'force-dynamic'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const video = await getVideo(id)
    if (!video) return failNotFound('Video', id)

    return ok({
      id: video.id,
      filename: video.filename,
      storageName: video.storageName,
      filePath: video.filePath,
      mimeType: video.mimeType,
      sizeBytes: video.sizeBytes,
      duration: video.duration,
      width: video.width,
      height: video.height,
      thumbnail: video.thumbnail,
      status: video.status,
      progress: video.progress,
      message: video.message,
      createdAt: video.createdAt.toISOString(),
      updatedAt: video.updatedAt.toISOString(),
      transcript: video.transcript
        ? {
            id: video.transcript.id,
            text: video.transcript.text,
            language: video.transcript.language,
            segments: video.transcript.segments,
            duration: video.transcript.duration,
          }
        : null,
      highlights: video.highlights.map((h) => ({
        id: h.id,
        start: h.start,
        end: h.end,
        title: h.title,
        reasoning: h.reasoning,
        category: h.category,
        score: h.score,
        excerpt: h.excerpt,
      })),
      clips: video.clips.map((c) => ({
        id: c.id,
        title: c.title,
        filePath: c.filePath,
        thumbnail: c.thumbnail,
        width: c.width,
        height: c.height,
        duration: c.duration,
        sizeBytes: c.sizeBytes,
        hasSubtitles: c.hasSubtitles,
        subtitleStyle: c.subtitleStyle,
        status: c.status,
        createdAt: c.createdAt.toISOString(),
      })),
    })
  } catch (e) {
    return failInternal('Failed to load video', e)
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const video = await getVideo(id)
    if (!video) return failNotFound('Video', id)

    await removeVideoCompletely(video.id, video.filePath)
    await deleteVideo(video.id)
    return ok({ id, deleted: true })
  } catch (e) {
    return failInternal('Failed to delete video', e)
  }
}
