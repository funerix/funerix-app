'use client'

import { useEffect, useState } from 'react'
import { Package, Plus, Pencil, Trash2, X } from 'lucide-react'

const categorie = ['urna', 'cofanetto', 'impronta', 'accessorio']

export default function AdminPetCatalogo() {
  const [prodotti, setProdotti] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ nome: '', categoria: 'urna', materiale: '', descrizione: '', prezzo: '', disponibile: true })
  const [saving, setSaving] = useState(false)

  const load = () => {
    fetch('/api/pet/prodotti').then(r => r.json()).then(d => {
      if (Array.isArray(d)) setProdotti(d)
      setLoading(false)
    }).catch(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const resetForm = () => { setForm({ nome: '', categoria: 'urna', materiale: '', descrizione: '', prezzo: '', disponibile: true }); setEditing(null); setShowForm(false) }

  const openEdit = (p: any) => {
    setForm({ nome: p.nome, categoria: p.categoria, materiale: p.materiale || '', descrizione: p.descrizione || '', prezzo: String(p.prezzo), disponibile: p.disponibile })
    setEditing(p)
    setShowForm(true)
  }

  const save = async () => {
    setSaving(true)
    const body = { ...form, prezzo: parseFloat(form.prezzo) || 0 }
    if (editing) {
      await fetch('/api/pet/prodotti', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editing.id, ...body }) })
    } else {
      await fetch('/api/pet/prodotti', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    }
    load()
    resetForm()
    setSaving(false)
  }

  const remove = async (id: string) => {
    if (!confirm('Eliminare questo prodotto?')) return
    await fetch('/api/pet/prodotti', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    load()
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Catalogo Pet</h1>
          <p className="text-text-muted text-sm">{prodotti.length} prodotti</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true) }} className="btn-primary text-sm">
          <Plus size={16} className="mr-1" /> Aggiungi
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card p-4 mb-6 border-secondary/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-primary">{editing ? 'Modifica prodotto' : 'Nuovo prodotto'}</h3>
            <button onClick={resetForm}><X size={18} className="text-text-muted" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input type="text" placeholder="Nome prodotto" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} className="input-field text-sm" />
            <select value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })} className="input-field text-sm">
              {categorie.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            </select>
            <input type="text" placeholder="Materiale" value={form.materiale} onChange={e => setForm({ ...form, materiale: e.target.value })} className="input-field text-sm" />
            <input type="number" placeholder="Prezzo (€)" value={form.prezzo} onChange={e => setForm({ ...form, prezzo: e.target.value })} className="input-field text-sm" />
            <input type="text" placeholder="Descrizione" value={form.descrizione} onChange={e => setForm({ ...form, descrizione: e.target.value })} className="input-field text-sm md:col-span-2" />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.disponibile} onChange={e => setForm({ ...form, disponibile: e.target.checked })} />
              Disponibile
            </label>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={resetForm} className="btn-secondary text-sm">Annulla</button>
            <button onClick={save} disabled={saving || !form.nome || !form.prezzo} className="btn-primary text-sm">
              {saving ? 'Salvo...' : editing ? 'Salva' : 'Crea'}
            </button>
          </div>
        </div>
      )}

      {/* Lista */}
      {loading ? (
        <div className="card p-8 text-center"><p className="text-text-muted">Caricamento...</p></div>
      ) : prodotti.length === 0 ? (
        <div className="card p-8 text-center">
          <Package size={32} className="mx-auto mb-3 text-text-muted/30" />
          <p className="text-text-muted">Nessun prodotto. Esegui lo SQL e poi clicca Aggiungi.</p>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-text-muted font-medium">Prodotto</th>
                <th className="text-left py-3 px-4 text-text-muted font-medium">Categoria</th>
                <th className="text-left py-3 px-4 text-text-muted font-medium hidden md:table-cell">Materiale</th>
                <th className="text-right py-3 px-4 text-text-muted font-medium">Prezzo</th>
                <th className="text-center py-3 px-4 text-text-muted font-medium">Stato</th>
                <th className="w-20"></th>
              </tr>
            </thead>
            <tbody>
              {prodotti.map(p => (
                <tr key={p.id} className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <p className="font-medium text-primary">{p.nome}</p>
                    {p.descrizione && <p className="text-text-muted text-xs truncate max-w-xs">{p.descrizione}</p>}
                  </td>
                  <td className="py-3 px-4 capitalize">{p.categoria}</td>
                  <td className="py-3 px-4 hidden md:table-cell text-text-light">{p.materiale || '—'}</td>
                  <td className="py-3 px-4 text-right font-medium">&euro; {p.prezzo}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${p.disponibile ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {p.disponibile ? 'Attivo' : 'Nascosto'}
                    </span>
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
