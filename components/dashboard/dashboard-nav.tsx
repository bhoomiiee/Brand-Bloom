'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Palette, 
  Settings, 
  FileText, 
  MessageSquare, 
  BarChart3, 
  Sparkles
} from 'lucide-react'

import { BotanicalSidebarBranch } from '@/components/ui/botanical-decorations'

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Products', href: '/dashboard/products', icon: Package },
  { name: 'Orders', href: '/dashboard/orders', icon: ShoppingCart },
  { name: 'Appearance', href: '/dashboard/appearance', icon: Palette },
  { name: 'Content', href: '/dashboard/content', icon: FileText },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Store Assistant', href: '/dashboard/chatbot', icon: MessageSquare },
  { name: 'BloomPilot AI', href: '/dashboard/bloompilot', icon: Sparkles },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full justify-between relative">
      {/* Navigation Links */}
      <nav className="space-y-1.5 relative z-10">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[#F1D9DF] text-[#632D40] font-semibold shadow-xs ring-1 ring-[#BD7C91]/30'
                  : 'text-[#3D202B] hover:bg-[#F1D9DF]/40 hover:text-[#632D40]'
              }`}
            >
              <Icon 
                className={`h-4.5 w-4.5 transition-colors ${
                  isActive 
                    ? 'text-[#632D40]' 
                    : 'text-[#806B73] group-hover:text-[#632D40]'
                }`} 
              />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Botanical Branch at Sidebar Bottom */}
      <div className="mt-8 pt-4 relative">
        <BotanicalSidebarBranch className="w-full max-w-[210px] mx-auto pointer-events-none" />
      </div>
    </div>
  )
}
