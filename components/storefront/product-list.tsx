'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Product, ProductImage, Category } from '@prisma/client'
import { ThemeConfig, getCardClasses } from '@/lib/themes'
import { formatCurrency } from '@/lib/utils'
import { Filter, SlidersHorizontal } from 'lucide-react'

interface ProductWithRelations extends Product {
  images: ProductImage[]
  category: Category | null
}

interface ProductListProps {
  products: ProductWithRelations[]
  categories: Category[]
  storeSlug: string
  theme: ThemeConfig
  filters: { category?: string; search?: string; sort?: string }
}

export function ProductList({ products, categories, storeSlug, theme, filters }: ProductListProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/store/${storeSlug}/products?${params.toString()}`)
  }

  return (
    <div>
      {/* Filters Bar */}
      <div className="flex items-center justify-between mb-6 pb-6 border-b" style={{ borderColor: theme.colors.border }}>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 rounded border"
            style={{
              borderColor: theme.colors.border,
              color: theme.colors.foreground,
            }}
          >
            <Filter className="h-4 w-4" />
            Filters
          </button>

          {filters.category && (
            <span className="text-sm">
              <span style={{ color: theme.colors.foreground, opacity: 0.6 }}>Category: </span>
              <span style={{ color: theme.colors.primary }} className="font-medium capitalize">
                {filters.category}
              </span>
              <button
                onClick={() => handleFilterChange('category', '')}
                className="ml-2 text-xs hover:underline"
                style={{ color: theme.colors.foreground, opacity: 0.6 }}
              >
                Clear
              </button>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm" style={{ color: theme.colors.foreground }}>
            Sort:
          </label>
          <select
            value={filters.sort || 'newest'}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
            className="px-3 py-2 rounded border"
            style={{
              borderColor: theme.colors.border,
              color: theme.colors.foreground,
              backgroundColor: theme.colors.background,
            }}
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name: A-Z</option>
          </select>
        </div>
      </div>

      {/* Filters Sidebar */}
      {showFilters && (
        <div className="mb-6 p-4 rounded border" style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.muted }}>
          <h3 className="font-semibold mb-3" style={{ color: theme.colors.foreground }}>
            Categories
          </h3>
          <div className="space-y-2">
            <button
              onClick={() => handleFilterChange('category', '')}
              className={`block w-full text-left px-3 py-2 rounded text-sm ${
                !filters.category ? 'font-semibold' : ''
              }`}
              style={{
                color: !filters.category ? theme.colors.primary : theme.colors.foreground,
              }}
            >
              All Products
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleFilterChange('category', category.slug)}
                className={`block w-full text-left px-3 py-2 rounded text-sm ${
                  filters.category === category.slug ? 'font-semibold' : ''
                }`}
                style={{
                  color: filters.category === category.slug ? theme.colors.primary : theme.colors.foreground,
                }}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Products Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/store/${storeSlug}/product/${product.slug}`}
            >
              <div
                className={`${getCardClasses(theme)} group cursor-pointer h-full flex flex-col`}
                style={{ borderColor: theme.colors.border }}
              >
                {/* Product Image */}
                <div
                  className="relative w-full aspect-square overflow-hidden"
                  style={{ backgroundColor: theme.colors.muted }}
                >
                  {product.images[0] ? (
                    <Image
                      src={product.images[0].url}
                      alt={product.images[0].altText || product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-4xl" style={{ color: theme.colors.foreground, opacity: 0.3 }}>
                        {product.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}

                  {/* Stock Badge */}
                  {product.stock <= 5 && product.stock > 0 && (
                    <div
                      className="absolute top-2 right-2 px-2 py-1 rounded text-xs font-semibold text-white"
                      style={{ backgroundColor: theme.colors.accent }}
                    >
                      Only {product.stock} left
                    </div>
                  )}

                  {product.stock === 0 && (
                    <div className="absolute top-2 right-2 px-2 py-1 rounded text-xs font-semibold bg-gray-900 text-white">
                      Out of Stock
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4 flex-1 flex flex-col">
                  {product.category && (
                    <p
                      className="text-xs font-medium mb-1"
                      style={{ color: theme.colors.primary }}
                    >
                      {product.category.name}
                    </p>
                  )}

                  <h3
                    className="font-semibold mb-2 line-clamp-2 theme-font-heading"
                    style={{ color: theme.colors.foreground }}
                  >
                    {product.name}
                  </h3>

                  <div className="mt-auto">
                    <div className="flex items-center justify-between">
                      <span
                        className="text-lg font-bold"
                        style={{ color: theme.colors.foreground }}
                      >
                        {formatCurrency(product.price)}
                      </span>
                      {product.comparePrice && Number(product.comparePrice) > Number(product.price) && (
                        <span className="text-sm line-through opacity-60">
                          {formatCurrency(product.comparePrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <h3 className="text-2xl font-bold mb-2" style={{ color: theme.colors.foreground }}>
            No products found
          </h3>
          <p style={{ color: theme.colors.foreground, opacity: 0.6 }}>
            Try adjusting your filters or search terms
          </p>
        </div>
      )}

      {/* Results Count */}
      {products.length > 0 && (
        <div className="mt-8 text-center text-sm" style={{ color: theme.colors.foreground, opacity: 0.6 }}>
          Showing {products.length} {products.length === 1 ? 'product' : 'products'}
        </div>
      )}
    </div>
  )
}
