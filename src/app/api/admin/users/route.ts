import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Verifica admin
async function checkAdmin(req: NextRequest) {
  const token = req.cookies.get('funerix-admin-token')?.value
  const userCookie = req.cookies.get('funerix-admin-user')?.value
  if (!token || !userCookie) return null
  try {
    const user = JSON.parse(userCookie)
    if (user.ruolo !== 'admin') return null
    return user
  } catch { return null }
}

// POST — Crea consulente con password hashata
export async function POST(req: NextRequest) {
  const admin = await checkAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })

  const body = await req.json()
  if (!body.nome || !body.email || !body.password) {
    return NextResponse.json({ error: 'Nome, email e password obbligatori' }, { status: 400 })
  }

  // Hash password
  const hash = await bcrypt.hash(body.password, 10)

  const { data, error } = await sb.from('admin_users').insert({
    nome: body.nome,
    email: body.email,
    password_hash: hash,
    ruolo: body.ruolo || 'consulente',
    telefono: body.telefono || '',
    attivo: true,
    permessi: body.permessi || {},
    max_pratiche: body.max_pratiche || 10,
    turni: body.turni || [],
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true, data })
}

// PUT — Aggiorna consulente (password hashata se presente)
export async function PUT(req: NextRequest) {
  const admin = await checkAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })

  const body = await req.json()
  if (!body.id) return NextResponse.json({ error: 'ID obbligatorio' }, { status: 400 })

  const updates: Record<string, unknown> = {
    nome: body.nome,
    email: body.email,
    ruolo: body.ruolo,
    telefono: body.telefono,
    permessi: body.permessi,
    max_pratiche: body.max_pratiche,
    turni: body.turni,
  }

  // Hash nuova password se fornita
  if (body.password) {
    updates.password_hash = await bcrypt.hash(body.password, 10)
  }

  const { error } = await sb.from('admin_users').update(updates).eq('id', body.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  return NextResponse.json({ ok: true })
}
