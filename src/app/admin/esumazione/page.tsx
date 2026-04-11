'use client'

import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, Save, Eye, EyeOff, X } from 'lucide-react'
import { useState, useEffect } from 'react'

interface Servizio {
  id: string
  nome: string
  prezzo: string
  descrizione: string
  ordine: number
  attivo: boolean
}

export default function AdminEsumazionePage() {
  const [servizi, setServizi] = useState<Servizio[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ nome: '', prezzo: '', descrizione: '' })

  useEffect(() => {
    fetch('/api/esumazione').then(r => r.json()).then(data => {
      if (Array.isArray(data)) setServizi(data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const handleSalva = async () => {
    if (!form.nome || !form.prezzo) return

    if (editId) {
      await fetch('/api/esumazione', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editId, ...form }),
      })
      setServizi(prev => prev.map(s => s.id === editId ? { ...s, ...form } : s))
    } else {
      const res = await fetch('/api/esumazione', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, ordine: servizi.length + 1 }),
      })
      const data = await res.json()
      if (data?.id) setServizi([...servizi, data])
    }
    setForm({ nome: '', prezzo: '', descrizione: '' })
    setEditId(null)
    setShowForm(false)
  }

  const handleElimina = async (id: string) => {
    if (!confirm('Eliminare questo servizio?')) return
    await fetch('/api/esumazione', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setServizi(prev => prev.filter(s => s.id !== id))
  }

  const handleModifica = (s: Servizio) => {
    setForm({ nome: s.nome, prezzo: s.prezzo, descrizione: s.descrizione || '' })
    setEditId(s.id)
    setShowForm(true)
  }

  return (
    <div className="min-h-screen bg-background-dark">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-text-muted hover:text-primary"><ArrowLeft size={20} /></Link>
            <div>
              <h1 className="font-[family-name:var(--font-serif)] text-3xl text-primary">Esumazione</h1>
              <p className="text-text-light text-sm">Gestisci servizi e prezzi esumazione ({servizi.length})</p>
            </div>
          </div>
          <button onClick={() => { setForm({ nome: '', prezzo: '', descrizione: '' }); setEditId(null); setShowForm(true) }}
            className="btn-accent text-sm"><Plus size={16} className="mr-2" /> Aggiungi</button>
        </div>

        {showForm && (
          <div className="card mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-medium text-primary">{editId ? 'Modifica servizio' : 'Nuovo servizio'}</h2>
              <button onClick={() => { setShowForm(false); setEditId(null) }} className="text-text-muted hover:text-primary"><X size={18} /></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div><label className="block text-sm font-medium text-text mb-1">Nome *</label>
                <input className="input-field" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} placeholder="Es. Esumazione ordinaria" /></div>
              <div><label className="block text-sm font-medium text-text mb-1">Prezzo *</label>
                <input className="input-field" value={form.prezzo} onChange={e => setForm({ ...form, prezzo: e.target.value })} placeholder="Es. 400 — 800" /></div>
            </div>
            <div className="mb-4"><label className="block text-sm font-medium text-text mb-1">Descrizione</label>
              <textarea rows={2} className="input-field" value={form.descrizione} onChange={e => setForm({ ...form, descrizione: e.target.value })} /></div>
            <button onClick={handleSalva} className="btn-primary text-sm"><Save size={16} className="mr-2" /> Salva</button>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12"><div className="w-8 h-8 border-3 border-secondary border-t-transparent rounded-full animate-spin mx-auto" /></div>
        ) : (
          <div className="space-y-2">
            {servizi.map(s => (
              <div key={s.id} className="card flex items-center justify-between">
                <div className="flex-1 cursor-pointer" onClick={() => handleModifica(s)}>
                  <p className="font-medium text-primary text-sm">{s.nome}</p>
                  <p className="text-text-muted text-xs">{s.descrizione}</p>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  <p className="text-primary font-medium whitespace-nowrap">&euro; {s.prezzo}</p>
                  <button onClick={() => handleElimina(s.id)} className="text-text-muted hover:text-error"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
            {servizi.length === 0 && <p className="text-text-muted text-center py-8">Nessun servizio.</p>}
          </div>
        )}
      </div>
    </div>
  )
}
