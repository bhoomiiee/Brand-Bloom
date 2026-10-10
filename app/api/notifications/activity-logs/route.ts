import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || 'all'

    const [orders, customers, stores] = await Promise.all([
      prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { store: { select: { name: true } } },
      }),
      prisma.customer.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { store: { select: { name: true } } },
      }),
      prisma.store.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ])

    const logs: any[] = []

    orders.forEach(o => {
      logs.push({
        id: `act-ord-${o.id}`,
        actor: o.customerName || 'Customer',
        action: 'Completed Checkout Order',
        target: `${o.store.name} (#${o.orderNumber} - $${Number(o.total).toFixed(2)})`,
        timestamp: o.createdAt.toISOString(),
        status: 'success',
        details: `Purchased items with shipping to ${o.shippingCity}`,
      })
    })

    customers.forEach(c => {
      logs.push({
        id: `act-cust-${c.id}`,
        actor: c.name || c.email,
        action: 'Registered Customer Account',
        target: c.store.name,
        timestamp: c.createdAt.toISOString(),
        status: 'info',
        details: `Created verified customer account via storefront modal`,
      })
    })

    stores.forEach(s => {
      logs.push({
        id: `act-str-${s.id}`,
        actor: 'Platform Admin',
        action: 'Provisioned Merchant Storefront',
        target: s.name,
        timestamp: s.createdAt.toISOString(),
        status: 'info',
        details: `Store created with slug /store/${s.slug}`,
      })
    })

    // Sort by timestamp desc
    logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    let filtered = logs
    if (search) {
      const q = search.toLowerCase()
      filtered = filtered.filter(l =>
        l.actor.toLowerCase().includes(q) ||
        l.action.toLowerCase().includes(q) ||
        l.target.toLowerCase().includes(q)
      )
    }
    if (status && status !== 'all') {
      filtered = filtered.filter(l => l.status === status)
    }

    return NextResponse.json({
      success: true,
      data: filtered,
      count: filtered.length,
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
