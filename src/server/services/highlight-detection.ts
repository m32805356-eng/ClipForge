/**
 * ClipForge — highlight detection service.
 *
 * Analyzes transcript segments to detect engaging moments across 6 categories:
 *   - hook       : strong opening / attention-grabbing statements
 *   - emotional  : feeling-laden language, personal stakes
 *   - story      : narrative markers ("so then", "I remember", "it started")
 *   - funny      : humor cues (laughter, exaggeration, punchline shapes)
 *   - educational: explanations, definitions, "how to", "this is why"
 *   - viral      : shareable punchlines, surprising claims, quotable lines
 *
 * Approach:
 *   - Heuristic scoring per segment, combining:
 *     • keyword/phrase pattern matches (weighted)
 *     • structural signals (questions, numbers, superlatives, negations)
 *     • lexical density (longer/richer sentences)
 *     • position bias (first 10% = hook boost, last 10% = payoff boost)
 *   - Adjacent high-scoring segments are merged into a single highlight
 *     spanning the combined time range, with the peak score preserved.
 *   - Each highlight gets a generated title (first ~8 words) + reasoning.
 *
 * This is fully deterministic and local — no API calls. An optional LLM-based
 * refinement pass could be layered on top later.
 */
import { getTranscript } from '@/server/db/repositories'
import { createHighlights } from '@/server/db/repositories'
import { updateVideoStatus } from '@/server/db/repositories'
import { logger } from '@/lib/clipforge/server/logger'
import type { HighlightCategory } from '@prisma/client'

const log = logger.scoped('highlights')

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

export interface DetectedHighlight {
  start: number
  end: number
  title: string
  reasoning: string
  category: HighlightCategory
  score: number
  excerpt: string
}

export class HighlightError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'HighlightError'
  }
}

/** Pattern libraries. Each entry: [regex, weight]. */
const PATTERNS: Record<HighlightCategory, Array<{ re: RegExp; weight: number; label: string }>> = {
  hook: [
    { re: /\b(welcome|let'?s (start|begin|dive)|today (we|i|let'?s)|in this video|by the end)\b/i, weight: 3, label: 'opening hook' },
    { re: /\b(you won'?t believe|stop (what you'?re doing|scrolling)|wait (until|till))\b/i, weight: 4, label: 'pattern interrupt' },
    { re: /\b(the (biggest|most|number one|secret)|nobody talks about|here'?s the thing)\b/i, weight: 3, label: 'bold claim' },
    { re: /\b(question|ask yourself|have you ever)\b/i, weight: 2, label: 'rhetorical question' },
  ],
  emotional: [
    { re: /\b(i (feel|felt|was|am)|love|hate|afraid|scared|worried|excited|amazing|incredible|terrible|awful|heart|pain|joy|dream)\b/i, weight: 3, label: 'emotional language' },
    { re: /\b(cry|tears|laugh|smile|breakthrough|devastat|tragic|beautiful)\b/i, weight: 3, label: 'strong feeling' },
    { re: /\b(i (lost|gained|gave up|kept going)|changed my life|turned (it )?around)\b/i, weight: 4, label: 'personal stakes' },
    { re: /\b(thank(ful|s)|grateful|blessed|appreciate)\b/i, weight: 2, label: 'gratitude' },
  ],
  story: [
    { re: /\b(so then|and then|i remember|it (all )?started|back (in|then)|years ago|one day)\b/i, weight: 3, label: 'narrative marker' },
    { re: /\b(suddenly|out of nowhere|that'?s when|everything changed)\b/i, weight: 3, label: 'turning point' },
    { re: /\b(he (said|told)|she (said|told)|they (said|told)|we went|i went)\b/i, weight: 2, label: 'dialogue/action' },
    { re: /\b(story|back in the day|long story short|to make a long)\b/i, weight: 2, label: 'story cue' },
  ],
  funny: [
    { re: /\b(lol|haha|lmao|rofl|joke|funny|hilarious|kidding)\b/i, weight: 3, label: 'humor cue' },
    { re: /\b(obviously|clearly|duh|of course|right\?)\b/i, weight: 1, label: 'sarcasm cue' },
    { re: /\b(worst|dumbest|stupidest|ridiculous|absurd)\b/i, weight: 2, label: 'exaggeration' },
  ],
  educational: [
    { re: /\b(this is (why|how|because)|the reason|that'?s why|so the key|the trick)\b/i, weight: 3, label: 'explanation' },
    { re: /\b(learn|understand|explain|define|means|basically|in other words)\b/i, weight: 2, label: 'teaching' },
    { re: /\b(step (1|one|2|two)|first you|then you|finally you|how to)\b/i, weight: 3, label: 'instructional' },
    { re: /\b(example|for instance|imagine|think of it (like|as))\b/i, weight: 2, label: 'example' },
    { re: /\b(tip|trick|hack|secret|pro tip)\b/i, weight: 3, label: ' actionable tip' },
  ],
  viral: [
    { re: /\b(mind.?blown|game.?changer|next level|blew my mind|changed everything)\b/i, weight: 4, label: 'wow factor' },
    { re: /\b(secret|nobody knows|hidden|underground|banned)\b/i, weight: 3, label: 'exclusivity' },
    { re: /\b(free|no cost|zero|100%|guarantee(d)?)\b/i, weight: 2, label: 'irresistible offer' },
    { re: /\b(you (can|could|should)|try this|do this|stop doing)\b/i, weight: 2, label: 'call to action' },
    { re: /\b(no (cloud|api|fees|subscription|monthly))\b/i, weight: 3, label: 'value proposition' },
    { re: /\b(open source|local|your own|right on your)\b/i, weight: 2, label: 'positioning' },
  ],
}

/** Structural signals applied to all categories as multipliers. */
function structuralSignals(text: string): { multiplier: number; tags: string[] } {
  let multiplier = 1
  const tags: string[] = []

  // Numbers / statistics boost credibility + shareability.
  if (/\b\d+(\.\d+)?%?\b/.test(text)) {
    multiplier += 0.15
    tags.push('has-number')
  }
  // Questions engage.
  if (text.includes('?')) {
    multiplier += 0.1
    tags.push('question')
  }
  // Superlatives.
  if (/\b(best|worst|biggest|most|least|fastest|cheapest|simplest)\b/i.test(text)) {
    multiplier += 0.15
    tags.push('superlative')
  }
  // Negations / contrasts ("not X, but Y").
  if (/\bnot\b/i.test(text) && /\b(but|however|instead|rather)\b/i.test(text)) {
    multiplier += 0.1
    tags.push('contrast')
  }
  // Rule of three (comma-separated lists of 3).
  if ((text.match(/,/g) || []).length >= 2) {
    multiplier += 0.05
    tags.push('list')
  }
  return { multiplier, tags }
}

/** Score a single segment for a given category. Returns 0..1 + matched labels. */
function scoreSegmentForCategory(
  seg: Segment,
  category: HighlightCategory,
  totalDuration: number,
): { score: number; labels: string[] } {
  const text = seg.text
  if (!text) return { score: 0, labels: [] }

  let raw = 0
  const labels: string[] = []
  for (const { re, weight, label } of PATTERNS[category]) {
    if (re.test(text)) {
      raw += weight
      labels.push(label)
    }
  }

  // Structural multiplier.
  const struct = structuralSignals(text)
  for (const tag of struct.tags) labels.push(tag)
  raw *= struct.multiplier

  // Length density: reward segments with more substance (cap at 25 words).
  const wordCount = seg.words.length || text.split(/\s+/).length
  const lengthBonus = Math.min(wordCount / 25, 1) * 0.5
  raw += lengthBonus

  // Position bias.
  const midpoint = (seg.start + seg.end) / 2
  const position = totalDuration > 0 ? midpoint / totalDuration : 0
  if (position < 0.1) raw *= 1.2 // opening hook boost
  if (position > 0.9) raw *= 1.1 // closing payoff boost

  // Squash to 0..1 via a soft curve so small advantages compound.
  const score = 1 - Math.exp(-raw / 3)
  return { score: Math.min(score, 1), labels }
}

/** Build a short title from the segment text (first ~8 words, title-cased). */
function buildTitle(text: string): string {
  const words = text.trim().split(/\s+/).slice(0, 8).join(' ')
  if (!words) return 'Untitled moment'
  // Strip leading conjunctions for a cleaner title.
  const cleaned = words.replace(/^(and|but|so|then|because|when|while|if)\s+/i, '')
  // Capitalize first letter.
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1)
}

/** Build human-readable reasoning from matched labels + score. */
function buildReasoning(
  category: HighlightCategory,
  labels: string[],
  score: number,
  position: number,
): string {
  const posDesc = position < 0.15 ? 'near the start' : position > 0.85 ? 'near the end' : 'in the middle'
  const confidence =
    score > 0.7 ? 'High' : score > 0.45 ? 'Moderate' : 'Low'
  const labelStr = labels.length > 0 ? labels.slice(0, 3).join(', ') : 'general engagement'
  return `${confidence} confidence ${category} moment ${posDesc}. Signals: ${labelStr}.`
}

export type TargetDuration = 'under-30' | '30-60' | '60-plus'

/** Duration constraints (in seconds) for each target option. */
export const DURATION_RANGES: Record<TargetDuration, { min: number; max: number; label: string }> = {
  'under-30': { min: 15, max: 29, label: 'Under 30 seconds' },
  '30-60': { min: 30, max: 60, label: '30 to 60 seconds' },
  '60-plus': { min: 60, max: 90, label: '1 minute+' },
}

/**
 * Custom prompt keywords — when the user provides a custom prompt like
 * "find the emotional moments" or "find key tips", these map to extra
 * pattern libraries that boost matching segments.
 */
const CUSTOM_PROMPT_PATTERNS: Array<{ re: RegExp; weight: number; label: string }> = [
  // Emotional cues
  { re: /\b(feel|felt|emotion|heart|love|hate|cry|tears|joy|pain|fear|afraid|scared|amazing|incredible|terrible|awful|beautiful|devastat|tragic|breakthrough)\b/i, weight: 4, label: 'emotional' },
  // Funny cues
  { re: /\b(funny|hilarious|joke|laugh|lol|haha|kidding|ridiculous|absurd|silly|hilarious)\b/i, weight: 4, label: 'funny' },
  // Tips / educational
  { re: /\b(tip|advice|recommend|should|try|do this|hack|trick|secret|pro tip|key|important|remember|don'?t forget|make sure)\b/i, weight: 4, label: 'tip' },
  // Story / narrative
  { re: /\b(story|i remember|it started|back then|so then|one day|suddenly|that'?s when|everything changed)\b/i, weight: 4, label: 'story' },
  // Hooks / attention
  { re: /\b(wait|stop|listen|look|here'?s|did you know|imagine|picture this|what if)\b/i, weight: 4, label: 'hook' },
  // Viral / quotable
  { re: /\b(game.?changer|mind.?blown|never|always|nobody|everybody|secret|truth|lie|myth)\b/i, weight: 3, label: 'viral' },
]

/**
 * Score a segment against a custom prompt. Uses keyword overlap between the
 * prompt and the segment text, plus the CUSTOM_PROMPT_PATTERNS library.
 */
function scoreSegmentForCustomPrompt(
  seg: Segment,
  customPrompt: string,
  totalDuration: number,
): { score: number; labels: string[] } {
  const text = seg.text.toLowerCase()
  const prompt = customPrompt.toLowerCase()
  let raw = 0
  const labels: string[] = []

  // 1. Direct keyword overlap: split prompt into words, check each against segment text.
  const promptWords = prompt.split(/\s+/).filter((w) => w.length > 3 && !['find', 'that', 'this', 'with', 'from', 'have', 'they', 'them', 'were', 'been', 'will', 'would', 'could', 'should'].includes(w))
  let overlapCount = 0
  for (const w of promptWords) {
    if (text.includes(w)) {
      overlapCount++
    }
  }
  if (overlapCount > 0) {
    raw += Math.min(overlapCount * 1.5, 6)
    labels.push(`prompt-match (${overlapCount})`)
  }

  // 2. Pattern library — boost segments matching common "what the user wants" cues.
  for (const { re, weight, label } of CUSTOM_PROMPT_PATTERNS) {
    // Only apply patterns whose label relates to the prompt keywords.
    const labelWords = label.split(/[\s-]+/)
    const promptMentionsCategory = labelWords.some((lw) => prompt.includes(lw))
    if (promptMentionsCategory && re.test(seg.text)) {
      raw += weight
      labels.push(`prompt:${label}`)
    }
  }

  // 3. Structural multiplier.
  const struct = structuralSignals(seg.text)
  for (const tag of struct.tags) labels.push(tag)
  raw *= struct.multiplier

  // 4. Length density.
  const wordCount = seg.words.length || seg.text.split(/\s+/).length
  const lengthBonus = Math.min(wordCount / 25, 1) * 0.5
  raw += lengthBonus

  // 5. Position bias.
  const midpoint = (seg.start + seg.end) / 2
  const position = totalDuration > 0 ? midpoint / totalDuration : 0
  if (position < 0.1) raw *= 1.2
  if (position > 0.9) raw *= 1.1

  const score = 1 - Math.exp(-raw / 3)
  return { score: Math.min(score, 1), labels }
}

/**
 * Adjust a highlight's time boundaries to fit within the target duration range.
 * Snaps to sentence boundaries (segment edges) while staying within [min, max].
 */
function adjustToDurationRange(
  highlight: DetectedHighlight,
  segments: Segment[],
  target: TargetDuration,
): DetectedHighlight {
  const range = DURATION_RANGES[target]
  const currentDuration = highlight.end - highlight.start

  // If already in range, return as-is.
  if (currentDuration >= range.min && currentDuration <= range.max) {
    return highlight
  }

  // If too short: extend forward (then backward) to reach min, snapping to segment edges.
  if (currentDuration < range.min) {
    let newEnd = highlight.start + range.min
    // Snap forward to the nearest segment end that doesn't exceed max.
    for (const seg of segments) {
      if (seg.end > highlight.start && seg.end <= highlight.start + range.max) {
        if (seg.end >= newEnd) {
          newEnd = seg.end
          break
        }
      }
    }
    newEnd = Math.min(newEnd, highlight.start + range.max)

    // If still too short, extend the start backward.
    let newStart = highlight.start
    if (newEnd - newStart < range.min) {
      newStart = Math.max(0, newEnd - range.min)
      // Snap backward to nearest segment start.
      for (let i = segments.length - 1; i >= 0; i--) {
        const seg = segments[i]
        if (seg.start < newEnd && seg.start >= newEnd - range.max) {
          if (newEnd - seg.start >= range.min) {
            newStart = seg.start
            break
          }
        }
      }
    }
    return { ...highlight, start: newStart, end: newEnd }
  }

  // If too long: trim from the end first, then the start, snapping to segment edges.
  if (currentDuration > range.max) {
    let newEnd = highlight.start + range.max
    // Snap backward to nearest segment end within range.
    for (let i = segments.length - 1; i >= 0; i--) {
      const seg = segments[i]
      if (seg.end <= highlight.start + range.max && seg.end > highlight.start + range.min) {
        newEnd = seg.end
        break
      }
    }
    let newStart = highlight.start
    if (newEnd - newStart > range.max) {
      newStart = newEnd - range.max
    }
    if (newEnd - newStart < range.min) {
      newEnd = newStart + range.min
    }
    return { ...highlight, start: newStart, end: newEnd }
  }

  return highlight
}

/** Merge overlapping/adjacent highlights within the same category. */
function mergeAdjacent(
  highlights: DetectedHighlight[],
  gapSeconds = 1.5,
): DetectedHighlight[] {
  if (highlights.length === 0) return []
  const sorted = [...highlights].sort((a, b) => a.start - b.start)
  const merged: DetectedHighlight[] = [sorted[0]]
  for (let i = 1; i < sorted.length; i++) {
    const prev = merged[merged.length - 1]
    const cur = sorted[i]
    if (cur.category === prev.category && cur.start - prev.end <= gapSeconds) {
      // Extend prev, keep the higher score + richer reasoning.
      prev.end = Math.max(prev.end, cur.end)
      if (cur.score > prev.score) {
        prev.score = cur.score
        prev.title = cur.title
        prev.reasoning = cur.reasoning
      }
      prev.excerpt = prev.excerpt + ' ' + cur.excerpt
    } else {
      merged.push(cur)
    }
  }
  return merged
}

/**
 * Run highlight detection on a video's transcript.
 * Returns merged highlights sorted by score (desc), capped at maxHighlights.
 *
 * Options:
 *   - customPrompt:   if provided, segments are also scored against the prompt
 *                     via keyword overlap + pattern matching. Matching segments
 *                     get a "custom" category and are included in the results.
 *   - targetDuration: if provided, highlight time boundaries are adjusted to
 *                     fit within the target duration range (snaps to sentence
 *                     boundaries). Does not affect scoring — only boundaries.
 */
export async function detectHighlights(
  videoId: string,
  opts: {
    maxHighlights?: number
    minScore?: number
    customPrompt?: string | null
    targetDuration?: TargetDuration | null
  } = {},
): Promise<{ count: number; highlights: DetectedHighlight[] }> {
  const maxHighlights = opts.maxHighlights ?? 12
  const minScore = opts.minScore ?? 0.25
  const customPrompt = opts.customPrompt?.trim() || null
  const targetDuration = opts.targetDuration ?? null

  const transcript = await getTranscript(videoId)
  if (!transcript) {
    throw new HighlightError('No transcript found — transcribe the video first.')
  }

  await updateVideoStatus(videoId, 'ANALYZING', { progress: 50, message: 'Detecting highlights…' })

  let segments: Segment[] = []
  try {
    segments = JSON.parse(transcript.segments) as Segment[]
  } catch {
    throw new HighlightError('Transcript segments are corrupt.')
  }

  if (segments.length === 0) {
    throw new HighlightError('Transcript has no segments (video may have no speech).')
  }

  const totalDuration = transcript.duration ?? segments[segments.length - 1]?.end ?? 0
  log.info('Detecting highlights', {
    videoId,
    segmentCount: segments.length,
    duration: totalDuration,
    customPrompt: customPrompt ? customPrompt.slice(0, 60) : null,
    targetDuration,
  })

  const categories: HighlightCategory[] = ['hook', 'emotional', 'story', 'funny', 'educational', 'viral']
  const all: DetectedHighlight[] = []

  for (const seg of segments) {
    for (const category of categories) {
      const { score, labels } = scoreSegmentForCategory(seg, category, totalDuration)
      if (score < minScore) continue
      const position = totalDuration > 0 ? (seg.start + seg.end) / 2 / totalDuration : 0
      all.push({
        start: seg.start,
        end: seg.end,
        title: buildTitle(seg.text),
        reasoning: buildReasoning(category, labels, score, position),
        category,
        score: Math.round(score * 100) / 100,
        excerpt: seg.text.trim(),
      })
    }

    // If a custom prompt is provided, also score the segment against it.
    // Segments that match the prompt get a "hook" category (most versatile)
    // with reasoning that references the user's prompt.
    if (customPrompt) {
      const { score, labels } = scoreSegmentForCustomPrompt(seg, customPrompt, totalDuration)
      if (score >= minScore) {
        const position = totalDuration > 0 ? (seg.start + seg.end) / 2 / totalDuration : 0
        const posDesc = position < 0.15 ? 'near the start' : position > 0.85 ? 'near the end' : 'in the middle'
        const confidence = score > 0.7 ? 'High' : score > 0.45 ? 'Moderate' : 'Low'
        all.push({
          start: seg.start,
          end: seg.end,
          title: buildTitle(seg.text),
          reasoning: `${confidence} confidence match for user prompt "${customPrompt.slice(0, 50)}" ${posDesc}. Signals: ${labels.slice(0, 3).join(', ')}.`,
          category: 'hook', // custom-prompt matches land as hooks
          score: Math.round(score * 100) / 100,
          excerpt: seg.text.trim(),
        })
      }
    }
  }

  // Merge adjacent same-category highlights, then take top-N by score.
  const merged = mergeAdjacent(all)
  let ranked = merged.sort((a, b) => b.score - a.score).slice(0, maxHighlights)

  // If a target duration is specified, adjust each highlight's boundaries
  // to fit within the target range, snapping to sentence/segment edges.
  if (targetDuration) {
    const range = DURATION_RANGES[targetDuration]
    log.info('Adjusting highlights to target duration', { target: targetDuration, range })
    ranked = ranked.map((h) => adjustToDurationRange(h, segments, targetDuration))
  }

  // Persist.
  await createHighlights(
    ranked.map((h) => ({
      videoId,
      start: h.start,
      end: h.end,
      title: h.title,
      reasoning: h.reasoning,
      category: h.category,
      score: h.score,
      excerpt: h.excerpt,
    })),
  )

  await updateVideoStatus(videoId, 'READY', { progress: 100, message: null })
  log.info('Highlights detected', { videoId, detected: all.length, merged: merged.length, kept: ranked.length })

  return { count: ranked.length, highlights: ranked }
}
