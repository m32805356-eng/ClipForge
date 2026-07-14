'use client'

import * as React from 'react'
import {
  ArrowLeft,
  Film,
  Clock,
  HardDrive,
  Maximize2,
  Loader2,
  Sparkles,
  FileText,
  Mic2,
  Languages,
  Play,
  Search,
  AlertCircle,
  RefreshCw,
  Download,
  Wand2,
  ChevronDown,
  ChevronRight,
  Scissors,
  Trash2,
  ExternalLink,
  Captions,
  Type,
  Smartphone,
  Zap,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useClipForgeStore } from '@/stores/clipforge-store'
import { useSettings } from '@/stores/settings-store'
import {
  useVideo,
  useTranscript,
  useTranscribeVideo,
  useDetectHighlights,
  useGenerateClips,
  useDeleteClip,
  useBurnSubtitles,
  useCropVertical,
  useDeleteVideo,
  ApiClientError,
} from '@/hooks/use-clipforge-api'
import { HIGHLIGHT_CATEGORIES, SUBTITLE_STYLES } from '@/lib/clipforge/constants'
import type { HighlightCategory } from '@/types/clipforge/api-schemas'
import { formatBytes, formatDuration, formatRelativeTime, formatScore } from '@/lib/clipforge/format'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import type { VideoStatus } from '@prisma/client'

const STATUS_META: Record<VideoStatus, { label: string; tone: string }> = {
  UPLOADED: { label: 'Uploaded', tone: 'bg-muted text-muted-foreground' },
  PROBING: { label: 'Probing', tone: 'bg-amber-500/15 text-amber-500' },
  EXTRACTING_AUDIO: { label: 'Extracting audio', tone: 'bg-amber-500/15 text-amber-500' },
  TRANSCRIBING: { label: 'Transcribing', tone: 'bg-amber-500/15 text-amber-500' },
  ANALYZING: { label: 'Analyzing', tone: 'bg-amber-500/15 text-amber-500' },
  READY: { label: 'Ready', tone: 'bg-emerald-500/15 text-emerald-500' },
  FAILED: { label: 'Failed', tone: 'bg-destructive/15 text-destructive' },
}

export function VideoDetailView() {
  const videoId = useClipForgeStore((s) => s.activeVideoId)
  const setView = useClipForgeStore((s) => s.setView)
  const videoQ = useVideo(videoId)
  const deleteMutation = useDeleteVideo()
  const transcribeMutation = useTranscribeVideo()
  const detectMutation = useDetectHighlights()
  const generateMutation = useGenerateClips()
  const settings = useSettings()
  const [processing, setProcessing] = React.useState(false)

  const handleDelete = async () => {
    if (!videoId) return
    if (!confirm('Delete this video and all its clips? This cannot be undone.')) return
    try {
      await deleteMutation.mutateAsync(videoId)
      toast.success('Video deleted')
      setView('videos')
    } catch (e) {
      toast.error('Delete failed', { description: (e as Error).message })
    }
  }

  const handleProcessAll = async () => {
    if (!videoId) return
    setProcessing(true)
    try {
      const v = videoQ.data
      // Step 1: Transcribe (if no transcript)
      if (!v?.transcript) {
        toast.info('Step 1/3: Transcribing…', { description: `Using ${settings.defaultModelSize} model` })
        await transcribeMutation.mutateAsync({
          videoId,
          options: { modelSize: settings.defaultModelSize },
        })
      }
      // Step 2: Detect highlights
      toast.info('Step 2/3: Detecting highlights…')
      await detectMutation.mutateAsync({
        videoId,
        options: {
          maxHighlights: settings.defaultMaxHighlights,
          minScore: settings.defaultMinScore,
        },
      })
      // Step 3: Generate clips
      toast.info('Step 3/3: Generating clips…')
      const clipResult = await generateMutation.mutateAsync({
        videoId,
        options: { padSeconds: settings.defaultPadSeconds },
      })
      toast.success('Pipeline complete!', {
        description: `${clipResult.generated.length} clips ready to download.`,
      })
    } catch (e) {
      const msg = e instanceof ApiClientError ? e.message : (e as Error).message
      toast.error('Pipeline failed', { description: msg })
    } finally {
      setProcessing(false)
    }
  }

  if (!videoId) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <AlertCircle className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No video selected.</p>
          <Button variant="outline" size="sm" onClick={() => setView('videos')}>
            Back to videos
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (videoQ.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-9 w-32" />
        <div className="grid gap-4 lg:grid-cols-3">
          <Skeleton className="h-72 lg:col-span-2" />
          <Skeleton className="h-72" />
        </div>
      </div>
    )
  }

  if (videoQ.isError || !videoQ.data) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p className="text-sm">Failed to load video.</p>
          <Button variant="outline" size="sm" onClick={() => setView('videos')}>
            Back to videos
          </Button>
        </CardContent>
      </Card>
    )
  }

  const v = videoQ.data
  const statusMeta = STATUS_META[v.status as VideoStatus] ?? STATUS_META.UPLOADED
  const inFlight =
    v.status === 'EXTRACTING_AUDIO' ||
    v.status === 'TRANSCRIBING' ||
    v.status === 'ANALYZING' ||
    v.status === 'PROBING'

  return (
    <div className="space-y-5">
      {/* Breadcrumb + actions */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => setView('videos')}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Videos
        </button>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={handleProcessAll}
            disabled={processing || inFlight}
            className="gap-2"
          >
            {processing || inFlight ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Zap className="h-3.5 w-3.5" />
            )}
            {processing ? 'Processing…' : 'Process All'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="text-muted-foreground hover:text-destructive"
          >
            {deleteMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            Delete
          </Button>
        </div>
      </div>

      {/* Title row */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="min-w-0 truncate text-xl font-semibold tracking-tight">{v.filename}</h2>
          <span className={cn('inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[10px] font-medium', statusMeta.tone)}>
            {inFlight && <Loader2 className="h-2.5 w-2.5 animate-spin" />}
            {statusMeta.label}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatRelativeTime(v.createdAt)}
          </span>
          <span className="flex items-center gap-1">
            <HardDrive className="h-3 w-3" />
            {formatBytes(v.sizeBytes)}
          </span>
          {v.width && v.height && (
            <span className="flex items-center gap-1">
              <Maximize2 className="h-3 w-3" />
              {v.width}×{v.height}
            </span>
          )}
          {v.duration != null && (
            <span className="flex items-center gap-1">
              <Film className="h-3 w-3" />
              {formatDuration(v.duration)}
            </span>
          )}
        </div>
        {inFlight && v.message && (
          <div className="flex items-center gap-2 rounded-md border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-xs text-amber-600 dark:text-amber-500">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span>{v.message}</span>
            <span className="ml-auto font-mono">{v.progress}%</span>
          </div>
        )}
        {v.status === 'FAILED' && v.message && (
          <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span className="min-w-0 break-words">{v.message}</span>
          </div>
        )}
      </div>

      {/* Main grid */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Player + transcript */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <div className="relative aspect-video bg-black">
              <video
                key={v.id}
                controls
                preload="metadata"
                poster={v.thumbnail ? `/api/files/${v.thumbnail}` : undefined}
                className="h-full w-full"
              >
                <source src={`/api/files/${v.filePath}`} type={v.mimeType || 'video/mp4'} />
              </video>
            </div>
          </Card>

          <div className="mt-4">
            <TranscriptPanel videoId={v.id} videoStatus={v.status as VideoStatus} />
          </div>
        </div>

        {/* Sidebar: highlights + clips */}
        <div className="space-y-4">
          <HighlightsPanel
            videoId={v.id}
            highlights={v.highlights ?? []}
            hasTranscript={!!v.transcript}
            videoStatus={v.status as VideoStatus}
          />

          <ClipsPanel
            videoId={v.id}
            clips={v.clips ?? []}
            hasHighlights={(v.highlights ?? []).length > 0}
            videoStatus={v.status as VideoStatus}
          />
        </div>
      </div>
    </div>
  )
}

/** ---------- Transcript panel ---------- */

function TranscriptPanel({
  videoId,
  videoStatus,
}: {
  videoId: string
  videoStatus: VideoStatus
}) {
  const transcriptQ = useTranscript(videoId)
  const transcribeMutation = useTranscribeVideo()
  const settings = useSettings()
  const [modelSize, setModelSize] = React.useState<'tiny' | 'base' | 'small' | 'medium' | 'large-v3'>(settings.defaultModelSize)
  const [search, setSearch] = React.useState('')
  const videoRef = React.useRef<HTMLVideoElement | null>(null)

  // Find the <video> element on the page so we can seek from transcript clicks.
  React.useEffect(() => {
    videoRef.current = document.querySelector('video')
  }, [])

  const handleTranscribe = async () => {
    try {
      await transcribeMutation.mutateAsync({ videoId, options: { modelSize } })
      toast.success('Transcription complete', {
        description: `Used ${modelSize} model. View segments below.`,
      })
    } catch (e) {
      const msg = e instanceof ApiClientError ? e.message : (e as Error).message
      toast.error('Transcription failed', { description: msg })
    }
  }

  const seekTo = (time: number) => {
    const el = videoRef.current
    if (!el) return
    el.currentTime = time
    el.play().catch(() => {})
  }

  const segments = transcriptQ.data?.segments ?? []
  const filtered = search
    ? segments.filter((s) => s.text.toLowerCase().includes(search.toLowerCase()))
    : segments

  const isTranscribing = transcribeMutation.isPending ||
    videoStatus === 'TRANSCRIBING' ||
    videoStatus === 'EXTRACTING_AUDIO' ||
    videoStatus === 'ANALYZING'

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 pb-3 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <FileText className="h-4 w-4 text-primary" />
          Transcript
          {transcriptQ.data && (
            <Badge variant="secondary" className="ml-1 text-[9px]">
              {transcriptQ.data.segments.length} segments
            </Badge>
          )}
        </CardTitle>
        <div className="flex flex-wrap items-center gap-2">
          {transcriptQ.data?.language && (
            <Badge variant="outline" className="gap-1 text-[10px]">
              <Languages className="h-3 w-3" />
              {transcriptQ.data.language}
            </Badge>
          )}
          {transcriptQ.data?.model && (
            <Badge variant="outline" className="text-[10px]">
              {transcriptQ.data.model}
            </Badge>
          )}
          <Select value={modelSize} onValueChange={(v) => setModelSize(v as typeof modelSize)}>
            <SelectTrigger className="h-8 w-[110px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tiny">tiny · fastest</SelectItem>
              <SelectItem value="base">base · balanced</SelectItem>
              <SelectItem value="small">small · better</SelectItem>
              <SelectItem value="medium">medium · slow</SelectItem>
              <SelectItem value="large-v3">large-v3 · best</SelectItem>
            </SelectContent>
          </Select>
          <Button
            size="sm"
            onClick={handleTranscribe}
            disabled={isTranscribing}
            className="gap-2"
          >
            {isTranscribing ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Processing…
              </>
            ) : transcriptQ.data ? (
              <>
                <RefreshCw className="h-3.5 w-3.5" />
                Re-transcribe
              </>
            ) : (
              <>
                <Mic2 className="h-3.5 w-3.5" />
                Transcribe
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isTranscribing && !transcriptQ.data ? (
          <TranscriptionSkeleton />
        ) : transcriptQ.isError || !transcriptQ.data ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-muted/20 px-6 py-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Mic2 className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">No transcript yet</p>
              <p className="max-w-sm text-xs text-muted-foreground">
                Run Whisper to generate timestamps and word-level segments. Pick a model size
                above (smaller = faster, larger = more accurate), then click Transcribe.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-1 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Mic2 className="h-3 w-3" />
                100% local
              </span>
              <span className="flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                word-level timestamps
              </span>
              <span className="flex items-center gap-1">
                <Languages className="h-3 w-3" />
                auto-detect language
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Search */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search transcript…"
                className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-xs outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Segments */}
            <div className="max-h-[28rem] space-y-1 overflow-y-auto scrollbar-thin pr-1">
              {filtered.length === 0 ? (
                <p className="py-6 text-center text-xs text-muted-foreground">
                  No segments match &ldquo;{search}&rdquo;
                </p>
              ) : (
                filtered.map((seg) => (
                  <button
                    key={seg.id}
                    onClick={() => seekTo(seg.start)}
                    className="group flex w-full gap-3 rounded-md px-2.5 py-1.5 text-left transition-colors hover:bg-primary/5"
                  >
                    <span className="mt-0.5 shrink-0 font-mono text-[10px] text-muted-foreground group-hover:text-primary">
                      {formatDuration(seg.start)}
                    </span>
                    <span className="min-w-0 flex-1 text-xs leading-relaxed">
                      {seg.text}
                    </span>
                    <Play className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </button>
                ))
              )}
            </div>

            {transcriptQ.data.text && (
              <div className="flex items-center justify-between border-t border-border pt-3 text-[10px] text-muted-foreground">
                <span>
                  Duration: {formatDuration(transcriptQ.data.duration ?? 0)}
                </span>
                <button
                  onClick={() => {
                    const blob = new Blob([transcriptQ.data!.text], { type: 'text/plain' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = `transcript-${videoId}.txt`
                    a.click()
                    URL.revokeObjectURL(url)
                  }}
                  className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
                >
                  <Download className="h-3 w-3" />
                  Download .txt
                </button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function TranscriptionSkeleton() {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 rounded-md border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-xs text-amber-600 dark:text-amber-500">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        <span>Transcribing… this can take a moment for long videos.</span>
      </div>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex gap-3 px-2.5">
          <Skeleton className="h-3 w-10 shrink-0" />
          <Skeleton className="h-3 flex-1" style={{ width: `${60 + Math.random() * 35}%` }} />
        </div>
      ))}
    </div>
  )
}

/** ---------- Highlights panel ---------- */

interface HighlightRow {
  id: string
  start: number
  end: number
  title: string
  reasoning: string | null
  category: string
  score: number
  excerpt: string | null
}

function HighlightsPanel({
  videoId,
  highlights,
  hasTranscript,
  videoStatus,
}: {
  videoId: string
  highlights: HighlightRow[]
  hasTranscript: boolean
  videoStatus: VideoStatus
}) {
  const detectMutation = useDetectHighlights()
  const settings = useSettings()
  const [activeCategory, setActiveCategory] = React.useState<HighlightCategory | 'all'>('all')
  const [expandedId, setExpandedId] = React.useState<string | null>(null)
  const videoRef = React.useRef<HTMLVideoElement | null>(null)

  React.useEffect(() => {
    videoRef.current = document.querySelector('video')
  }, [highlights.length])

  const handleDetect = async () => {
    try {
      const result = await detectMutation.mutateAsync({
        videoId,
        options: {
          maxHighlights: settings.defaultMaxHighlights,
          minScore: settings.defaultMinScore,
        },
      })
      toast.success(`Found ${result.count} highlights`, {
        description: 'Click any highlight to seek the video.',
      })
    } catch (e) {
      const msg = e instanceof ApiClientError ? e.message : (e as Error).message
      toast.error('Highlight detection failed', { description: msg })
    }
  }

  const seekTo = (time: number) => {
    const el = videoRef.current
    if (!el) return
    el.currentTime = time
    el.play().catch(() => {})
  }

  // Category counts for the filter chips.
  const categoryCounts = React.useMemo(() => {
    const counts: Record<string, number> = {}
    for (const h of highlights) {
      counts[h.category] = (counts[h.category] ?? 0) + 1
    }
    return counts
  }, [highlights])

  const filtered =
    activeCategory === 'all'
      ? highlights
      : highlights.filter((h) => h.category === activeCategory)

  const isDetecting = detectMutation.isPending || videoStatus === 'ANALYZING'

  return (
    <Card>
      <CardHeader className="flex flex-col gap-2 pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <Sparkles className="h-4 w-4 text-primary" />
            Highlights
            {highlights.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-[9px]">
                {highlights.length}
              </Badge>
            )}
          </CardTitle>
          <Button
            size="sm"
            variant={highlights.length > 0 ? 'outline' : 'default'}
            onClick={handleDetect}
            disabled={isDetecting || !hasTranscript}
            className="h-7 gap-1.5 text-xs"
          >
            {isDetecting ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : highlights.length > 0 ? (
              <RefreshCw className="h-3 w-3" />
            ) : (
              <Wand2 className="h-3 w-3" />
            )}
            {highlights.length > 0 ? 'Re-detect' : 'Detect'}
          </Button>
        </div>
        {!hasTranscript && (
          <p className="text-[10px] text-muted-foreground">
            Transcribe the video first to enable highlight detection.
          </p>
        )}
      </CardHeader>
      <CardContent>
        {highlights.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-muted/20 px-4 py-8 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Wand2 className="h-4 w-4 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium">No highlights yet</p>
              <p className="max-w-[200px] text-[10px] text-muted-foreground">
                Run detection to find hooks, emotional beats, stories, jokes, lessons &amp; viral moments.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
              {HIGHLIGHT_CATEGORIES.map((c) => (
                <span
                  key={c.id}
                  className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/40 px-1.5 py-0.5 text-[8px] font-medium uppercase"
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: c.color }} />
                  {c.label}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            {/* Category filter chips */}
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => setActiveCategory('all')}
                className={cn(
                  'rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors',
                  activeCategory === 'all'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:text-foreground',
                )}
              >
                All ({highlights.length})
              </button>
              {HIGHLIGHT_CATEGORIES.map((c) => {
                const count = categoryCounts[c.id] ?? 0
                if (count === 0) return null
                return (
                  <button
                    key={c.id}
                    onClick={() => setActiveCategory(c.id as HighlightCategory)}
                    className={cn(
                      'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors',
                      activeCategory === c.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:text-foreground',
                    )}
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: c.color }}
                    />
                    {c.label} ({count})
                  </button>
                )
              })}
            </div>

            {/* Highlight list */}
            <div className="max-h-[32rem] space-y-1.5 overflow-y-auto scrollbar-thin pr-1">
              {filtered.length === 0 ? (
                <p className="py-4 text-center text-[11px] text-muted-foreground">
                  No highlights in this category.
                </p>
              ) : (
                filtered.map((h, idx) => {
                  const catMeta = HIGHLIGHT_CATEGORIES.find((c) => c.id === h.category)
                  const color = catMeta?.color ?? 'var(--primary)'
                  const isExpanded = expandedId === h.id
                  return (
                    <div
                      key={h.id}
                      className="group rounded-md border border-border bg-card/40 transition-colors hover:border-primary/40 hover:bg-primary/5"
                    >
                      <button
                        onClick={() => seekTo(h.start)}
                        className="flex w-full items-start gap-2.5 p-2.5 text-left"
                      >
                        {/* Rank */}
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-[9px] font-bold text-muted-foreground">
                          {idx + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span
                              className="h-2 w-2 shrink-0 rounded-full"
                              style={{ background: color }}
                            />
                            <span className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
                              {h.category}
                            </span>
                            <span className="ml-auto font-mono text-[9px] text-muted-foreground">
                              {formatDuration(h.start)}–{formatDuration(h.end)}
                            </span>
                          </div>
                          <p className="mt-1 text-xs font-medium leading-tight">{h.title}</p>
                          {/* Score bar */}
                          <div className="mt-1.5 flex items-center gap-2">
                            <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
                              <div
                                className="h-full rounded-full transition-all"
                                style={{ width: `${Math.round(h.score * 100)}%`, background: color }}
                              />
                            </div>
                            <span className="font-mono text-[9px] text-muted-foreground">
                              {formatScore(h.score)}
                            </span>
                          </div>
                        </div>
                        <Play className="mt-1 h-3 w-3 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                      </button>
                      {/* Expandable reasoning */}
                      {h.reasoning && (
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : h.id)}
                          className="flex w-full items-center gap-1 border-t border-border px-3 py-1 text-[9px] text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {isExpanded ? <ChevronDown className="h-2.5 w-2.5" /> : <ChevronRight className="h-2.5 w-2.5" />}
                          <span>{isExpanded ? 'Hide' : 'Show'} reasoning</span>
                        </button>
                      )}
                      {isExpanded && (
                        <div className="space-y-1.5 border-t border-border bg-muted/20 px-3 py-2">
                          {h.reasoning && (
                            <p className="text-[10px] leading-relaxed text-muted-foreground">
                              <span className="font-medium text-foreground">Why: </span>
                              {h.reasoning}
                            </p>
                          )}
                          {h.excerpt && (
                            <p className="text-[10px] italic leading-relaxed text-muted-foreground">
                              &ldquo;{h.excerpt}&rdquo;
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

/** ---------- Clips panel ---------- */

interface ClipRow {
  id: string
  title: string
  filePath: string
  thumbnail: string | null
  width: number
  height: number
  duration: number
  sizeBytes: number
  hasSubtitles: boolean
  subtitleStyle: string | null
  status: string
  createdAt: string
}

function ClipsPanel({
  videoId,
  clips,
  hasHighlights,
  videoStatus,
}: {
  videoId: string
  clips: ClipRow[]
  hasHighlights: boolean
  videoStatus: VideoStatus
}) {
  const generateMutation = useGenerateClips()
  const deleteMutation = useDeleteClip()
  const burnSubtitlesMutation = useBurnSubtitles()
  const cropVerticalMutation = useCropVertical()
  const settings = useSettings()
  const [confirmDeleteId, setConfirmDeleteId] = React.useState<string | null>(null)
  const [subtitleClipId, setSubtitleClipId] = React.useState<string | null>(null)
  const [selectedStyle, setSelectedStyle] = React.useState<string>(settings.defaultSubtitleStyle)
  const [batchProcessing, setBatchProcessing] = React.useState(false)

  const handleGenerate = async () => {
    try {
      const result = await generateMutation.mutateAsync({
        videoId,
        options: { padSeconds: settings.defaultPadSeconds },
      })
      toast.success(`Generated ${result.generated.length} clips`, {
        description: result.skipped > 0 ? `${result.skipped} already existed` : undefined,
      })
    } catch (e) {
      const msg = e instanceof ApiClientError ? e.message : (e as Error).message
      toast.error('Clip generation failed', { description: msg })
    }
  }

  const handleDelete = async (clipId: string) => {
    try {
      await deleteMutation.mutateAsync(clipId)
      toast.success('Clip deleted')
      setConfirmDeleteId(null)
    } catch (e) {
      toast.error('Delete failed', { description: (e as Error).message })
    }
  }

  const handleBurnSubtitles = async (clipId: string, style: string) => {
    try {
      await burnSubtitlesMutation.mutateAsync({ clipId, style })
      toast.success('Subtitles burned in', {
        description: `Style: ${SUBTITLE_STYLES.find((s) => s.id === style)?.label ?? style}`,
      })
      setSubtitleClipId(null)
    } catch (e) {
      const msg = e instanceof ApiClientError ? e.message : (e as Error).message
      toast.error('Subtitle burn failed', { description: msg })
    }
  }

  const handleCropVertical = async (clipId: string) => {
    try {
      await cropVerticalMutation.mutateAsync(clipId)
      toast.success('Cropped to 1080×1920', {
        description: 'Clip is now vertical-ready for social media.',
      })
    } catch (e) {
      const msg = e instanceof ApiClientError ? e.message : (e as Error).message
      toast.error('Vertical crop failed', { description: msg })
    }
  }

  // Batch: burn subtitles on all clips that don't have them yet.
  const handleBurnAll = async () => {
    setBatchProcessing(true)
    const style = settings.defaultSubtitleStyle
    const targets = clips.filter((c) => !c.hasSubtitles)
    if (targets.length === 0) {
      toast.info('All clips already have subtitles')
      setBatchProcessing(false)
      return
    }
    toast.info(`Burning subtitles on ${targets.length} clips…`, { description: `Style: ${style}` })
    let ok = 0
    let fail = 0
    for (const c of targets) {
      try {
        await burnSubtitlesMutation.mutateAsync({ clipId: c.id, style })
        ok++
      } catch {
        fail++
      }
    }
    toast.success(`Burned ${ok} clip${ok === 1 ? '' : 's'}`, {
      description: fail > 0 ? `${fail} failed` : 'All done.',
    })
    setBatchProcessing(false)
  }

  // Batch: crop all clips that aren't vertical yet.
  const handleCropAll = async () => {
    setBatchProcessing(true)
    const targets = clips.filter((c) => !(c.width === 1080 && c.height === 1920))
    if (targets.length === 0) {
      toast.info('All clips are already vertical')
      setBatchProcessing(false)
      return
    }
    toast.info(`Cropping ${targets.length} clips to 1080×1920…`)
    let ok = 0
    let fail = 0
    for (const c of targets) {
      try {
        await cropVerticalMutation.mutateAsync(c.id)
        ok++
      } catch {
        fail++
      }
    }
    toast.success(`Cropped ${ok} clip${ok === 1 ? '' : 's'}`, {
      description: fail > 0 ? `${fail} failed` : 'All vertical-ready.',
    })
    setBatchProcessing(false)
  }

  const isGenerating = generateMutation.isPending || videoStatus === 'ANALYZING'

  return (
    <Card>
      <CardHeader className="flex flex-col gap-2 pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <Scissors className="h-4 w-4 text-primary" />
            Clips
            {clips.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-[9px]">
                {clips.length}
              </Badge>
            )}
          </CardTitle>
          <Button
            size="sm"
            variant={clips.length > 0 ? 'outline' : 'default'}
            onClick={handleGenerate}
            disabled={isGenerating || !hasHighlights}
            className="h-7 gap-1.5 text-xs"
          >
            {isGenerating ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : clips.length > 0 ? (
              <RefreshCw className="h-3 w-3" />
            ) : (
              <Scissors className="h-3 w-3" />
            )}
            {clips.length > 0 ? 'Re-generate' : 'Generate'}
          </Button>
        </div>
        {!hasHighlights && (
          <p className="text-[10px] text-muted-foreground">
            Detect highlights first to enable clip generation.
          </p>
        )}
        {clips.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <Button
              size="sm"
              variant="outline"
              onClick={handleBurnAll}
              disabled={batchProcessing || clips.every((c) => c.hasSubtitles)}
              className="h-6 gap-1 text-[10px]"
            >
              {batchProcessing ? <Loader2 className="h-2.5 w-2.5 animate-spin" /> : <Captions className="h-2.5 w-2.5" />}
              Burn All
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCropAll}
              disabled={batchProcessing || clips.every((c) => c.width === 1080 && c.height === 1920)}
              className="h-6 gap-1 text-[10px]"
            >
              {batchProcessing ? <Loader2 className="h-2.5 w-2.5 animate-spin" /> : <Smartphone className="h-2.5 w-2.5" />}
              Crop All
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {clips.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-muted/20 px-4 py-8 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Scissors className="h-4 w-4 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium">No clips yet</p>
              <p className="max-w-[200px] text-[10px] text-muted-foreground">
                Generate clips from your highlights. Each clip is cut with FFmpeg and ready to download.
              </p>
            </div>
          </div>
        ) : (
          <div className="max-h-[32rem] space-y-2 overflow-y-auto scrollbar-thin pr-1">
            {clips.map((c, idx) => {
              return (
                <div
                  key={c.id}
                  className="group rounded-md border border-border bg-card/40 transition-colors hover:border-primary/40"
                >
                  <div className="flex gap-2.5 p-2">
                    {/* Vertical-aspect thumbnail */}
                    <a
                      href={`/api/files/${c.filePath}`}
                      target="_blank"
                      rel="noreferrer"
                      className="relative block h-16 w-12 shrink-0 overflow-hidden rounded-md bg-muted ring-1 ring-border"
                    >
                      {c.thumbnail ? (
                        <img
                          src={`/api/files/${c.thumbnail}`}
                          alt={c.title}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Film className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                      <span className="absolute bottom-0.5 right-0.5 rounded bg-black/70 px-1 py-0.5 text-[8px] font-medium text-white">
                        {formatDuration(c.duration)}
                      </span>
                    </a>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start gap-2">
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-muted text-[8px] font-bold text-muted-foreground">
                          {idx + 1}
                        </span>
                        <p className="min-w-0 flex-1 truncate text-xs font-medium leading-tight">
                          {c.title}
                        </p>
                      </div>
                      <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 pl-6 text-[9px] text-muted-foreground">
                        <span>{c.width}×{c.height}</span>
                        <span>·</span>
                        <span>{formatBytes(c.sizeBytes)}</span>
                        <span>·</span>
                        <span className={c.status === 'READY' ? 'text-emerald-500' : 'text-amber-500'}>
                          {c.status}
                        </span>
                      </p>
                      {c.hasSubtitles && c.subtitleStyle && (
                        <span className="ml-6 mt-1 inline-flex w-fit items-center gap-1 rounded-full bg-primary/10 px-1.5 py-0.5 text-[8px] font-medium text-primary">
                          <Captions className="h-2 w-2" />
                          {SUBTITLE_STYLES.find((s) => s.id === c.subtitleStyle)?.label ?? c.subtitleStyle}
                        </span>
                      )}
                      <div className="mt-auto flex items-center gap-1 pl-6 pt-1.5">
                        <a
                          href={`/api/files/${c.filePath}`}
                          download
                          className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-0.5 text-[9px] font-medium transition-colors hover:bg-muted"
                        >
                          <Download className="h-2.5 w-2.5" />
                          Download
                        </a>
                        <a
                          href={`/api/files/${c.filePath}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-0.5 text-[9px] font-medium transition-colors hover:bg-muted"
                        >
                          <ExternalLink className="h-2.5 w-2.5" />
                          Open
                        </a>
                        <button
                          onClick={() => {
                            setSubtitleClipId(subtitleClipId === c.id ? null : c.id)
                          }}
                          disabled={burnSubtitlesMutation.isPending}
                          className={cn(
                            'inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[9px] font-medium transition-colors',
                            c.hasSubtitles
                              ? 'border-primary/30 bg-primary/5 text-primary hover:bg-primary/10'
                              : 'border-border bg-background text-muted-foreground hover:bg-muted',
                          )}
                          title="Burn subtitles"
                        >
                          <Type className="h-2.5 w-2.5" />
                          {c.hasSubtitles ? 'Re-burn' : 'Subtitles'}
                        </button>
                        <button
                          onClick={() => handleCropVertical(c.id)}
                          disabled={cropVerticalMutation.isPending}
                          className={cn(
                            'inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[9px] font-medium transition-colors',
                            c.width === 1080 && c.height === 1920
                              ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-500'
                              : 'border-border bg-background text-muted-foreground hover:bg-muted',
                          )}
                          title="Crop to 1080×1920 vertical"
                        >
                          {cropVerticalMutation.isPending && cropVerticalMutation.variables === c.id ? (
                            <Loader2 className="h-2.5 w-2.5 animate-spin" />
                          ) : (
                            <Smartphone className="h-2.5 w-2.5" />
                          )}
                          {c.width === 1080 && c.height === 1920 ? 'Vertical' : 'Crop 9:16'}
                        </button>
                        {confirmDeleteId === c.id ? (
                          <>
                            <button
                              onClick={() => handleDelete(c.id)}
                              className="inline-flex items-center gap-1 rounded-md bg-destructive px-2 py-0.5 text-[9px] font-medium text-destructive-foreground"
                            >
                              Confirm?
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="text-[9px] text-muted-foreground hover:text-foreground"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setConfirmDeleteId(c.id)}
                            disabled={deleteMutation.isPending}
                            className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[9px] text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="h-2.5 w-2.5" />
                          </button>
                        )}
                      </div>
                      {/* Subtitle style picker */}
                      {subtitleClipId === c.id && (
                        <div className="mt-2 space-y-2 rounded-md border border-primary/30 bg-primary/5 p-2.5">
                          <p className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-wide text-primary">
                            <Captions className="h-2.5 w-2.5" />
                            Subtitle style
                          </p>
                          <div className="grid grid-cols-2 gap-1">
                            {SUBTITLE_STYLES.map((s) => (
                              <button
                                key={s.id}
                                onClick={() => setSelectedStyle(s.id)}
                                className={cn(
                                  'rounded-md border px-2 py-1.5 text-left text-[9px] transition-all',
                                  selectedStyle === s.id
                                    ? 'border-primary bg-primary/10'
                                    : 'border-border bg-background hover:border-primary/40',
                                )}
                              >
                                <p className="font-medium">{s.label}</p>
                                <p className="mt-0.5 text-[8px] text-muted-foreground">{s.description}</p>
                              </button>
                            ))}
                          </div>
                          <div className="flex items-center gap-1.5 pt-1">
                            <button
                              onClick={() => handleBurnSubtitles(c.id, selectedStyle)}
                              disabled={burnSubtitlesMutation.isPending}
                              className="inline-flex items-center gap-1 rounded-md bg-primary px-2.5 py-1 text-[9px] font-medium text-primary-foreground disabled:opacity-50"
                            >
                              {burnSubtitlesMutation.isPending ? (
                                <Loader2 className="h-2.5 w-2.5 animate-spin" />
                              ) : (
                                <Captions className="h-2.5 w-2.5" />
                              )}
                              Burn {SUBTITLE_STYLES.find((s) => s.id === selectedStyle)?.label}
                            </button>
                            <button
                              onClick={() => setSubtitleClipId(null)}
                              className="text-[9px] text-muted-foreground hover:text-foreground"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
