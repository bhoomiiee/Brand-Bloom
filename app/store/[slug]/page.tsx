import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { getTheme } from '@/lib/themes'
import { StorefrontLayout } from '@/components/storefront/storefront-layout'
import { StorefrontHero } from '@/components/storefront/storefront-hero'
import { FeaturedProducts } from '@/components/storefront/featured-products'
import { CategoryGrid } from '@/components/storefront/category-grid'

interface StorePageProps {
  params: Promise<{ slug: string }>
}

async function getStoreBySlug(slug: string) {
  const store = await prisma.store.findFirst({
    where: { slug, status: 'ACTIVE' },
    include: {
      siteContent: true,
      categories: {
        orderBy: { sortOrder: 'asc' },
      },
    },
  })

  return store
}

async function getFeaturedProducts(storeId: string, limit: number = 8) {
  const products = await prisma.product.findMany({
    where: {
      storeId,
      isActive: true,
      stock: { gt: 0 },
    },
    include: {
      images: {
        orderBy: { sortOrder: 'asc' },
        take: 1,
      },
      category: true,
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })

  return products
}

export async function generateMetadata({ params }: StorePageProps): Promise<Metadata> {
  const { slug } = await params
  const store = await getStoreBySlug(slug)

  if (!store) {
    return {
      title: 'Store Not Found',
    }
  }

  return {
    title: `${store.name} - Online Store`,
    description: store.description || `Shop at ${store.name}`,
  }
}

export default async function StorePage({ params }: StorePageProps) {
  const { slug } = await params
  const store = await getStoreBySlug(slug)

  if (!store) {
    notFound()
  }

  const theme = getTheme(store.theme || 'modern')
  const products = await getFeaturedProducts(store.id)
  const siteContent = store.siteContent

  return (
    <StorefrontLayout store={store} theme={theme}>
      <StorefrontHero 
        store={store}
        siteContent={siteContent}
        theme={theme}
      />

      {store.categories.length > 0 && (
        <CategoryGrid 
          categories={store.categories}
          storeSlug={store.slug}
          theme={theme}
        />
      )}

      {products.length > 0 && (
        <FeaturedProducts 
          products={products}
          storeSlug={store.slug}
          theme={theme}
        />
      )}

      {/* Empty State */}
      {products.length === 0 && (
        <div className="py-20 text-center">
          <h2 className="text-2xl font-bold mb-2">No Products Yet</h2>
          <p className="text-gray-600">
            This store is still being set up. Check back soon!
          </p>
        </div>
      )}
    </StorefrontLayout>
  )
}
