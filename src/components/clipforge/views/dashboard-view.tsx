'use client'

import * as React from 'react'
import {
  Upload as UploadIcon,
  FileVideo,
  Link2,
  Sparkles,
  Scissors,
  Captions,
  Edit3,
  Volume2,
  Music,
  Crop,
  Film,
  Anchor,
  Gem,
  Globe,
  FileText,
  Play,
  Clock,
  Loader2,
  ChevronRight,
  Bell,
  Zap,
  Database,
  HardDrive,
  Film as FilmIcon,
  TrendingUp,
  ArrowRight,
  Plus,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useClipForgeStore } from '@/stores/clipforge-store'
import { useStats, useVideos, useHealth, useDownloadFromUrl, ApiClientError } from '@/hooks/use-clipforge-api'
import { formatBytes, formatDuration, formatRelativeTime } from '@/lib/clipforge/format'
import { SystemStatusCard } from '@/components/clipforge/system-status-card'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import type { VideoStatus } from '@prisma/client'

const STATUS_META: Record<VideoStatus, { label: string; tone: string }> = {
  UPLOADED: { label: 'Uploaded', tone: 'bg-muted text-muted-foreground' },
  PROBING: { label: 'Processing', tone: 'bg-amber-500/15 text-amber-500' },
  EXTRACTING_AUDIO: { label: 'Processing', tone: 'bg-amber-500/15 text-amber-500' },
  TRANSCRIBING: { label: 'Processing', tone: 'bg-amber-500/15 text-amber-500' },
  ANALYZING: { label: 'Processing', tone: 'bg-amber-500/15 text-amber-500' },
  READY: { label: 'Ready', tone: 'bg-emerald-500/15 text-emerald-500' },
  FAILED: { label: 'Failed', tone: 'bg-destructive/15 text-destructive' },
}

interface FeatureCard {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  badge?: 'new' | 'beta'
  view: 'upload' | 'videos' | 'clips' | 'settings' | 'dashboard'
  description: string
}

const FEATURES: FeatureCard[] = [
  { id: 'long-to-shorts', label: 'Long to shorts', icon: Sparkles, badge: 'new', view: 'upload', description: 'Turn long videos into short clips' },
  { id: 'ai-captions', label: 'AI Captions', icon: Captions, badge: 'new', view: 'clips', description: 'Burn-in animated subtitles' },
  { id: 'video-editor', label: 'Video editor', icon: Edit3, badge: 'new', view: 'videos', description: 'Edit & refine your clips' },
  { id: 'enhance-speech', label: 'Enhance speech', icon: Volume2, badge: 'new', view: 'videos', description: 'Clean up audio quality' },
  { id: 'ai-sound-effect', label: 'AI Sound Effect', icon: Music, badge: 'new', view: 'clips', description: 'Add auto sound effects' },
  { id: 'ai-reframe', label: 'AI Reframe', icon: Crop, badge: 'new', view: 'clips', description: 'Auto-crop to vertical' },
  { id: 'ai-broll', label: 'AI Image B-Roll', icon: Film, badge: 'new', view: 'clips', description: 'Insert AI B-roll images' },
  { id: 'ai-hook', label: 'AI hook', icon: Anchor, badge: 'new', view: 'upload', description: 'Generate hook intros' },
  { id: 'upscale', label: 'Upscale', icon: Gem, badge: 'new', view: 'clips', description: 'Boost resolution' },
  { id: 'video-dubbing', label: 'Video dubbing', icon: Globe, badge: 'new', view: 'videos', description: 'Translate & dub audio' },
  { id: 'script-to-video', label: 'Script to video', icon: FileText, badge: 'new', view: 'upload', description: 'Generate video from script' },
]

export function DashboardView() {
  const setView = useClipForgeStore((s) => s.setView)
  const openVideo = useClipForgeStore((s) => s.openVideo)
  const statsQ = useStats()
  const videosQ = useVideos({ pageSize: 6 })
  const downloadMutation = useDownloadFromUrl()
  const [linkUrl, setLinkUrl] = React.useState('')

  const stats = statsQ.data
  const videos = videosQ.data?.items ?? []

  const handleLinkSubmit = async () => {
    const url = linkUrl.trim()
    if (!url) {
      toast.error('Please paste a video link first')
      return
    }
    try {
      new URL(url) // validate
    } catch {
      toast.error('Invalid URL', { description: 'Please paste a valid http(s) link.' })
      return
    }
    try {
      toast.info('Downloading…', { description: `Fetching ${url.slice(0, 60)}…` })
      const result = await downloadMutation.mutateAsync(url)
      toast.success(`Downloaded "${result.filename}"`, {
        description: `${result.duration?.toFixed(0) ?? '?'}s · ${result.width}×${result.height}`,
      })
      setLinkUrl('')
      openVideo(result.id)
    } catch (e) {
      const msg = e instanceof ApiClientError ? e.message : (e as Error).message
      toast.error('Download failed', { description: msg })
    }
  }

  return (
    <div className="space-y-6">
      {/* Upload CTA panel (Opus Clip style) */}
      <Card className="relative overflow-hidden border-border">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-fuchsia-500/5" />
        <CardContent className="relative p-5 sm:p-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-base font-semibold sm:text-lg">Get clips in 1 click</h2>
            </div>

            {/* Link input row */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="Drop a YouTube / Vimeo link…"
                  className="h-10 w-full rounded-lg border border-border bg-background/60 pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleLinkSubmit()
                  }}
                />
              </div>
              <Button onClick={() => setView('upload')} variant="outline" className="gap-2">
                <UploadIcon className="h-4 w-4" />
                Upload file
              </Button>
              <Button onClick={handleLinkSubmit} disabled={downloadMutation.isPending} className="gap-2">
                {downloadMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Zap className="h-4 w-4" />
                )}
                {downloadMutation.isPending ? 'Downloading…' : 'Get clips in 1 click'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature grid (Opus Clip circular cards) */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <h3 className="text-sm font-semibold">Tools</h3>
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground">Click to launch</span>
        </div>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-11">
          {FEATURES.map((f) => {
            const Icon = f.icon
            return (
              <button
                key={f.id}
                onClick={() => setView(f.view)}
                className="group flex flex-col items-center gap-2 rounded-xl p-3 transition-all hover:bg-muted/40"
                title={f.description}
              >
                <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary/15 to-primary/5 ring-1 ring-primary/20 transition-all group-hover:scale-110 group-hover:ring-primary/40">
                  <Icon className="h-6 w-6 text-primary" />
                  {f.badge && (
                    <span className="absolute -right-1 -top-1 rounded-full bg-primary px-1 py-0.5 text-[7px] font-bold uppercase text-primary-foreground">
                      {f.badge}
                    </span>
                  )}
                </div>
                <span className="text-center text-[10px] font-medium leading-tight">{f.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Source Videos"
          icon={FilmIcon}
          accent="text-primary"
          isLoading={statsQ.isLoading}
          value={stats ? String(stats.videos.total) : '0'}
          hint={stats ? `${stats.videos.ready} ready` : 'uploaded'}
          onClick={() => setView('videos')}
        />
        <StatCard
          label="Clips"
          icon={Scissors}
          accent="text-emerald-500"
          isLoading={statsQ.isLoading}
          value={stats ? String(stats.clips.total) : '0'}
          hint={stats ? `${stats.clips.ready} ready` : 'ready'}
          onClick={() => setView('clips')}
        />
        <StatCard
          label="Highlights"
          icon={Sparkles}
          accent="text-amber-500"
          isLoading={statsQ.isLoading}
          value={stats ? String(stats.highlights.total) : '0'}
          hint="detected"
        />
        <StatCard
          label="Storage"
          icon={HardDrive}
          accent="text-fuchsia-500"
          isLoading={statsQ.isLoading}
          value={stats ? formatBytes(stats.storage.totalBytes) : '0 B'}
          hint="local disk"
        />
      </div>

      {/* Projects section */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Project cards (2/3 width) */}
        <Card className="lg:col-span-2">
          <CardContent className="p-5">
            {/* Tabs + storage */}
            <div className="mb-4 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1">
                <button className="rounded-md bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  All projects ({videos.length})
                </button>
                <button className="rounded-md px-3 py-1 text-xs font-medium text-muted-foreground hover:text-foreground">
                  Saved (0)
                </button>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Database className="h-3 w-3" />
                  {stats ? formatBytes(stats.storage.totalBytes) : '0 B'} / ∞
                </span>
              </div>
            </div>

            {/* Project grid */}
            {videosQ.isLoading ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-36 w-full" />
                ))}
              </div>
            ) : videos.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-muted/20 px-6 py-12 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 ring-4 ring-background">
                  <UploadIcon className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">No projects yet</p>
                  <p className="max-w-xs text-xs text-muted-foreground">
                    Upload a video to create your first project.
                  </p>
                </div>
                <Button size="sm" onClick={() => setView('upload')} className="mt-1 gap-2">
                  <Plus className="h-3.5 w-3.5" />
                  New project
                </Button>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {videos.map((v) => {
                  const meta = STATUS_META[v.status as VideoStatus] ?? STATUS_META.UPLOADED
                  const inFlight = v.status !== 'READY' && v.status !== 'FAILED' && v.status !== 'UPLOADED'
                  return (
                    <button
                      key={v.id}
                      onClick={() => openVideo(v.id)}
                      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card/40 text-left transition-all hover:border-primary/40 hover:shadow-md"
                    >
                      {/* Thumbnail */}
                      <div className="relative aspect-video overflow-hidden bg-muted">
                        {v.thumbnail ? (
                          <img
                            src={`/api/files/${v.thumbnail}`}
                            alt={v.filename}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <FilmIcon className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        {v.duration != null && (
                          <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white">
                            {formatDuration(v.duration)}
                          </span>
                        )}
                        {inFlight && (
                          <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-amber-500/90 px-2 py-0.5 text-[9px] font-medium text-white">
                            <Loader2 className="h-2.5 w-2.5 animate-spin" />
                            {v.progress}% · ETA {Math.max(1, Math.round((100 - v.progress) / 10))}m
                          </span>
                        )}
                        {!inFlight && (
                          <span className={cn('absolute left-2 top-2 rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase', meta.tone)}>
                            {meta.label}
                          </span>
                        )}
                        {v.clipCount > 0 && (
                          <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/70 px-1.5 py-0.5 text-[9px] font-medium text-white">
                            <Scissors className="h-2.5 w-2.5" />
                            {v.clipCount}
                          </span>
                        )}
                      </div>
                      {/* Body */}
                      <div className="flex items-center justify-between gap-2 p-2.5">
                        <p className="min-w-0 truncate text-xs font-medium">{v.filename}</p>
                        <span className="shrink-0 text-[10px] text-muted-foreground">
                          {formatRelativeTime(v.createdAt)}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* System status (1/3 width) */}
        <SystemStatusCard />
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  accent,
  isLoading,
  onClick,
}: {
  label: string
  value: string
  hint: string
  icon: React.ComponentType<{ className?: string }>
  accent: string
  isLoading?: boolean
  onClick?: () => void
}) {
  const Wrapper = onClick ? 'button' : 'div'
  return (
    <Wrapper
      onClick={onClick}
      className={cn(
        'group relative flex items-center gap-3 overflow-hidden rounded-xl border border-border bg-card/40 p-3 text-left transition-all',
        onClick && 'hover:border-primary/40 hover:bg-primary/5',
      )}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon className={cn('h-4 w-4 transition-transform group-hover:scale-110', accent)} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        {isLoading ? (
          <Skeleton className="mt-0.5 h-5 w-10" />
        ) : (
          <p className="truncate text-lg font-semibold tracking-tight">{value}</p>
        )}
        <p className="truncate text-[9px] text-muted-foreground">{hint}</p>
      </div>
      {onClick && (
        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      )}
    </Wrapper>
  )
}
