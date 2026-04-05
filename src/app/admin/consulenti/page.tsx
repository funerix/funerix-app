'use client'

import Link from 'next/link'
import { ArrowLeft, Plus, Edit2, Trash2, Eye, EyeOff, X, Save, Users, Shield, User } from 'lucide-react'
import { getSupabase } from '@/lib/supabase-client'
import { useState, useEffect } from 'react'

interface Consulente {
  id: string; email: string; nome: string; ruolo: string;
  telefono: string; attivo: boolean; created_at: string
}

export default function ConsulentiPage() {
  const [consulenti, setConsulenti] = useState<Consulente[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ nome: '', email: '', password: '', ruolo: 'consulente', telefono: '' })
  const [salvato, setSalvato] = useState(false)
  const [errore, setErrore] = useState('')

  useEffect(() => {
    getSupabase().from('admin_users').select('id, email, nome, ruolo, telefono, attivo, created_at').order('created_at')
      .then(({ data }: { data: unknown[] | null }) => setConsulenti((data || []) as Consulente[]))
  }, [])

  const salva = async () => {
    setErrore('')
    if (!form.nome || !form.email) { setErrore('Nome e email obbligatori'); return }

    const sb = getSupabase()

    if (editId) {
      // Modifica
      const updates: Record<string, string> = { nome: form.nome, email: form.email, ruolo: form.ruolo, telefono: form.telefono }
      if (form.password) updates.password_hash = form.password
      await sb.from('admin_users').update(updates).eq('id', editId)
      setConsulenti(consulenti.map(c => c.id === editId ? { ...c, ...updates } : c))
    } else {
      // Nuovo
      if (!form.password) { setErrore('Password obbligatoria per nuovo utente'); return }
      // Controlla email unica
      const { data: existing } = await sb.from('admin_users').select('id').eq('email', form.email)
      if (existing && existing.length > 0) { setErrore('Email già in uso'); return }

      const { data, error } = await sb.from('admin_users').insert({
        nome: form.nome, email: form.email, password_hash: form.password,
        ruolo: form.ruolo, telefono: form.telefono, attivo: true,
      }).select().single()
      if (error) { setErrore(error.message); return }
      if (data) setConsulenti([...consulenti, data as unknown as Consulente])
    }

    setShowForm(false)
    setEditId(null)
    setForm({ nome: '', email: '', password: '', ruolo: 'consulente', telefono: '' })
    setSalvato(true)
    setTimeout(() => setSalvato(false), 2000)
  }

  const elimina = async (id: string) => {
    const c = consulenti.find(x => x.id === id)
    if (c?.ruolo === 'admin' && consulenti.filter(x => x.ruolo === 'admin').length <= 1) {
      alert('Non puoi eliminare l\'unico amministratore')
      return
    }
    if (!confirm('Eliminare questo utente?')) return
    await getSupabase().from('admin_users').delete().eq('id', id)
    setConsulenti(consulenti.filter(c => c.id !== id))
  }

  const toggleAttivo = async (id: string) => {
    const c = consulenti.find(x => x.id === id)
    if (!c) return
    await getSupabase().from('admin_users').update({ attivo: !c.attivo }).eq('id', id)
    setConsulenti(consulenti.map(x => x.id === id ? { ...x, attivo: !x.attivo } : x))
  }

  const apriModifica = (c: Consulente) => {
    setForm({ nome: c.nome, email: c.email, password: '', ruolo: c.ruolo, telefono: c.telefono || '' })
    setEditId(c.id)
    setShowForm(true)
    setErrore('')
  }

  return (
    <div className="min-h-screen bg-background-dark">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-[family-name:var(--font-serif)] text-3xl text-primary">Consulenti</h1>
            <p className="text-text-light text-sm">{consulenti.length} utenti — {consulenti.filter(c => c.ruolo === 'admin').length} admin, {consulenti.filter(c => c.ruolo === 'consulente').length} consulenti</p>
          </div>
          <div className="flex gap-2 items-center">
            {salvato && <span className="text-accent text-sm">Salvato!</span>}
            <button onClick={() => { setForm({ nome: '', email: '', password: '', ruolo: 'consulente', telefono: '' }); setEditId(null); setShowForm(true); setErrore('') }}
              className="btn-accent text-sm"><Plus size={16} className="mr-1" /> Nuovo Consulente</button>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="card mb-6">
            <div className="flex justify-between mb-4">
              <h2 className="font-[family-name:var(--font-serif)] text-lg text-primary">
                {editId ? 'Modifica utente' : 'Nuovo consulente'}
              </h2>
              <button onClick={() => setShowForm(false)}><X size={18} className="text-text-muted" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-text mb-1">Nome completo *</label>
                <input type="text" className="input-field text-sm" placeholder="Mario Rossi"
                  value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium text-text mb-1">Email *</label>
                <input type="email" className="input-field text-sm" placeholder="consulente@funerix.com"
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium text-text mb-1">{editId ? 'Nuova password (lascia vuoto per non cambiare)' : 'Password *'}</label>
                <input type="password" className="input-field text-sm" placeholder="••••••••"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium text-text mb-1">Ruolo</label>
                <select className="input-field text-sm" value={form.ruolo} onChange={e => setForm({ ...form, ruolo: e.target.value })}>
                  <option value="consulente">Consulente</option>
                  <option value="admin">Amministratore</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-text mb-1">Telefono</label>
                <input type="tel" className="input-field text-sm" placeholder="333..."
                  value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} />
              </div>
            </div>
            {errore && <p className="text-error text-sm mt-3 bg-error/10 rounded px-3 py-2">{errore}</p>}
            <div className="flex gap-2 mt-4">
              <button onClick={salva} className="btn-accent text-xs"><Save size={14} className="mr-1" /> {editId ? 'Salva modifiche' : 'Crea consulente'}</button>
              <button onClick={() => setShowForm(false)} className="btn-secondary text-xs">Annulla</button>
            </div>
          </div>
        )}

        {/* Ruoli spiegati */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="card py-4 flex items-start gap-3">
            <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield size={16} className="text-secondary" />
            </div>
            <div>
              <p className="font-medium text-primary text-sm">Amministratore</p>
              <p className="text-text-muted text-xs">Accesso completo: gestione prodotti, impostazioni, consulenti, tutto il sistema.</p>
            </div>
          </div>
          <div className="card py-4 flex items-start gap-3">
            <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <User size={16} className="text-accent" />
            </div>
            <div>
              <p className="font-medium text-primary text-sm">Consulente</p>
              <p className="text-text-muted text-xs">Accesso limitato: solo le proprie pratiche assegnate, calendario, chat con clienti.</p>
            </div>
          </div>
        </div>

        {/* Lista */}
        <div className="card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-3 text-text-muted font-medium">Utente</th>
                <th className="text-left py-3 px-3 text-text-muted font-medium">Email</th>
                <th className="text-left py-3 px-3 text-text-muted font-medium">Telefono</th>
                <th className="text-center py-3 px-3 text-text-muted font-medium">Ruolo</th>
                <th className="text-center py-3 px-3 text-text-muted font-medium">Stato</th>
                <th className="text-right py-3 px-3 text-text-muted font-medium">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {consulenti.map(c => (
                <tr key={c.id} className="border-b border-border/50 hover:bg-background transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${c.ruolo === 'admin' ? 'bg-secondary/10' : 'bg-accent/10'}`}>
                        {c.ruolo === 'admin' ? <Shield size={14} className="text-secondary" /> : <User size={14} className="text-accent" />}
                      </div>
                      <span className="font-medium text-primary">{c.nome}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-text-light">{c.email}</td>
                  <td className="py-3 px-3 text-text-light">{c.telefono || '—'}</td>
                  <td className="py-3 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c.ruolo === 'admin' ? 'bg-secondary/10 text-secondary' : 'bg-accent/10 text-accent'}`}>
                      {c.ruolo}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button onClick={() => toggleAttivo(c.id)}>
                      {c.attivo ? <span className="text-xs text-accent flex items-center justify-center gap-1"><Eye size={12} /> Attivo</span>
                        : <span className="text-xs text-text-muted flex items-center justify-center gap-1"><EyeOff size={12} /> Disattivato</span>}
                    </button>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => apriModifica(c)} className="p-2 text-text-muted hover:text-secondary"><Edit2 size={14} /></button>
                      <button onClick={() => elimina(c.id)} className="p-2 text-text-muted hover:text-error"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
