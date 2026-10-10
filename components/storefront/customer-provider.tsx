'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface CustomerData {
  id: string
  email: string
  name: string | null
  phone: string | null
  createdAt?: string
  orderCount?: number
  orders?: Array<{
    id: string
    orderNumber: string
    status: string
    total: number
    createdAt: string
  }>
}

interface CustomerContextType {
  customer: CustomerData | null
  isLoading: boolean
  isAuthModalOpen: boolean
  isOrdersModalOpen: boolean
  openAuthModal: () => void
  closeAuthModal: () => void
  openOrdersModal: () => void
  closeOrdersModal: () => void
  loginOrRegister: (data: {
    email: string
    name?: string
    phone?: string
    action?: 'login' | 'register'
  }) => Promise<{ success: boolean; isNewCustomer?: boolean; error?: string }>
  logout: () => void
  refreshCustomer: () => Promise<void>
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined)

export function CustomerProvider({
  children,
  storeId,
  storeSlug,
}: {
  children: ReactNode
  storeId: string
  storeSlug: string
}) {
  const [customer, setCustomer] = useState<CustomerData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false)

  const storageKey = `brandbloom_customer_${storeSlug}`

  // Load customer session from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        const parsed = JSON.parse(stored)
        setCustomer(parsed)
        // Refresh silently from server to keep latest order count & details
        if (parsed?.email) {
          fetch(`/api/store/customer/auth?storeId=${storeId}&email=${encodeURIComponent(parsed.email)}`)
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
              if (data?.customer) {
                setCustomer(data.customer)
                localStorage.setItem(storageKey, JSON.stringify(data.customer))
              }
            })
            .catch(() => {})
        }
      }
    } catch (e) {
      console.error('Failed to parse customer session:', e)
    } finally {
      setIsLoading(false)
    }
  }, [storeId, storeSlug, storageKey])

  const loginOrRegister = async ({
    email,
    name,
    phone,
    action = 'login',
  }: {
    email: string
    name?: string
    phone?: string
    action?: 'login' | 'register'
  }) => {
    try {
      const res = await fetch('/api/store/customer/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeId,
          email,
          name,
          phone,
          action,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        return { success: false, error: data.error || 'Authentication failed' }
      }

      setCustomer(data.customer)
      localStorage.setItem(storageKey, JSON.stringify(data.customer))
      return { success: true, isNewCustomer: data.isNewCustomer }
    } catch (err: any) {
      return { success: false, error: err.message || 'Something went wrong' }
    }
  }

  const logout = () => {
    setCustomer(null)
    localStorage.removeItem(storageKey)
  }

  const refreshCustomer = async () => {
    if (!customer?.email) return
    try {
      const res = await fetch(`/api/store/customer/auth?storeId=${storeId}&email=${encodeURIComponent(customer.email)}`)
      if (res.ok) {
        const data = await res.json()
        if (data?.customer) {
          setCustomer(data.customer)
          localStorage.setItem(storageKey, JSON.stringify(data.customer))
        }
      }
    } catch (e) {
      console.error('Error refreshing customer:', e)
    }
  }

  return (
    <CustomerContext.Provider
      value={{
        customer,
        isLoading,
        isAuthModalOpen,
        isOrdersModalOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
        openOrdersModal: () => setIsOrdersModalOpen(true),
        closeOrdersModal: () => setIsOrdersModalOpen(false),
        loginOrRegister,
        logout,
        refreshCustomer,
      }}
    >
      {children}
    </CustomerContext.Provider>
  )
}

export function useCustomer() {
  const context = useContext(CustomerContext)
  if (!context) {
    throw new Error('useCustomer must be used within a CustomerProvider')
  }
  return context
}
