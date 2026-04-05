'use client'

import { Plus, Edit2, Trash2, X, Save, Star, ChevronUp, ChevronDown, GripVertical } from 'lucide-react'
import { getSupabase } from '@/lib/supabase-client'
import { useState, useEffect } from 'react'

interface Servizio { id: string; titolo: string; descrizione: string; href: string; immagine: string; icona: string; ordine: number; attivo: boolean }
interface Faq { id: string; domanda: string; risposta: string; ordine: number; attivo: boolean }
interface Testimonianza { id: string; nome: string; citta: string; testo: string; stelle: number; attivo: boolean }

type Tab = 'servizi' | 'faq' | 'testimonianze'

export default function HomepageAdminPage() {
  const [tab, setTab] = useState<Tab>('servizi')
  const [servizi, setServizi] = useState<Servizio[]>([])
  const [faqs, setFaqs] = useState<Faq[]>([])
  const [testimonianze, setTestimonianze] = useState<Testimonianza[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [salvato, setSalvato] = useState(false)

  // Form states
  const [formServizio, setFormServizio] = useState({ titolo: '', descrizione: '', href: '', immagine: '', icona: 'Cross', ordine: 0 })
  const [formFaq, setFormFaq] = useState({ domanda: '', risposta: '', ordine: 0 })
  const [formTest, setFormTest] = useState({ nome: '', citta: '', testo: '', stelle: 5 })

  useEffect(() => {
    const sb = getSupabase()
    sb.from('servizi_homepage').select('*').order('ordine').then(({ data }: { data: unknown[] | null }) => setServizi((data || []) as Servizio[]))
    sb.from('faq').select('*').order('ordine').then(({ data }: { data: unknown[] | null }) => setFaqs((data || []) as Faq[]))
    sb.from('testimonianze').select('*').order('created_at').then(({ data }: { data: unknown[] | null }) => setTestimonianze((data || []) as Testimonianza[]))
  }, [])

  const flash = () => { setSalvato(true); setTimeout(() => setSalvato(false), 2000) }

  // === SERVIZI CRUD ===
  const salvaServizio = async () => {
    const sb = getSupabase()
    if (editId) {
      await sb.from('servizi_homepage').update({ ...formServizio, attivo: true }).eq('id', editId)
      setServizi(servizi.map(s => s.id === editId ? { ...s, ...formServizio } : s))
    } else {
      const { data } = await sb.from('servizi_homepage').insert({ ...formServizio, attivo: true }).select().single()
      if (data) setServizi([...servizi, data as unknown as Servizio])
    }
    setShowForm(false); setEditId(null); flash()
  }

  // === FAQ CRUD ===
  const salvaFaq = async () => {
    const sb = getSupabase()
    if (editId) {
      await sb.from('faq').update({ ...formFaq, attivo: true }).eq('id', editId)
      setFaqs(faqs.map(f => f.id === editId ? { ...f, ...formFaq } : f))
    } else {
      const { data } = await sb.from('faq').insert({ ...formFaq, attivo: true }).select().single()
      if (data) setFaqs([...faqs, data as unknown as Faq])
    }
    setShowForm(false); setEditId(null); flash()
  }

  // === TESTIMONIANZE CRUD ===
  const salvaTest = async () => {
    const sb = getSupabase()
    if (editId) {
      await sb.from('testimonianze').update({ ...formTest, attivo: true }).eq('id', editId)
      setTestimonianze(testimonianze.map(t => t.id === editId ? { ...t, ...formTest } : t))
    } else {
      const { data } = await sb.from('testimonianze').insert({ ...formTest, attivo: true }).select().single()
      if (data) setTestimonianze([...testimonianze, data as unknown as Testimonianza])
    }
    setShowForm(false); setEditId(null); flash()
  }

  const elimina = async (tabella: string, id: string) => {
    if (!confirm('Eliminare?')) return
    await getSupabase().from(tabella).delete().eq('id', id)
    if (tabella === 'servizi_homepage') setServizi(servizi.filter(s => s.id !== id))
    if (tabella === 'faq') setFaqs(faqs.filter(f => f.id !== id))
    if (tabella === 'testimonianze') setTestimonianze(testimonianze.filter(t => t.id !== id))
  }

  const toggleAttivo = async (tabella: string, id: string, attuale: boolean) => {
    await getSupabase().from(tabella).update({ attivo: !attuale }).eq('id', id)
    if (tabella === 'servizi_homepage') setServizi(servizi.map(s => s.id === id ? { ...s, attivo: !attuale } : s))
    if (tabella === 'faq') setFaqs(faqs.map(f => f.id === id ? { ...f, attivo: !attuale } : f))
    if (tabella === 'testimonianze') setTestimonianze(testimonianze.map(t => t.id === id ? { ...t, attivo: !attuale } : t))
  }

  const spostaOrdine = async (tabella: string, id: string, dir: 'su' | 'giu') => {
    const items = tabella === 'servizi_homepage' ? servizi : faqs
    const idx = items.findIndex(i => i.id === id)
    if ((dir === 'su' && idx === 0) || (dir === 'giu' && idx === items.length - 1)) return
    const swapIdx = dir === 'su' ? idx - 1 : idx + 1
    const sb = getSupabase()
    await sb.from(tabella).update({ ordine: items[swapIdx].ordine }).eq('id', items[idx].id)
    await sb.from(tabella).update({ ordine: items[idx].ordine }).eq('id', items[swapIdx].id)
    const newItems = [...items]
    const tmp = newItems[idx].ordine; newItems[idx].ordine = newItems[swapIdx].ordine; newItems[swapIdx].ordine = tmp
    newItems.sort((a, b) => a.ordine - b.ordine)
    if (tabella === 'servizi_homepage') setServizi(newItems as Servizio[])
    else setFaqs(newItems as Faq[])
  }

  return (
    <div className="min-h-screen bg-background-dark">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-[family-name:var(--font-serif)] text-3xl text-primary">Contenuti Homepage</h1>
            <p className="text-text-light text-sm">Gestisci servizi, FAQ e testimonianze visibili nella homepage</p>
          </div>
          {salvato && <span className="text-accent text-sm font-medium">Salvato!</span>}
        </div>

        {/* Tab */}
        <div className="flex gap-1 mb-6 border-b border-border">
          {([
            { id: 'servizi' as Tab, l: `Servizi (${servizi.length})` },
            { id: 'faq' as Tab, l: `FAQ (${faqs.length})` },
            { id: 'testimonianze' as Tab, l: `Testimonianze (${testimonianze.length})` },
          ]).map(t => (
            <button key={t.id} onClick={() => { setTab(t.id); setShowForm(false) }}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${tab === t.id ? 'border-secondary text-primary' : 'border-transparent text-text-muted'}`}>
              {t.l}
            </button>
          ))}
        </div>

        {/* === SERVIZI === */}
        {tab === 'servizi' && (
          <div>
            <div className="flex justify-end mb-4">
              <button onClick={() => { setFormServizio({ titolo: '', descrizione: '', href: '', immagine: '', icona: 'Cross', ordine: servizi.length + 1 }); setEditId(null); setShowForm(true) }}
                className="btn-accent text-xs"><Plus size={14} className="mr-1" /> Nuovo servizio</button>
            </div>
            {showForm && (
              <div className="card mb-4">
                <div className="flex justify-between mb-3"><h3 className="font-medium text-primary">{editId ? 'Modifica' : 'Nuovo'} servizio</h3><button onClick={() => setShowForm(false)}><X size={16} className="text-text-muted" /></button></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div><label className="text-xs font-medium text-text">Titolo *</label><input className="input-field text-sm" value={formServizio.titolo} onChange={e => setFormServizio({ ...formServizio, titolo: e.target.value })} /></div>
                  <div><label className="text-xs font-medium text-text">Link (href) *</label><input className="input-field text-sm" placeholder="/configuratore" value={formServizio.href} onChange={e => setFormServizio({ ...formServizio, href: e.target.value })} /></div>
                  <div className="md:col-span-2"><label className="text-xs font-medium text-text">Descrizione</label><input className="input-field text-sm" value={formServizio.descrizione} onChange={e => setFormServizio({ ...formServizio, descrizione: e.target.value })} /></div>
                  <div><label className="text-xs font-medium text-text">Immagine URL</label><input className="input-field text-sm" placeholder="/images/..." value={formServizio.immagine} onChange={e => setFormServizio({ ...formServizio, immagine: e.target.value })} /></div>
                  <div><label className="text-xs font-medium text-text">Icona</label>
                    <select className="input-field text-sm" value={formServizio.icona} onChange={e => setFormServizio({ ...formServizio, icona: e.target.value })}>
                      {['Cross','Plane','PawPrint','Shovel','ShoppingBag','Euro','Heart','Globe','FileText'].map(i => <option key={i} value={i}>{i}</option>)}
                    </select></div>
                </div>
                <button onClick={salvaServizio} className="btn-accent text-xs mt-3"><Save size={14} className="mr-1" /> Salva</button>
              </div>
            )}
            <div className="space-y-2">
              {servizi.sort((a, b) => a.ordine - b.ordine).map(s => (
                <div key={s.id} className={`card py-3 flex items-center gap-3 ${!s.attivo ? 'opacity-40' : ''}`}>
                  <div className="flex flex-col gap-0.5">
                    <button onClick={() => spostaOrdine('servizi_homepage', s.id, 'su')} className="text-text-muted hover:text-primary"><ChevronUp size={12} /></button>
                    <button onClick={() => spostaOrdine('servizi_homepage', s.id, 'giu')} className="text-text-muted hover:text-primary"><ChevronDown size={12} /></button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-primary text-sm">{s.titolo}</p>
                    <p className="text-text-muted text-xs truncate">{s.descrizione} · {s.href}</p>
                  </div>
                  <button onClick={() => toggleAttivo('servizi_homepage', s.id, s.attivo)} className="text-xs text-text-muted">{s.attivo ? '👁' : '🚫'}</button>
                  <button onClick={() => { setFormServizio({ titolo: s.titolo, descrizione: s.descrizione, href: s.href, immagine: s.immagine, icona: s.icona, ordine: s.ordine }); setEditId(s.id); setShowForm(true) }} className="p-1 text-text-muted hover:text-secondary"><Edit2 size={14} /></button>
                  <button onClick={() => elimina('servizi_homepage', s.id)} className="p-1 text-text-muted hover:text-error"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* === FAQ === */}
        {tab === 'faq' && (
          <div>
            <div className="flex justify-end mb-4">
              <button onClick={() => { setFormFaq({ domanda: '', risposta: '', ordine: faqs.length + 1 }); setEditId(null); setShowForm(true) }}
                className="btn-accent text-xs"><Plus size={14} className="mr-1" /> Nuova FAQ</button>
            </div>
            {showForm && (
              <div className="card mb-4">
                <div className="flex justify-between mb-3"><h3 className="font-medium text-primary">{editId ? 'Modifica' : 'Nuova'} FAQ</h3><button onClick={() => setShowForm(false)}><X size={16} className="text-text-muted" /></button></div>
                <div className="space-y-3">
                  <div><label className="text-xs font-medium text-text">Domanda *</label><input className="input-field text-sm" value={formFaq.domanda} onChange={e => setFormFaq({ ...formFaq, domanda: e.target.value })} /></div>
                  <div><label className="text-xs font-medium text-text">Risposta *</label><textarea rows={3} className="input-field text-sm" value={formFaq.risposta} onChange={e => setFormFaq({ ...formFaq, risposta: e.target.value })} /></div>
                </div>
                <button onClick={salvaFaq} className="btn-accent text-xs mt-3"><Save size={14} className="mr-1" /> Salva</button>
              </div>
            )}
            <div className="space-y-2">
              {faqs.sort((a, b) => a.ordine - b.ordine).map(f => (
                <div key={f.id} className={`card py-3 flex items-center gap-3 ${!f.attivo ? 'opacity-40' : ''}`}>
                  <div className="flex flex-col gap-0.5">
                    <button onClick={() => spostaOrdine('faq', f.id, 'su')} className="text-text-muted hover:text-primary"><ChevronUp size={12} /></button>
                    <button onClick={() => spostaOrdine('faq', f.id, 'giu')} className="text-text-muted hover:text-primary"><ChevronDown size={12} /></button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-primary text-sm">{f.domanda}</p>
                    <p className="text-text-muted text-xs truncate">{f.risposta}</p>
                  </div>
                  <button onClick={() => toggleAttivo('faq', f.id, f.attivo)} className="text-xs text-text-muted">{f.attivo ? '👁' : '🚫'}</button>
                  <button onClick={() => { setFormFaq({ domanda: f.domanda, risposta: f.risposta, ordine: f.ordine }); setEditId(f.id); setShowForm(true) }} className="p-1 text-text-muted hover:text-secondary"><Edit2 size={14} /></button>
                  <button onClick={() => elimina('faq', f.id)} className="p-1 text-text-muted hover:text-error"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* === TESTIMONIANZE === */}
        {tab === 'testimonianze' && (
          <div>
            <div className="flex justify-end mb-4">
              <button onClick={() => { setFormTest({ nome: '', citta: '', testo: '', stelle: 5 }); setEditId(null); setShowForm(true) }}
                className="btn-accent text-xs"><Plus size={14} className="mr-1" /> Nuova testimonianza</button>
            </div>
            {showForm && (
              <div className="card mb-4">
                <div className="flex justify-between mb-3"><h3 className="font-medium text-primary">{editId ? 'Modifica' : 'Nuova'} testimonianza</h3><button onClick={() => setShowForm(false)}><X size={16} className="text-text-muted" /></button></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div><label className="text-xs font-medium text-text">Nome famiglia *</label><input className="input-field text-sm" placeholder="Famiglia Rossi" value={formTest.nome} onChange={e => setFormTest({ ...formTest, nome: e.target.value })} /></div>
                  <div><label className="text-xs font-medium text-text">Città</label><input className="input-field text-sm" placeholder="Napoli" value={formTest.citta} onChange={e => setFormTest({ ...formTest, citta: e.target.value })} /></div>
                  <div className="md:col-span-2"><label className="text-xs font-medium text-text">Testo recensione *</label><textarea rows={3} className="input-field text-sm" value={formTest.testo} onChange={e => setFormTest({ ...formTest, testo: e.target.value })} /></div>
                  <div><label className="text-xs font-medium text-text">Stelle</label>
                    <div className="flex gap-1 mt-1">{[1,2,3,4,5].map(s => (
                      <button key={s} onClick={() => setFormTest({ ...formTest, stelle: s })} className="p-1">
                        <Star size={18} className={s <= formTest.stelle ? 'text-secondary fill-secondary' : 'text-border'} />
                      </button>
                    ))}</div></div>
                </div>
                <button onClick={salvaTest} className="btn-accent text-xs mt-3"><Save size={14} className="mr-1" /> Salva</button>
              </div>
            )}
            <div className="space-y-2">
              {testimonianze.map(t => (
                <div key={t.id} className={`card py-3 ${!t.attivo ? 'opacity-40' : ''}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-primary text-sm">{t.nome}</span>
                        <span className="text-text-muted text-xs">{t.citta}</span>
                        <div className="flex gap-0.5">{Array.from({ length: t.stelle }).map((_, i) => <Star key={i} size={10} className="text-secondary fill-secondary" />)}</div>
                      </div>
                      <p className="text-text-light text-xs line-clamp-2">{t.testo}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => toggleAttivo('testimonianze', t.id, t.attivo)} className="text-xs text-text-muted">{t.attivo ? '👁' : '🚫'}</button>
                      <button onClick={() => { setFormTest({ nome: t.nome, citta: t.citta, testo: t.testo, stelle: t.stelle }); setEditId(t.id); setShowForm(true) }} className="p-1 text-text-muted hover:text-secondary"><Edit2 size={14} /></button>
                      <button onClick={() => elimina('testimonianze', t.id)} className="p-1 text-text-muted hover:text-error"><Trash2 size={14} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
