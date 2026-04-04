import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// POST /api/cliente/chat — Invia messaggio nella chat
export async function POST(request: NextRequest) {
  const { token, messaggio, autore } = await request.json()

  if (!token || !messaggio) {
    return NextResponse.json({ error: 'Token e messaggio obbligatori' }, { status: 400 })
  }

  // Trova il cliente
  const { data: cliente } = await sb.from('clienti')
    .select('id, nome, messaggi_chat')
    .eq('token_accesso', token)
    .single()

  if (!cliente) {
    return NextResponse.json({ error: 'Token non valido' }, { status: 401 })
  }

  const nuovoMessaggio = {
    autore: autore || cliente.nome,
    testo: messaggio,
    data: new Date().toISOString(),
  }

  const messaggiAggiornati = [...(cliente.messaggi_chat || []), nuovoMessaggio]

  await sb.from('clienti').update({ messaggi_chat: messaggiAggiornati }).eq('id', cliente.id)

  return NextResponse.json({ success: true, messaggio: nuovoMessaggio })
}
