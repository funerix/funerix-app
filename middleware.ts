import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Pass pathname to layout for admin detection
  response.headers.set('x-pathname', request.nextUrl.pathname)

  // Vercel fornisce x-vercel-ip-country automaticamente
  const country = request.headers.get('x-vercel-ip-country') || ''

  // Setta cookie solo se non già presente (prima visita)
  if (country && !request.cookies.get('funerix-country')) {
    response.cookies.set('funerix-country', country, {
      httpOnly: false,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    })
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images|sounds|cornici|sw.js|manifest.json|api).*)',
  ],
}
