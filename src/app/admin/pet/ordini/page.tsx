'use client'

import { useEffect, useState } from 'react'
import { Search, ChevronRight, PawPrint } from 'lucide-react'

const statiLabel: Record<string, string> = {
  ricevuto: 'Ricevuto', confermato: 'Confermato', ritirato: 'Ritirato',
  in_cremazione: 'In cremazione', ceneri_pronte: 'Ceneri pronte', consegnato: 'Consegnato', annullato: 'Annullato',
}
const statiColor: Record<string, string> = {
  ricevuto: 'bg-blue-100 text-blue-700', confermato: 'bg-indigo-100 text-indigo-700', ritirato: 'bg-yellow-100 text-yellow-700',
  in_cremazione: 'bg-orange-100 text-orange-700', ceneri_pronte: 'bg-green-100 text-green-700', consegnato: 'bg-gray-100 text-gray-600', annullato: 'bg-red-100 text-red-700',
}
const statiOrdine = ['ricevuto', 'confermato', 'ritirato', 'in_cremazione', 'ceneri_pronte', 'consegnato']

export default function AdminPetOrdini() {
  const [ordini, setOrdini] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroStato, setFiltroStato] = useState('')
  const [ricerca, setRicerca] = useState('')
  const [selected, setSelected] = useState<any>(null)
  const [saving, setSaving] = useState(false)

  const load = () => {
    fetch('/api/pet/ordini').then(r => r.json()).then(d => {
      if (Array.isArray(d)) setOrdini(d)
      setLoading(false)
    }).catch(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const filtered = ordini.filter(o => {
    if (filtroStato && o.stato !== filtroStato) return false
    if (ricerca) {
      const s = ricerca.toLowerCase()
      return o.animale_nome?.toLowerCase().includes(s) || o.pet_clienti?.nome?.toLowerCase().includes(s) || o.specie?.toLowerCase().includes(s)
    }
    return true
  })

  const cambiaStato = async (id: string, nuovoStato: string) => {
    setSaving(true)
    await fetch('/api/pet/ordini', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, stato: nuovoStato }),
    })
    load()
    if (selected?.id === id) setSelected({ ...selected, stato: nuovoStato })
    setSaving(false)
  }

  // Dettaglio ordine
  if (selected) {
    return (
      <div className="p-4 md:p-6">
        <button onClick={() => setSelected(null)} className="text-secondary text-sm mb-4 hover:underline">&larr; Torna alla lista</button>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-primary">{selected.animale_nome}</h1>
            <p className="text-text-muted text-sm">{selected.specie} &mdash; {selected.taglia} &mdash; {selected.tipo_cremazione}</p>
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
          {/* Info animale */}
          <div className="card p-4">
            <h3 className="font-medium text-primary mb-3 text-sm">Animale</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-text-muted">Nome</dt><dd className="font-medium">{selected.animale_nome}</dd></div>
              <div className="flex justify-between"><dt className="text-text-muted">Specie</dt><dd>{selected.specie}{selected.specie_altro ? ` (${selected.specie_altro})` : ''}</dd></div>
              <div className="flex justify-between"><dt className="text-text-muted">Razza</dt><dd>{selected.razza || '—'}</dd></div>
              <div className="flex justify-between"><dt className="text-text-muted">Taglia</dt><dd>{selected.taglia}</dd></div>
              <div className="flex justify-between"><dt className="text-text-muted">Peso</dt><dd>{selected.peso_kg ? `${selected.peso_kg} kg` : '—'}</dd></div>
            </dl>
          </div>

          {/* Info cliente */}
          <div className="card p-4">
            <h3 className="font-medium text-primary mb-3 text-sm">Cliente</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-text-muted">Nome</dt><dd className="font-medium">{selected.pet_clienti?.nome} {selected.pet_clienti?.cognome || ''}</dd></div>
              <div className="flex justify-between"><dt className="text-text-muted">Telefono</dt><dd><a href={`tel:${selected.pet_clienti?.telefono}`} className="text-secondary">{selected.pet_clienti?.telefono}</a></dd></div>
              <div className="flex justify-between"><dt className="text-text-muted">Email</dt><dd><a href={`mailto:${selected.pet_clienti?.email}`} className="text-secondary">{selected.pet_clienti?.email}</a></dd></div>
            </dl>
          </div>

          {/* Servizio */}
          <div className="card p-4">
            <h3 className="font-medium text-primary mb-3 text-sm">Servizio</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-text-muted">Cremazione</dt><dd className="font-medium capitalize">{selected.tipo_cremazione}</dd></div>
              <div className="flex justify-between"><dt className="text-text-muted">Urna</dt><dd>{selected.pet_prodotti?.nome || 'Nessuna'}</dd></div>
              <div className="flex justify-between"><dt className="text-text-muted">Impronta zampa</dt><dd>{selected.impronta_zampa ? 'Si' : 'No'}</dd></div>
              <div className="flex justify-between"><dt className="text-text-muted">Ritiro</dt><dd className="capitalize">{selected.ritiro_tipo}</dd></div>
              {selected.ritiro_indirizzo && <div className="flex justify-between"><dt className="text-text-muted">Indirizzo ritiro</dt><dd>{selected.ritiro_indirizzo}</dd></div>}
            </dl>
          </div>

          {/* Pagamento */}
          <div className="card p-4">
            <h3 className="font-medium text-primary mb-3 text-sm">Pagamento</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-text-muted">Totale</dt><dd className="font-bold text-lg">&euro; {selected.totale}</dd></div>
              <div className="flex justify-between"><dt className="text-text-muted">Pagato</dt><dd>{selected.pagato ? <span className="text-green-600 font-medium">Si</span> : <span className="text-red-600 font-medium">No</span>}</dd></div>
              <div className="flex justify-between"><dt className="text-text-muted">Metodo</dt><dd>{selected.metodo_pagamento || '—'}</dd></div>
            </dl>
          </div>
        </div>

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
          <h1 className="text-xl md:text-2xl font-bold text-primary">Ordini Pet</h1>
          <p className="text-text-muted text-sm">{ordini.length} ordini totali</p>
        </div>
      </div>

      {/* Filtri */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input type="text" placeholder="Cerca per nome animale, cliente..." value={ricerca} onChange={e => setRicerca(e.target.value)}
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
          <PawPrint size={32} className="mx-auto mb-3 text-text-muted/30" />
          <p className="text-text-muted">Nessun ordine trovato.</p>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-text-muted font-medium">Animale</th>
                <th className="text-left py-3 px-4 text-text-muted font-medium hidden md:table-cell">Cliente</th>
                <th className="text-left py-3 px-4 text-text-muted font-medium">Tipo</th>
                <th className="text-left py-3 px-4 text-text-muted font-medium">Stato</th>
                <th className="text-right py-3 px-4 text-text-muted font-medium">Totale</th>
                <th className="text-right py-3 px-4 text-text-muted font-medium hidden md:table-cell">Data</th>
                <th className="w-8"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id} onClick={() => setSelected(o)} className="border-b border-border/50 hover:bg-background cursor-pointer transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-medium text-primary">{o.animale_nome}</p>
                    <p className="text-text-muted text-xs">{o.specie} &mdash; {o.taglia}</p>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell text-text-light">{o.pet_clienti?.nome || '—'}</td>
                  <td className="py-3 px-4 capitalize">{o.tipo_cremazione}</td>
                  <td className="py-3 px-4">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statiColor[o.stato]}`}>
                      {statiLabel[o.stato]}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-medium">&euro; {o.totale}</td>
                  <td className="py-3 px-4 text-right text-text-muted text-xs hidden md:table-cell">{new Date(o.created_at).toLocaleDateString('it-IT')}</td>
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
