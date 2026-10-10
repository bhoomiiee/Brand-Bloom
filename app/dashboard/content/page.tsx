import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getCurrentStore } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { ContentEditor } from '@/components/content/content-editor'

export const metadata: Metadata = {
  title: 'Store Content | BrandBloom',
  description: 'Customize your storefront content',
}

async function getSiteContent(storeId: string) {
  let siteContent = await prisma.siteContent.findFirst({
    where: { storeId },
  })

  // Create default site content if it doesn't exist
  if (!siteContent) {
    siteContent = await prisma.siteContent.create({
      data: {
        storeId,
        heroTitle: 'Welcome to Our Store',
        heroSubtitle: 'Discover amazing products',
        heroCta: 'Shop Now',
        heroImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop',
      },
    })
  }

  return siteContent
}

export default async function ContentPage() {
  const store = await getCurrentStore()

  if (!store) {
    redirect('/onboarding')
  }

  const siteContent = await getSiteContent(store.id)

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Store Content</h1>
        <p className="text-gray-600 mt-2">
          Customize your storefront appearance and content
        </p>
      </div>

      <ContentEditor store={store} siteContent={siteContent} />
    </div>
  )
}
