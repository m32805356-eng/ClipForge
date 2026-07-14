/**
 * ClipForge — react-query hooks for API data.
 *
 * Centralizes query keys + fetching logic so views stay declarative.
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, ApiClientError } from '@/lib/clipforge/client/api-client'
import type {
  DetectHighlightsRequest,
  GenerateClipsRequest,
  TranscribeRequest,
  VideoListQuery,
} from '@/types/clipforge/api-schemas'

export const queryKeys = {
  health: ['health'] as const,
  stats: ['stats'] as const,
  videos: (q?: Partial<VideoListQuery>) => ['videos', q ?? {}] as const,
  video: (id: string) => ['video', id] as const,
  transcript: (videoId: string) => ['transcript', videoId] as const,
  clips: (q?: { videoId?: string; status?: string }) => ['clips', q ?? {}] as const,
}

/** Polls system health every 30s — powers the dashboard status card. */
export function useHealth() {
  return useQuery({
    queryKey: queryKeys.health,
    queryFn: api.health,
    refetchInterval: 30_000,
  })
}

export function useStats() {
  return useQuery({
    queryKey: queryKeys.stats,
    queryFn: api.stats,
    refetchInterval: 15_000,
  })
}

export function useVideos(query: Partial<VideoListQuery> = {}) {
  return useQuery({
    queryKey: queryKeys.videos(query),
    queryFn: () => api.videos(query),
  })
}

export function useVideo(id: string | null) {
  return useQuery({
    queryKey: id ? queryKeys.video(id) : ['video', 'none'],
    queryFn: () => api.video(id!),
    enabled: !!id,
  })
}

/** Upload mutation with progress callback. Invalidates video list + stats on success. */
export function useUploadVideo() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (args: { file: File; onProgress?: (pct: number) => void; signal?: AbortSignal }) =>
      api.uploadVideo(args.file, { onProgress: args.onProgress, signal: args.signal }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['videos'] })
      qc.invalidateQueries({ queryKey: queryKeys.stats })
    },
  })
}

export function useDownloadFromUrl() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (url: string) => api.downloadFromUrl(url),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['videos'] })
      qc.invalidateQueries({ queryKey: queryKeys.stats })
    },
  })
}

export function useDeleteVideo() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.deleteVideo(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['videos'] })
      qc.invalidateQueries({ queryKey: queryKeys.stats })
      qc.invalidateQueries({ queryKey: queryKeys.health })
    },
  })
}

export function useTranscript(videoId: string | null) {
  return useQuery({
    queryKey: videoId ? queryKeys.transcript(videoId) : ['transcript', 'none'],
    queryFn: () => api.transcript(videoId!),
    enabled: !!videoId,
    retry: false, // 404 means "not transcribed yet" — don't retry
  })
}

export function useTranscribeVideo() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (args: { videoId: string; options?: TranscribeRequest }) =>
      api.transcribe(args.videoId, args.options ?? {}),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: queryKeys.transcript(vars.videoId) })
      qc.invalidateQueries({ queryKey: queryKeys.video(vars.videoId) })
      qc.invalidateQueries({ queryKey: ['videos'] })
      qc.invalidateQueries({ queryKey: queryKeys.stats })
    },
  })
}

export function useDetectHighlights() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (args: { videoId: string; options?: DetectHighlightsRequest }) =>
      api.detectHighlights(args.videoId, args.options ?? {}),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: queryKeys.video(vars.videoId) })
      qc.invalidateQueries({ queryKey: ['videos'] })
      qc.invalidateQueries({ queryKey: queryKeys.stats })
    },
  })
}

export function useClips(query: { videoId?: string; status?: string; pageSize?: number } = {}) {
  return useQuery({
    queryKey: queryKeys.clips({ videoId: query.videoId, status: query.status }),
    queryFn: () => api.clips({ pageSize: query.pageSize ?? 100, ...query }),
  })
}

export function useGenerateClips() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (args: { videoId: string; options?: GenerateClipsRequest }) =>
      api.generateClips(args.videoId, args.options ?? {}),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: queryKeys.video(vars.videoId) })
      qc.invalidateQueries({ queryKey: queryKeys.clips() })
      qc.invalidateQueries({ queryKey: ['videos'] })
      qc.invalidateQueries({ queryKey: queryKeys.stats })
    },
  })
}

export function useDeleteClip() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (clipId: string) => api.deleteClip(clipId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['clips'] })
      qc.invalidateQueries({ queryKey: ['videos'] })
      qc.invalidateQueries({ queryKey: queryKeys.stats })
    },
  })
}

export function useBurnSubtitles() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (args: { clipId: string; style?: string }) =>
      api.burnSubtitles(args.clipId, args.style ?? 'bold-white'),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['clips'] })
      qc.invalidateQueries({ queryKey: ['videos'] })
      qc.invalidateQueries({ queryKey: queryKeys.stats })
    },
  })
}

export function useCropVertical() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (clipId: string) => api.cropVertical(clipId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['clips'] })
      qc.invalidateQueries({ queryKey: ['videos'] })
      qc.invalidateQueries({ queryKey: queryKeys.stats })
    },
  })
}

export { ApiClientError }
