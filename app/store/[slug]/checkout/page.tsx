import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { getTheme } from '@/lib/themes'
import { StorefrontLayout } from '@/components/storefront/storefront-layout'
import { CheckoutPage } from '@/components/checkout/checkout-page'

interface CheckoutPageProps {
  params: Promise<{ slug: string }>
}

async function getStoreBySlug(slug: string) {
  const store = await prisma.store.findFirst({
    where: { slug, status: 'ACTIVE' },
    include: {
      categories: {
        orderBy: { sortOrder: 'asc' },
      },
    },
  })

  return store
}

export async function generateMetadata({ params }: CheckoutPageProps): Promise<Metadata> {
  const { slug } = await params
  const store = await getStoreBySlug(slug)

  if (!store) {
    return {
      title: 'Checkout Not Found',
    }
  }

  return {
    title: `Checkout - ${store.name}`,
    description: `Complete your purchase at ${store.name}`,
  }
}

export default async function Checkout({ params }: CheckoutPageProps) {
  const { slug } = await params
  const store = await getStoreBySlug(slug)

  if (!store) {
    notFound()
  }

  const theme = getTheme(store.theme || 'modern')

  return (
    <StorefrontLayout store={store} theme={theme}>
      <CheckoutPage storeId={store.id} storeSlug={store.slug} theme={theme} />
    </StorefrontLayout>
  )
}
