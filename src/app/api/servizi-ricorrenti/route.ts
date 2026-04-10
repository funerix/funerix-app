import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(req: NextRequest) {
  const tipo = req.nextUrl.searchParams.get('tipo') // 'servizi' o 'abbonamenti'

  if (tipo === 'abbonamenti') {
    const { data, error } = await sb.from('abbonamenti_ricorrenti').select('*, servizi_ricorrenti(nome, categoria)').order('created_at', { ascending: false })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  }

  const { data, error } = await sb.from('servizi_ricorrenti').select('*').eq('attivo', true).order('ordine')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const body = await req.json()

  if (body.tipo === 'abbonamento') {
    const { tipo: _, ...abbData } = body
    const { data, error } = await sb.from('abbonamenti_ricorrenti').insert(abbData).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data, { status: 201 })
  }

  const { data, error } = await sb.from('servizi_ricorrenti').insert(body).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

export async function PUT(req: NextRequest) {
  const { id, table, ...updates } = await req.json()
  if (!id) return NextResponse.json({ error: 'ID richiesto' }, { status: 400 })
  const tableName = table === 'abbonamenti' ? 'abbonamenti_ricorrenti' : 'servizi_ricorrenti'
  updates.updated_at = new Date().toISOString()
  const { error } = await sb.from(tableName).update(updates).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest) {
  const { id, table } = await req.json()
  const tableName = table === 'abbonamenti' ? 'abbonamenti_ricorrenti' : 'servizi_ricorrenti'
  const { error } = await sb.from(tableName).delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
