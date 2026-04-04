import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// POST /api/upload — Upload immagine a Supabase Storage
export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get('file') as File
  const bucket = (formData.get('bucket') as string) || 'prodotti-immagini'
  const folder = (formData.get('folder') as string) || ''

  if (!file) {
    return NextResponse.json({ error: 'File obbligatorio' }, { status: 400 })
  }

  const ext = file.name.split('.').pop()
  const fileName = `${folder ? folder + '/' : ''}${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())

  const { error } = await sb.storage
    .from(bucket)
    .upload(fileName, buffer, { contentType: file.type, upsert: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // URL pubblica
  const { data: urlData } = sb.storage.from(bucket).getPublicUrl(fileName)

  return NextResponse.json({
    success: true,
    url: urlData.publicUrl,
    path: fileName,
  })
}
