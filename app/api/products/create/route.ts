import { NextResponse } from 'next/server'
import { getCurrentStore } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { slugify } from '@/lib/utils'

export async function POST(request: Request) {
  try {
    const store = await getCurrentStore()

    if (!store) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const data = await request.json()

    // Validate required fields
    if (!data.name || !data.slug || data.price === undefined || data.stock === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if slug is unique for this store
    const existingProduct = await prisma.product.findFirst({
      where: {
        storeId: store.id,
        slug: data.slug,
      },
    })

    if (existingProduct) {
      return NextResponse.json(
        { error: 'A product with this slug already exists' },
        { status: 400 }
      )
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        storeId: store.id,
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        price: data.price,
        comparePrice: data.compareAtPrice !== undefined ? data.compareAtPrice : (data.comparePrice || null),
        cost: data.cost || null,
        sku: data.sku || null,
        stock: data.stock,
        categoryId: data.categoryId || null,
        isActive: data.status ? data.status === 'ACTIVE' : (data.isActive ?? true),
      },
    })

    // Create product image if provided
    if (data.imageUrl) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: data.imageUrl,
          altText: data.name,
          sortOrder: 0,
        },
      })
    }

    return NextResponse.json({
      success: true,
      product,
    })
  } catch (error) {
    console.error('Failed to create product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
