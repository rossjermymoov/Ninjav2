// src/lib/db.ts
// Prisma client singleton — prevents connection pool exhaustion
// during Next.js hot reloads in development.
//
// Prisma 7 with engineType="library" requires the connection URL
// to be passed via datasourceUrl rather than in schema.prisma.

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
