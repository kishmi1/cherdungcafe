import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Skip middleware for API routes - they handle their own authentication
  if (path.startsWith('/api')) {
    return NextResponse.next()
  }

  // Protect admin routes
  if (path.startsWith('/admin') && path !== '/admin/login') {
    const sessionCookie = request.cookies.get('adminSession')

    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    try {
      const sessionData = JSON.parse(sessionCookie.value)
      if (!sessionData.userId || !sessionData.email || !sessionData.role) {
        const response = NextResponse.redirect(new URL('/admin/login', request.url))
        response.cookies.delete('adminSession')
        return response
      }

      // Only ADMIN can access admin routes
      if (sessionData.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/staff/dashboard', request.url))
      }
    } catch (error) {
      const response = NextResponse.redirect(new URL('/admin/login', request.url))
      response.cookies.delete('adminSession')
      return response
    }
  }

  // Protect staff routes (but exclude the login page)
  if (path.startsWith('/staff') && path !== '/staff/login') {
    const sessionCookie = request.cookies.get('staffSession')

    if (!sessionCookie) {
      console.log('No staff session cookie found, redirecting to login')
      return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
      const sessionData = JSON.parse(sessionCookie.value)
      if (!sessionData.userId || !sessionData.email || !sessionData.role) {
        console.log('Invalid session data, redirecting to login')
        const response = NextResponse.redirect(new URL('/login', request.url))
        response.cookies.delete('staffSession')
        return response
      }

      // Only STAFF can access staff routes
      if (sessionData.role !== 'STAFF') {
        console.log('Non-STAFF role trying to access staff routes')
        return NextResponse.redirect(new URL('/admin/dashboard', request.url))
      }
    } catch (error) {
      console.log('Error parsing session, redirecting to login:', error)
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('staffSession')
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/staff/:path*'],
}