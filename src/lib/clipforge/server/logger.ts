/**
 * ClipForge — server-side structured logger.
 *
 * Minimal, dependency-free logger that writes JSON lines to stdout/stderr.
 * Designed for local single-user use: informative but not noisy.
 *
 * Levels (in order): debug < info < warn < error
 * Level is controlled by CLIPFORGE_LOG_LEVEL env var (default: info).
 */
type LogLevel = 'debug' | 'info' | 'warn' | 'error'

const LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
}

const ENV_LEVEL = (process.env.CLIPFORGE_LOG_LEVEL as LogLevel | undefined) ?? 'info'

function shouldLog(level: LogLevel): boolean {
  return LEVEL_ORDER[level] >= LEVEL_ORDER[ENV_LEVEL] ?? LEVEL_ORDER.info
}

interface LogContext {
  [key: string]: unknown
}

function emit(level: LogLevel, message: string, ctx: LogContext = {}, error?: unknown) {
  if (!shouldLog(level)) return
  const record = {
    ts: new Date().toISOString(),
    level,
    msg: message,
    ...ctx,
  }
  if (error) {
    record.error = error instanceof Error
      ? { name: error.name, message: error.message, stack: error.stack }
      : String(error)
  }
  const line = JSON.stringify(record)
  if (level === 'error' || level === 'warn') {
    process.stderr.write(line + '\n')
  } else {
    process.stdout.write(line + '\n')
  }
}

export const logger = {
  debug: (msg: string, ctx?: LogContext) => emit('debug', msg, ctx),
  info: (msg: string, ctx?: LogContext) => emit('info', msg, ctx),
  warn: (msg: string, ctx?: LogContext, error?: unknown) => emit('warn', msg, ctx, error),
  error: (msg: string, ctx?: LogContext, error?: unknown) => emit('error', msg, ctx, error),

  /** Scoped logger that prepends a component tag to every message. */
  scoped: (scope: string) => ({
    debug: (msg: string, ctx?: LogContext) => emit('debug', msg, { ...ctx, scope }),
    info: (msg: string, ctx?: LogContext) => emit('info', msg, { ...ctx, scope }),
    warn: (msg: string, ctx?: LogContext, error?: unknown) => emit('warn', msg, { ...ctx, scope }, error),
    error: (msg: string, ctx?: LogContext, error?: unknown) => emit('error', msg, { ...ctx, scope }, error),
  }),
}
