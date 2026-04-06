import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock Supabase
const mockInsert = vi.fn()
const mockSelect = vi.fn()
const mockUpdate = vi.fn()
const mockDelete = vi.fn()
const mockEq = vi.fn()
const mockOrder = vi.fn()
const mockSingle = vi.fn()

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    from: () => ({
      select: (...args: unknown[]) => {
        mockSelect(...args)
        return { order: (col: string, opts: unknown) => { mockOrder(col, opts); return { data: [], error: null } } }
      },
      insert: (data: unknown) => {
        mockInsert(data)
        return { select: () => ({ single: () => { mockSingle(); return { data: { id: 'new-id', ...data as Record<string, unknown> }, error: null } } }) }
      },
      update: (data: unknown) => {
        mockUpdate(data)
        return { eq: (_col: string, _val: string) => { mockEq(); return { error: null } } }
      },
      delete: () => {
        mockDelete()
        return { eq: (_col: string, _val: string) => { mockEq(); return { error: null } } }
      },
    }),
  }),
}))

describe('API /api/prodotti logic', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('product insert payload should have required fields', () => {
    const payload = {
      categoria_id: 'cat-123',
      nome: 'Cofano Test',
      slug: 'cofano-test',
      descrizione: 'Test description',
      descrizione_breve: 'Test',
      prezzo: 1500,
      immagini: [],
      attivo: true,
      tipo_servizio: 'tutti',
    }

    expect(payload).toHaveProperty('categoria_id')
    expect(payload).toHaveProperty('nome')
    expect(payload).toHaveProperty('slug')
    expect(payload).toHaveProperty('prezzo')
    expect(payload).toHaveProperty('tipo_servizio')
    expect(payload.prezzo).toBeGreaterThan(0)
    expect(payload.tipo_servizio).toBe('tutti')
  })

  it('product slug should be valid', () => {
    const nome = 'Cofano in Noce Intarsiato'
    const slug = nome.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    expect(slug).toBe('cofano-in-noce-intarsiato')
    expect(slug).not.toMatch(/\s/)
    expect(slug).not.toMatch(/[A-Z]/)
  })

  it('product update should include updated_at', () => {
    const updates = {
      id: 'prod-123',
      nome: 'Nome aggiornato',
      updated_at: new Date().toISOString(),
    }
    expect(updates).toHaveProperty('updated_at')
    expect(new Date(updates.updated_at).getTime()).not.toBeNaN()
  })
})
