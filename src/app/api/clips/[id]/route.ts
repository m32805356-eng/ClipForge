/**
 * DELETE /api/clips/[id]
 * Removes a clip file, its thumbnail, and its DB record.
 */
import { NextRequest } from 'next/server'
import { deleteClip, ClipGenerationError } from '@/server/services/clip-generator'
import { ok, fail, failInternal } from '@/server/api/responses'

export const dynamic = 'force-dynamic'

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    await deleteClip(id)
    return ok({ id, deleted: true })
  } catch (e) {
    if (e instanceof ClipGenerationError) {
      return fail('NOT_FOUND', e.message, 404)
    }
    return failInternal('Failed to delete clip', e)
  }
}
