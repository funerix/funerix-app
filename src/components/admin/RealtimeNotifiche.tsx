'use client'

import { useEffect, useRef } from 'react'
import { getSupabase } from '@/lib/supabase-client'
import { useSitoStore } from '@/store/sito'

export function RealtimeNotifiche() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const loadFromSupabase = useSitoStore((s) => s.loadFromSupabase)

  useEffect(() => {
    audioRef.current = new Audio('/sounds/notifica.wav')
    audioRef.current.volume = 0.5

    const sb = getSupabase()

    // Ascolta nuove richieste in tempo reale
    const channel = sb
      .channel('richieste-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'richieste' },
        (payload: { new: Record<string, string> }) => {
          // Suona notifica
          audioRef.current?.play().catch(() => {})

          // Mostra notifica browser
          if (Notification.permission === 'granted') {
            const r = payload.new as Record<string, string>
            new Notification('Nuova richiesta preventivo', {
              body: `${r.nome} — €${Number(r.totale).toLocaleString('it-IT')}\n${r.modalita} — ${r.orario}`,
              icon: '/images/logo.png',
            })
          }

          // Forza ricarica dati
          useSitoStore.setState({ loaded: false })
          loadFromSupabase()
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messaggi_memorial' },
        () => {
          useSitoStore.setState({ loaded: false })
          loadFromSupabase()
        }
      )
      .subscribe()

    // Chiedi permesso notifiche
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      Notification.requestPermission()
    }

    return () => {
      sb.removeChannel(channel)
    }
  }, [loadFromSupabase])

  return null
}
