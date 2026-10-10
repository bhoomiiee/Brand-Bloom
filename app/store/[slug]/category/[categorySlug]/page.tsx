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

interface CategoryPageProps {
  params: Promise<{ slug: string; categorySlug: string }>
  searchParams: Promise<{ search?: string; sort?: string }>
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

async function getCategoryProducts(
  storeId: string,
  categorySlug: string,
  filters: { search?: string; sort?: string }
) {
  const category = await prisma.category.findFirst({
    where: {
      storeId,
      slug: categorySlug,
    },
  })

  if (!category) {
    return null
  }

  const where: any = {
    storeId,
    categoryId: category.id,
    isActive: true,
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

  return { category, products: serializeDecimal(products) }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug, categorySlug } = await params
  const store = await getStoreBySlug(slug)

  if (!store) {
    return {
      title: 'Category Not Found',
    }
  }

  const result = await getCategoryProducts(store.id, categorySlug, {})

  if (!result) {
    return {
      title: 'Category Not Found',
    }
  }

  return {
    title: `${result.category.name} - ${store.name}`,
    description: result.category.description || `Shop ${result.category.name} at ${store.name}`,
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug, categorySlug } = await params
  const filters = await searchParams

  const store = await getStoreBySlug(slug)

  if (!store) {
    notFound()
  }

  const result = await getCategoryProducts(store.id, categorySlug, filters)

  if (!result) {
    notFound()
  }

  const { category, products } = result
  const theme = getTheme(store.theme || 'modern')

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
              {/* Category Header */}
              <div className="mb-8">
                <h1
                  className="text-4xl font-bold mb-2 theme-font-heading"
                  style={{ color: theme.colors.foreground }}
                >
                  {category.name}
                </h1>
                {category.description && (
                  <p className="text-lg" style={{ color: theme.colors.foreground, opacity: 0.7 }}>
                    {category.description}
                  </p>
                )}
              </div>

              <ProductList
                products={products}
                categories={store.categories}
                storeSlug={store.slug}
                theme={theme}
                filters={{ ...filters, category: categorySlug }}
              />
            </div>
          </main>

          <StorefrontFooter store={store} theme={theme} />
        </div>
      </CartProvider>
    </StorefrontThemeProvider>
  )
}
