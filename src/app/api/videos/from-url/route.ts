/**
 * POST /api/videos/from-url
 * Downloads a video from a URL (YouTube, Vimeo, etc.) via yt-dlp.
 *
 * Body:
 *   { "url": "https://youtube.com/watch?v=..." }
 *
 * Returns the created video record (same shape as file upload).
 */
import { NextRequest } from 'next/server'
import { z } from 'zod'
import { downloadVideoFromUrl, UrlDownloadError } from '@/server/services/url-download'
import { ok, fail, failInternal } from '@/server/api/responses'

export const dynamic = 'force-dynamic'
export const maxDuration = 600

const RequestSchema = z.object({
  url: z.string().url(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = RequestSchema.safeParse(body)
    if (!parsed.success) {
      return fail('VALIDATION_ERROR', 'Invalid request body', 422, parsed.error.flatten())
    }
    const result = await downloadVideoFromUrl(parsed.data.url)
    return ok(result, 201)
  } catch (e) {
    if (e instanceof UrlDownloadError) {
      return fail(
        'DOWNLOAD_FAILED',
        e.message,
        400,
        e.stderr ? { stderr: e.stderr.slice(0, 1000) } : undefined,
      )
    }
    return failInternal('URL download failed', e)
  }
}
