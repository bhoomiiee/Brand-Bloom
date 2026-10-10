import { ReactNode } from 'react'
import { Store, Category } from '@prisma/client'
import { ThemeConfig } from '@/lib/themes'
import { StorefrontThemeProvider } from '@/components/theme/storefront-theme-provider'
import { CartProvider } from '@/components/cart/cart-provider'
import { StorefrontHeader } from './storefront-header'
import { StorefrontFooter } from './storefront-footer'

import { CustomerProvider } from './customer-provider'
import { CustomerAuthModal } from './customer-auth-modal'
import { CustomerOrdersModal } from './customer-orders-modal'

interface StorefrontLayoutProps {
  store: Store & { categories: Category[] }
  theme: ThemeConfig
  children: ReactNode
}

export function StorefrontLayout({ store, theme, children }: StorefrontLayoutProps) {
  const banner = (store as any).siteContent?.find((c: any) => c.key === 'announcement_banner')?.value

  return (
    <StorefrontThemeProvider theme={theme}>
      <CustomerProvider storeId={store.id} storeSlug={store.slug}>
        <CartProvider storeSlug={store.slug}>
          <div className="min-h-screen flex flex-col">
            {banner && (
              <div className="bg-gradient-to-r from-[#632D40] via-[#BD7C91] to-[#632D40] text-white text-xs font-semibold py-2.5 px-4 text-center tracking-wide flex items-center justify-center gap-2 border-b border-[#BD7C91]/40 shadow-xs animate-in fade-in duration-300">
                <span>{banner}</span>
              </div>
            )}
            <StorefrontHeader
              store={store}
              theme={theme}
              categories={store.categories}
            />

            <main className="flex-1">
              {children}
            </main>

            <StorefrontFooter
              store={store}
              theme={theme}
            />

            {/* Customer Modals */}
            <CustomerAuthModal storeName={store.name} theme={theme} />
            <CustomerOrdersModal storeSlug={store.slug} theme={theme} />
          </div>
        </CartProvider>
      </CustomerProvider>
    </StorefrontThemeProvider>
  )
}
