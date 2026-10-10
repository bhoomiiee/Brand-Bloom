/**
 * Product Import Utilities
 * 
 * Handles CSV/Excel parsing, validation, and import
 */

import Papa from 'papaparse'
import * as XLSX from 'xlsx'
import { z } from 'zod'
import { slugify } from './utils'

// Row validation schema
const productRowSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().optional(),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid price format'),
  comparePrice: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid price format').optional().or(z.literal('')),
  stock: z.string().regex(/^\d+$/, 'Stock must be a whole number').optional().or(z.literal('')),
  sku: z.string().optional().or(z.literal('')),
  barcode: z.string().optional().or(z.literal('')),
  imageUrl: z.string().url('Invalid image URL').optional().or(z.literal('')),
})

export type ProductRow = z.infer<typeof productRowSchema>

export interface ParsedProduct {
  name: string
  category: string
  description?: string
  price: number
  comparePrice?: number
  stock: number
  sku?: string
  barcode?: string
  imageUrl?: string
}

export interface ValidationError {
  row: number
  field: string
  message: string
  value?: any
}

export interface ImportResult {
  success: boolean
  validRows: ParsedProduct[]
  errors: ValidationError[]
  totalRows: number
  validCount: number
  errorCount: number
}

/**
 * Parse CSV file
 */
export function parseCSV(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results.data)
      },
      error: (error) => {
        reject(error)
      },
    })
  })
}

/**
 * Parse Excel file
 */
export function parseExcel(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result
        const workbook = XLSX.read(data, { type: 'binary' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false })
        resolve(jsonData)
      } catch (error) {
        reject(error)
      }
    }
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }
    
    reader.readAsBinaryString(file)
  })
}

/**
 * Parse file based on type
 */
export async function parseImportFile(file: File): Promise<any[]> {
  const extension = file.name.split('.').pop()?.toLowerCase()
  
  if (extension === 'csv') {
    return parseCSV(file)
  } else if (extension === 'xlsx' || extension === 'xls') {
    return parseExcel(file)
  } else {
    throw new Error('Unsupported file format. Please use CSV or Excel files.')
  }
}

/**
 * Normalize column names (handle different capitalizations and formats)
 */
function normalizeColumnName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, '')
}

/**
 * Map imported columns to expected fields
 */
export function mapColumns(data: any[]): { mapped: any[]; unmappedColumns: string[] } {
  if (data.length === 0) {
    return { mapped: [], unmappedColumns: [] }
  }

  const expectedColumns = [
    'name',
    'category',
    'description',
    'price',
    'compareprice',
    'stock',
    'sku',
    'barcode',
    'imageurl',
  ]

  const firstRow = data[0]
  const columnMapping: Record<string, string> = {}
  const unmappedColumns: string[] = []

  // Create mapping
  Object.keys(firstRow).forEach((col) => {
    const normalized = normalizeColumnName(col)
    if (expectedColumns.includes(normalized)) {
      columnMapping[col] = normalized
    } else {
      unmappedColumns.push(col)
    }
  })

  // Map all rows
  const mapped = data.map((row) => {
    const mappedRow: any = {}
    Object.keys(row).forEach((col) => {
      const mappedName = columnMapping[col]
      if (mappedName) {
        // Handle comparePrice vs compareprice
        if (mappedName === 'compareprice') {
          mappedRow.comparePrice = row[col]
        } else if (mappedName === 'imageurl') {
          mappedRow.imageUrl = row[col]
        } else {
          mappedRow[mappedName] = row[col]
        }
      }
    })
    return mappedRow
  })

  return { mapped, unmappedColumns }
}

/**
 * Validate and parse import data
 */
export function validateImportData(data: any[]): ImportResult {
  const validRows: ParsedProduct[] = []
  const errors: ValidationError[] = []

  data.forEach((row, index) => {
    const rowNumber = index + 2 // +2 because: +1 for 0-index, +1 for header row

    try {
      // Validate with Zod
      const validated = productRowSchema.parse(row)

      // Convert to parsed product
      const product: ParsedProduct = {
        name: validated.name.trim(),
        category: validated.category.trim(),
        description: validated.description?.trim() || '',
        price: parseFloat(validated.price),
        comparePrice: validated.comparePrice ? parseFloat(validated.comparePrice) : undefined,
        stock: validated.stock ? parseInt(validated.stock) : 0,
        sku: validated.sku?.trim() || undefined,
        barcode: validated.barcode?.trim() || undefined,
        imageUrl: validated.imageUrl?.trim() || undefined,
      }

      // Additional validation
      if (product.comparePrice && product.comparePrice <= product.price) {
        errors.push({
          row: rowNumber,
          field: 'comparePrice',
          message: 'Compare price must be greater than price',
          value: product.comparePrice,
        })
        return
      }

      if (product.price <= 0) {
        errors.push({
          row: rowNumber,
          field: 'price',
          message: 'Price must be greater than 0',
          value: product.price,
        })
        return
      }

      validRows.push(product)
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.issues.forEach((err) => {
          errors.push({
            row: rowNumber,
            field: String(err.path[0] || ''),
            message: err.message,
            value: row[err.path[0] as string],
          })
        })
      } else {
        errors.push({
          row: rowNumber,
          field: 'unknown',
          message: 'Unexpected validation error',
        })
      }
    }
  })

  return {
    success: errors.length === 0,
    validRows,
    errors,
    totalRows: data.length,
    validCount: validRows.length,
    errorCount: errors.length,
  }
}

/**
 * Check for duplicate SKUs
 */
export function checkDuplicateSKUs(products: ParsedProduct[]): ValidationError[] {
  const errors: ValidationError[] = []
  const skuCounts: Record<string, number[]> = {}

  products.forEach((product, index) => {
    if (product.sku) {
      if (!skuCounts[product.sku]) {
        skuCounts[product.sku] = []
      }
      skuCounts[product.sku].push(index + 2)
    }
  })

  Object.entries(skuCounts).forEach(([sku, rows]) => {
    if (rows.length > 1) {
      rows.forEach((row) => {
        errors.push({
          row,
          field: 'sku',
          message: `Duplicate SKU: ${sku} (found in rows ${rows.join(', ')})`,
          value: sku,
        })
      })
    }
  })

  return errors
}

/**
 * Generate CSV template
 */
export function generateCSVTemplate(): string {
  const headers = [
    'name',
    'category',
    'description',
    'price',
    'comparePrice',
    'stock',
    'sku',
    'barcode',
    'imageUrl',
  ]

  const exampleRow = [
    'Example Product',
    'accessories',
    'A great product with excellent features',
    '29.99',
    '39.99',
    '50',
    'EX-001',
    '123456789',
    'https://example.com/image.jpg',
  ]

  return `${headers.join(',')}\n${exampleRow.join(',')}`
}

/**
 * Format validation errors for display
 */
export function formatValidationErrors(errors: ValidationError[]): string {
  if (errors.length === 0) return ''

  const grouped: Record<number, ValidationError[]> = {}
  errors.forEach((error) => {
    if (!grouped[error.row]) {
      grouped[error.row] = []
    }
    grouped[error.row].push(error)
  })

  const lines: string[] = []
  Object.entries(grouped).forEach(([row, rowErrors]) => {
    lines.push(`\nRow ${row}:`)
    rowErrors.forEach((error) => {
      lines.push(`  - ${error.field}: ${error.message}`)
    })
  })

  return lines.join('\n')
}
