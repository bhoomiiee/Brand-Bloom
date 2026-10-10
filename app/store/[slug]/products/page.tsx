import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { getTheme } from '@/lib/themes'
import { StorefrontThemeProvider } from '@/components/theme/storefront-theme-provider'
import { StorefrontHeader } from '@/components/storefront/storefront-header'
import { StorefrontFooter } from '@/components/storefront/storefront-footer'
import { ProductList } from '@/components/storefront/product-list'
import { CartProvider } from '@/components/cart/cart-provider'
import { serializeDecimal } from '@/lib/utils'

interface ProductsPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ category?: string; search?: string; sort?: string }>
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

async function getProducts(
  storeId: string,
  filters: { category?: string; search?: string; sort?: string }
) {
  const where: any = {
    storeId,
    isActive: true,
  }

  if (filters.category) {
    where.category = {
      slug: filters.category,
    }
  }

  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
    ]
  }

  let orderBy: any = { createdAt: 'desc' }

  if (filters.sort === 'price-asc') {
    orderBy = { price: 'asc' }
  } else if (filters.sort === 'price-desc') {
    orderBy = { price: 'desc' }
  } else if (filters.sort === 'name') {
    orderBy = { name: 'asc' }
  }

  const products = await prisma.product.findMany({
    where,
    include: {
      images: {
        orderBy: { sortOrder: 'asc' },
        take: 1,
      },
      category: true,
    },
    orderBy,
  })

  return serializeDecimal(products)
}

export async function generateMetadata({ params }: ProductsPageProps): Promise<Metadata> {
  const { slug } = await params
  const store = await getStoreBySlug(slug)

  if (!store) {
    return {
      title: 'Products Not Found',
    }
  }

  return {
    title: `Products - ${store.name}`,
    description: `Browse all products at ${store.name}`,
  }
}

export default async function ProductsPage({ params, searchParams }: ProductsPageProps) {
  const { slug } = await params
  const filters = await searchParams
  
  const store = await getStoreBySlug(slug)

  if (!store) {
    notFound()
  }

  const theme = getTheme(store.theme || 'modern')
  const products = await getProducts(store.id, filters)

  return (
    <StorefrontThemeProvider theme={theme}>
      <CartProvider storeSlug={store.slug}>
        <div className="min-h-screen flex flex-col">
          <StorefrontHeader
            store={store}
            theme={theme}
            categories={store.categories}
          />

          <main className="flex-1">
            <div className="max-w-7xl mx-auto px-4 py-8">
              <h1
                className="text-4xl font-bold mb-8 theme-font-heading"
                style={{ color: theme.colors.foreground }}
              >
                All Products
              </h1>

              <ProductList
                products={products}
                categories={store.categories}
                storeSlug={store.slug}
                theme={theme}
                filters={filters}
              />
            </div>
          </main>

          <StorefrontFooter store={store} theme={theme} />
        </div>
      </CartProvider>
    </StorefrontThemeProvider>
  )
}
