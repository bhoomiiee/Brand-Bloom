import { NextRequest, NextResponse } from 'next/server'
import { getCurrentStore, getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const [store, user] = await Promise.all([
      getCurrentStore(),
      getCurrentUser(),
    ])

    if (!store || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { recommendationId } = body

    if (!recommendationId) {
      return NextResponse.json(
        { error: 'Recommendation ID is required' },
        { status: 400 }
      )
    }

    // Find the recommendation
    const recommendation = await prisma.recommendation.findUnique({
      where: { id: recommendationId },
    })

    if (!recommendation) {
      return NextResponse.json(
        { error: 'Recommendation not found' },
        { status: 404 }
      )
    }

    // Verify it belongs to the current store
    if (recommendation.storeId !== store.id) {
      return NextResponse.json(
        { error: 'Recommendation does not belong to your store' },
        { status: 403 }
      )
    }

    // Update recommendation status
    const updated = await prisma.recommendation.update({
      where: { id: recommendationId },
      data: {
        status: 'APPROVED',
        approvedAt: new Date(),
      },
    })

    return NextResponse.json({
      message: 'Recommendation approved successfully',
      recommendation: updated,
    })
  } catch (error) {
    console.error('Approve recommendation error:', error)
    return NextResponse.json(
      { error: 'Failed to approve recommendation' },
      { status: 500 }
    )
  }
}
