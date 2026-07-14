/**
 * ClipForge — UI view-state store.
 *
 * The sandbox only exposes the `/` route, so ClipForge behaves as a SPA:
 * each "page" (Dashboard, Upload, Video Detail, Clips, Settings) is a view
 * managed here. Navigation sets the active view + optional context (e.g. the
 * selected video id) without touching the URL.
 */
import { create } from 'zustand'

export type ViewId =
  | 'dashboard'
  | 'upload'
  | 'videos'
  | 'video-detail'
  | 'clips'
  | 'settings'

interface ClipForgeState {
  view: ViewId
  /** Active video id (for the detail view). */
  activeVideoId: string | null
  /** Whether the mobile sidebar is open. */
  sidebarOpen: boolean

  setView: (view: ViewId) => void
  openVideo: (videoId: string) => void
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
}

export const useClipForgeStore = create<ClipForgeState>((set) => ({
  view: 'dashboard',
  activeVideoId: null,
  sidebarOpen: false,

  setView: (view) => set({ view }),
  openVideo: (videoId) =>
    set({ view: 'video-detail', activeVideoId: videoId, sidebarOpen: false }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}))
