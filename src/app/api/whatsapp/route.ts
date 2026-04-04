import { NextRequest, NextResponse } from 'next/server'

// POST /api/whatsapp — Invia messaggio WhatsApp via Business API
// Docs: https://developers.facebook.com/docs/whatsapp/cloud-api/messages/text-messages
export async function POST(request: NextRequest) {
  const body = await request.json()
  const { to, message, token, phoneId } = body

  if (!to || !message) {
    return NextResponse.json({ error: 'Destinatario e messaggio obbligatori' }, { status: 400 })
  }

  // Se WhatsApp Business API è configurata, invia tramite Cloud API
  if (token && phoneId) {
    try {
      const response = await fetch(
        `https://graph.facebook.com/v21.0/${phoneId}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: to.replace(/\s/g, ''),
            type: 'text',
            text: { body: message },
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        return NextResponse.json(
          { error: 'Errore invio WhatsApp Business API', details: data },
          { status: response.status }
        )
      }

      return NextResponse.json({ success: true, messageId: data.messages?.[0]?.id })
    } catch (err) {
      return NextResponse.json(
        { error: 'Errore di connessione a WhatsApp Business API', details: String(err) },
        { status: 500 }
      )
    }
  }

  // Fallback: restituisci il link wa.me per apertura manuale
  const waUrl = `https://wa.me/${to.replace(/\s/g, '')}?text=${encodeURIComponent(message)}`
  return NextResponse.json({ success: true, fallback: true, waUrl })
}
