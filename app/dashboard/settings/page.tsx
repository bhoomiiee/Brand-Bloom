import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getCurrentStore, getCurrentUser } from '@/lib/auth'
import { StoreSettings } from '@/components/settings/store-settings'

export const metadata: Metadata = {
  title: 'Store Settings | BrandBloom',
  description: 'Manage your store settings',
}

export default async function SettingsPage() {
  const user = await getCurrentUser()
  const store = await getCurrentStore()

  if (!store) {
    redirect('/onboarding')
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Store Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage your store configuration, profile, and preferences
        </p>
      </div>

      <StoreSettings
        store={store}
        user={user ? { name: user.name, email: user.email } : undefined}
      />
    </div>
  )
}
