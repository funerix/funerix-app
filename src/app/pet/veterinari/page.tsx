import { MapPin } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Veterinari Partner — Funerix Pet',
  description: 'Rete di veterinari convenzionati Funerix per la cremazione animali. Trova il piu vicino a te.',
}

export default function VeterinariPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <MapPin size={32} className="mx-auto mb-3 text-secondary-light" />
          <h1 className="font-[family-name:var(--font-serif)] text-3xl md:text-4xl text-white mb-3">Veterinari Partner</h1>
          <p className="text-white/80">Trova il veterinario convenzionato Funerix piu vicino a te.</p>
        </div>
      </section>
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-text-muted text-center">La rete dei veterinari partner sara disponibile a breve. Contattateci per informazioni.</p>
        </div>
      </section>
    </div>
  )
}
