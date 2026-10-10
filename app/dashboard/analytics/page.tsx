import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getCurrentStore } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Card } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { TrendingUp, ShoppingCart, Users, Package, DollarSign, BarChart3 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Analytics | BrandBloom',
  description: 'View your store analytics and insights',
}

async function getAnalytics(storeId: string) {
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  const [
    totalRevenue,
    totalOrders,
    totalCustomers,
    totalProducts,
    revenueLastMonth,
    ordersLastMonth,
    topProducts,
    recentCustomers,
    ordersByStatus,
  ] = await Promise.all([
    // Total revenue
    prisma.order.aggregate({
      where: { storeId },
      _sum: { total: true },
    }),

    // Total orders
    prisma.order.count({ where: { storeId } }),

    // Total customers
    prisma.customer.count({ where: { storeId } }),

    // Total products
    prisma.product.count({ where: { storeId, isActive: true } }),

    // Revenue last 30 days
    prisma.order.aggregate({
      where: {
        storeId,
        createdAt: { gte: thirtyDaysAgo },
      },
      _sum: { total: true },
    }),

    // Orders last 30 days
    prisma.order.count({
      where: {
        storeId,
        createdAt: { gte: thirtyDaysAgo },
      },
    }),

    // Top selling products
    prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        order: { storeId },
      },
      _sum: {
        quantity: true,
        subtotal: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: 5,
    }),

    // Recent customers
    prisma.customer.findMany({
      where: { storeId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        _count: {
          select: { orders: true },
        },
      },
    }),

    // Orders by status
    prisma.order.groupBy({
      by: ['status'],
      where: { storeId },
      _count: true,
    }),
  ])

  // Get product details for top products
  const productIds = topProducts.map((item) => item.productId)
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: {
      id: true,
      name: true,
      price: true,
      images: {
        orderBy: { sortOrder: 'asc' },
        take: 1,
      },
    },
  })

  const topProductsWithDetails = topProducts.map((item) => {
    const product = products.find((p) => p.id === item.productId)
    return {
      ...item,
      product,
    }
  })

  const revTotal = Number(totalRevenue._sum.total || 0)
  const revMonth = Number(revenueLastMonth._sum.total || 0)
  const avgOrderVal = totalOrders > 0 ? revTotal / totalOrders : 0

  return {
    totalRevenue: revTotal,
    totalOrders,
    totalCustomers,
    totalProducts,
    revenueLastMonth: revMonth,
    ordersLastMonth,
    averageOrderValue: avgOrderVal,
    topProducts: topProductsWithDetails,
    recentCustomers,
    ordersByStatus,
  }
}

import { BotanicalCardAccent, BotanicalCornerFloral } from '@/components/ui/botanical-decorations'

export default async function AnalyticsPage() {
  const store = await getCurrentStore()

  if (!store) {
    redirect('/onboarding')
  }

  const analytics = await getAnalytics(store.id)

  return (
    <div className="space-y-8 relative">
      {/* Restrained botanical decoration in background corner */}
      <BotanicalCornerFloral position="top-right" className="absolute -top-6 -right-6 opacity-30 pointer-events-none" />

      <div>
        <h1 className="text-3xl font-extrabold text-[#3D202B]">Analytics</h1>
        <p className="text-sm font-medium text-[#806B73] mt-1">
          Track store growth, revenue metrics, and customer insights in INR
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-2xl bg-white border border-[#E8DDE0] shadow-2xs relative overflow-hidden">
          <BotanicalCardAccent className="opacity-35" />
          <div className="flex items-center justify-between mb-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-[#F1D9DF] flex items-center justify-center text-[#632D40]">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#806B73] mb-1 relative z-10">Total Revenue</p>
          <p className="text-3xl font-extrabold text-[#3D202B] relative z-10">{formatCurrency(analytics.totalRevenue)}</p>
          <p className="text-xs text-[#806B73] mt-2 font-medium relative z-10">
            Last 30 days: {formatCurrency(analytics.revenueLastMonth)}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#E8DDE0] shadow-2xs relative overflow-hidden">
          <BotanicalCardAccent className="opacity-35" />
          <div className="flex items-center justify-between mb-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-[#F1D9DF] flex items-center justify-center text-[#BD7C91]">
              <ShoppingCart className="h-5 w-5" />
            </div>
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#806B73] mb-1 relative z-10">Total Orders</p>
          <p className="text-3xl font-extrabold text-[#3D202B] relative z-10">{analytics.totalOrders}</p>
          <p className="text-xs text-[#806B73] mt-2 font-medium relative z-10">
            Last 30 days: {analytics.ordersLastMonth}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#E8DDE0] shadow-2xs relative overflow-hidden">
          <BotanicalCardAccent className="opacity-35" />
          <div className="flex items-center justify-between mb-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-[#F1D9DF] flex items-center justify-center text-[#632D40]">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#806B73] mb-1 relative z-10">Average Order Value</p>
          <p className="text-3xl font-extrabold text-[#3D202B] relative z-10">{formatCurrency(analytics.averageOrderValue)}</p>
          <p className="text-xs text-[#806B73] mt-2 font-medium relative z-10">
            Across all customer purchases
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#E8DDE0] shadow-2xs relative overflow-hidden">
          <BotanicalCardAccent className="opacity-35" />
          <div className="flex items-center justify-between mb-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-[#F1D9DF] flex items-center justify-center text-[#BD7C91]">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#806B73] mb-1 relative z-10">Total Customers</p>
          <p className="text-3xl font-extrabold text-[#3D202B] relative z-10">{analytics.totalCustomers}</p>
          <p className="text-xs text-[#806B73] mt-2 font-medium relative z-10">
            {analytics.totalProducts} active products
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="p-6 rounded-2xl bg-white border border-[#E8DDE0] shadow-2xs">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="h-5 w-5 text-[#632D40]" />
            <h2 className="text-lg font-bold text-[#3D202B]">Top Selling Products</h2>
          </div>

          {analytics.topProducts.length > 0 ? (
            <div className="space-y-4">
              {analytics.topProducts.map((item, index) => (
                <div key={item.productId} className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#F8F2F0] transition-colors border border-transparent hover:border-[#E8DDE0]">
                  <div className="w-8 h-8 rounded-xl bg-[#F1D9DF] flex items-center justify-center">
                    <span className="text-xs font-bold text-[#632D40]">#{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm text-[#3D202B]">{item.product?.name || 'Unknown Product'}</p>
                    <p className="text-xs text-[#806B73]">
                      {item._sum?.quantity || 0} sold · {formatCurrency(item._sum?.subtotal || 0)} revenue
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-[#806B73] border border-dashed border-[#E8DDE0] rounded-xl">
              <Package className="h-10 w-10 mx-auto mb-2 text-[#BD7C91] opacity-35" />
              <p className="text-sm font-medium">No sales data yet</p>
            </div>
          )}
        </div>

        {/* Order Status Breakdown */}
        <div className="p-6 rounded-2xl bg-white border border-[#E8DDE0] shadow-2xs">
          <div className="flex items-center gap-3 mb-6">
            <ShoppingCart className="h-5 w-5 text-[#BD7C91]" />
            <h2 className="text-lg font-bold text-[#3D202B]">Orders by Status</h2>
          </div>

          {analytics.ordersByStatus.length > 0 ? (
            <div className="space-y-3">
              {analytics.ordersByStatus.map((item) => (
                <div key={item.status} className="flex items-center justify-between p-3 rounded-xl bg-[#F8F2F0]/60 border border-[#E8DDE0]">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        item.status === 'DELIVERED' || item.status === 'PAID'
                          ? 'bg-green-600'
                          : item.status === 'SHIPPED' || item.status === 'PACKED'
                          ? 'bg-[#BD7C91]'
                          : item.status === 'PLACED'
                          ? 'bg-[#632D40]'
                          : 'bg-gray-400'
                      }`}
                    />
                    <span className="font-bold text-xs uppercase tracking-wider text-[#3D202B]">{item.status.toLowerCase()}</span>
                  </div>
                  <span className="text-xl font-extrabold text-[#3D202B]">{item._count}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-[#806B73] border border-dashed border-[#E8DDE0] rounded-xl">
              <ShoppingCart className="h-10 w-10 mx-auto mb-2 text-[#632D40] opacity-35" />
              <p className="text-sm font-medium">No orders yet</p>
            </div>
          )}
        </div>

        {/* Recent Customers */}
        <div className="p-6 rounded-2xl bg-white border border-[#E8DDE0] shadow-2xs lg:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <Users className="h-5 w-5 text-[#632D40]" />
            <h2 className="text-lg font-bold text-[#3D202B]">Recent Customers</h2>
          </div>

          {analytics.recentCustomers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E8DDE0] text-[#806B73] text-xs uppercase tracking-wider">
                    <th className="text-left py-3 px-4 font-bold">Customer</th>
                    <th className="text-left py-3 px-4 font-bold">Email</th>
                    <th className="text-left py-3 px-4 font-bold">Orders</th>
                    <th className="text-left py-3 px-4 font-bold">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8DDE0]">
                  {analytics.recentCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-[#F1D9DF]/20 transition-colors">
                      <td className="py-3 px-4 font-semibold text-[#3D202B]">
                        {customer.name || 'Customer'}
                      </td>
                      <td className="py-3 px-4 text-[#806B73] text-sm">{customer.email}</td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-0.5 bg-[#F1D9DF] text-[#632D40] rounded-full text-xs font-bold">
                          {customer._count.orders}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#806B73] text-sm">
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-[#806B73]">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-30 text-[#632D40]" />
              <p>No customers yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
