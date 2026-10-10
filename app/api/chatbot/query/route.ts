import { NextRequest, NextResponse } from 'next/server'
import { getCurrentStore, getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { analyzeChatQuery } from '@/lib/chatbot-tools'

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

    // Analyze the query and execute appropriate tools
    const result = await analyzeChatQuery(message, store.id)

    // Save the chat log
    try {
      await prisma.chatLog.create({
        data: {
          storeId: store.id,
          userId: user.id,
          question: message,
          answer: result.response,
          context: result.data ? JSON.stringify(result.data) : null,
        },
      })
    } catch (logError) {
      console.error('Failed to save chat log:', logError)
    }

    return NextResponse.json({
      response: result.response,
      data: result.data,
    })
  } catch (error) {
    console.error('Chatbot query error:', error)
    return NextResponse.json(
      { error: 'Failed to process query' },
      { status: 500 }
    )
  }
}
