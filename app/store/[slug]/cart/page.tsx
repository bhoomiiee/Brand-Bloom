import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { getTheme } from '@/lib/themes'
import { StorefrontLayout } from '@/components/storefront/storefront-layout'
import { CartPage } from '@/components/cart/cart-page'

interface CartPageProps {
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

export async function generateMetadata({ params }: CartPageProps): Promise<Metadata> {
  const { slug } = await params
  const store = await getStoreBySlug(slug)

  if (!store) {
    return {
      title: 'Cart Not Found',
    }
  }

  return {
    title: `Shopping Cart - ${store.name}`,
    description: `Review your cart at ${store.name}`,
  }
}

export default async function Cart({ params }: CartPageProps) {
  const { slug } = await params
  const store = await getStoreBySlug(slug)

  if (!store) {
    notFound()
  }

  const theme = getTheme(store.theme || 'modern')

  return (
    <StorefrontLayout store={store} theme={theme}>
      <CartPage storeSlug={store.slug} theme={theme} />
    </StorefrontLayout>
  )
}
