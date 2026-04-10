'use client'

import { useEffect, useState } from 'react'
import { CreditCard, Search, X, AlertTriangle, CheckCircle2 } from 'lucide-react'

const stati = ['pendente', 'pagato', 'scaduto', 'fallito'] as const
const statoColor: Record<string, string> = {
  pendente: 'bg-yellow-100 text-yellow-700',
  pagato: 'bg-green-100 text-green-700',
  scaduto: 'bg-red-100 text-red-700',
  fallito: 'bg-red-100 text-red-700',
}

export default function AdminPrevidenzaRate() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroStato, setFiltroStato] = useState('')
  const [search, setSearch] = useState('')
  const [saving, setSaving] = useState('')

  const load = () => {
    fetch('/api/previdenza/rate').then(r => r.json()).then(d => {
      if (Array.isArray(d)) setItems(d)
      setLoading(false)
    }).catch(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const filtered = items.filter(r => {
    if (filtroStato && r.stato !== filtroStato) return false
    if (search) {
      const s = search.toLowerCase()
      const nome = `${r.cliente_nome || ''} ${r.cliente_cognome || ''} ${r.tipo_piano_nome || ''}`.toLowerCase()
      if (!nome.includes(s)) return false
    }
    return true
  })

  const segnaPagata = async (id: string) => {
    setSaving(id)
    await fetch('/api/previdenza/rate', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, stato: 'pagato', data_pagamento: new Date().toISOString().split('T')[0] })
    })
    load(); setSaving('')
  }

  const totalePendenti = items.filter(r => r.stato === 'pendente').reduce((s, r) => s + (r.importo || 0), 0)
  const now = new Date()
  const meseCorrente = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const pagateMese = items.filter(r => r.stato === 'pagato' && r.data_pagamento?.startsWith(meseCorrente)).reduce((s, r) => s + (r.importo || 0), 0)
  const scadute = items.filter(r => r.stato === 'scaduto').length

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-primary">Rate e Pagamenti</h1>
          <p className="text-text-muted text-sm">{filtered.length} rate</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card p-4">
          <p className="text-xs text-text-muted mb-1">Rate pendenti</p>
          <p className="text-xl font-bold text-yellow-600">&euro; {totalePendenti.toFixed(2)}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-text-muted mb-1">Pagate questo mese</p>
          <p className="text-xl font-bold text-green-600">&euro; {pagateMese.toFixed(2)}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-text-muted mb-1">Rate scadute</p>
          <p className={`text-xl font-bold ${scadute > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {scadute > 0 && <AlertTriangle size={16} className="inline mr-1 mb-0.5" />}
            {scadute}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input type="text" placeholder="Cerca per cliente o piano..." value={search} onChange={e => setSearch(e.target.value)} className="input-field text-sm pl-8 w-full" />
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
          <CreditCard size={32} className="mx-auto mb-3 text-text-muted/30" />
          <p className="text-text-muted">Nessuna rata trovata.</p>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-text-muted font-medium">#</th>
                <th className="text-left py-3 px-4 text-text-muted font-medium">Piano</th>
                <th className="text-right py-3 px-4 text-text-muted font-medium">Importo</th>
                <th className="text-left py-3 px-4 text-text-muted font-medium">Scadenza</th>
                <th className="text-center py-3 px-4 text-text-muted font-medium">Stato</th>
                <th className="text-left py-3 px-4 text-text-muted font-medium hidden md:table-cell">Pagamento</th>
                <th className="w-28"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id} className="border-b border-border/50">
                  <td className="py-3 px-4 text-text-muted">{r.numero_rata}</td>
                  <td className="py-3 px-4">
                    <p className="font-medium text-primary">{r.tipo_piano_nome || '—'}</p>
                    <p className="text-xs text-text-muted">{r.cliente_nome} {r.cliente_cognome}</p>
                  </td>
                  <td className="py-3 px-4 text-right font-medium">&euro; {r.importo}</td>
                  <td className="py-3 px-4 text-text-muted">{r.data_scadenza || '—'}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${statoColor[r.stato] || 'bg-gray-100 text-gray-700'}`}>
                      {r.stato}
                    </span>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell text-text-muted text-xs">{r.data_pagamento || '—'}</td>
                  <td className="py-3 px-4 text-right">
                    {r.stato === 'pendente' && (
                      <button onClick={() => segnaPagata(r.id)} disabled={saving === r.id}
                        className="text-xs px-2.5 py-1 rounded bg-green-100 text-green-700 hover:bg-green-200 flex items-center gap-1 ml-auto">
                        <CheckCircle2 size={12} /> {saving === r.id ? 'Salvo...' : 'Segna pagata'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
