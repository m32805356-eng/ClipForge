'use client'

import * as React from 'react'
import { Menu, Moon, Sun, Bell, Zap, Plus, Command } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { useClipForgeStore } from '@/stores/clipforge-store'

const VIEW_TITLES: Record<string, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard', subtitle: 'Your AI video clipping workspace' },
  upload: { title: 'Upload', subtitle: 'Add a new source video to begin' },
  videos: { title: 'Projects', subtitle: 'Your uploaded video library' },
  'video-detail': { title: 'Editor', subtitle: 'Transcript, highlights & clips' },
  clips: { title: 'Clips', subtitle: 'Vertical social-ready outputs' },
  settings: { title: 'Settings', subtitle: 'Preferences & model configuration' },
}

export function Header() {
  const view = useClipForgeStore((s) => s.view)
  const toggleSidebar = useClipForgeStore((s) => s.toggleSidebar)
  const setView = useClipForgeStore((s) => s.setView)
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  const meta = VIEW_TITLES[view] ?? VIEW_TITLES.dashboard

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border glass px-4 sm:px-6">
      {/* Mobile menu */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={toggleSidebar}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex min-w-0 flex-1 flex-col">
        <h1 className="truncate text-sm font-semibold leading-tight sm:text-base">
          {meta.title}
        </h1>
        <p className="hidden truncate text-[11px] text-muted-foreground sm:block">
          {meta.subtitle}
        </p>
      </div>

      {/* Right controls (Opus Clip style) */}
      <div className="flex items-center gap-1.5">
        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative h-8 w-8"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-primary-foreground">
            2
          </span>
        </Button>

        {/* Quick actions */}
        <Button
          variant="ghost"
          size="icon"
          className="relative h-8 w-8"
          aria-label="Quick actions"
        >
          <Zap className="h-4 w-4" />
        </Button>

        {/* New project */}
        <Button
          size="sm"
          onClick={() => setView('upload')}
          className="hidden gap-1.5 sm:flex"
        >
          <Plus className="h-3.5 w-3.5" />
          New
        </Button>

        {/* Command hint */}
        <div className="hidden items-center gap-1 rounded-md border border-border bg-muted/40 px-2 py-1 text-[10px] text-muted-foreground md:flex">
          <Command className="h-2.5 w-2.5" />
          <span>K</span>
        </div>

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
          aria-label="Toggle theme"
          className="h-8 w-8"
        >
          {mounted ? (
            resolvedTheme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )
          ) : (
            <div className="h-4 w-4" />
          )}
        </Button>
      </div>
    </header>
  )
}
