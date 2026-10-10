import { OrderEvent } from '@prisma/client'
import { CheckCircle, Clock, Package, XCircle, AlertCircle } from 'lucide-react'

interface OrderTimelineProps {
  events: OrderEvent[]
}

export function OrderTimeline({ events }: OrderTimelineProps) {
  const getEventIcon = (status: string) => {
    switch (status) {
      case 'PLACED':
      case 'CREATED':
        return <Clock className="h-5 w-5 text-blue-600" />
      case 'PAID':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'PACKED':
      case 'PROCESSING':
        return <Package className="h-5 w-5 text-purple-600" />
      case 'SHIPPED':
        return <Package className="h-5 w-5 text-blue-600" />
      case 'DELIVERED':
      case 'COMPLETED':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'CANCELLED':
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />
    }
  }

  const getEventLabel = (status: string) => {
    switch (status) {
      case 'PLACED':
      case 'CREATED':
        return 'Order Placed'
      case 'PAID':
        return 'Payment Received'
      case 'PACKED':
        return 'Order Packed'
      case 'PROCESSING':
        return 'Processing Started'
      case 'SHIPPED':
        return 'Order Shipped'
      case 'DELIVERED':
      case 'COMPLETED':
        return 'Order Delivered'
      case 'CANCELLED':
        return 'Order Cancelled'
      case 'NOTE':
        return 'Note Added'
      default:
        return status
    }
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No events yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {events.map((event, index) => {
        const eventStatus = event.newStatus || (event as any).type || 'PLACED'
        const eventNotes = event.notes || (event as any).note

        return (
          <div key={event.id} className="flex gap-4">
            {/* Icon */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                {getEventIcon(eventStatus)}
              </div>
              {index < events.length - 1 && (
                <div className="w-0.5 h-full bg-gray-200 mt-2" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pb-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{getEventLabel(eventStatus)}</h3>
                  {eventNotes && (
                    <p className="text-sm text-gray-600 mt-1">{eventNotes}</p>
                  )}
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(event.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
