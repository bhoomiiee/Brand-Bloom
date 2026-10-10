import { NextResponse } from 'next/server'
import { getCurrentStore } from '@/lib/auth'
import { prisma } from '@/lib/db'

interface RouteParams {
  params: Promise<{ orderId: string }>
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const store = await getCurrentStore()
    const { orderId } = await params

    if (!store) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { status } = await request.json()

    // Verify order belongs to store
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        storeId: store.id,
      },
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    })

    // Create order event
    await prisma.orderEvent.create({
      data: {
        orderId: order.id,
        storeId: store.id,
        oldStatus: order.status,
        newStatus: status,
        notes: `Order status changed to ${status}`,
      },
    })

    return NextResponse.json({
      success: true,
      order: updatedOrder,
    })
  } catch (error) {
    console.error('Failed to update order status:', error)
    return NextResponse.json(
      { error: 'Failed to update order status' },
      { status: 500 }
    )
  }
}
