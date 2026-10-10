'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { 
  parseImportFile, 
  mapColumns, 
  validateImportData, 
  checkDuplicateSKUs,
  generateCSVTemplate,
  type ParsedProduct,
  type ValidationError
} from '@/lib/import-products'

type Step = 'upload' | 'preview' | 'importing' | 'complete'

export default function ProductImportPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('upload')
  const [file, setFile] = useState<File | null>(null)
  const [rawData, setRawData] = useState<any[]>([])
  const [mappedData, setMappedData] = useState<any[]>([])
  const [validProducts, setValidProducts] = useState<ParsedProduct[]>([])
  const [errors, setErrors] = useState<ValidationError[]>([])
  const [unmappedColumns, setUnmappedColumns] = useState<string[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [importResult, setImportResult] = useState<any>(null)

  const downloadTemplate = () => {
    const template = generateCSVTemplate()
    const blob = new Blob([template], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'product-import-template.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    setFile(selectedFile)
    setIsProcessing(true)
    setErrors([])

    try {
      // Parse file
      const data = await parseImportFile(selectedFile)
      
      if (data.length === 0) {
        setErrors([{ row: 0, field: 'file', message: 'File is empty' }])
        setIsProcessing(false)
        return
      }

      setRawData(data)

      // Map columns
      const { mapped, unmappedColumns: unmapped } = mapColumns(data)
      setMappedData(mapped)
      setUnmappedColumns(unmapped)

      // Validate data
      const validation = validateImportData(mapped)
      
      // Check for duplicate SKUs
      const duplicateErrors = checkDuplicateSKUs(validation.validRows)
      
      setValidProducts(validation.validRows)
      setErrors([...validation.errors, ...duplicateErrors])

      setStep('preview')
    } catch (error: any) {
      setErrors([{ row: 0, field: 'file', message: error.message || 'Failed to parse file' }])
    } finally {
      setIsProcessing(false)
    }
  }

  const handleImport = async () => {
    if (validProducts.length === 0) return

    setStep('importing')
    setIsProcessing(true)

    try {
      const response = await fetch('/api/products/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: validProducts }),
      })

      if (!response.ok) {
        throw new Error('Import failed')
      }

      const result = await response.json()
      setImportResult(result)
      setStep('complete')
    } catch (error) {
      alert('Import failed. Please try again.')
      setStep('preview')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setRawData([])
    setMappedData([])
    setValidProducts([])
    setErrors([])
    setUnmappedColumns([])
    setImportResult(null)
    setStep('upload')
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Import Products</h1>
        <p className="text-gray-600">
          Upload a CSV or Excel file to bulk import products
        </p>
      </div>

      {/* Upload Step */}
      {step === 'upload' && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Product File</CardTitle>
            <CardDescription>
              Choose a CSV or Excel file containing your product data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Template Download */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold mb-2">📋 Need a template?</h3>
              <p className="text-sm text-gray-600 mb-3">
                Download our template to ensure your file has the correct format
              </p>
              <Button onClick={downloadTemplate} variant="outline" size="sm">
                Download Template
              </Button>
            </div>

            {/* File Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                id="fileInput"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
                disabled={isProcessing}
              />
              <label htmlFor="fileInput" className="cursor-pointer">
                <div className="text-5xl mb-4">📊</div>
                <div className="text-lg font-semibold mb-2">
                  {isProcessing ? 'Processing...' : 'Click to upload or drag and drop'}
                </div>
                <p className="text-sm text-gray-500">
                  CSV or Excel files up to 10MB
                </p>
              </label>
            </div>

            {/* Required Columns */}
            <div>
              <h3 className="font-semibold mb-3">Required Columns</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                <div className="p-2 bg-gray-50 rounded">✓ name</div>
                <div className="p-2 bg-gray-50 rounded">✓ category</div>
                <div className="p-2 bg-gray-50 rounded">✓ price</div>
                <div className="p-2 bg-gray-100 rounded text-gray-500">description (optional)</div>
                <div className="p-2 bg-gray-100 rounded text-gray-500">stock (optional)</div>
                <div className="p-2 bg-gray-100 rounded text-gray-500">sku (optional)</div>
              </div>
            </div>

            {errors.length > 0 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="font-semibold text-red-900 mb-2">Errors</h3>
                {errors.map((error, idx) => (
                  <p key={idx} className="text-sm text-red-700">
                    {error.message}
                  </p>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Preview Step */}
      {step === 'preview' && (
        <div className="space-y-6">
          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Import Preview</CardTitle>
              <CardDescription>
                Review your data before importing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {rawData.length}
                  </div>
                  <div className="text-sm text-gray-600">Total Rows</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {validProducts.length}
                  </div>
                  <div className="text-sm text-gray-600">Valid Products</div>
                </div>
                <div className="p-4 bg-red-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {errors.length}
                  </div>
                  <div className="text-sm text-gray-600">Errors</div>
                </div>
              </div>

              {unmappedColumns.length > 0 && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
                  <h4 className="font-semibold text-yellow-900 mb-2">Unmapped Columns</h4>
                  <p className="text-sm text-yellow-800">
                    These columns will be ignored: {unmappedColumns.join(', ')}
                  </p>
                </div>
              )}

              {errors.length > 0 && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                  <h4 className="font-semibold text-red-900 mb-3">Validation Errors</h4>
                  <div className="max-h-60 overflow-y-auto space-y-2 text-sm">
                    {errors.slice(0, 20).map((error, idx) => (
                      <div key={idx} className="text-red-700">
                        <strong>Row {error.row}:</strong> {error.field} - {error.message}
                      </div>
                    ))}
                    {errors.length > 20 && (
                      <div className="text-red-600 font-medium">
                        ... and {errors.length - 20} more errors
                      </div>
                    )}
                  </div>
                </div>
              )}

              {validProducts.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">Sample Valid Products (first 5)</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="p-2 text-left border">Name</th>
                          <th className="p-2 text-left border">Category</th>
                          <th className="p-2 text-right border">Price</th>
                          <th className="p-2 text-right border">Stock</th>
                          <th className="p-2 text-left border">SKU</th>
                        </tr>
                      </thead>
                      <tbody>
                        {validProducts.slice(0, 5).map((product, idx) => (
                          <tr key={idx} className="border-t">
                            <td className="p-2 border">{product.name}</td>
                            <td className="p-2 border">{product.category}</td>
                            <td className="p-2 text-right border">{formatCurrency(product.price)}</td>
                            <td className="p-2 text-right border">{product.stock}</td>
                            <td className="p-2 border">{product.sku || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-between">
            <Button onClick={handleReset} variant="outline">
              Upload Different File
            </Button>
            <Button 
              onClick={handleImport} 
              disabled={validProducts.length === 0 || isProcessing}
            >
              Import {validProducts.length} Products
            </Button>
          </div>
        </div>
      )}

      {/* Importing Step */}
      {step === 'importing' && (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="text-5xl mb-4">⏳</div>
            <h2 className="text-2xl font-bold mb-2">Importing Products...</h2>
            <p className="text-gray-600">Please wait while we add your products</p>
          </CardContent>
        </Card>
      )}

      {/* Complete Step */}
      {step === 'complete' && importResult && (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-2xl font-bold mb-2">Import Complete!</h2>
            <p className="text-gray-600 mb-6">
              Successfully imported {importResult.imported} products
            </p>
            <div className="flex justify-center gap-4">
              <Button onClick={() => router.push('/dashboard/products')}>
                View Products
              </Button>
              <Button onClick={handleReset} variant="outline">
                Import More
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
