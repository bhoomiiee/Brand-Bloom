import Link from 'next/link'
import Image from 'next/image'
import { Product, ProductImage, Category } from '@prisma/client'
import { ThemeConfig, getCardClasses, getButtonClasses } from '@/lib/themes'
import { formatCurrency } from '@/lib/utils'

interface ProductWithRelations extends Product {
  images: ProductImage[]
  category: Category | null
}

interface FeaturedProductsProps {
  products: ProductWithRelations[]
  storeSlug: string
  theme: ThemeConfig
}

export function FeaturedProducts({ products, storeSlug, theme }: FeaturedProductsProps) {
  return (
    <section className="py-16 px-4" style={{ backgroundColor: theme.colors.background }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2
            className="text-3xl font-bold theme-font-heading"
            style={{ color: theme.colors.foreground }}
          >
            Featured Products
          </h2>
          <Link href={`/store/${storeSlug}/products`}>
            <button
              className="text-sm font-medium hover:opacity-80 transition-opacity"
              style={{ color: theme.colors.primary }}
            >
              View All →
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
      </div>
    </section>
  )
}
