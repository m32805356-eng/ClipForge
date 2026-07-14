'use client'

import * as React from 'react'
import {
  Home,
  LayoutGrid,
  FolderOpen,
  Calendar,
  BarChart3,
  Link2,
  Crown,
  Database,
  BookOpen,
  HelpCircle,
  Scissors,
  Upload,
  Settings,
  X,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useClipForgeStore, type ViewId } from '@/stores/clipforge-store'
import { ClipForgeLogo } from './logo'

interface RailItem {
  id: ViewId | 'tools'
  label: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
}

/** Primary nav (top of rail). */
const NAV_ITEMS: RailItem[] = [
  { id: 'dashboard', label: 'Home', icon: Home },
  { id: 'upload', label: 'Upload', icon: Upload },
  { id: 'videos', label: 'Videos', icon: FolderOpen },
  { id: 'clips', label: 'Clips', icon: Scissors },
]

/** Secondary tools (bottom of rail). */
const TOOL_ITEMS: RailItem[] = [
  { id: 'dashboard', label: 'Tools', icon: LayoutGrid },
  { id: 'settings', label: 'Settings', icon: Settings },
]

/**
 * Sidebar — Opus Clip-style icon rail.
 * Fixed narrow vertical bar with icon buttons + tooltips on hover.
 * Expands to a slide-over sheet on mobile.
 */
export function Sidebar() {
  const view = useClipForgeStore((s) => s.view)
  const setView = useClipForgeStore((s) => s.setView)
  const sidebarOpen = useClipForgeStore((s) => s.sidebarOpen)
  const setSidebarOpen = useClipForgeStore((s) => s.setSidebarOpen)

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-16 flex-col items-center border-r border-sidebar-border bg-sidebar py-3 transition-transform duration-300 ease-out lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Logo */}
        <button
          onClick={() => setView('dashboard')}
          className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg transition-transform hover:scale-110"
          aria-label="ClipForge home"
        >
          <ClipForgeLogo size={28} />
        </button>

        {/* Close button (mobile) */}
        <button
          className="absolute right-1 top-1 rounded-md p-1 text-muted-foreground hover:bg-sidebar-accent lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        >
          <X className="h-3.5 w-3.5" />
        </button>

        {/* Primary nav */}
        <nav className="flex flex-1 flex-col items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const active = view === item.id
            return (
              <RailButton
                key={item.id}
                icon={Icon}
                label={item.label}
                active={active}
                onClick={() => {
                  setView(item.id as ViewId)
                  setSidebarOpen(false)
                }}
              />
            )
          })}

          {/* Divider */}
          <div className="my-2 h-px w-6 bg-sidebar-border" />

          {TOOL_ITEMS.map((item) => {
            const Icon = item.icon
            const active = view === item.id
            return (
              <RailButton
                key={item.label}
                icon={Icon}
                label={item.label}
                active={active}
                onClick={() => {
                  setView(item.id as ViewId)
                  setSidebarOpen(false)
                }}
              />
            )
          })}
        </nav>

        {/* Pro badge */}
        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-primary"
          title="ClipForge Pro"
        >
          <Crown className="h-[18px] w-[18px]" />
        </button>
      </aside>
    </>
  )
}

function RailButton({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'group relative flex h-10 w-10 items-center justify-center rounded-lg transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        active
          ? 'bg-primary text-primary-foreground shadow-sm'
          : 'text-muted-foreground hover:bg-sidebar-accent hover:text-foreground',
      )}
      aria-label={label}
    >
      <Icon className="h-[18px] w-[18px]" />
      {/* Tooltip */}
      <span
        className={cn(
          'pointer-events-none absolute left-full z-50 ml-2 whitespace-nowrap rounded-md border border-border bg-popover px-2 py-1 text-[11px] font-medium text-popover-foreground opacity-0 shadow-md transition-opacity',
          'group-hover:opacity-100',
        )}
      >
        {label}
      </span>
    </button>
  )
}
