import { Suspense } from 'react'
import { ConfiguratoreRimpatrio } from '@/components/configuratore/ConfiguratoreRimpatrio'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Configura Rimpatrio Salma — Funerix Rimpatri',
  description: 'Configura il rimpatrio o espatrio salma. Preventivo immediato per trasporto internazionale.',
}

export default function RimpatriConfiguratorePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><div className="w-8 h-8 border-3 border-secondary border-t-transparent rounded-full animate-spin" /></div>}>
      <ConfiguratoreRimpatrio />
    </Suspense>
  )
}
