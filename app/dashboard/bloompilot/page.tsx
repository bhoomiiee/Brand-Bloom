import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getCurrentStore, getCurrentUser } from '@/lib/auth'
import { BloomPilotInterface } from '@/components/bloompilot/bloompilot-interface'
import { Sparkles } from 'lucide-react'
import { BotanicalCornerFloral } from '@/components/ui/botanical-decorations'

export const metadata: Metadata = {
  title: 'BloomPilot | BrandBloom',
  description: 'AI-powered business growth assistant',
}

export default async function BloomPilotPage() {
  const [store, user] = await Promise.all([
    getCurrentStore(),
    getCurrentUser(),
  ])

  if (!store || !user) {
    redirect('/onboarding')
  }

  return (
    <div className="h-[calc(100vh-9.5rem)] relative flex flex-col">
      {/* Botanical Corner Accent for AI Page */}
      <BotanicalCornerFloral position="top-right" className="absolute -top-6 -right-6 opacity-30 pointer-events-none" />

      <div className="mb-5 relative z-10">
        <div className="flex items-center gap-3 mb-1.5">
          <div className="h-10 w-10 rounded-2xl bg-[#632D40] flex items-center justify-center shadow-xs">
            <Sparkles className="text-white h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-[#3D202B]">BloomPilot AI</h1>
            <p className="text-xs font-semibold text-[#806B73]">Your AI business growth advisor</p>
          </div>
        </div>
        <p className="text-xs text-[#806B73] max-w-2xl">
          BloomPilot analyzes store orders, traffic, and inventory to suggest smart improvements, pricing optimizations, and promotions.
        </p>
      </div>

      <div className="flex-1 min-h-0 relative z-10">
        <BloomPilotInterface storeId={store.id} storeName={store.name} />
      </div>
    </div>
  )
}
