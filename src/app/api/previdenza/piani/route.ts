import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')

  if (id) {
    const { data, error } = await sb
      .from('piani_previdenza')
      .select('*, clienti_previdenza(*), beneficiari(*), tipi_piano(*), rsa_convenzionate(*)')
      .eq('id', id)
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  }

  const { data, error } = await sb
    .from('piani_previdenza')
    .select('*, clienti_previdenza(nome, cognome, telefono, email), beneficiari(nome, cognome)')
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const body = await req.json()

  // Crea o trova cliente
  let clienteId = body.cliente_id
  if (!clienteId && body.cliente) {
    const { data: existing } = await sb
      .from('clienti_previdenza')
      .select('id')
      .eq('email', body.cliente.email)
      .single()

    if (existing) {
      clienteId = existing.id
    } else {
      const bcrypt = await import('crypto')
      const hash = bcrypt.createHash('sha256').update(body.cliente.password || 'temp123').digest('hex')
      const { data: newClient, error: cErr } = await sb
        .from('clienti_previdenza')
        .insert({
          nome: body.cliente.nome,
          cognome: body.cliente.cognome,
          codice_fiscale: body.cliente.codice_fiscale || null,
          data_nascita: body.cliente.data_nascita || null,
          telefono: body.cliente.telefono,
          email: body.cliente.email,
          password_hash: hash,
          indirizzo: body.cliente.indirizzo || null,
          citta: body.cliente.citta || null,
          cap: body.cliente.cap || null,
        })
        .select()
        .single()
      if (cErr) return NextResponse.json({ error: cErr.message }, { status: 500 })
      clienteId = newClient.id
    }
  }

  // Crea beneficiario
  let beneficiarioId = body.beneficiario_id
  if (!beneficiarioId && body.beneficiario) {
    const { data: ben, error: bErr } = await sb
      .from('beneficiari')
      .insert({
        nome: body.beneficiario.nome,
        cognome: body.beneficiario.cognome,
        codice_fiscale: body.beneficiario.codice_fiscale || null,
        data_nascita: body.beneficiario.data_nascita || null,
        relazione_con_cliente: body.beneficiario.relazione || 'se_stesso',
      })
      .select()
      .single()
    if (bErr) return NextResponse.json({ error: bErr.message }, { status: 500 })
    beneficiarioId = ben.id
  }

  // Crea piano
  const saldoResiduo = body.totale || 0
  const numRate = body.num_rate || 36
  const importoRata = Math.ceil((saldoResiduo / numRate) * 100) / 100

  // Popola anche campi legacy della tabella originale
  const clienteNome = body.cliente ? `${body.cliente.nome} ${body.cliente.cognome}` : body.cliente_nome || ''
  const clienteEmail = body.cliente?.email || body.cliente_email || ''
  const clienteTelefono = body.cliente?.telefono || body.cliente_telefono || ''
  const beneficiarioNome = body.beneficiario ? `${body.beneficiario.nome} ${body.beneficiario.cognome}` : body.beneficiario_nome || ''

  const { data: piano, error } = await sb
    .from('piani_previdenza')
    .insert({
      // Campi nuovi
      cliente_id: clienteId,
      beneficiario_id: beneficiarioId,
      tipo_piano_id: body.tipo_piano_id || null,
      tipo_piano_nome: body.tipo_piano_nome || 'Personalizzato',
      configurazione: body.configurazione || {},
      totale: body.totale,
      num_rate: numRate,
      importo_rata: importoRata,
      rate_pagate: 0,
      saldo_versato: 0,
      saldo_residuo: saldoResiduo,
      stato: body.stato || 'bozza',
      rsa_id: body.rsa_id || null,
      rsa_operatore: body.rsa_operatore || null,
      codice_convenzione: body.codice_convenzione || null,
      // Campi legacy (tabella originale li richiede NOT NULL)
      cliente_nome: clienteNome,
      cliente_email: clienteEmail,
      cliente_telefono: clienteTelefono,
      beneficiario_nome: beneficiarioNome,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Aggiorna beneficiario con piano_id
  if (beneficiarioId) {
    await sb.from('beneficiari').update({ piano_id: piano.id }).eq('id', beneficiarioId)
  }

  // Log
  await sb.from('previdenza_log').insert({
    piano_id: piano.id,
    azione: 'Piano creato',
    dettaglio: `${body.tipo_piano_nome || 'Personalizzato'} — €${body.totale} in ${numRate} rate`,
    utente_nome: body.rsa_operatore || body.cliente?.nome || 'Sistema',
    utente_tipo: body.rsa_id ? 'rsa' : 'cliente',
  })

  return NextResponse.json(piano, { status: 201 })
}

export async function PUT(req: NextRequest) {
  const { id, log_azione, log_utente, ...updates } = await req.json()
  if (!id) return NextResponse.json({ error: 'ID richiesto' }, { status: 400 })

  updates.updated_at = new Date().toISOString()

  // Aggiorna date automatiche in base allo stato
  if (updates.stato) {
    const now = new Date().toISOString()
    const stateMap: Record<string, string> = {
      attivo: 'data_attivazione',
      sospeso: 'data_sospensione',
      completato: 'data_completamento',
      recesso: 'data_recesso',
    }
    const dateField = stateMap[updates.stato]
    if (dateField) updates[dateField] = now
  }

  const { error } = await sb.from('piani_previdenza').update(updates).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Log azione
  if (log_azione) {
    await sb.from('previdenza_log').insert({
      piano_id: id,
      azione: log_azione,
      dettaglio: updates.stato ? `Stato -> ${updates.stato}` : null,
      utente_nome: log_utente || 'Admin',
      utente_tipo: 'admin',
    })
  }

  return NextResponse.json({ success: true })
}
