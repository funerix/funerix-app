'use client'

import { useEffect, useState } from 'react'
import { Search, ChevronRight, Briefcase, Clock, ArrowLeft } from 'lucide-react'

const statiLabel: Record<string, string> = {
  richiesta: 'Richiesta', documenti_in_corso: 'Documenti in corso', documenti_completati: 'Documenti completati',
  autorizzato: 'Autorizzato', in_transito: 'In transito', arrivata: 'Arrivata', consegnata: 'Consegnata',
  completata: 'Completata', annullata: 'Annullata',
}
const statiColor: Record<string, string> = {
  richiesta: 'bg-blue-100 text-blue-700', documenti_in_corso: 'bg-yellow-100 text-yellow-700',
  documenti_completati: 'bg-indigo-100 text-indigo-700', autorizzato: 'bg-purple-100 text-purple-700',
  in_transito: 'bg-orange-100 text-orange-700', arrivata: 'bg-teal-100 text-teal-700',
  consegnata: 'bg-green-100 text-green-700', completata: 'bg-gray-100 text-gray-600',
  annullata: 'bg-red-100 text-red-700',
}
const statiOrdine = ['richiesta', 'documenti_in_corso', 'documenti_completati', 'autorizzato', 'in_transito', 'arrivata', 'consegnata', 'completata']

export default function AdminRimpatriPratiche() {
  const [pratiche, setPratiche] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroStato, setFiltroStato] = useState('')
  const [ricerca, setRicerca] = useState('')
  const [selected, setSelected] = useState<any>(null)
  const [saving, setSaving] = useState(false)

  const load = () => {
    fetch('/api/rimpatri/pratiche').then(r => r.json()).then(d => {
      if (Array.isArray(d)) setPratiche(d)
      setLoading(false)
    }).catch(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const filtered = pratiche.filter(p => {
    if (filtroStato && p.stato !== filtroStato) return false
    if (ricerca) {
      const s = ricerca.toLowerCase()
      return p.defunto_nome?.toLowerCase().includes(s) || p.defunto_cognome?.toLowerCase().includes(s) ||
        p.cliente_nome?.toLowerCase().includes(s) || p.rimpatri_paesi?.nome?.toLowerCase().includes(s)
    }
    return true
  })

  const cambiaStato = async (id: string, nuovoStato: string) => {
    setSaving(true)
    await fetch('/api/rimpatri/pratiche', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, stato: nuovoStato }),
    })
    load()
    if (selected?.id === id) setSelected({ ...selected, stato: nuovoStato })
    setSaving(false)
  }

  // Dettaglio pratica
  if (selected) {
    const timeline = selected.rimpatri_timeline || []
    const serviziExtra = selected.servizi_extra || []
    const documenti = selected.documenti_checklist || []

    return (
      <div className="p-4 md:p-6">
        <button onClick={() => setSelected(null)} className="text-secondary text-sm mb-4 hover:underline flex items-center gap-1">
          <ArrowLeft size={14} /> Torna alla lista
        </button>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-primary">{selected.defunto_nome} {selected.defunto_cognome}</h1>
            <p className="text-text-muted text-sm">
              {selected.rimpatri_paesi?.bandiera_emoji || ''} {selected.rimpatri_paesi?.nome || 'N/D'} &mdash; {selected.direzione || 'rimpatrio'}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statiColor[selected.stato]}`}>
            {statiLabel[selected.stato]}
          </span>
        </div>

        {/* Timeline stati */}
        <div className="card p-4 mb-6">
          <p className="text-xs text-text-muted mb-3 font-medium">Avanzamento stato</p>
          <div className="flex gap-2 flex-wrap">
            {statiOrdine.map(s => (
              <button key={s} onClick={() => cambiaStato(selected.id, s)} disabled={saving}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  selected.stato === s ? statiColor[s] : 'bg-background text-text-muted hover:bg-background-dark'
                }`}>
                {statiLabel[s]}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Info defunto */}
          <div className="card p-4">
            <h3 className="font-medium text-primary mb-3 text-sm">Defunto</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-text-muted">Nome</dt><dd className="font-medium">{selected.defunto_nome} {selected.defunto_cognome}</dd></div>
              <div className="flex justify-between"><dt className="text-text-muted">Data decesso</dt><dd>{selected.data_decesso ? new Date(selected.data_decesso).toLocaleDateString('it-IT') : '—'}</dd></div>
              <div className="flex justify-between"><dt className="text-text-muted">Luogo decesso</dt><dd>{selected.luogo_decesso || '—'}</dd></div>
              <div className="flex justify-between"><dt className="text-text-muted">Codice fiscale</dt><dd>{selected.defunto_codice_fiscale || '—'}</dd></div>
            </dl>
          </div>

          {/* Info cliente */}
          <div className="card p-4">
            <h3 className="font-medium text-primary mb-3 text-sm">Cliente</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-text-muted">Nome</dt><dd className="font-medium">{selected.cliente_nome} {selected.cliente_cognome || ''}</dd></div>
              <div className="flex justify-between"><dt className="text-text-muted">Telefono</dt><dd>{selected.cliente_telefono ? <a href={`tel:${selected.cliente_telefono}`} className="text-secondary">{selected.cliente_telefono}</a> : '—'}</dd></div>
              <div className="flex justify-between"><dt className="text-text-muted">Email</dt><dd>{selected.cliente_email ? <a href={`mailto:${selected.cliente_email}`} className="text-secondary">{selected.cliente_email}</a> : '—'}</dd></div>
              <div className="flex justify-between"><dt className="text-text-muted">Parentela</dt><dd>{selected.cliente_parentela || '—'}</dd></div>
            </dl>
          </div>

          {/* Itinerario */}
          <div className="card p-4">
            <h3 className="font-medium text-primary mb-3 text-sm">Itinerario</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-text-muted">Direzione</dt><dd className="capitalize font-medium">{selected.direzione || '—'}</dd></div>
              <div className="flex justify-between"><dt className="text-text-muted">Paese</dt><dd>{selected.rimpatri_paesi?.bandiera_emoji} {selected.rimpatri_paesi?.nome || '—'}</dd></div>
              <div className="flex justify-between"><dt className="text-text-muted">Citta destinazione</dt><dd>{selected.citta_destinazione || '—'}</dd></div>
              <div className="flex justify-between"><dt className="text-text-muted">Citta partenza</dt><dd>{selected.citta_partenza || '—'}</dd></div>
            </dl>
          </div>

          {/* Volo */}
          <div className="card p-4">
            <h3 className="font-medium text-primary mb-3 text-sm">Info Volo</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-text-muted">Compagnia</dt><dd>{selected.volo_compagnia || '—'}</dd></div>
              <div className="flex justify-between"><dt className="text-text-muted">Numero volo</dt><dd>{selected.volo_numero || '—'}</dd></div>
              <div className="flex justify-between"><dt className="text-text-muted">Data partenza</dt><dd>{selected.volo_data_partenza ? new Date(selected.volo_data_partenza).toLocaleDateString('it-IT') : '—'}</dd></div>
              <div className="flex justify-between"><dt className="text-text-muted">Data arrivo</dt><dd>{selected.volo_data_arrivo ? new Date(selected.volo_data_arrivo).toLocaleDateString('it-IT') : '—'}</dd></div>
            </dl>
          </div>

          {/* Servizi extra */}
          <div className="card p-4">
            <h3 className="font-medium text-primary mb-3 text-sm">Servizi Extra</h3>
            {serviziExtra.length === 0 ? (
              <p className="text-text-muted text-sm">Nessun servizio extra</p>
            ) : (
              <ul className="space-y-1 text-sm">
                {serviziExtra.map((s: any, i: number) => (
                  <li key={i} className="flex justify-between">
                    <span>{s.nome || s}</span>
                    {s.prezzo != null && <span className="font-medium">&euro; {s.prezzo}</span>}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Documenti checklist */}
          <div className="card p-4">
            <h3 className="font-medium text-primary mb-3 text-sm">Documenti</h3>
            {documenti.length === 0 ? (
              <p className="text-text-muted text-sm">Nessun documento</p>
            ) : (
              <ul className="space-y-1 text-sm">
                {documenti.map((d: any, i: number) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${d.completato ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span>{d.nome || d}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Pagamento */}
          <div className="card p-4">
            <h3 className="font-medium text-primary mb-3 text-sm">Pagamento</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-text-muted">Totale</dt><dd className="font-bold text-lg">&euro; {selected.totale || 0}</dd></div>
              <div className="flex justify-between"><dt className="text-text-muted">Pagato</dt><dd>{selected.pagato ? <span className="text-green-600 font-medium">Si</span> : <span className="text-red-600 font-medium">No</span>}</dd></div>
              <div className="flex justify-between"><dt className="text-text-muted">Metodo</dt><dd>{selected.metodo_pagamento || '—'}</dd></div>
            </dl>
          </div>
        </div>

        {/* Timeline eventi */}
        {timeline.length > 0 && (
          <div className="card p-4 mt-6">
            <h3 className="font-medium text-primary mb-3 text-sm">Timeline</h3>
            <div className="space-y-3">
              {timeline.map((t: any, i: number) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-primary">{t.titolo || statiLabel[t.stato] || t.stato}</p>
                    <p className="text-xs text-text-muted">{t.descrizione || ''}</p>
                    <p className="text-xs text-text-muted mt-0.5">
                      <Clock size={10} className="inline mr-1" />
                      {new Date(t.created_at).toLocaleString('it-IT')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Note */}
        {(selected.note_cliente || selected.note_interne) && (
          <div className="card p-4 mt-6">
            <h3 className="font-medium text-primary mb-3 text-sm">Note</h3>
            {selected.note_cliente && <p className="text-sm text-text-light mb-2"><strong>Cliente:</strong> {selected.note_cliente}</p>}
            {selected.note_interne && <p className="text-sm text-text-light"><strong>Interne:</strong> {selected.note_interne}</p>}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-primary">Pratiche Rimpatrio</h1>
          <p className="text-text-muted text-sm">{pratiche.length} pratiche totali</p>
        </div>
      </div>

      {/* Filtri */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input type="text" placeholder="Cerca per nome defunto, cliente, paese..." value={ricerca} onChange={e => setRicerca(e.target.value)}
            className="input-field pl-9 w-full text-sm" />
        </div>
        <select value={filtroStato} onChange={e => setFiltroStato(e.target.value)} className="input-field text-sm">
          <option value="">Tutti gli stati</option>
          {Object.entries(statiLabel).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      {/* Tabella */}
      {loading ? (
        <div className="card p-8 text-center"><p className="text-text-muted">Caricamento...</p></div>
      ) : filtered.length === 0 ? (
        <div className="card p-8 text-center">
          <Briefcase size={32} className="mx-auto mb-3 text-text-muted/30" />
          <p className="text-text-muted">Nessuna pratica trovata.</p>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-text-muted font-medium">Defunto</th>
                <th className="text-left py-3 px-4 text-text-muted font-medium">Paese</th>
                <th className="text-left py-3 px-4 text-text-muted font-medium hidden md:table-cell">Direzione</th>
                <th className="text-left py-3 px-4 text-text-muted font-medium">Stato</th>
                <th className="text-right py-3 px-4 text-text-muted font-medium">Totale</th>
                <th className="text-right py-3 px-4 text-text-muted font-medium hidden md:table-cell">Data</th>
                <th className="w-8"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} onClick={() => setSelected(p)} className="border-b border-border/50 hover:bg-background cursor-pointer transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-medium text-primary">{p.defunto_nome} {p.defunto_cognome}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span>{p.rimpatri_paesi?.bandiera_emoji || ''} {p.rimpatri_paesi?.nome || '—'}</span>
                  </td>
                  <td className="py-3 px-4 capitalize hidden md:table-cell text-text-light">{p.direzione || '—'}</td>
                  <td className="py-3 px-4">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statiColor[p.stato]}`}>
                      {statiLabel[p.stato] || p.stato}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-medium">{p.totale != null ? `\u20AC ${p.totale}` : '—'}</td>
                  <td className="py-3 px-4 text-right text-text-muted text-xs hidden md:table-cell">{new Date(p.created_at).toLocaleDateString('it-IT')}</td>
                  <td className="py-3 px-2"><ChevronRight size={14} className="text-text-muted" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
