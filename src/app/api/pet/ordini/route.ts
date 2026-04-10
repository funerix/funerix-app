import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET /api/pet/ordini — lista ordini pet (admin) o singolo ordine (token)
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  const id = req.nextUrl.searchParams.get('id')

  // Area cliente: accesso con token
  if (token) {
    const { data, error } = await sb
      .from('pet_ordini')
      .select('*, pet_clienti(*), pet_prodotti(*)')
      .eq('token_accesso', token)
      .single()
    if (error || !data) return NextResponse.json({ error: 'Ordine non trovato' }, { status: 404 })
    return NextResponse.json(data)
  }

  // Admin: singolo ordine
  if (id) {
    const { data, error } = await sb
      .from('pet_ordini')
      .select('*, pet_clienti(*), pet_prodotti(*), veterinari_partner(*)')
      .eq('id', id)
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  }

  // Admin: lista tutti
  const { data, error } = await sb
    .from('pet_ordini')
    .select('*, pet_clienti(nome, cognome, telefono, email)')
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST /api/pet/ordini — crea nuovo ordine pet (dal configuratore)
export async function POST(req: NextRequest) {
  const body = await req.json()

  // 1. Crea o trova cliente
  let clienteId = body.pet_cliente_id
  if (!clienteId && body.cliente) {
    const { data: existingClient } = await sb
      .from('pet_clienti')
      .select('id')
      .eq('email', body.cliente.email)
      .single()

    if (existingClient) {
      clienteId = existingClient.id
    } else {
      const { data: newClient, error: clientErr } = await sb
        .from('pet_clienti')
        .insert({
          nome: body.cliente.nome,
          cognome: body.cliente.cognome || null,
          telefono: body.cliente.telefono,
          email: body.cliente.email,
          indirizzo: body.cliente.indirizzo || null,
          citta: body.cliente.citta || null,
          cap: body.cliente.cap || null,
        })
        .select()
        .single()
      if (clientErr) return NextResponse.json({ error: clientErr.message }, { status: 500 })
      clienteId = newClient.id
    }
  }

  // 2. Crea ordine
  const { data: ordine, error } = await sb
    .from('pet_ordini')
    .insert({
      pet_cliente_id: clienteId,
      animale_nome: body.animale_nome,
      specie: body.specie,
      specie_altro: body.specie_altro || null,
      razza: body.razza || null,
      peso_kg: body.peso_kg || null,
      taglia: body.taglia,
      tipo_cremazione: body.tipo_cremazione,
      urna_id: body.urna_id || null,
      impronta_zampa: body.impronta_zampa || false,
      ritiro_tipo: body.ritiro_tipo,
      ritiro_indirizzo: body.ritiro_indirizzo || null,
      ritiro_data: body.ritiro_data || null,
      veterinario_id: body.veterinario_id || null,
      codice_convenzione: body.codice_convenzione || null,
      totale: body.totale,
      note_cliente: body.note_cliente || null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(ordine, { status: 201 })
}

// PUT /api/pet/ordini — aggiorna ordine (admin: cambio stato, note, ecc.)
export async function PUT(req: NextRequest) {
  const { id, ...updates } = await req.json()
  if (!id) return NextResponse.json({ error: 'ID richiesto' }, { status: 400 })

  // Se si cambia stato, aggiorna anche la data corrispondente
  if (updates.stato) {
    const now = new Date().toISOString()
    const stateDateMap: Record<string, string> = {
      ritirato: 'data_ritiro_effettivo',
      in_cremazione: 'data_cremazione',
      ceneri_pronte: 'data_ceneri_pronte',
      consegnato: 'data_consegna',
    }
    const dateField = stateDateMap[updates.stato]
    if (dateField) updates[dateField] = now
    updates.updated_at = now
  }

  const { error } = await sb.from('pet_ordini').update(updates).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
