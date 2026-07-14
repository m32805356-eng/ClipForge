/**
 * ClipForge — shared constants.
 */

/** Vertical output resolution for social-media clips (Phase 6). */
export const VERTICAL_WIDTH = 1080
export const VERTICAL_HEIGHT = 1920

/** Max upload size: 2 GiB. Protects against accidental huge uploads. */
export const MAX_UPLOAD_BYTES = 2 * 1024 * 1024 * 1024

/** Mime types accepted by the uploader. */
export const ACCEPTED_VIDEO_MIME = [
  'video/mp4',
  'video/quicktime',
  'video/x-matroska',
  'video/webm',
  'video/x-msvideo',
  'video/mpeg',
] as const

/** File extensions accepted (used as a fallback when mime is generic). */
export const ACCEPTED_VIDEO_EXTS = [
  '.mp4',
  '.mov',
  '.mkv',
  '.webm',
  '.avi',
  '.mpeg',
  '.mpg',
] as const

/** Subtitle styles offered in Phase 5. Keys are stored on Clip.subtitleStyle. */
export const SUBTITLE_STYLES = [
  { id: 'bold-white', label: 'Bold White', description: 'High-contrast classic caption' },
  { id: 'karaoke', label: 'Karaoke Pop', description: 'Word-by-word highlight as spoken' },
  { id: 'neon-amber', label: 'Neon Amber', description: 'Glowing forge-themed caption' },
  { id: 'minimal', label: 'Minimal Lower', description: 'Subtle lower-third style' },
] as const

export type SubtitleStyleId = (typeof SUBTITLE_STYLES)[number]['id']

/** Highlight categories shown in the UI (Phase 3). */
export const HIGHLIGHT_CATEGORIES = [
  { id: 'hook', label: 'Hook', color: 'oklch(0.75 0.17 58)' },
  { id: 'emotional', label: 'Emotional', color: 'oklch(0.7 0.16 290)' },
  { id: 'story', label: 'Story', color: 'oklch(0.7 0.15 145)' },
  { id: 'funny', label: 'Funny', color: 'oklch(0.78 0.14 95)' },
  { id: 'educational', label: 'Educational', color: 'oklch(0.65 0.16 200)' },
  { id: 'viral', label: 'Viral', color: 'oklch(0.65 0.2 15)' },
] as const
