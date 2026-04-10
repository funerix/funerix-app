import { Heart } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Memorial Pet — Funerix Pet',
  description: 'Pagine ricordo per i vostri animali domestici. Foto, messaggi e candele virtuali.',
}

export default function PetMemorialPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Heart size={32} className="mx-auto mb-3 text-secondary-light" />
          <h1 className="font-[family-name:var(--font-serif)] text-3xl md:text-4xl text-white mb-3">Memorial Pet</h1>
          <p className="text-white/80">Un ricordo digitale per il vostro compagno di vita.</p>
        </div>
      </section>
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-text-muted text-center">I memorial pet saranno disponibili a breve.</p>
        </div>
      </section>
    </div>
  )
}
