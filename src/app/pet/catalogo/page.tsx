import Image from 'next/image'
import { PawPrint } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Catalogo Urne Pet — Funerix Pet',
  description: 'Urne commemorative per animali domestici. Ceramica, legno, marmo e materiali biodegradabili.',
}

export default function PetCatalogoPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary py-20 md:py-28 relative overflow-hidden">
        <Image src="/images/hero-pet-catalogo.png" alt="" fill className="object-cover opacity-20" sizes="100vw" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <PawPrint size={32} className="mx-auto mb-3 text-secondary-light" />
          <h1 className="font-[family-name:var(--font-serif)] text-3xl md:text-4xl text-white mb-3">Catalogo Urne Pet</h1>
          <p className="text-white/80">Urne e accessori commemorativi per il vostro compagno di vita.</p>
        </div>
      </section>
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-text-muted text-center">Il catalogo sara disponibile a breve. Contattateci per informazioni.</p>
        </div>
      </section>
    </div>
  )
}
