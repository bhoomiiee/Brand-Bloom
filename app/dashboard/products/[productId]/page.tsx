import { Metadata } from 'next'
import { redirect, notFound } from 'next/navigation'
import { getCurrentStore } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { ProductForm } from '@/components/products/product-form'
import { DeleteProductButton } from '@/components/products/delete-product-button'
import { serializeDecimal } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Edit Product | BrandBloom',
  description: 'Edit product details',
}

async function getProduct(productId: string, storeId: string) {
  const product = await prisma.product.findFirst({
    where: {
      id: productId,
      storeId,
    },
    include: {
      images: {
        orderBy: { sortOrder: 'asc' },
      },
      category: true,
    },
  })

  if (!product) return null

  return serializeDecimal(product)
}

async function getCategories(storeId: string) {
  const categories = await prisma.category.findMany({
    where: { storeId },
    orderBy: { name: 'asc' },
  })

  return categories
}

interface ProductEditPageProps {
  params: Promise<{ productId: string }>
}

export default async function ProductEditPage({ params }: ProductEditPageProps) {
  const { productId } = await params
  const store = await getCurrentStore()

  if (!store) {
    redirect('/onboarding')
  }

  const [product, categories] = await Promise.all([
    getProduct(productId, store.id),
    getCategories(store.id),
  ])

  if (!product) {
    notFound()
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Edit Product</h1>
          <p className="text-gray-600 mt-2">
            Update product information and inventory
          </p>
        </div>
        <DeleteProductButton productId={product.id} productName={product.name} />
      </div>

      <ProductForm storeId={store.id} categories={categories} product={product} />
    </div>
  )
}
