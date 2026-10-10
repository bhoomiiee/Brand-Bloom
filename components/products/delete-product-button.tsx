'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

interface DeleteProductButtonProps {
  productId: string
  productName: string
}

export function DeleteProductButton({ productId, productName }: DeleteProductButtonProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete product')
      }

      router.push('/dashboard/products')
      router.refresh()
    } catch (error) {
      console.error('Failed to delete product:', error)
      alert('Failed to delete product')
    } finally {
      setIsDeleting(false)
      setShowConfirm(false)
    }
  }

  if (showConfirm) {
    return (
      <div className="flex items-center gap-3">
        <p className="text-sm text-gray-600">
          Delete <strong>{productName}</strong>?
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowConfirm(false)}
          disabled={isDeleting}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-red-600 border-red-600 hover:bg-red-50"
        >
          {isDeleting ? 'Deleting...' : 'Confirm Delete'}
        </Button>
      </div>
    )
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => setShowConfirm(true)}
      className="text-red-600 border-red-600 hover:bg-red-50"
    >
      <Trash2 className="h-4 w-4 mr-2" />
      Delete Product
    </Button>
  )
}
