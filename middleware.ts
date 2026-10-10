import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Routes that require OWNER role
const OWNER_ONLY_ROUTES = [
  '/dashboard/team',
  '/dashboard/settings',
  '/api/team/invite',
  '/api/team/remove',
  '/api/store/settings',
]

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname

  // Allow public routes
  if (
    path.startsWith('/auth') ||
    path.startsWith('/store/') ||
    path.startsWith('/api/auth') ||
    path === '/' ||
    path.startsWith('/_next') ||
    path.startsWith('/favicon.ico')
  ) {
    return NextResponse.next()
  }

  // Get the token
  const token = await getToken({ 
    req, 
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || 'development-secret-change-in-production-hackathon-2024'
  })

  // Redirect to signin if not authenticated and trying to access dashboard
  if (!token && path.startsWith('/dashboard')) {
    const url = new URL('/auth/signin', req.url)
    url.searchParams.set('callbackUrl', path)
    return NextResponse.redirect(url)
  }

  // Redirect to signin if not authenticated and trying to access onboarding
  if (!token && path.startsWith('/onboarding')) {
    const url = new URL('/auth/signin', req.url)
    url.searchParams.set('callbackUrl', '/onboarding')
    return NextResponse.redirect(url)
  }

  // Redirect to dashboard if authenticated and trying to access auth pages
  if (token && (path.startsWith('/auth/signin') || path.startsWith('/auth/signup'))) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // Check role-based access for owner-only routes
  if (token && OWNER_ONLY_ROUTES.some(route => path.startsWith(route))) {
    const userRole = (token.currentStoreRole || token.role) as string | undefined
    
    if (userRole !== 'OWNER') {
      // Redirect staff to dashboard with error
      const url = new URL('/dashboard', req.url)
      url.searchParams.set('error', 'access_denied')
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
