import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Only protect dashboard route
  if (path === '/dashboard') {
    // Check for session cookie
    const sessionCookie = request.cookies.get('adminSession')

    if (!sessionCookie) {
      // Redirect to login if no session
      return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
      // Verify session data
      const sessionData = JSON.parse(sessionCookie.value)
      if (!sessionData.userId || !sessionData.email) {
        // Invalid session, redirect to login
        const response = NextResponse.redirect(new URL('/login', request.url))
        response.cookies.delete('adminSession')
        return response
      }
    } catch (error) {
      // Invalid session data, redirect to login
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('adminSession')
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/dashboard',
}