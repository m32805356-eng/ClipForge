'use client'

import * as React from 'react'
import { Film, Search, Upload, Clock, Scissors, ArrowRight, Inbox } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useClipForgeStore } from '@/stores/clipforge-store'
import { useVideos } from '@/hooks/use-clipforge-api'
import { formatBytes, formatDurationCompact, formatRelativeTime } from '@/lib/clipforge/format'
import { cn } from '@/lib/utils'
import type { VideoStatus } from '@prisma/client'

const STATUS_META: Record<VideoStatus, { label: string; tone: string; dot: string }> = {
  UPLOADED: { label: 'Uploaded', tone: 'bg-muted text-muted-foreground', dot: 'bg-muted-foreground' },
  PROBING: { label: 'Probing', tone: 'bg-amber-500/15 text-amber-500', dot: 'bg-amber-500' },
  EXTRACTING_AUDIO: { label: 'Extracting audio', tone: 'bg-amber-500/15 text-amber-500', dot: 'bg-amber-500' },
  TRANSCRIBING: { label: 'Transcribing', tone: 'bg-amber-500/15 text-amber-500', dot: 'bg-amber-500' },
  ANALYZING: { label: 'Analyzing', tone: 'bg-amber-500/15 text-amber-500', dot: 'bg-amber-500' },
  READY: { label: 'Ready', tone: 'bg-emerald-500/15 text-emerald-500', dot: 'bg-emerald-500' },
  FAILED: { label: 'Failed', tone: 'bg-destructive/15 text-destructive', dot: 'bg-destructive' },
}

export function VideosView() {
  const setView = useClipForgeStore((s) => s.setView)
  const openVideo = useClipForgeStore((s) => s.openVideo)
  const [search, setSearch] = React.useState('')
  const [debounced, setDebounced] = React.useState('')

  // Debounce search by 300ms
  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 300)
    return () => clearTimeout(t)
  }, [search])

  const { data, isLoading, isError } = useVideos({ pageSize: 50, search: debounced || undefined })
  const videos = data?.items ?? []

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by filename…"
            className="pl-9"
          />
        </div>
        <Button onClick={() => setView('upload')} className="gap-2">
          <Upload className="h-4 w-4" />
          New upload
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium">All Videos</CardTitle>
          <span className="text-xs text-muted-foreground">
            {data ? `${data.total} total` : '—'}
          </span>
        </CardHeader>
        <CardContent>
          {isError ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center text-sm text-destructive">
              Failed to load videos. Check that the dev server is running.
            </div>
          ) : isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : videos.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-muted/20 px-6 py-14 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted ring-4 ring-background">
                <Inbox className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  {debounced ? 'No matches' : 'No videos yet'}
                </p>
                <p className="max-w-xs text-xs text-muted-foreground">
                  {debounced
                    ? `No videos match "${debounced}".`
                    : 'Upload a long-form video to begin the pipeline.'}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setView('upload')} className="mt-1 gap-2">
                <Upload className="h-3.5 w-3.5" />
                Upload video
              </Button>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {videos.map((v) => {
                const meta = STATUS_META[v.status as VideoStatus] ?? STATUS_META.UPLOADED
                const inFlight = v.status !== 'READY' && v.status !== 'FAILED' && v.status !== 'UPLOADED'
                return (
                  <li key={v.id}>
                    <button
                      onClick={() => openVideo(v.id)}
                      className="group flex w-full items-center gap-4 py-3 text-left transition-colors hover:bg-muted/30"
                    >
                      {/* Thumb */}
                      <div className="relative h-14 w-24 shrink-0 overflow-hidden rounded-md bg-muted ring-1 ring-border">
                        {v.thumbnail ? (
                          <img src={`/api/files/${v.thumbnail}`} alt={v.filename} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <Film className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                        {v.duration != null && (
                          <span className="absolute bottom-0.5 right-0.5 rounded bg-black/70 px-1 py-0.5 text-[9px] font-medium text-white">
                            {formatDurationCompact(v.duration)}
                          </span>
                        )}
                      </div>

                      {/* Meta */}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium group-hover:text-primary">
                          {v.filename}
                        </p>
                        <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatRelativeTime(v.createdAt)}
                          </span>
                          <span>·</span>
                          <span>{formatBytes(v.sizeBytes)}</span>
                          {v.width && v.height && (
                            <>
                              <span>·</span>
                              <span>{v.width}×{v.height}</span>
                            </>
                          )}
                          {v.clipCount > 0 && (
                            <>
                              <span>·</span>
                              <span className="flex items-center gap-1">
                                <Scissors className="h-3 w-3" />
                                {v.clipCount} clips
                              </span>
                            </>
                          )}
                        </p>
                      </div>

                      {/* Status + progress */}
                      <div className="flex shrink-0 flex-col items-end gap-1.5">
                        <span className={cn('inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[10px] font-medium', meta.tone)}>
                          <span className={cn('h-1.5 w-1.5 rounded-full', meta.dot, inFlight && 'animate-pulse')} />
                          {meta.label}
                        </span>
                        {inFlight && (
                          <div className="h-1 w-20 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full bg-primary transition-all"
                              style={{ width: `${v.progress}%` }}
                            />
                          </div>
                        )}
                      </div>

                      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
