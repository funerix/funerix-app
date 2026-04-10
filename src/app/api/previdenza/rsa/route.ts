import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  const all = req.nextUrl.searchParams.get('all')
  let query = sb.from('rsa_convenzionate').select('*').order('nome_struttura', { ascending: true })
  if (!all) query = query.eq('attivo', true)
  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const initials = (body.nome_struttura || 'RS').substring(0, 2).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  body.codice_convenzione = body.codice_convenzione || `RSA-${initials}-${random}`
  const { data, error } = await sb.from('rsa_convenzionate').insert(body).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

export async function PUT(req: NextRequest) {
  const { id, ...updates } = await req.json()
  if (!id) return NextResponse.json({ error: 'ID richiesto' }, { status: 400 })
  const { error } = await sb.from('rsa_convenzionate').update(updates).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'ID richiesto' }, { status: 400 })
  const { error } = await sb.from('rsa_convenzionate').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
