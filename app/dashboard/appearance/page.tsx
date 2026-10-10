import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getCurrentStore } from '@/lib/auth'
import { ThemeSelector } from '@/components/theme/theme-selector'

export const metadata: Metadata = {
  title: 'Appearance Settings | BrandBloom',
  description: 'Customize your store theme and appearance',
}

export default async function AppearancePage() {
  const store = await getCurrentStore()

  if (!store) {
    redirect('/onboarding')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Appearance</h1>
        <p className="text-gray-600 mt-2">
          Customize your store's look and feel with themes
        </p>
      </div>

      <ThemeSelector
        storeId={store.id}
        storeSlug={store.slug}
        currentTheme={store.theme || 'modern'}
      />
    </div>
  )
}
