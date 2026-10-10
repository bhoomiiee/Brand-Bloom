/**
 * Shopping Cart Management
 * 
 * Client-side cart stored in localStorage
 */

export interface CartItem {
  productId: string
  productSlug: string
  name: string
  price: number
  quantity: number
  image?: string
  sku?: string
  stock: number
}

export interface Cart {
  items: CartItem[]
  storeSlug: string
}

const CART_STORAGE_KEY = 'brandbloom_cart'

/**
 * Get cart from localStorage
 */
export function getCart(storeSlug: string): Cart {
  if (typeof window === 'undefined') {
    return { items: [], storeSlug }
  }

  try {
    const stored = localStorage.getItem(`${CART_STORAGE_KEY}_${storeSlug}`)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Failed to parse cart:', error)
  }

  return { items: [], storeSlug }
}

/**
 * Save cart to localStorage
 */
export function saveCart(cart: Cart): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(`${CART_STORAGE_KEY}_${cart.storeSlug}`, JSON.stringify(cart))
    
    // Dispatch custom event for cart updates
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cart }))
  } catch (error) {
    console.error('Failed to save cart:', error)
  }
}

/**
 * Add item to cart
 */
export function addToCart(storeSlug: string, item: CartItem): Cart {
  const cart = getCart(storeSlug)
  
  const existingItem = cart.items.find(i => i.productId === item.productId)
  
  if (existingItem) {
    // Update quantity if item exists
    existingItem.quantity = Math.min(existingItem.quantity + item.quantity, item.stock)
  } else {
    // Add new item
    cart.items.push(item)
  }
  
  saveCart(cart)
  return cart
}

/**
 * Remove item from cart
 */
export function removeFromCart(storeSlug: string, productId: string): Cart {
  const cart = getCart(storeSlug)
  cart.items = cart.items.filter(item => item.productId !== productId)
  saveCart(cart)
  return cart
}

/**
 * Update item quantity
 */
export function updateCartItemQuantity(
  storeSlug: string,
  productId: string,
  quantity: number
): Cart {
  const cart = getCart(storeSlug)
  const item = cart.items.find(i => i.productId === productId)
  
  if (item) {
    item.quantity = Math.max(1, Math.min(quantity, item.stock))
  }
  
  saveCart(cart)
  return cart
}

/**
 * Clear entire cart
 */
export function clearCart(storeSlug: string): Cart {
  const cart: Cart = { items: [], storeSlug }
  saveCart(cart)
  return cart
}

/**
 * Get cart item count
 */
export function getCartItemCount(cart: Cart): number {
  return cart.items.reduce((sum, item) => sum + item.quantity, 0)
}

/**
 * Get cart subtotal
 */
export function getCartSubtotal(cart: Cart): number {
  return cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

/**
 * Calculate cart totals
 */
export interface CartTotals {
  subtotal: number
  shipping: number
  tax: number
  total: number
}

export function calculateCartTotals(cart: Cart): CartTotals {
  const subtotal = getCartSubtotal(cart)
  
  // Simple shipping calculation (free over $100, otherwise $10)
  const shipping = subtotal >= 100 ? 0 : 10
  
  // Simple tax calculation (8% for demo)
  const tax = subtotal * 0.08
  
  const total = subtotal + shipping + tax
  
  return {
    subtotal,
    shipping,
    tax,
    total,
  }
}
