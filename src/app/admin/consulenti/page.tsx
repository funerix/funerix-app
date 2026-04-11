'use client'

import { Plus, Edit2, Trash2, Eye, EyeOff, X, Save, Shield, User, Crown, Clock } from 'lucide-react'
import { getSupabase } from '@/lib/supabase-client'
import { useState, useEffect } from 'react'

interface Consulente {
  id: string; email: string; nome: string; ruolo: string; telefono: string;
  attivo: boolean; created_at: string; permessi: Record<string, boolean>;
  max_pratiche: number; turni: { giorno: string; dalle: string; alle: string }[]
}

interface Stats { attive: number; completate: number; totale_fatturato: number }

const MODULI = [
  { key: 'prodotti', label: 'Prodotti / Catalogo' },
  { key: 'memorial', label: 'Memorial / Necrologi' },
  { key: 'blog', label: 'Blog' },
  { key: 'media', label: 'Media' },
  { key: 'previdenza', label: 'Piani Previdenza' },
  { key: 'analytics_globali', label: 'Analytics globali' },
]

const GIORNI = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica']
const RUOLI_ICON: Record<string, typeof Shield> = { admin: Crown, manager: Shield, consulente: User }
const RUOLI_COLOR: Record<string, string> = { admin: 'bg-gold/10 text-gold', manager: 'bg-secondary/10 text-secondary', consulente: 'bg-accent/10 text-accent' }

export default function ConsulentiPage() {
  const [consulenti, setConsulenti] = useState<Consulente[]>([])
  const [stats, setStats] = useState<Record<string, Stats>>({})
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ nome: '', email: '', password: '', ruolo: 'consulente', telefono: '', permessi: {} as Record<string, boolean>, max_pratiche: 0, turni: [] as { giorno: string; dalle: string; alle: string }[] })
  const [errore, setErrore] = useState('')
  const [tab, setTab] = useState<'info' | 'permessi' | 'turni'>('info')

  useEffect(() => {
    const sb = getSupabase()
    sb.from('admin_users').select('*').order('created_at')
      .then(({ data }: { data: unknown[] | null }) => {
        setConsulenti((data || []) as Consulente[])
        // Carica stats per ogni consulente
        ;(data || []).forEach((c: unknown) => {
          const user = c as Consulente
          sb.from('richieste').select('stato, totale').eq('consulente_id', user.id)
            .then(({ data: reqs }: { data: unknown[] | null }) => {
              const r = (reqs || []) as { stato: string; totale: number }[]
              setStats(prev => ({ ...prev, [user.id]: {
                attive: r.filter(x => x.stato !== 'completata').length,
                completate: r.filter(x => x.stato === 'completata').length,
                totale_fatturato: r.reduce((s, x) => s + Number(x.totale), 0),
              }}))
            })
        })
      })
  }, [])

  const salva = async () => {
    setErrore('')
    if (!form.nome || !form.email) { setErrore('Nome e email obbligatori'); return }
    const sb = getSupabase()

    if (editId) {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editId, ...form }),
      })
      const result = await res.json()
      if (!res.ok) { setErrore(result.error); return }
      setConsulenti(consulenti.map(c => c.id === editId ? { ...c, nome: form.nome, email: form.email, ruolo: form.ruolo, telefono: form.telefono, permessi: form.permessi, max_pratiche: form.max_pratiche, turni: form.turni } as Consulente : c))
      await sb.from('log_attivita').insert({ user_nome: 'Admin', azione: 'modifica_consulente', dettaglio: `Modificato ${form.nome} (${form.ruolo})` })
    } else {
      if (!form.password) { setErrore('Password obbligatoria'); return }
      const { data: existing } = await sb.from('admin_users').select('id').eq('email', form.email)
      if (existing && existing.length > 0) { setErrore('Email già in uso'); return }
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const result = await res.json()
      if (!res.ok) { setErrore(result.error); return }
      if (result.data) setConsulenti([...consulenti, result.data as unknown as Consulente])
      await sb.from('log_attivita').insert({ user_nome: 'Admin', azione: 'crea_consulente', dettaglio: `Creato ${form.nome} (${form.ruolo})` })
    }
    setShowForm(false); setEditId(null)
  }

  const elimina = async (id: string) => {
    const c = consulenti.find(x => x.id === id)
    if (c?.ruolo === 'admin' && consulenti.filter(x => x.ruolo === 'admin').length <= 1) { alert('Non puoi eliminare l\'unico admin'); return }
    if (!confirm(`Eliminare ${c?.nome}?`)) return
    await getSupabase().from('admin_users').delete().eq('id', id)
    setConsulenti(consulenti.filter(x => x.id !== id))
  }

  const toggleAttivo = async (id: string) => {
    const c = consulenti.find(x => x.id === id)
    if (!c) return
    await getSupabase().from('admin_users').update({ attivo: !c.attivo }).eq('id', id)
    setConsulenti(consulenti.map(x => x.id === id ? { ...x, attivo: !x.attivo } : x))
  }

  const apriModifica = (c: Consulente) => {
    setForm({ nome: c.nome, email: c.email, password: '', ruolo: c.ruolo, telefono: c.telefono || '', permessi: c.permessi || {}, max_pratiche: c.max_pratiche || 0, turni: c.turni || [] })
    setEditId(c.id); setShowForm(true); setErrore(''); setTab('info')
  }

  const togglePermesso = (key: string) => setForm({ ...form, permessi: { ...form.permessi, [key]: !form.permessi[key] } })

  const aggiungiTurno = () => setForm({ ...form, turni: [...form.turni, { giorno: 'Lunedì', dalle: '09:00', alle: '18:00' }] })
  const rimuoviTurno = (i: number) => setForm({ ...form, turni: form.turni.filter((_, j) => j !== i) })
  const aggiornaTurno = (i: number, field: string, value: string) => {
    const t = [...form.turni]; t[i] = { ...t[i], [field]: value }; setForm({ ...form, turni: t })
  }

  return (
    <div className="min-h-screen bg-background-dark">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-[family-name:var(--font-serif)] text-3xl text-primary">Team e Consulenti</h1>
            <p className="text-text-light text-sm">{consulenti.length} utenti — {consulenti.filter(c => c.ruolo === 'admin').length} admin, {consulenti.filter(c => c.ruolo === 'manager').length} manager, {consulenti.filter(c => c.ruolo === 'consulente').length} consulenti</p>
          </div>
          <button onClick={() => { setForm({ nome: '', email: '', password: '', ruolo: 'consulente', telefono: '', permessi: {}, max_pratiche: 10, turni: [] }); setEditId(null); setShowForm(true); setErrore(''); setTab('info') }}
            className="btn-accent text-sm"><Plus size={16} className="mr-1" /> Nuovo</button>
        </div>

        {/* Form con tab */}
        {showForm && (
          <div className="card mb-6">
            <div className="flex justify-between mb-4">
              <h2 className="font-[family-name:var(--font-serif)] text-lg text-primary">{editId ? 'Modifica' : 'Nuovo'} utente</h2>
              <button onClick={() => setShowForm(false)}><X size={18} className="text-text-muted" /></button>
            </div>

            {/* Tab */}
            <div className="flex gap-1 mb-4 border-b border-border">
              {[{ id: 'info' as const, l: 'Informazioni' }, { id: 'permessi' as const, l: 'Permessi' }, { id: 'turni' as const, l: 'Turni / Disponibilità' }].map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`px-4 py-2 text-xs font-medium border-b-2 transition-colors ${tab === t.id ? 'border-secondary text-primary' : 'border-transparent text-text-muted'}`}>
                  {t.l}
                </button>
              ))}
            </div>

            {/* Tab Info */}
            {tab === 'info' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-xs font-medium text-text mb-1">Nome *</label>
                  <input type="text" className="input-field text-sm" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} /></div>
                <div><label className="block text-xs font-medium text-text mb-1">Email *</label>
                  <input type="email" className="input-field text-sm" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
                <div><label className="block text-xs font-medium text-text mb-1">{editId ? 'Nuova password' : 'Password *'}</label>
                  <input type="password" className="input-field text-sm" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></div>
                <div><label className="block text-xs font-medium text-text mb-1">Ruolo</label>
                  <select className="input-field text-sm" value={form.ruolo} onChange={e => setForm({ ...form, ruolo: e.target.value })}>
                    <option value="consulente">Consulente — solo proprie pratiche</option>
                    <option value="manager">Manager — tutto tranne sistema</option>
                    <option value="admin">Amministratore — accesso completo</option>
                  </select></div>
                <div><label className="block text-xs font-medium text-text mb-1">Telefono</label>
                  <input type="tel" className="input-field text-sm" value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} /></div>
                <div><label className="block text-xs font-medium text-text mb-1">Max pratiche contemporanee (0 = illimitato)</label>
                  <input type="number" min="0" className="input-field text-sm" value={form.max_pratiche} onChange={e => setForm({ ...form, max_pratiche: Number(e.target.value) })} /></div>
              </div>
            )}

            {/* Tab Permessi */}
            {tab === 'permessi' && (
              <div>
                <p className="text-text-muted text-xs mb-4">
                  {form.ruolo === 'admin' ? 'Gli amministratori hanno accesso completo a tutto.' :
                   form.ruolo === 'manager' ? 'I manager vedono tutto tranne Consulenti e Impostazioni. Puoi personalizzare sotto.' :
                   'I consulenti vedono solo le proprie pratiche. Abilita moduli aggiuntivi sotto.'}
                </p>
                {/* Sempre attivi */}
                <div className="space-y-2 mb-4">
                  <p className="text-xs font-medium text-text">Sempre attivi:</p>
                  {['Dashboard (proprie pratiche)', 'Richieste assegnate', 'Calendario proprio', 'Chat clienti'].map(m => (
                    <label key={m} className="flex items-center gap-2 text-sm text-text-light">
                      <input type="checkbox" checked disabled className="w-4 h-4 rounded opacity-50" /> {m}
                    </label>
                  ))}
                </div>
                {/* Personalizzabili */}
                {form.ruolo !== 'admin' && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-text">Moduli aggiuntivi:</p>
                    {MODULI.map(m => (
                      <label key={m.key} className="flex items-center gap-2 text-sm text-text cursor-pointer hover:bg-background rounded px-2 py-1 transition-colors">
                        <input type="checkbox" checked={form.ruolo === 'manager' || form.permessi[m.key] || false}
                          disabled={form.ruolo === 'manager'}
                          onChange={() => togglePermesso(m.key)} className="w-4 h-4 rounded" />
                        {m.label}
                        {form.ruolo === 'manager' && <span className="text-[10px] text-text-muted">(incluso nel ruolo)</span>}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab Turni */}
            {tab === 'turni' && (
              <div>
                <p className="text-text-muted text-xs mb-4">Imposta i giorni e gli orari di disponibilità del consulente.</p>
                <div className="space-y-2 mb-4">
                  {form.turni.map((t, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <select className="input-field text-xs py-1.5 w-28" value={t.giorno} onChange={e => aggiornaTurno(i, 'giorno', e.target.value)}>
                        {GIORNI.map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                      <input type="time" className="input-field text-xs py-1.5 w-24" value={t.dalle} onChange={e => aggiornaTurno(i, 'dalle', e.target.value)} />
                      <span className="text-text-muted text-xs">—</span>
                      <input type="time" className="input-field text-xs py-1.5 w-24" value={t.alle} onChange={e => aggiornaTurno(i, 'alle', e.target.value)} />
                      <button onClick={() => rimuoviTurno(i)} className="text-text-muted hover:text-error"><X size={14} /></button>
                    </div>
                  ))}
                </div>
                <button onClick={aggiungiTurno} className="text-secondary text-xs hover:underline flex items-center gap-1">
                  <Plus size={12} /> Aggiungi turno
                </button>
              </div>
            )}

            {errore && <p className="text-error text-sm mt-3 bg-error/10 rounded px-3 py-2">{errore}</p>}
            <div className="flex gap-2 mt-4">
              <button onClick={salva} className="btn-accent text-xs"><Save size={14} className="mr-1" /> Salva</button>
              <button onClick={() => setShowForm(false)} className="btn-secondary text-xs">Annulla</button>
            </div>
          </div>
        )}

        {/* Lista consulenti */}
        <div className="space-y-3">
          {consulenti.map(c => {
            const Icon = RUOLI_ICON[c.ruolo] || User
            const color = RUOLI_COLOR[c.ruolo] || RUOLI_COLOR.consulente
            const s = stats[c.id]
            return (
              <div key={c.id} className={`card ${!c.attivo ? 'opacity-50' : ''}`}>
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Info */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${color}`}>
                      <Icon size={18} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-primary">{c.nome}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${color}`}>{c.ruolo}</span>
                        {!c.attivo && <span className="text-[10px] text-error">disattivato</span>}
                      </div>
                      <p className="text-text-muted text-xs truncate">{c.email} {c.telefono ? `· ${c.telefono}` : ''}</p>
                    </div>
                  </div>

                  {/* Stats */}
                  {s && (
                    <div className="flex items-center gap-4 text-xs">
                      <div className="text-center">
                        <p className="font-bold text-primary">{s.attive}</p>
                        <p className="text-text-muted text-[9px]">attive</p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-accent">{s.completate}</p>
                        <p className="text-text-muted text-[9px]">completate</p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-secondary">&euro;{s.totale_fatturato.toLocaleString('it-IT')}</p>
                        <p className="text-text-muted text-[9px]">fatturato</p>
                      </div>
                    </div>
                  )}

                  {/* Turni indicatore */}
                  {c.turni && (c.turni as { giorno: string }[]).length > 0 && (
                    <div className="flex items-center gap-1">
                      <Clock size={12} className="text-text-muted" />
                      <span className="text-[10px] text-text-muted">{(c.turni as { giorno: string }[]).length} turni</span>
                    </div>
                  )}

                  {/* Max pratiche */}
                  {c.max_pratiche > 0 && (
                    <span className="text-[10px] text-text-muted bg-background px-2 py-1 rounded">max {c.max_pratiche}</span>
                  )}

                  {/* Azioni */}
                  <div className="flex items-center gap-1">
                    <button onClick={() => toggleAttivo(c.id)} className="p-2 text-text-muted hover:text-primary">
                      {c.attivo ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                    <button onClick={() => apriModifica(c)} className="p-2 text-text-muted hover:text-secondary"><Edit2 size={14} /></button>
                    <button onClick={() => elimina(c.id)} className="p-2 text-text-muted hover:text-error"><Trash2 size={14} /></button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
