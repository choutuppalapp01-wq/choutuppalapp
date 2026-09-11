import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Next.js 16 proxy — Multi-Tenant domain interception + Protected route headers + Subdomain routing.
 */
export default function proxy(request: NextRequest) {
  const host = request.headers.get('host') || 'choutuppal.in'
  const cleanHost = host.split(':')[0].toLowerCase().trim()
  const url = request.nextUrl.clone()

  if (cleanHost.includes('franchise.choutuppal.in')) {
    // If visiting root of subdomain, serve the /franchise page
    if (url.pathname === '/') {
      url.pathname = '/franchise'
      return NextResponse.rewrite(url)
    }
    // If visiting any other path on subdomain, prepend /franchise
    if (!url.pathname.startsWith('/franchise')) {
      url.pathname = `/franchise${url.pathname}`
      return NextResponse.rewrite(url)
    }
  }

  if (cleanHost.includes('admin.choutuppal.in')) {
    // If visiting root of admin subdomain, serve the /admin page
    if (url.pathname === '/') {
      url.pathname = '/admin'
      return NextResponse.rewrite(url)
    }
    // If visiting any other path on admin subdomain, prepend /admin
    if (!url.pathname.startsWith('/admin')) {
      url.pathname = `/admin${url.pathname}`
      return NextResponse.rewrite(url)
    }
  }

  // Strict RBAC check for /admin routes
  const isAdminPath = url.pathname.startsWith('/admin') || cleanHost.includes('admin.choutuppal.in')
  if (isAdminPath) {
    const sessionToken =
      request.cookies.get('__Secure-next-auth.session-token')?.value ||
      request.cookies.get('next-auth.session-token')?.value

    // In production, unauthenticated requests to /admin are redirected to /login with callbackUrl
    if (process.env.NODE_ENV === 'production' && !sessionToken && !url.pathname.startsWith('/api')) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('callbackUrl', url.pathname)
      loginUrl.searchParams.set('reason', 'admin_required')
      return NextResponse.redirect(loginUrl)
    }
  }

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-tenant-domain', cleanHost)
  requestHeaders.set('x-pathname', url.pathname)

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
  response.headers.set('X-Protected-Route', 'true')
  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|webmanifest)$).*)'],
}
