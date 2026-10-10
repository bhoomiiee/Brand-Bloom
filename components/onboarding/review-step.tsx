'use client'

import { Button } from '@/components/ui/button'
import { BUSINESS_TYPES, THEMES } from '@/lib/constants'

interface OnboardingData {
  storeDetails?: {
    name: string
    slug: string
    description?: string
    email?: string
    phone?: string
    address?: string
    businessType: string
  }
  categories?: string[]
  customCategories?: string[]
  productsMethod?: 'demo' | 'csv' | 'skip'
  csvFile?: File
  theme?: string
}

interface Props {
  data: OnboardingData
  onComplete: () => void
  onBack: () => void
  isSubmitting: boolean
}

export default function ReviewStep({ data, onComplete, onBack, isSubmitting }: Props) {
  const businessType = BUSINESS_TYPES.find(t => t.value === data.storeDetails?.businessType)
  const theme = THEMES.find(t => t.id === data.theme)
  const totalCategories = (data.categories?.length || 0) + (data.customCategories?.length || 0)

  const productMethodLabels = {
    demo: 'Demo Products',
    csv: `CSV Import (${data.csvFile?.name})`,
    skip: 'Add Later'
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Review your store setup</h2>
        <p className="text-gray-600">
          Check everything looks good before we create your store
        </p>
      </div>

      <div className="space-y-4">
        {/* Store Details Summary */}
        <div className="p-6 border rounded-lg bg-white">
          <h3 className="font-semibold text-lg mb-4">Store Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Store Name:</span>
              <span className="font-medium">{data.storeDetails?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Store URL:</span>
              <span className="font-medium font-mono text-sm">
                /store/{data.storeDetails?.slug}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Business Type:</span>
              <span className="font-medium">
                {businessType?.icon} {businessType?.label}
              </span>
            </div>
            {data.storeDetails?.description && (
              <div>
                <span className="text-gray-600 block mb-1">Description:</span>
                <p className="text-sm">{data.storeDetails.description}</p>
              </div>
            )}
            {data.storeDetails?.email && (
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{data.storeDetails.email}</span>
              </div>
            )}
            {data.storeDetails?.phone && (
              <div className="flex justify-between">
                <span className="text-gray-600">Phone:</span>
                <span className="font-medium">{data.storeDetails.phone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Categories Summary */}
        <div className="p-6 border rounded-lg bg-white">
          <h3 className="font-semibold text-lg mb-4">Categories</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total Categories:</span>
              <span className="font-medium">{totalCategories}</span>
            </div>
            {data.customCategories && data.customCategories.length > 0 && (
              <div>
                <span className="text-gray-600 block mb-2">Custom Categories:</span>
                <div className="flex flex-wrap gap-2">
                  {data.customCategories.map(cat => (
                    <span key={cat} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Products Summary */}
        <div className="p-6 border rounded-lg bg-white">
          <h3 className="font-semibold text-lg mb-4">Products</h3>
          <div className="flex justify-between">
            <span className="text-gray-600">Initial Setup:</span>
            <span className="font-medium">
              {productMethodLabels[data.productsMethod || 'skip']}
            </span>
          </div>
          {data.productsMethod === 'demo' && (
            <p className="mt-3 text-sm text-gray-600">
              We'll add sample products matching your categories
            </p>
          )}
        </div>

        {/* Theme Summary */}
        <div className="p-6 border rounded-lg bg-white">
          <h3 className="font-semibold text-lg mb-4">Theme</h3>
          <div className="flex items-center gap-4">
            <div 
              className="w-16 h-16 rounded-lg"
              style={{
                background: `linear-gradient(135deg, ${theme?.primaryColor}, ${theme?.secondaryColor})`
              }}
            />
            <div>
              <div className="font-medium">{theme?.name}</div>
              <div className="text-sm text-gray-600">{theme?.description}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Important Info */}
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <h4 className="font-semibold text-green-900 mb-2">What happens next?</h4>
        <ul className="text-sm text-green-800 space-y-1">
          <li>✓ Your store will be created with a unique URL</li>
          <li>✓ Products will be added based on your selection</li>
          <li>✓ You can customize everything from your dashboard</li>
          <li>✓ Your store will be ready to publish immediately</li>
        </ul>
      </div>

      <div className="flex justify-between">
        <Button type="button" onClick={onBack} variant="outline" disabled={isSubmitting}>
          Back
        </Button>
        <Button 
          type="button" 
          onClick={onComplete} 
          disabled={isSubmitting}
          size="lg"
        >
          {isSubmitting ? 'Creating Your Store...' : '🚀 Create My Store'}
        </Button>
      </div>
    </div>
  )
}
