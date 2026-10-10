import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentStore } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Card } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { ShoppingCart, Clock, Package, CheckCircle, XCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Orders | BrandBloom',
  description: 'Manage your store orders',
}

async function getOrders(storeId: string) {
  const orders = await prisma.order.findMany({
    where: { storeId },
    include: {
      customer: true,
      items: {
        include: {
          product: true,
        },
      },
      _count: {
        select: { items: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return orders
}

async function getOrderStats(storeId: string) {
  const [totalOrders, placedOrders, paidOrders, deliveredOrders] = await Promise.all([
    prisma.order.count({ where: { storeId } }),
    prisma.order.count({ where: { storeId, status: 'PLACED' } }),
    prisma.order.count({ where: { storeId, status: 'PAID' } }),
    prisma.order.count({ where: { storeId, status: 'DELIVERED' } }),
  ])

  return { totalOrders, placedOrders, paidOrders, deliveredOrders }
}

import { BotanicalCardAccent } from '@/components/ui/botanical-decorations'

export default async function OrdersPage() {
  const store = await getCurrentStore()

  if (!store) {
    redirect('/onboarding')
  }

  const [orders, stats] = await Promise.all([
    getOrders(store.id),
    getOrderStats(store.id),
  ])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-[#3D202B]">Orders</h1>
        <p className="text-sm font-medium text-[#806B73] mt-1">
          Track, fulfill, and review botanical shopper orders
        </p>
      </div>

      {/* Stats with Botanical Card Accents */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-2xl bg-white border border-[#E8DDE0] shadow-2xs relative overflow-hidden">
          <BotanicalCardAccent className="opacity-35" />
          <div className="flex items-center gap-3 mb-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-[#F1D9DF] flex items-center justify-center text-[#632D40]">
              <ShoppingCart className="h-5 w-5" />
            </div>
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#806B73] mb-1 relative z-10">Total Orders</p>
          <p className="text-3xl font-extrabold text-[#3D202B] relative z-10">{stats.totalOrders}</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#E8DDE0] shadow-2xs relative overflow-hidden">
          <BotanicalCardAccent className="opacity-35" />
          <div className="flex items-center gap-3 mb-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-[#F1D9DF] flex items-center justify-center text-[#BD7C91]">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#806B73] mb-1 relative z-10">Placed</p>
          <p className="text-3xl font-extrabold text-[#3D202B] relative z-10">{stats.placedOrders}</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#E8DDE0] shadow-2xs relative overflow-hidden">
          <BotanicalCardAccent className="opacity-35" />
          <div className="flex items-center gap-3 mb-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-[#F1D9DF] flex items-center justify-center text-[#632D40]">
              <Package className="h-5 w-5" />
            </div>
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#806B73] mb-1 relative z-10">Paid</p>
          <p className="text-3xl font-extrabold text-[#3D202B] relative z-10">{stats.paidOrders}</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#E8DDE0] shadow-2xs relative overflow-hidden">
          <BotanicalCardAccent className="opacity-35" />
          <div className="flex items-center gap-3 mb-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-700">
              <CheckCircle className="h-5 w-5" />
            </div>
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#806B73] mb-1 relative z-10">Delivered</p>
          <p className="text-3xl font-extrabold text-green-700 relative z-10">{stats.deliveredOrders}</p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="p-6 rounded-2xl bg-white border border-[#E8DDE0] shadow-2xs">
        <h2 className="text-lg font-bold text-[#3D202B] mb-5">All Orders</h2>

        {orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Order</th>
                  <th className="text-left py-3 px-4 font-semibold">Customer</th>
                  <th className="text-left py-3 px-4 font-semibold">Items</th>
                  <th className="text-left py-3 px-4 font-semibold">Total</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Date</th>
                  <th className="text-right py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-semibold">#{order.orderNumber}</p>
                        <p className="text-sm text-gray-500">{order.id.slice(0, 8)}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium">
                          {order.customerName || order.customer?.name || 'Customer'}
                        </p>
                        <p className="text-sm text-gray-500">{order.customerEmail || order.customer?.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                        {order._count.items} {order._count.items === 1 ? 'item' : 'items'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-semibold">{formatCurrency(order.total)}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-1 rounded text-sm font-semibold ${
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
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end">
                        <Link href={`/dashboard/orders/${order.id}`}>
                          <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
                            View Details →
                          </button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 text-gray-500">
            <ShoppingCart className="h-16 w-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-semibold mb-2">No orders yet</p>
            <p className="text-sm">
              Orders will appear here once customers make purchases
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
