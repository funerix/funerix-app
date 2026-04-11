/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand'
import { Prodotto, Categoria } from '@/types'
import { getSupabase } from '@/lib/supabase-client'

// ========== Types ==========

export interface MemorialEntry {
  id: string
  nome: string
  foto: string
  dataNascita: string
  dataMorte: string
  comune: string
  biografia: string
  luogoSepoltura: string
  donazioneUrl: string
  donazioneDescrizione: string
  attivo: boolean
  messaggi: { id: string; autore: string; contenuto: string; createdAt: string }[]
}

export interface RichiestaPreventivo {
  id: string
  nome: string
  telefono: string
  email: string
  modalita: string
  orario: string
  note: string
  configurazione: string
  totale: number
  stato: 'nuova' | 'in_lavorazione' | 'confermata' | 'completata'
  createdAt: string
}

export interface ImpostazioniSito {
  ragioneSociale: string
  partitaIva: string
  telefono: string
  whatsapp: string
  email: string
  indirizzo: string
  orari: string
  registroRegionale: string
  autorizzazioneComunale: string
  kmInclusi: number
  costoKmExtra: number
  comuniServiti: string
  emailRichieste: string
  emailMemorial: string
  whatsappBusinessToken: string
  whatsappBusinessPhoneId: string
  whatsappBusinessEnabled: boolean
}

export interface ContenutiSito {
  heroTitolo: string
  heroSottotitolo: string
  heroBottone: string
  chiSiamoTitolo: string
  chiSiamoSottotitolo: string
  chiSiamoStoria: string
  footerDescrizione: string
  footerCopyright: string
  footerNotaPreventivi: string
  disclaimerPreventivo: string
  metaTitle: string
  metaDescription: string
  metaKeywords: string
  // Campi extra per CMS completo (salvati in colonna JSONB 'extra')
  extra: Record<string, string>
}

// ========== Store ==========

export interface ServiziHomepage { id: string; titolo: string; descrizione: string; href: string; immagine: string; icona: string; ordine: number; attivo: boolean }
export interface FaqItem { id: string; domanda: string; risposta: string; ordine: number; attivo: boolean }
export interface Testimonianza { id: string; nome: string; citta: string; testo: string; stelle: number; attivo: boolean }

interface SitoStore {
  // State
  prodotti: Prodotto[]
  categorie: Categoria[]
  memorial: MemorialEntry[]
  richieste: RichiestaPreventivo[]
  serviziHomepage: ServiziHomepage[]
  faqList: FaqItem[]
  testimonianzeList: Testimonianza[]
  impostazioni: ImpostazioniSito
  contenuti: ContenutiSito
  loaded: boolean

  // Init
  loadFromSupabase: () => Promise<void>

  // Prodotti
  aggiungiProdotto: (p: Omit<Prodotto, 'id'>) => Promise<void>
  modificaProdotto: (id: string, p: Partial<Prodotto>) => Promise<void>
  eliminaProdotto: (id: string) => Promise<void>
  toggleProdottoAttivo: (id: string) => Promise<void>

  // Memorial
  aggiungiMemorial: (m: Omit<MemorialEntry, 'id' | 'messaggi'>) => Promise<void>
  modificaMemorial: (id: string, m: Partial<MemorialEntry>) => Promise<void>
  eliminaMemorial: (id: string) => Promise<void>
  aggiungiMessaggioMemorial: (memorialId: string, autore: string, contenuto: string) => Promise<void>

  // Richieste
  aggiungiRichiesta: (r: Omit<RichiestaPreventivo, 'id'>) => Promise<void>
  aggiornaStatoRichiesta: (id: string, stato: RichiestaPreventivo['stato']) => Promise<void>

  // Impostazioni & Contenuti
  salvaImpostazioni: (i: Partial<ImpostazioniSito>) => Promise<void>
  salvaContenuti: (c: Partial<ContenutiSito>) => Promise<void>
}

const defaultImpostazioni: ImpostazioniSito = {
  ragioneSociale: 'Funerix S.r.l.',
  partitaIva: '',
  telefono: '081 555 1234',
  whatsapp: '393331234567',
  email: 'info@funerix.com',
  indirizzo: 'Via Roma 123, 80100 Napoli (NA)',
  orari: 'Lun-Sab 9:00-18:00',
  registroRegionale: '',
  autorizzazioneComunale: '',
  kmInclusi: 20,
  costoKmExtra: 3,
  comuniServiti: 'Napoli, Caserta, Salerno, Avellino, Benevento e province',
  emailRichieste: 'richieste@funerix.com',
  emailMemorial: 'memorial@funerix.com',
  whatsappBusinessToken: '',
  whatsappBusinessPhoneId: '',
  whatsappBusinessEnabled: false,
}

const defaultContenuti: ContenutiSito = {
  heroTitolo: 'Vi accompagniamo con cura nei momenti più difficili',
  heroSottotitolo: 'Configurate il servizio funebre per il vostro caro in tutta tranquillità. Prezzi trasparenti, nessun obbligo, massimo rispetto.',
  heroBottone: 'Configura il Servizio',
  chiSiamoTitolo: 'Chi Siamo',
  chiSiamoSottotitolo: "Da oltre trent'anni al fianco delle famiglie campane.",
  chiSiamoStoria: '',
  footerDescrizione: 'Accompagniamo le famiglie con rispetto e dignità nei momenti più difficili.',
  footerCopyright: 'Funerix — Tutti i diritti riservati.',
  footerNotaPreventivi: 'I preventivi generati online sono indicativi e non costituiscono proposta contrattuale.',
  disclaimerPreventivo: '',
  metaTitle: 'Funerix — Servizi Funebri in Campania',
  metaDescription: 'Configura il servizio funebre con rispetto e trasparenza.',
  metaKeywords: 'onoranze funebri, funerali Campania, servizi funebri Napoli',
  extra: {},
}

// Helpers per mappare snake_case DB → camelCase app
function mapProdotto(row: Record<string, unknown>): Prodotto {
  return {
    id: row.id as string,
    categoriaId: row.categoria_id as string,
    nome: row.nome as string,
    slug: row.slug as string,
    descrizione: row.descrizione as string,
    descrizioneBreve: row.descrizione_breve as string,
    materiale: row.materiale as string | undefined,
    dimensioni: row.dimensioni as string | undefined,
    prezzo: Number(row.prezzo),
    immagini: (row.immagini as string[]) || [],
    attivo: row.attivo as boolean,
    tipoServizio: row.tipo_servizio as Prodotto['tipoServizio'],
  }
}

function mapImpostazioni(row: Record<string, unknown>): ImpostazioniSito {
  return {
    ragioneSociale: (row.ragione_sociale as string) || defaultImpostazioni.ragioneSociale,
    partitaIva: (row.partita_iva as string) || '',
    telefono: (row.telefono as string) || defaultImpostazioni.telefono,
    whatsapp: (row.whatsapp as string) || defaultImpostazioni.whatsapp,
    email: (row.email as string) || defaultImpostazioni.email,
    indirizzo: (row.indirizzo as string) || defaultImpostazioni.indirizzo,
    orari: (row.orari as string) || defaultImpostazioni.orari,
    registroRegionale: (row.registro_regionale as string) || '',
    autorizzazioneComunale: (row.autorizzazione_comunale as string) || '',
    kmInclusi: Number(row.km_inclusi) || 20,
    costoKmExtra: Number(row.costo_km_extra) || 3,
    comuniServiti: (row.comuni_serviti as string) || defaultImpostazioni.comuniServiti,
    emailRichieste: (row.email_richieste as string) || defaultImpostazioni.emailRichieste,
    emailMemorial: (row.email_memorial as string) || defaultImpostazioni.emailMemorial,
    whatsappBusinessToken: (row.whatsapp_business_token as string) || '',
    whatsappBusinessPhoneId: (row.whatsapp_business_phone_id as string) || '',
    whatsappBusinessEnabled: (row.whatsapp_business_enabled as boolean) || false,
  }
}

function mapContenuti(row: Record<string, unknown>): ContenutiSito {
  return {
    heroTitolo: (row.hero_titolo as string) || defaultContenuti.heroTitolo,
    heroSottotitolo: (row.hero_sottotitolo as string) || defaultContenuti.heroSottotitolo,
    heroBottone: (row.hero_bottone as string) || defaultContenuti.heroBottone,
    chiSiamoTitolo: (row.chi_siamo_titolo as string) || defaultContenuti.chiSiamoTitolo,
    chiSiamoSottotitolo: (row.chi_siamo_sottotitolo as string) || defaultContenuti.chiSiamoSottotitolo,
    chiSiamoStoria: (row.chi_siamo_storia as string) || '',
    footerDescrizione: (row.footer_descrizione as string) || defaultContenuti.footerDescrizione,
    footerCopyright: (row.footer_copyright as string) || defaultContenuti.footerCopyright,
    footerNotaPreventivi: (row.footer_nota_preventivi as string) || defaultContenuti.footerNotaPreventivi,
    disclaimerPreventivo: (row.disclaimer_preventivo as string) || '',
    metaTitle: (row.meta_title as string) || defaultContenuti.metaTitle,
    metaDescription: (row.meta_description as string) || defaultContenuti.metaDescription,
    metaKeywords: (row.meta_keywords as string) || defaultContenuti.metaKeywords,
    extra: (row.extra as Record<string, string>) || {},
  }
}

function mapMemorial(row: Record<string, unknown>, messaggi: Record<string, unknown>[] = []): MemorialEntry {
  return {
    id: row.id as string,
    nome: row.nome as string,
    foto: (row.foto as string) || '',
    dataNascita: row.data_nascita as string,
    dataMorte: row.data_morte as string,
    comune: (row.comune as string) || '',
    biografia: (row.biografia as string) || '',
    luogoSepoltura: (row.luogo_sepoltura as string) || '',
    donazioneUrl: (row.donazione_url as string) || '',
    donazioneDescrizione: (row.donazione_descrizione as string) || '',
    attivo: row.attivo as boolean,
    messaggi: messaggi.map(m => ({
      id: m.id as string,
      autore: m.autore as string,
      contenuto: m.contenuto as string,
      createdAt: m.created_at as string,
    })),
  }
}

function mapRichiesta(row: Record<string, unknown>): RichiestaPreventivo {
  return {
    id: row.id as string,
    nome: row.nome as string,
    telefono: row.telefono as string,
    email: (row.email as string) || '',
    modalita: (row.modalita as string) || '',
    orario: (row.orario as string) || '',
    note: (row.note as string) || '',
    configurazione: (row.configurazione as string) || '',
    totale: Number(row.totale),
    stato: row.stato as RichiestaPreventivo['stato'],
    createdAt: row.created_at as string,
  }
}

export const useSitoStore = create<SitoStore>()((set, get) => ({
  prodotti: [],
  categorie: [],
  memorial: [],
  richieste: [],
  serviziHomepage: [],
  faqList: [],
  testimonianzeList: [],
  impostazioni: defaultImpostazioni,
  contenuti: defaultContenuti,
  loaded: false,

  loadFromSupabase: async () => {
    if (get().loaded) return
    // Rimuovi vecchio localStorage store
    if (typeof window !== 'undefined') localStorage.removeItem('funerix-sito')
    const sb = getSupabase()

    const [catRes, prodRes, memRes, msgRes, reqRes, impRes, contRes, servRes, faqRes, testRes] = await Promise.all([
      sb.from('categorie').select('*').order('ordine'),
      sb.from('prodotti').select('*').order('nome'),
      sb.from('memorial').select('*').order('created_at', { ascending: false }),
      sb.from('messaggi_memorial').select('*').order('created_at'),
      sb.from('richieste').select('*').order('created_at', { ascending: false }),
      sb.from('impostazioni').select('*').eq('id', 1).single(),
      sb.from('contenuti').select('*').eq('id', 1).single(),
      sb.from('servizi_homepage').select('*').eq('attivo', true).order('ordine'),
      sb.from('faq').select('*').eq('attivo', true).order('ordine'),
      sb.from('testimonianze').select('*').eq('attivo', true),
    ])

    const messaggiByMemorial: Record<string, Record<string, unknown>[]> = {}
    for (const m of (msgRes.data || []) as any[]) {
      const mid = m.memorial_id as string
      if (!messaggiByMemorial[mid]) messaggiByMemorial[mid] = []
      messaggiByMemorial[mid].push(m)
    }

    set({
      categorie: (catRes.data || []).map((r: Record<string, unknown>) => ({
        id: r.id as string, nome: r.nome as string, slug: r.slug as string, descrizione: r.descrizione as string,
        ordine: r.ordine as number, icona: r.icona as string, attiva: r.attiva as boolean,
      })),
      prodotti: (prodRes.data || []).map((r: any) => mapProdotto(r)),
      memorial: (memRes.data || []).map((r: any) => mapMemorial(r, messaggiByMemorial[r.id as string] || [])),
      richieste: (reqRes.data || []).map((r: any) => mapRichiesta(r)),
      impostazioni: impRes.data ? mapImpostazioni(impRes.data) : defaultImpostazioni,
      contenuti: contRes.data ? mapContenuti(contRes.data) : defaultContenuti,
      serviziHomepage: (servRes.data || []) as any as ServiziHomepage[],
      faqList: (faqRes.data || []) as any as FaqItem[],
      testimonianzeList: (testRes.data || []) as any as Testimonianza[],
      loaded: true,
    })
  },

  // === Prodotti ===
  aggiungiProdotto: async (p) => {
    const res = await fetch('/api/prodotti', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        categoria_id: p.categoriaId, nome: p.nome, slug: p.slug,
        descrizione: p.descrizione, descrizione_breve: p.descrizioneBreve,
        materiale: p.materiale, dimensioni: p.dimensioni, prezzo: p.prezzo,
        immagini: p.immagini, attivo: p.attivo, tipo_servizio: p.tipoServizio,
      }),
    })
    const data = await res.json()
    if (data && !data.error) set((s) => ({ prodotti: [...s.prodotti, mapProdotto(data)] }))
  },

  modificaProdotto: async (id, updates) => {
    const dbUpdates: Record<string, unknown> = { id }
    if (updates.nome !== undefined) dbUpdates.nome = updates.nome
    if (updates.slug !== undefined) dbUpdates.slug = updates.slug
    if (updates.descrizione !== undefined) dbUpdates.descrizione = updates.descrizione
    if (updates.descrizioneBreve !== undefined) dbUpdates.descrizione_breve = updates.descrizioneBreve
    if (updates.materiale !== undefined) dbUpdates.materiale = updates.materiale
    if (updates.dimensioni !== undefined) dbUpdates.dimensioni = updates.dimensioni
    if (updates.prezzo !== undefined) dbUpdates.prezzo = updates.prezzo
    if (updates.immagini !== undefined) dbUpdates.immagini = updates.immagini
    if (updates.attivo !== undefined) dbUpdates.attivo = updates.attivo
    if (updates.tipoServizio !== undefined) dbUpdates.tipo_servizio = updates.tipoServizio
    if (updates.categoriaId !== undefined) dbUpdates.categoria_id = updates.categoriaId
    dbUpdates.updated_at = new Date().toISOString()

    await fetch('/api/prodotti', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dbUpdates),
    })
    set((s) => ({ prodotti: s.prodotti.map(p => p.id === id ? { ...p, ...updates } : p) }))
  },

  eliminaProdotto: async (id) => {
    await fetch('/api/prodotti', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    set((s) => ({ prodotti: s.prodotti.filter(p => p.id !== id) }))
  },

  toggleProdottoAttivo: async (id) => {
    const p = get().prodotti.find(p => p.id === id)
    if (!p) return
    await fetch('/api/prodotti', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, attivo: !p.attivo }),
    })
    set((s) => ({ prodotti: s.prodotti.map(pr => pr.id === id ? { ...pr, attivo: !pr.attivo } : pr) }))
  },

  // === Memorial ===
  aggiungiMemorial: async (m) => {
    const sb = getSupabase()
    const { data } = await sb.from('memorial').insert({
      nome: m.nome, foto: m.foto, data_nascita: m.dataNascita, data_morte: m.dataMorte,
      comune: m.comune, biografia: m.biografia, luogo_sepoltura: m.luogoSepoltura,
      donazione_url: m.donazioneUrl, donazione_descrizione: m.donazioneDescrizione, attivo: m.attivo,
    }).select().single()
    if (data) set((s) => ({ memorial: [mapMemorial(data), ...s.memorial] }))
  },

  modificaMemorial: async (id, updates) => {
    const sb = getSupabase()
    const dbUpdates: Record<string, unknown> = {}
    if (updates.nome !== undefined) dbUpdates.nome = updates.nome
    if (updates.foto !== undefined) dbUpdates.foto = updates.foto
    if (updates.comune !== undefined) dbUpdates.comune = updates.comune
    if (updates.biografia !== undefined) dbUpdates.biografia = updates.biografia
    if (updates.attivo !== undefined) dbUpdates.attivo = updates.attivo
    if (updates.luogoSepoltura !== undefined) dbUpdates.luogo_sepoltura = updates.luogoSepoltura

    await sb.from('memorial').update(dbUpdates).eq('id', id)
    set((s) => ({ memorial: s.memorial.map(m => m.id === id ? { ...m, ...updates } : m) }))
  },

  eliminaMemorial: async (id) => {
    const sb = getSupabase()
    await sb.from('memorial').delete().eq('id', id)
    set((s) => ({ memorial: s.memorial.filter(m => m.id !== id) }))
  },

  aggiungiMessaggioMemorial: async (memorialId, autore, contenuto) => {
    const sb = getSupabase()
    const { data } = await sb.from('messaggi_memorial').insert({
      memorial_id: memorialId, autore, contenuto,
    }).select().single()
    if (data) {
      set((s) => ({
        memorial: s.memorial.map(m =>
          m.id === memorialId
            ? { ...m, messaggi: [...m.messaggi, { id: data.id, autore, contenuto, createdAt: data.created_at }] }
            : m
        ),
      }))
    }
  },

  // === Richieste ===
  aggiungiRichiesta: async (r) => {
    const sb = getSupabase()
    const { data } = await sb.from('richieste').insert({
      nome: r.nome, telefono: r.telefono, email: r.email,
      modalita: r.modalita, orario: r.orario, note: r.note,
      configurazione: r.configurazione, totale: r.totale, stato: r.stato,
    }).select().single()
    if (data) {
      set((s) => ({ richieste: [mapRichiesta(data), ...s.richieste] }))
      // Notifica consulente (WhatsApp/email) in background
      fetch('/api/notifica', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ richiestaId: data.id }),
      }).catch(() => {})
    }
  },

  aggiornaStatoRichiesta: async (id, stato) => {
    const sb = getSupabase()
    await sb.from('richieste').update({ stato, updated_at: new Date().toISOString() }).eq('id', id)
    set((s) => ({ richieste: s.richieste.map(r => r.id === id ? { ...r, stato } : r) }))
  },

  // === Impostazioni & Contenuti ===
  salvaImpostazioni: async (i) => {
    const sb = getSupabase()
    const dbData: Record<string, unknown> = {}
    if (i.ragioneSociale !== undefined) dbData.ragione_sociale = i.ragioneSociale
    if (i.partitaIva !== undefined) dbData.partita_iva = i.partitaIva
    if (i.telefono !== undefined) dbData.telefono = i.telefono
    if (i.whatsapp !== undefined) dbData.whatsapp = i.whatsapp
    if (i.email !== undefined) dbData.email = i.email
    if (i.indirizzo !== undefined) dbData.indirizzo = i.indirizzo
    if (i.orari !== undefined) dbData.orari = i.orari
    if (i.registroRegionale !== undefined) dbData.registro_regionale = i.registroRegionale
    if (i.autorizzazioneComunale !== undefined) dbData.autorizzazione_comunale = i.autorizzazioneComunale
    if (i.kmInclusi !== undefined) dbData.km_inclusi = i.kmInclusi
    if (i.costoKmExtra !== undefined) dbData.costo_km_extra = i.costoKmExtra
    if (i.comuniServiti !== undefined) dbData.comuni_serviti = i.comuniServiti
    if (i.emailRichieste !== undefined) dbData.email_richieste = i.emailRichieste
    if (i.emailMemorial !== undefined) dbData.email_memorial = i.emailMemorial
    if (i.whatsappBusinessToken !== undefined) dbData.whatsapp_business_token = i.whatsappBusinessToken
    if (i.whatsappBusinessPhoneId !== undefined) dbData.whatsapp_business_phone_id = i.whatsappBusinessPhoneId
    if (i.whatsappBusinessEnabled !== undefined) dbData.whatsapp_business_enabled = i.whatsappBusinessEnabled
    dbData.updated_at = new Date().toISOString()

    await sb.from('impostazioni').update(dbData).eq('id', 1)
    set((s) => ({ impostazioni: { ...s.impostazioni, ...i } }))
  },

  salvaContenuti: async (c) => {
    const sb = getSupabase()
    const dbData: Record<string, unknown> = {}
    if (c.heroTitolo !== undefined) dbData.hero_titolo = c.heroTitolo
    if (c.heroSottotitolo !== undefined) dbData.hero_sottotitolo = c.heroSottotitolo
    if (c.heroBottone !== undefined) dbData.hero_bottone = c.heroBottone
    if (c.chiSiamoTitolo !== undefined) dbData.chi_siamo_titolo = c.chiSiamoTitolo
    if (c.chiSiamoSottotitolo !== undefined) dbData.chi_siamo_sottotitolo = c.chiSiamoSottotitolo
    if (c.chiSiamoStoria !== undefined) dbData.chi_siamo_storia = c.chiSiamoStoria
    if (c.footerDescrizione !== undefined) dbData.footer_descrizione = c.footerDescrizione
    if (c.footerCopyright !== undefined) dbData.footer_copyright = c.footerCopyright
    if (c.footerNotaPreventivi !== undefined) dbData.footer_nota_preventivi = c.footerNotaPreventivi
    if (c.disclaimerPreventivo !== undefined) dbData.disclaimer_preventivo = c.disclaimerPreventivo
    if (c.metaTitle !== undefined) dbData.meta_title = c.metaTitle
    if (c.metaDescription !== undefined) dbData.meta_description = c.metaDescription
    if (c.metaKeywords !== undefined) dbData.meta_keywords = c.metaKeywords
    if (c.extra !== undefined) dbData.extra = c.extra
    dbData.updated_at = new Date().toISOString()

    await sb.from('contenuti').update(dbData).eq('id', 1)
    set((s) => ({ contenuti: { ...s.contenuti, ...c } }))
  },
}))
