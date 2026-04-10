'use client'

import { useEffect, useState } from 'react'
import { Handshake, Plus, Pencil, Trash2, X, Phone, Mail, MapPin } from 'lucide-react'

export default function AdminRimpatriPartner() {
  const [partner, setPartner] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    nome_agenzia: '', paese: '', citta: '', indirizzo: '', telefono: '', email: '',
    referente: '', commissione_percentuale: '10',
  })

  const load = () => {
    fetch('/api/rimpatri/partner').then(r => r.json()).then(d => {
      if (Array.isArray(d)) setPartner(d)
      setLoading(false)
    }).catch(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const resetForm = () => {
    setForm({ nome_agenzia: '', paese: '', citta: '', indirizzo: '', telefono: '', email: '', referente: '', commissione_percentuale: '10' })
    setEditing(null); setShowForm(false)
  }

  const openEdit = (p: any) => {
    setForm({
      nome_agenzia: p.nome_agenzia || '', paese: p.paese || '', citta: p.citta || '',
      indirizzo: p.indirizzo || '', telefono: p.telefono || '', email: p.email || '',
      referente: p.referente || '', commissione_percentuale: String(p.commissione_percentuale || 10),
    })
    setEditing(p); setShowForm(true)
  }

  const save = async () => {
    setSaving(true)
    const body = { ...form, commissione_percentuale: parseFloat(form.commissione_percentuale) || 10 }
    if (editing) {
      await fetch('/api/rimpatri/partner', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editing.id, ...body }) })
    } else {
      await fetch('/api/rimpatri/partner', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    }
    load(); resetForm(); setSaving(false)
  }

  const remove = async (id: string) => {
    if (!confirm('Eliminare questo partner?')) return
    await fetch('/api/rimpatri/partner', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    load()
  }

  const toggleAttivo = async (p: any) => {
    await fetch('/api/rimpatri/partner', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: p.id, attivo: !p.attivo }) })
    load()
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-primary">Partner Esteri</h1>
          <p className="text-text-muted text-sm">{partner.length} partner registrati</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true) }} className="btn-primary text-sm">
          <Plus size={16} className="mr-1" /> Aggiungi
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card p-4 mb-6 border-secondary/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-primary">{editing ? 'Modifica partner' : 'Nuovo partner'}</h3>
            <button onClick={resetForm}><X size={18} className="text-text-muted" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input type="text" placeholder="Nome agenzia *" value={form.nome_agenzia} onChange={e => setForm({ ...form, nome_agenzia: e.target.value })} className="input-field text-sm" />
            <input type="text" placeholder="Paese *" value={form.paese} onChange={e => setForm({ ...form, paese: e.target.value })} className="input-field text-sm" />
            <input type="text" placeholder="Citta" value={form.citta} onChange={e => setForm({ ...form, citta: e.target.value })} className="input-field text-sm" />
            <input type="text" placeholder="Indirizzo" value={form.indirizzo} onChange={e => setForm({ ...form, indirizzo: e.target.value })} className="input-field text-sm" />
            <input type="text" placeholder="Telefono" value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} className="input-field text-sm" />
            <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="input-field text-sm" />
            <input type="text" placeholder="Referente" value={form.referente} onChange={e => setForm({ ...form, referente: e.target.value })} className="input-field text-sm" />
            <div>
              <label className="text-xs text-text-muted">Commissione %</label>
              <input type="number" min="1" max="50" value={form.commissione_percentuale} onChange={e => setForm({ ...form, commissione_percentuale: e.target.value })} className="input-field text-sm w-full" />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={resetForm} className="btn-secondary text-sm">Annulla</button>
            <button onClick={save} disabled={saving || !form.nome_agenzia || !form.paese} className="btn-primary text-sm">
              {saving ? 'Salvo...' : editing ? 'Salva' : 'Crea'}
            </button>
          </div>
        </div>
      )}

      {/* Card layout */}
      {loading ? (
        <div className="card p-8 text-center"><p className="text-text-muted">Caricamento...</p></div>
      ) : partner.length === 0 ? (
        <div className="card p-8 text-center">
          <Handshake size={32} className="mx-auto mb-3 text-text-muted/30" />
          <p className="text-text-muted">Nessun partner estero. Clicca Aggiungi per iniziare.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {partner.map(p => (
            <div key={p.id} className={`card p-4 ${!p.attivo ? 'opacity-50' : ''}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-primary">{p.nome_agenzia}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${p.attivo !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {p.attivo !== false ? 'Attivo' : 'Disattivato'}
                    </span>
                  </div>
                  <p className="text-text-muted text-xs flex items-center gap-1"><MapPin size={10} /> {p.citta ? `${p.citta}, ` : ''}{p.paese}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => toggleAttivo(p)} className="p-1.5 hover:bg-background rounded text-xs text-text-muted">
                    {p.attivo !== false ? 'Disattiva' : 'Attiva'}
                  </button>
                  <button onClick={() => openEdit(p)} className="p-1.5 hover:bg-background rounded"><Pencil size={14} className="text-text-muted" /></button>
                  <button onClick={() => remove(p.id)} className="p-1.5 hover:bg-red-50 rounded"><Trash2 size={14} className="text-red-400" /></button>
                </div>
              </div>
              <div className="space-y-1 text-xs">
                {p.referente && <p className="text-text-light">Referente: <span className="font-medium">{p.referente}</span></p>}
                {p.email && <p className="flex items-center gap-1"><Mail size={10} className="text-secondary" /> <a href={`mailto:${p.email}`} className="text-secondary">{p.email}</a></p>}
                {p.telefono && <p className="flex items-center gap-1"><Phone size={10} className="text-secondary" /> <a href={`tel:${p.telefono}`} className="text-secondary">{p.telefono}</a></p>}
                <div className="flex items-center gap-3 mt-2 pt-2 border-t border-border">
                  <span className="text-text-muted">Commissione: {p.commissione_percentuale || 10}%</span>
                  <span className="text-text-muted">Pratiche: {p.pratiche_totali || 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
