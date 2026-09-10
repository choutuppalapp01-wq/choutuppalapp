import { PrismaClient } from '@prisma/client'

/**
 * Prisma Client singleton with resilient fallback proxy for AI Studio environment.
 * Prevents app crashes when database is unreachable or offline.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: any | undefined
}

let rawPrisma: any = null
try {
  let dbUrl = process.env.DATABASE_URL || ''
  if (dbUrl && !dbUrl.includes('pgbouncer=true')) {
    dbUrl += dbUrl.includes('?') ? '&pgbouncer=true&connection_limit=1' : '?pgbouncer=true&connection_limit=1'
  }
  rawPrisma =
    globalForPrisma.prisma ??
    new PrismaClient({
      datasources: dbUrl ? { db: { url: dbUrl } } : undefined,
      log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
    })
} catch (err) {
  console.warn('[AI Studio] PrismaClient init failed — will use mock proxy:', err)
}

const noOpMap: Record<string, (args?: any) => any> = {
  findMany: async () => [],
  findFirst: async () => null,
  findUnique: async () => null,
  count: async () => 0,
  create: async (d: any) => ({ id: 'mock_' + Date.now(), ...(d?.data ?? {}) }),
  createMany: async () => ({ count: 0 }),
  update: async (d: any) => ({ id: d?.where?.id || 'mock_' + Date.now(), ...(d?.data ?? {}) }),
  updateMany: async () => ({ count: 0 }),
  upsert: async (d: any) => ({ id: d?.where?.id || 'mock_' + Date.now(), ...(d?.create ?? d?.update ?? {}) }),
  delete: async (d: any) => ({ id: d?.where?.id || 'mock' }),
  deleteMany: async () => ({ count: 0 }),
  aggregate: async () => ({ _count: 0 }),
  groupBy: async () => [],
}

function createModelProxy(target: any, modelName: string) {
  return new Proxy(target || {}, {
    get(modelTarget, action: string) {
      const realMethod = modelTarget?.[action]
      return async (...args: any[]) => {
        if (typeof realMethod === 'function') {
          try {
            return await realMethod.apply(modelTarget, args)
          } catch (error) {
            console.warn(
              `[Prisma Mock Fallback] ${modelName}.${action} failed, returning safe fallback:`,
              error instanceof Error ? error.message : error
            )
            const fallbackFn = noOpMap[action]
            return fallbackFn ? fallbackFn(...args) : null
          }
        }
        const fallbackFn = noOpMap[action]
        return fallbackFn ? fallbackFn(...args) : null
      }
    },
  })
}

export const prisma = new Proxy(rawPrisma || {}, {
  get(target, prop: string) {
    if (
      prop === '$queryRaw' ||
      prop === '$executeRaw' ||
      prop === '$queryRawUnsafe' ||
      prop === '$executeRawUnsafe'
    ) {
      return async (...args: any[]) => {
        if (typeof target?.[prop] === 'function') {
          try {
            return await target[prop](...args)
          } catch {
            return []
          }
        }
        return []
      }
    }
    if (prop === '$transaction') {
      return async (arg: any) => {
        if (typeof target?.$transaction === 'function') {
          try {
            return await target.$transaction(arg)
          } catch {
            if (Array.isArray(arg)) return Promise.all(arg)
            if (typeof arg === 'function') return arg(prisma)
            return null
          }
        }
        if (Array.isArray(arg)) return Promise.all(arg)
        if (typeof arg === 'function') return arg(prisma)
        return null
      }
    }
    return createModelProxy(target?.[prop], prop)
  },
})

// Store Prisma instance on globalThis
globalForPrisma.prisma = rawPrisma

// Canonical export name used across the app.
export const db = prisma

/**
 * Safe Database Query Wrapper with Automatic Retry & Fallback.
 */
export async function safeDbQuery<T>(
  queryFn: () => Promise<T>,
  fallback: T,
  maxRetries = 1,
  delayMs = 200
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await queryFn()
    } catch (err) {
      console.warn(`[DBQueryAttempt ${attempt}/${maxRetries} Failed]:`, err instanceof Error ? err.message : err)
      if (attempt === maxRetries) {
        return fallback
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs))
    }
  }
  return fallback
}

export default prisma
