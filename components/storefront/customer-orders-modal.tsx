'use client'

import { X, Package, Clock, CheckCircle2, ShoppingBag, ExternalLink } from 'lucide-react'
import { ThemeConfig } from '@/lib/themes'
import { formatCurrency } from '@/lib/utils'
import { useCustomer } from './customer-provider'
import Link from 'next/link'

interface CustomerOrdersModalProps {
  storeSlug: string
  theme: ThemeConfig
}

export function CustomerOrdersModal({ storeSlug, theme }: CustomerOrdersModalProps) {
  const { customer, isOrdersModalOpen, closeOrdersModal, logout } = useCustomer()

  if (!isOrdersModalOpen || !customer) return null

  const orders = customer.orders || []

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[85vh]"
        style={{ fontFamily: theme.fonts?.body }}
      >
        {/* Header */}
        <div 
          className="p-5 text-white flex items-center justify-between"
          style={{ backgroundColor: theme.colors.primary }}
        >
          <div>
            <h3 className="text-lg font-bold">My Customer Account</h3>
            <p className="text-xs text-white/80 mt-0.5">
              Logged in as <span className="font-semibold text-white">{customer.name || customer.email}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={closeOrdersModal}
            className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Account Info Pill */}
        <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between text-xs text-gray-600">
          <div>
            <span>Email: <strong>{customer.email}</strong></span>
            {customer.phone && <span className="ml-3">Phone: <strong>{customer.phone}</strong></span>}
          </div>
          <button
            type="button"
            onClick={() => {
              logout()
              closeOrdersModal()
            }}
            className="text-xs font-semibold text-red-600 hover:text-red-700 hover:underline"
          >
            Sign Out
          </button>
        </div>

        {/* Orders List */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4 text-gray-500" />
              Order History ({orders.length})
            </h4>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-10 px-4 border border-dashed border-gray-200 rounded-xl">
              <Package className="w-10 h-10 mx-auto text-gray-300 mb-2" />
              <p className="text-sm font-medium text-gray-700">No orders placed yet</p>
              <p className="text-xs text-gray-400 mt-1">
                Your future orders will appear here automatically.
              </p>
            </div>
          ) : (
            orders.map((order) => (
              <div 
                key={order.id} 
                className="p-4 rounded-xl border border-gray-100 hover:border-gray-300 bg-white shadow-xs transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-gray-800">
                    {order.orderNumber}
                  </span>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    order.status === 'DELIVERED' 
                      ? 'bg-green-100 text-green-700' 
                      : order.status === 'SHIPPED'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(order.createdAt).toLocaleDateString(undefined, { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </span>
                  <span className="font-bold text-gray-900 text-sm">
                    {formatCurrency(order.total)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <Link
            href={`/store/${storeSlug}/products`}
            onClick={closeOrdersModal}
            className="text-xs font-semibold text-gray-700 hover:text-black flex items-center gap-1"
          >
            Continue Shopping
          </Link>
          <button
            type="button"
            onClick={closeOrdersModal}
            className="px-4 py-2 text-xs font-semibold bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
