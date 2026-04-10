'use client'

import { useEffect, useState } from 'react'
import { Stethoscope, Plus, Pencil, Trash2, X, Copy, Check } from 'lucide-react'

export default function AdminPetVeterinari() {
  const [vets, setVets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [copied, setCopied] = useState('')
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    nome_studio: '', nome_veterinario: '', indirizzo: '', citta: '', provincia: '',
    cap: '', telefono: '', email: '', sito_web: '', commissione_percentuale: '10',
  })

  const load = () => {
    fetch('/api/pet/veterinari?all=1').then(r => r.json()).then(d => {
      if (Array.isArray(d)) setVets(d)
      setLoading(false)
    }).catch(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const resetForm = () => {
    setForm({ nome_studio: '', nome_veterinario: '', indirizzo: '', citta: '', provincia: '', cap: '', telefono: '', email: '', sito_web: '', commissione_percentuale: '10' })
    setEditing(null); setShowForm(false)
  }

  const openEdit = (v: any) => {
    setForm({
      nome_studio: v.nome_studio, nome_veterinario: v.nome_veterinario,
      indirizzo: v.indirizzo || '', citta: v.citta || '', provincia: v.provincia || '',
      cap: v.cap || '', telefono: v.telefono || '', email: v.email,
      sito_web: v.sito_web || '', commissione_percentuale: String(v.commissione_percentuale),
    })
    setEditing(v); setShowForm(true)
  }

  const save = async () => {
    setSaving(true)
    const body = { ...form, commissione_percentuale: parseFloat(form.commissione_percentuale) || 10 }
    if (editing) {
      await fetch('/api/pet/veterinari', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editing.id, ...body }) })
    } else {
      await fetch('/api/pet/veterinari', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    }
    load(); resetForm(); setSaving(false)
  }

  const remove = async (id: string) => {
    if (!confirm('Eliminare questo veterinario?')) return
    await fetch('/api/pet/veterinari', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    load()
  }

  const toggleAttivo = async (v: any) => {
    await fetch('/api/pet/veterinari', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: v.id, attivo: !v.attivo }) })
    load()
  }

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/pet/configuratore?vet=${code}`)
    setCopied(code)
    setTimeout(() => setCopied(''), 2000)
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Veterinari Partner</h1>
          <p className="text-text-muted text-sm">{vets.length} studi veterinari</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true) }} className="btn-primary text-sm">
          <Plus size={16} className="mr-1" /> Aggiungi
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card p-4 mb-6 border-secondary/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-primary">{editing ? 'Modifica veterinario' : 'Nuovo veterinario partner'}</h3>
            <button onClick={resetForm}><X size={18} className="text-text-muted" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input type="text" placeholder="Nome studio *" value={form.nome_studio} onChange={e => setForm({ ...form, nome_studio: e.target.value })} className="input-field text-sm" />
            <input type="text" placeholder="Nome veterinario *" value={form.nome_veterinario} onChange={e => setForm({ ...form, nome_veterinario: e.target.value })} className="input-field text-sm" />
            <input type="email" placeholder="Email *" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="input-field text-sm" />
            <input type="text" placeholder="Telefono" value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} className="input-field text-sm" />
            <input type="text" placeholder="Indirizzo" value={form.indirizzo} onChange={e => setForm({ ...form, indirizzo: e.target.value })} className="input-field text-sm" />
            <input type="text" placeholder="Citta" value={form.citta} onChange={e => setForm({ ...form, citta: e.target.value })} className="input-field text-sm" />
            <input type="text" placeholder="Provincia" value={form.provincia} onChange={e => setForm({ ...form, provincia: e.target.value })} className="input-field text-sm" />
            <input type="text" placeholder="CAP" value={form.cap} onChange={e => setForm({ ...form, cap: e.target.value })} className="input-field text-sm" />
            <input type="text" placeholder="Sito web" value={form.sito_web} onChange={e => setForm({ ...form, sito_web: e.target.value })} className="input-field text-sm" />
            <div>
              <label className="text-xs text-text-muted">Commissione %</label>
              <input type="number" min="1" max="20" value={form.commissione_percentuale} onChange={e => setForm({ ...form, commissione_percentuale: e.target.value })} className="input-field text-sm w-full" />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={resetForm} className="btn-secondary text-sm">Annulla</button>
            <button onClick={save} disabled={saving || !form.nome_studio || !form.nome_veterinario || !form.email} className="btn-primary text-sm">
              {saving ? 'Salvo...' : editing ? 'Salva' : 'Crea'}
            </button>
          </div>
        </div>
      )}

      {/* Lista */}
      {loading ? (
        <div className="card p-8 text-center"><p className="text-text-muted">Caricamento...</p></div>
      ) : vets.length === 0 ? (
        <div className="card p-8 text-center">
          <Stethoscope size={32} className="mx-auto mb-3 text-text-muted/30" />
          <p className="text-text-muted">Nessun veterinario partner. Clicca Aggiungi per iniziare.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {vets.map(v => (
            <div key={v.id} className={`card p-4 ${!v.attivo ? 'opacity-50' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-primary">{v.nome_studio}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${v.attivo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {v.attivo ? 'Attivo' : 'Disattivato'}
                    </span>
                  </div>
                  <p className="text-text-muted text-sm">Dr. {v.nome_veterinario}</p>
                  {v.citta && <p className="text-text-muted text-xs">{v.indirizzo ? `${v.indirizzo}, ` : ''}{v.citta} {v.provincia ? `(${v.provincia})` : ''}</p>}
                  <div className="flex items-center gap-4 mt-2 text-xs">
                    {v.telefono && <a href={`tel:${v.telefono}`} className="text-secondary">{v.telefono}</a>}
                    <a href={`mailto:${v.email}`} className="text-secondary">{v.email}</a>
                    <span className="text-text-muted">Commissione: {v.commissione_percentuale}%</span>
                    <span className="text-text-muted">Ordini: {v.ordini_totali}</span>
                  </div>
                  {v.codice_convenzione && (
                    <div className="flex items-center gap-2 mt-2">
                      <code className="text-xs bg-background px-2 py-1 rounded">{v.codice_convenzione}</code>
                      <button onClick={() => copyCode(v.codice_convenzione)} className="text-secondary hover:text-secondary-dark text-xs flex items-center gap-1">
                        {copied === v.codice_convenzione ? <><Check size={12} /> Copiato</> : <><Copy size={12} /> Copia link</>}
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => toggleAttivo(v)} className="p-1.5 hover:bg-background rounded text-xs text-text-muted">
                    {v.attivo ? 'Disattiva' : 'Attiva'}
                  </button>
                  <button onClick={() => openEdit(v)} className="p-1.5 hover:bg-background rounded"><Pencil size={14} className="text-text-muted" /></button>
                  <button onClick={() => remove(v.id)} className="p-1.5 hover:bg-red-50 rounded"><Trash2 size={14} className="text-red-400" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
