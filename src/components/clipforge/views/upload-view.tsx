'use client'

import * as React from 'react'
import {
  UploadCloud,
  FileVideo,
  X,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Film,
  Clock,
  Sparkles,
  ArrowRight,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useUploadVideo, useTranscribeVideo, useDetectHighlights, ApiClientError } from '@/hooks/use-clipforge-api'
import { useClipForgeStore } from '@/stores/clipforge-store'
import { useSettings } from '@/stores/settings-store'
import { ACCEPTED_VIDEO_EXTS, MAX_UPLOAD_BYTES } from '@/lib/clipforge/constants'
import { formatBytes } from '@/lib/clipforge/format'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

type UploadStatus = 'queued' | 'uploading' | 'transcribing' | 'done' | 'error'

interface QueuedFile {
  id: string
  file: File
  status: UploadStatus
  progress: number
  error?: string
  resultId?: string
}

function validateFile(file: File): string | null {
  if (file.size <= 0) return 'File is empty.'
  if (file.size > MAX_UPLOAD_BYTES) {
    return `File is ${formatBytes(file.size)} — exceeds the ${formatBytes(MAX_UPLOAD_BYTES)} limit.`
  }
  const ext = '.' + (file.name.split('.').pop() ?? '').toLowerCase()
  const extOk = (ACCEPTED_VIDEO_EXTS as readonly string[]).includes(ext)
  const mimeOk = file.type.startsWith('video/')
  if (!extOk && !mimeOk) {
    return `Unsupported type: ${file.type || ext}. Use one of: ${ACCEPTED_VIDEO_EXTS.join(', ')}`
  }
  return null
}

export function UploadView() {
  const [queue, setQueue] = React.useState<QueuedFile[]>([])
  const [isDragging, setIsDragging] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const uploadMutation = useUploadVideo()
  const transcribeMutation = useTranscribeVideo()
  const detectMutation = useDetectHighlights()
  const settings = useSettings()
  const openVideo = useClipForgeStore((s) => s.openVideo)
  const setView = useClipForgeStore((s) => s.setView)

  // Mirror queue in a ref so async callbacks can read the latest items
  // without depending on `queue` (avoids stale closures + re-creation churn).
  const queueRef = React.useRef<QueuedFile[]>([])
  React.useEffect(() => {
    queueRef.current = queue
  }, [queue])

  const processItem = React.useCallback(
    async (itemId: string) => {
      const target = queueRef.current.find((i) => i.id === itemId)
      if (!target) return
      const file = target.file

      setQueue((q) =>
        q.map((i) =>
          i.id === itemId ? { ...i, status: 'uploading', progress: 0, error: undefined } : i,
        ),
      )

      try {
        const result = await uploadMutation.mutateAsync({
          file,
          onProgress: (pct) => {
            setQueue((q) => q.map((i) => (i.id === itemId ? { ...i, progress: pct } : i)))
          },
        })

        // Auto-transcribe if enabled in settings.
        if (settings.autoTranscribe) {
          setQueue((q) =>
            q.map((i) =>
              i.id === itemId ? { ...i, status: 'transcribing', progress: 0, resultId: result.id } : i,
            ),
          )
          try {
            await transcribeMutation.mutateAsync({
              videoId: result.id,
              options: { modelSize: settings.defaultModelSize },
            })
            // Auto-detect highlights if enabled.
            if (settings.autoDetectHighlights) {
              await detectMutation.mutateAsync({
                videoId: result.id,
                options: {
                  maxHighlights: settings.defaultMaxHighlights,
                  minScore: settings.defaultMinScore,
                },
              })
              toast.success(`Processed ${file.name}`, {
                description: 'Transcribed & highlights detected.',
              })
            } else {
              toast.success(`Uploaded & transcribed ${file.name}`, {
                description: 'Ready for highlight detection.',
              })
            }
          } catch (te) {
            const tmsg = te instanceof ApiClientError ? te.message : (te as Error).message
            toast.warning(`Transcription failed: ${file.name}`, { description: tmsg })
          }
          setQueue((q) =>
            q.map((i) => (i.id === itemId ? { ...i, status: 'done', progress: 100 } : i)),
          )
        } else {
          setQueue((q) =>
            q.map((i) =>
              i.id === itemId ? { ...i, status: 'done', progress: 100, resultId: result.id } : i,
            ),
          )
          toast.success(`Uploaded ${file.name}`, { description: 'Ready for transcription.' })
        }
      } catch (e) {
        const msg = e instanceof ApiClientError ? e.message : (e as Error).message
        setQueue((q) => q.map((i) => (i.id === itemId ? { ...i, status: 'error', error: msg } : i)))
        toast.error(`Upload failed: ${file.name}`, { description: msg })
      }
    },
    [uploadMutation, transcribeMutation, detectMutation, settings.autoTranscribe, settings.autoDetectHighlights, settings.defaultModelSize, settings.defaultMaxHighlights, settings.defaultMinScore],
  )

  // Keep a ref to processItem so addFiles (stable) can call the latest version.
  const processItemRef = React.useRef(processItem)
  React.useEffect(() => {
    processItemRef.current = processItem
  }, [processItem])

  const addFiles = React.useCallback((fileList: FileList | File[]) => {
    const files = Array.from(fileList)
    const newItems: QueuedFile[] = files.map((file) => {
      const err = validateFile(file)
      return {
        id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
        file,
        status: (err ? 'error' : 'queued') as UploadStatus,
        progress: 0,
        error: err ?? undefined,
      }
    })

    // Update both the ref (for immediate reads) and state (for render).
    queueRef.current = [...newItems, ...queueRef.current]
    setQueue((q) => [...newItems, ...q])

    // Auto-start valid uploads sequentially.
    newItems
      .filter((i) => i.status === 'queued')
      .reduce<Promise<void>>(
        (p, item) => p.finally(() => processItemRef.current(item.id)),
        Promise.resolve(),
      )
  }, [])

  const onDrop = React.useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      if (e.dataTransfer.files.length > 0) addFiles(e.dataTransfer.files)
    },
    [addFiles],
  )

  const onPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) addFiles(e.target.files)
    e.target.value = '' // allow re-selecting same file
  }

  const removeItem = (id: string) => {
    queueRef.current = queueRef.current.filter((i) => i.id !== id)
    setQueue((q) => q.filter((i) => i.id !== id))
  }
  const retryItem = (id: string) => processItemRef.current(id)

  const completed = queue.filter((i) => i.status === 'done')

  return (
    <div className="space-y-6">
      {/* Dropzone */}
      <Card
        className={cn(
          'relative overflow-hidden border-2 border-dashed transition-all',
          isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40',
        )}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
      >
        {/* Animated conic ring on drag */}
        {isDragging && (
          <div className="pointer-events-none absolute -inset-px rounded-xl ring-conic-amber opacity-30" />
        )}
        <CardContent className="relative flex flex-col items-center justify-center gap-4 px-6 py-12 text-center sm:py-16">
          <div
            className={cn(
              'relative flex h-20 w-20 items-center justify-center rounded-full transition-all',
              isDragging ? 'scale-110 bg-primary/15' : 'bg-muted',
            )}
          >
            {isDragging ? (
              <UploadCloud className="h-9 w-9 animate-pulse-soft text-primary" />
            ) : (
              <UploadCloud className="h-9 w-9 text-muted-foreground" />
            )}
            <div className="pointer-events-none absolute inset-0 rounded-full border border-dashed border-primary/30" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-lg font-semibold">
              {isDragging ? 'Drop to upload' : 'Drag & drop your video here'}
            </h3>
            <p className="mx-auto max-w-md text-sm text-muted-foreground">
              or click below to browse. Supports{' '}
              <span className="font-medium text-foreground">{ACCEPTED_VIDEO_EXTS.join(', ')}</span>{' '}
              up to <span className="font-medium text-foreground">{formatBytes(MAX_UPLOAD_BYTES)}</span>.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button onClick={() => fileInputRef.current?.click()} className="gap-2">
              <FileVideo className="h-4 w-4" />
              Choose a video
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_VIDEO_EXTS.join(',')}
              multiple
              onChange={onPickerChange}
              className="hidden"
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-primary" />
              Auto thumbnail
            </span>
            <span className="flex items-center gap-1.5">
              <Film className="h-3 w-3 text-primary" />
              ffprobe metadata
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3 w-3 text-primary" />
              100% local
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Upload queue */}
      {queue.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Upload Queue</CardTitle>
            <div className="flex items-center gap-2">
              {completed.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setView('videos')}
                  className="gap-1 text-xs"
                >
                  View all videos
                  <ArrowRight className="h-3 w-3" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setQueue([])}
                className="text-xs text-muted-foreground hover:text-destructive"
              >
                Clear all
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {queue.map((item) => (
              <UploadRow
                key={item.id}
                item={item}
                onRemove={() => removeItem(item.id)}
                onRetry={() => retryItem(item.id)}
                onOpen={() => item.resultId && openVideo(item.resultId)}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Tips (when queue empty) */}
      {queue.length === 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          <TipCard
            icon={FileVideo}
            title="1. Upload"
            description="Drop a long-form MP4, MOV, MKV, or WebM. The file stays on your machine."
          />
          <TipCard
            icon={Sparkles}
            title="2. Auto-process"
            description={
              settings.autoTranscribe
                ? 'Auto-transcribe is ON — videos will be transcribed automatically after upload.'
                : 'Enable auto-transcribe in Settings to skip step 2.'
            }
          />
          <TipCard
            icon={ArrowRight}
            title="3. Process All"
            description="Open the video and click 'Process All' to run the full pipeline in one click."
          />
        </div>
      )}
    </div>
  )
}

function UploadRow({
  item,
  onRemove,
  onRetry,
  onOpen,
}: {
  item: QueuedFile
  onRemove: () => void
  onRetry: () => void
  onOpen: () => void
}) {
  const { file, status, progress, error } = item
  const ext = '.' + (file.name.split('.').pop() ?? '').toLowerCase()

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-lg border bg-card/40 p-3 transition-colors',
        status === 'error' ? 'border-destructive/40' : 'border-border',
      )}
    >
      <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
        {status === 'done' ? (
          <CheckCircle2 className="h-6 w-6 text-emerald-500" />
        ) : status === 'transcribing' ? (
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        ) : status === 'uploading' ? (
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        ) : status === 'error' ? (
          <AlertTriangle className="h-5 w-5 text-destructive" />
        ) : (
          <FileVideo className="h-5 w-5 text-muted-foreground" />
        )}
        <span className="absolute bottom-0 right-0 rounded-tl bg-black/60 px-1 py-0.5 text-[8px] font-bold uppercase text-white">
          {ext.slice(1)}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-medium">{file.name}</p>
          <span className="shrink-0 text-[11px] text-muted-foreground">{formatBytes(file.size)}</span>
        </div>
        <div className="mt-1.5">
          {status === 'uploading' && (
            <>
              <div className="mb-1 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>Uploading…</span>
                <span className="font-mono">{progress}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-primary transition-all duration-200 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </>
          )}
          {status === 'transcribing' && (
            <div className="flex items-center gap-2 text-[11px] text-amber-600 dark:text-amber-500">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Transcribing with Whisper…</span>
            </div>
          )}
          {status === 'done' && (
            <div className="flex items-center gap-2 text-[11px] text-emerald-600 dark:text-emerald-500">
              <CheckCircle2 className="h-3 w-3" />
              <span>Uploaded &amp; probed</span>
              <Button variant="link" size="sm" onClick={onOpen} className="h-auto p-0 text-[11px]">
                Open →
              </Button>
            </div>
          )}
          {status === 'error' && <p className="text-[11px] text-destructive">{error}</p>}
          {status === 'queued' && <p className="text-[11px] text-muted-foreground">Queued…</p>}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        {status === 'error' && (
          <Button variant="ghost" size="sm" onClick={onRetry} className="text-xs">
            Retry
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-destructive"
          onClick={onRemove}
          aria-label="Remove"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}

function TipCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}) {
  return (
    <Card className="group transition-all hover:border-primary/40">
      <CardContent className="flex flex-col gap-2 p-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-110">
          <Icon className="h-4 w-4" />
        </div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-[11px] leading-relaxed text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
