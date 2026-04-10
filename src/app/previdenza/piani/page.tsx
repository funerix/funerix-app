import { Shield, Check, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Piani Previdenza Funeraria — Funerix Previdenza',
  description: 'Confronta i piani previdenza funeraria Funerix. Base, Comfort e Premium. Prezzo bloccato, rate mensili.',
}

export default function PianiPrevidenzaPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Shield size={32} className="mx-auto mb-3 text-secondary-light" />
          <h1 className="font-[family-name:var(--font-serif)] text-3xl md:text-4xl text-white mb-3">Piani Previdenza Funerix</h1>
          <p className="text-white/80">Scegliete il piano piu adatto. Tutti con prezzo bloccato e rate mensili.</p>
        </div>
      </section>
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { nome: 'Base', prezzo: '3.500', color: 'border-border', servizi: ['Bara in legno massello', 'Auto funebre', 'Cerimonia semplice', 'Fiori base', 'Trasporto entro 20km'] },
              { nome: 'Comfort', prezzo: '5.500', color: 'border-secondary', servizi: ['Tutto il Base +', 'Bara premium', 'Auto funebre di lusso', 'Cerimonia con musica', 'Fiori composizione', 'Manifesto + Memorial', 'Trasporto entro 50km'] },
              { nome: 'Premium', prezzo: '8.000', color: 'border-accent', servizi: ['Tutto il Comfort +', 'Bara di pregio', '2 auto funebri', 'Cerimonia con coro', 'Fiori premium', 'Video tributo', 'Trasporto illimitato', 'Consulente dedicato'] },
            ].map(piano => (
              <div key={piano.nome} className={`card border-2 ${piano.color} relative`}>
                {piano.nome === 'Comfort' && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary text-white text-xs px-3 py-1 rounded-full font-medium">
                    Consigliato
                  </div>
                )}
                <h3 className="font-[family-name:var(--font-serif)] text-2xl text-primary text-center mb-1">{piano.nome}</h3>
                <p className="text-center mb-4">
                  <span className="font-[family-name:var(--font-serif)] text-3xl text-primary font-bold">&euro; {piano.prezzo}</span>
                </p>
                <ul className="space-y-2 mb-6">
                  {piano.servizi.map(s => (
                    <li key={s} className="flex gap-2 text-sm text-text-light">
                      <Check size={14} className="text-accent mt-0.5 flex-shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
                <Link href="/previdenza/configuratore" className="btn-primary w-full justify-center text-sm">
                  Scegli {piano.nome} <ChevronRight size={14} className="ml-1" />
                </Link>
              </div>
            ))}
          </div>
          <p className="text-text-muted text-center text-sm mt-8">
            Tutti i piani sono personalizzabili nel configuratore. I prezzi mostrati sono indicativi.
          </p>
        </div>
      </section>
    </div>
  )
}
