import { NextRequest, NextResponse } from 'next/server'
import { isSlugAvailable } from '@/lib/tenant'
import { isSlugReserved } from '@/lib/constants'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const slug = searchParams.get('slug')

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
  }

  // Check if slug is reserved
  if (isSlugReserved(slug)) {
    return NextResponse.json({ available: false, reason: 'reserved' })
  }

  // Check if slug is available in database
  const available = await isSlugAvailable(slug)

  return NextResponse.json({ available })
}
