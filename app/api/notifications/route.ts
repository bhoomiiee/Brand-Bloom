import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { store: { select: { name: true } } },
    })

    const notifications = [
      ...orders.map((o, idx) => ({
        id: `notif-order-${o.id}`,
        type: 'order',
        title: `New Order #${o.orderNumber}`,
        message: `${o.customerName} placed an order for $${Number(o.total).toFixed(2)} on ${o.store.name}.`,
        timestamp: o.createdAt.toISOString(),
        read: idx > 0,
        link: `/stores/${o.storeId}`,
        priority: 'high',
      })),
      {
        id: 'notif-bloom-01',
        type: 'recommendation',
        title: 'BloomPilot Diagnostic Complete',
        message: 'AI analyzed Demo Fashion Store and generated 2 high-impact revenue strategies.',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        read: false,
        link: '/recommendations',
        priority: 'normal',
      },
      {
        id: 'notif-system-01',
        type: 'system',
        title: 'Option 4 Design Live',
        message: 'Botanical burgundy design system active across all merchant storefronts.',
        timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
        read: true,
        link: '/settings',
        priority: 'normal',
      },
    ]

    return NextResponse.json({
      success: true,
      data: notifications,
      count: notifications.length,
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
