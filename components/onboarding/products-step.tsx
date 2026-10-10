'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

interface Props {
  onNext: (method: 'demo' | 'csv' | 'skip', file?: File) => void
  onBack: () => void
}

export default function ProductsStep({ onNext, onBack }: Props) {
  const [selectedMethod, setSelectedMethod] = useState<'demo' | 'csv' | 'skip'>('demo')
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [error, setError] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      const validTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
      if (!validTypes.includes(file.type) && !file.name.endsWith('.csv') && !file.name.endsWith('.xlsx')) {
        setError('Please upload a CSV or Excel file')
        setCsvFile(null)
        return
      }

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB')
        setCsvFile(null)
        return
      }

      setError('')
      setCsvFile(file)
    }
  }

  const downloadTemplate = () => {
    const template = `name,category,description,price,comparePrice,stock,sku,barcode,imageUrl
Example Product,accessories,A great product with excellent features,29.99,39.99,50,EX-001,123456789,https://example.com/image.jpg`
    
    const blob = new Blob([template], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'product-import-template.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleNext = () => {
    if (selectedMethod === 'csv' && !csvFile) {
      setError('Please select a file to upload')
      return
    }
    onNext(selectedMethod, csvFile || undefined)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Add your first products</h2>
        <p className="text-gray-600">
          Choose how you'd like to populate your store with products
        </p>
      </div>

      <div className="space-y-4">
        {/* Demo Products Option */}
        <button
          type="button"
          onClick={() => setSelectedMethod('demo')}
          className={`w-full p-6 rounded-lg border-2 text-left transition-all ${
            selectedMethod === 'demo'
              ? 'border-primary bg-primary/5'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-start gap-4">
            <div className="text-3xl">🎨</div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">
                Use Demo Products (Recommended)
              </h3>
              <p className="text-sm text-gray-600">
                We'll add realistic sample products based on your categories. 
                Perfect for getting started quickly and seeing how your store looks.
              </p>
              <div className="mt-3 text-sm text-green-600 font-medium">
                ✓ Quick setup • ✓ Professional images • ✓ Ready to customize
              </div>
            </div>
          </div>
        </button>

        {/* CSV Upload Option */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => setSelectedMethod('csv')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setSelectedMethod('csv')
            }
          }}
          className={`w-full p-6 rounded-lg border-2 text-left transition-all cursor-pointer ${
            selectedMethod === 'csv'
              ? 'border-primary bg-primary/5'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-start gap-4">
            <div className="text-3xl">📊</div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">
                Upload CSV/Excel File
              </h3>
              <p className="text-sm text-gray-600">
                Import your existing product catalog from a spreadsheet. 
                Download our template to ensure proper formatting.
              </p>
              <div className="mt-3">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation()
                    downloadTemplate()
                  }}
                >
                  Download Template
                </Button>
              </div>
            </div>
          </div>
        </div>

        {selectedMethod === 'csv' && (
          <div className="ml-12 p-4 border rounded-lg bg-gray-50">
            <Label htmlFor="csvFile" className="mb-2 block">
              Select your product file
            </Label>
            <input
              id="csvFile"
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
            />
            {csvFile && (
              <p className="mt-2 text-sm text-green-600">
                ✓ {csvFile.name} selected
              </p>
            )}
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
            <p className="mt-2 text-xs text-gray-500">
              Accepted formats: CSV, XLSX. Maximum size: 10MB
            </p>
          </div>
        )}

        {/* Skip Option */}
        <button
          type="button"
          onClick={() => setSelectedMethod('skip')}
          className={`w-full p-6 rounded-lg border-2 text-left transition-all ${
            selectedMethod === 'skip'
              ? 'border-primary bg-primary/5'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-start gap-4">
            <div className="text-3xl">⏭️</div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">
                Skip for Now
              </h3>
              <p className="text-sm text-gray-600">
                Set up your store first and add products manually later 
                from your dashboard.
              </p>
            </div>
          </div>
        </button>
      </div>

      <div className="flex justify-between">
        <Button type="button" onClick={onBack} variant="outline">
          Back
        </Button>
        <Button type="button" onClick={handleNext}>
          Next: Choose Theme
        </Button>
      </div>
    </div>
  )
}
