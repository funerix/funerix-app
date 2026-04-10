'use client'

import { useEffect, useState } from 'react'
import { ClipboardList, Search, ArrowLeft, X } from 'lucide-react'

const stati = ['bozza', 'attivo', 'sospeso', 'completato', 'deceduto', 'annullato', 'recesso'] as const
const statoColor: Record<string, string> = {
  bozza: 'bg-gray-100 text-gray-700',
  attivo: 'bg-green-100 text-green-700',
  sospeso: 'bg-yellow-100 text-yellow-700',
  completato: 'bg-blue-100 text-blue-700',
  deceduto: 'bg-purple-100 text-purple-700',
  annullato: 'bg-red-100 text-red-700',
  recesso: 'bg-orange-100 text-orange-700',
}

export default function AdminPrevidenzaPiani() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroStato, setFiltroStato] = useState('')
  const [search, setSearch] = useState('')
  const [detail, setDetail] = useState<any>(null)
  const [saving, setSaving] = useState(false)

  const load = () => {
    fetch('/api/previdenza/piani').then(r => r.json()).then(d => {
      if (Array.isArray(d)) setItems(d)
      setLoading(false)
    }).catch(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const filtered = items.filter(p => {
    if (filtroStato && p.stato !== filtroStato) return false
    if (search) {
      const s = search.toLowerCase()
      const nome = `${p.cliente_nome || ''} ${p.cliente_cognome || ''}`.toLowerCase()
      if (!nome.includes(s)) return false
    }
    return true
  })

  const changeStato = async (id: string, nuovoStato: string) => {
    setSaving(true)
    await fetch('/api/previdenza/piani', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, stato: nuovoStato })
    })
    load()
    if (detail) setDetail({ ...detail, stato: nuovoStato })
    setSaving(false)
  }

  const progressPercent = (p: any) => {
    if (!p.totale || p.totale === 0) return 0
    return Math.min(100, Math.round(((p.saldo_versato || 0) / p.totale) * 100))
  }

  if (detail) {
    const pct = progressPercent(detail)
    return (
      <div className="p-6">
        <button onClick={() => setDetail(null)} className="flex items-center gap-1 text-secondary text-sm mb-4 hover:underline">
          <ArrowLeft size={16} /> Torna alla lista
        </button>
        <div className="card p-6 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-primary">{detail.cliente_nome} {detail.cliente_cognome}</h2>
            <span className={`text-xs px-2 py-0.5 rounded-full ${statoColor[detail.stato] || 'bg-gray-100 text-gray-700'}`}>
              {detail.stato}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-primary mb-2">Info Cliente</h4>
              <p className="text-text-muted">Email: {detail.cliente_email || '—'}</p>
              <p className="text-text-muted">Telefono: {detail.cliente_telefono || '—'}</p>
              <p className="text-text-muted">CF: {detail.cliente_codice_fiscale || '—'}</p>
            </div>
            <div>
              <h4 className="font-medium text-primary mb-2">Dettagli Piano</h4>
              <p className="text-text-muted">Tipo: {detail.tipo_piano_nome || '—'}</p>
              <p className="text-text-muted">Totale: &euro; {detail.totale || 0}</p>
              <p className="text-text-muted">Rata: &euro; {detail.importo_rata || 0}</p>
              <p className="text-text-muted">Rate: {detail.rate_pagate || 0} / {detail.num_rate || 0}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-text-muted mb-1">
              <span>Saldo versato: &euro; {detail.saldo_versato || 0}</span>
              <span>{pct}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-green-500 h-2.5 rounded-full transition-all" style={{ width: `${pct}%` }}></div>
            </div>
          </div>
          {detail.beneficiari && detail.beneficiari.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium text-primary mb-2 text-sm">Beneficiari</h4>
              <ul className="space-y-1">
                {detail.beneficiari.map((b: any, i: number) => (
                  <li key={i} className="text-sm text-text-muted">{b.nome} {b.cognome} — {b.relazione_con_cliente || '—'}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="card p-4">
          <h4 className="font-medium text-primary mb-3 text-sm">Cambia stato</h4>
          <div className="flex flex-wrap gap-2">
            {stati.filter(s => s !== detail.stato).map(s => (
              <button key={s} onClick={() => changeStato(detail.id, s)} disabled={saving}
                className={`text-xs px-3 py-1.5 rounded-full border ${statoColor[s]} hover:opacity-80`}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Piani Attivi</h1>
          <p className="text-text-muted text-sm">{filtered.length} piani</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input type="text" placeholder="Cerca per nome cliente..." value={search} onChange={e => setSearch(e.target.value)} className="input-field text-sm pl-8 w-full" />
        </div>
        <select value={filtroStato} onChange={e => setFiltroStato(e.target.value)} className="input-field text-sm">
          <option value="">Tutti gli stati</option>
          {stati.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
        {(filtroStato || search) && (
          <button onClick={() => { setFiltroStato(''); setSearch('') }} className="btn-secondary text-sm">
            <X size={14} className="mr-1" /> Reset
          </button>
        )}
      </div>

      {loading ? (
        <div className="card p-8 text-center"><p className="text-text-muted">Caricamento...</p></div>
      ) : filtered.length === 0 ? (
        <div className="card p-8 text-center">
          <ClipboardList size={32} className="mx-auto mb-3 text-text-muted/30" />
          <p className="text-text-muted">Nessun piano trovato.</p>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-text-muted font-medium">Cliente</th>
                <th className="text-left py-3 px-4 text-text-muted font-medium hidden md:table-cell">Tipo Piano</th>
                <th className="text-right py-3 px-4 text-text-muted font-medium">Totale</th>
                <th className="text-right py-3 px-4 text-text-muted font-medium hidden md:table-cell">Rata</th>
                <th className="text-center py-3 px-4 text-text-muted font-medium hidden md:table-cell">Rate</th>
                <th className="text-left py-3 px-4 text-text-muted font-medium">Progresso</th>
                <th className="text-center py-3 px-4 text-text-muted font-medium">Stato</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const pct = progressPercent(p)
                return (
                  <tr key={p.id} className="border-b border-border/50 cursor-pointer hover:bg-background/50" onClick={() => setDetail(p)}>
                    <td className="py-3 px-4">
                      <p className="font-medium text-primary">{p.cliente_nome} {p.cliente_cognome}</p>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell text-text-muted">{p.tipo_piano_nome || '—'}</td>
                    <td className="py-3 px-4 text-right font-medium">&euro; {p.totale || 0}</td>
                    <td className="py-3 px-4 text-right hidden md:table-cell text-text-muted">&euro; {p.importo_rata || 0}</td>
                    <td className="py-3 px-4 text-center hidden md:table-cell text-text-muted">{p.rate_pagate || 0}/{p.num_rate || 0}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: `${pct}%` }}></div>
                        </div>
                        <span className="text-xs text-text-muted">{pct}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${statoColor[p.stato] || 'bg-gray-100 text-gray-700'}`}>
                        {p.stato}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
