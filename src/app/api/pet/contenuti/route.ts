import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET /api/pet/contenuti — tutti i contenuti pet
export async function GET() {
  const { data, error } = await sb.from('pet_contenuti').select('*').order('sezione')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// PUT /api/pet/contenuti — aggiorna contenuto per sezione
export async function PUT(req: NextRequest) {
  const { id, sezione, ...updates } = await req.json()
  updates.updated_at = new Date().toISOString()

  const match = id ? { id } : { sezione }
  const { error } = await sb.from('pet_contenuti').update(updates).match(match)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
