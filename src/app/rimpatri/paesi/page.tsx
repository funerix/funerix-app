import { Globe } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Paesi Serviti — Funerix Rimpatri',
  description: 'Rimpatrio salme da e verso qualsiasi paese del mondo. Requisiti, documenti e tempi per ogni destinazione.',
}

export default function PaesiPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Globe size={32} className="mx-auto mb-3 text-secondary-light" />
          <h1 className="font-[family-name:var(--font-serif)] text-3xl md:text-4xl text-white mb-3">Paesi Serviti</h1>
          <p className="text-white/80">Rimpatrio e espatrio salme in tutto il mondo.</p>
        </div>
      </section>
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-text-muted text-center">La pagina dettagliata per ogni paese sara disponibile a breve.</p>
        </div>
      </section>
    </div>
  )
}
