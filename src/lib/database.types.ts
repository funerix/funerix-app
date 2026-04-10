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

// ============================================
// FUNERIX PET — Database Types
// ============================================

export interface DbPetOrdine {
  id: string
  pet_cliente_id: string
  animale_nome: string
  specie: string
  specie_altro: string | null
  razza: string | null
  peso_kg: number | null
  taglia: string
  foto_animale: string | null
  tipo_cremazione: string
  urna_id: string | null
  impronta_zampa: boolean
  ritiro_tipo: string
  ritiro_indirizzo: string | null
  ritiro_data: string | null
  veterinario_id: string | null
  codice_convenzione: string | null
  stato: string
  data_ritiro_effettivo: string | null
  data_cremazione: string | null
  data_ceneri_pronte: string | null
  data_consegna: string | null
  certificato_numero: string | null
  certificato_url: string | null
  totale: number
  pagato: boolean
  metodo_pagamento: string | null
  stripe_payment_id: string | null
  token_accesso: string
  note_cliente: string | null
  note_interne: string | null
  created_at: string
  updated_at: string
}

export interface DbPetCliente {
  id: string
  nome: string
  cognome: string | null
  telefono: string
  email: string
  indirizzo: string | null
  citta: string | null
  cap: string | null
  created_at: string
}

export interface DbPetProdotto {
  id: string
  nome: string
  categoria: string
  materiale: string | null
  descrizione: string | null
  prezzo: number
  foto: string[]
  disponibile: boolean
  ordine_visualizzazione: number
  created_at: string
}

export interface DbPetPrezzo {
  id: string
  specie: string
  taglia: string
  tipo_cremazione: string
  prezzo: number
  ritiro_domicilio_prezzo: number
  impronta_zampa_prezzo: number
  attivo: boolean
  created_at: string
  updated_at: string
}

export interface DbPetMemorial {
  id: string
  ordine_id: string | null
  cliente_id: string
  animale_nome: string
  specie: string | null
  razza: string | null
  foto_profilo: string | null
  foto_gallery: string[]
  data_nascita: string | null
  data_morte: string | null
  biografia: string | null
  candele_accese: number
  pubblicato: boolean
  approvato: boolean
  created_at: string
}

export interface DbPetMemorialMessaggio {
  id: string
  memorial_id: string
  autore_nome: string
  messaggio: string
  approvato: boolean
  created_at: string
}

export interface DbVeterinarioPartner {
  id: string
  nome_studio: string
  nome_veterinario: string
  indirizzo: string | null
  citta: string | null
  provincia: string | null
  cap: string | null
  telefono: string | null
  email: string
  sito_web: string | null
  commissione_percentuale: number
  codice_convenzione: string
  password_hash: string | null
  ordini_totali: number
  commissioni_maturate: number
  commissioni_pagate: number
  attivo: boolean
  latitudine: number | null
  longitudine: number | null
  ultimo_accesso: string | null
  created_at: string
}

export interface DbPetCommissione {
  id: string
  veterinario_id: string
  ordine_id: string
  importo: number
  percentuale: number
  stato: string
  data_maturazione: string
  data_pagamento: string | null
  note: string | null
  created_at: string
}

// ============================================
// FUNERIX PREVIDENZA — Database Types
// ============================================

export interface DbTipoPiano {
  id: string
  nome: string
  slug: string
  descrizione: string | null
  prezzo_base: number
  servizi_inclusi: unknown
  durata_min_mesi: number
  durata_max_mesi: number
  maggiorazione_annua_pct: number
  attivo: boolean
  ordine_visualizzazione: number
  created_at: string
}

export interface DbPianoPrevidenza {
  id: string
  cliente_id: string
  beneficiario_id: string
  tipo_piano_id: string
  tipo_piano_nome: string
  configurazione: unknown
  totale: number
  num_rate: number
  importo_rata: number
  rate_pagate: number
  saldo_versato: number
  saldo_residuo: number
  stato: string
  rsa_id: string | null
  rsa_operatore: string | null
  codice_convenzione: string | null
  contratto_url: string | null
  contratto_firmato: boolean
  data_firma: string | null
  data_attivazione: string | null
  data_completamento: string | null
  data_sospensione: string | null
  data_recesso: string | null
  motivo_recesso: string | null
  importo_rimborso: number | null
  consulente_id: string | null
  note_interne: string | null
  created_at: string
  updated_at: string
}

export interface DbPagamentoRata {
  id: string
  piano_id: string
  numero_rata: number
  importo: number
  stato: string
  data_scadenza: string
  data_pagamento: string | null
  metodo_pagamento: string | null
  stripe_payment_id: string | null
  ricevuta_url: string | null
  tentativo_addebito: number
  created_at: string
}

export interface DbBeneficiario {
  id: string
  piano_id: string
  nome: string
  cognome: string
  codice_fiscale: string | null
  data_nascita: string | null
  luogo_nascita: string | null
  relazione_con_cliente: string
  indirizzo: string | null
  citta: string | null
  documenti: unknown
  preferenze_cerimonia: unknown
  created_at: string
  updated_at: string
}

export interface DbClientePrevidenza {
  id: string
  nome: string
  cognome: string
  codice_fiscale: string | null
  data_nascita: string | null
  telefono: string
  email: string
  password_hash: string
  indirizzo: string | null
  citta: string | null
  cap: string | null
  email_verificata: boolean
  ultimo_accesso: string | null
  created_at: string
}

export interface DbRsaConvenzionata {
  id: string
  nome_struttura: string
  tipo: string
  indirizzo: string | null
  citta: string | null
  provincia: string | null
  cap: string | null
  telefono: string | null
  email: string | null
  sito_web: string | null
  referente_nome: string | null
  referente_telefono: string | null
  referente_email: string | null
  commissione_percentuale: number
  codice_convenzione: string
  piani_attivi: number
  piani_totali: number
  commissioni_maturate: number
  commissioni_pagate: number
  attivo: boolean
  latitudine: number | null
  longitudine: number | null
  created_at: string
}

export interface DbPortaleRsaUser {
  id: string
  rsa_id: string
  email: string
  password_hash: string
  nome: string
  ruolo: string
  attivo: boolean
  ultimo_accesso: string | null
  created_at: string
}

export interface DbCommissioneRsa {
  id: string
  rsa_id: string
  piano_id: string
  importo: number
  percentuale: number
  stato: string
  data_maturazione: string
  data_approvazione: string | null
  data_pagamento: string | null
  metodo_pagamento: string | null
  ricevuta_url: string | null
  note: string | null
  created_at: string
}

// ============================================
// FUNERIX RIMPATRI — Database Types
// ============================================

export interface DbRimpatriPratica {
  id: string
  cliente_id: string
  defunto_nome: string
  defunto_cognome: string
  defunto_nazionalita: string | null
  defunto_data_decesso: string | null
  direzione: string
  paese_id: string
  citta_partenza: string | null
  citta_destinazione: string | null
  zona: string
  servizi_extra: unknown
  stato: string
  documenti: unknown
  volo_compagnia: string | null
  volo_numero: string | null
  volo_data: string | null
  volo_tratta: string | null
  partner_estero_id: string | null
  consolato_id: string | null
  totale: number | null
  pagato: boolean
  metodo_pagamento: string | null
  stripe_payment_id: string | null
  lingua_cliente: string
  token_accesso: string
  consulente_id: string | null
  note_cliente: string | null
  note_interne: string | null
  created_at: string
  updated_at: string
}

export interface DbRimpatriCliente {
  id: string
  nome: string
  cognome: string
  telefono: string
  email: string
  relazione_con_defunto: string | null
  indirizzo: string | null
  citta: string | null
  cap: string | null
  nazionalita: string | null
  lingua_preferita: string
  created_at: string
}

export interface DbRimpatriPaese {
  id: string
  nome: string
  codice_iso: string
  zona: string
  prezzo_base: number
  tempo_medio_giorni: number | null
  documenti_richiesti: unknown
  requisiti_specifici: string | null
  note: string | null
  bandiera_emoji: string | null
  attivo: boolean
  created_at: string
}

export interface DbRimpatriConsolato {
  id: string
  paese_id: string
  citta: string
  indirizzo: string | null
  telefono: string | null
  email: string | null
  sito_web: string | null
  orari: string | null
  latitudine: number | null
  longitudine: number | null
  note: string | null
  attivo: boolean
  created_at: string
}

export interface DbRimpatriPartner {
  id: string
  nome_agenzia: string
  paese: string | null
  citta: string | null
  indirizzo: string | null
  telefono: string | null
  email: string | null
  referente: string | null
  servizi_offerti: unknown
  commissione_percentuale: number | null
  pratiche_totali: number
  attivo: boolean
  created_at: string
}

export interface DbRimpatriPrezzo {
  id: string
  zona: string | null
  paese_id: string | null
  tipo: string
  nome_servizio: string
  prezzo: number
  obbligatorio_per_zona: boolean
  attivo: boolean
  created_at: string
}

// ============================================
// GLOBALI — Notifiche, Recensioni
// ============================================

export interface DbNotificaTemplate {
  id: string
  verticale: string
  evento: string
  canale: string
  oggetto: string
  corpo_template: string
  attivo: boolean
  created_at: string
}

export interface DbRecensione {
  id: string
  verticale: string
  pratica_id: string | null
  cliente_nome: string
  voto: number
  testo: string | null
  risposta_admin: string | null
  approvata: boolean
  pubblicata: boolean
  created_at: string
}
