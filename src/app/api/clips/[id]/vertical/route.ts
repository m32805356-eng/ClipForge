/**
 * POST /api/clips/[id]/vertical
 * Crops a clip to 1080x1920 vertical format (center crop + scale).
 */
import { NextRequest } from 'next/server'
import { cropClipVertical, VerticalCropError } from '@/server/services/vertical-crop'
import { ok, fail, failInternal } from '@/server/api/responses'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const result = await cropClipVertical(id)
    return ok(result)
  } catch (e) {
    if (e instanceof VerticalCropError) {
      return fail('VERTICAL_FAILED', e.message, 400)
    }
    return failInternal('Vertical crop failed', e)
  }
}
