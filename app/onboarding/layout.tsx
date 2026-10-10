import { redirect } from 'next/navigation'
import { getCurrentUser, getCurrentStore } from '@/lib/auth'

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/auth/signin?callbackUrl=/onboarding')
  }

  const store = await getCurrentStore()

  // If user already has a store registered, bypass questions and go directly to portal
  if (store) {
    redirect('/dashboard')
  }

  return <>{children}</>
}
