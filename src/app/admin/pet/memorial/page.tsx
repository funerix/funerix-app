'use client'

import { Heart, Plus, Trash2, Eye, EyeOff, ExternalLink } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getSupabase } from '@/lib/supabase-client'

export default function AdminPetMemorial() {
  const [memorials, setMemorials] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const sb = getSupabase()
    sb.from('pet_memorial').select('*').order('created_at', { ascending: false })
      .then(({ data }: { data: any }) => { if (data) setMemorials(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const togglePubblicato = async (id: string, val: boolean) => {
    const sb = getSupabase()
    await sb.from('pet_memorial').update({ pubblicato: val }).eq('id', id)
    setMemorials(prev => prev.map(m => m.id === id ? { ...m, pubblicato: val } : m))
  }

  const elimina = async (id: string) => {
    if (!confirm('Eliminare questo memorial?')) return
    const sb = getSupabase()
    await sb.from('pet_memorial').delete().eq('id', id)
    setMemorials(prev => prev.filter(m => m.id !== id))
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-[family-name:var(--font-serif)] text-2xl text-primary">Memorial Pet</h1>
          <p className="text-text-muted text-sm">Pagine memorial dedicate agli animali ({memorials.length})</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12"><div className="w-8 h-8 border-3 border-secondary border-t-transparent rounded-full animate-spin mx-auto" /></div>
      ) : memorials.length === 0 ? (
        <div className="card p-8 text-center">
          <Heart size={32} className="mx-auto mb-3 text-text-muted/30" />
          <p className="text-text-muted">Nessun memorial pet creato.</p>
          <p className="text-text-muted text-sm mt-1">I memorial vengono creati automaticamente quando un cliente completa un ordine di cremazione.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {memorials.map(m => (
            <div key={m.id} className="card flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                  <Heart size={16} className="text-secondary" />
                </div>
                <div>
                  <p className="font-medium text-primary">{m.animale_nome}</p>
                  <p className="text-text-muted text-xs">{m.specie} {m.razza ? `— ${m.razza}` : ''} {m.data_morte ? `— ${new Date(m.data_morte).toLocaleDateString('it-IT')}` : ''}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => togglePubblicato(m.id, !m.pubblicato)} className={`p-1.5 rounded ${m.pubblicato ? 'text-accent' : 'text-text-muted'}`}>
                  {m.pubblicato ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <a href={`/pet/memorial/${m.id}`} target="_blank" rel="noopener noreferrer" className="p-1.5 text-secondary hover:text-primary">
                  <ExternalLink size={16} />
                </a>
                <button onClick={() => elimina(m.id)} className="p-1.5 text-text-muted hover:text-error">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
