import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentStore } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Card } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { Users, Mail, Phone, ShoppingBag } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Customers | BrandBloom',
  description: 'Manage your customers',
}

async function getCustomers(storeId: string) {
  const customers = await prisma.customer.findMany({
    where: { storeId },
    include: {
      orders: {
        select: {
          total: true,
          createdAt: true,
        },
      },
      _count: {
        select: { orders: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  // Calculate lifetime value for each customer
  const customersWithLTV = customers.map((customer) => ({
    ...customer,
    lifetimeValue: customer.orders.reduce((sum, order) => sum + Number(order.total), 0),
    lastOrderDate: customer.orders.length > 0
      ? customer.orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0].createdAt
      : null,
  }))

  return customersWithLTV
}

export default async function CustomersPage() {
  const store = await getCurrentStore()

  if (!store) {
    redirect('/onboarding')
  }

  const customers = await getCustomers(store.id)

  const totalCustomers = customers.length
  const totalLifetimeValue = customers.reduce((sum, c) => sum + c.lifetimeValue, 0)
  const averageLifetimeValue = totalCustomers > 0 ? totalLifetimeValue / totalCustomers : 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-[#3D202B]">Customers</h1>
        <p className="text-sm font-medium text-[#806B73] mt-1">
          Manage and view your store's customer base and shopper insights
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-6 rounded-2xl bg-white border border-[#E8DDE0] shadow-2xs">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#F1D9DF] flex items-center justify-center text-[#632D40]">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#806B73] mb-1">Total Customers</p>
          <p className="text-3xl font-extrabold text-[#3D202B]">{totalCustomers}</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#E8DDE0] shadow-2xs">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#F1D9DF] flex items-center justify-center text-[#BD7C91]">
              <ShoppingBag className="h-5 w-5" />
            </div>
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#806B73] mb-1">Total Lifetime Value</p>
          <p className="text-3xl font-extrabold text-[#3D202B]">{formatCurrency(totalLifetimeValue)}</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#E8DDE0] shadow-2xs">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#F1D9DF] flex items-center justify-center text-[#632D40]">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#806B73] mb-1">Average Customer Value</p>
          <p className="text-3xl font-extrabold text-[#3D202B]">{formatCurrency(averageLifetimeValue)}</p>
        </div>
      </div>

      {/* Customers Table */}
      <div className="p-6 rounded-2xl bg-white border border-[#E8DDE0] shadow-2xs">
        <h2 className="text-lg font-bold text-[#3D202B] mb-5">All Customers</h2>

        {customers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E8DDE0] text-xs font-bold text-[#806B73] uppercase tracking-wider">
                  <th className="text-left py-3.5 px-4">Customer</th>
                  <th className="text-left py-3.5 px-4">Contact</th>
                  <th className="text-left py-3.5 px-4">Orders</th>
                  <th className="text-left py-3.5 px-4">Lifetime Value</th>
                  <th className="text-left py-3.5 px-4">Last Order</th>
                  <th className="text-left py-3.5 px-4">Joined</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} className="border-b border-[#E8DDE0] last:border-0 hover:bg-[#F8F2F0] transition-colors">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-bold text-[#3D202B]">
                          {customer.name || customer.email.split('@')[0]}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-[#806B73]">
                          <Mail className="h-3.5 w-3.5 text-[#BD7C91]" />
                          {customer.email}
                        </div>
                        {customer.phone && (
                          <div className="flex items-center gap-2 text-xs text-[#806B73]">
                            <Phone className="h-3.5 w-3.5 text-[#BD7C91]" />
                            {customer.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-3 py-1 bg-[#F1D9DF] text-[#632D40] rounded-full text-xs font-bold border border-[#BD7C91]/30">
                        {customer._count.orders}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-extrabold text-[#3D202B]">
                        {formatCurrency(customer.lifetimeValue)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-xs text-[#806B73]">
                      {customer.lastOrderDate
                        ? new Date(customer.lastOrderDate).toLocaleDateString()
                        : 'Never'}
                    </td>
                    <td className="py-4 px-4 text-xs text-[#806B73]">
                      {new Date(customer.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 text-[#806B73]">
            <Users className="h-14 w-14 mx-auto mb-3 text-[#BD7C91] opacity-35" />
            <p className="text-base font-bold text-[#3D202B] mb-1">No customers yet</p>
            <p className="text-xs">
              Registered customers and buyers will appear here automatically
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
