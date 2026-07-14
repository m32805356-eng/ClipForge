'use client'

import * as React from 'react'
import { Construction } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useClipForgeStore } from '@/stores/clipforge-store'

interface PlaceholderViewProps {
  view: 'upload' | 'videos' | 'video-detail' | 'clips' | 'settings'
  phase: number
  title: string
  description: string
}

/**
 * Lightweight placeholder for views not yet implemented in Step 1.
 * Replaced feature-by-feature in subsequent steps.
 */
export function PlaceholderView({ phase, title, description }: PlaceholderViewProps) {
  const setView = useClipForgeStore((s) => s.setView)
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center gap-4 px-6 py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <Construction className="h-6 w-6 text-primary" />
        </div>
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            Phase {phase} · Coming next
          </div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="mx-auto max-w-md text-sm text-muted-foreground">{description}</p>
        </div>
        <button
          onClick={() => setView('dashboard')}
          className="text-xs text-primary underline-offset-4 hover:underline"
        >
          ← Back to dashboard
        </button>
      </CardContent>
    </Card>
  )
}
