import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { getTheme } from '@/lib/themes'
import { StorefrontThemeProvider } from '@/components/theme/storefront-theme-provider'
import { StorefrontHeader } from '@/components/storefront/storefront-header'
import { StorefrontFooter } from '@/components/storefront/storefront-footer'
import { ProductDetail } from '@/components/storefront/product-detail'
import { CartProvider } from '@/components/cart/cart-provider'
import { serializeDecimal } from '@/lib/utils'

interface ProductPageProps {
  params: Promise<{ slug: string; productSlug: string }>
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

async function getProduct(storeId: string, productSlug: string) {
  const product = await prisma.product.findFirst({
    where: {
      storeId,
      slug: productSlug,
      isActive: true,
    },
    include: {
      images: {
        orderBy: { sortOrder: 'asc' },
      },
      category: true,
    },
  })

  return product ? serializeDecimal(product) : null
}

async function getRelatedProducts(storeId: string, categoryId: string, currentProductId: string) {
  const products = await prisma.product.findMany({
    where: {
      storeId,
      categoryId,
      isActive: true,
      id: { not: currentProductId },
      stock: { gt: 0 },
    },
    include: {
      images: {
        orderBy: { sortOrder: 'asc' },
        take: 1,
      },
      category: true,
    },
    take: 4,
  })

  return serializeDecimal(products)
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug, productSlug } = await params
  const store = await getStoreBySlug(slug)

  if (!store) {
    return {
      title: 'Product Not Found',
    }
  }

  const product = await getProduct(store.id, productSlug)

  if (!product) {
    return {
      title: 'Product Not Found',
    }
  }

  return {
    title: `${product.name} - ${store.name}`,
    description: product.description || `Buy ${product.name} at ${store.name}`,
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug, productSlug } = await params
  const store = await getStoreBySlug(slug)

  if (!store) {
    notFound()
  }

  const product = await getProduct(store.id, productSlug)

  if (!product) {
    notFound()
  }

  const theme = getTheme(store.theme || 'modern')
  const relatedProducts = product.categoryId
    ? await getRelatedProducts(store.id, product.categoryId, product.id)
    : []

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
            <ProductDetail
              product={product}
              relatedProducts={relatedProducts}
              storeSlug={store.slug}
              theme={theme}
            />
          </main>

          <StorefrontFooter store={store} theme={theme} />
        </div>
      </CartProvider>
    </StorefrontThemeProvider>
  )
}
