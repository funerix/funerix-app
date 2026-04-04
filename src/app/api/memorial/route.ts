import { NextRequest, NextResponse } from 'next/server'

// POST /api/memorial — Crea un nuovo memorial
export async function POST(request: NextRequest) {
  const body = await request.json()

  const { nomeDefunto, dataNascita, dataMorte } = body

  if (!nomeDefunto || !dataNascita || !dataMorte) {
    return NextResponse.json(
      { error: 'Nome del defunto, data di nascita e data di morte sono obbligatori.' },
      { status: 400 }
    )
  }

  // TODO: Salvare in database (Supabase)
  // TODO: Generare QR Code univoco

  const memorial = {
    id: `mem-${Date.now()}`,
    ...body,
    messaggi: [],
    createdAt: new Date().toISOString(),
  }

  return NextResponse.json(
    { success: true, memorial },
    { status: 201 }
  )
}

// POST /api/memorial/[id]/messaggi — Aggiungi messaggio di condoglianze
export async function PUT(request: NextRequest) {
  const body = await request.json()

  const { memorialId, autore, contenuto } = body

  if (!memorialId || !autore || !contenuto) {
    return NextResponse.json(
      { error: 'Memorial ID, autore e contenuto sono obbligatori.' },
      { status: 400 }
    )
  }

  // TODO: Salvare in database
  // TODO: Notificare la famiglia (opzionale)

  const messaggio = {
    id: `msg-${Date.now()}`,
    memorialId,
    autore,
    contenuto,
    createdAt: new Date().toISOString(),
  }

  return NextResponse.json(
    { success: true, messaggio },
    { status: 201 }
  )
}
