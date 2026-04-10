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

// ============================================
// FUNERIX PET — Types
// ============================================

export type SpecieAnimale = 'cane' | 'gatto' | 'coniglio' | 'uccello' | 'rettile' | 'altro'
export type TagliaAnimale = 'piccolo' | 'medio' | 'grande'
export type TipoCremazione = 'individuale' | 'collettiva'
export type StatoOrdinePet = 'ricevuto' | 'confermato' | 'ritirato' | 'in_cremazione' | 'ceneri_pronte' | 'consegnato' | 'annullato'
export type RitiroTipo = 'domicilio' | 'struttura' | 'veterinario'

export interface PetOrdine {
  id: string
  petClienteId: string
  animaleNome: string
  specie: SpecieAnimale
  specieAltro?: string
  razza?: string
  pesoKg?: number
  taglia: TagliaAnimale
  fotoAnimale?: string
  tipoCremazione: TipoCremazione
  urnaId?: string
  improntaZampa: boolean
  ritiroTipo: RitiroTipo
  ritiroIndirizzo?: string
  ritiroData?: string
  veterinarioId?: string
  codiceConvenzione?: string
  stato: StatoOrdinePet
  dataRitiroEffettivo?: string
  dataCremazione?: string
  dataCeneriPronte?: string
  dataConsegna?: string
  certificatoNumero?: string
  certificatoUrl?: string
  totale: number
  pagato: boolean
  metodoPagamento?: string
  stripePaymentId?: string
  tokenAccesso: string
  noteCliente?: string
  noteInterne?: string
  createdAt: string
  updatedAt: string
}

export interface PetCliente {
  id: string
  nome: string
  cognome?: string
  telefono: string
  email: string
  indirizzo?: string
  citta?: string
  cap?: string
  createdAt: string
}

export interface PetProdotto {
  id: string
  nome: string
  categoria: 'urna' | 'cofanetto' | 'impronta' | 'accessorio'
  materiale?: string
  descrizione?: string
  prezzo: number
  foto: string[]
  disponibile: boolean
  ordineVisualizzazione: number
  createdAt: string
}

export interface PetPrezzo {
  id: string
  specie: string
  taglia: TagliaAnimale
  tipoCremazione: TipoCremazione
  prezzo: number
  ritiroDomicilioPrezzo: number
  improntaZampaPrezzo: number
  attivo: boolean
  createdAt: string
}

export interface VeterinarioPartner {
  id: string
  nomeStudio: string
  nomeVeterinario: string
  indirizzo?: string
  citta?: string
  provincia?: string
  cap?: string
  telefono?: string
  email: string
  sitoWeb?: string
  commissionePercentuale: number
  codiceConvenzione: string
  ordiniTotali: number
  commissioniMaturate: number
  commissioniPagate: number
  attivo: boolean
  latitudine?: number
  longitudine?: number
  ultimoAccesso?: string
  createdAt: string
}

export interface PetMemorial {
  id: string
  ordineId?: string
  clienteId: string
  animaleNome: string
  specie?: string
  razza?: string
  fotoProfilo?: string
  fotoGallery: string[]
  dataNascita?: string
  dataMorte?: string
  biografia?: string
  candeleAccese: number
  pubblicato: boolean
  approvato: boolean
  createdAt: string
}

// ============================================
// FUNERIX PREVIDENZA — Types
// ============================================

export type StatoPiano = 'bozza' | 'attivo' | 'sospeso' | 'completato' | 'deceduto' | 'annullato' | 'recesso'
export type StatoRata = 'pendente' | 'pagato' | 'scaduto' | 'fallito' | 'annullato'

export interface TipoPiano {
  id: string
  nome: string
  slug: string
  descrizione?: string
  prezzoBase: number
  serviziInclusi: { nome: string; descrizione: string; categoria: string }[]
  durataMinMesi: number
  durataMaxMesi: number
  maggiorazioneAnnuaPct: number
  attivo: boolean
  ordineVisualizzazione: number
  createdAt: string
}

export interface PianoPrevidenza {
  id: string
  clienteId: string
  beneficiarioId: string
  tipoPianoId: string
  tipoPianoNome: string
  configurazione: Record<string, unknown>
  totale: number
  numRate: number
  importoRata: number
  ratePagate: number
  saldoVersato: number
  saldoResiduo: number
  stato: StatoPiano
  rsaId?: string
  rsaOperatore?: string
  codiceConvenzione?: string
  contrattoUrl?: string
  contrattoFirmato: boolean
  dataFirma?: string
  dataAttivazione?: string
  dataCompletamento?: string
  dataSospensione?: string
  dataRecesso?: string
  motivoRecesso?: string
  importoRimborso?: number
  consulenteId?: string
  noteInterne?: string
  createdAt: string
  updatedAt: string
}

export interface PagamentoRata {
  id: string
  pianoId: string
  numeroRata: number
  importo: number
  stato: StatoRata
  dataScadenza: string
  dataPagamento?: string
  metodoPagamento?: string
  stripePaymentId?: string
  ricevutaUrl?: string
  tentativoAddebito: number
  createdAt: string
}

export interface Beneficiario {
  id: string
  pianoId: string
  nome: string
  cognome: string
  codiceFiscale?: string
  dataNascita?: string
  luogoNascita?: string
  relazioneConCliente: string
  indirizzo?: string
  citta?: string
  documenti: { tipo: string; url: string; dataUpload: string }[]
  preferenzeCerimonia: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export interface ClientePrevidenza {
  id: string
  nome: string
  cognome: string
  codiceFiscale?: string
  dataNascita?: string
  telefono: string
  email: string
  indirizzo?: string
  citta?: string
  cap?: string
  emailVerificata: boolean
  ultimoAccesso?: string
  createdAt: string
}

export interface RsaConvenzionata {
  id: string
  nomeStruttura: string
  tipo: 'rsa' | 'casa_riposo' | 'hospice' | 'clinica'
  indirizzo?: string
  citta?: string
  provincia?: string
  cap?: string
  telefono?: string
  email?: string
  sitoWeb?: string
  referenteNome?: string
  referenteTelefono?: string
  referenteEmail?: string
  commissionePercentuale: number
  codiceConvenzione: string
  pianiAttivi: number
  pianiTotali: number
  commissioniMaturate: number
  commissioniPagate: number
  attivo: boolean
  latitudine?: number
  longitudine?: number
  createdAt: string
}

export interface CommissioneRsa {
  id: string
  rsaId: string
  pianoId: string
  importo: number
  percentuale: number
  stato: 'maturata' | 'approvata' | 'pagata'
  dataMaturazione: string
  dataApprovazione?: string
  dataPagamento?: string
  metodoPagamento?: string
  ricevutaUrl?: string
  note?: string
  createdAt: string
}

// ============================================
// FUNERIX RIMPATRI — Types
// ============================================

export type StatoPraticaRimpatri = 'richiesta' | 'documenti_in_corso' | 'documenti_completati' | 'autorizzato' | 'in_transito' | 'arrivata' | 'consegnata' | 'completata' | 'annullata'
export type DirezioneRimpatrio = 'italia_estero' | 'estero_italia'
export type ZonaRimpatrio = 'europa' | 'nord_africa' | 'americhe' | 'asia' | 'africa_subsahariana' | 'oceania'

export interface RimpatriPratica {
  id: string
  clienteId: string
  defuntoNome: string
  defuntoCognome: string
  defuntoNazionalita?: string
  defuntoDataDecesso?: string
  direzione: DirezioneRimpatrio
  paeseId: string
  cittaPartenza?: string
  cittaDestinazione?: string
  zona: ZonaRimpatrio
  serviziExtra: { nome: string; prezzo: number }[]
  stato: StatoPraticaRimpatri
  documenti: { nome: string; obbligatorio: boolean; stato: string; url?: string; dataUpload?: string; motivoRifiuto?: string }[]
  voloCompagnia?: string
  voloNumero?: string
  voloData?: string
  voloTratta?: string
  partnerEsteroId?: string
  consolatoId?: string
  totale?: number
  pagato: boolean
  metodoPagamento?: string
  stripePaymentId?: string
  linguaCliente: string
  tokenAccesso: string
  consulenteId?: string
  noteCliente?: string
  noteInterne?: string
  createdAt: string
  updatedAt: string
}

export interface RimpatriCliente {
  id: string
  nome: string
  cognome: string
  telefono: string
  email: string
  relazioneConDefunto?: string
  indirizzo?: string
  citta?: string
  cap?: string
  nazionalita?: string
  linguaPreferita: string
  createdAt: string
}

export interface RimpatriPaese {
  id: string
  nome: string
  codiceIso: string
  zona: ZonaRimpatrio
  prezzoBase: number
  tempoMedioGiorni?: number
  documentiRichiesti: { nome: string; descrizione: string; obbligatorio: boolean; ordine: number }[]
  requisitiSpecifici?: string
  note?: string
  bandieraEmoji?: string
  attivo: boolean
  createdAt: string
}

export interface RimpatriConsolato {
  id: string
  paeseId: string
  citta: string
  indirizzo?: string
  telefono?: string
  email?: string
  sitoWeb?: string
  orari?: string
  latitudine?: number
  longitudine?: number
  note?: string
  attivo: boolean
  createdAt: string
}

export interface RimpatriPartner {
  id: string
  nomeAgenzia: string
  paese?: string
  citta?: string
  indirizzo?: string
  telefono?: string
  email?: string
  referente?: string
  serviziOfferti: string[]
  commissionePercentuale?: number
  praticheTotali: number
  attivo: boolean
  createdAt: string
}

// ============================================
// GLOBALI — Notifiche, Recensioni
// ============================================

export interface NotificaTemplate {
  id: string
  verticale: 'funebre' | 'pet' | 'previdenza' | 'rimpatri'
  evento: string
  canale: 'email' | 'sms' | 'whatsapp'
  oggetto: string
  corpoTemplate: string
  attivo: boolean
  createdAt: string
}

export interface Recensione {
  id: string
  verticale: 'funebre' | 'pet' | 'previdenza' | 'rimpatri'
  praticaId?: string
  clienteNome: string
  voto: number
  testo?: string
  rispostaAdmin?: string
  approvata: boolean
  pubblicata: boolean
  createdAt: string
}
