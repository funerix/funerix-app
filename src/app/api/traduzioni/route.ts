import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const GOOGLE_API = 'https://translate.googleapis.com/translate_a/single'
const SEPARATOR = '\n§§§\n'
const BATCH_SIZE = 80 // testi per batch Google

const LINGUE = ['en', 'fr', 'es', 'de', 'pt', 'ro', 'ar', 'ru', 'zh-CN', 'uk', 'pl', 'sq', 'hi', 'bn', 'tl']

const PAGINE = [
  '/', '/chi-siamo', '/contatti', '/prezzi', '/previdenza', '/previdenza/piani',
  '/pet', '/pet/previdenza', '/rimpatri', '/servizi', '/servizi-ricorrenti',
  '/successione', '/esumazione', '/convenzioni', '/guida',
]

/*
  Tabella richiesta in Supabase (creare manualmente dal SQL Editor):

  CREATE TABLE IF NOT EXISTS traduzioni (
    id bigint generated always as identity primary key,
    lingua text not null,
    originale text not null,
    traduzione text not null,
    updated_at timestamptz default now(),
    UNIQUE(lingua, originale)
  );
  CREATE INDEX IF NOT EXISTS idx_traduzioni_lingua ON traduzioni(lingua);
*/

/** GET — Restituisce tutte le traduzioni per una lingua */
export async function GET(req: NextRequest) {
  const lingua = req.nextUrl.searchParams.get('lingua')
  if (!lingua) return NextResponse.json({}, { status: 400 })

  const { data } = await supabase
    .from('traduzioni')
    .select('originale, traduzione')
    .eq('lingua', lingua)

  if (!data) return NextResponse.json({})

  const result: Record<string, string> = {}
  data.forEach(row => { result[row.originale] = row.traduzione })
  return NextResponse.json(result)
}

/** PUT — Salva traduzioni in batch (chiamato dal client dopo traduzione) */
export async function PUT(req: NextRequest) {
  try {
    const { lingua, entries } = await req.json() as {
      lingua: string
      entries: { originale: string; traduzione: string }[]
    }
    if (!lingua || !entries?.length) return NextResponse.json({ ok: false }, { status: 400 })

    // Upsert in batch
    const rows = entries.map(e => ({
      lingua,
      originale: e.originale,
      traduzione: e.traduzione,
      updated_at: new Date().toISOString(),
    }))

    await supabase.from('traduzioni').upsert(rows, { onConflict: 'lingua,originale' })

    return NextResponse.json({ ok: true, count: rows.length })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}

/** POST — Pre-traduce tutte le pagine in tutte le lingue (admin only) */
export async function POST(req: NextRequest) {
  // Verifica admin
  const adminToken = req.cookies.get('funerix-admin-token')?.value
  if (!adminToken) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })

  const { data: admin } = await supabase
    .from('admin_users')
    .select('id')
    .eq('token', adminToken)
    .single()
  if (!admin) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })

  // Raccogli testi da tutte le pagine
  const allTexts = new Set<string>()
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://funerix.com'

  for (const pagina of PAGINE) {
    try {
      const res = await fetch(`${baseUrl}${pagina}`, {
        signal: AbortSignal.timeout(10000),
        headers: { 'User-Agent': 'Funerix-Translator/1.0' },
      })
      const html = await res.text()

      // Estrai testi visibili dal HTML (rimuovi tag, script, style)
      const cleaned = html
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, '\n')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&apos;/g, "'")
        .replace(/&euro;/g, '€')
        .replace(/&egrave;/g, 'è')
        .replace(/&agrave;/g, 'à')
        .replace(/&ograve;/g, 'ò')
        .replace(/&ugrave;/g, 'ù')
        .replace(/&igrave;/g, 'ì')
        .replace(/&Egrave;/g, 'È')

      const lines = cleaned.split('\n')
        .map(l => l.trim())
        .filter(l => l.length >= 3)
        .filter(l => !/^[\d\s€$%.,+\-/:()#@&<>{}[\]"'`=;|\\]+$/.test(l))
        .filter(l => !l.startsWith('{') && !l.startsWith('//') && !l.startsWith('/*'))

      lines.forEach(l => allTexts.add(l))
    } catch {
      // Skip pagina non raggiungibile
    }
  }

  const textsArray = Array.from(allTexts)
  const results: { lingua: string; count: number }[] = []

  // Traduci per ogni lingua
  for (const lingua of LINGUE) {
    try {
      // Controlla cosa è già tradotto
      const { data: existing } = await supabase
        .from('traduzioni')
        .select('originale')
        .eq('lingua', lingua)

      const existingSet = new Set(existing?.map(e => e.originale) || [])
      const toTranslate = textsArray.filter(t => !existingSet.has(t))

      if (toTranslate.length === 0) {
        results.push({ lingua, count: 0 })
        continue
      }

      // Traduci in batch
      const translations: { originale: string; traduzione: string }[] = []

      for (let i = 0; i < toTranslate.length; i += BATCH_SIZE) {
        const batch = toTranslate.slice(i, i + BATCH_SIZE)
        const combined = batch.join(SEPARATOR)

        try {
          const url = `${GOOGLE_API}?client=gtx&sl=it&tl=${lingua}&dt=t&q=${encodeURIComponent(combined)}`
          const res = await fetch(url)
          const data = await res.json()
          const translated = (data[0] as Array<Array<string>>).map(s => s[0]).join('')
          const parts = translated.split(/\s*§§§\s*/)

          batch.forEach((original, j) => {
            const t = parts[j]?.trim()
            if (t && t !== original) {
              translations.push({ originale: original, traduzione: t })
            }
          })
        } catch {
          // Skip batch fallito
        }

        // Rate limiting
        await new Promise(r => setTimeout(r, 200))
      }

      // Salva in DB
      if (translations.length > 0) {
        const rows = translations.map(t => ({
          lingua,
          originale: t.originale,
          traduzione: t.traduzione,
          updated_at: new Date().toISOString(),
        }))

        // Upsert in chunks di 500
        for (let i = 0; i < rows.length; i += 500) {
          await supabase.from('traduzioni').upsert(rows.slice(i, i + 500), { onConflict: 'lingua,originale' })
        }
      }

      results.push({ lingua, count: translations.length })
    } catch {
      results.push({ lingua, count: -1 })
    }
  }

  return NextResponse.json({
    ok: true,
    testi_totali: textsArray.length,
    lingue: results,
  })
}
