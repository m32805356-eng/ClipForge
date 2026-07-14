/**
 * GET /api/files/[...path]
 *
 * Serves files from the project's local uploads/ and outputs/ directories.
 * Supports HTTP Range requests so <video> elements can seek efficiently.
 *
 * Security:
 *   - Path is constrained to UPLOADS_DIR and OUTPUTS_DIR (path traversal blocked).
 *   - Stored paths in the DB are always project-relative (e.g. "outputs/abc/thumb.jpg").
 *
 * Usage in <img>/<video>:
 *   <img src={`/api/files/${storedPath}`} />
 */
import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { UPLOADS_DIR, OUTPUTS_DIR, resolveStoredPath, toStoredPath } from '@/lib/clipforge/paths'
import { logger } from '@/lib/clipforge/server/logger'

export const dynamic = 'force-dynamic'

const MIME_BY_EXT: Record<string, string> = {
  '.mp4': 'video/mp4',
  '.mov': 'video/quicktime',
  '.mkv': 'video/x-matroska',
  '.webm': 'video/webm',
  '.avi': 'video/x-msvideo',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.ass': 'text/plain',
  '.srt': 'text/plain',
  '.json': 'application/json',
}

function mimeFor(filename: string): string {
  const ext = path.extname(filename).toLowerCase()
  return MIME_BY_EXT[ext] ?? 'application/octet-stream'
}

function isInside(filePath: string, dir: string): boolean {
  const rel = path.relative(dir, filePath)
  return rel === '' || (!rel.startsWith('..') && !path.isAbsolute(rel))
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await params
  const relativePath = segments.map(encodeURIComponent).join('/').replace(/%2F/gi, '/')
  const decoded = segments.map(decodeURIComponent).join('/')

  // Resolve against project root and ensure it lands inside uploads/ or outputs/.
  const absolute = resolveStoredPath(decoded)
  const inUploads = isInside(absolute, UPLOADS_DIR)
  const inOutputs = isInside(absolute, OUTPUTS_DIR)
  if (!inUploads && !inOutputs) {
    return NextResponse.json(
      { error: { code: 'FORBIDDEN', message: 'Path is outside allowed directories' } },
      { status: 403 },
    )
  }

  let stat: { size: number; mtime: Date }
  try {
    const s = await fs.stat(absolute)
    if (!s.isFile()) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Not a file' } },
        { status: 404 },
      )
    }
    stat = { size: s.size, mtime: s.mtime }
  } catch {
    return NextResponse.json(
      { error: { code: 'NOT_FOUND', message: 'File not found' } },
      { status: 404 },
    )
  }

  const contentType = mimeFor(absolute)
  const rangeHeader = _req.headers.get('range')

  // No Range header → serve whole file.
  if (!rangeHeader) {
    const data = await fs.readFile(absolute)
    return new NextResponse(data, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': String(stat.size),
        'Cache-Control': 'private, max-age=300',
        'Last-Modified': stat.mtime.toUTCString(),
      },
    })
  }

  // Parse Range: bytes=start-end
  const match = /^bytes=(\d*)-(\d*)$/.exec(rangeHeader)
  if (!match) {
    return new NextResponse(null, {
      status: 416,
      headers: { 'Content-Range': `bytes */${stat.size}` },
    })
  }
  const startStr = match[1]
  const endStr = match[2]
  let start = startStr ? parseInt(startStr, 10) : 0
  let end = endStr ? parseInt(endStr, 10) : stat.size - 1
  if (Number.isNaN(start) || Number.isNaN(end) || start > end || start >= stat.size) {
    return new NextResponse(null, {
      status: 416,
      headers: { 'Content-Range': `bytes */${stat.size}` },
    })
  }
  end = Math.min(end, stat.size - 1)
  const length = end - start + 1

  const fd = await fs.open(absolute, 'r')
  try {
    const buf = Buffer.allocUnsafe(length)
    await fd.read(buf, 0, length, start)
    return new NextResponse(buf, {
      status: 206,
      headers: {
        'Content-Type': contentType,
        'Content-Length': String(length),
        'Content-Range': `bytes ${start}-${end}/${stat.size}`,
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'private, max-age=300',
      },
    })
  } finally {
    await fd.close()
  }
}

/** Helper exported for other routes: convert an absolute path to a /api/files URL. */
export function fileUrl(absoluteOrStored: string): string {
  const stored = absoluteOrStored.startsWith('/')
    ? toStoredPath(absoluteOrStored)
    : absoluteOrStored
  return `/api/files/${stored.split(path.sep).join('/')}`
}

// Silence unused-import warning for logger (kept for future request logging).
void logger
