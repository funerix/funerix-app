'use client'

import { useEffect, useState } from 'react'
import { Flower2, Plus, Pencil, Trash2, X } from 'lucide-react'

const categorieLabel: Record<string, string> = {
  fiori: 'Fiori',
  pulizia: 'Pulizia',
  manutenzione: 'Manutenzione Tomba',
}
const categorieOptions = Object.keys(categorieLabel)

const frequenzaLabel: Record<string, string> = {
  settimanale: 'Settimanale',
  quindicinale: 'Quindicinale',
  mensile: 'Mensile',
  trimestrale: 'Trimestrale',
  annuale: 'Annuale',
}

export default function AdminServiziRicorrenti() {
  const [tab, setTab] = useState<'servizi' | 'abbonamenti'>('servizi')
  const [servizi, setServizi] = useState<any[]>([])
  const [abbonamenti, setAbbonamenti] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    nome: '', categoria: 'fiori', frequenza: 'mensile', prezzo: '', prezzo_annuale: '', attivo: true,
    descrizione: '',
  })

  const loadServizi = () => {
    fetch('/api/servizi-ricorrenti').then(r => r.json()).then(d => {
      if (Array.isArray(d)) setServizi(d)
      setLoading(false)
    }).catch(() => setLoading(false))
  }

  const loadAbbonamenti = () => {
    fetch('/api/servizi-ricorrenti?tipo=abbonamenti').then(r => r.json()).then(d => {
      if (Array.isArray(d)) setAbbonamenti(d)
    }).catch(() => {})
  }

  useEffect(() => { loadServizi(); loadAbbonamenti() }, [])

  const resetForm = () => {
    setForm({ nome: '', categoria: 'fiori', frequenza: 'mensile', prezzo: '', prezzo_annuale: '', attivo: true, descrizione: '' })
    setEditing(null); setShowForm(false)
  }

  const openEdit = (s: any) => {
    setForm({
      nome: s.nome, categoria: s.categoria || 'fiori', frequenza: s.frequenza || 'mensile',
      prezzo: String(s.prezzo || ''), prezzo_annuale: String(s.prezzo_annuale || ''),
      attivo: s.attivo !== false, descrizione: s.descrizione || '',
    })
    setEditing(s); setShowForm(true)
  }

  const save = async () => {
    setSaving(true)
    const body = {
      nome: form.nome, categoria: form.categoria, frequenza: form.frequenza,
      prezzo: parseFloat(form.prezzo) || 0, prezzo_annuale: parseFloat(form.prezzo_annuale) || 0,
      attivo: form.attivo, descrizione: form.descrizione,
    }
    if (editing) {
      await fetch('/api/servizi-ricorrenti', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editing.id, ...body }) })
    } else {
      await fetch('/api/servizi-ricorrenti', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    }
    loadServizi(); resetForm(); setSaving(false)
  }

  const remove = async (id: string) => {
    if (!confirm('Eliminare questo servizio?')) return
    await fetch('/api/servizi-ricorrenti', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    loadServizi()
  }

  const toggleAttivo = async (s: any) => {
    await fetch('/api/servizi-ricorrenti', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: s.id, attivo: !s.attivo }) })
    loadServizi()
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-primary">Fiori e Cura Tomba</h1>
          <p className="text-text-muted text-sm">Gestione servizi ricorrenti e abbonamenti</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button onClick={() => setTab('servizi')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'servizi' ? 'bg-primary text-white' : 'bg-surface text-text-muted hover:text-primary'}`}>
          Servizi ({servizi.length})
        </button>
        <button onClick={() => setTab('abbonamenti')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'abbonamenti' ? 'bg-primary text-white' : 'bg-surface text-text-muted hover:text-primary'}`}>
          Abbonamenti ({abbonamenti.length})
        </button>
      </div>

      {tab === 'servizi' && (
        <>
          <div className="flex justify-end mb-4">
            <button onClick={() => { resetForm(); setShowForm(true) }} className="btn-primary text-sm">
              <Plus size={16} className="mr-1" /> Aggiungi Servizio
            </button>
          </div>

          {/* Form */}
          {showForm && (
            <div className="card p-4 mb-6 border-secondary/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-primary">{editing ? 'Modifica servizio' : 'Nuovo servizio'}</h3>
                <button onClick={resetForm}><X size={18} className="text-text-muted" /></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-text-muted mb-1">Nome</label>
                  <input className="input w-full" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs text-text-muted mb-1">Categoria</label>
                  <select className="input w-full" value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })}>
                    {categorieOptions.map(c => <option key={c} value={c}>{categorieLabel[c]}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-text-muted mb-1">Frequenza</label>
                  <select className="input w-full" value={form.frequenza} onChange={e => setForm({ ...form, frequenza: e.target.value })}>
                    {Object.entries(frequenzaLabel).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-text-muted mb-1">Prezzo</label>
                  <input className="input w-full" type="number" step="0.01" value={form.prezzo} onChange={e => setForm({ ...form, prezzo: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs text-text-muted mb-1">Prezzo Annuale</label>
                  <input className="input w-full" type="number" step="0.01" value={form.prezzo_annuale} onChange={e => setForm({ ...form, prezzo_annuale: e.target.value })} />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.attivo} onChange={e => setForm({ ...form, attivo: e.target.checked })} className="w-4 h-4" />
                    <span className="text-sm">Attivo</span>
                  </label>
                </div>
                <div className="md:col-span-3">
                  <label className="block text-xs text-text-muted mb-1">Descrizione</label>
                  <textarea className="input w-full" rows={2} value={form.descrizione} onChange={e => setForm({ ...form, descrizione: e.target.value })} />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button onClick={resetForm} className="btn-ghost text-sm">Annulla</button>
                <button onClick={save} disabled={saving || !form.nome} className="btn-primary text-sm">
                  {saving ? 'Salvataggio...' : editing ? 'Aggiorna' : 'Crea'}
                </button>
              </div>
            </div>
          )}

          {/* Table */}
          {loading ? (
            <div className="card p-8 text-center">
              <div className="w-8 h-8 border-3 border-secondary border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : servizi.length === 0 ? (
            <div className="card p-8 text-center">
              <Flower2 size={32} className="mx-auto mb-3 text-text-muted/30" />
              <p className="text-text-muted">Nessun servizio configurato</p>
            </div>
          ) : (
            <div className="card overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="p-3 font-medium text-text-muted">Nome</th>
                    <th className="p-3 font-medium text-text-muted">Categoria</th>
                    <th className="p-3 font-medium text-text-muted">Frequenza</th>
                    <th className="p-3 font-medium text-text-muted">Prezzo</th>
                    <th className="p-3 font-medium text-text-muted">Prezzo Annuale</th>
                    <th className="p-3 font-medium text-text-muted">Attivo</th>
                    <th className="p-3 font-medium text-text-muted">Azioni</th>
                  </tr>
                </thead>
                <tbody>
                  {servizi.map(s => (
                    <tr key={s.id} className="border-b border-border/50 hover:bg-background/50">
                      <td className="p-3 font-medium text-primary">{s.nome}</td>
                      <td className="p-3">{categorieLabel[s.categoria] || s.categoria}</td>
                      <td className="p-3">{frequenzaLabel[s.frequenza] || s.frequenza}</td>
                      <td className="p-3">{s.prezzo ? `${Number(s.prezzo).toFixed(2)}` : '-'}</td>
                      <td className="p-3">{s.prezzo_annuale ? `${Number(s.prezzo_annuale).toFixed(2)}` : '-'}</td>
                      <td className="p-3">
                        <button onClick={() => toggleAttivo(s)}
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.attivo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {s.attivo ? 'Attivo' : 'Disattivo'}
                        </button>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-1">
                          <button onClick={() => openEdit(s)} className="p-1.5 hover:bg-background rounded"><Pencil size={14} /></button>
                          <button onClick={() => remove(s.id)} className="p-1.5 hover:bg-red-50 rounded text-red-500"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {tab === 'abbonamenti' && (
        <>
          {abbonamenti.length === 0 ? (
            <div className="card p-8 text-center">
              <Flower2 size={32} className="mx-auto mb-3 text-text-muted/30" />
              <p className="text-text-muted">Nessun abbonamento attivo</p>
            </div>
          ) : (
            <div className="card overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="p-3 font-medium text-text-muted">Cliente</th>
                    <th className="p-3 font-medium text-text-muted">Servizio</th>
                    <th className="p-3 font-medium text-text-muted">Frequenza</th>
                    <th className="p-3 font-medium text-text-muted">Prezzo</th>
                    <th className="p-3 font-medium text-text-muted">Stato</th>
                    <th className="p-3 font-medium text-text-muted">Prossima Esecuzione</th>
                  </tr>
                </thead>
                <tbody>
                  {abbonamenti.map(a => (
                    <tr key={a.id} className="border-b border-border/50 hover:bg-background/50">
                      <td className="p-3 font-medium text-primary">{a.cliente_nome}</td>
                      <td className="p-3">{a.servizio?.nome || a.servizio_nome || '-'}</td>
                      <td className="p-3">{frequenzaLabel[a.frequenza] || a.frequenza}</td>
                      <td className="p-3">{a.prezzo ? `${Number(a.prezzo).toFixed(2)}` : '-'}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          a.stato === 'attivo' ? 'bg-green-100 text-green-700' :
                          a.stato === 'sospeso' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>{a.stato}</span>
                      </td>
                      <td className="p-3">{a.prossima_esecuzione ? new Date(a.prossima_esecuzione).toLocaleDateString('it-IT') : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  )
}
