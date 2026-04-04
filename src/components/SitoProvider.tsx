'use client'

import { useEffect } from 'react'
import { useSitoStore } from '@/store/sito'

export function SitoProvider({ children }: { children: React.ReactNode }) {
  const loadFromSupabase = useSitoStore((s) => s.loadFromSupabase)
  const loaded = useSitoStore((s) => s.loaded)

  useEffect(() => {
    loadFromSupabase()
  }, [loadFromSupabase])

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-text-muted text-sm">Caricamento...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
