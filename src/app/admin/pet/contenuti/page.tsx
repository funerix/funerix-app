'use client'

import { Save } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getSupabase } from '@/lib/supabase-client'

const campiDefault = {
  hero_titolo: 'Cremazione Animali Domestici',
  hero_sottotitolo: 'Un ultimo saluto dignitoso per il vostro compagno di vita',
  servizi_titolo: 'I nostri servizi',
  come_funziona_titolo: 'Come funziona',
  cta_titolo: 'Configurate il servizio per il vostro compagno',
  cta_descrizione: 'Cremazione individuale con restituzione ceneri, urne commemorative e memorial digitale.',
}

export default function AdminPetContenuti() {
  const [form, setForm] = useState(campiDefault)
  const [salvato, setSalvato] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const sb = getSupabase()
    sb.from('pet_contenuti').select('*').eq('id', 1).single()
      .then(({ data }: { data: any }) => {
        if (data) setForm({ ...campiDefault, ...data })
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleSalva = async () => {
    const sb = getSupabase()
    await sb.from('pet_contenuti').upsert({ id: 1, ...form }, { onConflict: 'id' })
    setSalvato(true)
    setTimeout(() => setSalvato(false), 3000)
  }

  const set = (key: string, value: string) => setForm({ ...form, [key]: value })

  if (loading) return <div className="p-6 text-center"><div className="w-8 h-8 border-3 border-secondary border-t-transparent rounded-full animate-spin mx-auto" /></div>

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-[family-name:var(--font-serif)] text-2xl text-primary">Contenuti Pet</h1>
          <p className="text-text-muted text-sm">Testi delle pagine Funerix Pet</p>
        </div>
        <button onClick={handleSalva} className="btn-accent text-sm">
          <Save size={16} className="mr-2" /> {salvato ? 'Salvato!' : 'Salva'}
        </button>
      </div>

      <div className="space-y-6">
        <div className="card">
          <h2 className="font-medium text-primary mb-4">Hero</h2>
          <div className="space-y-4">
            <div><label className="block text-sm font-medium text-text mb-1">Titolo</label><input className="input-field" value={form.hero_titolo} onChange={e => set('hero_titolo', e.target.value)} /></div>
            <div><label className="block text-sm font-medium text-text mb-1">Sottotitolo</label><input className="input-field" value={form.hero_sottotitolo} onChange={e => set('hero_sottotitolo', e.target.value)} /></div>
          </div>
        </div>
        <div className="card">
          <h2 className="font-medium text-primary mb-4">Sezioni</h2>
          <div className="space-y-4">
            <div><label className="block text-sm font-medium text-text mb-1">Titolo servizi</label><input className="input-field" value={form.servizi_titolo} onChange={e => set('servizi_titolo', e.target.value)} /></div>
            <div><label className="block text-sm font-medium text-text mb-1">Titolo come funziona</label><input className="input-field" value={form.come_funziona_titolo} onChange={e => set('come_funziona_titolo', e.target.value)} /></div>
          </div>
        </div>
        <div className="card">
          <h2 className="font-medium text-primary mb-4">CTA</h2>
          <div className="space-y-4">
            <div><label className="block text-sm font-medium text-text mb-1">Titolo CTA</label><input className="input-field" value={form.cta_titolo} onChange={e => set('cta_titolo', e.target.value)} /></div>
            <div><label className="block text-sm font-medium text-text mb-1">Descrizione CTA</label><textarea rows={2} className="input-field" value={form.cta_descrizione} onChange={e => set('cta_descrizione', e.target.value)} /></div>
          </div>
        </div>
      </div>
    </div>
  )
}
