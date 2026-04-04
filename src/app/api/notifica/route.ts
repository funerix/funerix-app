import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// POST /api/notifica — Notifica consulente per nuova richiesta
// Invia WhatsApp Business API + prepara email (quando Resend sarà configurato)
export async function POST(request: NextRequest) {
  const body = await request.json()
  const { richiestaId } = body

  if (!richiestaId) {
    return NextResponse.json({ error: 'richiestaId obbligatorio' }, { status: 400 })
  }

  // Leggi la richiesta dal DB
  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: richiesta } = await sb.from('richieste').select('*').eq('id', richiestaId).single()
  if (!richiesta) {
    return NextResponse.json({ error: 'Richiesta non trovata' }, { status: 404 })
  }

  // Leggi impostazioni
  const { data: imp } = await sb.from('impostazioni').select('*').eq('id', 1).single()
  if (!imp) {
    return NextResponse.json({ error: 'Impostazioni non trovate' }, { status: 500 })
  }

  const results: Record<string, unknown> = {}

  // 1. WhatsApp Business API (se configurata)
  if (imp.whatsapp_business_enabled && imp.whatsapp_business_token && imp.whatsapp_business_phone_id) {
    const msg = [
      `🔔 NUOVA RICHIESTA`,
      ``,
      `👤 ${richiesta.nome}`,
      `📞 ${richiesta.telefono}`,
      richiesta.email ? `✉️ ${richiesta.email}` : '',
      `📋 ${richiesta.modalita} — ${richiesta.orario}`,
      ``,
      richiesta.configurazione,
      ``,
      `💰 TOTALE: €${Number(richiesta.totale).toLocaleString('it-IT')}`,
      richiesta.note ? `📝 ${richiesta.note}` : '',
    ].filter(Boolean).join('\n')

    try {
      const waRes = await fetch(
        `https://graph.facebook.com/v21.0/${imp.whatsapp_business_phone_id}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${imp.whatsapp_business_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: imp.whatsapp.replace(/\s/g, ''),
            type: 'text',
            text: { body: msg },
          }),
        }
      )
      const waData = await waRes.json()
      results.whatsapp = waRes.ok ? 'sent' : waData
    } catch (e) {
      results.whatsapp = `error: ${e}`
    }
  }

  // 2. Email (pronto per Resend — attivare quando si ha la API key)
  // if (process.env.RESEND_API_KEY) {
  //   const emailRes = await fetch('https://api.resend.com/emails', {
  //     method: 'POST',
  //     headers: {
  //       'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       from: 'Funerix <noreply@funerix.com>',
  //       to: imp.email_richieste,
  //       subject: `Nuova richiesta: ${richiesta.nome} — €${richiesta.totale}`,
  //       html: `<h2>Nuova richiesta preventivo</h2>
  //         <p><strong>${richiesta.nome}</strong> — ${richiesta.telefono}</p>
  //         <p>Modalità: ${richiesta.modalita} — ${richiesta.orario}</p>
  //         <pre>${richiesta.configurazione}</pre>
  //         <p><strong>Totale: €${richiesta.totale}</strong></p>
  //         ${richiesta.note ? `<p>Note: ${richiesta.note}</p>` : ''}`,
  //     }),
  //   })
  //   results.email = emailRes.ok ? 'sent' : await emailRes.json()
  // }

  return NextResponse.json({ success: true, results })
}
