import { describe, it, expect } from 'vitest'
import type { Prodotto, Categoria, ConfiguratoreState } from '@/types'

describe('Types integrity', () => {
  it('Prodotto has required fields', () => {
    const prodotto: Prodotto = {
      id: 'test-1',
      categoriaId: 'cat-1',
      nome: 'Cofano Test',
      slug: 'cofano-test',
      descrizione: 'Descrizione test',
      descrizioneBreve: 'Breve',
      prezzo: 1500,
      immagini: [],
      attivo: true,
      tipoServizio: 'tutti',
    }
    expect(prodotto.id).toBe('test-1')
    expect(prodotto.prezzo).toBe(1500)
    expect(prodotto.attivo).toBe(true)
  })

  it('Prodotto prezzo must be a number', () => {
    const prodotto: Prodotto = {
      id: '1', categoriaId: '1', nome: 'Test', slug: 'test',
      descrizione: '', descrizioneBreve: '', prezzo: 0,
      immagini: [], attivo: true, tipoServizio: 'tutti',
    }
    expect(typeof prodotto.prezzo).toBe('number')
    expect(prodotto.prezzo).toBeGreaterThanOrEqual(0)
  })

  it('Categoria has required fields', () => {
    const cat: Categoria = {
      id: 'cat-1', nome: 'Bare', slug: 'bare',
      descrizione: 'Cofani funebri', ordine: 1, icona: '', attiva: true,
    }
    expect(cat.slug).toBe('bare')
    expect(cat.attiva).toBe(true)
  })

  it('ConfiguratoreState starts with step 0 and null selections', () => {
    const state: ConfiguratoreState = {
      step: 0, tipoServizio: null, bara: null, urna: null,
      autoFunebre: null, percorso: null, cerimonia: null,
      fiori: [], serviziExtra: [], totale: 0,
    }
    expect(state.step).toBe(0)
    expect(state.totale).toBe(0)
    expect(state.fiori).toEqual([])
  })

  it('tipoServizio accepts valid values', () => {
    const values: Prodotto['tipoServizio'][] = ['inumazione', 'tumulazione', 'cremazione', 'tutti']
    values.forEach(v => expect(typeof v).toBe('string'))
  })
})
