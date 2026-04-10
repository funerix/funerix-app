import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  const token = req.nextUrl.searchParams.get('token')

  if (token) {
    const { data, error } = await sb.from('rimpatri_pratiche').select('*, rimpatri_clienti(*), rimpatri_paesi(nome, bandiera_emoji), rimpatri_timeline(*)').eq('token_accesso', token).single()
    if (error || !data) return NextResponse.json({ error: 'Pratica non trovata' }, { status: 404 })
    return NextResponse.json(data)
  }

  if (id) {
    const { data, error } = await sb.from('rimpatri_pratiche').select('*, rimpatri_clienti(*), rimpatri_paesi(*), rimpatri_partner(*), rimpatri_consolati(*), rimpatri_timeline(*)').eq('id', id).single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  }

  const { data, error } = await sb.from('rimpatri_pratiche').select('*, rimpatri_clienti(nome, cognome, telefono), rimpatri_paesi(nome, bandiera_emoji)').order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const body = await req.json()

  let clienteId = body.cliente_id
  if (!clienteId && body.cliente) {
    const { data: c, error: cErr } = await sb.from('rimpatri_clienti').insert({
      nome: body.cliente.nome, cognome: body.cliente.cognome,
      telefono: body.cliente.telefono, email: body.cliente.email,
      relazione_con_defunto: body.cliente.relazione || null,
      nazionalita: body.cliente.nazionalita || null,
      lingua_preferita: body.cliente.lingua || 'it',
    }).select().single()
    if (cErr) return NextResponse.json({ error: cErr.message }, { status: 500 })
    clienteId = c.id
  }

  const { data, error } = await sb.from('rimpatri_pratiche').insert({
    cliente_id: clienteId,
    defunto_nome: body.defunto_nome, defunto_cognome: body.defunto_cognome,
    defunto_nazionalita: body.defunto_nazionalita || null,
    defunto_data_decesso: body.defunto_data_decesso || null,
    direzione: body.direzione, paese_id: body.paese_id,
    citta_partenza: body.citta_partenza || null,
    citta_destinazione: body.citta_destinazione || null,
    zona: body.zona, servizi_extra: body.servizi_extra || [],
    documenti: body.documenti || [],
    totale: body.totale || null,
    lingua_cliente: body.lingua_cliente || 'it',
    note_cliente: body.note_cliente || null,
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await sb.from('rimpatri_timeline').insert({ pratica_id: data.id, stato: 'richiesta', descrizione: 'Richiesta ricevuta', operatore_nome: 'Sistema' })

  return NextResponse.json(data, { status: 201 })
}

export async function PUT(req: NextRequest) {
  const { id, log_descrizione, log_operatore, ...updates } = await req.json()
  if (!id) return NextResponse.json({ error: 'ID richiesto' }, { status: 400 })
  updates.updated_at = new Date().toISOString()

  const { error } = await sb.from('rimpatri_pratiche').update(updates).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  if (updates.stato) {
    await sb.from('rimpatri_timeline').insert({
      pratica_id: id, stato: updates.stato,
      descrizione: log_descrizione || `Stato aggiornato a: ${updates.stato}`,
      operatore_nome: log_operatore || 'Admin',
    })
  }

  return NextResponse.json({ success: true })
}
