import { Suspense } from 'react'
import { ConfiguratorePrevidenza } from '@/components/configuratore/ConfiguratorePrevidenza'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Configura Piano Previdenza — Funerix Previdenza',
  description: 'Configura il tuo piano previdenza funeraria. Scegli i servizi, la durata e calcola la rata mensile.',
}

export default function PrevidenzaConfiguratorePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><div className="w-8 h-8 border-3 border-secondary border-t-transparent rounded-full animate-spin" /></div>}>
      <ConfiguratorePrevidenza />
    </Suspense>
  )
}
