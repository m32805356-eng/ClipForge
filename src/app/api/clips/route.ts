/**
 * GET /api/clips
 * Lists all clips across all videos, newest first.
 *
 * Query params:
 *   page, pageSize, status (optional), videoId (optional filter)
 */
import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { ok, failInternal } from '@/server/api/responses'
import type { Prisma } from '@prisma/client'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const page = Math.max(1, parseInt(url.searchParams.get('page') ?? '1', 10))
    const pageSize = Math.min(100, Math.max(1, parseInt(url.searchParams.get('pageSize') ?? '50', 10)))
    const status = url.searchParams.get('status') ?? undefined
    const videoId = url.searchParams.get('videoId') ?? undefined

    const where: Prisma.ClipWhereInput = {}
    if (status) where.status = status as Prisma.ClipWhereInput['status']
    if (videoId) where.videoId = videoId

    const [items, total] = await Promise.all([
      db.clip.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          video: { select: { id: true, filename: true, thumbnail: true } },
          highlight: { select: { id: true, category: true, score: true } },
        },
      }),
      db.clip.count({ where }),
    ])

    return ok({
      items: items.map((c) => ({
        id: c.id,
        videoId: c.videoId,
        highlightId: c.highlightId,
        title: c.title,
        filePath: c.filePath,
        thumbnail: c.thumbnail,
        width: c.width,
        height: c.height,
        duration: c.duration,
        sizeBytes: c.sizeBytes,
        hasSubtitles: c.hasSubtitles,
        subtitleStyle: c.subtitleStyle,
        status: c.status,
        createdAt: c.createdAt.toISOString(),
        video: c.video,
        highlight: c.highlight,
      })),
      total,
      page,
      pageSize,
    })
  } catch (e) {
    return failInternal('Failed to list clips', e)
  }
}
