import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getCurrentStore } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { Package, Plus, Upload, Edit, Trash2, AlertCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Products | BrandBloom',
  description: 'Manage your product inventory',
}

async function getProducts(storeId: string) {
  const products = await prisma.product.findMany({
    where: { storeId },
    include: {
      category: true,
      images: {
        orderBy: { sortOrder: 'asc' },
        take: 1,
      },
      _count: {
        select: { orderItems: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return products
}

async function getProductStats(storeId: string) {
  const [totalProducts, activeProducts, outOfStock, lowStock] = await Promise.all([
    prisma.product.count({ where: { storeId } }),
    prisma.product.count({ where: { storeId, isActive: true } }),
    prisma.product.count({ where: { storeId, stock: 0 } }),
    prisma.product.count({ where: { storeId, stock: { gt: 0, lte: 5 } } }),
  ])

  return { totalProducts, activeProducts, outOfStock, lowStock }
}

import { BotanicalCardAccent } from '@/components/ui/botanical-decorations'

export default async function ProductsPage() {
  const store = await getCurrentStore()

  if (!store) {
    redirect('/onboarding')
  }

  const [products, stats] = await Promise.all([
    getProducts(store.id),
    getProductStats(store.id),
  ])

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#3D202B]">Products</h1>
          <p className="text-sm font-medium text-[#806B73] mt-1">
            Manage your botanical product inventory, pricing, and stock
          </p>
        </div>
        <div className="flex gap-2.5">
          <Link href="/dashboard/products/import">
            <button className="px-4 py-2 rounded-xl text-xs font-semibold border border-[#E8DDE0] text-[#632D40] hover:bg-[#F1D9DF]/40 transition-colors flex items-center gap-2">
              <Upload className="h-3.5 w-3.5" />
              <span>Import Products</span>
            </button>
          </Link>
          <Link href="/dashboard/products/new">
            <button className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#632D40] hover:bg-[#632D40]/90 text-white transition-all shadow-xs flex items-center gap-2">
              <Plus className="h-3.5 w-3.5" />
              <span>Add Product</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Stats with Botanical Card Accents */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-2xl bg-white border border-[#E8DDE0] shadow-2xs relative overflow-hidden">
          <BotanicalCardAccent className="opacity-35" />
          <div className="flex items-center gap-3 mb-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-[#F1D9DF] flex items-center justify-center text-[#632D40]">
              <Package className="h-5 w-5" />
            </div>
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#806B73] mb-1 relative z-10">Total Products</p>
          <p className="text-3xl font-extrabold text-[#3D202B] relative z-10">{stats.totalProducts}</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#E8DDE0] shadow-2xs relative overflow-hidden">
          <BotanicalCardAccent className="opacity-35" />
          <div className="flex items-center gap-3 mb-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-[#F1D9DF] flex items-center justify-center text-[#BD7C91]">
              <Package className="h-5 w-5" />
            </div>
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#806B73] mb-1 relative z-10">Active</p>
          <p className="text-3xl font-extrabold text-[#3D202B] relative z-10">{stats.activeProducts}</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#E8DDE0] shadow-2xs relative overflow-hidden">
          <BotanicalCardAccent className="opacity-35" />
          <div className="flex items-center gap-3 mb-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <AlertCircle className="h-5 w-5" />
            </div>
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#806B73] mb-1 relative z-10">Low Stock</p>
          <p className="text-3xl font-extrabold text-amber-700 relative z-10">{stats.lowStock}</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#E8DDE0] shadow-2xs relative overflow-hidden">
          <BotanicalCardAccent className="opacity-35" />
          <div className="flex items-center gap-3 mb-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
              <AlertCircle className="h-5 w-5" />
            </div>
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#806B73] mb-1 relative z-10">Out of Stock</p>
          <p className="text-3xl font-extrabold text-red-700 relative z-10">{stats.outOfStock}</p>
        </div>
      </div>

      {/* Products Table */}
      <div className="p-6 rounded-2xl bg-white border border-[#E8DDE0] shadow-2xs">
        <h2 className="text-lg font-bold text-[#3D202B] mb-5">All Products</h2>

        {products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E8DDE0] text-xs font-bold text-[#806B73] uppercase tracking-wider">
                  <th className="text-left py-3.5 px-4">Product</th>
                  <th className="text-left py-3.5 px-4">Category</th>
                  <th className="text-left py-3.5 px-4">Price</th>
                  <th className="text-left py-3.5 px-4">Stock</th>
                  <th className="text-left py-3.5 px-4">Status</th>
                  <th className="text-left py-3.5 px-4">Sales</th>
                  <th className="text-right py-3.5 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-[#E8DDE0] last:border-0 hover:bg-[#F8F2F0] transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                          {product.images[0] ? (
                            <Image
                              src={product.images[0].url}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <Package className="h-6 w-6" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold">{product.name}</p>
                          {product.sku && (
                            <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {product.category ? (
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-sm">
                          {product.category.name}
                        </span>
                      ) : (
                        <span className="text-gray-400">Uncategorized</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-semibold">{formatCurrency(product.price)}</p>
                        {product.comparePrice && Number(product.comparePrice) > Number(product.price) && (
                          <p className="text-sm text-gray-500 line-through">
                            {formatCurrency(product.comparePrice)}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`font-semibold ${
                          product.stock === 0
                            ? 'text-red-600'
                            : product.stock <= 5
                            ? 'text-amber-600'
                            : 'text-green-600'
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-1 rounded text-sm font-semibold ${
                          product.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {product.isActive ? 'ACTIVE' : 'DRAFT'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-600">{product._count.orderItems}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/dashboard/products/${product.id}`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
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
            <Package className="h-16 w-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-semibold mb-2">No products yet</p>
            <p className="text-sm mb-6">Start adding products to your store</p>
            <div className="flex gap-3 justify-center">
              <Link href="/dashboard/products/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </Link>
              <Link href="/dashboard/products/import">
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Import Products
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
