import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { CartItem } from '@/lib/cart'

interface CreateOrderRequest {
  storeId: string
  items: CartItem[]
  customer: {
    email: string
    firstName?: string
    lastName?: string
    name?: string
    phone?: string
  }
  shippingAddress: {
    address: string
    city: string
    state?: string
    zipCode: string
    country?: string
  }
  totals: {
    subtotal: number
    shipping: number
    tax: number
    total: number
  }
}

export async function POST(request: Request) {
  try {
    const data: CreateOrderRequest = await request.json()

    const customerFullName =
      [data.customer.firstName, data.customer.lastName].filter(Boolean).join(' ') ||
      data.customer.name ||
      'Customer'

    // Find or create customer
    let customer = await prisma.customer.findFirst({
      where: {
        storeId: data.storeId,
        email: data.customer.email,
      },
    })

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          storeId: data.storeId,
          email: data.customer.email,
          name: customerFullName,
          phone: data.customer.phone || null,
        },
      })
    }

    const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`

    // Create order
    const order = await prisma.order.create({
      data: {
        storeId: data.storeId,
        customerId: customer.id,
        orderNumber,
        status: 'PLACED',
        customerName: customerFullName,
        customerEmail: data.customer.email,
        customerPhone: data.customer.phone || null,
        shippingAddress: data.shippingAddress.address || 'Address',
        shippingCity: data.shippingAddress.city || 'City',
        shippingState: data.shippingAddress.state || null,
        shippingZip: data.shippingAddress.zipCode || '00000',
        shippingCountry: data.shippingAddress.country || 'US',
        subtotal: data.totals.subtotal,
        tax: data.totals.tax,
        shipping: data.totals.shipping,
        total: data.totals.total,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            productName: item.name,
            productSku: item.sku || null,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.price * item.quantity,
          })),
        },
        events: {
          create: {
            storeId: data.storeId,
            newStatus: 'PLACED',
            notes: 'Order placed',
          },
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        customer: true,
      },
    })

    // Update product stock
    for (const item of data.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      }).catch((e) => console.warn('Could not decrement stock for product', item.productId, e))
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        total: order.total,
      },
    })
  } catch (error) {
    console.error('Failed to create order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
