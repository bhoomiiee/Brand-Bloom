'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { Store } from '@prisma/client'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Save, Store as StoreIcon, Mail, Phone, MapPin, LogOut, User as UserIcon } from 'lucide-react'
import { BotanicalCardAccent } from '@/components/ui/botanical-decorations'

interface StoreSettingsProps {
  store: Store
  user?: {
    name?: string | null
    email?: string | null
  }
}

export function StoreSettings({ store, user }: StoreSettingsProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [formData, setFormData] = useState({
    name: store.name,
    slug: store.slug,
    businessType: store.businessType || '',
    email: store.email || '',
    phone: store.phone || '',
    address: store.address || '',
    city: (store as any).city || '',
    state: (store as any).state || '',
    zipCode: (store as any).zipCode || '',
    country: (store as any).country || 'India',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/store/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to update settings')
      }

      alert('Settings updated successfully!')
      router.refresh()
    } catch (error: any) {
      alert(error.message || 'Failed to update settings')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    if (confirm('Are you sure you want to log out of your store account?')) {
      setIsLoggingOut(true)
      await signOut({ callbackUrl: '/auth/signin' })
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Store Information */}
        <div className="p-6 rounded-2xl bg-white border border-[#E8DDE0] shadow-2xs relative overflow-hidden">
          <BotanicalCardAccent className="opacity-25" />
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-[#F1D9DF] flex items-center justify-center text-[#632D40]">
              <StoreIcon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#3D202B]">Store Information</h2>
              <p className="text-xs text-[#806B73]">Basic identity and business settings</p>
            </div>
          </div>

          <div className="space-y-4 relative z-10">
            <div>
              <Label htmlFor="name" className="text-xs font-semibold text-[#3D202B]">Store Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="mt-1 border-[#E8DDE0] rounded-xl focus:ring-[#632D40]/30"
              />
            </div>

            <div>
              <Label htmlFor="slug" className="text-xs font-semibold text-[#3D202B]">Store URL Slug *</Label>
              <Input
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                required
                disabled
                className="mt-1 border-[#E8DDE0] rounded-xl bg-gray-50 text-gray-500"
              />
              <p className="text-xs text-[#806B73] mt-1">
                Your store URL: <span className="font-semibold text-[#632D40]">/store/{formData.slug}</span>
                <span className="text-[#BD7C91] ml-2 font-medium">(URL slug cannot be changed)</span>
              </p>
            </div>

            <div>
              <Label htmlFor="businessType" className="text-xs font-semibold text-[#3D202B]">Business Type</Label>
              <select
                id="businessType"
                name="businessType"
                value={formData.businessType}
                onChange={handleInputChange}
                className="w-full mt-1 px-4 py-2 text-sm border border-[#E8DDE0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#632D40]/30 text-[#3D202B] bg-white"
              >
                <option value="">Select a type</option>
                <option value="FLORIST">Florist & Plant Boutique</option>
                <option value="FASHION">Fashion & Apparel</option>
                <option value="ELECTRONICS">Electronics & Tech</option>
                <option value="HOME_GARDEN">Home & Garden</option>
                <option value="FOOD_BEVERAGE">Food & Beverage</option>
                <option value="HEALTH_BEAUTY">Health & Beauty</option>
                <option value="OTHER">Other Specialty</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="p-6 rounded-2xl bg-white border border-[#E8DDE0] shadow-2xs relative overflow-hidden">
          <BotanicalCardAccent className="opacity-25" />
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-[#F1D9DF] flex items-center justify-center text-[#BD7C91]">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#3D202B]">Contact Information</h2>
              <p className="text-xs text-[#806B73]">Customer communication channels</p>
            </div>
          </div>

          <div className="space-y-4 relative z-10">
            <div>
              <Label htmlFor="email" className="text-xs font-semibold text-[#3D202B]">Contact Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="contact@yourstore.com"
                className="mt-1 border-[#E8DDE0] rounded-xl focus:ring-[#632D40]/30"
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-xs font-semibold text-[#3D202B]">Phone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+91 98765 43210"
                className="mt-1 border-[#E8DDE0] rounded-xl focus:ring-[#632D40]/30"
              />
            </div>
          </div>
        </div>

        {/* Business Address */}
        <div className="p-6 rounded-2xl bg-white border border-[#E8DDE0] shadow-2xs relative overflow-hidden">
          <BotanicalCardAccent className="opacity-25" />
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-[#F1D9DF] flex items-center justify-center text-[#632D40]">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#3D202B]">Business Address</h2>
              <p className="text-xs text-[#806B73]">Store location and delivery dispatch point</p>
            </div>
          </div>

          <div className="space-y-4 relative z-10">
            <div>
              <Label htmlFor="address" className="text-xs font-semibold text-[#3D202B]">Street Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="123 Botanical Avenue"
                className="mt-1 border-[#E8DDE0] rounded-xl focus:ring-[#632D40]/30"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city" className="text-xs font-semibold text-[#3D202B]">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Bangalore"
                  className="mt-1 border-[#E8DDE0] rounded-xl focus:ring-[#632D40]/30"
                />
              </div>

              <div>
                <Label htmlFor="state" className="text-xs font-semibold text-[#3D202B]">State/Province</Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="Karnataka"
                  className="mt-1 border-[#E8DDE0] rounded-xl focus:ring-[#632D40]/30"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="zipCode" className="text-xs font-semibold text-[#3D202B]">ZIP/Postal Code</Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  placeholder="560001"
                  className="mt-1 border-[#E8DDE0] rounded-xl focus:ring-[#632D40]/30"
                />
              </div>

              <div>
                <Label htmlFor="country" className="text-xs font-semibold text-[#3D202B]">Country</Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="India"
                  className="mt-1 border-[#E8DDE0] rounded-xl focus:ring-[#632D40]/30"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end">
          <button 
            type="submit" 
            disabled={isLoading}
            className="px-6 py-2.5 rounded-xl font-semibold text-xs text-white bg-[#632D40] hover:bg-[#632D40]/90 transition-all flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{isLoading ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>

      {/* Account & Session Management */}
      <div className="p-6 rounded-2xl bg-white border border-[#E8DDE0] shadow-2xs relative overflow-hidden">
        <BotanicalCardAccent className="opacity-25" />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-[#3D202B] flex items-center gap-2">
              <LogOut className="h-4.5 w-4.5 text-[#BD7C91]" />
              Account & Session
            </h2>
            <p className="text-xs text-[#806B73]">
              {user?.email ? (
                <>
                  Signed in as <span className="font-bold text-[#3D202B]">{user.name || user.email}</span> ({user.email})
                </>
              ) : (
                'Log out of your BrandBloom owner account.'
              )}
            </p>
            <p className="text-[11px] text-[#806B73]">
              Logging out will end your active session and return you to the sign-in / registration screen.
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="border border-[#BD7C91]/40 text-[#632D40] hover:bg-[#F1D9DF]/40 font-semibold text-xs px-4 py-2 rounded-xl self-start sm:self-auto shrink-0 transition-colors flex items-center gap-2 cursor-pointer shadow-2xs"
          >
            <LogOut className="h-3.5 w-3.5 text-[#BD7C91]" />
            <span>{isLoggingOut ? 'Logging out...' : 'Log Out'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
