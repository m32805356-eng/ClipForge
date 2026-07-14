/**
 * POST /api/clips/[id]/subtitles
 * Burns subtitles into a clip using the specified style.
 *
 * Body (optional):
 *   { "style": "bold-white" }  // bold-white | karaoke | neon-amber | minimal
 */
import { NextRequest } from 'next/server'
import { z } from 'zod'
import { burnSubtitlesIntoClip, SubtitleError } from '@/server/services/subtitle-generator'
import { ok, fail, failInternal } from '@/server/api/responses'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

const RequestSchema = z.object({
  style: z.enum(['bold-white', 'karaoke', 'neon-amber', 'minimal']).optional(),
})

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    let body: unknown = {}
    try {
      body = await req.json()
    } catch {
      // empty body → default style
    }
    const parsed = RequestSchema.safeParse(body)
    if (!parsed.success) {
      return fail('VALIDATION_ERROR', 'Invalid request body', 422, parsed.error.flatten())
    }
    const style = parsed.data.style ?? 'bold-white'
    const result = await burnSubtitlesIntoClip(id, style)
    return ok(result)
  } catch (e) {
    if (e instanceof SubtitleError) {
      return fail('SUBTITLE_FAILED', e.message, 400)
    }
    return failInternal('Subtitle generation failed', e)
  }
}
