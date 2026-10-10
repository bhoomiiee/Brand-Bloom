import { NextResponse } from 'next/server'
import { getCurrentStore } from '@/lib/auth'
import { prisma } from '@/lib/db'

interface RouteParams {
  params: Promise<{ productId: string }>
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const store = await getCurrentStore()
    const { productId } = await params

    if (!store) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const data = await request.json()

    // Verify product belongs to store
    const existingProduct = await prisma.product.findFirst({
      where: {
        id: productId,
        storeId: store.id,
      },
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // If slug is being changed, check uniqueness
    if (data.slug && data.slug !== existingProduct.slug) {
      const slugExists = await prisma.product.findFirst({
        where: {
          storeId: store.id,
          slug: data.slug,
          id: { not: productId },
        },
      })

      if (slugExists) {
        return NextResponse.json(
          { error: 'A product with this slug already exists' },
          { status: 400 }
        )
      }
    }

    // Update product
    const product = await prisma.product.update({
      where: { id: productId },
      data: {
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

    // Update or create primary image if provided
    if (data.imageUrl) {
      const existingImage = await prisma.productImage.findFirst({
        where: {
          productId: product.id,
        },
        orderBy: { sortOrder: 'asc' },
      })

      if (existingImage) {
        await prisma.productImage.update({
          where: { id: existingImage.id },
          data: {
            url: data.imageUrl,
            altText: data.name,
          },
        })
      } else {
        await prisma.productImage.create({
          data: {
            productId: product.id,
            url: data.imageUrl,
            altText: data.name,
            sortOrder: 0,
          },
        })
      }
    }

    return NextResponse.json({
      success: true,
      product,
    })
  } catch (error) {
    console.error('Failed to update product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const store = await getCurrentStore()
    const { productId } = await params

    if (!store) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify product belongs to store
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        storeId: store.id,
      },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Delete product (cascade will handle images)
    await prisma.product.delete({
      where: { id: productId },
    })

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error('Failed to delete product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
