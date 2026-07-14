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
 */
export async function detectHighlights(
  videoId: string,
  opts: { maxHighlights?: number; minScore?: number } = {},
): Promise<{ count: number; highlights: DetectedHighlight[] }> {
  const maxHighlights = opts.maxHighlights ?? 12
  const minScore = opts.minScore ?? 0.25

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
  log.info('Detecting highlights', { videoId, segmentCount: segments.length, duration: totalDuration })

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
  }

  // Merge adjacent same-category highlights, then take top-N by score.
  const merged = mergeAdjacent(all)
  const ranked = merged.sort((a, b) => b.score - a.score).slice(0, maxHighlights)

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
