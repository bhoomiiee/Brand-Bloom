import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number | any): string {
  const numericAmount = typeof amount === 'number' ? amount : Number(amount || 0)
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(numericAmount)
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function generateUniqueSlug(name: string, existingSlugs: string[]): string {
  let slug = slugify(name)
  let counter = 1

  while (existingSlugs.includes(slug)) {
    slug = `${slugify(name)}-${counter}`
    counter++
  }

  return slug
}

export function serializeDecimal<T>(data: T): T {
  if (data === null || data === undefined) return data
  if (typeof data === 'object') {
    if (typeof (data as any).toNumber === 'function') {
      return (data as any).toNumber()
    }
    if (data instanceof Date) {
      return data
    }
    if (Array.isArray(data)) {
      return data.map(serializeDecimal) as any
    }
    const res: any = {}
    for (const key of Object.keys(data)) {
      res[key] = serializeDecimal((data as any)[key])
    }
    return res
  }
  return data
}

export function getAppBaseUrl(req?: Request): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '')
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  if (req) {
    const host = req.headers.get('x-forwarded-host') || req.headers.get('host')
    const proto = req.headers.get('x-forwarded-proto') || (host && !host.includes('localhost') ? 'https' : 'http')
    if (host) {
      return `${proto}://${host}`
    }
  }
  return 'http://localhost:3000'
}
