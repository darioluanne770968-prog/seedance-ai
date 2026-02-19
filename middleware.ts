import { NextRequest, NextResponse } from 'next/server'

const protectedRoutes = ['/dashboard', '/create', '/videos', '/account']
const authPages = ['/login', '/register']

function hasSessionCookie(req: NextRequest): boolean {
  // Support both Auth.js v5 and older NextAuth cookie names.
  return Boolean(
    req.cookies.get('__Secure-authjs.session-token') ||
    req.cookies.get('authjs.session-token') ||
    req.cookies.get('__Secure-next-auth.session-token') ||
    req.cookies.get('next-auth.session-token')
  )
}

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const isLoggedIn = hasSessionCookie(req)

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )

  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (authPages.includes(pathname) && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images).*)'],
}
