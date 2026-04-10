import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(req: NextRequest) {
  const tipo = req.nextUrl.searchParams.get('tipo') // regione, paese_eu, paese_mondo
  const categoria = req.nextUrl.searchParams.get('categoria') // per servizi

  if (categoria === 'servizi') {
    const { data, error } = await sb.from('prezzi_servizi').select('*').eq('attivo', true).order('categoria').order('ordine')
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  }

  let query = sb.from('prezzi_aree').select('*').eq('attivo', true)
  if (tipo) query = query.eq('tipo', tipo)
  query = query.order('zona').order('nome')

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const { table, ...body } = await req.json()
  const tableName = table === 'servizi' ? 'prezzi_servizi' : 'prezzi_aree'
  const { data, error } = await sb.from(tableName).insert(body).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

export async function PUT(req: NextRequest) {
  const { id, table, ...updates } = await req.json()
  if (!id) return NextResponse.json({ error: 'ID richiesto' }, { status: 400 })
  const tableName = table === 'servizi' ? 'prezzi_servizi' : 'prezzi_aree'
  updates.updated_at = new Date().toISOString()
  const { error } = await sb.from(tableName).update(updates).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest) {
  const { id, table } = await req.json()
  if (!id) return NextResponse.json({ error: 'ID richiesto' }, { status: 400 })
  const tableName = table === 'servizi' ? 'prezzi_servizi' : 'prezzi_aree'
  const { error } = await sb.from(tableName).delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
