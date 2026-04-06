import { describe, it, expect } from 'vitest'

// Test utility functions used across the app

describe('Slug generation', () => {
  const toSlug = (s: string) => s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  it('converts spaces to hyphens', () => {
    expect(toSlug('Cofano in Rovere')).toBe('cofano-in-rovere')
  })

  it('removes special characters', () => {
    expect(toSlug('Urna (Speciale)')).toBe('urna-speciale')
  })

  it('handles accented characters', () => {
    expect(toSlug('Servizio Funerè')).toBe('servizio-funer')
  })

  it('lowercase only', () => {
    expect(toSlug('BMW Premium')).toBe('bmw-premium')
  })
})

describe('Price formatting', () => {
  const formatPrezzo = (n: number) => new Intl.NumberFormat('it-IT').format(n)

  it('formats thousands with separator', () => {
    const result = formatPrezzo(1500)
    // Node may use '.' or non-breaking space depending on ICU
    expect(result).toMatch(/1.?500/)
  })

  it('formats small numbers without separator', () => {
    expect(formatPrezzo(60)).toBe('60')
  })

  it('formats large numbers with separator', () => {
    const result = formatPrezzo(7000)
    expect(result).toMatch(/7.?000/)
  })
})

describe('WhatsApp URL builder', () => {
  const buildWhatsAppUrl = (phone: string, msg: string) => {
    const num = phone.replace(/\s/g, '')
    return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`
  }

  it('strips spaces from phone', () => {
    const url = buildWhatsAppUrl('+39 333 123 4567', 'Test')
    expect(url).toContain('wa.me/+393331234567')
  })

  it('encodes message', () => {
    const url = buildWhatsAppUrl('+39333', 'Ciao, vorrei info')
    expect(url).toContain('Ciao%2C%20vorrei%20info')
  })
})

describe('hasAccess role check', () => {
  function hasAccess(itemRuolo: string, userRuolo: string, userPermessi: Record<string, boolean>): boolean {
    if (itemRuolo === 'tutti') return true
    if (itemRuolo === 'admin') return userRuolo === 'admin'
    if (itemRuolo === 'manager+') return userRuolo === 'admin' || userRuolo === 'manager'
    if (itemRuolo.startsWith('perm:')) {
      const perm = itemRuolo.replace('perm:', '')
      if (userRuolo === 'admin') return true
      if (userRuolo === 'manager') return true
      return userPermessi[perm] === true
    }
    return false
  }

  it('tutti grants access to everyone', () => {
    expect(hasAccess('tutti', 'consulente', {})).toBe(true)
    expect(hasAccess('tutti', 'admin', {})).toBe(true)
  })

  it('admin restricts to admin only', () => {
    expect(hasAccess('admin', 'admin', {})).toBe(true)
    expect(hasAccess('admin', 'manager', {})).toBe(false)
    expect(hasAccess('admin', 'consulente', {})).toBe(false)
  })

  it('manager+ grants admin and manager', () => {
    expect(hasAccess('manager+', 'admin', {})).toBe(true)
    expect(hasAccess('manager+', 'manager', {})).toBe(true)
    expect(hasAccess('manager+', 'consulente', {})).toBe(false)
  })

  it('perm: checks specific permission for consulente', () => {
    expect(hasAccess('perm:analytics_globali', 'consulente', { analytics_globali: true })).toBe(true)
    expect(hasAccess('perm:analytics_globali', 'consulente', {})).toBe(false)
    expect(hasAccess('perm:analytics_globali', 'consulente', { analytics_globali: false })).toBe(false)
  })

  it('perm: admin/manager bypass permission check', () => {
    expect(hasAccess('perm:prodotti', 'admin', {})).toBe(true)
    expect(hasAccess('perm:prodotti', 'manager', {})).toBe(true)
  })
})
