// Database types — mappano le tabelle Supabase

export interface DbCategoria {
  id: string
  nome: string
  slug: string
  descrizione: string
  ordine: number
  icona: string
  attiva: boolean
  created_at: string
}

export interface DbProdotto {
  id: string
  categoria_id: string | null
  nome: string
  slug: string
  descrizione: string
  descrizione_breve: string
  materiale: string | null
  dimensioni: string | null
  prezzo: number
  immagini: string[]
  attivo: boolean
  tipo_servizio: string
  created_at: string
  updated_at: string
}

export interface DbMemorial {
  id: string
  nome: string
  foto: string
  data_nascita: string
  data_morte: string
  comune: string
  biografia: string
  luogo_sepoltura: string
  donazione_url: string
  donazione_descrizione: string
  attivo: boolean
  created_at: string
}

export interface DbMessaggioMemorial {
  id: string
  memorial_id: string
  autore: string
  contenuto: string
  foto: string | null
  created_at: string
}

export interface DbRichiesta {
  id: string
  nome: string
  telefono: string
  email: string
  modalita: string
  orario: string
  note: string
  configurazione: string
  totale: number
  stato: string
  created_at: string
  updated_at: string
}

export interface DbCliente {
  id: string
  richiesta_id: string | null
  nome: string
  email: string
  telefono: string
  stato_servizio: string
  dettagli_cerimonia: Record<string, unknown>
  documenti_checklist: unknown[]
  created_at: string
}

export interface DbPagamento {
  id: string
  richiesta_id: string
  cliente_id: string | null
  importo: number
  metodo: string
  stato: string
  stripe_payment_id: string | null
  stripe_checkout_url: string | null
  created_at: string
}

export interface DbImpostazioni {
  id: number
  ragione_sociale: string
  partita_iva: string
  telefono: string
  whatsapp: string
  email: string
  indirizzo: string
  orari: string
  registro_regionale: string
  autorizzazione_comunale: string
  km_inclusi: number
  costo_km_extra: number
  comuni_serviti: string
  email_richieste: string
  email_memorial: string
  whatsapp_business_token: string
  whatsapp_business_phone_id: string
  whatsapp_business_enabled: boolean
  updated_at: string
}

export interface DbContenuti {
  id: number
  hero_titolo: string
  hero_sottotitolo: string
  hero_bottone: string
  chi_siamo_titolo: string
  chi_siamo_sottotitolo: string
  chi_siamo_storia: string
  footer_descrizione: string
  footer_copyright: string
  footer_nota_preventivi: string
  disclaimer_preventivo: string
  meta_title: string
  meta_description: string
  meta_keywords: string
  updated_at: string
}

export interface DbBlogPost {
  id: string
  titolo: string
  slug: string
  contenuto: string
  excerpt: string
  immagine: string
  pubblicato: boolean
  created_at: string
  updated_at: string
}
