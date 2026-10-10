import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getCurrentStore } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { ProductForm } from '@/components/products/product-form'

export const metadata: Metadata = {
  title: 'Add Product | BrandBloom',
  description: 'Add a new product to your store',
}

async function getCategories(storeId: string) {
  const categories = await prisma.category.findMany({
    where: { storeId },
    orderBy: { name: 'asc' },
  })

  return categories
}

export default async function NewProductPage() {
  const store = await getCurrentStore()

  if (!store) {
    redirect('/onboarding')
  }

  const categories = await getCategories(store.id)

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Add New Product</h1>
        <p className="text-gray-600 mt-2">
          Create a new product for your store
        </p>
      </div>

      <ProductForm storeId={store.id} categories={categories} />
    </div>
  )
}
