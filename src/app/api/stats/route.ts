/**
 * GET /api/stats
 * Returns aggregated dashboard stats: video/clip/highlight counts + storage.
 */
import { NextRequest } from 'next/server'
import { getDashboardStats } from '@/server/db/repositories'
import { ok, failInternal } from '@/server/api/responses'

export const dynamic = 'force-dynamic'

export async function GET(_req: NextRequest) {
  try {
    const stats = await getDashboardStats()
    return ok(stats)
  } catch (e) {
    return failInternal('Failed to load stats', e)
  }
}
