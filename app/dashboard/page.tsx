import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentStore } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Package, ShoppingCart, Palette, Upload, TrendingUp, Users, AlertCircle, Clock, Sparkles, ArrowRight } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { BotanicalCardAccent } from '@/components/ui/botanical-decorations'
import DeployedStoreLinkBanner from '@/components/dashboard/deployed-store-link-banner'

export const metadata: Metadata = {
  title: 'Dashboard | BrandBloom',
  description: 'Manage your online store',
}

async function getDashboardStats(storeId: string) {
  try {
    const [productCount, orderCount, customerCount, revenueData, recentOrders, lowStockProducts] = await Promise.all([
      prisma.product.count({ where: { storeId, isActive: true } }),
      prisma.order.count({ where: { storeId } }),
      prisma.customer.count({ where: { storeId } }),
      prisma.order.aggregate({ where: { storeId }, _sum: { total: true } }),
      prisma.order.findMany({ where: { storeId }, include: { customer: true }, orderBy: { createdAt: 'desc' }, take: 5 }),
      prisma.product.findMany({ where: { storeId, isActive: true, stock: { lte: 5, gt: 0 } }, orderBy: { stock: 'asc' }, take: 5 }),
    ])

    return {
      productCount,
      orderCount,
      customerCount,
      revenue: revenueData._sum.total || 0,
      recentOrders,
      lowStockProducts,
    }
  } catch (err: any) {
    console.warn('Dashboard stats query failed, retrying after brief pause...', err.message)
    await new Promise(r => setTimeout(r, 600))
    try {
      const [productCount, orderCount, customerCount, revenueData, recentOrders, lowStockProducts] = await Promise.all([
        prisma.product.count({ where: { storeId, isActive: true } }),
        prisma.order.count({ where: { storeId } }),
        prisma.customer.count({ where: { storeId } }),
        prisma.order.aggregate({ where: { storeId }, _sum: { total: true } }),
        prisma.order.findMany({ where: { storeId }, include: { customer: true }, orderBy: { createdAt: 'desc' }, take: 5 }),
        prisma.product.findMany({ where: { storeId, isActive: true, stock: { lte: 5, gt: 0 } }, orderBy: { stock: 'asc' }, take: 5 }),
      ])

      return {
        productCount,
        orderCount,
        customerCount,
        revenue: revenueData._sum.total || 0,
        recentOrders,
        lowStockProducts,
      }
    } catch {
      return {
        productCount: 0,
        orderCount: 0,
        customerCount: 0,
        revenue: 0,
        recentOrders: [],
        lowStockProducts: [],
      }
    }
  }
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  const store = await getCurrentStore()

  if (!store) {
    redirect('/onboarding')
  }

  const stats = await getDashboardStats(store.id)
  let pendingAdminRec = null
  try {
    pendingAdminRec = await prisma.recommendation.findFirst({
      where: { storeId: store.id, status: 'PENDING' },
      orderBy: { createdAt: 'desc' },
    })
  } catch (e) {
    console.warn('Pending admin rec lookup failed:', e)
  }

  return (
    <div className="space-y-8">
      {/* Access Denied Alert */}
      {searchParams.error === 'access_denied' && (
        <Card className="p-4 bg-red-50 border-red-200 rounded-2xl">
          <div className="flex items-center gap-2 text-red-800">
            <AlertCircle className="h-5 w-5" />
            <p className="font-semibold">Access Denied</p>
          </div>
          <p className="text-sm text-red-700 mt-1">
            You don't have permission to access that page. Contact your store owner for access.
          </p>
        </Card>
      )}

      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#3D202B] tracking-tight">Welcome back!</h1>
          <p className="text-[#806B73] mt-1 text-sm font-medium">
            Here's what's happening with your store today
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link href="/dashboard/bloompilot">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#F1D9DF] text-[#632D40] hover:bg-[#F1D9DF]/80 border border-[#BD7C91]/30 transition-all shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#632D40]" />
              <span>Ask BloomPilot AI</span>
            </button>
          </Link>
          <Link href={`/store/${store.slug}`} target="_blank">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#632D40] text-white hover:bg-[#632D40]/90 transition-all shadow-xs">
              <span>View Storefront</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>
      </div>

      {/* Live Deployed Storefront Distribution & Cloud Deployment Banner */}
      <DeployedStoreLinkBanner
        storeId={store.id}
        storeSlug={store.slug}
        storeName={store.name}
        publishedAt={store.publishedAt}
      />

      {/* Platform Admin Optimization Proposal Banner */}
      {pendingAdminRec && (
        <div className="p-4.5 rounded-2xl bg-gradient-to-r from-[#F1D9DF] via-white to-[#F8F2F0] border-2 border-[#BD7C91] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in duration-300">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#632D40] flex items-center justify-center text-white shrink-0 shadow-xs">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-[#632D40] text-white">
                  Incoming Admin Optimization
                </span>
                <span className="text-xs font-bold text-[#632D40]">94 Impact Score</span>
              </div>
              <p className="font-bold text-sm text-[#3D202B] mt-0.5">{pendingAdminRec.title}</p>
              <p className="text-xs text-[#806B73] line-clamp-1">{pendingAdminRec.description}</p>
            </div>
          </div>
          <Link href="/dashboard/bloompilot" className="shrink-0 w-full md:w-auto">
            <button className="w-full md:w-auto px-4 py-2 rounded-xl text-xs font-bold bg-[#632D40] text-white hover:bg-[#632D40]/90 transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer">
              <span>Review in BloomPilot</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>
      )}

      {/* Quick Stats with Botanical Card Watermarks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Total Products */}
        <div className="relative overflow-hidden p-6 rounded-2xl bg-white border border-[#E8DDE0] shadow-2xs hover:shadow-md transition-all">
          <BotanicalCardAccent className="opacity-35" />
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#806B73]">Total Products</p>
              <p className="text-3xl font-extrabold text-[#3D202B] mt-1.5">{stats.productCount}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#F1D9DF]/60 flex items-center justify-center text-[#632D40]">
              <Package className="h-6 w-6 text-[#632D40]" />
            </div>
          </div>
        </div>

        {/* Orders */}
        <div className="relative overflow-hidden p-6 rounded-2xl bg-white border border-[#E8DDE0] shadow-2xs hover:shadow-md transition-all">
          <BotanicalCardAccent className="opacity-35" />
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#806B73]">Orders</p>
              <p className="text-3xl font-extrabold text-[#3D202B] mt-1.5">{stats.orderCount}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#F1D9DF]/60 flex items-center justify-center text-[#BD7C91]">
              <ShoppingCart className="h-6 w-6 text-[#BD7C91]" />
            </div>
          </div>
        </div>

        {/* Revenue */}
        <div className="relative overflow-hidden p-6 rounded-2xl bg-white border border-[#E8DDE0] shadow-2xs hover:shadow-md transition-all">
          <BotanicalCardAccent className="opacity-35" />
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#806B73]">Revenue</p>
              <p className="text-3xl font-extrabold text-[#3D202B] mt-1.5">{formatCurrency(stats.revenue)}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#F1D9DF]/60 flex items-center justify-center text-[#BD7C91]">
              <TrendingUp className="h-6 w-6 text-[#BD7C91]" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders & Low Stock Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="p-6 rounded-2xl bg-white border border-[#E8DDE0] shadow-2xs">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-[#3D202B]">Recent Orders</h2>
            <Link href="/dashboard/orders">
              <button className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-[#E8DDE0] text-[#632D40] hover:bg-[#F1D9DF]/40 transition-colors">
                View All
              </button>
            </Link>
          </div>

          {stats.recentOrders.length > 0 ? (
            <div className="space-y-3">
              {stats.recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/dashboard/orders/${order.id}`}
                  className="block p-4 border border-[#E8DDE0] rounded-xl hover:bg-[#F8F2F0] transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm text-[#3D202B]">#{order.orderNumber}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                      order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                      order.status === 'PLACED' ? 'bg-[#F1D9DF] text-[#632D40]' :
                      order.status === 'PAID' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'PACKED' || order.status === 'SHIPPED' ? 'bg-purple-100 text-purple-700' :
                      order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-[#806B73]">
                    <span>{order.customerName || order.customer?.name || 'Customer'}</span>
                    <span className="font-bold text-[#3D202B]">{formatCurrency(order.total)}</span>
                  </div>
                  <div className="text-xs text-[#806B73] mt-1.5 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-[#806B73] border border-dashed border-[#E8DDE0] rounded-xl">
              <ShoppingCart className="h-10 w-10 mx-auto mb-2 text-[#BD7C91] opacity-40" />
              <p className="text-sm font-medium">No orders yet</p>
              <p className="text-xs text-[#806B73] mt-0.5">Orders will show here once customers buy products</p>
            </div>
          )}
        </div>

        {/* Low Stock Alert */}
        <div className="p-6 rounded-2xl bg-white border border-[#E8DDE0] shadow-2xs">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-[#BD7C91]" />
              <h2 className="text-lg font-bold text-[#3D202B]">Low Stock Alert</h2>
            </div>
            <Link href="/dashboard/products">
              <button className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-[#E8DDE0] text-[#632D40] hover:bg-[#F1D9DF]/40 transition-colors">
                Manage Inventory
              </button>
            </Link>
          </div>

          {stats.lowStockProducts.length > 0 ? (
            <div className="space-y-3">
              {stats.lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-4 border border-[#E8DDE0] rounded-xl bg-white"
                >
                  <div>
                    <p className="font-semibold text-sm text-[#3D202B]">{product.name}</p>
                    <p className="text-xs text-[#806B73]">SKU: {product.sku || 'N/A'}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-sm ${
                      product.stock === 0 ? 'text-red-600' :
                      product.stock <= 3 ? 'text-amber-600' :
                      'text-[#3D202B]'
                    }`}>
                      {product.stock} left
                    </p>
                    <p className="text-[11px] text-[#806B73]">in stock</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-[#806B73] border border-dashed border-[#E8DDE0] rounded-xl">
              <Package className="h-10 w-10 mx-auto mb-2 text-[#632D40] opacity-40" />
              <p className="text-sm font-medium">All products well-stocked</p>
              <p className="text-xs text-[#806B73] mt-0.5">Inventory levels are healthy across your catalog</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-bold text-[#3D202B] mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-6 rounded-2xl bg-white border border-[#E8DDE0] shadow-2xs hover:shadow-md transition-all group">
            <div className="w-10 h-10 rounded-xl bg-[#F1D9DF] flex items-center justify-center text-[#632D40] mb-4">
              <Package className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-base text-[#3D202B] mb-1">Add Products</h3>
            <p className="text-xs text-[#806B73] mb-5">
              Add botanical items manually or import your catalog via CSV
            </p>
            <Link href="/dashboard/products/import">
              <button className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold border border-[#E8DDE0] text-[#632D40] hover:bg-[#F1D9DF]/50 flex items-center justify-center gap-2 transition-all">
                <Upload className="h-3.5 w-3.5" />
                <span>Import Products</span>
              </button>
            </Link>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#E8DDE0] shadow-2xs hover:shadow-md transition-all group">
            <div className="w-10 h-10 rounded-xl bg-[#F1D9DF] flex items-center justify-center text-[#BD7C91] mb-4">
              <Palette className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-base text-[#3D202B] mb-1">Customize Theme</h3>
            <p className="text-xs text-[#806B73] mb-5">
              Select elegant fonts, color palettes, and header styling
            </p>
            <Link href="/dashboard/appearance">
              <button className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold border border-[#E8DDE0] text-[#632D40] hover:bg-[#F1D9DF]/50 flex items-center justify-center gap-2 transition-all">
                <span>Change Theme</span>
              </button>
            </Link>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#E8DDE0] shadow-2xs hover:shadow-md transition-all group">
            <div className="w-10 h-10 rounded-xl bg-[#F1D9DF] flex items-center justify-center text-[#632D40] mb-4">
              <ShoppingCart className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-base text-[#3D202B] mb-1">Live Storefront</h3>
            <p className="text-xs text-[#806B73] mb-5">
              Preview your customer shopping experience and checkout
            </p>
            <Link href={`/store/${store.slug}`} target="_blank">
              <button className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-[#632D40] hover:bg-[#632D40]/90 text-white flex items-center justify-center gap-2 transition-all shadow-xs">
                <span>Open Storefront</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Store Info */}
      <div className="p-6 rounded-2xl bg-white border border-[#E8DDE0] shadow-2xs">
        <h2 className="text-lg font-bold text-[#3D202B] mb-4">Store Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-xs font-semibold text-[#806B73]">Store Name</p>
            <p className="font-bold text-sm text-[#3D202B] mt-1">{store.name}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#806B73]">Store URL</p>
            <p className="font-medium text-sm mt-1">
              <Link 
                href={`/store/${store.slug}`}
                target="_blank"
                className="text-[#632D40] hover:text-[#BD7C91] underline font-semibold text-xs"
              >
                /store/{store.slug}
              </Link>
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#806B73]">Business Type</p>
            <p className="font-bold text-sm text-[#3D202B] mt-1 capitalize">{store.businessType || 'Boutique'}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#806B73]">Active Theme</p>
            <p className="font-bold text-sm text-[#632D40] mt-1 capitalize">Option 4 (Burgundy & Blush)</p>
          </div>
        </div>
      </div>
    </div>
  )
}
