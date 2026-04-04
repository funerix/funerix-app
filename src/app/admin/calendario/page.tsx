'use client'

import Link from 'next/link'
import { ArrowLeft, Plus, ChevronLeft, ChevronRight, Clock, MapPin, X, Save, Check, Trash2 } from 'lucide-react'
import { getSupabase } from '@/lib/supabase-client'
import { useState, useEffect } from 'react'

interface Appuntamento {
  id: string; richiesta_id: string | null; titolo: string; data_ora: string;
  durata: number; luogo: string; note: string; tipo: string; completato: boolean
}

const tipiColori: Record<string, string> = {
  appuntamento: 'bg-secondary/20 border-secondary text-secondary-dark',
  cerimonia: 'bg-primary/20 border-primary text-primary',
  ritiro: 'bg-accent/20 border-accent text-accent',
  scadenza: 'bg-error/20 border-error text-error',
}

export default function CalendarioPage() {
  const [appuntamenti, setAppuntamenti] = useState<Appuntamento[]>([])
  const [meseCorrente, setMeseCorrente] = useState(new Date())
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ titolo: '', data_ora: '', durata: 60, luogo: '', note: '', tipo: 'appuntamento' })
  const [giornoSelezionato, setGiornoSelezionato] = useState<string | null>(null)

  useEffect(() => {
    getSupabase().from('appuntamenti').select('*').order('data_ora')
      .then(({ data }: { data: unknown[] | null }) => setAppuntamenti((data || []) as Appuntamento[]))
  }, [])

  const anno = meseCorrente.getFullYear()
  const mese = meseCorrente.getMonth()
  const primoGiorno = new Date(anno, mese, 1)
  const ultimoGiorno = new Date(anno, mese + 1, 0)
  const startDay = (primoGiorno.getDay() + 6) % 7 // Lunedì = 0

  const giorni: (number | null)[] = []
  for (let i = 0; i < startDay; i++) giorni.push(null)
  for (let d = 1; d <= ultimoGiorno.getDate(); d++) giorni.push(d)

  const getAppGiorno = (giorno: number) => {
    const dateStr = `${anno}-${String(mese + 1).padStart(2, '0')}-${String(giorno).padStart(2, '0')}`
    return appuntamenti.filter(a => a.data_ora.startsWith(dateStr))
  }

  const oggi = new Date()
  const oggiStr = `${oggi.getFullYear()}-${String(oggi.getMonth() + 1).padStart(2, '0')}-${String(oggi.getDate()).padStart(2, '0')}`

  const salvaApp = async () => {
    const sb = getSupabase()
    const { data } = await sb.from('appuntamenti').insert(form).select().single()
    if (data) setAppuntamenti([...appuntamenti, data as unknown as Appuntamento])
    setShowForm(false)
    setForm({ titolo: '', data_ora: '', durata: 60, luogo: '', note: '', tipo: 'appuntamento' })
  }

  const eliminaApp = async (id: string) => {
    await getSupabase().from('appuntamenti').delete().eq('id', id)
    setAppuntamenti(appuntamenti.filter(a => a.id !== id))
  }

  const toggleCompletato = async (id: string) => {
    const a = appuntamenti.find(x => x.id === id)
    if (!a) return
    await getSupabase().from('appuntamenti').update({ completato: !a.completato }).eq('id', id)
    setAppuntamenti(appuntamenti.map(x => x.id === id ? { ...x, completato: !x.completato } : x))
  }

  const nomeMese = meseCorrente.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })

  // Appuntamenti del giorno selezionato
  const appGiornoSel = giornoSelezionato
    ? appuntamenti.filter(a => a.data_ora.startsWith(giornoSelezionato)).sort((a, b) => a.data_ora.localeCompare(b.data_ora))
    : []

  // Prossimi appuntamenti
  const prossimi = appuntamenti
    .filter(a => a.data_ora >= oggiStr && !a.completato)
    .sort((a, b) => a.data_ora.localeCompare(b.data_ora))
    .slice(0, 5)

  return (
    <div className="min-h-screen bg-background-dark">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-text-muted hover:text-primary"><ArrowLeft size={20} /></Link>
            <h1 className="font-[family-name:var(--font-serif)] text-3xl text-primary">Calendario</h1>
          </div>
          <button onClick={() => setShowForm(true)} className="btn-accent text-sm">
            <Plus size={16} className="mr-1" /> Nuovo appuntamento
          </button>
        </div>

        {/* Form nuovo appuntamento */}
        {showForm && (
          <div className="card mb-6">
            <div className="flex justify-between mb-4">
              <h2 className="font-[family-name:var(--font-serif)] text-lg text-primary">Nuovo appuntamento</h2>
              <button onClick={() => setShowForm(false)}><X size={18} className="text-text-muted" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-text mb-1">Titolo *</label>
                <input type="text" className="input-field text-sm" placeholder="Es. Incontro famiglia Rossi"
                  value={form.titolo} onChange={e => setForm({ ...form, titolo: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium text-text mb-1">Data e ora *</label>
                <input type="datetime-local" className="input-field text-sm"
                  value={form.data_ora} onChange={e => setForm({ ...form, data_ora: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium text-text mb-1">Tipo</label>
                <select className="input-field text-sm" value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })}>
                  <option value="appuntamento">Appuntamento</option>
                  <option value="cerimonia">Cerimonia</option>
                  <option value="ritiro">Ritiro/Consegna</option>
                  <option value="scadenza">Scadenza</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-text mb-1">Luogo</label>
                <input type="text" className="input-field text-sm" placeholder="Indirizzo o luogo"
                  value={form.luogo} onChange={e => setForm({ ...form, luogo: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium text-text mb-1">Durata (min)</label>
                <input type="number" className="input-field text-sm" value={form.durata}
                  onChange={e => setForm({ ...form, durata: Number(e.target.value) })} />
              </div>
              <div>
                <label className="block text-xs font-medium text-text mb-1">Note</label>
                <input type="text" className="input-field text-sm" placeholder="Note..."
                  value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} />
              </div>
            </div>
            <button onClick={salvaApp} className="btn-accent text-xs mt-3"><Save size={14} className="mr-1" /> Salva</button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendario */}
          <div className="lg:col-span-3 card">
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => setMeseCorrente(new Date(anno, mese - 1))} className="p-2 hover:bg-background rounded"><ChevronLeft size={18} /></button>
              <h2 className="font-[family-name:var(--font-serif)] text-lg text-primary capitalize">{nomeMese}</h2>
              <button onClick={() => setMeseCorrente(new Date(anno, mese + 1))} className="p-2 hover:bg-background rounded"><ChevronRight size={18} /></button>
            </div>

            {/* Header giorni */}
            <div className="grid grid-cols-7 gap-1 mb-1">
              {['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'].map(g => (
                <div key={g} className="text-center text-[10px] text-text-muted font-medium py-1">{g}</div>
              ))}
            </div>

            {/* Griglia giorni */}
            <div className="grid grid-cols-7 gap-1">
              {giorni.map((giorno, i) => {
                if (!giorno) return <div key={`empty-${i}`} className="h-20" />
                const dateStr = `${anno}-${String(mese + 1).padStart(2, '0')}-${String(giorno).padStart(2, '0')}`
                const apps = getAppGiorno(giorno)
                const isOggi = dateStr === oggiStr
                const isSelected = dateStr === giornoSelezionato

                return (
                  <button
                    key={giorno}
                    onClick={() => setGiornoSelezionato(dateStr === giornoSelezionato ? null : dateStr)}
                    className={`h-20 p-1 rounded-lg text-left transition-all ${
                      isSelected ? 'ring-2 ring-secondary bg-secondary/5' :
                      isOggi ? 'bg-primary/5 border border-primary/20' :
                      'hover:bg-background border border-transparent'
                    }`}
                  >
                    <span className={`text-xs font-medium ${isOggi ? 'text-primary' : 'text-text-light'}`}>{giorno}</span>
                    <div className="mt-0.5 space-y-0.5 overflow-hidden max-h-12">
                      {apps.slice(0, 2).map(a => (
                        <div key={a.id} className={`text-[8px] px-1 py-0.5 rounded border-l-2 truncate ${tipiColori[a.tipo] || tipiColori.appuntamento}`}>
                          {a.titolo}
                        </div>
                      ))}
                      {apps.length > 2 && <span className="text-[8px] text-text-muted">+{apps.length - 2} altri</span>}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Dettaglio giorno selezionato */}
            {giornoSelezionato && (
              <div className="mt-4 pt-4 border-t border-border">
                <h3 className="text-sm font-medium text-primary mb-3">
                  {new Date(giornoSelezionato + 'T00:00').toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })}
                </h3>
                {appGiornoSel.length === 0 ? (
                  <p className="text-text-muted text-xs">Nessun appuntamento</p>
                ) : (
                  <div className="space-y-2">
                    {appGiornoSel.map(a => (
                      <div key={a.id} className={`flex items-start gap-3 p-3 rounded-lg border-l-3 ${tipiColori[a.tipo] || tipiColori.appuntamento} ${a.completato ? 'opacity-50' : ''}`}>
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium text-sm ${a.completato ? 'line-through' : ''}`}>{a.titolo}</p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-text-muted">
                            <span className="flex items-center gap-1"><Clock size={10} /> {new Date(a.data_ora).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })} — {a.durata} min</span>
                            {a.luogo && <span className="flex items-center gap-1"><MapPin size={10} /> {a.luogo}</span>}
                          </div>
                          {a.note && <p className="text-xs text-text-muted mt-1">{a.note}</p>}
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => toggleCompletato(a.id)} className="p-1 hover:text-accent"><Check size={14} /></button>
                          <button onClick={() => eliminaApp(a.id)} className="p-1 hover:text-error"><Trash2 size={14} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar — Prossimi */}
          <div className="card h-fit">
            <h3 className="text-sm font-medium text-primary mb-3">Prossimi appuntamenti</h3>
            {prossimi.length === 0 ? (
              <p className="text-text-muted text-xs py-4 text-center">Nessun appuntamento in programma</p>
            ) : (
              <div className="space-y-3">
                {prossimi.map(a => (
                  <div key={a.id} className="text-xs border-b border-border/50 pb-2 last:border-0">
                    <p className="font-medium text-primary">{a.titolo}</p>
                    <p className="text-text-muted mt-0.5">
                      {new Date(a.data_ora).toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'short' })} — {new Date(a.data_ora).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    {a.luogo && <p className="text-text-muted flex items-center gap-1 mt-0.5"><MapPin size={10} /> {a.luogo}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
