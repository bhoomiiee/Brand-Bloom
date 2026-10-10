import Link from 'next/link'
import { Store } from '@prisma/client'
import { ThemeConfig } from '@/lib/themes'
import { Mail, Phone } from 'lucide-react'

interface StorefrontFooterProps {
  store: Store
  theme: ThemeConfig
}

export function StorefrontFooter({ store, theme }: StorefrontFooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer
      className="border-t mt-auto"
      style={{
        backgroundColor: theme.colors.foreground,
        borderColor: theme.colors.border,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Store Info */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-white theme-font-heading">
              {store.name}
            </h3>
            <p className="text-sm text-white/70 mb-4">
              {store.description || 'Your trusted online store'}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Shop</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`/store/${store.slug}/products`}
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href={`/store/${store.slug}/cart`}
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`/store/${store.slug}/about`}
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href={`/store/${store.slug}/contact`}
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href={`/store/${store.slug}/shipping`}
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link
                  href={`/store/${store.slug}/returns`}
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  Returns
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Contact</h4>
            <ul className="space-y-2">
              {store.email && (
                <li className="flex items-center gap-2 text-sm text-white/70">
                  <Mail className="h-4 w-4" />
                  <a href={`mailto:${store.email}`} className="hover:text-white transition-colors">
                    {store.email}
                  </a>
                </li>
              )}
              {store.phone && (
                <li className="flex items-center gap-2 text-sm text-white/70">
                  <Phone className="h-4 w-4" />
                  <a href={`tel:${store.phone}`} className="hover:text-white transition-colors">
                    {store.phone}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t mt-8 pt-8 text-center" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <p className="text-sm text-white/60">
            © {currentYear} {store.name}. All rights reserved. Powered by BrandBloom.
          </p>
        </div>
      </div>
    </footer>
  )
}
