import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET() {
  const { data, error } = await sb.from('piani_pet').select('*').order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const totale = body.totale || 0
  const numRate = body.num_rate || 12
  const importoRata = Math.ceil((totale / numRate) * 100) / 100

  const { data, error } = await sb.from('piani_pet').insert({
    cliente_nome: body.cliente_nome,
    cliente_telefono: body.cliente_telefono,
    cliente_email: body.cliente_email,
    animale_nome: body.animale_nome || null,
    specie: body.specie || null,
    taglia: body.taglia || null,
    tipo_cremazione: body.tipo_cremazione || 'individuale',
    urna_id: body.urna_id || null,
    totale,
    num_rate: numRate,
    importo_rata: importoRata,
    saldo_residuo: totale,
    veterinario_id: body.veterinario_id || null,
    codice_convenzione: body.codice_convenzione || null,
    note: body.note || null,
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

export async function PUT(req: NextRequest) {
  const { id, ...updates } = await req.json()
  if (!id) return NextResponse.json({ error: 'ID richiesto' }, { status: 400 })
  updates.updated_at = new Date().toISOString()
  const { error } = await sb.from('piani_pet').update(updates).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
