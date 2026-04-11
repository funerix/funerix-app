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

  // 2. Email al consulente (Resend — se configurata)
  if (process.env.RESEND_API_KEY && imp.email_richieste) {
    try {
      const emailRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Funerix <noreply@funerix.com>',
          to: imp.email_richieste,
          subject: `Nuova richiesta: ${richiesta.nome} — €${Number(richiesta.totale).toLocaleString('it-IT')}`,
          html: `<div style="font-family:sans-serif;max-width:600px">
            <h2 style="color:#2C3E50">Nuova richiesta</h2>
            <p><strong>${richiesta.nome}</strong> — ${richiesta.telefono}</p>
            ${richiesta.email ? `<p>Email: ${richiesta.email}</p>` : ''}
            <p>Modalità: ${richiesta.modalita} — ${richiesta.orario || 'Non specificato'}</p>
            <hr/>
            <pre style="white-space:pre-wrap;font-size:13px">${richiesta.configurazione || richiesta.note || ''}</pre>
            <p style="font-size:18px;color:#2C3E50"><strong>Totale: €${Number(richiesta.totale).toLocaleString('it-IT')}</strong></p>
          </div>`,
        }),
      })
      results.email_consulente = emailRes.ok ? 'sent' : await emailRes.json()
    } catch (e) {
      results.email_consulente = `error: ${e}`
    }
  }

  // 3. Email conferma al cliente (se ha fornito email)
  if (process.env.RESEND_API_KEY && richiesta.email) {
    try {
      const emailRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Funerix <noreply@funerix.com>',
          to: richiesta.email,
          subject: `Conferma richiesta — Funerix`,
          html: `<div style="font-family:sans-serif;max-width:600px">
            <h2 style="color:#2C3E50">Grazie, ${richiesta.nome}</h2>
            <p>La vostra richiesta è stata ricevuta con successo.</p>
            <p>Un nostro consulente vi contatterà <strong>entro 30 minuti</strong> per accompagnarvi in ogni dettaglio.</p>
            ${Number(richiesta.totale) > 0 ? `<p>Preventivo indicativo: <strong>€${Number(richiesta.totale).toLocaleString('it-IT')}</strong></p>` : ''}
            <hr/>
            <p style="color:#6B7280;font-size:12px">Funerix — Servizi Funebri in Campania<br/>
            Tel: ${imp.telefono || ''} | Email: ${imp.email || ''}<br/>
            Disponibili 24 ore su 24, 7 giorni su 7</p>
          </div>`,
        }),
      })
      results.email_cliente = emailRes.ok ? 'sent' : await emailRes.json()
    } catch (e) {
      results.email_cliente = `error: ${e}`
    }
  }

  return NextResponse.json({ success: true, results })
}
