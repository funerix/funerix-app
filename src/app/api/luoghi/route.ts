import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET /api/luoghi?tipo=cimitero|chiesa&q=search
export async function GET(req: NextRequest) {
  const tipo = req.nextUrl.searchParams.get('tipo') || 'cimitero'
  const q = req.nextUrl.searchParams.get('q') || ''
  const table = tipo === 'chiesa' ? 'chiese' : 'cimiteri'

  let query = sb.from(table).select('id, nome, comune, provincia, indirizzo, cap').eq('attivo', true)

  if (q.length >= 2) {
    query = query.or(`nome.ilike.%${q}%,comune.ilike.%${q}%`)
  }

  const { data } = await query.order('provincia').order('comune').limit(50)
  return NextResponse.json(data || [])
}
