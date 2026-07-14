/**
 * ClipForge — Next.js API response helpers.
 *
 * Standardizes JSON envelopes + error handling across all routes.
 */
import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { logger } from '@/lib/clipforge/server/logger'

export interface ApiError {
  error: {
    code: string
    message: string
    details?: unknown
  }
}

export function ok<T>(data: T, status: 200 | 201 = 200) {
  return NextResponse.json(data, { status })
}

export function fail(
  code: string,
  message: string,
  status: 400 | 401 | 403 | 404 | 409 | 422 | 500 = 400,
  details?: unknown,
) {
  logger.warn('API error', { code, message, status })
  const body: ApiError = { error: { code, message, details } }
  return NextResponse.json(body, { status })
}

export function failZod(error: ZodError) {
  return fail('VALIDATION_ERROR', 'Request validation failed', 422, error.flatten())
}

export function failNotFound(resource: string, id: string) {
  return fail('NOT_FOUND', `${resource} not found: ${id}`, 404)
}

export function failInternal(message: string, error?: unknown) {
  logger.error('Internal error', { message }, error)
  return fail('INTERNAL_ERROR', message, 500)
}
