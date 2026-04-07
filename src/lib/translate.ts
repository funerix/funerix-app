/**
 * Sistema traduzione Funerix
 * - Google Translate API gratuita
 * - Cache localStorage (client) + Supabase Storage (server)
 * - Batch unico: tutti i testi in una sola chiamata API
 */

const LOCAL_CACHE_KEY = 'funerix-gt-cache'
const API_URL = 'https://translate.googleapis.com/translate_a/single'
const SEPARATOR = '\n§§§\n' // separatore unico per split

// Cache in memoria
const cache = new Map<string, string>()

// Carica cache da localStorage
if (typeof window !== 'undefined') {
  try {
    const saved = localStorage.getItem(LOCAL_CACHE_KEY)
    if (saved) {
      Object.entries(JSON.parse(saved) as Record<string, string>).forEach(([k, v]) => cache.set(k, v))
    }
  } catch { /* ignore */ }
}

function saveLocalCache() {
  try {
    const obj: Record<string, string> = {}
    cache.forEach((v, k) => { obj[k] = v })
    localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(obj))
  } catch { /* ignore */ }
}

/** Carica cache da Supabase Storage per una lingua */
async function loadServerCache(lang: string): Promise<boolean> {
  try {
    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/translations/cache-${lang}.json`
    const res = await fetch(url, { signal: AbortSignal.timeout(3000) })
    if (!res.ok) return false
    const data = await res.json() as Record<string, string>
    let loaded = 0
    Object.entries(data).forEach(([k, v]) => {
      const key = `${lang}:${k}`
      if (!cache.has(key)) {
        cache.set(key, v)
        loaded++
      }
    })
    if (loaded > 0) saveLocalCache()
    return loaded > 0
  } catch { return false }
}

/** Salva cache su Supabase Storage */
async function saveServerCache(lang: string) {
  try {
    const obj: Record<string, string> = {}
    const prefix = `${lang}:`
    cache.forEach((v, k) => {
      if (k.startsWith(prefix)) obj[k.slice(prefix.length)] = v
    })
    if (Object.keys(obj).length === 0) return

    const sbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const sbKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!sbUrl || !sbKey) return

    const blob = new Blob([JSON.stringify(obj)], { type: 'application/json' })
    await fetch(`${sbUrl}/storage/v1/object/translations/cache-${lang}.json`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sbKey}`,
        'x-upsert': 'true',
      },
      body: blob,
    })
  } catch { /* ignore */ }
}

/** Traduce un batch di testi in UNA SOLA chiamata Google */
async function translateBatch(texts: string[], targetLang: string): Promise<string[]> {
  // Concatena tutto con separatore
  const combined = texts.join(SEPARATOR)

  try {
    const url = `${API_URL}?client=gtx&sl=it&tl=${targetLang}&dt=t&q=${encodeURIComponent(combined)}`
    const res = await fetch(url)
    const data = await res.json()

    // Ricostruisci il testo tradotto
    const translated = (data[0] as Array<Array<string>>).map(s => s[0]).join('')

    // Split per separatore
    const parts = translated.split(/\s*§§§\s*/)

    // Mappa risultati
    return texts.map((original, i) => {
      const t = parts[i]?.trim()
      if (t) {
        cache.set(`${targetLang}:${original}`, t)
        return t
      }
      return original
    })
  } catch {
    return texts
  }
}

/** Traduce un array di testi. Cache first, poi Google API. */
export async function translateTexts(texts: string[], targetLang: string): Promise<string[]> {
  if (targetLang === 'it') return texts

  const results: string[] = new Array(texts.length)
  const toFetch: { idx: number; text: string }[] = []

  texts.forEach((text, i) => {
    const cached = cache.get(`${targetLang}:${text}`)
    if (cached) {
      results[i] = cached
    } else if (text.trim().length < 2) {
      results[i] = text
    } else {
      toFetch.push({ idx: i, text })
    }
  })

  if (toFetch.length === 0) return results

  // Traduci tutti i mancanti in un batch unico
  const batchTexts = toFetch.map(f => f.text)
  const translated = await translateBatch(batchTexts, targetLang)

  toFetch.forEach((f, j) => {
    results[f.idx] = translated[j] || f.text
  })

  saveLocalCache()
  // Salva su server in background (non blocca)
  saveServerCache(targetLang).catch(() => {})

  return results
}

// ============================================
// DOM Translation
// ============================================

const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'CODE', 'PRE', 'SVG', 'INPUT', 'TEXTAREA', 'SELECT', 'OPTION', 'NOSCRIPT', 'IMG'])

function collectTextNodes(): { node: Text; text: string }[] {
  const nodes: { node: Text; text: string }[] = []
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const el = node.parentElement
      if (!el) return NodeFilter.FILTER_REJECT
      if (SKIP_TAGS.has(el.tagName)) return NodeFilter.FILTER_REJECT
      if (el.closest('[data-admin]') || el.closest('.notranslate')) return NodeFilter.FILTER_REJECT
      const txt = node.textContent?.trim()
      if (!txt || txt.length < 2) return NodeFilter.FILTER_REJECT
      if (/^[\d\s€$%.,+\-/:()#@&<>]+$/.test(txt)) return NodeFilter.FILTER_REJECT
      return NodeFilter.FILTER_ACCEPT
    },
  })
  while (walker.nextNode()) {
    const t = walker.currentNode as Text
    nodes.push({ node: t, text: t.textContent || '' })
  }
  return nodes
}

/** Traduce tutta la pagina */
export async function translatePage(targetLang: string) {
  if (targetLang === 'it') return

  // Prima prova a caricare cache dal server
  await loadServerCache(targetLang)

  const nodes = collectTextNodes()
  if (nodes.length === 0) return

  const originals = nodes.map(n => n.text)
  const translated = await translateTexts(originals, targetLang)

  nodes.forEach((n, i) => {
    if (translated[i] && translated[i] !== n.text) {
      n.node.textContent = translated[i]
    }
  })
}

// ============================================
// Save/Restore originals
// ============================================

let savedOriginals: { node: Text; text: string }[] = []

export function saveOriginals() {
  savedOriginals = collectTextNodes()
}

export function restoreOriginals() {
  savedOriginals.forEach(({ node, text }) => {
    if (node.isConnected) node.textContent = text
  })
  savedOriginals = []
}
