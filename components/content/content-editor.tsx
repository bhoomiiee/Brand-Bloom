'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Store, SiteContent } from '@prisma/client'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Save, Eye, Image as ImageIcon, Type, Palette } from 'lucide-react'
import Link from 'next/link'

interface ContentEditorProps {
  store: Store
  siteContent: SiteContent
}

export function ContentEditor({ store, siteContent }: ContentEditorProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    // Store branding
    logo: store.logo || '',
    description: store.description || '',
    
    // Hero section
    heroTitle: siteContent.heroTitle || '',
    heroSubtitle: siteContent.heroSubtitle || '',
    heroCta: siteContent.heroCta || '',
    heroImage: siteContent.heroImage || '',
    
    // Additional banners
    banner1Title: siteContent.banner1Title || '',
    banner1Image: siteContent.banner1Image || '',
    banner2Title: siteContent.banner2Title || '',
    banner2Image: siteContent.banner2Image || '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/content/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeId: store.id,
          siteContentId: siteContent.id,
          ...formData,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to update content')
      }

      alert('Content updated successfully!')
      router.refresh()
    } catch (error) {
      console.error('Failed to update content:', error)
      alert(error instanceof Error ? error.message : 'Failed to update content')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Store Branding */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Palette className="h-6 w-6 text-purple-600" />
          <h2 className="text-xl font-semibold">Store Branding</h2>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="logo">Logo URL</Label>
            <Input
              id="logo"
              name="logo"
              type="url"
              value={formData.logo}
              onChange={handleInputChange}
              placeholder="https://example.com/logo.png"
            />
            <p className="text-sm text-gray-500 mt-1">
              Upload your logo to an image hosting service and paste the URL here
            </p>
            {formData.logo && (
              <div className="mt-3">
                <img
                  src={formData.logo}
                  alt="Logo preview"
                  className="h-16 object-contain border rounded p-2"
                />
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="description">Store Description</Label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Tell customers about your store..."
            />
          </div>
        </div>
      </Card>

      {/* Hero Section */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Type className="h-6 w-6 text-purple-600" />
          <h2 className="text-xl font-semibold">Hero Section</h2>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="heroTitle">Hero Title</Label>
            <Input
              id="heroTitle"
              name="heroTitle"
              value={formData.heroTitle}
              onChange={handleInputChange}
              placeholder="Welcome to Our Store"
            />
          </div>

          <div>
            <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
            <Input
              id="heroSubtitle"
              name="heroSubtitle"
              value={formData.heroSubtitle}
              onChange={handleInputChange}
              placeholder="Discover amazing products"
            />
          </div>

          <div>
            <Label htmlFor="heroCta">Call-to-Action Button Text</Label>
            <Input
              id="heroCta"
              name="heroCta"
              value={formData.heroCta}
              onChange={handleInputChange}
              placeholder="Shop Now"
            />
          </div>

          <div>
            <Label htmlFor="heroImage">Hero Background Image URL</Label>
            <Input
              id="heroImage"
              name="heroImage"
              type="url"
              value={formData.heroImage}
              onChange={handleInputChange}
              placeholder="https://example.com/hero-image.jpg"
            />
            <p className="text-sm text-gray-500 mt-1">
              Recommended size: 1920x500px or larger
            </p>
            {formData.heroImage && (
              <div className="mt-3">
                <img
                  src={formData.heroImage}
                  alt="Hero preview"
                  className="w-full h-32 object-cover rounded border"
                />
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Additional Banners */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <ImageIcon className="h-6 w-6 text-purple-600" />
          <h2 className="text-xl font-semibold">Featured Banners</h2>
        </div>

        <div className="space-y-6">
          {/* Banner 1 */}
          <div className="space-y-4 pb-6 border-b">
            <h3 className="font-semibold text-gray-700">Banner 1</h3>
            <div>
              <Label htmlFor="banner1Title">Banner Title</Label>
              <Input
                id="banner1Title"
                name="banner1Title"
                value={formData.banner1Title}
                onChange={handleInputChange}
                placeholder="New Collection"
              />
            </div>
            <div>
              <Label htmlFor="banner1Image">Banner Image URL</Label>
              <Input
                id="banner1Image"
                name="banner1Image"
                type="url"
                value={formData.banner1Image}
                onChange={handleInputChange}
                placeholder="https://example.com/banner1.jpg"
              />
              {formData.banner1Image && (
                <div className="mt-3">
                  <img
                    src={formData.banner1Image}
                    alt="Banner 1 preview"
                    className="w-full h-24 object-cover rounded border"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Banner 2 */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700">Banner 2</h3>
            <div>
              <Label htmlFor="banner2Title">Banner Title</Label>
              <Input
                id="banner2Title"
                name="banner2Title"
                value={formData.banner2Title}
                onChange={handleInputChange}
                placeholder="Summer Sale"
              />
            </div>
            <div>
              <Label htmlFor="banner2Image">Banner Image URL</Label>
              <Input
                id="banner2Image"
                name="banner2Image"
                type="url"
                value={formData.banner2Image}
                onChange={handleInputChange}
                placeholder="https://example.com/banner2.jpg"
              />
              {formData.banner2Image && (
                <div className="mt-3">
                  <img
                    src={formData.banner2Image}
                    alt="Banner 2 preview"
                    className="w-full h-24 object-cover rounded border"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Image Resources Help */}
      <div className="p-6 rounded-2xl bg-[#F1D9DF]/50 border border-[#BD7C91]/30 text-[#3D202B]">
        <h3 className="font-bold text-sm mb-2 text-[#632D40]">Curated Botanical Image Sources</h3>
        <p className="text-xs text-[#806B73] mb-3">
          Recommended high-resolution photography collections for boutique stores:
        </p>
        <ul className="text-xs text-[#3D202B] space-y-1 list-disc list-inside">
          <li><a href="https://unsplash.com" target="_blank" className="underline font-semibold text-[#632D40] hover:text-[#BD7C91]">Unsplash</a> - Floral, boutique, and packaging photography</li>
          <li><a href="https://pexels.com" target="_blank" className="underline font-semibold text-[#632D40] hover:text-[#BD7C91]">Pexels</a> - Natural bouquets & artisan lifestyle photos</li>
        </ul>
        <p className="text-[11px] text-[#806B73] mt-3">
          Tip: Copy any image address directly and paste into the URL field above.
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Link href={`/store/${store.slug}`} target="_blank">
          <button type="button" className="px-4 py-2.5 rounded-xl text-xs font-semibold border border-[#E8DDE0] text-[#632D40] hover:bg-[#F1D9DF]/40 transition-colors flex items-center gap-2">
            <Eye className="h-3.5 w-3.5 text-[#BD7C91]" />
            <span>Preview Storefront</span>
          </button>
        </Link>
        <button 
          type="submit" 
          disabled={isLoading}
          className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-[#632D40] hover:bg-[#632D40]/90 text-white transition-all shadow-xs flex items-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          <Save className="h-3.5 w-3.5" />
          <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>
    </form>
  )
}
