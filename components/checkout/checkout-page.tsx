'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/components/cart/cart-provider'
import { useCustomer } from '@/components/storefront/customer-provider'
import { ThemeConfig, getButtonClasses, getCardClasses } from '@/lib/themes'
import { formatCurrency } from '@/lib/utils'
import { calculateCartTotals } from '@/lib/cart'
import { ShoppingBag, CreditCard, MapPin, User, Sparkles, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

interface CheckoutPageProps {
  storeId: string
  storeSlug: string
  theme: ThemeConfig
}

export function CheckoutPage({ storeId, storeSlug, theme }: CheckoutPageProps) {
  const { cart, clear } = useCart()
  const { customer, openAuthModal } = useCustomer()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState({
    // Customer Info
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    // Shipping Address
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    // Payment (placeholder)
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  })

  // Pre-fill form when customer logs in or is already logged in
  useEffect(() => {
    if (customer) {
      const parts = (customer.name || '').trim().split(' ')
      const firstName = parts[0] || ''
      const lastName = parts.slice(1).join(' ') || ''
      setFormData((prev) => ({
        ...prev,
        email: customer.email || prev.email,
        firstName: prev.firstName || firstName,
        lastName: prev.lastName || lastName,
        phone: prev.phone || customer.phone || '',
      }))
    }
  }, [customer])

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
            Add some items to your cart before checking out
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeId,
          items: cart.items,
          customer: {
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
          },
          shippingAddress: {
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country,
          },
          totals,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create order')
      }

      const { order } = await response.json()

      // Clear cart
      clear()

      // Redirect to confirmation page
      router.push(`/store/${storeSlug}/order/${order.id}/confirmation`)
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Failed to process order. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1
        className="text-4xl font-bold mb-8 theme-font-heading"
        style={{ color: theme.colors.foreground }}
      >
        Checkout
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <div
              className={`${getCardClasses(theme)} p-6`}
              style={{ borderColor: theme.colors.border }}
            >
              <div className="flex items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-3">
                  <User
                    className="h-6 w-6"
                    style={{ color: theme.colors.primary }}
                  />
                  <h2
                    className="text-xl font-bold theme-font-heading"
                    style={{ color: theme.colors.foreground }}
                  >
                    Customer Information
                  </h2>
                </div>

                {customer ? (
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Signed in as {customer.name || customer.email}</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={openAuthModal}
                    className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border border-dashed hover:opacity-80 transition-opacity cursor-pointer"
                    style={{ borderColor: theme.colors.primary, color: theme.colors.primary }}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Have an account? Sign In</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: theme.colors.foreground }}
                  >
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border rounded"
                    style={{
                      borderColor: theme.colors.border,
                      color: theme.colors.foreground,
                    }}
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: theme.colors.foreground }}
                  >
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border rounded"
                    style={{
                      borderColor: theme.colors.border,
                      color: theme.colors.foreground,
                    }}
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: theme.colors.foreground }}
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border rounded"
                    style={{
                      borderColor: theme.colors.border,
                      color: theme.colors.foreground,
                    }}
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: theme.colors.foreground }}
                  >
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border rounded"
                    style={{
                      borderColor: theme.colors.border,
                      color: theme.colors.foreground,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div
              className={`${getCardClasses(theme)} p-6`}
              style={{ borderColor: theme.colors.border }}
            >
              <div className="flex items-center gap-3 mb-6">
                <MapPin
                  className="h-6 w-6"
                  style={{ color: theme.colors.primary }}
                />
                <h2
                  className="text-xl font-bold theme-font-heading"
                  style={{ color: theme.colors.foreground }}
                >
                  Shipping Address
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: theme.colors.foreground }}
                  >
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border rounded"
                    style={{
                      borderColor: theme.colors.border,
                      color: theme.colors.foreground,
                    }}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: theme.colors.foreground }}
                    >
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border rounded"
                      style={{
                        borderColor: theme.colors.border,
                        color: theme.colors.foreground,
                      }}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: theme.colors.foreground }}
                    >
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border rounded"
                      style={{
                        borderColor: theme.colors.border,
                        color: theme.colors.foreground,
                      }}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: theme.colors.foreground }}
                    >
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border rounded"
                      style={{
                        borderColor: theme.colors.border,
                        color: theme.colors.foreground,
                      }}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: theme.colors.foreground }}
                    >
                      Country *
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border rounded"
                      style={{
                        borderColor: theme.colors.border,
                        color: theme.colors.foreground,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information (Placeholder) */}
            <div
              className={`${getCardClasses(theme)} p-6`}
              style={{ borderColor: theme.colors.border }}
            >
              <div className="flex items-center gap-3 mb-6">
                <CreditCard
                  className="h-6 w-6"
                  style={{ color: theme.colors.primary }}
                />
                <h2
                  className="text-xl font-bold theme-font-heading"
                  style={{ color: theme.colors.foreground }}
                >
                  Payment Information
                </h2>
              </div>

              <div
                className="p-4 rounded mb-4"
                style={{ backgroundColor: theme.colors.muted }}
              >
                <p className="text-sm" style={{ color: theme.colors.foreground }}>
                  <strong>Demo Mode:</strong> Payment processing is simulated. No actual charges will be made.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: theme.colors.foreground }}
                  >
                    Card Number
                  </label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="4242 4242 4242 4242"
                    className="w-full px-4 py-2 border rounded"
                    style={{
                      borderColor: theme.colors.border,
                      color: theme.colors.foreground,
                    }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: theme.colors.foreground }}
                    >
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      className="w-full px-4 py-2 border rounded"
                      style={{
                        borderColor: theme.colors.border,
                        color: theme.colors.foreground,
                      }}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: theme.colors.foreground }}
                    >
                      CVV
                    </label>
                    <input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      placeholder="123"
                      className="w-full px-4 py-2 border rounded"
                      style={{
                        borderColor: theme.colors.border,
                        color: theme.colors.foreground,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
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

              {/* Order Items */}
              <div className="space-y-3 mb-6">
                {cart.items.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span style={{ color: theme.colors.foreground }}>
                      {item.name} × {item.quantity}
                    </span>
                    <span style={{ color: theme.colors.foreground }}>
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div
                className="space-y-3 pt-4 border-t"
                style={{ borderColor: theme.colors.border }}
              >
                <div className="flex justify-between text-sm">
                  <span style={{ color: theme.colors.foreground, opacity: 0.7 }}>
                    Subtotal
                  </span>
                  <span style={{ color: theme.colors.foreground }}>
                    {formatCurrency(totals.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: theme.colors.foreground, opacity: 0.7 }}>
                    Shipping
                  </span>
                  <span style={{ color: theme.colors.foreground }}>
                    {totals.shipping === 0 ? 'FREE' : formatCurrency(totals.shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: theme.colors.foreground, opacity: 0.7 }}>
                    Tax
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

              <button
                type="submit"
                disabled={isProcessing}
                className={`${getButtonClasses(theme)} w-full text-white mt-6 disabled:opacity-50 disabled:cursor-not-allowed`}
                style={{ backgroundColor: theme.colors.primary }}
              >
                {isProcessing ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
