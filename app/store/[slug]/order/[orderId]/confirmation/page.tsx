import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/db'
import { getTheme } from '@/lib/themes'
import { StorefrontLayout } from '@/components/storefront/storefront-layout'
import { formatCurrency } from '@/lib/utils'
import { CheckCircle } from 'lucide-react'
import { getButtonClasses } from '@/lib/themes'

interface OrderConfirmationProps {
  params: Promise<{ slug: string; orderId: string }>
}

async function getStoreBySlug(slug: string) {
  const store = await prisma.store.findFirst({
    where: { slug, status: 'ACTIVE' },
    include: {
      categories: {
        orderBy: { sortOrder: 'asc' },
      },
    },
  })

  return store
}

async function getOrder(orderId: string, storeId: string) {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      storeId,
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

  return order
}

export async function generateMetadata({ params }: OrderConfirmationProps): Promise<Metadata> {
  const { slug } = await params
  const store = await getStoreBySlug(slug)

  if (!store) {
    return {
      title: 'Order Confirmation',
    }
  }

  return {
    title: `Order Confirmation - ${store.name}`,
    description: `Your order has been confirmed`,
  }
}

export default async function OrderConfirmation({ params }: OrderConfirmationProps) {
  const { slug, orderId } = await params
  const store = await getStoreBySlug(slug)

  if (!store) {
    notFound()
  }

  const order = await getOrder(orderId, store.id)

  if (!order) {
    notFound()
  }

  const theme = getTheme(store.theme || 'modern')

  return (
    <StorefrontLayout store={store} theme={theme}>
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Success Message */}
        <div className="text-center mb-12">
          <CheckCircle
            className="h-24 w-24 mx-auto mb-6"
            style={{ color: theme.colors.accent }}
          />
          <h1
            className="text-4xl font-bold mb-4 theme-font-heading"
            style={{ color: theme.colors.foreground }}
          >
            Order Confirmed!
          </h1>
          <p className="text-lg mb-2" style={{ color: theme.colors.foreground, opacity: 0.7 }}>
            Thank you for your order, {order.customerName || order.customer?.name || 'Customer'}!
          </p>
          <p className="text-sm" style={{ color: theme.colors.foreground, opacity: 0.6 }}>
            Order #{order.orderNumber}
          </p>
        </div>

        {/* Order Details */}
        <div
          className="border rounded-lg p-8 mb-8"
          style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.background }}
        >
          <h2
            className="text-2xl font-bold mb-6 theme-font-heading"
            style={{ color: theme.colors.foreground }}
          >
            Order Details
          </h2>

          {/* Order Items */}
          <div className="space-y-4 mb-6">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <div>
                  <p className="font-medium" style={{ color: theme.colors.foreground }}>
                    {item.product.name}
                  </p>
                  <p className="text-sm" style={{ color: theme.colors.foreground, opacity: 0.6 }}>
                    Quantity: {item.quantity}
                  </p>
                </div>
                <p className="font-medium" style={{ color: theme.colors.foreground }}>
                  {formatCurrency(item.subtotal)}
                </p>
              </div>
            ))}
          </div>

          {/* Order Totals */}
          <div
            className="space-y-2 pt-6 border-t"
            style={{ borderColor: theme.colors.border }}
          >
            <div className="flex justify-between">
              <span style={{ color: theme.colors.foreground, opacity: 0.7 }}>
                Subtotal
              </span>
              <span style={{ color: theme.colors.foreground }}>
                {formatCurrency(order.subtotal)}
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: theme.colors.foreground, opacity: 0.7 }}>
                Shipping
              </span>
              <span style={{ color: theme.colors.foreground }}>
                {formatCurrency(order.shipping)}
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: theme.colors.foreground, opacity: 0.7 }}>
                Tax
              </span>
              <span style={{ color: theme.colors.foreground }}>
                {formatCurrency(order.tax)}
              </span>
            </div>
            <div
              className="flex justify-between text-lg font-bold pt-2 border-t"
              style={{ borderColor: theme.colors.border }}
            >
              <span style={{ color: theme.colors.foreground }}>Total</span>
              <span style={{ color: theme.colors.foreground }}>
                {formatCurrency(order.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Shipping Information */}
        <div
          className="border rounded-lg p-6 mb-8"
          style={{ borderColor: theme.colors.border }}
        >
          <h3 className="font-bold mb-3" style={{ color: theme.colors.foreground }}>
            Shipping Address
          </h3>
          <p style={{ color: theme.colors.foreground, opacity: 0.8 }}>
            {order.shippingAddress}
          </p>
        </div>

        {/* Customer Information */}
        <div
          className="border rounded-lg p-6 mb-8"
          style={{ borderColor: theme.colors.border }}
        >
          <h3 className="font-bold mb-3" style={{ color: theme.colors.foreground }}>
            Contact Information
          </h3>
          <p style={{ color: theme.colors.foreground, opacity: 0.8 }}>
            {order.customerEmail || order.customer?.email}
          </p>
          {(order.customerPhone || order.customer?.phone) && (
            <p style={{ color: theme.colors.foreground, opacity: 0.8 }}>
              {order.customerPhone || order.customer?.phone}
            </p>
          )}
        </div>

        {/* Confirmation Message */}
        <div
          className="p-6 rounded-lg text-center mb-8"
          style={{ backgroundColor: theme.colors.muted }}
        >
          <p style={{ color: theme.colors.foreground }}>
            A confirmation email has been sent to <strong>{order.customerEmail || order.customer?.email}</strong>
          </p>
        </div>

        {/* Actions */}
        <div className="text-center">
          <Link href={`/store/${store.slug}`}>
            <button
              className={`${getButtonClasses(theme)} text-white`}
              style={{ backgroundColor: theme.colors.primary }}
            >
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    </StorefrontLayout>
  )
}
