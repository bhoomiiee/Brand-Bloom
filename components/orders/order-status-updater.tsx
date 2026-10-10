'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface OrderStatusUpdaterProps {
  orderId: string
  currentStatus: string
}

const STATUS_OPTIONS = [
  { value: 'PLACED', label: 'Placed', color: 'yellow' },
  { value: 'PAID', label: 'Paid', color: 'blue' },
  { value: 'PACKED', label: 'Packed', color: 'indigo' },
  { value: 'SHIPPED', label: 'Shipped', color: 'purple' },
  { value: 'DELIVERED', label: 'Delivered', color: 'green' },
  { value: 'CANCELLED', label: 'Cancelled', color: 'red' },
]

export function OrderStatusUpdater({ orderId, currentStatus }: OrderStatusUpdaterProps) {
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  const handleStatusUpdate = async (newStatus: string) => {
    if (newStatus === currentStatus) {
      setShowDropdown(false)
      return
    }

    setIsUpdating(true)

    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error('Failed to update status')
      }

      setShowDropdown(false)
      router.refresh()
    } catch (error) {
      console.error('Failed to update status:', error)
      alert('Failed to update order status')
    } finally {
      setIsUpdating(false)
    }
  }

  const currentStatusOption = STATUS_OPTIONS.find((opt) => opt.value === currentStatus)

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setShowDropdown(!showDropdown)}
        disabled={isUpdating}
      >
        Update Status: <strong className="ml-2">{currentStatusOption?.label || currentStatus}</strong>
      </Button>

      {showDropdown && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowDropdown(false)}
          />
          <Card className="absolute right-0 top-full mt-2 w-48 p-2 z-20">
            <div className="space-y-1">
              {STATUS_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleStatusUpdate(option.value)}
                  disabled={isUpdating || option.value === currentStatus}
                  className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-gray-100 transition-colors ${
                    option.value === currentStatus ? 'bg-gray-100 font-semibold' : ''
                  } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {option.label}
                  {option.value === currentStatus && ' ✓'}
                </button>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  )
}
