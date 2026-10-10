import { NextRequest, NextResponse } from 'next/server'
import { getCurrentStore, getCurrentUser } from '@/lib/auth'
import { analyzeStoreAndRecommend } from '@/lib/bloompilot-engine'

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
    const { message, storeId } = body

    if (!message || !storeId) {
      return NextResponse.json(
        { error: 'Message and storeId are required' },
        { status: 400 }
      )
    }

    // Verify user has access to this store
    if (store.id !== storeId) {
      return NextResponse.json(
        { error: 'You do not have access to this store' },
        { status: 403 }
      )
    }

    // Analyze store data and generate recommendations
    const result = await analyzeStoreAndRecommend(message, store.id, user.id)

    return NextResponse.json({
      response: result.response,
      reply: result.response,
      recommendation: result.recommendation,
    })
  } catch (error) {
    console.error('BloomPilot chat error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze store data' },
      { status: 500 }
    )
  }
}
