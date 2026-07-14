/**
 * POST /api/videos/[id]/highlights
 * Runs heuristic highlight detection on the video's transcript.
 *
 * Body (optional):
 *   {
 *     "maxHighlights": 12,
 *     "minScore": 0.25,
 *     "customPrompt": "Find the emotional moments",
 *     "targetDuration": "30-60"  // "under-30" | "30-60" | "60-plus"
 *   }
 *
 * - customPrompt: free-text instructions from the user. Segments matching the
 *   prompt's keywords get an extra score boost and are included in the results.
 * - targetDuration: adjusts highlight boundaries to fit the target range:
 *     under-30 → 15-29s, 30-60 → 30-60s, 60-plus → 60-90s.
 *   Boundaries snap to sentence (segment) edges while staying within range.
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
  customPrompt: z.string().max(500).optional(),
  targetDuration: z.enum(['under-30', '30-60', '60-plus']).optional(),
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
