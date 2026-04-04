import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// POST /api/cliente/documenti — Carica un documento
export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const token = formData.get('token') as string
  const tipoDocumento = formData.get('tipo') as string
  const file = formData.get('file') as File

  if (!token || !file || !tipoDocumento) {
    return NextResponse.json({ error: 'Token, tipo e file obbligatori' }, { status: 400 })
  }

  // Verifica cliente
  const { data: cliente } = await sb.from('clienti')
    .select('id, documenti_checklist, documenti_files')
    .eq('token_accesso', token)
    .single()

  if (!cliente) {
    return NextResponse.json({ error: 'Token non valido' }, { status: 401 })
  }

  // Carica file su Supabase Storage
  const ext = file.name.split('.').pop()
  const fileName = `${cliente.id}/${tipoDocumento.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())

  const { error: uploadErr } = await sb.storage
    .from('documenti-clienti')
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: true,
    })

  if (uploadErr) {
    return NextResponse.json({ error: 'Errore upload: ' + uploadErr.message }, { status: 500 })
  }

  // Aggiorna la checklist — segna il documento come completato
  const checklist = (cliente.documenti_checklist || []) as { nome: string; completato: boolean }[]
  const updatedChecklist = checklist.map(doc =>
    doc.nome === tipoDocumento ? { ...doc, completato: true } : doc
  )

  // Aggiungi ai file caricati
  const files = (cliente.documenti_files || []) as { nome: string; file: string; data: string }[]
  files.push({
    nome: tipoDocumento,
    file: fileName,
    data: new Date().toISOString(),
  })

  await sb.from('clienti').update({
    documenti_checklist: updatedChecklist,
    documenti_files: files,
  }).eq('id', cliente.id)

  return NextResponse.json({
    success: true,
    documento: { nome: tipoDocumento, file: fileName },
  })
}

// GET /api/cliente/documenti?token=xxx&file=xxx — Scarica un documento
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')
  const filePath = request.nextUrl.searchParams.get('file')

  if (!token || !filePath) {
    return NextResponse.json({ error: 'Token e file obbligatori' }, { status: 400 })
  }

  // Verifica cliente
  const { data: cliente } = await sb.from('clienti')
    .select('id')
    .eq('token_accesso', token)
    .single()

  if (!cliente || !filePath.startsWith(cliente.id)) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  }

  // Genera URL firmato (valido 1 ora)
  const { data } = await sb.storage
    .from('documenti-clienti')
    .createSignedUrl(filePath, 3600)

  if (!data?.signedUrl) {
    return NextResponse.json({ error: 'File non trovato' }, { status: 404 })
  }

  return NextResponse.json({ success: true, url: data.signedUrl })
}
