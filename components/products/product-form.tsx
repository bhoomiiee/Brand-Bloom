'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Category } from '@prisma/client'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface ProductFormProps {
  storeId: string
  categories: Category[]
  product?: any
}

export function ProductForm({ storeId, categories, product }: ProductFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    price: product?.price != null ? product.price.toString() : '',
    compareAtPrice: (product?.compareAtPrice ?? product?.comparePrice)?.toString() || '',
    cost: product?.cost != null ? product.cost.toString() : '',
    sku: product?.sku || '',
    stock: product?.stock != null ? product.stock.toString() : '0',
    categoryId: product?.categoryId || '',
    status: product?.status || (product?.isActive ? 'ACTIVE' : 'DRAFT'),
    imageUrl: product?.images?.[0]?.url || '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Auto-generate slug from name
    if (name === 'name' && !product) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      setFormData((prev) => ({ ...prev, slug }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const url = product
        ? `/api/products/${product.id}`
        : '/api/products/create'

      const method = product ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          storeId,
          price: parseFloat(formData.price),
          compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : null,
          cost: formData.cost ? parseFloat(formData.cost) : null,
          stock: parseInt(formData.stock),
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to save product')
      }

      router.push('/dashboard/products')
      router.refresh()
    } catch (error) {
      console.error('Failed to save product:', error)
      alert(error instanceof Error ? error.message : 'Failed to save product')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Basic Information</h2>

        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="e.g., Vintage Leather Jacket"
            />
          </div>

          <div>
            <Label htmlFor="slug">URL Slug *</Label>
            <Input
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              required
              placeholder="vintage-leather-jacket"
            />
            <p className="text-sm text-gray-500 mt-1">
              Used in the product URL: /store/your-store/product/{formData.slug || 'product-slug'}
            </p>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Describe your product..."
            />
          </div>

          <div>
            <Label htmlFor="categoryId">Category</Label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Pricing */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Pricing</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="price">Price (₹) *</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={handleInputChange}
              required
              placeholder="0.00"
            />
          </div>

          <div>
            <Label htmlFor="compareAtPrice">Compare at Price (₹)</Label>
            <Input
              id="compareAtPrice"
              name="compareAtPrice"
              type="number"
              step="0.01"
              min="0"
              value={formData.compareAtPrice}
              onChange={handleInputChange}
              placeholder="0.00"
            />
            <p className="text-sm text-gray-500 mt-1">
              Show as crossed-out price
            </p>
          </div>

          <div>
            <Label htmlFor="cost">Cost per Item (₹)</Label>
            <Input
              id="cost"
              name="cost"
              type="number"
              step="0.01"
              min="0"
              value={formData.cost}
              onChange={handleInputChange}
              placeholder="0.00"
            />
            <p className="text-sm text-gray-500 mt-1">
              For profit tracking
            </p>
          </div>
        </div>
      </Card>

      {/* Inventory */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Inventory</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="sku">SKU</Label>
            <Input
              id="sku"
              name="sku"
              value={formData.sku}
              onChange={handleInputChange}
              placeholder="PROD-001"
            />
          </div>

          <div>
            <Label htmlFor="stock">Stock Quantity *</Label>
            <Input
              id="stock"
              name="stock"
              type="number"
              min="0"
              value={formData.stock}
              onChange={handleInputChange}
              required
              placeholder="0"
            />
          </div>
        </div>
      </Card>

      {/* Image */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Product Image</h2>

        <div>
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input
            id="imageUrl"
            name="imageUrl"
            type="url"
            value={formData.imageUrl}
            onChange={handleInputChange}
            placeholder="https://example.com/image.jpg"
          />
          <p className="text-sm text-gray-500 mt-1">
            Paste a URL to an image (e.g., from Unsplash or your image hosting)
          </p>
          {formData.imageUrl && (
            <div className="mt-4">
              <img
                src={formData.imageUrl}
                alt="Preview"
                className="w-48 h-48 object-cover rounded border"
              />
            </div>
          )}
        </div>
      </Card>

      {/* Status */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Status</h2>

        <div>
          <Label htmlFor="status">Product Status</Label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="DRAFT">Draft (Not visible to customers)</option>
            <option value="ACTIVE">Active (Visible and available)</option>
            <option value="ARCHIVED">Archived (Hidden from customers)</option>
          </select>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Link href="/dashboard/products">
          <Button type="button" variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </Link>
        <Button type="submit" disabled={isLoading}>
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  )
}
