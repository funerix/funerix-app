'use client'

import { useEffect, useState } from 'react'
import { Euro, Plus, Pencil, Trash2, X } from 'lucide-react'

const tipoOptions = ['base', 'tanatoprassi', 'traduzione', 'accompagnamento', 'cerimonia', 'cassa_zinco', 'assicurazione']
const zoneLabel: Record<string, string> = {
  europa: 'Europa',
  nord_africa: 'Nord Africa/Medio Oriente',
  americhe: 'Americhe',
  asia: 'Asia',
  africa_subsahariana: 'Africa Sub-Sahariana',
  oceania: 'Oceania',
}
const zoneOptions = Object.keys(zoneLabel)

export default function AdminRimpatriPrezzi() {
  const [prezzi, setPrezzi] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    tipo: 'base', nome_servizio: '', prezzo: '', zona: '', obbligatorio_per_zona: false,
  })

  const load = () => {
    fetch('/api/rimpatri/prezzi').then(r => r.json()).then(d => {
      if (Array.isArray(d)) setPrezzi(d)
      setLoading(false)
    }).catch(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const resetForm = () => {
    setForm({ tipo: 'base', nome_servizio: '', prezzo: '', zona: '', obbligatorio_per_zona: false })
    setEditing(null); setShowForm(false)
  }

  const openEdit = (p: any) => {
    setForm({
      tipo: p.tipo || 'base', nome_servizio: p.nome_servizio || '',
      prezzo: String(p.prezzo || ''), zona: p.zona || '',
      obbligatorio_per_zona: p.obbligatorio_per_zona || false,
    })
    setEditing(p); setShowForm(true)
  }

  const save = async () => {
    setSaving(true)
    const body = {
      tipo: form.tipo, nome_servizio: form.nome_servizio,
      prezzo: parseFloat(form.prezzo) || 0,
      zona: form.zona || null,
      obbligatorio_per_zona: form.obbligatorio_per_zona,
    }
    if (editing) {
      await fetch('/api/rimpatri/prezzi', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editing.id, ...body }) })
    } else {
      await fetch('/api/rimpatri/prezzi', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    }
    load(); resetForm(); setSaving(false)
  }

  const remove = async (id: string) => {
    if (!confirm('Eliminare questo prezzo?')) return
    await fetch('/api/rimpatri/prezzi', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    load()
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Prezzi Rimpatri</h1>
          <p className="text-text-muted text-sm">{prezzi.length} servizi configurati</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true) }} className="btn-primary text-sm">
          <Plus size={16} className="mr-1" /> Aggiungi
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card p-4 mb-6 border-secondary/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-primary">{editing ? 'Modifica prezzo' : 'Nuovo prezzo'}</h3>
            <button onClick={resetForm}><X size={18} className="text-text-muted" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <select value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })} className="input-field text-sm">
              {tipoOptions.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1).replace('_', ' ')}</option>)}
            </select>
            <input type="text" placeholder="Nome servizio *" value={form.nome_servizio} onChange={e => setForm({ ...form, nome_servizio: e.target.value })} className="input-field text-sm" />
            <div>
              <label className="text-xs text-text-muted">Prezzo (&euro;)</label>
              <input type="number" value={form.prezzo} onChange={e => setForm({ ...form, prezzo: e.target.value })} className="input-field text-sm w-full" />
            </div>
            <select value={form.zona} onChange={e => setForm({ ...form, zona: e.target.value })} className="input-field text-sm">
              <option value="">Tutte le zone</option>
              {zoneOptions.map(z => <option key={z} value={z}>{zoneLabel[z]}</option>)}
            </select>
            <label className="flex items-center gap-2 text-sm text-text-light cursor-pointer">
              <input type="checkbox" checked={form.obbligatorio_per_zona} onChange={e => setForm({ ...form, obbligatorio_per_zona: e.target.checked })}
                className="rounded border-border" />
              Obbligatorio per zona
            </label>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={resetForm} className="btn-secondary text-sm">Annulla</button>
            <button onClick={save} disabled={saving || !form.nome_servizio || !form.prezzo} className="btn-primary text-sm">
              {saving ? 'Salvo...' : editing ? 'Salva' : 'Crea'}
            </button>
          </div>
        </div>
      )}

      {/* Lista */}
      {loading ? (
        <div className="card p-8 text-center"><p className="text-text-muted">Caricamento...</p></div>
      ) : prezzi.length === 0 ? (
        <div className="card p-8 text-center">
          <Euro size={32} className="mx-auto mb-3 text-text-muted/30" />
          <p className="text-text-muted">Nessun prezzo configurato. Clicca Aggiungi per iniziare.</p>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-text-muted font-medium">Tipo</th>
                <th className="text-left py-3 px-4 text-text-muted font-medium">Servizio</th>
                <th className="text-right py-3 px-4 text-text-muted font-medium">Prezzo</th>
                <th className="text-left py-3 px-4 text-text-muted font-medium hidden md:table-cell">Zona</th>
                <th className="text-left py-3 px-4 text-text-muted font-medium hidden md:table-cell">Obbl.</th>
                <th className="w-20"></th>
              </tr>
            </thead>
            <tbody>
              {prezzi.map(p => (
                <tr key={p.id} className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <span className="capitalize text-xs px-2 py-0.5 rounded-full bg-secondary/10 text-secondary font-medium">
                      {(p.tipo || '').replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-primary">{p.nome_servizio}</td>
                  <td className="py-3 px-4 text-right font-bold text-primary">&euro; {p.prezzo}</td>
                  <td className="py-3 px-4 text-text-light hidden md:table-cell">{p.zona ? zoneLabel[p.zona] || p.zona : 'Tutti'}</td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    {p.obbligatorio_per_zona && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 font-medium">Obbligatorio</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1 justify-end">
                      <button onClick={() => openEdit(p)} className="p-1.5 hover:bg-background rounded"><Pencil size={14} className="text-text-muted" /></button>
                      <button onClick={() => remove(p.id)} className="p-1.5 hover:bg-red-50 rounded"><Trash2 size={14} className="text-red-400" /></button>
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
