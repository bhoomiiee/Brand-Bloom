'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCart } from './cart-provider'
import { ThemeConfig, getButtonClasses, getCardClasses } from '@/lib/themes'
import { formatCurrency } from '@/lib/utils'
import { calculateCartTotals } from '@/lib/cart'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'

interface CartPageProps {
  storeSlug: string
  theme: ThemeConfig
}

export function CartPage({ storeSlug, theme }: CartPageProps) {
  const { cart, removeItem, updateQuantity } = useCart()
  const totals = calculateCartTotals(cart)

  if (cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center py-20">
          <ShoppingBag
            className="h-24 w-24 mx-auto mb-6 opacity-30"
            style={{ color: theme.colors.foreground }}
          />
          <h1
            className="text-3xl font-bold mb-4 theme-font-heading"
            style={{ color: theme.colors.foreground }}
          >
            Your cart is empty
          </h1>
          <p className="mb-8" style={{ color: theme.colors.foreground, opacity: 0.7 }}>
            Start shopping to add items to your cart
          </p>
          <Link href={`/store/${storeSlug}/products`}>
            <button
              className={`${getButtonClasses(theme)} text-white`}
              style={{ backgroundColor: theme.colors.primary }}
            >
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1
        className="text-4xl font-bold mb-8 theme-font-heading"
        style={{ color: theme.colors.foreground }}
      >
        Shopping Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div
              key={item.productId}
              className={`${getCardClasses(theme)} p-6`}
              style={{ borderColor: theme.colors.border }}
            >
              <div className="flex gap-6">
                {/* Product Image */}
                <Link href={`/store/${storeSlug}/product/${item.productSlug}`}>
                  <div
                    className="relative w-24 h-24 flex-shrink-0 rounded overflow-hidden"
                    style={{ backgroundColor: theme.colors.muted }}
                  >
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span
                          className="text-2xl"
                          style={{ color: theme.colors.foreground, opacity: 0.3 }}
                        >
                          {item.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>

                {/* Product Info */}
                <div className="flex-1">
                  <Link href={`/store/${storeSlug}/product/${item.productSlug}`}>
                    <h3
                      className="font-semibold mb-1 hover:opacity-80 theme-font-heading"
                      style={{ color: theme.colors.foreground }}
                    >
                      {item.name}
                    </h3>
                  </Link>
                  {item.sku && (
                    <p
                      className="text-sm mb-2"
                      style={{ color: theme.colors.foreground, opacity: 0.6 }}
                    >
                      SKU: {item.sku}
                    </p>
                  )}
                  <p
                    className="text-lg font-bold"
                    style={{ color: theme.colors.foreground }}
                  >
                    {formatCurrency(item.price)}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="p-2 hover:opacity-80 transition-opacity"
                    style={{ color: theme.colors.foreground, opacity: 0.6 }}
                    title="Remove from cart"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>

                  <div className="flex items-center border rounded" style={{ borderColor: theme.colors.border }}>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="p-2 hover:bg-opacity-5 hover:bg-black disabled:opacity-30"
                    >
                      <Minus className="h-4 w-4" style={{ color: theme.colors.foreground }} />
                    </button>
                    <span
                      className="px-4 font-semibold"
                      style={{ color: theme.colors.foreground }}
                    >
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      className="p-2 hover:bg-opacity-5 hover:bg-black disabled:opacity-30"
                    >
                      <Plus className="h-4 w-4" style={{ color: theme.colors.foreground }} />
                    </button>
                  </div>

                  <p
                    className="font-bold"
                    style={{ color: theme.colors.foreground }}
                  >
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div>
          <div
            className={`${getCardClasses(theme)} p-6 sticky top-24`}
            style={{ borderColor: theme.colors.border }}
          >
            <h2
              className="text-xl font-bold mb-6 theme-font-heading"
              style={{ color: theme.colors.foreground }}
            >
              Order Summary
            </h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span style={{ color: theme.colors.foreground, opacity: 0.7 }}>
                  Subtotal
                </span>
                <span style={{ color: theme.colors.foreground }}>
                  {formatCurrency(totals.subtotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: theme.colors.foreground, opacity: 0.7 }}>
                  Shipping
                </span>
                <span style={{ color: theme.colors.foreground }}>
                  {totals.shipping === 0 ? 'FREE' : formatCurrency(totals.shipping)}
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: theme.colors.foreground, opacity: 0.7 }}>
                  Tax (estimated)
                </span>
                <span style={{ color: theme.colors.foreground }}>
                  {formatCurrency(totals.tax)}
                </span>
              </div>
              <div
                className="pt-3 border-t flex justify-between text-lg font-bold"
                style={{ borderColor: theme.colors.border }}
              >
                <span style={{ color: theme.colors.foreground }}>Total</span>
                <span style={{ color: theme.colors.foreground }}>
                  {formatCurrency(totals.total)}
                </span>
              </div>
            </div>

            {totals.subtotal < 100 && (
              <p
                className="text-sm mb-4 p-3 rounded"
                style={{
                  backgroundColor: theme.colors.muted,
                  color: theme.colors.foreground,
                }}
              >
                Add {formatCurrency(100 - totals.subtotal)} more for FREE shipping!
              </p>
            )}

            <Link href={`/store/${storeSlug}/checkout`}>
              <button
                className={`${getButtonClasses(theme)} w-full text-white mb-3`}
                style={{ backgroundColor: theme.colors.primary }}
              >
                Proceed to Checkout
              </button>
            </Link>

            <Link href={`/store/${storeSlug}/products`}>
              <button
                className={`${getButtonClasses(theme)} w-full border`}
                style={{
                  borderColor: theme.colors.border,
                  color: theme.colors.foreground,
                }}
              >
                Continue Shopping
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
