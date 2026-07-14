/**
 * GET /api/health
 * Returns aggregated system health: database, ffmpeg, ffprobe, python, whisper, disk.
 */
import { NextRequest } from 'next/server'
import { checkHealth } from '@/server/services/health'
import { ok, failInternal } from '@/server/api/responses'

export const dynamic = 'force-dynamic'

export async function GET(_req: NextRequest) {
  try {
    const result = await checkHealth()
    return ok(result)
  } catch (e) {
    return failInternal('Health check failed', e)
  }
}
