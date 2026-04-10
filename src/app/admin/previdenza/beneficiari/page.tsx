'use client'

import { useEffect, useState } from 'react'
import { Users, Search, X, Pencil } from 'lucide-react'

const statoColor: Record<string, string> = {
  bozza: 'bg-gray-100 text-gray-700',
  attivo: 'bg-green-100 text-green-700',
  sospeso: 'bg-yellow-100 text-yellow-700',
  completato: 'bg-blue-100 text-blue-700',
  deceduto: 'bg-purple-100 text-purple-700',
  annullato: 'bg-red-100 text-red-700',
  recesso: 'bg-orange-100 text-orange-700',
}

export default function AdminPrevidenzaBeneficiari() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ preferenze_cerimonia: '', documenti: '' })

  const load = () => {
    fetch('/api/previdenza/beneficiari').then(r => r.json()).then(d => {
      if (Array.isArray(d)) setItems(d)
      setLoading(false)
    }).catch(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const filtered = items.filter(b => {
    if (!search) return true
    const s = search.toLowerCase()
    const text = `${b.nome || ''} ${b.cognome || ''} ${b.codice_fiscale || ''} ${b.relazione_con_cliente || ''}`.toLowerCase()
    return text.includes(s)
  })

  const openEdit = (item: any) => {
    setForm({
      preferenze_cerimonia: item.preferenze_cerimonia ? (typeof item.preferenze_cerimonia === 'string' ? item.preferenze_cerimonia : JSON.stringify(item.preferenze_cerimonia, null, 2)) : '',
      documenti: item.documenti ? (typeof item.documenti === 'string' ? item.documenti : JSON.stringify(item.documenti, null, 2)) : '',
    })
    setEditing(item)
  }

  const save = async () => {
    setSaving(true)
    let preferenze_cerimonia = form.preferenze_cerimonia
    let documenti = form.documenti
    try { preferenze_cerimonia = JSON.parse(form.preferenze_cerimonia) } catch { /* keep as string */ }
    try { documenti = JSON.parse(form.documenti) } catch { /* keep as string */ }
    await fetch('/api/previdenza/beneficiari', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editing.id, preferenze_cerimonia, documenti })
    })
    load(); setEditing(null); setSaving(false)
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-primary">Beneficiari</h1>
          <p className="text-text-muted text-sm">{filtered.length} beneficiari</p>
        </div>
      </div>

      {/* Edit form */}
      {editing && (
        <div className="card p-4 mb-6 border-secondary/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-primary">Modifica: {editing.nome} {editing.cognome}</h3>
            <button onClick={() => setEditing(null)}><X size={18} className="text-text-muted" /></button>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="text-xs text-text-muted mb-1 block">Preferenze cerimonia</label>
              <textarea value={form.preferenze_cerimonia} onChange={e => setForm({ ...form, preferenze_cerimonia: e.target.value })}
                className="input-field text-sm w-full h-24" placeholder="Preferenze per la cerimonia..." />
            </div>
            <div>
              <label className="text-xs text-text-muted mb-1 block">Documenti (JSON o testo)</label>
              <textarea value={form.documenti} onChange={e => setForm({ ...form, documenti: e.target.value })}
                className="input-field text-sm w-full h-24 font-mono" placeholder="Documenti allegati..." />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={() => setEditing(null)} className="btn-secondary text-sm">Annulla</button>
            <button onClick={save} disabled={saving} className="btn-primary text-sm">
              {saving ? 'Salvo...' : 'Salva'}
            </button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input type="text" placeholder="Cerca per nome, cognome, CF..." value={search} onChange={e => setSearch(e.target.value)} className="input-field text-sm pl-8 w-full" />
        </div>
        {search && (
          <button onClick={() => setSearch('')} className="btn-secondary text-sm">
            <X size={14} className="mr-1" /> Reset
          </button>
        )}
      </div>

      {loading ? (
        <div className="card p-8 text-center"><p className="text-text-muted">Caricamento...</p></div>
      ) : filtered.length === 0 ? (
        <div className="card p-8 text-center">
          <Users size={32} className="mx-auto mb-3 text-text-muted/30" />
          <p className="text-text-muted">Nessun beneficiario trovato.</p>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-text-muted font-medium">Nome</th>
                <th className="text-left py-3 px-4 text-text-muted font-medium">Cognome</th>
                <th className="text-left py-3 px-4 text-text-muted font-medium hidden md:table-cell">Codice Fiscale</th>
                <th className="text-left py-3 px-4 text-text-muted font-medium">Relazione</th>
                <th className="text-left py-3 px-4 text-text-muted font-medium hidden md:table-cell">Piano</th>
                <th className="text-center py-3 px-4 text-text-muted font-medium">Stato Piano</th>
                <th className="w-16"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => (
                <tr key={b.id} className="border-b border-border/50">
                  <td className="py-3 px-4 font-medium text-primary">{b.nome || '—'}</td>
                  <td className="py-3 px-4">{b.cognome || '—'}</td>
                  <td className="py-3 px-4 hidden md:table-cell text-text-muted font-mono text-xs">{b.codice_fiscale || '—'}</td>
                  <td className="py-3 px-4 text-text-muted">{b.relazione_con_cliente || '—'}</td>
                  <td className="py-3 px-4 hidden md:table-cell text-text-muted">{b.tipo_piano_nome || '—'}</td>
                  <td className="py-3 px-4 text-center">
                    {b.stato_piano ? (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${statoColor[b.stato_piano] || 'bg-gray-100 text-gray-700'}`}>
                        {b.stato_piano}
                      </span>
                    ) : '—'}
                  </td>
                  <td className="py-3 px-4">
                    <button onClick={() => openEdit(b)} className="p-1.5 hover:bg-background rounded">
                      <Pencil size={14} className="text-text-muted" />
                    </button>
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
