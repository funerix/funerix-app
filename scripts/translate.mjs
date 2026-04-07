#!/usr/bin/env node
/**
 * Script di sync traduzioni: legge it.json e genera tutti gli altri file via DeepL API
 * Uso: npm run translate
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const MESSAGES_DIR = path.resolve(__dirname, '../src/i18n/messages')
const API_KEY = process.env.DEEPL_API_KEY

if (!API_KEY) {
  console.error('❌ DEEPL_API_KEY mancante. Aggiungi in .env.local')
  process.exit(1)
}

// DeepL Free API endpoint
const DEEPL_URL = 'https://api-free.deepl.com/v2/translate'

// Mappa codici lingua → codici DeepL
const DEEPL_CODES = {
  en: 'EN', fr: 'FR', es: 'ES', de: 'DE', pt: 'PT-BR', ro: 'RO',
  uk: 'UK', pl: 'PL', sq: 'SQ', zh: 'ZH-HANS', ru: 'RU',
  ar: 'AR', hi: null, bn: null, tl: null, // DeepL non supporta queste 3
}

async function translateText(text, targetLang) {
  const res = await fetch(DEEPL_URL, {
    method: 'POST',
    headers: {
      'Authorization': `DeepL-Auth-Key ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: [text],
      source_lang: 'IT',
      target_lang: targetLang,
    }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`DeepL error ${res.status}: ${err}`)
  }
  const data = await res.json()
  return data.translations[0].text
}

// Traduce batch di testi (max 50 per chiamata DeepL)
async function translateBatch(texts, targetLang) {
  const results = []
  const BATCH_SIZE = 50
  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE)
    const res = await fetch(DEEPL_URL, {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: batch,
        source_lang: 'IT',
        target_lang: targetLang,
      }),
    })
    if (!res.ok) throw new Error(`DeepL error ${res.status}`)
    const data = await res.json()
    results.push(...data.translations.map(t => t.text))
  }
  return results
}

// Estrae tutti i valori stringa con i loro path
function flattenMessages(obj, prefix = '') {
  const entries = []
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    if (typeof value === 'object' && value !== null) {
      entries.push(...flattenMessages(value, fullKey))
    } else if (typeof value === 'string') {
      entries.push({ key: fullKey, value })
    }
  }
  return entries
}

// Ricostruisce l'oggetto annidato da path/value
function unflattenMessages(entries) {
  const result = {}
  for (const { key, value } of entries) {
    const parts = key.split('.')
    let current = result
    for (let i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]]) current[parts[i]] = {}
      current = current[parts[i]]
    }
    current[parts[parts.length - 1]] = value
  }
  return result
}

async function main() {
  console.log('🌍 Funerix Translation Sync\n')

  // Leggi italiano come sorgente
  const itPath = path.join(MESSAGES_DIR, 'it.json')
  const itMessages = JSON.parse(fs.readFileSync(itPath, 'utf-8'))
  const entries = flattenMessages(itMessages)
  const texts = entries.map(e => e.value)

  console.log(`📝 ${texts.length} stringhe da tradurre\n`)

  // Controlla usage DeepL
  const usageRes = await fetch('https://api-free.deepl.com/v2/usage', {
    headers: { Authorization: `DeepL-Auth-Key ${API_KEY}` },
  })
  const usage = await usageRes.json()
  console.log(`📊 DeepL usage: ${usage.character_count?.toLocaleString()}/${usage.character_limit?.toLocaleString()} caratteri\n`)

  for (const [langCode, deeplCode] of Object.entries(DEEPL_CODES)) {
    if (!deeplCode) {
      console.log(`⏭️  ${langCode} — non supportato da DeepL, mantengo file esistente`)
      continue
    }

    try {
      process.stdout.write(`🔄 ${langCode} (${deeplCode})... `)
      const translated = await translateBatch(texts, deeplCode)
      const translatedEntries = entries.map((e, i) => ({ key: e.key, value: translated[i] }))
      const result = unflattenMessages(translatedEntries)

      const outPath = path.join(MESSAGES_DIR, `${langCode}.json`)
      fs.writeFileSync(outPath, JSON.stringify(result, null, 2) + '\n', 'utf-8')
      console.log(`✅ ${translated.length} stringhe`)
    } catch (err) {
      console.log(`❌ ${err.message}`)
    }
  }

  console.log('\n✅ Sync completata!')
}

main().catch(console.error)
