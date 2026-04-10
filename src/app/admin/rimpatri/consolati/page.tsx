'use client'

import { useEffect, useState } from 'react'
import { Landmark, Plus, Pencil, Trash2, X } from 'lucide-react'

export default function AdminRimpatriConsolati() {
  const [consolati, setConsolati] = useState<any[]>([])
  const [paesi, setPaesi] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    paese_id: '', citta: '', indirizzo: '', telefono: '', email: '', sito_web: '', orari: '',
  })

  const load = () => {
    Promise.all([
      fetch('/api/rimpatri/consolati').then(r => r.json()),
      fetch('/api/rimpatri/paesi?all=1').then(r => r.json()),
    ]).then(([c, p]) => {
      if (Array.isArray(c)) setConsolati(c)
      if (Array.isArray(p)) setPaesi(p)
      setLoading(false)
    }).catch(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const resetForm = () => {
    setForm({ paese_id: '', citta: '', indirizzo: '', telefono: '', email: '', sito_web: '', orari: '' })
    setEditing(null); setShowForm(false)
  }

  const openEdit = (c: any) => {
    setForm({
      paese_id: c.paese_id || '', citta: c.citta || '', indirizzo: c.indirizzo || '',
      telefono: c.telefono || '', email: c.email || '', sito_web: c.sito_web || '', orari: c.orari || '',
    })
    setEditing(c); setShowForm(true)
  }

  const save = async () => {
    setSaving(true)
    const body = { ...form }
    if (editing) {
      await fetch('/api/rimpatri/consolati', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editing.id, ...body }) })
    } else {
      await fetch('/api/rimpatri/consolati', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    }
    load(); resetForm(); setSaving(false)
  }

  const remove = async (id: string) => {
    if (!confirm('Eliminare questo consolato?')) return
    await fetch('/api/rimpatri/consolati', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    load()
  }

  const getPaese = (id: string) => paesi.find(p => p.id === id)

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-primary">Consolati</h1>
          <p className="text-text-muted text-sm">{consolati.length} consolati e ambasciate</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true) }} className="btn-primary text-sm">
          <Plus size={16} className="mr-1" /> Aggiungi
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card p-4 mb-6 border-secondary/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-primary">{editing ? 'Modifica consolato' : 'Nuovo consolato'}</h3>
            <button onClick={resetForm}><X size={18} className="text-text-muted" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <select value={form.paese_id} onChange={e => setForm({ ...form, paese_id: e.target.value })} className="input-field text-sm">
              <option value="">Seleziona paese *</option>
              {paesi.map(p => <option key={p.id} value={p.id}>{p.bandiera_emoji} {p.nome}</option>)}
            </select>
            <input type="text" placeholder="Citta *" value={form.citta} onChange={e => setForm({ ...form, citta: e.target.value })} className="input-field text-sm" />
            <input type="text" placeholder="Indirizzo" value={form.indirizzo} onChange={e => setForm({ ...form, indirizzo: e.target.value })} className="input-field text-sm" />
            <input type="text" placeholder="Telefono" value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} className="input-field text-sm" />
            <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="input-field text-sm" />
            <input type="text" placeholder="Sito web" value={form.sito_web} onChange={e => setForm({ ...form, sito_web: e.target.value })} className="input-field text-sm" />
          </div>
          <div className="mt-3">
            <label className="text-xs text-text-muted">Orari</label>
            <input type="text" placeholder="Es. Lun-Ven 9:00-12:00" value={form.orari} onChange={e => setForm({ ...form, orari: e.target.value })} className="input-field text-sm w-full" />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={resetForm} className="btn-secondary text-sm">Annulla</button>
            <button onClick={save} disabled={saving || !form.paese_id || !form.citta} className="btn-primary text-sm">
              {saving ? 'Salvo...' : editing ? 'Salva' : 'Crea'}
            </button>
          </div>
        </div>
      )}

      {/* Lista */}
      {loading ? (
        <div className="card p-8 text-center"><p className="text-text-muted">Caricamento...</p></div>
      ) : consolati.length === 0 ? (
        <div className="card p-8 text-center">
          <Landmark size={32} className="mx-auto mb-3 text-text-muted/30" />
          <p className="text-text-muted">Nessun consolato configurato. Clicca Aggiungi per iniziare.</p>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-text-muted font-medium">Paese</th>
                <th className="text-left py-3 px-4 text-text-muted font-medium">Citta</th>
                <th className="text-left py-3 px-4 text-text-muted font-medium hidden md:table-cell">Indirizzo</th>
                <th className="text-left py-3 px-4 text-text-muted font-medium hidden md:table-cell">Telefono</th>
                <th className="text-left py-3 px-4 text-text-muted font-medium hidden lg:table-cell">Email</th>
                <th className="w-20"></th>
              </tr>
            </thead>
            <tbody>
              {consolati.map(c => {
                const paese = c.rimpatri_paesi || getPaese(c.paese_id)
                return (
                  <tr key={c.id} className="border-b border-border/50">
                    <td className="py-3 px-4 font-medium">{paese?.bandiera_emoji || ''} {paese?.nome || '—'}</td>
                    <td className="py-3 px-4">{c.citta}</td>
                    <td className="py-3 px-4 text-text-light hidden md:table-cell">{c.indirizzo || '—'}</td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      {c.telefono ? <a href={`tel:${c.telefono}`} className="text-secondary">{c.telefono}</a> : '—'}
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      {c.email ? <a href={`mailto:${c.email}`} className="text-secondary">{c.email}</a> : '—'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1 justify-end">
                        <button onClick={() => openEdit(c)} className="p-1.5 hover:bg-background rounded"><Pencil size={14} className="text-text-muted" /></button>
                        <button onClick={() => remove(c.id)} className="p-1.5 hover:bg-red-50 rounded"><Trash2 size={14} className="text-red-400" /></button>
                      </div>
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
