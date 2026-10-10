/**
 * NextAuth Configuration
 * 
 * Implements authentication with role-based access control
 * Supports credentials (email/password) and OAuth providers
 */

import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { db } from './db'

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db) as any,
  session: {
    strategy: 'jwt',
  },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || 'development-secret-change-in-production-hackathon-2024',
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null
          }

          const email = String(credentials.email).toLowerCase().trim()
          const password = String(credentials.password)

          const user = await db.user.findUnique({
            where: {
              email,
            },
            include: {
              memberships: {
                where: {
                  status: 'ACTIVE',
                },
                include: {
                  store: true,
                },
              },
            },
          })

          if (!user || !user.password) {
            return null
          }

          const isPasswordValid = await compare(password, user.password)

          if (!isPasswordValid) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          }
        } catch (error) {
          console.error('Error in authorize credentials:', error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id as string
      }

      // If user has no active store selected yet in token, look up active memberships
      if (token.id && (!token.currentStoreId || !token.stores || (token.stores as any[]).length === 0)) {
        const memberships = await db.membership.findMany({
          where: {
            userId: token.id as string,
            status: 'ACTIVE',
          },
          include: {
            store: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        })

        if (memberships.length > 0) {
          token.stores = memberships.map(m => ({
            id: m.storeId,
            name: m.store.name,
            slug: m.store.slug,
            role: m.role as 'OWNER' | 'STAFF',
          }))
          // Set default store to first one
          token.currentStoreId = memberships[0].storeId
          token.currentStoreRole = memberships[0].role as 'OWNER' | 'STAFF'
        }
      }

      // Update session (for store switching)
      if (trigger === 'update' && session?.storeId) {
        const membership = await db.membership.findFirst({
          where: {
            userId: token.id as string,
            storeId: session.storeId,
            status: 'ACTIVE',
          },
        })

        if (membership) {
          token.currentStoreId = session.storeId
          token.currentStoreRole = membership.role as 'OWNER' | 'STAFF'
        }
      }

      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.stores = token.stores as any
        session.currentStoreId = token.currentStoreId as string
        session.currentStoreRole = token.currentStoreRole as 'OWNER' | 'STAFF' | undefined
      }
      return session
    },
  },
  events: {
    async signIn({ user }) {
      console.log(`User signed in: ${user.email}`)
    },
    async signOut() {
      console.log('User signed out')
    },
  },
  debug: process.env.NODE_ENV === 'development',
})

/**
 * Get current user session
 */
export async function getCurrentUser() {
  const session = await auth()
  return session?.user
}

/**
 * Get current user's active store
 */
export async function getCurrentStore() {
  const session = await auth()
  
  if (session?.currentStoreId) {
    const store = await db.store.findUnique({
      where: {
        id: session.currentStoreId,
      },
    })
    if (store) return store
  }

  // Fallback: If session user exists, check db for active membership directly
  if (session?.user?.id) {
    const membership = await db.membership.findFirst({
      where: {
        userId: session.user.id,
        status: 'ACTIVE',
      },
      include: {
        store: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    if (membership?.store) {
      return membership.store
    }
  }

  return null
}

/**
 * Check if user has required role in current store
 */
export async function requireRole(requiredRole: 'OWNER' | 'STAFF' = 'STAFF') {
  const session = await auth()

  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  let storeId = session.currentStoreId
  let role = session.currentStoreRole

  if (!storeId || !role) {
    const membership = await db.membership.findFirst({
      where: {
        userId: session.user.id,
        status: 'ACTIVE',
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    if (membership) {
      storeId = membership.storeId
      role = membership.role
    }
  }

  if (!storeId || !role) {
    throw new Error('No active store')
  }

  if (requiredRole === 'OWNER' && role !== 'OWNER') {
    throw new Error('Owner access required')
  }

  return {
    userId: session.user.id,
    storeId,
    role,
  }
}

/**
 * Require authentication (any authenticated user)
 */
export async function requireAuth() {
  const session = await auth()

  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  return session.user
}
