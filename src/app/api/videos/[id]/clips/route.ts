/**
 * POST /api/videos/[id]/clips
 * Generates clips from the video's highlights using FFmpeg.
 *
 * Body (optional):
 *   { "padSeconds": 0.5, "highlightIds": ["id1","id2"], "force": false }
 *
 * Returns the generated (and pre-existing) clips.
 */
import { NextRequest } from 'next/server'
import { z } from 'zod'
import { generateClips, ClipGenerationError } from '@/server/services/clip-generator'
import { ok, fail, failInternal } from '@/server/api/responses'

export const dynamic = 'force-dynamic'
export const maxDuration = 600

const RequestSchema = z.object({
  padSeconds: z.number().min(0).max(10).optional(),
  highlightIds: z.array(z.string()).optional(),
  force: z.boolean().optional(),
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
      // empty body → defaults
    }
    const parsed = RequestSchema.safeParse(body)
    if (!parsed.success) {
      return fail('VALIDATION_ERROR', 'Invalid request body', 422, parsed.error.flatten())
    }
    const result = await generateClips(id, parsed.data)
    return ok(result)
  } catch (e) {
    if (e instanceof ClipGenerationError) {
      return fail('CLIP_FAILED', e.message, 400)
    }
    return failInternal('Clip generation failed', e)
  }
}
