import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// POST /api/cliente — Crea account cliente e genera token di accesso
export async function POST(request: NextRequest) {
  const body = await request.json()
  const { richiestaId, nome, email, telefono } = body

  if (!email || !nome) {
    return NextResponse.json({ error: 'Nome e email obbligatori' }, { status: 400 })
  }

  // Controlla se il cliente esiste già
  const { data: existing } = await sb.from('clienti').select('id').eq('email', email).single()

  if (existing) {
    // Genera nuovo token
    const token = crypto.randomUUID()
    await sb.from('clienti').update({ token_accesso: token }).eq('id', existing.id)
    return NextResponse.json({ success: true, clienteId: existing.id, token, existing: true })
  }

  // Crea nuovo cliente
  const token = crypto.randomUUID()
  const { data: cliente, error } = await sb.from('clienti').insert({
    richiesta_id: richiestaId || null,
    nome,
    email,
    telefono: telefono || '',
    stato_servizio: 'richiesta',
    dettagli_cerimonia: {},
    documenti_checklist: [
      { nome: "Carta d'identità del defunto", completato: false },
      { nome: 'Tessera sanitaria', completato: false },
      { nome: 'Certificato di morte', completato: false },
      { nome: 'Autorizzazione al trasporto', completato: false },
      { nome: 'Concessione cimiteriale', completato: false },
    ],
    token_accesso: token,
  }).select().single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Link di accesso: /cliente?token=xxx
  const accessLink = `${process.env.NEXT_PUBLIC_SUPABASE_URL ? 'https://funerix.com' : 'http://localhost:3000'}/cliente?token=${token}`

  return NextResponse.json({
    success: true,
    clienteId: cliente.id,
    token,
    accessLink,
  })
}

// GET /api/cliente?token=xxx — Verifica token e restituisci dati cliente
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')

  if (!token) {
    return NextResponse.json({ error: 'Token mancante' }, { status: 400 })
  }

  const { data: cliente } = await sb.from('clienti')
    .select('*, richieste(*)')
    .eq('token_accesso', token)
    .single()

  if (!cliente) {
    return NextResponse.json({ error: 'Token non valido' }, { status: 401 })
  }

  return NextResponse.json({ success: true, cliente })
}
