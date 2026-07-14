/**
 * POST /api/videos/[id]/highlights
 * Runs heuristic highlight detection on the video's transcript.
 *
 * Body (optional):
 *   { "maxHighlights": 12, "minScore": 0.25 }
 *
 * Returns the detected highlights (also persisted to DB).
 */
import { NextRequest } from 'next/server'
import { z } from 'zod'
import { detectHighlights, HighlightError } from '@/server/services/highlight-detection'
import { ok, fail, failInternal } from '@/server/api/responses'

export const dynamic = 'force-dynamic'
export const maxDuration = 120

const RequestSchema = z.object({
  maxHighlights: z.number().int().min(1).max(50).optional(),
  minScore: z.number().min(0).max(1).optional(),
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
    const result = await detectHighlights(id, parsed.data)
    return ok(result)
  } catch (e) {
    if (e instanceof HighlightError) {
      return fail('HIGHLIGHT_FAILED', e.message, 400)
    }
    return failInternal('Highlight detection failed', e)
  }
}
