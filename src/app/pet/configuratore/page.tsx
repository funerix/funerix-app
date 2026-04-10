import { Suspense } from 'react'
import { ConfiguratoreAnimale } from '@/components/configuratore/ConfiguratoreAnimale'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Configura Cremazione Animale — Funerix Pet',
  description: 'Configura il servizio di cremazione per il tuo animale domestico. Preventivo immediato.',
}

export default function PetConfiguratorePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><div className="w-8 h-8 border-3 border-secondary border-t-transparent rounded-full animate-spin" /></div>}>
      <ConfiguratoreAnimale />
    </Suspense>
  )
}
