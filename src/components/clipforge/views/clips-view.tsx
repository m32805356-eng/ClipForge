'use client'

import * as React from 'react'
import {
  Scissors,
  Search,
  Download,
  ExternalLink,
  Film,
  Trash2,
  Inbox,
  Clock,
  HardDrive,
  Loader2,
  Captions,
  Smartphone,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { useClips, useDeleteClip } from '@/hooks/use-clipforge-api'
import { useClipForgeStore } from '@/stores/clipforge-store'
import { formatBytes, formatDuration, formatRelativeTime } from '@/lib/clipforge/format'
import { HIGHLIGHT_CATEGORIES } from '@/lib/clipforge/constants'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const STATUS_TONE: Record<string, string> = {
  READY: 'bg-emerald-500/15 text-emerald-500',
  QUEUED: 'bg-muted text-muted-foreground',
  CUTTING: 'bg-amber-500/15 text-amber-500',
  CROPPING: 'bg-amber-500/15 text-amber-500',
  SUBTITLING: 'bg-amber-500/15 text-amber-500',
  RENDERING: 'bg-amber-500/15 text-amber-500',
  FAILED: 'bg-destructive/15 text-destructive',
}

export function ClipsView() {
  const [search, setSearch] = React.useState('')
  const [debounced, setDebounced] = React.useState('')
  const [confirmDeleteId, setConfirmDeleteId] = React.useState<string | null>(null)
  const { data, isLoading, isError } = useClips({ pageSize: 100 })
  const deleteMutation = useDeleteClip()
  const openVideo = useClipForgeStore((s) => s.openVideo)
  const setView = useClipForgeStore((s) => s.setView)

  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 300)
    return () => clearTimeout(t)
  }, [search])

  const allClips = data?.items ?? []
  const clips = debounced
    ? allClips.filter((c) => c.title.toLowerCase().includes(debounced.toLowerCase()))
    : allClips

  const handleDelete = async (clipId: string) => {
    try {
      await deleteMutation.mutateAsync(clipId)
      toast.success('Clip deleted')
      setConfirmDeleteId(null)
    } catch (e) {
      toast.error('Delete failed', { description: (e as Error).message })
    }
  }

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clips by title…"
            className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
        <Button onClick={() => setView('videos')} variant="outline" className="gap-2">
          <Film className="h-4 w-4" />
          Browse videos
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <Scissors className="h-4 w-4 text-primary" />
            All Clips
            {data && <Badge variant="secondary" className="text-[9px]">{data.total}</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isError ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center text-sm text-destructive">
              Failed to load clips.
            </div>
          ) : isLoading ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          ) : clips.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-muted/20 px-6 py-14 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted ring-4 ring-background">
                <Inbox className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  {debounced ? 'No matches' : 'No clips yet'}
                </p>
                <p className="max-w-xs text-xs text-muted-foreground">
                  {debounced
                    ? `No clips match "${debounced}".`
                    : 'Open a video, detect highlights, then generate clips.'}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setView('videos')} className="mt-1 gap-2">
                <Film className="h-3.5 w-3.5" />
                Go to videos
              </Button>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {clips.map((c) => {
                const cat = c.highlight?.category
                const catMeta = HIGHLIGHT_CATEGORIES.find((x) => x.id === cat)
                const color = catMeta?.color
                const tone = STATUS_TONE[c.status] ?? STATUS_TONE.QUEUED
                return (
                  <div
                    key={c.id}
                    className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card/40 transition-all hover:border-primary/40 hover:shadow-md"
                  >
                    {/* Thumbnail */}
                    <a
                      href={`/api/files/${c.filePath}`}
                      target="_blank"
                      rel="noreferrer"
                      className="relative block aspect-[3/4] overflow-hidden bg-muted"
                    >
                      {c.thumbnail ? (
                        <img
                          src={`/api/files/${c.thumbnail}`}
                          alt={c.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Film className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      {/* Duration badge */}
                      <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white">
                        {formatDuration(c.duration)}
                      </span>
                      {/* Category dot */}
                      {color && (
                        <span
                          className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-black/60 px-1.5 py-0.5 text-[9px] font-medium uppercase text-white"
                        >
                          <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
                          {cat}
                        </span>
                      )}
                      {/* Status badge */}
                      <span className={cn('absolute top-2 right-2 rounded-full px-1.5 py-0.5 text-[8px] font-semibold uppercase', tone)}>
                        {c.status}
                      </span>
                      {/* Subtitle badge */}
                      {c.hasSubtitles && (
                        <span className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-primary/90 px-1.5 py-0.5 text-[8px] font-medium uppercase text-primary-foreground">
                          <Captions className="h-2 w-2" />
                          {c.subtitleStyle ?? 'sub'}
                        </span>
                      )}
                      {/* Vertical badge */}
                      {c.width === 1080 && c.height === 1920 && (
                        <span className="absolute bottom-2 right-12 flex items-center gap-1 rounded-full bg-emerald-500/90 px-1.5 py-0.5 text-[8px] font-medium uppercase text-white">
                          <Smartphone className="h-2 w-2" />
                          9:16
                        </span>
                      )}
                    </a>

                    {/* Body */}
                    <div className="flex flex-1 flex-col p-3">
                      <p className="line-clamp-2 text-xs font-medium leading-tight">{c.title}</p>
                      <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-0.5">
                          <HardDrive className="h-2.5 w-2.5" />
                          {formatBytes(c.sizeBytes)}
                        </span>
                        <span>·</span>
                        <span>{c.width}×{c.height}</span>
                      </p>
                      {c.video && (
                        <button
                          onClick={() => openVideo(c.video!.id)}
                          className="mt-1.5 truncate text-left text-[10px] text-primary hover:underline"
                          title={c.video.filename}
                        >
                          from {c.video.filename}
                        </button>
                      )}

                      {/* Actions */}
                      <div className="mt-auto flex items-center gap-1.5 pt-2.5">
                        <a
                          href={`/api/files/${c.filePath}`}
                          download
                          className="inline-flex flex-1 items-center justify-center gap-1 rounded-md bg-primary px-2 py-1 text-[10px] font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                        >
                          <Download className="h-3 w-3" />
                          Download
                        </a>
                        <a
                          href={`/api/files/${c.filePath}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center rounded-md border border-border bg-background px-2 py-1 text-[10px] font-medium transition-colors hover:bg-muted"
                          aria-label="Open in new tab"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                        {confirmDeleteId === c.id ? (
                          <button
                            onClick={() => handleDelete(c.id)}
                            disabled={deleteMutation.isPending}
                            className="inline-flex items-center gap-1 rounded-md bg-destructive px-2 py-1 text-[10px] font-medium text-destructive-foreground"
                          >
                            {deleteMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : 'OK?'}
                          </button>
                        ) : (
                          <button
                            onClick={() => setConfirmDeleteId(c.id)}
                            className="inline-flex items-center justify-center rounded-md border border-border bg-background px-2 py-1 text-[10px] text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                            aria-label="Delete clip"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
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
    </div>
  )
}
