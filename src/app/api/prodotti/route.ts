import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET /api/prodotti — lista prodotti
export async function GET() {
  const { data, error } = await sb.from('prodotti').select('*').order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST /api/prodotti — crea prodotto
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { data, error } = await sb.from('prodotti').insert(body).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// PUT /api/prodotti — modifica prodotto
export async function PUT(req: NextRequest) {
  const { id, ...updates } = await req.json()
  const { error } = await sb.from('prodotti').update(updates).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

// DELETE /api/prodotti — elimina prodotto
export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  const { error } = await sb.from('prodotti').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
