import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET /api/setup-translations — crea tabella cache traduzioni (una tantum)
export async function GET() {
  try {
    // Check if table exists
    const { error: checkError } = await sb.from('traduzioni_cache').select('id').limit(1)

    if (checkError && checkError.code === 'PGRST205') {
      // Table doesn't exist - tell user to create it
      return NextResponse.json({
        message: 'Tabella traduzioni_cache non esiste. Creala dal Supabase Dashboard SQL Editor:',
        sql: `CREATE TABLE traduzioni_cache (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  testo_originale text NOT NULL,
  lingua text NOT NULL,
  traduzione text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(testo_originale, lingua)
);
CREATE INDEX idx_traduzioni_lookup ON traduzioni_cache(lingua, testo_originale);`
      })
    }

    // Table exists, count entries
    const { count } = await sb.from('traduzioni_cache').select('id', { count: 'exact', head: true })
    return NextResponse.json({
      status: 'ok',
      message: 'Tabella traduzioni_cache esiste',
      entries: count
    })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
