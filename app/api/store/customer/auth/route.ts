import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { storeId, email, name, phone, action = 'login' } = body

    if (!storeId || !email) {
      return NextResponse.json(
        { error: 'Store ID and valid email are required' },
        { status: 400 }
      )
    }

    const normalizedEmail = String(email).toLowerCase().trim()
    if (!normalizedEmail.includes('@') || !normalizedEmail.includes('.')) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      )
    }

    // Verify store exists
    const store = await prisma.store.findUnique({
      where: { id: storeId },
      select: { id: true, name: true, slug: true },
    })

    if (!store) {
      return NextResponse.json(
        { error: 'Store not found' },
        { status: 404 }
      )
    }

    // Check if customer already exists for this store
    let customer = await prisma.customer.findUnique({
      where: {
        storeId_email: {
          storeId,
          email: normalizedEmail,
        },
      },
      include: {
        orders: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: {
          select: { orders: true },
        },
      },
    })

    let isNewCustomer = false

    if (!customer) {
      // Register new customer in database for this store
      customer = await prisma.customer.create({
        data: {
          storeId,
          email: normalizedEmail,
          name: name ? String(name).trim() : null,
          phone: phone ? String(phone).trim() : null,
        },
        include: {
          orders: true,
          _count: {
            select: { orders: true },
          },
        },
      })
      isNewCustomer = true
    } else if (name || phone) {
      // Update existing customer profile
      customer = await prisma.customer.update({
        where: { id: customer.id },
        data: {
          ...(name ? { name: String(name).trim() } : {}),
          ...(phone ? { phone: String(phone).trim() } : {}),
        },
        include: {
          orders: {
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
          _count: {
            select: { orders: true },
          },
        },
      })
    }

    return NextResponse.json({
      success: true,
      isNewCustomer,
      customer: {
        id: customer.id,
        email: customer.email,
        name: customer.name,
        phone: customer.phone,
        createdAt: customer.createdAt,
        orderCount: customer._count?.orders ?? 0,
        orders: customer.orders ?? [],
      },
    })
  } catch (error) {
    console.error('Store customer auth error:', error)
    return NextResponse.json(
      { error: 'Failed to process customer login / registration' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const storeId = searchParams.get('storeId')
    const email = searchParams.get('email')

    if (!storeId || !email) {
      return NextResponse.json(
        { error: 'storeId and email are required' },
        { status: 400 }
      )
    }

    const customer = await prisma.customer.findUnique({
      where: {
        storeId_email: {
          storeId,
          email: String(email).toLowerCase().trim(),
        },
      },
      include: {
        orders: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: {
          select: { orders: true },
        },
      },
    })

    if (!customer) {
      return NextResponse.json(
        { customer: null },
        { status: 404 }
      )
    }

    return NextResponse.json({
      customer: {
        id: customer.id,
        email: customer.email,
        name: customer.name,
        phone: customer.phone,
        createdAt: customer.createdAt,
        orderCount: customer._count?.orders ?? 0,
        orders: customer.orders ?? [],
      },
    })
  } catch (error) {
    console.error('Store customer fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve customer data' },
      { status: 500 }
    )
  }
}
