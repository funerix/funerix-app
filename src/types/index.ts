// ============================================
// FUNERIX — Type Definitions
// ============================================

// --- Catalogo ---
export type TipoServizio = 'inumazione' | 'tumulazione' | 'cremazione'
export type TipoCerimonia = 'cattolica' | 'altra_confessione' | 'laica'

export interface Categoria {
  id: string
  nome: string
  slug: string
  descrizione: string
  ordine: number
  icona: string
  attiva: boolean
}

export interface Prodotto {
  id: string
  categoriaId: string
  nome: string
  slug: string
  descrizione: string
  descrizioneBreve: string
  materiale?: string
  dimensioni?: string
  prezzo: number
  immagini: string[]
  attivo: boolean
  tipoServizio: TipoServizio | 'tutti'
}

// --- Configuratore ---
export interface ConfiguratoreState {
  step: number
  tipoServizio: TipoServizio | null
  bara: Prodotto | null
  urna: Prodotto | null
  autoFunebre: Prodotto | null
  percorso: {
    partenza: string
    chiesa: string
    destinazione: string
    distanzaKm: number
  } | null
  cerimonia: {
    tipo: TipoCerimonia | null
    luogo: string
    musica: boolean
    libroFirme: boolean
  } | null
  fiori: Prodotto[]
  serviziExtra: Prodotto[]
  totale: number
}

export interface DatiRichiesta {
  nomeCliente: string
  telefono: string
  email: string
  note: string
  preferenzaContatto: 'mattina' | 'pomeriggio' | 'sera' | 'qualsiasi'
  consensoPrivacy: boolean
}

// --- Richieste ---
export type StatoRichiesta = 'nuova' | 'in_lavorazione' | 'confermata' | 'completata' | 'annullata'

export interface Richiesta {
  id: string
  configurazioneId: string
  createdAt: string
  datiCliente: DatiRichiesta
  stato: StatoRichiesta
  configurazione: ConfiguratoreState
}

// --- Memorial ---
export interface Memorial {
  id: string
  nomeDefunto: string
  dataNascita: string
  dataMorte: string
  foto?: string
  biografia?: string
  luogoSepoltura?: string
  mappaUrl?: string
  musicaUrl?: string
  donazioneUrl?: string
  donazioneDescrizione?: string
  messaggi: MessaggioMemorial[]
  createdAt: string
}

export interface MessaggioMemorial {
  id: string
  memorialId: string
  autore: string
  contenuto: string
  foto?: string
  videoUrl?: string
  createdAt: string
}

// --- Admin ---
export interface AdminUser {
  id: string
  email: string
  nome: string
  ruolo: 'admin' | 'operatore'
}

export interface Comunicazione {
  id: string
  richiestaId: string
  tipo: 'email' | 'telefono' | 'nota_interna'
  contenuto: string
  data: string
  adminUserId: string
}
