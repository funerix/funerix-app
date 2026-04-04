'use client'

import { useSitoStore } from '@/store/sito'

export function LoadingGate({ children }: { children: React.ReactNode }) {
  const loaded = useSitoStore((s) => s.loaded)

  if (!loaded) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-text-muted text-sm">Caricamento...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
