import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET /api/pet/veterinari — lista veterinari partner
export async function GET(req: NextRequest) {
  const all = req.nextUrl.searchParams.get('all') // admin vuole tutti, anche non attivi

  let query = sb.from('veterinari_partner').select('*').order('nome_studio', { ascending: true })
  if (!all) query = query.eq('attivo', true)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST /api/pet/veterinari — crea veterinario partner
export async function POST(req: NextRequest) {
  const body = await req.json()

  // Genera codice convenzione: VET-XX-XXXX
  const initials = (body.nome_studio || 'VT').substring(0, 2).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  body.codice_convenzione = `VET-${initials}-${random}`

  const { data, error } = await sb.from('veterinari_partner').insert(body).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

// PUT /api/pet/veterinari — modifica veterinario
export async function PUT(req: NextRequest) {
  const { id, ...updates } = await req.json()
  if (!id) return NextResponse.json({ error: 'ID richiesto' }, { status: 400 })
  const { error } = await sb.from('veterinari_partner').update(updates).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

// DELETE /api/pet/veterinari — elimina veterinario
export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'ID richiesto' }, { status: 400 })
  const { error } = await sb.from('veterinari_partner').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
