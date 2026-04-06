import { describe, it as test, expect } from 'vitest'
import { locales, defaultLocale } from '@/i18n/config'
import itMessages from '@/i18n/messages/it.json'
import enMessages from '@/i18n/messages/en.json'
import fs from 'fs'
import path from 'path'

describe('i18n config', () => {
  test('default locale is Italian', () => {
    expect(defaultLocale).toBe('it')
  })

  test('has 16 supported locales', () => {
    expect(locales).toHaveLength(16)
  })
})

describe('translation files', () => {
  const itKeys = getAllKeys(itMessages)

  test('Italian file has all required sections', () => {
    expect(itMessages).toHaveProperty('header')
    expect(itMessages).toHaveProperty('home')
    expect(itMessages).toHaveProperty('footer')
    expect(itMessages).toHaveProperty('cookie')
    expect(itMessages).toHaveProperty('configuratore')
    expect(itMessages).toHaveProperty('common')
  })

  test('English file has same keys as Italian', () => {
    const enKeys = getAllKeys(enMessages)
    expect(enKeys).toEqual(itKeys)
  })

  test('all 16 locale files exist', () => {
    const messagesDir = path.resolve(__dirname, '../i18n/messages')
    for (const locale of locales) {
      const filePath = path.join(messagesDir, `${locale}.json`)
      expect(fs.existsSync(filePath), `Missing: ${locale}.json`).toBe(true)
    }
  })

  test('all locale files have same structure as Italian', () => {
    const messagesDir = path.resolve(__dirname, '../i18n/messages')
    for (const locale of locales) {
      const filePath = path.join(messagesDir, `${locale}.json`)
      const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
      const keys = getAllKeys(content)
      expect(keys, `${locale}.json has mismatched keys`).toEqual(itKeys)
    }
  })

  test('no empty translation values', () => {
    const messagesDir = path.resolve(__dirname, '../i18n/messages')
    for (const locale of locales) {
      const filePath = path.join(messagesDir, `${locale}.json`)
      const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
      const values = getAllValues(content)
      values.forEach(({ key, value }) => {
        expect(value.trim().length, `Empty value in ${locale}.json: ${key}`).toBeGreaterThan(0)
      })
    }
  })
})

// Helpers
function getAllKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  const keys: string[] = []
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    if (typeof value === 'object' && value !== null) {
      keys.push(...getAllKeys(value as Record<string, unknown>, fullKey))
    } else {
      keys.push(fullKey)
    }
  }
  return keys.sort()
}

function getAllValues(obj: Record<string, unknown>, prefix = ''): { key: string; value: string }[] {
  const result: { key: string; value: string }[] = []
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    if (typeof value === 'object' && value !== null) {
      result.push(...getAllValues(value as Record<string, unknown>, fullKey))
    } else if (typeof value === 'string') {
      result.push({ key: fullKey, value })
    }
  }
  return result
}
