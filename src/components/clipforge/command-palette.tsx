'use client'

import * as React from 'react'
import {
  Search,
  Home,
  Upload,
  FolderOpen,
  Scissors,
  Settings,
  Zap,
  Captions,
  Crop,
  Film,
  Sparkles,
  ArrowRight,
  CornerDownLeft,
} from 'lucide-react'
import { useClipForgeStore, type ViewId } from '@/stores/clipforge-store'
import { cn } from '@/lib/utils'

interface CommandItem {
  id: string
  label: string
  hint?: string
  icon: React.ComponentType<{ className?: string }>
  view?: ViewId
  action?: () => void
  keywords?: string
}

export function CommandPalette() {
  const setView = useClipForgeStore((s) => s.setView)
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const commands: CommandItem[] = React.useMemo(
    () => [
      { id: 'home', label: 'Go to Dashboard', icon: Home, view: 'dashboard', keywords: 'home dashboard' },
      { id: 'upload', label: 'Upload a video', icon: Upload, view: 'upload', keywords: 'upload new file' },
      { id: 'videos', label: 'Browse projects', icon: FolderOpen, view: 'videos', keywords: 'videos projects library' },
      { id: 'clips', label: 'View all clips', icon: Scissors, view: 'clips', keywords: 'clips outputs vertical' },
      { id: 'settings', label: 'Open settings', icon: Settings, view: 'settings', keywords: 'settings preferences config' },
      { id: 'long-to-shorts', label: 'Long to shorts', hint: 'Tool', icon: Sparkles, view: 'upload', keywords: 'long to shorts ai clip' },
      { id: 'captions', label: 'AI Captions', hint: 'Tool', icon: Captions, view: 'clips', keywords: 'captions subtitles burn' },
      { id: 'reframe', label: 'AI Reframe (vertical crop)', hint: 'Tool', icon: Crop, view: 'clips', keywords: 'reframe crop vertical 9:16' },
      { id: 'editor', label: 'Video editor', hint: 'Tool', icon: Film, view: 'videos', keywords: 'editor edit trim' },
      { id: 'process', label: 'Process All (1-click pipeline)', hint: 'Action', icon: Zap, view: 'videos', keywords: 'process all pipeline auto' },
    ],
    [],
  )

  const filtered = React.useMemo(() => {
    if (!query.trim()) return commands
    const q = query.toLowerCase()
    return commands.filter(
      (c) => c.label.toLowerCase().includes(q) || c.keywords?.includes(q),
    )
  }, [query, commands])

  // Reset selection when query changes
  React.useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  // Global key listener for cmd+K / ctrl+K
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      }
      if (e.key === 'Escape' && open) {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open])

  // Focus input when opened
  React.useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50)
    } else {
      setQuery('')
    }
  }, [open])

  const execute = (item: CommandItem) => {
    if (item.view) setView(item.view)
    item.action?.()
    setOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filtered[selectedIndex]) execute(filtered[selectedIndex])
    }
  }

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
      {/* Palette */}
      <div className="fixed left-1/2 top-[20%] z-[101] w-[92%] max-w-lg -translate-x-1/2 overflow-hidden rounded-xl border border-border bg-popover shadow-2xl">
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
            ESC
          </kbd>
        </div>
        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto scrollbar-thin p-2">
          {filtered.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">
              No results for &ldquo;{query}&rdquo;
            </p>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon
              const active = idx === selectedIndex
              return (
                <button
                  key={item.id}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  onClick={() => execute(item)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors',
                    active ? 'bg-primary text-primary-foreground' : 'hover:bg-muted',
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{item.label}</p>
                  </div>
                  {item.hint && (
                    <span
                      className={cn(
                        'shrink-0 rounded-md px-1.5 py-0.5 text-[9px] font-semibold uppercase',
                        active ? 'bg-primary-foreground/20' : 'bg-muted text-muted-foreground',
                      )}
                    >
                      {item.hint}
                    </span>
                  )}
                  {active && <CornerDownLeft className="h-3 w-3 shrink-0 opacity-70" />}
                </button>
              )
            })
          )}
        </div>
        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border px-4 py-2 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <ArrowRight className="h-2.5 w-2.5" />
            Navigate
          </span>
          <span className="flex items-center gap-1">
            <CornerDownLeft className="h-2.5 w-2.5" />
            Select
          </span>
        </div>
      </div>
    </>
  )
}
