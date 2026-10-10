import { Metadata } from 'next'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { getCurrentStore } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { ArrowLeft, User, MapPin, Mail, Phone, Package } from 'lucide-react'
import { OrderStatusUpdater } from '@/components/orders/order-status-updater'
import { OrderTimeline } from '@/components/orders/order-timeline'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Order Details | BrandBloom',
  description: 'View and manage order details',
}

async function getOrder(orderId: string, storeId: string) {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      storeId,
    },
    include: {
      customer: true,
      items: {
        include: {
          product: {
            include: {
              images: {
                orderBy: { sortOrder: 'asc' },
                take: 1,
              },
            },
          },
        },
      },
      events: {
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  return order
}

interface OrderDetailPageProps {
  params: Promise<{ orderId: string }>
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { orderId } = await params
  const store = await getCurrentStore()

  if (!store) {
    redirect('/onboarding')
  }

  const order = await getOrder(orderId, store.id)

  if (!order) {
    notFound()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/orders">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Order #{order.orderNumber}</h1>
            <p className="text-gray-600 mt-1">
              Placed on {new Date(order.createdAt).toLocaleDateString()} at{' '}
              {new Date(order.createdAt).toLocaleTimeString()}
            </p>
          </div>
        </div>
        <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0">
                  <div className="relative w-20 h-20 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                    {item.product.images[0] ? (
                      <Image
                        src={item.product.images[0].url}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Package className="h-8 w-8" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.product.name}</h3>
                    {item.product.sku && (
                      <p className="text-sm text-gray-500">SKU: {item.product.sku}</p>
                    )}
                    <p className="text-sm text-gray-600 mt-1">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(item.subtotal)}</p>
                    <p className="text-sm text-gray-500">
                      {formatCurrency(item.price)} each
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Totals */}
            <div className="mt-6 pt-4 border-t space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>{formatCurrency(order.shipping)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span>{formatCurrency(order.tax)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          </Card>

          {/* Order Timeline */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Order Timeline</h2>
            <OrderTimeline events={order.events} />
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Information */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-purple-600" />
              <h2 className="text-lg font-semibold">Customer</h2>
            </div>
            <div className="space-y-3">
              <div>
                <p className="font-semibold">
                  {order.customerName || order.customer?.name || 'Customer'}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                <a href={`mailto:${order.customerEmail || order.customer?.email}`} className="hover:text-purple-600">
                  {order.customerEmail || order.customer?.email}
                </a>
              </div>
              {(order.customerPhone || order.customer?.phone) && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  <a href={`tel:${order.customerPhone || order.customer?.phone}`} className="hover:text-purple-600">
                    {order.customerPhone || order.customer?.phone}
                  </a>
                </div>
              )}
            </div>
          </Card>

          {/* Shipping Address */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-purple-600" />
              <h2 className="text-lg font-semibold">Shipping Address</h2>
            </div>
            <p className="text-sm text-gray-700 whitespace-pre-line">
              {order.shippingAddress}
            </p>
          </Card>

          {/* Order Status */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Order Status</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-1">Current Status</p>
                <span
                  className={`inline-block px-3 py-1 rounded text-sm font-semibold ${
                    order.status === 'DELIVERED'
                      ? 'bg-green-100 text-green-700'
                      : order.status === 'PAID'
                      ? 'bg-blue-100 text-blue-700'
                      : order.status === 'PACKED' || order.status === 'SHIPPED'
                      ? 'bg-purple-100 text-purple-700'
                      : order.status === 'PLACED'
                      ? 'bg-yellow-100 text-yellow-700'
                      : order.status === 'CANCELLED'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {order.status}
                </span>
              </div>
              {(order as any).trackingNumber && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Tracking Number</p>
                  <p className="font-mono text-sm">{(order as any).trackingNumber}</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
