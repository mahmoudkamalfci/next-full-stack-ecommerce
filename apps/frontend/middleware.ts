import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check for the "token" cookie set during login
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl
  
  // If the user has a token and tries to visit auth pages, redirect to home
  if (token && (pathname === '/login' || pathname === '/signup' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  // Only run this middleware on specific auth-related paths
  matcher: ['/login', '/signup', '/register']
}
