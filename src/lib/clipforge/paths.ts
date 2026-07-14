/**
 * ClipForge — canonical project paths.
 *
 * All paths are resolved relative to the project root so they work regardless
 * of the current working directory (important because Next.js API routes and
 * Python subprocesses may have different CWDs).
 */
import path from 'node:path'

/** Absolute path to the project root (the folder containing package.json). */
export const PROJECT_ROOT = path.resolve(process.cwd())

/** Source video uploads. */
export const UPLOADS_DIR = path.join(PROJECT_ROOT, 'uploads')

/** Generated clips, thumbnails, audio extractions. */
export const OUTPUTS_DIR = path.join(PROJECT_ROOT, 'outputs')

/** AI model cache (faster-whisper weights, etc.). */
export const MODELS_DIR = path.join(PROJECT_ROOT, 'models')

/** Python automation scripts invoked via subprocess. */
export const SCRIPTS_DIR = path.join(PROJECT_ROOT, 'scripts')

/** SQLite database file (matches DATABASE_URL in .env). */
export const DATABASE_FILE = path.join(PROJECT_ROOT, 'db', 'custom.db')

/**
 * Resolves a stored relative path (e.g. "outputs/abc/thumb.jpg") to an
 * absolute filesystem path. Stored paths must always be project-relative
 * so the DB remains portable.
 */
export function resolveStoredPath(stored: string): string {
  return path.isAbsolute(stored) ? stored : path.join(PROJECT_ROOT, stored)
}

/**
 * Converts an absolute path inside the project into a project-relative stored
 * path. Throws if the path is outside the project root (safety guard against
 * storing absolute paths that could leak host info).
 */
export function toStoredPath(absolute: string): string {
  const rel = path.relative(PROJECT_ROOT, absolute)
  if (rel.startsWith('..')) {
    throw new Error(`Refusing to store path outside project root: ${absolute}`)
  }
  return rel
}
