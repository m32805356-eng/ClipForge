import { AppShell } from '@/components/clipforge/app-shell'

/**
 * ClipForge — single user-visible route (`/`).
 *
 * The sandbox only exposes `/`, so the entire app is rendered through the
 * AppShell, which swaps views (dashboard, upload, videos, clips, settings)
 * via Zustand state instead of URL routing.
 */
export default function Home() {
  return <AppShell />
}
