'use client'

import * as React from 'react'
import { Activity, Database, Cpu, Film, HardDrive, CircleAlert, CheckCircle2, Circle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useHealth } from '@/hooks/use-clipforge-api'
import type { ComponentHealth, HealthStatus } from '@/types/clipforge/api-schemas'
import { cn } from '@/lib/utils'

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  database: Database,
  ffmpeg: Film,
  ffprobe: Cpu,
  python: Cpu,
  whisper: Activity,
  disk: HardDrive,
}

function StatusIcon({ status }: { status: HealthStatus }) {
  if (status === 'ok') return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
  if (status === 'degraded') return <CircleAlert className="h-3.5 w-3.5 text-amber-500" />
  return <Circle className="h-3.5 w-3.5 text-destructive" />
}

function dotClass(status: HealthStatus) {
  return cn(
    'inline-block h-2 w-2 rounded-full',
    status === 'ok' && 'bg-emerald-500',
    status === 'degraded' && 'bg-amber-500 animate-pulse-soft',
    status === 'down' && 'bg-destructive animate-pulse',
  )
}

/**
 * SystemStatusCard — live health monitor shown on the dashboard.
 * Polls /api/health every 30s.
 */
export function SystemStatusCard() {
  const { data, isLoading, isError } = useHealth()

  const overall = data?.status ?? 'down'
  const overallTone =
    overall === 'ok'
      ? 'text-emerald-500'
      : overall === 'degraded'
        ? 'text-amber-500'
        : 'text-destructive'

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          <CardTitle className="text-sm font-medium">System Status</CardTitle>
        </div>
        <div className="flex items-center gap-2 text-xs">
          {isLoading ? (
            <span className="text-muted-foreground">Checking…</span>
          ) : isError ? (
            <span className="text-destructive">unreachable</span>
          ) : (
            <>
              <span className={cn('h-2 w-2 rounded-full', dotClass(overall))} />
              <span className={cn('font-medium capitalize', overallTone)}>{overall}</span>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-full" />
          ))
        ) : isError ? (
          <p className="py-6 text-center text-xs text-muted-foreground">
            Could not reach <code className="rounded bg-muted px-1 py-0.5 text-[10px]">/api/health</code>.
            Make sure the dev server is running.
          </p>
        ) : (
          data?.components.map((c: ComponentHealth) => {
            const Icon = ICONS[c.name] ?? Cpu
            return (
              <div
                key={c.name}
                className="group flex items-center gap-3 rounded-md border border-transparent px-2.5 py-1.5 transition-colors hover:border-border hover:bg-muted/40"
              >
                <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground group-hover:text-foreground" />
                <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-medium capitalize leading-tight">{c.name}</p>
                    <p className="truncate text-[10px] text-muted-foreground" title={c.detail}>
                      {c.version ?? c.detail ?? '—'}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <StatusIcon status={c.status} />
                    <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                      {c.status}
                    </span>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
