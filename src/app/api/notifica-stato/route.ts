import { NextRequest, NextResponse } from 'next/server'

const statiMessaggi: Record<string, string> = {
  nuova: 'La vostra richiesta è stata ricevuta e presa in carico.',
  in_lavorazione: 'Il nostro consulente sta lavorando alla vostra richiesta.',
  confermata: 'Il servizio è stato confermato. Vi contatteremo per i dettagli.',
  completata: 'Il servizio è stato completato. Grazie per la vostra fiducia.',
}

// POST /api/notifica-stato — Notifica cliente per cambio stato
export async function POST(request: NextRequest) {
  const { stato, email, nome } = await request.json()

  const messaggio = statiMessaggi[stato] || 'Lo stato della vostra richiesta è stato aggiornato.'

  // Resend email (quando configurato)
  if (process.env.RESEND_API_KEY && email) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Funerix <noreply@funerix.com>',
          to: email,
          subject: `Funerix — Aggiornamento sulla vostra richiesta`,
          html: `
            <div style="font-family: Georgia, serif; max-width: 500px; margin: 0 auto; padding: 30px;">
              <h2 style="color: #2C3E50;">Funerix</h2>
              <p>Gentile ${nome},</p>
              <p>${messaggio}</p>
              <p style="color: #8B7355; font-weight: bold;">Stato attuale: ${stato.replace('_', ' ')}</p>
              <hr style="border: none; border-top: 1px solid #E5E1DB; margin: 20px 0;" />
              <p style="font-size: 12px; color: #9CA3AF;">Per qualsiasi necessità, non esitate a contattarci.<br/>Siamo disponibili 24/7.</p>
            </div>
          `,
        }),
      })
      return NextResponse.json({ success: true, method: 'email' })
    } catch {
      return NextResponse.json({ success: false, error: 'Email non inviata' })
    }
  }

  // Fallback: log (in produzione, aggiungere Resend API key)
  return NextResponse.json({ success: true, method: 'pending', message: 'RESEND_API_KEY non configurata — email non inviata' })
}
