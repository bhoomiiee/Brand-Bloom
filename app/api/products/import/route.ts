import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth'
import { db } from '@/lib/db'
import { slugify, generateUniqueSlug } from '@/lib/utils'
import type { ParsedProduct } from '@/lib/import-products'

export async function POST(request: NextRequest) {
  try {
    const { userId, storeId } = await requireRole('STAFF') // Both owner and staff can import

    const body = await request.json()
    const { products } = body as { products: ParsedProduct[] }

    if (!products || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { error: 'No products provided' },
        { status: 400 }
      )
    }

    // Get all categories for this store
    const categories = await db.category.findMany({
      where: { storeId },
      select: { id: true, name: true, slug: true },
    })

    // Create category lookup map
    const categoryMap: Record<string, string> = {}
    categories.forEach(cat => {
      categoryMap[cat.name.toLowerCase()] = cat.id
      categoryMap[cat.slug.toLowerCase()] = cat.id
    })

    // Get existing product slugs for this store
    const existingProducts = await db.product.findMany({
      where: { storeId },
      select: { slug: true },
    })
    const existingSlugs = existingProducts.map(p => p.slug)

    const importResults = {
      imported: 0,
      skipped: 0,
      errors: [] as Array<{ product: string; reason: string }>,
    }

    // Import products
    for (const product of products) {
      try {
        // Find category
        const categoryKey = product.category.toLowerCase()
        const categoryId = categoryMap[categoryKey]

        if (!categoryId) {
          importResults.errors.push({
            product: product.name,
            reason: `Category '${product.category}' not found`,
          })
          importResults.skipped++
          continue
        }

        // Generate unique slug
        const baseSlug = slugify(product.name)
        const productSlug = generateUniqueSlug(product.name, existingSlugs)
        existingSlugs.push(productSlug)

        // Create product
        const createdProduct = await db.product.create({
          data: {
            storeId,
            categoryId,
            name: product.name,
            slug: productSlug,
            description: product.description || null,
            price: product.price,
            comparePrice: product.comparePrice || null,
            stock: product.stock || 0,
            sku: product.sku || null,
            barcode: product.barcode || null,
            isActive: true,
            isFeatured: false,
          },
        })

        // Add image if provided
        if (product.imageUrl) {
          await db.productImage.create({
            data: {
              productId: createdProduct.id,
              url: product.imageUrl,
              altText: product.name,
              sortOrder: 0,
            },
          })
        }

        importResults.imported++
      } catch (error: any) {
        console.error(`Error importing product ${product.name}:`, error)
        importResults.errors.push({
          product: product.name,
          reason: error.message || 'Unknown error',
        })
        importResults.skipped++
      }
    }

    // Create import job record
    await db.importJob.create({
      data: {
        storeId,
        fileName: 'API Import',
        fileSize: 0,
        totalRows: products.length,
        successRows: importResults.imported,
        failedRows: importResults.skipped,
        status: 'COMPLETED',
        errorReport: importResults.errors.length > 0
          ? JSON.stringify(importResults.errors)
          : null,
        completedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      imported: importResults.imported,
      skipped: importResults.skipped,
      errors: importResults.errors,
    })
  } catch (error: any) {
    console.error('Import API error:', error)
    
    if (error.message === 'Unauthorized' || error.message === 'No active store') {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }

    return NextResponse.json(
      { error: 'Import failed' },
      { status: 500 }
    )
  }
}
