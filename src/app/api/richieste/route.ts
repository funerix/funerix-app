import { NextRequest, NextResponse } from 'next/server'

// POST /api/richieste — Riceve una nuova richiesta dal configuratore
export async function POST(request: NextRequest) {
  const body = await request.json()

  const { nomeCliente, telefono, email, configurazione } = body

  if (!nomeCliente || !telefono || !configurazione) {
    return NextResponse.json(
      { error: 'Nome, telefono e configurazione sono obbligatori.' },
      { status: 400 }
    )
  }

  // TODO: Salvare in database (Supabase)
  // TODO: Inviare email di notifica allo staff
  // TODO: Inviare email di conferma al cliente

  const richiesta = {
    id: `R-${Date.now()}`,
    nomeCliente,
    telefono,
    email,
    configurazione,
    stato: 'nuova',
    createdAt: new Date().toISOString(),
  }

  return NextResponse.json(
    { success: true, richiesta },
    { status: 201 }
  )
}

// GET /api/richieste — Lista richieste (solo admin)
export async function GET() {
  // TODO: Verificare autenticazione admin
  // TODO: Leggere da database

  return NextResponse.json({
    richieste: [],
    message: 'Endpoint pronto. Collegare a Supabase per i dati reali.',
  })
}
