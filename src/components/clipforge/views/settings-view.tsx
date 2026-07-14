'use client'

import * as React from 'react'
import {
  Settings as SettingsIcon,
  Cpu,
  Captions,
  Scissors,
  Sparkles,
  Clock,
  HardDrive,
  RotateCcw,
  Database,
  Zap,
  Eye,
  Check,
  Loader2,
  HardDriveDownload,
  AlertTriangle,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useSettings, MODEL_OPTIONS, type WhisperModelSize } from '@/stores/settings-store'
import { useHealth } from '@/hooks/use-clipforge-api'
import { SUBTITLE_STYLES } from '@/lib/clipforge/constants'
import { formatBytes } from '@/lib/clipforge/format'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export function SettingsView() {
  const s = useSettings()
  const { data: health } = useHealth()

  const whisperComponent = health?.components.find((c) => c.name === 'whisper')
  const diskComponent = health?.components.find((c) => c.name === 'disk')
  const dbComponent = health?.components.find((c) => c.name === 'database')

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <SettingsIcon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Settings</h2>
            <p className="text-xs text-muted-foreground">Configure your local ClipForge instance</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            s.reset()
            toast.success('Settings reset to defaults')
          }}
          className="gap-2 text-xs"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </Button>
      </div>

      {/* Transcription defaults */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <Cpu className="h-4 w-4 text-primary" />
            Transcription
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Default model */}
          <div className="space-y-2">
            <label className="text-xs font-medium">Default Whisper model</label>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {MODEL_OPTIONS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => s.setDefaultModelSize(m.id as WhisperModelSize)}
                  className={cn(
                    'group relative rounded-lg border p-3 text-left transition-all',
                    s.defaultModelSize === m.id
                      ? 'border-primary bg-primary/5 ring-1 ring-primary'
                      : 'border-border hover:border-primary/40',
                  )}
                >
                  {s.defaultModelSize === m.id && (
                    <Check className="absolute right-2 top-2 h-3.5 w-3.5 text-primary" />
                  )}
                  <p className="text-sm font-medium">{m.label}</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">{m.description}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    <Badge variant="secondary" className="text-[8px]">{m.speed}</Badge>
                    <Badge variant="secondary" className="text-[8px]">{m.size}</Badge>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Auto-transcribe */}
          <SettingRow
            icon={Zap}
            title="Auto-transcribe after upload"
            description="Automatically start transcription when a video finishes uploading"
          >
            <Switch checked={s.autoTranscribe} onCheckedChange={s.setAutoTranscribe} />
          </SettingRow>

          <Separator />

          {/* Auto-detect highlights */}
          <SettingRow
            icon={Sparkles}
            title="Auto-detect highlights after transcription"
            description="Run highlight detection automatically once transcription completes"
          >
            <Switch checked={s.autoDetectHighlights} onCheckedChange={s.setAutoDetectHighlights} />
          </SettingRow>
        </CardContent>
      </Card>

      {/* Clip defaults */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <Scissors className="h-4 w-4 text-primary" />
            Clip Generation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Default subtitle style */}
          <div className="space-y-2">
            <label className="text-xs font-medium">Default subtitle style</label>
            <Select value={s.defaultSubtitleStyle} onValueChange={s.setDefaultSubtitleStyle}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SUBTITLE_STYLES.map((style) => (
                  <SelectItem key={style.id} value={style.id}>
                    {style.label} — {style.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Pad seconds */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs font-medium">
                <Clock className="h-3 w-3" />
                Clip padding (seconds)
              </label>
              <span className="font-mono text-xs text-primary">{s.defaultPadSeconds.toFixed(1)}s</span>
            </div>
            <Slider
              value={[s.defaultPadSeconds]}
              onValueChange={(v) => s.setDefaultPadSeconds(v[0])}
              min={0}
              max={5}
              step={0.5}
              className="w-full"
            />
            <p className="text-[10px] text-muted-foreground">
              Extra time added before and after each highlight when cutting clips
            </p>
          </div>

          <Separator />

          {/* Max highlights */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium">Max highlights per video</label>
              <span className="font-mono text-xs text-primary">{s.defaultMaxHighlights}</span>
            </div>
            <Slider
              value={[s.defaultMaxHighlights]}
              onValueChange={(v) => s.setDefaultMaxHighlights(v[0])}
              min={3}
              max={30}
              step={1}
              className="w-full"
            />
          </div>

          <Separator />

          {/* Min score */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium">Minimum highlight score</label>
              <span className="font-mono text-xs text-primary">{Math.round(s.defaultMinScore * 100)}%</span>
            </div>
            <Slider
              value={[s.defaultMinScore * 100]}
              onValueChange={(v) => s.setDefaultMinScore(v[0] / 100)}
              min={10}
              max={80}
              step={5}
              className="w-full"
            />
            <p className="text-[10px] text-muted-foreground">
              Highlights below this confidence score are discarded
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Display preferences */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <Eye className="h-4 w-4 text-primary" />
            Display
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SettingRow
            icon={Clock}
            title="Show timestamps in transcript"
            description="Display start time next to each transcript segment"
          >
            <Switch checked={s.showTimestamps} onCheckedChange={s.setShowTimestamps} />
          </SettingRow>
        </CardContent>
      </Card>

      {/* System info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <Database className="h-4 w-4 text-primary" />
            System
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <SystemRow
            icon={Cpu}
            label="Whisper"
            status={whisperComponent?.status ?? 'unknown'}
            detail={whisperComponent?.version ?? whisperComponent?.detail ?? '—'}
          />
          <SystemRow
            icon={Database}
            label="Database"
            status={dbComponent?.status ?? 'unknown'}
            detail={dbComponent?.detail ?? '—'}
          />
          <SystemRow
            icon={HardDrive}
            label="Disk"
            status={diskComponent?.status ?? 'unknown'}
            detail={diskComponent?.version ?? diskComponent?.detail ?? '—'}
          />
          <Separator />
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">ClipForge version</span>
            <span className="font-mono">v0.1.0 · local</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Pipeline</span>
            <span className="font-mono">FFmpeg 7.1 · faster-whisper 1.2</span>
          </div>
        </CardContent>
      </Card>

      {/* Danger zone */}
      <Card className="border-destructive/30">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-destructive">
            <AlertTriangle className="h-4 w-4" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-medium">Clear local settings</p>
              <p className="mt-0.5 text-[10px] text-muted-foreground">
                Reset all preferences to defaults. Does not affect your videos or clips.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="shrink-0 gap-2 text-xs"
              onClick={() => {
                if (confirm('Reset all settings to defaults?')) {
                  s.reset()
                  toast.success('Settings reset')
                }
              }}
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function SettingRow({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex min-w-0 items-start gap-3">
        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
        <div className="min-w-0">
          <p className="text-xs font-medium">{title}</p>
          <p className="mt-0.5 text-[10px] text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

function SystemRow({
  icon: Icon,
  label,
  status,
  detail,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  status: string
  detail: string
}) {
  const tone =
    status === 'ok'
      ? 'text-emerald-500'
      : status === 'degraded'
        ? 'text-amber-500'
        : status === 'down'
          ? 'text-destructive'
          : 'text-muted-foreground'

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <div className="flex min-w-0 items-center gap-2">
        <span className="truncate text-[10px] text-muted-foreground" title={detail}>
          {detail}
        </span>
        <span className={cn('shrink-0 text-[10px] font-semibold uppercase', tone)}>{status}</span>
      </div>
    </div>
  )
}
