/**
 * ClipForge — shared API schemas (Zod).
 *
 * Used by both the server (to validate incoming requests) and the client
 * (to type responses). Keeping them in one place prevents drift.
 */
import { z } from 'zod'

/** ---------- Health ---------- */
export const HealthStatusSchema = z.enum(['ok', 'degraded', 'down'])
export type HealthStatus = z.infer<typeof HealthStatusSchema>

export const ComponentHealthSchema = z.object({
  name: z.string(),
  status: HealthStatusSchema,
  detail: z.string().optional(),
  version: z.string().optional(),
})
export type ComponentHealth = z.infer<typeof ComponentHealthSchema>

export const HealthResponseSchema = z.object({
  status: HealthStatusSchema,
  uptime: z.number(),
  components: z.array(ComponentHealthSchema),
})
export type HealthResponse = z.infer<typeof HealthResponseSchema>

/** ---------- Stats ---------- */
export const StatsResponseSchema = z.object({
  videos: z.object({
    total: z.number(),
    ready: z.number(),
    processing: z.number(),
    failed: z.number(),
  }),
  clips: z.object({
    total: z.number(),
    ready: z.number(),
    processing: z.number(),
  }),
  highlights: z.object({
    total: z.number(),
    byCategory: z.record(z.string(), z.number()),
  }),
  storage: z.object({
    uploadsBytes: z.number(),
    outputsBytes: z.number(),
    totalBytes: z.number(),
  }),
  totalDurationSeconds: z.number(),
})
export type StatsResponse = z.infer<typeof StatsResponseSchema>

/** ---------- Videos ---------- */
export const VideoStatusSchema = z.enum([
  'UPLOADED',
  'PROBING',
  'EXTRACTING_AUDIO',
  'TRANSCRIBING',
  'ANALYZING',
  'READY',
  'FAILED',
])

export const VideoSummarySchema = z.object({
  id: z.string(),
  filename: z.string(),
  sizeBytes: z.number(),
  duration: z.number().nullable(),
  width: z.number().nullable(),
  height: z.number().nullable(),
  thumbnail: z.string().nullable(),
  status: VideoStatusSchema,
  progress: z.number(),
  message: z.string().nullable(),
  clipCount: z.number(),
  createdAt: z.string(),
})
export type VideoSummary = z.infer<typeof VideoSummarySchema>

export const VideoListResponseSchema = z.object({
  items: z.array(VideoSummarySchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
})
export type VideoListResponse = z.infer<typeof VideoListResponseSchema>

export const VideoListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  status: VideoStatusSchema.optional(),
  search: z.string().trim().optional(),
})
export type VideoListQuery = z.infer<typeof VideoListQuerySchema>

/** ---------- Single video ---------- */
export const VideoDetailSchema = z.object({
  id: z.string(),
  filename: z.string(),
  storageName: z.string(),
  filePath: z.string(),
  mimeType: z.string(),
  sizeBytes: z.number(),
  duration: z.number().nullable(),
  width: z.number().nullable(),
  height: z.number().nullable(),
  thumbnail: z.string().nullable(),
  status: VideoStatusSchema,
  progress: z.number(),
  message: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  transcript: z
    .object({
      id: z.string(),
      text: z.string(),
      language: z.string().nullable(),
      segments: z.string(),
      duration: z.number().nullable(),
    })
    .nullable()
    .optional(),
  highlights: z
    .array(
      z.object({
        id: z.string(),
        start: z.number(),
        end: z.number(),
        title: z.string(),
        reasoning: z.string().nullable(),
        category: z.string(),
        score: z.number(),
        excerpt: z.string().nullable(),
      }),
    )
    .optional(),
  clips: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        filePath: z.string(),
        thumbnail: z.string().nullable(),
        width: z.number(),
        height: z.number(),
        duration: z.number(),
        sizeBytes: z.number(),
        status: z.string(),
      }),
    )
    .optional(),
})
export type VideoDetail = z.infer<typeof VideoDetailSchema>

/** ---------- Upload result ---------- */
export const UploadResultSchema = z.object({
  id: z.string(),
  filename: z.string(),
  storageName: z.string(),
  filePath: z.string(),
  thumbnail: z.string().nullable(),
  duration: z.number().nullable(),
  width: z.number().nullable(),
  height: z.number().nullable(),
  status: VideoStatusSchema,
})
export type UploadResult = z.infer<typeof UploadResultSchema>

/** ---------- Delete result ---------- */
export const DeleteResultSchema = z.object({
  id: z.string(),
  deleted: z.boolean(),
})
export type DeleteResult = z.infer<typeof DeleteResultSchema>

/** ---------- Transcript ---------- */
export const TranscriptSegmentSchema = z.object({
  id: z.number(),
  start: z.number(),
  end: z.number(),
  text: z.string(),
  words: z.array(
    z.object({
      word: z.string(),
      start: z.number(),
      end: z.number(),
      probability: z.number(),
    }),
  ),
})
export type TranscriptSegment = z.infer<typeof TranscriptSegmentSchema>

export const TranscriptResponseSchema = z.object({
  id: z.string(),
  videoId: z.string(),
  text: z.string(),
  language: z.string().nullable(),
  model: z.string().nullable(),
  duration: z.number().nullable(),
  segments: z.array(TranscriptSegmentSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
})
export type TranscriptResponse = z.infer<typeof TranscriptResponseSchema>

/** ---------- Transcribe request/result ---------- */
export const TranscribeRequestSchema = z.object({
  modelSize: z.enum(['tiny', 'base', 'small', 'medium', 'large-v3']).optional(),
  language: z.string().length(2).nullable().optional(),
  wordTimestamps: z.boolean().optional(),
})
export type TranscribeRequest = z.infer<typeof TranscribeRequestSchema>

export const TranscribeResultSchema = z.object({
  transcriptId: z.string(),
  language: z.string(),
  languageProbability: z.number(),
  duration: z.number(),
  segmentCount: z.number(),
  textPreview: z.string(),
})
export type TranscribeResult = z.infer<typeof TranscribeResultSchema>

/** ---------- Highlights ---------- */
export const HighlightCategorySchema = z.enum([
  'hook',
  'emotional',
  'story',
  'funny',
  'educational',
  'viral',
])
export type HighlightCategory = z.infer<typeof HighlightCategorySchema>

export const DetectedHighlightSchema = z.object({
  start: z.number(),
  end: z.number(),
  title: z.string(),
  reasoning: z.string(),
  category: HighlightCategorySchema,
  score: z.number(),
  excerpt: z.string(),
})
export type DetectedHighlight = z.infer<typeof DetectedHighlightSchema>

export const DetectHighlightsRequestSchema = z.object({
  maxHighlights: z.number().int().min(1).max(50).optional(),
  minScore: z.number().min(0).max(1).optional(),
  customPrompt: z.string().max(500).optional(),
  targetDuration: z.enum(['under-30', '30-60', '60-plus']).optional(),
})
export type DetectHighlightsRequest = z.infer<typeof DetectHighlightsRequestSchema>

/** Target duration options for clip generation. */
export const TARGET_DURATIONS = [
  { id: 'under-30' as const, label: 'Under 30 seconds', hint: '15–29s' },
  { id: '30-60' as const, label: '30 to 60 seconds', hint: '30–60s' },
  { id: '60-plus' as const, label: '1 minute+', hint: '60–90s' },
]
export type TargetDurationId = (typeof TARGET_DURATIONS)[number]['id']

export const DetectHighlightsResultSchema = z.object({
  count: z.number(),
  highlights: z.array(DetectedHighlightSchema),
})
export type DetectHighlightsResult = z.infer<typeof DetectHighlightsResultSchema>

/** ---------- Clips ---------- */
export const ClipSummarySchema = z.object({
  id: z.string(),
  videoId: z.string(),
  highlightId: z.string().nullable(),
  title: z.string(),
  filePath: z.string(),
  thumbnail: z.string().nullable(),
  width: z.number(),
  height: z.number(),
  duration: z.number(),
  sizeBytes: z.number(),
  hasSubtitles: z.boolean(),
  subtitleStyle: z.string().nullable(),
  status: z.string(),
  createdAt: z.string(),
  video: z
    .object({
      id: z.string(),
      filename: z.string(),
      thumbnail: z.string().nullable(),
    })
    .optional(),
  highlight: z
    .object({
      id: z.string(),
      category: z.string(),
      score: z.number(),
    })
    .nullable()
    .optional(),
})
export type ClipSummary = z.infer<typeof ClipSummarySchema>

export const ClipListResponseSchema = z.object({
  items: z.array(ClipSummarySchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
})
export type ClipListResponse = z.infer<typeof ClipListResponseSchema>

export const GenerateClipsRequestSchema = z.object({
  padSeconds: z.number().min(0).max(10).optional(),
  highlightIds: z.array(z.string()).optional(),
  force: z.boolean().optional(),
})
export type GenerateClipsRequest = z.infer<typeof GenerateClipsRequestSchema>

export const GenerateClipsResultSchema = z.object({
  generated: z.array(
    z.object({
      id: z.string(),
      highlightId: z.string().nullable(),
      title: z.string(),
      filePath: z.string(),
      thumbnail: z.string().nullable(),
      width: z.number(),
      height: z.number(),
      duration: z.number(),
      sizeBytes: z.number(),
      status: z.string(),
    }),
  ),
  skipped: z.number(),
})
export type GenerateClipsResult = z.infer<typeof GenerateClipsResultSchema>
