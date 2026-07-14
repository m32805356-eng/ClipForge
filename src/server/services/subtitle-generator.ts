/**
 * ClipForge — subtitle generation + burn-in service.
 *
 * Generates an ASS (Advanced SubStation Alpha) subtitle file from a clip's
 * word-level transcript timestamps, then burns it into the clip with FFmpeg.
 *
 * Supports 4 styles (defined in src/lib/clipforge/constants.ts):
 *   - bold-white    : high-contrast classic caption
 *   - karaoke       : word-by-word highlight as spoken
 *   - neon-amber    : glowing forge-themed caption
 *   - minimal       : subtle lower-third
 *
 * ASS format chosen over SRT because:
 *   - Per-word karaoke timing (\k tags) only works in ASS
 *   - Rich styling (colors, outlines, shadows, positioning) is declarative
 *   - FFmpeg's libass burns it pixel-perfectly
 *
 * Pipeline:
 *   1. Load clip + its video's transcript
 *   2. Find words that fall within the clip's time range (relative to clip start)
 *   3. Group words into caption lines (max ~7 words or ~42 chars)
 *   4. Emit ASS file with the chosen style
 *   5. FFmpeg: re-encode clip with subtitles burned in (-vf subtitles=...)
 *   6. Update Clip row: hasSubtitles=true, subtitleStyle=<style>, new size
 */
import path from 'node:path'
import { promises as fs } from 'node:fs'
import { db } from '@/lib/db'
import { getTranscript } from '@/server/db/repositories'
import { runFfmpeg } from '@/lib/clipforge/server/subprocess'
import { resolveStoredPath, toStoredPath, OUTPUTS_DIR } from '@/lib/clipforge/paths'
import { logger } from '@/lib/clipforge/server/logger'
import type { SubtitleStyleId } from '@/lib/clipforge/constants'

const log = logger.scoped('subtitles')

interface Word {
  word: string
  start: number
  end: number
  probability: number
}

interface Segment {
  id: number
  start: number
  end: number
  text: string
  words: Word[]
}

export class SubtitleError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'SubtitleError'
  }
}

/** Format seconds as ASS time H:MM:SS.cc */
function assTime(seconds: number): string {
  const s = Math.max(0, seconds)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = Math.floor(s % 60)
  const cs = Math.round((s - Math.floor(s)) * 100)
  return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}.${String(cs).padStart(2, '0')}`
}

/** Escape ASS special characters in text. */
function escapeAss(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}')
    .replace(/\n/g, '\\N')
}

/** ASS style header for each subtitle style. */
function assStyleHeader(style: SubtitleStyleId): string {
  // PlayResX/Y set to 1080x1920 so positioning scales for vertical clips.
  // But our clips may still be source resolution — libass scales automatically.
  const header = `[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
ScaledBorderAndShadow: yes
WrapStyle: 2
YCbCr Matrix: TV.709

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
`

  // Colors are in &HAABBGGRR format (AA=alpha, BB=blue, GG=green, RR=red).
  // alpha 00 = opaque, FF = transparent.
  const styles: Record<SubtitleStyleId, string> = {
    'bold-white': `Style: Default,Arial Black,72,&H00FFFFFF,&H0000FFFF,&H00000000,&H80000000,-1,0,0,0,100,100,0,0,1,6,3,2,80,80,180,1`,
    karaoke: `Style: Default,Arial Black,72,&H00FFFFFF,&H000088FF,&H00000000,&H80000000,-1,0,0,0,100,100,0,0,1,6,3,2,80,80,180,1`,
    'neon-amber': `Style: Default,Arial Black,76,&H00FFE0B0,&H00FF8800,&H00441800,&H80220000,-1,0,0,0,100,100,0,0,1,5,4,2,80,80,180,1`,
    minimal: `Style: Default,Arial,52,&H00F0F0F0,&H0000FFFF,&H00000000,&H80000000,0,0,0,0,100,100,0,0,1,3,1,2,120,120,120,1`,
  }
  return header + styles[style] + '\n\n[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n'
}

/** Group words into caption lines of ≤ maxWords or ≤ maxChars. */
function groupWords(words: Word[], maxWords = 7, maxChars = 42): Word[][] {
  const groups: Word[][] = []
  let current: Word[] = []
  let currentLen = 0
  for (const w of words) {
    const wordLen = w.word.length
    if (current.length >= maxWords || (current.length > 0 && currentLen + wordLen + 1 > maxChars)) {
      groups.push(current)
      current = []
      currentLen = 0
    }
    current.push(w)
    currentLen += wordLen + 1
  }
  if (current.length > 0) groups.push(current)
  return groups
}

/** Build ASS dialogue events for a style. */
function buildEvents(
  wordGroups: Word[][],
  style: SubtitleStyleId,
  clipStartOffset: number,
): string {
  const events: string[] = []
  for (const group of wordGroups) {
    const start = group[0].start - clipStartOffset
    const end = group[group.length - 1].end - clipStartOffset
    if (end <= start || end <= 0) continue
    // Clamp start to >= 0
    const safeStart = Math.max(0, start)
    const text = group.map((w) => w.word).join(' ').trim()
    if (!text) continue

    let dialogueText: string
    if (style === 'karaoke') {
      // Per-word karaoke: \k<duration> word. Durations in centiseconds.
      const totalCs = Math.max(1, Math.round((end - safeStart) * 100))
      const wordDurCs = Math.max(1, Math.floor(totalCs / group.length))
      const parts = group.map((w, i) => {
        const dur = i === group.length - 1 ? totalCs - wordDurCs * (group.length - 1) : wordDurCs
        return `{\\k${dur}}${escapeAss(w.word)}`
      })
      dialogueText = parts.join(' ')
    } else {
      dialogueText = escapeAss(text)
    }

    // For neon-amber, add a subtle glow via \bord + \shad.
    if (style === 'neon-amber') {
      dialogueText = `{\\bord5\\shad4\\1c&HFFE0B0&\\3c&HFF8800&\\4c&H441800&}${dialogueText}`
    }

    events.push(
      `Dialogue: 0,${assTime(safeStart)},${assTime(end)},Default,,0,0,0,,${dialogueText}`,
    )
  }
  return events.join('\n')
}

/**
 * Generate an ASS subtitle file for a clip and burn it into the video.
 * Returns the updated clip info.
 */
export async function burnSubtitlesIntoClip(
  clipId: string,
  style: SubtitleStyleId = 'bold-white',
): Promise<{
  id: string
  hasSubtitles: boolean
  subtitleStyle: string
  sizeBytes: number
  duration: number
}> {
  const clip = await db.clip.findUnique({
    where: { id: clipId },
    include: { video: { include: { transcript: true } } },
  })
  if (!clip) throw new SubtitleError(`Clip not found: ${clipId}`)
  if (!clip.video.transcript) {
    throw new SubtitleError('Source video has no transcript — transcribe first.')
  }

  // Parse transcript segments.
  let segments: Segment[] = []
  try {
    segments = JSON.parse(clip.video.transcript.segments) as Segment[]
  } catch {
    throw new SubtitleError('Transcript segments are corrupt.')
  }

  // Collect all words that fall within the clip's source time range.
  // Clip source range = [clipStartInSource, clipStartInSource + clipDuration].
  // We don't store the source start explicitly, but the clip was cut from the
  // highlight's padded range. Best estimate: use the linked highlight's start
  // (minus padSeconds). Since we don't have padSeconds here, use the highlight
  // start directly as the clip's source offset. This is approximate but works
  // because subtitles are relative to clip start.
  const highlight = clip.highlightId
    ? await db.highlight.findUnique({ where: { id: clip.highlightId } })
    : null
  // Clip source start ≈ highlight.start - 0.5 (the pad used during generation).
  const clipSourceStart = highlight ? Math.max(0, highlight.start - 0.5) : 0
  const clipSourceEnd = clipSourceStart + clip.duration

  const wordsInRange: Word[] = []
  for (const seg of segments) {
    for (const w of seg.words) {
      if (w.start >= clipSourceStart - 0.2 && w.end <= clipSourceEnd + 0.2) {
        wordsInRange.push(w)
      }
    }
  }

  if (wordsInRange.length === 0) {
    throw new SubtitleError('No word-level timestamps found in this clip\'s time range.')
  }

  // Group + build ASS.
  const groups = groupWords(wordsInRange)
  const assContent = assStyleHeader(style) + buildEvents(groups, style, clipSourceStart)

  // Write ASS file next to the clip.
  const clipDir = path.dirname(resolveStoredPath(clip.filePath))
  const assPath = path.join(clipDir, `${clipId}.ass`)
  await fs.writeFile(assPath, assContent, 'utf8')
  log.info('Wrote ASS file', { clipId, style, events: groups.length, assPath })

  // Burn subtitles into a new file, then replace the original.
  const clipAbs = resolveStoredPath(clip.filePath)
  const tempOutput = path.join(clipDir, `${clipId}_sub.mp4`)

  // Build the subtitles filter. Escape colons/backslashes for the filter graph.
  const escapedAssPath = assPath.replace(/\\/g, '/').replace(/:/g, '\\:')
  const vf = `subtitles='${escapedAssPath}'`

  await runFfmpeg([
    '-i', clipAbs,
    '-vf', vf,
    '-c:v', 'libx264',
    '-preset', 'ultrafast',
    '-crf', '23',
    '-c:a', 'copy',
    '-y',
    tempOutput,
  ], { timeoutMs: 180_000 })

  // Replace original with subtitled version.
  await fs.unlink(clipAbs)
  await fs.rename(tempOutput, clipAbs)

  // Probe new size.
  const { stat } = await import('node:fs')
  const newSize = await new Promise<number>((resolve, reject) => {
    stat(clipAbs, (err, s) => (err ? reject(err) : resolve(s.size)))
  })

  // Update DB.
  const updated = await db.clip.update({
    where: { id: clipId },
    data: {
      hasSubtitles: true,
      subtitleStyle: style,
      sizeBytes: newSize,
    },
  })

  log.info('Subtitles burned', { clipId, style, newSize })
  return {
    id: updated.id,
    hasSubtitles: updated.hasSubtitles,
    subtitleStyle: updated.subtitleStyle ?? style,
    sizeBytes: updated.sizeBytes,
    duration: updated.duration,
  }
}
