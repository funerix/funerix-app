'use client'

import { useEffect, useState, use } from 'react'
import { getSupabase } from '@/lib/supabase-client'
import { corniciManifesto, fontManifesto } from '@/lib/cornici-manifesto'

export default function ManifestoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [dati, setDati] = useState<Record<string, string> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const sb = getSupabase()
    sb.from('clienti').select('dati_defunto').eq('id', id).single()
      .then(({ data }: { data: Record<string, unknown> | null }) => {
        if (data?.dati_defunto) setDati(data.dati_defunto as Record<string, string>)
        setLoading(false)
      })
  }, [id])

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-3 border-secondary border-t-transparent rounded-full animate-spin" /></div>
  if (!dati) return <div className="min-h-screen flex items-center justify-center text-text-muted">Manifesto non trovato</div>

  const cornice = corniciManifesto.find(c => c.id === (dati.manifesto_cornice || '01')) || corniciManifesto[0]
  const font = fontManifesto.find(f => f.id === (dati.manifesto_font || 'serif')) || fontManifesto[0]
  const sizeMap: Record<string, string> = { small: '1rem', normal: '1.25rem', large: '1.5rem' }
  const nameSize: Record<string, string> = { small: '1.8rem', normal: '2.2rem', large: '2.8rem' }
  const sz = dati.manifesto_size || 'normal'

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 print:p-0 print:bg-white">
      <div className="w-full max-w-2xl relative" style={{ aspectRatio: '10/7' }}>
        <img src={cornice.img} alt="" className="absolute inset-0 w-full h-full" />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-16 md:p-20 text-center"
          style={{ fontFamily: font.family }}>
          <p style={{ fontSize: '1.8rem', color: '#2C3E50' }}>&#x271D;</p>
          <p style={{ fontSize: nameSize[sz], fontWeight: 700, color: '#2C3E50', lineHeight: 1.2, marginTop: 8 }}>
            {dati.titolo && <span>{dati.titolo} </span>}
            {dati.nome_defunto || '—'}
          </p>
          {dati.soprannome && (
            <p style={{ fontSize: sizeMap[sz], color: '#8B7355', fontStyle: 'italic', marginTop: 4 }}>
              detto &ldquo;{dati.soprannome}&rdquo;
            </p>
          )}
          {dati.eta && <p style={{ fontSize: '0.9rem', color: '#9CA3AF', marginTop: 4 }}>di anni {dati.eta}</p>}
          {(dati.data_nascita || dati.data_decesso) && (
            <p style={{ fontSize: '0.8rem', color: '#9CA3AF', marginTop: 2 }}>
              {dati.data_nascita && new Date(dati.data_nascita).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}
              {dati.data_nascita && dati.data_decesso && ' — '}
              {dati.data_decesso && new Date(dati.data_decesso).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          )}
          <div style={{ width: 50, height: 1, background: '#8B7355', margin: '12px 0' }} />
          {dati.manifesto_testo && (
            <p style={{ fontSize: sizeMap[sz], color: '#333', lineHeight: 1.6 }}>{dati.manifesto_testo}</p>
          )}
          {dati.manifesto_familiari && (
            <p style={{ fontSize: sizeMap[sz], color: '#6B7280', fontStyle: 'italic', marginTop: 8, lineHeight: 1.5 }}>
              {dati.manifesto_familiari}
            </p>
          )}
          {dati.manifesto_cerimonia && (
            <p style={{ fontSize: sizeMap[sz], color: '#2C3E50', fontWeight: 500, marginTop: 12, paddingTop: 8, borderTop: '1px solid #E5E1DB' }}>
              {dati.manifesto_cerimonia}
            </p>
          )}
          {/* Agenzia in basso a destra */}
          <p style={{ position: 'absolute', bottom: 16, right: 24, fontSize: '0.65rem', color: '#9CA3AF' }}>
            {dati.agenzia_nome || 'Funerix'}
          </p>
        </div>
      </div>

      <div className="fixed bottom-6 right-6 print:hidden flex gap-2">
        <button onClick={() => window.print()} className="btn-primary text-sm shadow-lg">
          Stampa
        </button>
      </div>
    </div>
  )
}
