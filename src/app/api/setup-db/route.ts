import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// This endpoint creates missing tables. Call once after deploy.
export async function GET() {
  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { db: { schema: 'public' } }
  )

  const results: string[] = []

  // Check if traduzioni_cache exists
  const { error } = await sb.from('traduzioni_cache').select('id').limit(1)

  if (error?.code === 'PGRST205') {
    // Table doesn't exist. Since we can't CREATE TABLE via PostgREST,
    // we'll use a different approach: store translations as JSONB in a generic table
    // Check if we have a generic kv_store table
    const { error: kvError } = await sb.from('kv_store').select('id').limit(1)

    if (kvError?.code === 'PGRST205') {
      results.push('AZIONE RICHIESTA: Vai su Supabase Dashboard → SQL Editor ed esegui:')
      results.push('')
      results.push('CREATE TABLE traduzioni_cache (')
      results.push('  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,')
      results.push('  testo_originale text NOT NULL,')
      results.push('  lingua text NOT NULL,')
      results.push('  traduzione text NOT NULL,')
      results.push('  created_at timestamptz DEFAULT now(),')
      results.push('  UNIQUE(testo_originale, lingua)')
      results.push(');')
      results.push('CREATE INDEX idx_traduzioni_lookup ON traduzioni_cache(lingua, testo_originale);')
    }
  } else {
    results.push('Tabella traduzioni_cache: OK')
    const { count } = await sb.from('traduzioni_cache').select('id', { count: 'exact', head: true })
    results.push(`Traduzioni cached: ${count || 0}`)
  }

  return NextResponse.json({ results })
}
