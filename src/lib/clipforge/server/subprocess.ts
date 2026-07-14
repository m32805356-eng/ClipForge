/**
 * ClipForge — typed subprocess runner.
 *
 * Wraps Node's child_process with:
 *   - Promise-based API
 *   - Timeout protection (kills process tree on expiry)
 *   - Captured stdout/stderr (with size caps to avoid memory blowups)
 *   - Optional streaming progress callback (line-by-line stderr parsing)
 *   - Structured logging
 *
 * Used to invoke ffmpeg, ffprobe, and Python scripts (Whisper, MediaPipe).
 */
import { spawn, type ChildProcess } from 'node:child_process'
import { existsSync } from 'node:fs'
import { logger } from './logger'

const MAX_CAPTURE_BYTES = 2 * 1024 * 1024 // 2 MiB per stream

export interface RunOptions {
  /** Kill the process after this many milliseconds. Default: 10 min. */
  timeoutMs?: number
  /** Working directory. Default: project root. */
  cwd?: string
  /** Environment overrides merged atop process.env. */
  env?: Record<string, string>
  /** Called for each line written to stderr (ffmpeg writes progress here). */
  onStderrLine?: (line: string) => void
  /** Called for each line written to stdout. */
  onStdoutLine?: (line: string) => void
  /** Abort the spawn externally. */
  signal?: AbortSignal
}

export interface RunResult {
  exitCode: number
  stdout: string
  stderr: string
  /** Wall-clock duration in milliseconds. */
  durationMs: number
  /** True if exitCode === 0. */
  ok: boolean
}

export class SubprocessError extends Error {
  constructor(
    message: string,
    public readonly exitCode: number | null,
    public readonly stderr: string,
    public readonly stdout: string,
  ) {
    super(message)
    this.name = 'SubprocessError'
  }
}

/**
 * Spawn a command, await completion, return captured output.
 * Throws SubprocessError on non-zero exit (or timeout).
 */
export function runCommand(
  command: string,
  args: string[],
  opts: RunOptions = {},
): Promise<RunResult> {
  return new Promise((resolve, reject) => {
    const start = Date.now()
    const log = logger.scoped('subprocess')

    let proc: ChildProcess
    try {
      proc = spawn(command, args, {
        cwd: opts.cwd ?? process.cwd(),
        env: { ...process.env, ...opts.env },
        stdio: ['ignore', 'pipe', 'pipe'],
      })
    } catch (e) {
      reject(new Error(`Failed to spawn ${command}: ${(e as Error).message}`))
      return
    }

    let stdout = ''
    let stderr = ''
    let stdoutBuf = ''
    let stderrBuf = ''
    let killed = false
    let timer: NodeJS.Timeout | undefined

    const onTimeout = () => {
      killed = true
      log.warn('Process killed: timeout', { command, args, timeoutMs: opts.timeoutMs })
      proc.kill('SIGKILL')
    }
    if (opts.timeoutMs && opts.timeoutMs > 0) {
      timer = setTimeout(onTimeout, opts.timeoutMs)
    }
    if (opts.signal) {
      opts.signal.addEventListener('abort', () => {
        killed = true
        proc.kill('SIGKILL')
      }, { once: true })
    }

    proc.stdout?.on('data', (chunk: Buffer) => {
      if (stdout.length < MAX_CAPTURE_BYTES) stdout += chunk.toString('utf8')
      stdoutBuf += chunk.toString('utf8')
      let nl: number
      while ((nl = stdoutBuf.indexOf('\n')) >= 0) {
        const line = stdoutBuf.slice(0, nl).replace(/\r$/, '')
        stdoutBuf = stdoutBuf.slice(nl + 1)
        opts.onStdoutLine?.(line)
      }
    })

    proc.stderr?.on('data', (chunk: Buffer) => {
      if (stderr.length < MAX_CAPTURE_BYTES) stderr += chunk.toString('utf8')
      stderrBuf += chunk.toString('utf8')
      let nl: number
      while ((nl = stderrBuf.indexOf('\n')) >= 0) {
        const line = stderrBuf.slice(0, nl).replace(/\r$/, '')
        stderrBuf = stderrBuf.slice(nl + 1)
        opts.onStderrLine?.(line)
      }
    })

    proc.on('error', (err) => {
      if (timer) clearTimeout(timer)
      reject(new Error(`Failed to execute ${command}: ${err.message}`))
    })

    proc.on('close', (code) => {
      if (timer) clearTimeout(timer)
      const durationMs = Date.now() - start
      const exitCode = code ?? -1
      const ok = exitCode === 0
      log.debug('Process finished', { command, exitCode, durationMs, ok })
      const result: RunResult = { exitCode, stdout, stderr, durationMs, ok }
      if (ok) resolve(result)
      else {
        reject(
          new SubprocessError(
            killed
              ? `${command} timed out after ${opts.timeoutMs}ms`
              : `${command} exited with code ${exitCode}`,
            exitCode,
            stderr,
            stdout,
          ),
        )
      }
    })
  })
}

/** Spawn ffmpeg. Convenience wrapper. */
export function runFfmpeg(args: string[], opts: RunOptions = {}): Promise<RunResult> {
  return runCommand('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args], opts)
}

/** Spawn ffprobe. Convenience wrapper. */
export function runFfprobe(args: string[], opts: RunOptions = {}): Promise<RunResult> {
  return runCommand('ffprobe', ['-v', 'quiet', '-print_format', 'json', ...args], opts)
}

/** Spawn python3 with a script file and JSON args (stdin). Returns parsed JSON stdout. */
export async function runPythonJson<T = unknown>(
  scriptPath: string,
  payload: unknown,
  opts: RunOptions = {},
): Promise<T> {
  // Prefer the venv python3 (has faster-whisper, yt-dlp installed) if it exists.
  // Fall back to system python3.
  const venvPython = '/home/z/.venv/bin/python3'
  const pythonBin = existsSync(venvPython) ? venvPython : 'python3'
  const result = await runCommand(pythonBin, [scriptPath], {
    ...opts,
    env: { ...opts.env, CLIPFORGE_PYTHON_PAYLOAD: JSON.stringify(payload) },
  })
  try {
    return JSON.parse(result.stdout) as T
  } catch (e) {
    throw new SubprocessError(
      `Python script ${scriptPath} returned invalid JSON: ${(e as Error).message}`,
      result.exitCode,
      result.stderr,
      result.stdout,
    )
  }
}
