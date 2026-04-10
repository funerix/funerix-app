'use client'

import { useEffect, useState } from 'react'
import { Percent, Search, X, CheckCircle2, Banknote } from 'lucide-react'

const stati = ['maturata', 'approvata', 'pagata'] as const
const statoColor: Record<string, string> = {
  maturata: 'bg-yellow-100 text-yellow-700',
  approvata: 'bg-blue-100 text-blue-700',
  pagata: 'bg-green-100 text-green-700',
}

export default function AdminPrevidenzaCommissioni() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroStato, setFiltroStato] = useState('')
  const [search, setSearch] = useState('')
  const [saving, setSaving] = useState('')

  const load = () => {
    fetch('/api/previdenza/commissioni').then(r => r.json()).then(d => {
      if (Array.isArray(d)) setItems(d)
      setLoading(false)
    }).catch(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const filtered = items.filter(c => {
    if (filtroStato && c.stato !== filtroStato) return false
    if (search) {
      const s = search.toLowerCase()
      const text = `${c.nome_struttura || ''} ${c.tipo_piano_nome || ''}`.toLowerCase()
      if (!text.includes(s)) return false
    }
    return true
  })

  const changeStato = async (id: string, nuovoStato: string) => {
    setSaving(id)
    await fetch('/api/previdenza/commissioni', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, stato: nuovoStato })
    })
    load(); setSaving('')
  }

  const totaleMaturate = items.filter(c => c.stato === 'maturata').reduce((s, c) => s + (c.importo || 0), 0)
  const totaleApprovate = items.filter(c => c.stato === 'approvata').reduce((s, c) => s + (c.importo || 0), 0)
  const totalePagate = items.filter(c => c.stato === 'pagata').reduce((s, c) => s + (c.importo || 0), 0)

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Commissioni RSA</h1>
          <p className="text-text-muted text-sm">{filtered.length} commissioni</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card p-4">
          <p className="text-xs text-text-muted mb-1">Totale maturate</p>
          <p className="text-xl font-bold text-yellow-600">&euro; {totaleMaturate.toFixed(2)}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-text-muted mb-1">Totale approvate</p>
          <p className="text-xl font-bold text-blue-600">&euro; {totaleApprovate.toFixed(2)}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-text-muted mb-1">Totale pagate</p>
          <p className="text-xl font-bold text-green-600">&euro; {totalePagate.toFixed(2)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input type="text" placeholder="Cerca per RSA o piano..." value={search} onChange={e => setSearch(e.target.value)} className="input-field text-sm pl-8 w-full" />
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
          <Percent size={32} className="mx-auto mb-3 text-text-muted/30" />
          <p className="text-text-muted">Nessuna commissione trovata.</p>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-text-muted font-medium">RSA</th>
                <th className="text-left py-3 px-4 text-text-muted font-medium hidden md:table-cell">Piano</th>
                <th className="text-right py-3 px-4 text-text-muted font-medium">Importo</th>
                <th className="text-right py-3 px-4 text-text-muted font-medium hidden md:table-cell">%</th>
                <th className="text-center py-3 px-4 text-text-muted font-medium">Stato</th>
                <th className="text-left py-3 px-4 text-text-muted font-medium hidden md:table-cell">Maturazione</th>
                <th className="w-36"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <p className="font-medium text-primary">{c.nome_struttura || '—'}</p>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell text-text-muted">{c.tipo_piano_nome || '—'}</td>
                  <td className="py-3 px-4 text-right font-medium">&euro; {c.importo?.toFixed(2) || '0.00'}</td>
                  <td className="py-3 px-4 text-right hidden md:table-cell text-text-muted">{c.percentuale || 0}%</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${statoColor[c.stato] || 'bg-gray-100 text-gray-700'}`}>
                      {c.stato}
                    </span>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell text-text-muted text-xs">{c.data_maturazione || '—'}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex gap-1 justify-end">
                      {c.stato === 'maturata' && (
                        <button onClick={() => changeStato(c.id, 'approvata')} disabled={saving === c.id}
                          className="text-xs px-2.5 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 flex items-center gap-1">
                          <CheckCircle2 size={12} /> {saving === c.id ? '...' : 'Approva'}
                        </button>
                      )}
                      {c.stato === 'approvata' && (
                        <button onClick={() => changeStato(c.id, 'pagata')} disabled={saving === c.id}
                          className="text-xs px-2.5 py-1 rounded bg-green-100 text-green-700 hover:bg-green-200 flex items-center gap-1">
                          <Banknote size={12} /> {saving === c.id ? '...' : 'Paga'}
                        </button>
                      )}
                    </div>
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
