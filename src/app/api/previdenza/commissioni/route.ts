import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  const rsaId = req.nextUrl.searchParams.get('rsa_id')
  let query = sb.from('commissioni_rsa').select('*, rsa_convenzionate(nome_struttura), piani_previdenza(tipo_piano_nome)').order('created_at', { ascending: false })
  if (rsaId) query = query.eq('rsa_id', rsaId)
  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PUT(req: NextRequest) {
  const { id, ...updates } = await req.json()
  if (!id) return NextResponse.json({ error: 'ID richiesto' }, { status: 400 })
  if (updates.stato === 'approvata') updates.data_approvazione = new Date().toISOString()
  if (updates.stato === 'pagata') updates.data_pagamento = new Date().toISOString()
  const { error } = await sb.from('commissioni_rsa').update(updates).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
