/**
 * Tenant Isolation Helpers
 * 
 * These functions ensure multi-tenant data isolation by automatically
 * scoping queries to the correct store. Never trust client-supplied store_id.
 */

import { db } from './db'
import { Prisma } from '@prisma/client'

/**
 * Get store ID from authenticated session/membership
 * This should be called on the server side only
 */
export async function getStoreIdFromUser(userId: string): Promise<string | null> {
  const membership = await db.membership.findFirst({
    where: {
      userId,
      status: 'ACTIVE',
    },
    select: {
      storeId: true,
    },
  })

  return membership?.storeId || null
}

/**
 * Get store by slug (for public storefront)
 */
export async function getStoreBySlug(slug: string) {
  return db.store.findUnique({
    where: {
      slug,
      status: 'ACTIVE',
    },
  })
}

/**
 * Verify user has access to store
 */
export async function verifyStoreAccess(
  userId: string,
  storeId: string,
  requiredRole?: 'OWNER' | 'STAFF'
): Promise<boolean> {
  const membership = await db.membership.findFirst({
    where: {
      userId,
      storeId,
      status: 'ACTIVE',
      ...(requiredRole && { role: requiredRole }),
    },
  })

  return !!membership
}

/**
 * Get user's role in a store
 */
export async function getUserStoreRole(
  userId: string,
  storeId: string
): Promise<'OWNER' | 'STAFF' | null> {
  const membership = await db.membership.findFirst({
    where: {
      userId,
      storeId,
      status: 'ACTIVE',
    },
    select: {
      role: true,
    },
  })

  return membership?.role || null
}

/**
 * Create scoped Prisma client for a specific store
 * All queries will automatically be scoped to this store
 */
export function createScopedClient(storeId: string) {
  return {
    // Products
    products: {
      findMany: (args?: Prisma.ProductFindManyArgs) =>
        db.product.findMany({
          ...args,
          where: {
            ...args?.where,
            storeId,
          },
        }),
      findUnique: (args: Prisma.ProductFindUniqueArgs) =>
        db.product.findFirst({
          ...args,
          where: {
            ...args.where,
            storeId,
          },
        }),
      create: (args: Prisma.ProductCreateArgs) =>
        db.product.create({
          ...args,
          data: {
            ...args.data,
            storeId,
          },
        }),
      update: (args: Prisma.ProductUpdateArgs) =>
        db.product.updateMany({
          ...args,
          where: {
            ...args.where,
            storeId,
          },
        }),
      delete: (args: Prisma.ProductDeleteArgs) =>
        db.product.deleteMany({
          where: {
            ...args.where,
            storeId,
          },
        }),
      count: (args?: Prisma.ProductCountArgs) =>
        db.product.count({
          ...args,
          where: {
            ...args?.where,
            storeId,
          },
        }),
    },

    // Categories
    categories: {
      findMany: (args?: Prisma.CategoryFindManyArgs) =>
        db.category.findMany({
          ...args,
          where: {
            ...args?.where,
            storeId,
          },
        }),
      create: (args: Prisma.CategoryCreateArgs) =>
        db.category.create({
          ...args,
          data: {
            ...args.data,
            storeId,
          },
        }),
    },

    // Orders
    orders: {
      findMany: (args?: Prisma.OrderFindManyArgs) =>
        db.order.findMany({
          ...args,
          where: {
            ...args?.where,
            storeId,
          },
        }),
      findUnique: (args: Prisma.OrderFindUniqueArgs & { where: { id: string } }) =>
        db.order.findFirst({
          ...args,
          where: {
            id: args.where.id,
            storeId,
          },
        }),
      count: (args?: Prisma.OrderCountArgs) =>
        db.order.count({
          ...args,
          where: {
            ...args?.where,
            storeId,
          },
        }),
    },

    // Customers
    customers: {
      findMany: (args?: Prisma.CustomerFindManyArgs) =>
        db.customer.findMany({
          ...args,
          where: {
            ...args?.where,
            storeId,
          },
        }),
      count: (args?: Prisma.CustomerCountArgs) =>
        db.customer.count({
          ...args,
          where: {
            ...args?.where,
            storeId,
          },
        }),
    },

    // Analytics
    analytics: {
      findMany: (args?: Prisma.StoreAnalyticsFindManyArgs) =>
        db.storeAnalytics.findMany({
          ...args,
          where: {
            ...args?.where,
            storeId,
          },
        }),
    },

    // Recommendations
    recommendations: {
      findMany: (args?: Prisma.RecommendationFindManyArgs) =>
        db.recommendation.findMany({
          ...args,
          where: {
            ...args?.where,
            storeId,
          },
        }),
      create: (args: Prisma.RecommendationCreateArgs) =>
        db.recommendation.create({
          ...args,
          data: {
            ...args.data,
            storeId,
          },
        }),
    },
  }
}

/**
 * Audit log for sensitive operations
 */
export async function logAction(
  action: string,
  userId: string,
  storeId: string,
  details?: Record<string, any>
) {
  // In production, this would write to an audit log table
  console.log('[AUDIT]', {
    action,
    userId,
    storeId,
    details,
    timestamp: new Date().toISOString(),
  })
}

/**
 * Check if store slug is available
 */
export async function isSlugAvailable(slug: string, excludeStoreId?: string): Promise<boolean> {
  const existing = await db.store.findFirst({
    where: {
      slug,
      ...(excludeStoreId && { id: { not: excludeStoreId } }),
    },
  })

  return !existing
}

/**
 * Get all stores for a user
 */
export async function getUserStores(userId: string) {
  const memberships = await db.membership.findMany({
    where: {
      userId,
      status: 'ACTIVE',
    },
    include: {
      store: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return memberships.map(m => ({
    ...m.store,
    role: m.role,
  }))
}
