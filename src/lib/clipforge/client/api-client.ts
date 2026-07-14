/**
 * ClipForge — typed browser API client.
 *
 * Thin fetch wrapper that:
 *   - Uses only relative paths (sandbox-safe; Caddy routes /api/* to port 3000)
 *   - Throws typed ApiClientError on non-2xx
 *   - Returns parsed JSON typed by the caller
 */
import type {
  HealthResponse,
  StatsResponse,
  VideoListResponse,
  VideoListQuery,
  VideoDetail,
  UploadResult,
  DeleteResult,
  TranscriptResponse,
  TranscribeRequest,
  TranscribeResult,
  DetectHighlightsRequest,
  DetectHighlightsResult,
  ClipListResponse,
  GenerateClipsRequest,
  GenerateClipsResult,
} from '@/types/clipforge/api-schemas'

export class ApiClientError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly status: number,
    public readonly details?: unknown,
  ) {
    super(message)
    this.name = 'ApiClientError'
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })

  if (!res.ok) {
    let body: unknown
    try {
      body = await res.json()
    } catch {
      body = await res.text().catch(() => '')
    }
    const errObj = (body && typeof body === 'object' && 'error' in (body as object))
      ? (body as { error: { code?: string; message?: string; details?: unknown } }).error
      : { message: typeof body === 'string' ? body : 'Request failed' }
    throw new ApiClientError(
      errObj.message ?? `HTTP ${res.status}`,
      errObj.code ?? 'HTTP_ERROR',
      res.status,
      errObj.details,
    )
  }

  return (await res.json()) as T
}

export const api = {
  health: () => request<HealthResponse>('/api/health'),
  stats: () => request<StatsResponse>('/api/stats'),
  videos: (query: Partial<VideoListQuery> = {}) => {
    const params = new URLSearchParams()
    if (query.page) params.set('page', String(query.page))
    if (query.pageSize) params.set('pageSize', String(query.pageSize))
    if (query.status) params.set('status', query.status)
    if (query.search) params.set('search', query.search)
    const qs = params.toString()
    return request<VideoListResponse>(`/api/videos${qs ? `?${qs}` : ''}`)
  },
  video: (id: string) => request<VideoDetail>(`/api/videos/${encodeURIComponent(id)}`),

  /**
   * Upload a video file with progress tracking via XHR (fetch can't report upload progress).
   * Calls onProgress with 0..100 as bytes are sent.
   */
  uploadVideo: (
    file: File,
    opts: { onProgress?: (pct: number) => void; signal?: AbortSignal } = {},
  ): Promise<UploadResult> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open('POST', '/api/videos')
      xhr.responseType = 'json'

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable && opts.onProgress) {
          opts.onProgress(Math.round((e.loaded / e.total) * 100))
        }
      }
      xhr.upload.onerror = () =>
        reject(new ApiClientError('Upload network error', 'NETWORK_ERROR', 0))
      xhr.onerror = () =>
        reject(new ApiClientError('Request network error', 'NETWORK_ERROR', 0))
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response as UploadResult)
        } else {
          const errObj =
            xhr.response && typeof xhr.response === 'object' && 'error' in xhr.response
              ? xhr.response.error
              : { message: `HTTP ${xhr.status}` }
          reject(
            new ApiClientError(
              errObj.message ?? `HTTP ${xhr.status}`,
              errObj.code ?? 'HTTP_ERROR',
              xhr.status,
              errObj.details,
            ),
          )
        }
      }
      if (opts.signal) {
        opts.signal.addEventListener('abort', () => {
          xhr.abort()
          reject(new ApiClientError('Upload aborted', 'ABORTED', 0))
        })
      }

      const form = new FormData()
      form.append('file', file)
      xhr.send(form)
    })
  },

  deleteVideo: (id: string) =>
    request<DeleteResult>(`/api/videos/${encodeURIComponent(id)}`, { method: 'DELETE' }),

  downloadFromUrl: (url: string) =>
    request<UploadResult>('/api/videos/from-url', {
      method: 'POST',
      body: JSON.stringify({ url }),
    }),

  transcript: (videoId: string) =>
    request<TranscriptResponse>(`/api/videos/${encodeURIComponent(videoId)}/transcript`),

  transcribe: (videoId: string, body: TranscribeRequest = {}) =>
    request<TranscribeResult>(`/api/videos/${encodeURIComponent(videoId)}/transcribe`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  detectHighlights: (videoId: string, body: DetectHighlightsRequest = {}) =>
    request<DetectHighlightsResult>(`/api/videos/${encodeURIComponent(videoId)}/highlights`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  clips: (query: { page?: number; pageSize?: number; videoId?: string; status?: string } = {}) => {
    const params = new URLSearchParams()
    if (query.page) params.set('page', String(query.page))
    if (query.pageSize) params.set('pageSize', String(query.pageSize))
    if (query.videoId) params.set('videoId', query.videoId)
    if (query.status) params.set('status', query.status)
    const qs = params.toString()
    return request<ClipListResponse>(`/api/clips${qs ? `?${qs}` : ''}`)
  },

  generateClips: (videoId: string, body: GenerateClipsRequest = {}) =>
    request<GenerateClipsResult>(`/api/videos/${encodeURIComponent(videoId)}/clips`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  deleteClip: (clipId: string) =>
    request<{ id: string; deleted: boolean }>(`/api/clips/${encodeURIComponent(clipId)}`, {
      method: 'DELETE',
    }),

  burnSubtitles: (clipId: string, style: string = 'bold-white') =>
    request<{
      id: string
      hasSubtitles: boolean
      subtitleStyle: string
      sizeBytes: number
      duration: number
    }>(`/api/clips/${encodeURIComponent(clipId)}/subtitles`, {
      method: 'POST',
      body: JSON.stringify({ style }),
    }),

  cropVertical: (clipId: string) =>
    request<{
      id: string
      width: number
      height: number
      sizeBytes: number
      duration: number
    }>(`/api/clips/${encodeURIComponent(clipId)}/vertical`, {
      method: 'POST',
    }),
}
