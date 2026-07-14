/**
 * POST /api/videos/[id]/transcribe
 *
 * Body (optional):
 *   { "modelSize": "base", "language": null, "wordTimestamps": true }
 *
 * Triggers the full transcription pipeline:
 *   extract audio → run Whisper (Python) → persist transcript → mark video READY
 *
 * This is a long-running operation (10s–10min depending on video length + model).
 * Returns the transcript summary on completion.
 */
import { NextRequest } from 'next/server'
import { z } from 'zod'
import { transcribeVideo, TranscribeError } from '@/server/services/transcription'
import { getVideo } from '@/server/db/repositories'
import { ok, fail, failInternal, failNotFound } from '@/server/api/responses'

export const dynamic = 'force-dynamic'
export const maxDuration = 1200 // 20 min ceiling

const RequestSchema = z.object({
  modelSize: z.enum(['tiny', 'base', 'small', 'medium', 'large-v3']).optional(),
  language: z.string().length(2).nullable().optional(),
  wordTimestamps: z.boolean().optional(),
})

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const video = await getVideo(id)
    if (!video) return failNotFound('Video', id)

    let body: unknown = {}
    try {
      body = await req.json()
    } catch {
      // Empty body is fine; defaults will be used.
    }
    const parsed = RequestSchema.safeParse(body)
    if (!parsed.success) {
      return fail('VALIDATION_ERROR', 'Invalid request body', 422, parsed.error.flatten())
    }

    const result = await transcribeVideo(id, parsed.data)
    return ok(result)
  } catch (e) {
    if (e instanceof TranscribeError) {
      return fail('TRANSCRIBE_FAILED', e.message, 500, e.stderr ? { stderr: e.stderr.slice(0, 1000) } : undefined)
    }
    return failInternal('Transcription failed', e)
  }
}
