import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { TipoServizio, TipoCerimonia, Prodotto } from '@/types'

interface Percorso {
  partenza: string
  chiesa: string
  destinazione: string
  distanzaKm: number
}

interface Cerimonia {
  tipo: TipoCerimonia | null
  luogo: string
  musica: boolean
  libroFirme: boolean
}

interface DatiCliente {
  nomeCliente: string
  telefono: string
  email: string
  note: string
  preferenzaContatto: 'mattina' | 'pomeriggio' | 'sera' | 'qualsiasi'
  consensoPrivacy: boolean
}

interface ConfiguratoreStore {
  // State
  step: number
  tipoServizio: TipoServizio | null
  bara: Prodotto | null
  urna: Prodotto | null
  autoFunebre: Prodotto | null
  percorso: Percorso | null
  cerimonia: Cerimonia | null
  fiori: Prodotto[]
  serviziExtra: Prodotto[]
  datiCliente: DatiCliente | null
  memorialIncluso: boolean

  // Computed
  totale: () => number

  // Actions
  setStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  setTipoServizio: (tipo: TipoServizio) => void
  setBara: (bara: Prodotto | null) => void
  setUrna: (urna: Prodotto | null) => void
  setAutoFunebre: (auto: Prodotto | null) => void
  setPercorso: (percorso: Percorso) => void
  setCerimonia: (cerimonia: Cerimonia) => void
  toggleFiore: (fiore: Prodotto) => void
  toggleServizioExtra: (servizio: Prodotto) => void
  setDatiCliente: (dati: DatiCliente) => void
  setMemorialIncluso: (incluso: boolean) => void
  reset: () => void
}

const TOTAL_STEPS = 8

const initialState = {
  step: 1,
  tipoServizio: null as TipoServizio | null,
  bara: null as Prodotto | null,
  urna: null as Prodotto | null,
  autoFunebre: null as Prodotto | null,
  percorso: null as Percorso | null,
  cerimonia: null as Cerimonia | null,
  fiori: [] as Prodotto[],
  serviziExtra: [] as Prodotto[],
  datiCliente: null as DatiCliente | null,
  memorialIncluso: false,
}

export const useConfiguratoreStore = create<ConfiguratoreStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      totale: () => {
        const s = get()
        let tot = 0
        if (s.bara) tot += s.bara.prezzo
        if (s.urna) tot += s.urna.prezzo
        if (s.autoFunebre) tot += s.autoFunebre.prezzo
        if (s.percorso && s.percorso.distanzaKm > 20) {
          tot += (s.percorso.distanzaKm - 20) * 3 // €3/km oltre 20km
        }
        s.fiori.forEach(f => tot += f.prezzo)
        s.serviziExtra.forEach(se => tot += se.prezzo)
        return tot
      },

      setStep: (step) => set({ step: Math.max(1, Math.min(TOTAL_STEPS, step)) }),
      nextStep: () => set((s) => ({ step: Math.min(TOTAL_STEPS, s.step + 1) })),
      prevStep: () => set((s) => ({ step: Math.max(1, s.step - 1) })),
      setTipoServizio: (tipo) => set({ tipoServizio: tipo }),
      setBara: (bara) => set({ bara }),
      setUrna: (urna) => set({ urna }),
      setAutoFunebre: (auto) => set({ autoFunebre: auto }),
      setPercorso: (percorso) => set({ percorso }),
      setCerimonia: (cerimonia) => set({ cerimonia }),
      toggleFiore: (fiore) => set((s) => {
        const exists = s.fiori.find(f => f.id === fiore.id)
        return { fiori: exists ? s.fiori.filter(f => f.id !== fiore.id) : [...s.fiori, fiore] }
      }),
      toggleServizioExtra: (servizio) => set((s) => {
        const exists = s.serviziExtra.find(se => se.id === servizio.id)
        return { serviziExtra: exists ? s.serviziExtra.filter(se => se.id !== servizio.id) : [...s.serviziExtra, servizio] }
      }),
      setDatiCliente: (dati) => set({ datiCliente: dati }),
      setMemorialIncluso: (incluso) => set({ memorialIncluso: incluso }),
      reset: () => set(initialState),
    }),
    { name: 'funerix-configuratore' }
  )
)

export { TOTAL_STEPS }
