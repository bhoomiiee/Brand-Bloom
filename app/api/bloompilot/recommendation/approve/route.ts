import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { recommendationId, storeId } = body

    if (!recommendationId) {
      return NextResponse.json(
        { error: 'Recommendation ID is required' },
        { status: 400 }
      )
    }

    // Find the recommendation
    let recommendation = await prisma.recommendation.findUnique({
      where: { id: recommendationId },
      include: { store: true },
    })

    if (!recommendation) {
      // If mock ID from admin panel, find the latest pending recommendation for this store
      if (storeId) {
        recommendation = await prisma.recommendation.findFirst({
          where: { storeId, status: 'PENDING' },
          include: { store: true },
        })
      }
    }

    if (!recommendation) {
      return NextResponse.json(
        { error: 'Recommendation not found' },
        { status: 404 }
      )
    }

    const targetStoreId = recommendation.storeId

    // 1. Mark recommendation as APPROVED and IMPLEMENTED in the database
    const updated = await prisma.recommendation.update({
      where: { id: recommendation.id },
      data: {
        status: 'APPROVED',
        approvedAt: new Date(),
        implementedAt: new Date(),
      },
    })

    // 2. APPLY CHANGES DIRECTLY TO LIVE WEBSITE
    // Apply 15% discount across store products & set comparePrice
    const products = await prisma.product.findMany({
      where: { storeId: targetStoreId, isActive: true },
    })

    const updatedProductNames: string[] = []

    for (const prod of products) {
      const currentPrice = Number(prod.price)
      const originalCompare = prod.comparePrice ? Number(prod.comparePrice) : currentPrice
      const discountedPrice = Math.max(1, Math.round(originalCompare * 0.85 * 100) / 100)

      await prisma.product.update({
        where: { id: prod.id },
        data: {
          price: discountedPrice,
          comparePrice: originalCompare,
        },
      })
      updatedProductNames.push(prod.name)
    }

    // 3. Upsert storefront promotional banner in site_content
    await prisma.siteContent.upsert({
      where: {
        storeId_key: {
          storeId: targetStoreId,
          key: 'announcement_banner',
        },
      },
      update: {
        value: '🌸 15% OFF Flash Sale Active — Special Seasonal Discounts Applied by BloomPilot AI!',
        updatedAt: new Date(),
      },
      create: {
        storeId: targetStoreId,
        key: 'announcement_banner',
        value: '🌸 15% OFF Flash Sale Active — Special Seasonal Discounts Applied by BloomPilot AI!',
        type: 'text',
      },
    })

    return NextResponse.json({
      success: true,
      message: `Recommendation approved! 15% discount applied across ${products.length} products and promotional banner activated on live store.`,
      recommendation: updated,
      appliedChanges: {
        discountPercentage: 15,
        updatedProductsCount: products.length,
        updatedProducts: updatedProductNames.slice(0, 5),
        bannerActivated: true,
      },
    })
  } catch (error: any) {
    console.error('Approve and apply recommendation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to approve recommendation' },
      { status: 500 }
    )
  }
}
