/**
 * ClipForge — Prisma repository helpers.
 *
 * Centralizes all DB access so API routes stay thin and the query surface
 * is easy to audit. Each repo function is pure (no side effects beyond DB)
 * and returns plain data (no Prisma model instances leaking).
 */
import { db } from '@/lib/db'
import { Prisma, type VideoStatus } from '@prisma/client'
import { toStoredPath } from '@/lib/clipforge/paths'
import { logger } from '@/lib/clipforge/server/logger'

const log = logger.scoped('repo')

/** ---------- Videos ---------- */

export interface CreateVideoInput {
  filename: string
  storageName: string
  filePath: string // absolute
  mimeType: string
  sizeBytes: number
}

export async function createVideo(input: CreateVideoInput) {
  const filePath = toStoredPath(input.filePath)
  log.info('Creating video record', { filename: input.filename, filePath })
  return db.video.create({
    data: {
      filename: input.filename,
      storageName: input.storageName,
      filePath,
      mimeType: input.mimeType,
      sizeBytes: input.sizeBytes,
      status: 'UPLOADED',
    },
  })
}

export async function getVideo(id: string) {
  return db.video.findUnique({
    where: { id },
    include: {
      transcript: true,
      highlights: { orderBy: { start: 'asc' } },
      clips: { orderBy: { createdAt: 'desc' } },
    },
  })
}

export async function updateVideoStatus(
  id: string,
  status: VideoStatus,
  patch: Partial<{ progress: number; message: string | null; duration: number; width: number; height: number; thumbnail: string | null }> = {},
) {
  return db.video.update({
    where: { id },
    data: { status, ...patch },
  })
}

export interface ListVideosOptions {
  page: number
  pageSize: number
  status?: VideoStatus
  search?: string
}

export async function listVideos(opts: ListVideosOptions) {
  const where: Prisma.VideoWhereInput = {}
  if (opts.status) where.status = opts.status
  if (opts.search) {
    where.filename = { contains: opts.search }
  }
  const [items, total] = await Promise.all([
    db.video.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (opts.page - 1) * opts.pageSize,
      take: opts.pageSize,
      include: {
        _count: { select: { clips: true } },
      },
    }),
    db.video.count({ where }),
  ])
  return {
    items: items.map((v) => ({
      id: v.id,
      filename: v.filename,
      sizeBytes: v.sizeBytes,
      duration: v.duration,
      width: v.width,
      height: v.height,
      thumbnail: v.thumbnail,
      status: v.status,
      progress: v.progress,
      message: v.message,
      clipCount: v._count.clips,
      createdAt: v.createdAt.toISOString(),
    })),
    total,
    page: opts.page,
    pageSize: opts.pageSize,
  }
}

export async function deleteVideo(id: string) {
  return db.video.delete({ where: { id } })
}

/** ---------- Transcripts ---------- */

export interface CreateTranscriptInput {
  videoId: string
  text: string
  language: string | null
  model: string | null
  segments: string // JSON string of segments array
  duration: number | null
}

export async function createTranscriptRow(input: CreateTranscriptInput) {
  log.info('Creating transcript row', { videoId: input.videoId, language: input.language })
  // Upsert so re-transcribing replaces the old transcript.
  return db.transcript.upsert({
    where: { videoId: input.videoId },
    create: {
      videoId: input.videoId,
      text: input.text,
      language: input.language,
      model: input.model,
      segments: input.segments,
      duration: input.duration,
    },
    update: {
      text: input.text,
      language: input.language,
      model: input.model,
      segments: input.segments,
      duration: input.duration,
    },
  })
}

export async function getTranscript(videoId: string) {
  return db.transcript.findUnique({ where: { videoId } })
}

/** ---------- Highlights ---------- */

export interface CreateHighlightInput {
  videoId: string
  start: number
  end: number
  title: string
  reasoning: string | null
  category: string
  score: number
  excerpt: string | null
}

export async function createHighlights(inputs: CreateHighlightInput[]) {
  if (inputs.length === 0) return { count: 0 }
  // Replace existing highlights for this video (only one set at a time).
  const videoId = inputs[0].videoId
  await db.highlight.deleteMany({ where: { videoId } })
  await db.highlight.createMany({ data: inputs })
  return { count: inputs.length }
}

export async function listHighlights(videoId: string) {
  return db.highlight.findMany({ where: { videoId }, orderBy: { start: 'asc' } })
}

/** ---------- Stats ---------- */

export async function getDashboardStats() {
  const [
    videoCounts,
    clipCounts,
    highlightTotal,
    highlightsByCategory,
    storageAgg,
    durationAgg,
  ] = await Promise.all([
    db.video.groupBy({ by: ['status'], _count: true }),
    db.clip.groupBy({ by: ['status'], _count: true }),
    db.highlight.count(),
    db.highlight.groupBy({ by: ['category'], _count: true }),
    db.video.aggregate({ _sum: { sizeBytes: true } }),
    db.video.aggregate({ _sum: { duration: true } }),
  ])

  const videoMap = Object.fromEntries(videoCounts.map((c) => [c.status, c._count]))
  const clipMap = Object.fromEntries(clipCounts.map((c) => [c.status, c._count]))
  const categoryMap = Object.fromEntries(
    highlightsByCategory.map((c) => [c.category, c._count]),
  )

  // Outputs storage: sum of clip sizes
  const clipStorage = await db.clip.aggregate({ _sum: { sizeBytes: true } })

  return {
    videos: {
      total: Object.values(videoMap).reduce((a, b) => a + b, 0),
      ready: videoMap.READY ?? 0,
      processing:
        (videoMap.UPLOADED ?? 0) +
        (videoMap.PROBING ?? 0) +
        (videoMap.EXTRACTING_AUDIO ?? 0) +
        (videoMap.TRANSCRIBING ?? 0) +
        (videoMap.ANALYZING ?? 0),
      failed: videoMap.FAILED ?? 0,
    },
    clips: {
      total: Object.values(clipMap).reduce((a, b) => a + b, 0),
      ready: clipMap.READY ?? 0,
      processing:
        (clipMap.QUEUED ?? 0) +
        (clipMap.CUTTING ?? 0) +
        (clipMap.CROPPING ?? 0) +
        (clipMap.SUBTITLING ?? 0) +
        (clipMap.RENDERING ?? 0),
    },
    highlights: {
      total: highlightTotal,
      byCategory: categoryMap,
    },
    storage: {
      uploadsBytes: storageAgg._sum.sizeBytes ?? 0,
      outputsBytes: clipStorage._sum.sizeBytes ?? 0,
      totalBytes: (storageAgg._sum.sizeBytes ?? 0) + (clipStorage._sum.sizeBytes ?? 0),
    },
    totalDurationSeconds: durationAgg._sum.duration ?? 0,
  }
}
