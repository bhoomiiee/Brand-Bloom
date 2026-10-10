import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const storeId = searchParams.get('storeId')

    if (!storeId) {
      return NextResponse.json({ success: false, message: 'Store ID is required' }, { status: 400 })
    }

    const recommendations = await prisma.recommendation.findMany({
      where: { storeId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })

    return NextResponse.json({
      success: true,
      recommendations,
    })
  } catch (error: any) {
    console.error('Failed to get recommendations for store:', error)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
