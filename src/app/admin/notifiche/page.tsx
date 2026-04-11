'use client'

import { Bell, Info, Mail, MessageSquare, Smartphone } from 'lucide-react'
import { getSupabase } from '@/lib/supabase-client'
import { useState, useEffect } from 'react'

interface NotificaTemplate {
  id?: string
  verticale: string
  evento: string
  nome_display: string
  canale: 'email' | 'whatsapp' | 'sms'
  attivo: boolean
}

const eventiDefault: Omit<NotificaTemplate, 'id'>[] = [
  // Funebre
  { verticale: 'funebre', evento: 'nuova_richiesta', nome_display: 'Nuova richiesta funebre', canale: 'email', attivo: true },
  { verticale: 'funebre', evento: 'stato_cambiato', nome_display: 'Stato richiesta cambiato', canale: 'email', attivo: true },
  { verticale: 'funebre', evento: 'preventivo_pronto', nome_display: 'Preventivo pronto', canale: 'whatsapp', attivo: true },
  // Pet
  { verticale: 'pet', evento: 'nuovo_ordine', nome_display: 'Nuovo ordine Pet', canale: 'email', attivo: true },
  { verticale: 'pet', evento: 'ceneri_pronte', nome_display: 'Ceneri pronte per ritiro', canale: 'whatsapp', attivo: true },
  { verticale: 'pet', evento: 'consegnato', nome_display: 'Ordine consegnato', canale: 'sms', attivo: false },
  // Previdenza
  { verticale: 'previdenza', evento: 'piano_attivato', nome_display: 'Piano attivato', canale: 'email', attivo: true },
  { verticale: 'previdenza', evento: 'rata_scadenza', nome_display: 'Rata in scadenza', canale: 'whatsapp', attivo: true },
  { verticale: 'previdenza', evento: 'rata_pagata', nome_display: 'Rata pagata', canale: 'email', attivo: false },
  // Rimpatri
  { verticale: 'rimpatri', evento: 'nuova_pratica', nome_display: 'Nuova pratica rimpatrio', canale: 'email', attivo: true },
  { verticale: 'rimpatri', evento: 'documenti_completati', nome_display: 'Documenti completati', canale: 'email', attivo: true },
  { verticale: 'rimpatri', evento: 'in_transito', nome_display: 'Salma in transito', canale: 'whatsapp', attivo: true },
  { verticale: 'rimpatri', evento: 'arrivata', nome_display: 'Salma arrivata a destinazione', canale: 'whatsapp', attivo: true },
]

const verticali = [
  { key: 'funebre', label: 'Funebre', color: 'bg-primary/10 text-primary' },
  { key: 'pet', label: 'Pet', color: 'bg-amber-100 text-amber-800' },
  { key: 'previdenza', label: 'Previdenza', color: 'bg-blue-100 text-blue-800' },
  { key: 'rimpatri', label: 'Rimpatri', color: 'bg-purple-100 text-purple-800' },
]

const canaleIcona = {
  email: <Mail size={14} />,
  whatsapp: <MessageSquare size={14} />,
  sms: <Smartphone size={14} />,
}

const canaleLabel: Record<string, string> = { email: 'Email', whatsapp: 'WhatsApp', sms: 'SMS' }

export default function AdminNotifiche() {
  const [notifiche, setNotifiche] = useState<NotificaTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)

  useEffect(() => {
    const sb = getSupabase()
    sb.from('notifiche_template').select('*').order('verticale')
      .then(({ data, error }: { data: unknown[] | null; error: any }) => {
        if (data && data.length > 0) {
          setNotifiche(data as NotificaTemplate[])
        } else {
          // Use defaults if table empty or doesn't exist
          setNotifiche(eventiDefault.map((e, i) => ({ ...e, id: `default-${i}` })))
        }
        setLoading(false)
      })
      .catch(() => {
        setNotifiche(eventiDefault.map((e, i) => ({ ...e, id: `default-${i}` })))
        setLoading(false)
      })
  }, [])

  const toggleAttivo = async (idx: number) => {
    const n = notifiche[idx]
    const updated = { ...n, attivo: !n.attivo }

    // Update local state immediately
    const nuove = [...notifiche]
    nuove[idx] = updated
    setNotifiche(nuove)

    // Try to persist
    const sb = getSupabase()
    setSaving(n.evento)
    if (n.id && !n.id.startsWith('default-')) {
      await sb.from('notifiche_template').update({ attivo: updated.attivo }).eq('id', n.id)
    } else {
      // Insert new row
      const { data } = await sb.from('notifiche_template')
        .upsert({
          verticale: n.verticale,
          evento: n.evento,
          nome_display: n.nome_display,
          canale: n.canale,
          attivo: updated.attivo,
        }, { onConflict: 'evento' })
        .select()
        .single()
      if (data) {
        nuove[idx] = data as NotificaTemplate
        setNotifiche([...nuove])
      }
    }
    setSaving(null)
  }

  const cambiaCanale = async (idx: number, canale: 'email' | 'whatsapp' | 'sms') => {
    const n = notifiche[idx]
    const updated = { ...n, canale }

    const nuove = [...notifiche]
    nuove[idx] = updated
    setNotifiche(nuove)

    const sb = getSupabase()
    if (n.id && !n.id.startsWith('default-')) {
      await sb.from('notifiche_template').update({ canale }).eq('id', n.id)
    } else {
      const { data } = await sb.from('notifiche_template')
        .upsert({
          verticale: n.verticale,
          evento: n.evento,
          nome_display: n.nome_display,
          canale,
          attivo: n.attivo,
        }, { onConflict: 'evento' })
        .select()
        .single()
      if (data) {
        nuove[idx] = data as NotificaTemplate
        setNotifiche([...nuove])
      }
    }
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-[family-name:var(--font-serif)] text-xl md:text-2xl text-primary">Notifiche Template</h1>
          <p className="text-text-muted text-sm">Configurazione template email, SMS e WhatsApp</p>
        </div>
      </div>

      {/* Info banner */}
      <div className="card p-4 mb-6 bg-blue-50 border-blue-200 flex items-start gap-3">
        <Info size={18} className="text-blue-600 shrink-0 mt-0.5" />
        <p className="text-sm text-blue-800">
          Configurate quali notifiche inviare per ogni evento. Attivate o disattivate ciascuna notifica e scegliete il canale preferito.
        </p>
      </div>

      {loading ? (
        <div className="card p-8 text-center">
          <div className="w-8 h-8 border-3 border-secondary border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : (
        <div className="space-y-6">
          {verticali.map(v => {
            const eventi = notifiche
              .map((n, idx) => ({ ...n, _idx: idx }))
              .filter(n => n.verticale === v.key)

            return (
              <div key={v.key} className="card">
                <div className="flex items-center gap-2 mb-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${v.color}`}>{v.label}</span>
                  <span className="text-text-muted text-xs">{eventi.filter(e => e.attivo).length}/{eventi.length} attive</span>
                </div>

                <div className="divide-y divide-border/50">
                  {eventi.map(e => (
                    <div key={e.evento} className="flex items-center justify-between py-3 gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text">{e.nome_display}</p>
                        <p className="text-xs text-text-muted">{e.evento}</p>
                      </div>

                      {/* Canale selector */}
                      <div className="flex items-center gap-1">
                        {(['email', 'whatsapp', 'sms'] as const).map(ch => (
                          <button
                            key={ch}
                            onClick={() => cambiaCanale(e._idx, ch)}
                            className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                              e.canale === ch
                                ? 'bg-primary/10 text-primary font-medium'
                                : 'text-text-muted hover:bg-background'
                            }`}
                            title={canaleLabel[ch]}
                          >
                            {canaleIcona[ch]}
                            <span className="hidden md:inline">{canaleLabel[ch]}</span>
                          </button>
                        ))}
                      </div>

                      {/* Toggle attivo */}
                      <button
                        onClick={() => toggleAttivo(e._idx)}
                        className={`relative w-10 h-5 rounded-full transition-colors ${e.attivo ? 'bg-green-500' : 'bg-gray-300'}`}
                      >
                        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${e.attivo ? 'translate-x-5' : 'translate-x-0.5'}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
