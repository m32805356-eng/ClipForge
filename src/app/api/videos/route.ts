/**
 * GET /api/videos
 * Lists source videos with optional pagination, status filter, and search.
 *
 * Query params:
 *   page      int   default 1
 *   pageSize  int   default 20  (max 100)
 *   status    enum  optional VideoStatus
 *   search    str   optional filename substring
 *
 * POST /api/videos
 * Multipart form upload. Field name: "file". Validates type/size, streams to
 * disk, probes with ffprobe, extracts a thumbnail, and creates the DB record.
 */
import { NextRequest } from 'next/server'
import { listVideos, deleteVideo, getVideo } from '@/server/db/repositories'
import { ok, fail, failZod, failInternal } from '@/server/api/responses'
import { VideoListQuerySchema } from '@/types/clipforge/api-schemas'
import {
  ingestUploadedVideo,
  validateUpload,
  UploadValidationError,
  removeVideoCompletely,
} from '@/server/services/video-upload'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const params = Object.fromEntries(url.searchParams.entries())
    const parsed = VideoListQuerySchema.safeParse(params)
    if (!parsed.success) return failZod(parsed.error)

    const result = await listVideos(parsed.data)
    return ok(result)
  } catch (e) {
    return failInternal('Failed to list videos', e)
  }
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const file = form.get('file')

    if (!file || !(file instanceof File)) {
      return fail('MISSING_FILE', 'No "file" field in multipart form data', 400)
    }

    // Pre-validate before ingesting (gives clean error messages).
    try {
      validateUpload({
        filename: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
      })
    } catch (e) {
      if (e instanceof UploadValidationError) {
        return fail(e.code, e.message, 422)
      }
      throw e
    }

    const result = await ingestUploadedVideo({
      filename: file.name,
      mimeType: file.type,
      sizeBytes: file.size,
      file: { stream: () => file.stream() },
    })

    return ok(result, 201)
  } catch (e) {
    return failInternal('Upload failed', e)
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const id = url.searchParams.get('id')
    if (!id) return fail('MISSING_ID', 'Query param "id" is required', 400)

    const video = await getVideo(id)
    if (!video) return fail('NOT_FOUND', `Video not found: ${id}`, 404)

    await removeVideoCompletely(video.id, video.filePath)
    await deleteVideo(video.id)
    return ok({ id, deleted: true })
  } catch (e) {
    return failInternal('Failed to delete video', e)
  }
}
