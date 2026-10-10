'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Product, ProductImage, Category } from '@prisma/client'
import { ThemeConfig, getButtonClasses, getCardClasses } from '@/lib/themes'
import { formatCurrency } from '@/lib/utils'
import { ShoppingCart, Minus, Plus, Check } from 'lucide-react'
import { useCart } from '@/components/cart/cart-provider'

interface ProductWithRelations extends Product {
  images: ProductImage[]
  category: Category | null
}

interface ProductDetailProps {
  product: ProductWithRelations
  relatedProducts: ProductWithRelations[]
  storeSlug: string
  theme: ThemeConfig
}

export function ProductDetail({ product, relatedProducts, storeSlug, theme }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(product.images[0])
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const { addItem } = useCart()

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      productSlug: product.slug,
      name: product.name,
      price: Number(product.price),
      quantity,
      image: product.images[0]?.url,
      sku: product.sku || undefined,
      stock: product.stock,
    })
    
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm" style={{ color: theme.colors.foreground, opacity: 0.6 }}>
          <Link href={`/store/${storeSlug}`} className="hover:opacity-100">
            Home
          </Link>
          <span>/</span>
          <Link href={`/store/${storeSlug}/products`} className="hover:opacity-100">
            Products
          </Link>
          {product.category && (
            <>
              <span>/</span>
              <Link
                href={`/store/${storeSlug}/category/${product.category.slug}`}
                className="hover:opacity-100"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span style={{ color: theme.colors.foreground }}>{product.name}</span>
        </div>
      </div>

      {/* Product Details */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div
              className="relative w-full aspect-square overflow-hidden rounded-lg"
              style={{ backgroundColor: theme.colors.muted }}
            >
              {selectedImage ? (
                <Image
                  src={selectedImage.url}
                  alt={selectedImage.altText || product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-6xl" style={{ color: theme.colors.foreground, opacity: 0.3 }}>
                    {product.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImage(image)}
                    className={`relative aspect-square overflow-hidden rounded border-2 transition-all ${
                      selectedImage?.id === image.id ? 'ring-2' : ''
                    }`}
                    style={{
                      borderColor: selectedImage?.id === image.id ? theme.colors.primary : theme.colors.border,
                      backgroundColor: theme.colors.muted,
                    }}
                  >
                    <Image
                      src={image.url}
                      alt={image.altText || product.name}
                      fill
                      className="object-cover"
                      sizes="150px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {product.category && (
              <Link
                href={`/store/${storeSlug}/category/${product.category.slug}`}
                className="text-sm font-medium hover:underline"
                style={{ color: theme.colors.primary }}
              >
                {product.category.name}
              </Link>
            )}

            <h1
              className="text-4xl font-bold mt-2 mb-4 theme-font-heading"
              style={{ color: theme.colors.foreground }}
            >
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span
                className="text-3xl font-bold"
                style={{ color: theme.colors.foreground }}
              >
                {formatCurrency(product.price)}
              </span>
              {product.comparePrice && Number(product.comparePrice) > Number(product.price) && (
                <>
                  <span className="text-xl line-through" style={{ color: theme.colors.foreground, opacity: 0.5 }}>
                    {formatCurrency(product.comparePrice)}
                  </span>
                  <span
                    className="px-2 py-1 rounded text-sm font-semibold text-white"
                    style={{ backgroundColor: theme.colors.accent }}
                  >
                    Save {Math.round(((Number(product.comparePrice) - Number(product.price)) / Number(product.comparePrice)) * 100)}%
                  </span>
                </>
              )}
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {product.stock > 0 ? (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-sm" style={{ color: theme.colors.foreground }}>
                    {product.stock > 10 ? 'In Stock' : `Only ${product.stock} left in stock`}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-sm" style={{ color: theme.colors.foreground }}>
                    Out of Stock
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="mb-8">
                <h2 className="font-semibold mb-2" style={{ color: theme.colors.foreground }}>
                  Description
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: theme.colors.foreground, opacity: 0.8 }}>
                  {product.description}
                </p>
              </div>
            )}

            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.foreground }}>
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border rounded" style={{ borderColor: theme.colors.border }}>
                    <button
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                      className="p-3 hover:bg-opacity-5 hover:bg-black disabled:opacity-30"
                    >
                      <Minus className="h-4 w-4" style={{ color: theme.colors.foreground }} />
                    </button>
                    <span className="px-6 font-semibold" style={{ color: theme.colors.foreground }}>
                      {quantity}
                    </span>
                    <button
                      onClick={incrementQuantity}
                      disabled={quantity >= product.stock}
                      className="p-3 hover:bg-opacity-5 hover:bg-black disabled:opacity-30"
                    >
                      <Plus className="h-4 w-4" style={{ color: theme.colors.foreground }} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || addedToCart}
              className={`${getButtonClasses(theme)} w-full text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
              style={{ backgroundColor: theme.colors.primary }}
            >
              {addedToCart ? (
                <>
                  <Check className="h-5 w-5" />
                  Added to Cart
                </>
              ) : (
                <>
                  <ShoppingCart className="h-5 w-5" />
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </>
              )}
            </button>

            {/* SKU */}
            {product.sku && (
              <p className="text-sm mt-4" style={{ color: theme.colors.foreground, opacity: 0.6 }}>
                SKU: {product.sku}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 py-16">
          <h2
            className="text-3xl font-bold mb-8 theme-font-heading"
            style={{ color: theme.colors.foreground }}
          >
            You May Also Like
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Link
                key={relatedProduct.id}
                href={`/store/${storeSlug}/product/${relatedProduct.slug}`}
              >
                <div
                  className={`${getCardClasses(theme)} group cursor-pointer h-full flex flex-col`}
                  style={{ borderColor: theme.colors.border }}
                >
                  <div
                    className="relative w-full aspect-square overflow-hidden"
                    style={{ backgroundColor: theme.colors.muted }}
                  >
                    {relatedProduct.images[0] && (
                      <Image
                        src={relatedProduct.images[0].url}
                        alt={relatedProduct.images[0].altText || relatedProduct.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    )}
                  </div>

                  <div className="p-4">
                    <h3
                      className="font-semibold mb-2 line-clamp-2"
                      style={{ color: theme.colors.foreground }}
                    >
                      {relatedProduct.name}
                    </h3>
                    <span
                      className="text-lg font-bold"
                      style={{ color: theme.colors.foreground }}
                    >
                      {formatCurrency(relatedProduct.price)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
