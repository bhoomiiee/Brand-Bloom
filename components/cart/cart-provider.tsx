'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Cart, getCart, saveCart, addToCart, removeFromCart, updateCartItemQuantity, clearCart, getCartItemCount, CartItem } from '@/lib/cart'

interface CartContextType {
  cart: Cart
  itemCount: number
  addItem: (item: CartItem) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clear: () => void
  isLoading: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children, storeSlug }: { children: ReactNode; storeSlug: string }) {
  const [cart, setCart] = useState<Cart>({ items: [], storeSlug })
  const [isLoading, setIsLoading] = useState(true)

  // Load cart from localStorage on mount
  useEffect(() => {
    setCart(getCart(storeSlug))
    setIsLoading(false)
  }, [storeSlug])

  // Listen for cart updates from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `brandbloom_cart_${storeSlug}`) {
        setCart(getCart(storeSlug))
      }
    }

    const handleCartUpdate = ((e: CustomEvent<Cart>) => {
      setCart(e.detail)
    }) as EventListener

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('cartUpdated', handleCartUpdate)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('cartUpdated', handleCartUpdate)
    }
  }, [storeSlug])

  const handleAddItem = (item: CartItem) => {
    const updatedCart = addToCart(storeSlug, item)
    setCart(updatedCart)
  }

  const handleRemoveItem = (productId: string) => {
    const updatedCart = removeFromCart(storeSlug, productId)
    setCart(updatedCart)
  }

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    const updatedCart = updateCartItemQuantity(storeSlug, productId, quantity)
    setCart(updatedCart)
  }

  const handleClear = () => {
    const updatedCart = clearCart(storeSlug)
    setCart(updatedCart)
  }

  const itemCount = getCartItemCount(cart)

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount,
        addItem: handleAddItem,
        removeItem: handleRemoveItem,
        updateQuantity: handleUpdateQuantity,
        clear: handleClear,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
