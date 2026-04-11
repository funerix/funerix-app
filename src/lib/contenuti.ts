import { createClient } from '@supabase/supabase-js'

/**
 * Legge i contenuti extra dal DB per le pagine server-side.
 * Usato dalle pagine che NON possono usare useSitoStore (server components).
 */
export async function getContenutiExtra(): Promise<Record<string, string>> {
  try {
    const sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const { data } = await sb.from('contenuti').select('extra').eq('id', 1).single()
    return (data?.extra as Record<string, string>) || {}
  } catch {
    return {}
  }
}
