'use client'

import * as React from 'react'
import { Sidebar } from './sidebar'
import { Header } from './header'
import { CommandPalette } from './command-palette'
import { DashboardView } from './views/dashboard-view'
import { VideosView } from './views/videos-view'
import { UploadView } from './views/upload-view'
import { VideoDetailView } from './views/video-detail-view'
import { ClipsView } from './views/clips-view'
import { SettingsView } from './views/settings-view'
import { useClipForgeStore } from '@/stores/clipforge-store'
import { Heart } from 'lucide-react'

/**
 * AppShell — the persistent application frame.
 *
 * Layout strategy (sticky-footer rule):
 *   <div min-h-screen flex flex-col>
 *     <div flex-1 flex> sidebar + main(scrolls) </div>
 *     <footer mt-auto />
 *
 * On desktop the sidebar is fixed-width (w-72) and the main column scrolls
 * independently. On mobile the sidebar becomes a slide-over Sheet.
 */
export function AppShell() {
  const view = useClipForgeStore((s) => s.view)

  return (
    <div className="relative z-10 flex min-h-screen flex-col">
      <CommandPalette />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        {/* Main column */}
        <div className="flex min-w-0 flex-1 flex-col lg:pl-16">
          <Header />
          <main className="flex-1 overflow-y-auto scrollbar-thin">
            <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
              {renderView(view)}
            </div>
          </main>
        </div>
      </div>

      {/* Sticky footer */}
      <footer className="mt-auto border-t border-border bg-background/80 px-4 py-3 backdrop-blur sm:px-6">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-2 text-[11px] text-muted-foreground sm:flex-row">
          <p>
            <span className="font-medium text-foreground">ClipForge</span> · Local-first AI video clipping
          </p>
          <p className="flex items-center gap-1.5">
            Built with FFmpeg + Whisper · runs 100% on your machine
            <Heart className="h-3 w-3 fill-primary text-primary" />
          </p>
        </div>
      </footer>
    </div>
  )
}

function renderView(view: string) {
  switch (view) {
    case 'dashboard':
      return <DashboardView />
    case 'upload':
      return <UploadView />
    case 'videos':
      return <VideosView />
    case 'video-detail':
      return <VideoDetailView />
    case 'clips':
      return <ClipsView />
    case 'settings':
      return <SettingsView />
    default:
      return <DashboardView />
  }
}
