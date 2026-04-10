import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET /api/previdenza/rate — lista rate (per piano o tutte)
export async function GET(req: NextRequest) {
  const pianoId = req.nextUrl.searchParams.get('piano_id')
  const stato = req.nextUrl.searchParams.get('stato')

  let query = sb.from('pagamenti_rata').select('*, piani_previdenza(tipo_piano_nome, clienti_previdenza(nome, cognome))').order('data_scadenza', { ascending: true })

  if (pianoId) query = query.eq('piano_id', pianoId)
  if (stato) query = query.eq('stato', stato)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST /api/previdenza/rate — genera schedule rate per un piano
export async function POST(req: NextRequest) {
  const { piano_id, num_rate, importo_rata, data_inizio } = await req.json()
  if (!piano_id || !num_rate || !importo_rata) {
    return NextResponse.json({ error: 'piano_id, num_rate e importo_rata richiesti' }, { status: 400 })
  }

  const startDate = new Date(data_inizio || new Date())
  const rate = []

  for (let i = 1; i <= num_rate; i++) {
    const scadenza = new Date(startDate)
    scadenza.setMonth(scadenza.getMonth() + i)
    rate.push({
      piano_id,
      numero_rata: i,
      importo: importo_rata,
      stato: 'pendente',
      data_scadenza: scadenza.toISOString().split('T')[0],
    })
  }

  const { data, error } = await sb.from('pagamenti_rata').insert(rate).select()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ created: data.length }, { status: 201 })
}

// PUT /api/previdenza/rate — aggiorna rata (segna pagata, ecc.)
export async function PUT(req: NextRequest) {
  const { id, ...updates } = await req.json()
  if (!id) return NextResponse.json({ error: 'ID richiesto' }, { status: 400 })

  if (updates.stato === 'pagato' && !updates.data_pagamento) {
    updates.data_pagamento = new Date().toISOString()
  }

  const { error } = await sb.from('pagamenti_rata').update(updates).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Se pagata, aggiorna il piano
  if (updates.stato === 'pagato') {
    const { data: rata } = await sb.from('pagamenti_rata').select('piano_id, importo').eq('id', id).single()
    if (rata) {
      const { data: piano } = await sb.from('piani_previdenza').select('rate_pagate, saldo_versato, saldo_residuo').eq('id', rata.piano_id).single()
      if (piano) {
        await sb.from('piani_previdenza').update({
          rate_pagate: (piano.rate_pagate || 0) + 1,
          saldo_versato: (parseFloat(piano.saldo_versato) || 0) + parseFloat(rata.importo),
          saldo_residuo: (parseFloat(piano.saldo_residuo) || 0) - parseFloat(rata.importo),
          updated_at: new Date().toISOString(),
        }).eq('id', rata.piano_id)
      }
    }
  }

  return NextResponse.json({ success: true })
}
