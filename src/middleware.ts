import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  try {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req, res })

    // Refresh session if expired
    const {
      data: { session },
    } = await supabase.auth.getSession()

    const { pathname } = req.nextUrl

    // Define path categories for better organization
    const authPaths = ['/auth/login', '/auth/signup', '/auth/callback']
    const apiPaths = ['/api/jaas']
    const protectedPublicPaths = ['/teleconsultation'] // Require auth but don't redirect logged-in users
    const publicPaths = [...authPaths, ...apiPaths]

    const isAuthPath = authPaths.some(path => pathname.startsWith(path))
    const isApiPath = apiPaths.some(path => pathname.startsWith(path))
    const isProtectedPublicPath = protectedPublicPaths.some(path => pathname.startsWith(path))
    const isPublicPath = publicPaths.some(path => pathname.startsWith(path))

    // Allow API paths without authentication checks
    if (isApiPath) {
      return res
    }

    // If user is not authenticated
    if (!session) {
      // Allow access to auth pages and protected public pages
      if (isAuthPath || isProtectedPublicPath || pathname === '/') {
        return res
      }
      // Redirect to login for other protected routes
      const loginUrl = new URL('/auth/login', req.url)
      return NextResponse.redirect(loginUrl)
    }

    // If user is authenticated but trying to access auth pages (except callback)
    if (session && isAuthPath && !pathname.startsWith('/auth/callback')) {
      const dashboardUrl = new URL('/dashboard', req.url)
      return NextResponse.redirect(dashboardUrl)
    }

    return res
  } catch (error) {
    console.error('Middleware error:', error)
    // Return next response on error to prevent 500
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}