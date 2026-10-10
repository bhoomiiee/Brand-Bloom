import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUser, getCurrentStore } from '@/lib/auth'
import { DashboardNav } from '@/components/dashboard/dashboard-nav'
import { HeaderLogout } from '@/components/dashboard/header-logout'
import { Store, ExternalLink } from 'lucide-react'
import { 
  BotanicalHeaderLeaves, 
  BotanicalCornerFloral, 
  BotanicalFooterBanner 
} from '@/components/ui/botanical-decorations'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/auth/signin')
  }

  const store = await getCurrentStore()

  // If user has no store, redirect to onboarding
  if (!store) {
    redirect('/onboarding')
  }

  return (
    <div className="min-h-screen bg-[#F8F2F0] text-[#3D202B] flex flex-col">
      {/* Header with Botanical Leaves in Top-Right */}
      <header className="bg-white/95 backdrop-blur-md border-b border-[#E8DDE0] sticky top-0 z-40 shadow-xs relative">
        <BotanicalHeaderLeaves className="absolute right-0 top-0 hidden md:block" />

        <div className="flex items-center justify-between px-6 py-3.5 relative z-10">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#632D40] rounded-xl flex items-center justify-center shadow-xs">
                <Store className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-base text-[#3D202B] leading-tight">{store.name}</h1>
                <p className="text-[11px] font-medium text-[#806B73]">Store Dashboard</p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/store/${store.slug}`}
              target="_blank"
              className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-[#632D40] hover:bg-[#F1D9DF]/60 bg-white border border-[#E8DDE0] rounded-xl transition-all shadow-2xs"
            >
              <ExternalLink className="h-3.5 w-3.5 text-[#BD7C91]" />
              <span>View Store</span>
            </Link>
            
            <div className="flex items-center gap-2 pl-2 border-l border-[#E8DDE0]">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-[#3D202B]">{user.name}</p>
                <p className="text-[10px] text-[#806B73]">{user.email}</p>
              </div>
              <div className="w-8 h-8 bg-[#632D40] rounded-full flex items-center justify-center text-white text-xs font-bold shadow-2xs">
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>

            <HeaderLogout />
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-[#E8DDE0] min-h-[calc(100vh-65px)] p-5 relative flex flex-col justify-between flex-shrink-0">
          <DashboardNav />
        </aside>

        {/* Main Canvas with Warm Background and Botanical Accents */}
        <main className="flex-1 p-6 md:p-8 relative overflow-hidden bg-[#F8F2F0] bg-botanical-glow flex flex-col justify-between">
          {/* Subtle Corner Floral Aura */}
          <BotanicalCornerFloral 
            position="top-right" 
            className="absolute -top-6 -right-6 hidden lg:block opacity-40 z-0" 
          />

          <div className="relative z-10 flex-1">
            {children}
          </div>

          {/* Decorative Flowing Botanical Footer */}
          <div className="mt-12 -mx-6 md:-mx-8 -mb-6 md:-mb-8 pt-6 relative z-0">
            <BotanicalFooterBanner />
            <div className="bg-white/70 backdrop-blur-xs border-t border-[#E8DDE0] py-3 px-8 text-center text-xs text-[#806B73] flex items-center justify-between">
              <span className="font-semibold text-[#632D40]">BrandBloom</span>
              <span>Botanical E-Commerce Platform</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
