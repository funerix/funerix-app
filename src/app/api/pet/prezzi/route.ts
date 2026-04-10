import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET /api/pet/prezzi — lista prezzi pet (pubblico per configuratore)
export async function GET() {
  const { data, error } = await sb
    .from('pet_prezzi')
    .select('*')
    .eq('attivo', true)
    .order('specie', { ascending: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST /api/pet/prezzi — crea prezzo pet
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { data, error } = await sb.from('pet_prezzi').insert(body).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

// PUT /api/pet/prezzi — modifica prezzo pet
export async function PUT(req: NextRequest) {
  const { id, ...updates } = await req.json()
  if (!id) return NextResponse.json({ error: 'ID richiesto' }, { status: 400 })
  updates.updated_at = new Date().toISOString()
  const { error } = await sb.from('pet_prezzi').update(updates).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

// DELETE /api/pet/prezzi — elimina prezzo pet
export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'ID richiesto' }, { status: 400 })
  const { error } = await sb.from('pet_prezzi').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
