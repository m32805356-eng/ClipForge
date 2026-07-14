import { PrismaClient } from '@prisma/client'
import { existsSync, mkdirSync } from 'node:fs'
import path from 'node:path'

// Ensure the database directory exists (needed for fresh deploys).
const dbUrl = process.env.DATABASE_URL ?? ''
if (dbUrl.startsWith('file:')) {
  const dbPath = dbUrl.replace('file:', '')
  const dbDir = path.dirname(dbPath)
  if (!existsSync(dbDir)) {
    try {
      mkdirSync(dbDir, { recursive: true })
    } catch {
      // Directory creation may fail in read-only environments — that's OK,
      // Prisma will report the error on first query.
    }
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'production' ? ['error', 'warn'] : ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
