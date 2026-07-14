/**
 * GET /api/videos/[id]/transcript
 *
 * Returns the parsed transcript (segments + words) for a video, or 404 if none.
 */
import { NextRequest } from 'next/server'
import { getTranscript } from '@/server/db/repositories'
import { ok, failNotFound, failInternal } from '@/server/api/responses'

export const dynamic = 'force-dynamic'

interface TranscriptSegment {
  id: number
  start: number
  end: number
  text: string
  words: Array<{ word: string; start: number; end: number; probability: number }>
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const transcript = await getTranscript(id)
    if (!transcript) return failNotFound('Transcript', id)

    let segments: TranscriptSegment[] = []
    try {
      segments = JSON.parse(transcript.segments) as TranscriptSegment[]
    } catch {
      segments = []
    }

    return ok({
      id: transcript.id,
      videoId: transcript.videoId,
      text: transcript.text,
      language: transcript.language,
      model: transcript.model,
      duration: transcript.duration,
      segments,
      createdAt: transcript.createdAt.toISOString(),
      updatedAt: transcript.updatedAt.toISOString(),
    })
  } catch (e) {
    return failInternal('Failed to load transcript', e)
  }
}
