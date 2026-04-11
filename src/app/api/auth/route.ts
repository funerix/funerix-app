import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// POST /api/auth — Login
export async function POST(request: NextRequest) {
  const { email, password } = await request.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Email e password obbligatori' }, { status: 400 })
  }

  const { data: user } = await sb.from('admin_users')
    .select('id, email, nome, ruolo, password_hash, permessi')
    .eq('email', email)
    .eq('attivo', true)
    .single()

  if (!user) {
    return NextResponse.json({ error: 'Credenziali non valide' }, { status: 401 })
  }

  // Supporta sia password hashate (bcrypt) che plaintext (legacy)
  let valid = false
  if (user.password_hash.startsWith('$2')) {
    // Password già hashata con bcrypt
    valid = await bcrypt.compare(password, user.password_hash)
  } else {
    // Password plaintext (legacy) — verifica e migra automaticamente
    valid = user.password_hash === password
    if (valid) {
      // Migra a bcrypt
      const hash = await bcrypt.hash(password, 10)
      await sb.from('admin_users').update({ password_hash: hash }).eq('id', user.id)
    }
  }

  if (!valid) {
    return NextResponse.json({ error: 'Credenziali non valide' }, { status: 401 })
  }

  // Genera token sessione
  const token = crypto.randomUUID()

  // Salva in cookie httpOnly
  const cookieStore = await cookies()
  cookieStore.set('funerix-admin-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
  cookieStore.set('funerix-admin-user', JSON.stringify({ id: user.id, email: user.email, nome: user.nome, ruolo: user.ruolo, permessi: user.permessi || {} }), {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })

  return NextResponse.json({ success: true, user: { id: user.id, email: user.email, nome: user.nome, ruolo: user.ruolo, permessi: user.permessi || {} } })
}

// DELETE /api/auth — Logout
export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.delete('funerix-admin-token')
  cookieStore.delete('funerix-admin-user')
  return NextResponse.json({ success: true })
}

// GET /api/auth — Check session
export async function GET() {
  const cookieStore = await cookies()
  const userCookie = cookieStore.get('funerix-admin-user')
  const tokenCookie = cookieStore.get('funerix-admin-token')

  if (!userCookie?.value || !tokenCookie?.value) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }

  return NextResponse.json({ authenticated: true, user: JSON.parse(userCookie.value) })
}
