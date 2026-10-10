'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ShoppingCart, Menu, X, Search, User, LogOut, Package } from 'lucide-react'
import { ThemeConfig, getHeaderClasses } from '@/lib/themes'
import { Store, Category } from '@prisma/client'
import { useCart } from '@/components/cart/cart-provider'
import { useCustomer } from './customer-provider'

interface StorefrontHeaderProps {
  store: Store
  theme: ThemeConfig
  categories: Category[]
}

export function StorefrontHeader({ store, theme, categories }: StorefrontHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { itemCount } = useCart()
  const { customer, openAuthModal, openOrdersModal, logout } = useCustomer()

  return (
    <header className={getHeaderClasses(theme)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/store/${store.slug}`} className="flex items-center gap-2">
            <div 
              className="w-10 h-10 rounded flex items-center justify-center text-white font-bold text-xl"
              style={{ backgroundColor: theme.colors.primary }}
            >
              {store.name.charAt(0).toUpperCase()}
            </div>
            <span 
              className="text-xl font-bold theme-font-heading"
              style={{ 
                color: theme.layout.headerStyle === 'bold' ? 'white' : theme.colors.foreground 
              }}
            >
              {store.name}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href={`/store/${store.slug}`}
              className="text-sm font-medium hover:opacity-80 transition-opacity"
              style={{ 
                color: theme.layout.headerStyle === 'bold' ? 'white' : theme.colors.foreground 
              }}
            >
              Home
            </Link>
            <Link
              href={`/store/${store.slug}/products`}
              className="text-sm font-medium hover:opacity-80 transition-opacity"
              style={{ 
                color: theme.layout.headerStyle === 'bold' ? 'white' : theme.colors.foreground 
              }}
            >
              All Products
            </Link>
            {categories.slice(0, 4).map((category) => (
              <Link
                key={category.id}
                href={`/store/${store.slug}/category/${category.slug}`}
                className="text-sm font-medium hover:opacity-80 transition-opacity"
                style={{ 
                  color: theme.layout.headerStyle === 'bold' ? 'white' : theme.colors.foreground 
                }}
              >
                {category.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              className="p-2 hover:opacity-80 transition-opacity"
              style={{ 
                color: theme.layout.headerStyle === 'bold' ? 'white' : theme.colors.foreground 
              }}
              title="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Customer Account Button */}
            {customer ? (
              <button
                onClick={openOrdersModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold hover:opacity-90 transition-all border shadow-xs"
                style={{ 
                  borderColor: theme.layout.headerStyle === 'bold' ? 'rgba(255,255,255,0.3)' : theme.colors.border,
                  color: theme.layout.headerStyle === 'bold' ? 'white' : theme.colors.foreground,
                  backgroundColor: theme.layout.headerStyle === 'bold' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.03)',
                }}
                title={`Logged in as ${customer.name || customer.email}`}
              >
                <User className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Hi, {customer.name ? customer.name.split(' ')[0] : 'Account'}</span>
              </button>
            ) : (
              <button
                onClick={openAuthModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold hover:opacity-90 transition-all border shadow-xs cursor-pointer"
                style={{ 
                  borderColor: theme.layout.headerStyle === 'bold' ? 'rgba(255,255,255,0.3)' : theme.colors.border,
                  color: theme.layout.headerStyle === 'bold' ? 'white' : theme.colors.foreground,
                  backgroundColor: theme.layout.headerStyle === 'bold' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.02)',
                }}
              >
                <User className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Sign In / Register</span>
              </button>
            )}

            <Link
              href={`/store/${store.slug}/cart`}
              className="p-2 hover:opacity-80 transition-opacity relative"
              style={{ 
                color: theme.layout.headerStyle === 'bold' ? 'white' : theme.colors.foreground 
              }}
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ backgroundColor: theme.colors.accent }}
                >
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ 
                color: theme.layout.headerStyle === 'bold' ? 'white' : theme.colors.foreground 
              }}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t space-y-3" style={{ borderColor: theme.colors.border }}>
            <nav className="space-y-1">
              <Link
                href={`/store/${store.slug}`}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 hover:bg-opacity-10 hover:bg-black rounded font-medium text-sm"
                style={{ 
                  color: theme.layout.headerStyle === 'bold' ? 'white' : theme.colors.foreground 
                }}
              >
                Home
              </Link>
              <Link
                href={`/store/${store.slug}/products`}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 hover:bg-opacity-10 hover:bg-black rounded font-medium text-sm"
                style={{ 
                  color: theme.layout.headerStyle === 'bold' ? 'white' : theme.colors.foreground 
                }}
              >
                All Products
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/store/${store.slug}/category/${category.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 hover:bg-opacity-10 hover:bg-black rounded font-medium text-sm"
                  style={{ 
                    color: theme.layout.headerStyle === 'bold' ? 'white' : theme.colors.foreground 
                  }}
                >
                  {category.name}
                </Link>
              ))}
            </nav>

            {/* Mobile Customer Actions */}
            <div className="pt-2 px-4 border-t" style={{ borderColor: theme.colors.border }}>
              {customer ? (
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false)
                      openOrdersModal()
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg text-sm font-semibold bg-gray-100 hover:bg-gray-200 text-gray-800"
                  >
                    <span className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{customer.name || customer.email}</span>
                    </span>
                    <Package className="w-4 h-4 text-gray-500" />
                  </button>
                  <button
                    onClick={() => {
                      logout()
                      setMobileMenuOpen(false)
                    }}
                    className="w-full flex items-center justify-center gap-2 p-2 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    openAuthModal()
                  }}
                  className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white shadow-sm flex items-center justify-center gap-2"
                  style={{ backgroundColor: theme.colors.primary }}
                >
                  <User className="w-4 h-4" />
                  <span>Customer Sign In / Register</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
