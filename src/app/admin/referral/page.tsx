'use client'

import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, Copy, Eye, EyeOff, X, Save, Share2, MessageCircle, Mail } from 'lucide-react'
import { getSupabase } from '@/lib/supabase-client'
import { useState, useEffect } from 'react'

interface Referral {
  id: string; codice: string; nome_referente: string; email_referente: string;
  telefono_referente: string; sconto_percentuale: number; utilizzi: number; attivo: boolean
}

export default function ReferralPage() {
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ nome_referente: '', email_referente: '', telefono_referente: '', sconto_percentuale: 5 })

  useEffect(() => {
    getSupabase().from('referral').select('*').order('created_at', { ascending: false })
      .then(({ data }: { data: unknown[] | null }) => setReferrals((data || []) as Referral[]))
  }, [])

  const crea = async () => {
    const codice = 'FNX-' + form.nome_referente.split(' ')[0].toUpperCase().slice(0, 4) + '-' + Math.random().toString(36).slice(2, 6).toUpperCase()
    const sb = getSupabase()
    const { data } = await sb.from('referral').insert({ ...form, codice, attivo: true, utilizzi: 0 }).select().single()
    if (data) setReferrals([data as unknown as Referral, ...referrals])
    setShowForm(false)
    setForm({ nome_referente: '', email_referente: '', telefono_referente: '', sconto_percentuale: 5 })
  }

  const elimina = async (id: string) => {
    if (!confirm('Eliminare?')) return
    await getSupabase().from('referral').delete().eq('id', id)
    setReferrals(referrals.filter(r => r.id !== id))
  }

  const toggleAttivo = async (id: string) => {
    const r = referrals.find(x => x.id === id)
    if (!r) return
    await getSupabase().from('referral').update({ attivo: !r.attivo }).eq('id', id)
    setReferrals(referrals.map(x => x.id === id ? { ...x, attivo: !x.attivo } : x))
  }

  const condividi = (r: Referral, via: 'whatsapp' | 'email' | 'copy') => {
    const link = `${window.location.origin}/configuratore?ref=${r.codice}`
    const msg = `Usa il codice ${r.codice} per ottenere uno sconto del ${r.sconto_percentuale}% su Funerix.\n\n${link}`
    if (via === 'whatsapp') window.open(`https://wa.me/${r.telefono_referente?.replace(/\s/g, '')}?text=${encodeURIComponent(msg)}`, '_blank')
    else if (via === 'email') window.open(`mailto:${r.email_referente}?subject=${encodeURIComponent('Il tuo codice Funerix')}&body=${encodeURIComponent(msg)}`, '_blank')
    else { navigator.clipboard.writeText(link).catch(() => {}); prompt('Link copiato:', link) }
  }

  return (
    <div className="min-h-screen bg-background-dark">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-text-muted hover:text-primary"><ArrowLeft size={20} /></Link>
            <div>
              <h1 className="font-[family-name:var(--font-serif)] text-3xl text-primary">Programma Referral</h1>
              <p className="text-text-light text-sm">Le famiglie che consigliano Funerix ottengono uno sconto</p>
            </div>
          </div>
          <button onClick={() => setShowForm(true)} className="btn-accent text-sm"><Plus size={16} className="mr-1" /> Nuovo codice</button>
        </div>

        {showForm && (
          <div className="card mb-6">
            <div className="flex justify-between mb-4">
              <h2 className="font-[family-name:var(--font-serif)] text-lg text-primary">Nuovo codice referral</h2>
              <button onClick={() => setShowForm(false)}><X size={18} className="text-text-muted" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-text mb-1">Nome referente *</label>
                <input type="text" className="input-field text-sm" placeholder="Famiglia Rossi"
                  value={form.nome_referente} onChange={e => setForm({ ...form, nome_referente: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium text-text mb-1">Telefono</label>
                <input type="tel" className="input-field text-sm" placeholder="333..."
                  value={form.telefono_referente} onChange={e => setForm({ ...form, telefono_referente: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium text-text mb-1">Email</label>
                <input type="email" className="input-field text-sm"
                  value={form.email_referente} onChange={e => setForm({ ...form, email_referente: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium text-text mb-1">Sconto %</label>
                <input type="number" className="input-field text-sm" min="1" max="20"
                  value={form.sconto_percentuale} onChange={e => setForm({ ...form, sconto_percentuale: Number(e.target.value) })} />
              </div>
            </div>
            <button onClick={crea} className="btn-accent text-xs mt-3"><Save size={14} className="mr-1" /> Crea codice</button>
          </div>
        )}

        <div className="card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-3 text-text-muted font-medium">Codice</th>
                <th className="text-left py-3 px-3 text-text-muted font-medium">Referente</th>
                <th className="text-center py-3 px-3 text-text-muted font-medium">Sconto</th>
                <th className="text-center py-3 px-3 text-text-muted font-medium">Utilizzi</th>
                <th className="text-center py-3 px-3 text-text-muted font-medium">Stato</th>
                <th className="text-right py-3 px-3 text-text-muted font-medium">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {referrals.map(r => (
                <tr key={r.id} className="border-b border-border/50 hover:bg-background">
                  <td className="py-3 px-3 font-mono text-xs font-bold text-secondary">{r.codice}</td>
                  <td className="py-3 px-3">
                    <p className="font-medium text-primary">{r.nome_referente}</p>
                    <p className="text-[10px] text-text-muted">{r.telefono_referente}</p>
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-accent">{r.sconto_percentuale}%</td>
                  <td className="py-3 px-3 text-center text-primary font-medium">{r.utilizzi}</td>
                  <td className="py-3 px-3 text-center">
                    <button onClick={() => toggleAttivo(r.id)}>
                      {r.attivo ? <span className="text-xs text-accent flex items-center justify-center gap-1"><Eye size={12} /> Attivo</span>
                        : <span className="text-xs text-text-muted flex items-center justify-center gap-1"><EyeOff size={12} /> Off</span>}
                    </button>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => condividi(r, 'whatsapp')} className="p-1.5 text-[#25D366] hover:bg-[#25D366]/10 rounded" title="WhatsApp"><MessageCircle size={13} /></button>
                      <button onClick={() => condividi(r, 'email')} className="p-1.5 text-text-muted hover:text-secondary rounded" title="Email"><Mail size={13} /></button>
                      <button onClick={() => condividi(r, 'copy')} className="p-1.5 text-text-muted hover:text-secondary rounded" title="Copia"><Copy size={13} /></button>
                      <button onClick={() => elimina(r.id)} className="p-1.5 text-text-muted hover:text-error rounded"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {referrals.length === 0 && <tr><td colSpan={6} className="py-8 text-center text-text-muted">Nessun codice referral</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
