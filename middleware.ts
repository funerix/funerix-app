import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const response = NextResponse.next()

  // Pass pathname to layout for admin detection
  response.headers.set('x-pathname', pathname)

  // Protezione API admin — richiede cookie di sessione
  if (pathname.startsWith('/api/admin/')) {
    const token = request.cookies.get('funerix-admin-token')?.value
    const user = request.cookies.get('funerix-admin-user')?.value
    if (!token || !user) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
    }
    // Verifica ruolo admin per endpoint sensibili
    try {
      const parsed = JSON.parse(user)
      if (parsed.ruolo !== 'admin') {
        return NextResponse.json({ error: 'Accesso non consentito' }, { status: 403 })
      }
    } catch {
      return NextResponse.json({ error: 'Sessione non valida' }, { status: 401 })
    }
  }

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
    '/((?!_next/static|_next/image|favicon.ico|images|sounds|cornici|sw.js|manifest.json).*)',
  ],
}
