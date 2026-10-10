/**
 * Zod Validation Schemas
 * 
 * Centralized validation for forms and API endpoints
 */

import { z } from 'zod'

// ============================================================================
// STORE ONBOARDING
// ============================================================================

export const storeOnboardingSchema = z.object({
  name: z.string().min(2, 'Store name must be at least 2 characters').max(100),
  slug: z.string()
    .min(2)
    .max(50)
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens')
    .refine((slug) => !['admin', 'api', 'dashboard', 'auth', 'store'].includes(slug), {
      message: 'This slug is reserved',
    }),
  description: z.string().max(500).optional(),
  logo: z.string().url().optional().or(z.literal('')),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().max(20).optional().or(z.literal('')),
  address: z.string().max(500).optional().or(z.literal('')),
  businessType: z.enum([
    'FASHION',
    'ELECTRONICS',
    'HOME_GARDEN',
    'BEAUTY_HEALTH',
    'SPORTS_OUTDOORS',
    'BOOKS_MEDIA',
    'FOOD_BEVERAGE',
    'TOYS_KIDS',
    'AUTOMOTIVE',
    'OTHER',
  ]),
})

export type StoreOnboarding = z.infer<typeof storeOnboardingSchema>

// ============================================================================
// CATEGORY
// ============================================================================

export const categorySchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters').max(100),
  slug: z.string()
    .min(2)
    .max(50)
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  description: z.string().max(500).optional().or(z.literal('')),
  isCustom: z.boolean().default(false),
})

export type CategoryInput = z.infer<typeof categorySchema>

// ============================================================================
// PRODUCT
// ============================================================================

export const productSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters').max(200),
  slug: z.string()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  description: z.string().max(5000).optional().or(z.literal('')),
  categoryId: z.string().min(1, 'Category is required'),
  price: z.number().min(0, 'Price must be positive').max(999999.99),
  comparePrice: z.number().min(0).max(999999.99).optional().nullable(),
  cost: z.number().min(0).max(999999.99).optional().nullable(),
  stock: z.number().int().min(0, 'Stock cannot be negative').default(0),
  sku: z.string().max(100).optional().or(z.literal('')),
  barcode: z.string().max(100).optional().or(z.literal('')),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
})

export type ProductInput = z.infer<typeof productSchema>

// Product variant
export const productVariantSchema = z.object({
  name: z.string().min(1, 'Variant name is required').max(100),
  sku: z.string().max(100).optional().or(z.literal('')),
  price: z.number().min(0).max(999999.99).optional().nullable(),
  stock: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
})

export type ProductVariantInput = z.infer<typeof productVariantSchema>

// ============================================================================
// PRODUCT CSV IMPORT
// ============================================================================

export const productCsvRowSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().optional(),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid price format'),
  comparePrice: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid price format').optional().or(z.literal('')),
  stock: z.string().regex(/^\d+$/, 'Stock must be a number').optional().or(z.literal('')),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
})

export type ProductCsvRow = z.infer<typeof productCsvRowSchema>

// ============================================================================
// ORDER & CHECKOUT
// ============================================================================

export const checkoutSchema = z.object({
  customerName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  customerEmail: z.string().email('Invalid email address'),
  customerPhone: z.string().max(20).optional().or(z.literal('')),
  shippingAddress: z.string().min(5, 'Address is required').max(500),
  shippingCity: z.string().min(2, 'City is required').max(100),
  shippingState: z.string().max(50).optional().or(z.literal('')),
  shippingZip: z.string().min(3, 'ZIP code is required').max(20),
  shippingCountry: z.string().default('US'),
  notes: z.string().max(1000).optional().or(z.literal('')),
})

export type CheckoutInput = z.infer<typeof checkoutSchema>

// ============================================================================
// SITE CONTENT
// ============================================================================

export const siteContentSchema = z.object({
  heroTitle: z.string().max(200).optional(),
  heroSubtitle: z.string().max(500).optional(),
  heroBanner: z.string().url().optional().or(z.literal('')),
  footerText: z.string().max(500).optional(),
  contactEmail: z.string().email().optional().or(z.literal('')),
  contactPhone: z.string().max(20).optional().or(z.literal('')),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format').optional(),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format').optional(),
})

export type SiteContentInput = z.infer<typeof siteContentSchema>

// ============================================================================
// THEME CUSTOMIZATION
// ============================================================================

export const themeCustomizationSchema = z.object({
  theme: z.enum(['modern', 'classic', 'bold', 'elegant']),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  fontFamily: z.enum(['inter', 'roboto', 'playfair', 'montserrat']).optional(),
})

export type ThemeCustomization = z.infer<typeof themeCustomizationSchema>

// ============================================================================
// MEMBERSHIP
// ============================================================================

export const inviteMemberSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.enum(['OWNER', 'STAFF']),
})

export type InviteMemberInput = z.infer<typeof inviteMemberSchema>

// ============================================================================
// CHATBOT
// ============================================================================

export const chatQuerySchema = z.object({
  question: z.string().min(1, 'Question cannot be empty').max(500),
  storeId: z.string(),
})

export type ChatQuery = z.infer<typeof chatQuerySchema>

// ============================================================================
// BLOOMPILOT RECOMMENDATION
// ============================================================================

export const recommendationResponseSchema = z.object({
  action: z.enum(['approve', 'reject', 'customize']),
  customization: z.record(z.string(), z.any()).optional(),
})

export type RecommendationResponse = z.infer<typeof recommendationResponseSchema>

// ============================================================================
// GENERAL HELPERS
// ============================================================================

/**
 * Parse and validate form data
 */
export function validateFormData<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: Record<string, string[]> } {
  const result = schema.safeParse(data)
  
  if (result.success) {
    return { success: true, data: result.data }
  }
  
  const errors: Record<string, string[]> = {}
  result.error.issues.forEach((issue) => {
    const path = issue.path.join('.')
    if (!errors[path]) {
      errors[path] = []
    }
    errors[path].push(issue.message)
  })
  
  return { success: false, errors }
}
