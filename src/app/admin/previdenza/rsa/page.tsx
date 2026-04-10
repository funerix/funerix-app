'use client'

import { useEffect, useState } from 'react'
import { Building2, Plus, Pencil, Trash2, X, Copy, Check } from 'lucide-react'

const tipiRSA = ['rsa', 'casa_riposo', 'hospice', 'clinica']

export default function AdminPrevidenzaRSA() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState('')
  const [form, setForm] = useState({
    nome_struttura: '', tipo: 'rsa', indirizzo: '', citta: '', provincia: '',
    telefono: '', email: '', referente_nome: '', commissione_percentuale: '10',
  })

  const load = () => {
    fetch('/api/previdenza/rsa?all=1').then(r => r.json()).then(d => {
      if (Array.isArray(d)) setItems(d)
      setLoading(false)
    }).catch(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const resetForm = () => {
    setForm({ nome_struttura: '', tipo: 'rsa', indirizzo: '', citta: '', provincia: '', telefono: '', email: '', referente_nome: '', commissione_percentuale: '10' })
    setEditing(null); setShowForm(false)
  }

  const openEdit = (item: any) => {
    setForm({
      nome_struttura: item.nome_struttura || '', tipo: item.tipo || 'rsa',
      indirizzo: item.indirizzo || '', citta: item.citta || '', provincia: item.provincia || '',
      telefono: item.telefono || '', email: item.email || '',
      referente_nome: item.referente_nome || '',
      commissione_percentuale: String(item.commissione_percentuale || 10),
    })
    setEditing(item); setShowForm(true)
  }

  const save = async () => {
    setSaving(true)
    const body = { ...form, commissione_percentuale: parseFloat(form.commissione_percentuale) || 10 }
    if (editing) {
      await fetch('/api/previdenza/rsa', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editing.id, ...body }) })
    } else {
      await fetch('/api/previdenza/rsa', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    }
    load(); resetForm(); setSaving(false)
  }

  const remove = async (id: string) => {
    if (!confirm('Eliminare questa RSA?')) return
    await fetch('/api/previdenza/rsa', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    load()
  }

  const toggleAttivo = async (item: any) => {
    await fetch('/api/previdenza/rsa', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: item.id, attivo: !item.attivo }) })
    load()
  }

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/previdenza/configuratore?rsa=${code}`)
    setCopied(code)
    setTimeout(() => setCopied(''), 2000)
  }

  const tipoLabel = (t: string) => t.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">RSA Partner</h1>
          <p className="text-text-muted text-sm">{items.length} strutture</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true) }} className="btn-primary text-sm">
          <Plus size={16} className="mr-1" /> Aggiungi
        </button>
      </div>

      {showForm && (
        <div className="card p-4 mb-6 border-secondary/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-primary">{editing ? 'Modifica RSA' : 'Nuova RSA partner'}</h3>
            <button onClick={resetForm}><X size={18} className="text-text-muted" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input type="text" placeholder="Nome struttura *" value={form.nome_struttura} onChange={e => setForm({ ...form, nome_struttura: e.target.value })} className="input-field text-sm" />
            <select value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })} className="input-field text-sm">
              {tipiRSA.map(t => <option key={t} value={t}>{tipoLabel(t)}</option>)}
            </select>
            <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="input-field text-sm" />
            <input type="text" placeholder="Telefono" value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} className="input-field text-sm" />
            <input type="text" placeholder="Indirizzo" value={form.indirizzo} onChange={e => setForm({ ...form, indirizzo: e.target.value })} className="input-field text-sm" />
            <input type="text" placeholder="Citta" value={form.citta} onChange={e => setForm({ ...form, citta: e.target.value })} className="input-field text-sm" />
            <input type="text" placeholder="Provincia" value={form.provincia} onChange={e => setForm({ ...form, provincia: e.target.value })} className="input-field text-sm" />
            <input type="text" placeholder="Referente" value={form.referente_nome} onChange={e => setForm({ ...form, referente_nome: e.target.value })} className="input-field text-sm" />
            <div>
              <label className="text-xs text-text-muted">Commissione %</label>
              <input type="number" min="1" max="30" value={form.commissione_percentuale} onChange={e => setForm({ ...form, commissione_percentuale: e.target.value })} className="input-field text-sm w-full" />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={resetForm} className="btn-secondary text-sm">Annulla</button>
            <button onClick={save} disabled={saving || !form.nome_struttura} className="btn-primary text-sm">
              {saving ? 'Salvo...' : editing ? 'Salva' : 'Crea'}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="card p-8 text-center"><p className="text-text-muted">Caricamento...</p></div>
      ) : items.length === 0 ? (
        <div className="card p-8 text-center">
          <Building2 size={32} className="mx-auto mb-3 text-text-muted/30" />
          <p className="text-text-muted">Nessuna RSA partner. Clicca Aggiungi per iniziare.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className={`card p-4 ${!item.attivo ? 'opacity-50' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-primary">{item.nome_struttura}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">{tipoLabel(item.tipo)}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${item.attivo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {item.attivo ? 'Attivo' : 'Disattivato'}
                    </span>
                  </div>
                  {item.citta && <p className="text-text-muted text-xs">{item.indirizzo ? `${item.indirizzo}, ` : ''}{item.citta} {item.provincia ? `(${item.provincia})` : ''}</p>}
                  <div className="flex items-center gap-4 mt-2 text-xs">
                    {item.referente_nome && <span className="text-text-muted">Ref: {item.referente_nome}</span>}
                    <span className="text-text-muted">Commissione: {item.commissione_percentuale}%</span>
                    <span className="text-text-muted">Piani attivi: {item.piani_attivi || 0}</span>
                    {item.telefono && <a href={`tel:${item.telefono}`} className="text-secondary">{item.telefono}</a>}
                    {item.email && <a href={`mailto:${item.email}`} className="text-secondary">{item.email}</a>}
                  </div>
                  {item.codice_convenzione && (
                    <div className="flex items-center gap-2 mt-2">
                      <code className="text-xs bg-background px-2 py-1 rounded">{item.codice_convenzione}</code>
                      <button onClick={() => copyCode(item.codice_convenzione)} className="text-secondary hover:text-secondary-dark text-xs flex items-center gap-1">
                        {copied === item.codice_convenzione ? <><Check size={12} /> Copiato</> : <><Copy size={12} /> Copia link</>}
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => toggleAttivo(item)} className="p-1.5 hover:bg-background rounded text-xs text-text-muted">
                    {item.attivo ? 'Disattiva' : 'Attiva'}
                  </button>
                  <button onClick={() => openEdit(item)} className="p-1.5 hover:bg-background rounded"><Pencil size={14} className="text-text-muted" /></button>
                  <button onClick={() => remove(item.id)} className="p-1.5 hover:bg-red-50 rounded"><Trash2 size={14} className="text-red-400" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
