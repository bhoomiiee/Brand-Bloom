/**
 * Security utilities for multi-tenant isolation and data protection
 */

import { prisma } from './db'

/**
 * Verify that a resource belongs to the specified store
 * Prevents unauthorized cross-tenant data access
 */
export async function verifyResourceOwnership(
  resourceType: 'product' | 'order' | 'customer' | 'category' | 'recommendation',
  resourceId: string,
  storeId: string
): Promise<boolean> {
  try {
    let resource: { storeId: string } | null = null

    switch (resourceType) {
      case 'product':
        resource = await prisma.product.findUnique({
          where: { id: resourceId },
          select: { storeId: true },
        })
        break
      case 'order':
        resource = await prisma.order.findUnique({
          where: { id: resourceId },
          select: { storeId: true },
        })
        break
      case 'customer':
        resource = await prisma.customer.findUnique({
          where: { id: resourceId },
          select: { storeId: true },
        })
        break
      case 'category':
        resource = await prisma.category.findUnique({
          where: { id: resourceId },
          select: { storeId: true },
        })
        break
      case 'recommendation':
        resource = await prisma.recommendation.findUnique({
          where: { id: resourceId },
          select: { storeId: true },
        })
        break
    }

    return resource?.storeId === storeId
  } catch (error) {
    console.error('Resource ownership verification failed:', error)
    return false
  }
}

/**
 * Sanitize user input to prevent XSS attacks
 * Basic sanitization - React handles most escaping automatically
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .slice(0, 10000) // Limit length to prevent DoS
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate URL format for image uploads
 */
export function isValidImageUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return (
      (parsed.protocol === 'http:' || parsed.protocol === 'https:') &&
      /\.(jpg|jpeg|png|gif|webp)$/i.test(parsed.pathname)
    )
  } catch {
    return false
  }
}

/**
 * Check if a slug is reserved (system routes)
 */
export const RESERVED_SLUGS = [
  'admin',
  'api',
  'auth',
  'dashboard',
  'store',
  'public',
  '_next',
  'static',
  'favicon.ico',
  'robots.txt',
  'sitemap.xml',
  'onboarding',
  'signin',
  'signup',
  'login',
  'logout',
  'register',
]

export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUGS.includes(slug.toLowerCase())
}

/**
 * Generate a secure random token
 */
export function generateSecureToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let token = ''
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return token
}

/**
 * Rate limiting helper (in-memory, basic implementation)
 * For production, use Redis or a dedicated service
 */
const requestCounts = new Map<string, { count: number; resetAt: number }>()

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 100,
  windowMs: number = 60000 // 1 minute
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now()
  const record = requestCounts.get(identifier)

  // Reset if window expired
  if (!record || now > record.resetAt) {
    const resetAt = now + windowMs
    requestCounts.set(identifier, { count: 1, resetAt })
    return { allowed: true, remaining: maxRequests - 1, resetAt }
  }

  // Check if limit exceeded
  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetAt: record.resetAt }
  }

  // Increment count
  record.count++
  return {
    allowed: true,
    remaining: maxRequests - record.count,
    resetAt: record.resetAt,
  }
}

/**
 * Clean up expired rate limit records (call periodically)
 */
export function cleanupRateLimits() {
  const now = Date.now()
  for (const [key, record] of requestCounts.entries()) {
    if (now > record.resetAt) {
      requestCounts.delete(key)
    }
  }
}

/**
 * Validate password strength
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Mask sensitive data for logging
 */
export function maskEmail(email: string): string {
  const [username, domain] = email.split('@')
  if (!username || !domain) return '***@***.***'
  
  const maskedUsername =
    username.length > 2
      ? username[0] + '*'.repeat(username.length - 2) + username[username.length - 1]
      : username[0] + '*'
  
  return `${maskedUsername}@${domain}`
}

export function maskCardNumber(cardNumber: string): string {
  return '**** **** **** ' + cardNumber.slice(-4)
}

/**
 * Security headers for API responses
 */
export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
}

/**
 * Check if request is from a valid origin (CORS)
 */
export function isValidOrigin(origin: string | null, allowedOrigins: string[]): boolean {
  if (!origin) return false
  return allowedOrigins.some((allowed) => origin === allowed || origin.endsWith(allowed))
}

/**
 * Audit log entry
 */
export type AuditLog = {
  userId: string
  storeId: string
  action: string
  resourceType: string
  resourceId?: string
  details?: Record<string, any>
  ipAddress?: string
  userAgent?: string
  timestamp: Date
}

/**
 * Create audit log entry (for future implementation)
 */
export async function createAuditLog(entry: AuditLog): Promise<void> {
  // TODO: Implement audit logging to database or external service
  console.log('[AUDIT]', JSON.stringify(entry))
}
