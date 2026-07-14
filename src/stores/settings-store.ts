/**
 * ClipForge — user settings store.
 *
 * Persists user preferences to localStorage. These are client-side only
 * (theme, default model, subtitle style, etc.) — no server round-trip needed.
 *
 * For server-side config (model paths, disk usage), see /api/health.
 */
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { SUBTITLE_STYLES } from '@/lib/clipforge/constants'

export type WhisperModelSize = 'tiny' | 'base' | 'small' | 'medium' | 'large-v3'

interface ClipForgeSettings {
  /** Default Whisper model for transcription. */
  defaultModelSize: WhisperModelSize
  /** Default subtitle style for new clips. */
  defaultSubtitleStyle: string
  /** Pad seconds around highlights when generating clips. */
  defaultPadSeconds: number
  /** Max highlights to detect per video. */
  defaultMaxHighlights: number
  /** Min confidence score (0..1) for highlight detection. */
  defaultMinScore: number
  /** Auto-transcribe after upload. */
  autoTranscribe: boolean
  /** Auto-detect highlights after transcription. */
  autoDetectHighlights: boolean
  /** Show timestamps in transcript view. */
  showTimestamps: boolean

  setDefaultModelSize: (m: WhisperModelSize) => void
  setDefaultSubtitleStyle: (s: string) => void
  setDefaultPadSeconds: (n: number) => void
  setDefaultMaxHighlights: (n: number) => void
  setDefaultMinScore: (n: number) => void
  setAutoTranscribe: (b: boolean) => void
  setAutoDetectHighlights: (b: boolean) => void
  setShowTimestamps: (b: boolean) => void
  reset: () => void
}

const DEFAULTS = {
  defaultModelSize: 'base' as WhisperModelSize,
  defaultSubtitleStyle: 'bold-white',
  defaultPadSeconds: 0.5,
  defaultMaxHighlights: 12,
  defaultMinScore: 0.25,
  autoTranscribe: false,
  autoDetectHighlights: false,
  showTimestamps: true,
}

export const useSettings = create<ClipForgeSettings>()(
  persist(
    (set) => ({
      ...DEFAULTS,
      setDefaultModelSize: (defaultModelSize) => set({ defaultModelSize }),
      setDefaultSubtitleStyle: (defaultSubtitleStyle) => set({ defaultSubtitleStyle }),
      setDefaultPadSeconds: (defaultPadSeconds) => set({ defaultPadSeconds }),
      setDefaultMaxHighlights: (defaultMaxHighlights) => set({ defaultMaxHighlights }),
      setDefaultMinScore: (defaultMinScore) => set({ defaultMinScore }),
      setAutoTranscribe: (autoTranscribe) => set({ autoTranscribe }),
      setAutoDetectHighlights: (autoDetectHighlights) => set({ autoDetectHighlights }),
      setShowTimestamps: (showTimestamps) => set({ showTimestamps }),
      reset: () => set(DEFAULTS),
    }),
    {
      name: 'clipforge-settings',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)

/** Model size metadata for UI display. */
export const MODEL_OPTIONS: Array<{
  id: WhisperModelSize
  label: string
  description: string
  speed: string
  accuracy: string
  size: string
}> = [
  { id: 'tiny', label: 'Tiny', description: 'Fastest, lowest accuracy', speed: '~10x realtime', accuracy: 'Basic', size: '~75 MB' },
  { id: 'base', label: 'Base', description: 'Balanced — recommended', speed: '~5x realtime', accuracy: 'Good', size: '~145 MB' },
  { id: 'small', label: 'Small', description: 'Better accuracy', speed: '~2x realtime', accuracy: 'Better', size: '~480 MB' },
  { id: 'medium', label: 'Medium', description: 'High accuracy, slow', speed: '~1x realtime', accuracy: 'High', size: '~1.5 GB' },
  { id: 'large-v3', label: 'Large v3', description: 'Best accuracy, slowest', speed: '~0.3x realtime', accuracy: 'Best', size: '~3 GB' },
]

export { SUBTITLE_STYLES }
