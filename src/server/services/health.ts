/**
 * ClipForge — system health checker.
 *
 * Probes each subsystem the app depends on:
 *   - SQLite database (Prisma round-trip)
 *   - FFmpeg + ffprobe binaries
 *   - Python 3 + (optionally) faster-whisper availability
 *   - Local disk free space
 *
 * Aggregated status:
 *   - ok       → every component ok
 *   - degraded → some non-critical components down (e.g. whisper not installed)
 *   - down     → database or ffmpeg unavailable
 */
import { db } from '@/lib/db'
import { runCommand } from '@/lib/clipforge/server/subprocess'
import { existsSync } from 'node:fs'
import { UPLOADS_DIR, OUTPUTS_DIR } from '@/lib/clipforge/paths'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import type { ComponentHealth, HealthStatus } from '@/types/clipforge/api-schemas'
import { logger } from '@/lib/clipforge/server/logger'

const log = logger.scoped('health')
const startedAt = Date.now()

// Prefer the venv python3 (has faster-whisper, yt-dlp installed) if it exists.
const PYTHON_BIN = existsSync('/home/z/.venv/bin/python3') ? '/home/z/.venv/bin/python3' : 'python3'

async function checkDatabase(): Promise<ComponentHealth> {
  try {
    await db.$queryRaw`SELECT 1`
    return { name: 'database', status: 'ok', detail: 'SQLite via Prisma', version: 'sqlite' }
  } catch (e) {
    return { name: 'database', status: 'down', detail: (e as Error).message }
  }
}

async function checkBinary(name: string, versionFlag: string): Promise<ComponentHealth> {
  try {
    const r = await runCommand(name, [versionFlag], { timeoutMs: 5000 })
    const firstLine = r.stdout.split('\n').find((l) => l.trim()) ?? ''
    const version = firstLine.match(/version\s+([0-9.\-a-z]+)/i)?.[1]
    return { name, status: 'ok', version, detail: firstLine.slice(0, 120) }
  } catch (e) {
    return { name, status: 'down', detail: (e as Error).message }
  }
}

async function checkPython(): Promise<ComponentHealth> {
  try {
    const r = await runCommand(PYTHON_BIN, ['--version'], { timeoutMs: 5000 })
    const version = r.stdout.trim().split(' ')[1]
    return { name: 'python', status: 'ok', version, detail: r.stdout.trim() }
  } catch (e) {
    return { name: 'python', status: 'down', detail: (e as Error).message }
  }
}

async function checkWhisper(): Promise<ComponentHealth> {
  try {
    const r = await runCommand(
      PYTHON_BIN,
      ['-c', 'import faster_whisper; print(faster_whisper.__version__)'],
      { timeoutMs: 8000 },
    )
    const version = r.stdout.trim()
    return { name: 'whisper', status: 'ok', version, detail: 'faster-whisper ready' }
  } catch {
    return {
      name: 'whisper',
      status: 'degraded',
      detail: 'faster-whisper not installed (transcription will not work)',
    }
  }
}

async function checkDisk(): Promise<ComponentHealth> {
  try {
    // Ensure our local folders exist (creating if missing)
    await fs.mkdir(UPLOADS_DIR, { recursive: true })
    await fs.mkdir(OUTPUTS_DIR, { recursive: true })

    // Best-effort free-space probe. Node has no built-in statfs; use df via subprocess.
    let freeBytes = 0
    let totalBytes = 0
    try {
      const r = await runCommand('df', ['-B1', '-P', OUTPUTS_DIR], { timeoutMs: 3000 })
      const lines = r.stdout.trim().split('\n')
      const parts = lines[1]?.split(/\s+/)
      if (parts && parts.length >= 4) {
        totalBytes = parseInt(parts[1], 10)
        freeBytes = parseInt(parts[3], 10)
      }
    } catch {
      // Fallback: use os.freemem as an extremely rough proxy is wrong; just report unknown.
    }

    return {
      name: 'disk',
      status: freeBytes > 1 * 1024 * 1024 * 1024 ? 'ok' : 'degraded',
      detail: `uploads/ and outputs/ writable. Free: ${(freeBytes / 1e9).toFixed(1)} GB`,
      version: `${(freeBytes / 1e9).toFixed(1)}GB free / ${(totalBytes / 1e9).toFixed(1)}GB total`,
    }
  } catch (e) {
    return { name: 'disk', status: 'down', detail: (e as Error).message }
  }
}

export async function checkHealth(): Promise<{
  status: HealthStatus
  uptime: number
  components: ComponentHealth[]
}> {
  const components = await Promise.all([
    checkDatabase(),
    checkBinary('ffmpeg', '-version'),
    checkBinary('ffprobe', '-version'),
    checkPython(),
    checkWhisper(),
    checkDisk(),
  ])

  const hasDown = components.some(
    (c) => c.status === 'down' && (c.name === 'database' || c.name === 'ffmpeg' || c.name === 'ffprobe'),
  )
  const hasDegraded = components.some((c) => c.status === 'degraded' || c.status === 'down')

  let status: HealthStatus = 'ok'
  if (hasDown) status = 'down'
  else if (hasDegraded) status = 'degraded'

  log.debug('Health checked', { status, components: components.map((c) => c.name).join(',') })
  return {
    status,
    uptime: Date.now() - startedAt,
    components,
  }
}
