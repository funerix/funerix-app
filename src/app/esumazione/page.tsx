import Link from 'next/link'
import { Phone, ChevronRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Esumazione e Riesumazione — Servizio Completo',
  description: 'Servizio di esumazione e riesumazione salme in Campania. Trasferimento resti, ricollocazione in loculo, cremazione resti. Assistenza pratiche.',
}

const servizi = [
  { nome: 'Esumazione ordinaria', prezzo: '400 — 800', desc: 'Al termine della concessione cimiteriale (generalmente dopo 10-30 anni).' },
  { nome: 'Esumazione straordinaria', prezzo: '600 — 1.200', desc: 'Prima del termine della concessione, su richiesta della famiglia o dell\'autorità.' },
  { nome: 'Riesumazione da loculo', prezzo: '500 — 1.000', desc: 'Estrazione della salma da un loculo per trasferimento o cremazione.' },
  { nome: 'Cremazione resti', prezzo: '200 — 400', desc: 'Cremazione dei resti ossei dopo esumazione.' },
  { nome: 'Trasferimento in altro cimitero', prezzo: '800 — 2.000', desc: 'Trasporto dei resti in un cimitero diverso, anche fuori provincia.' },
  { nome: 'Ricollocazione in loculo/ossario', prezzo: '300 — 600', desc: 'Collocazione dei resti in nuovo loculo, ossario o cappella di famiglia.' },
  { nome: 'Assistenza pratiche', prezzo: '150 — 300', desc: 'Gestione completa delle autorizzazioni con Comune, ASL e cimitero.' },
]

export default function EsumazionePage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-[family-name:var(--font-serif)] text-4xl md:text-5xl text-white mb-4">Esumazione e Riesumazione</h1>
          <p className="text-white/90 text-lg max-w-2xl mx-auto">
            Servizio completo per esumazione, riesumazione, trasferimento resti e cremazione.
            Assistenza per tutte le pratiche burocratiche in Campania.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary text-center mb-8">Servizi e costi indicativi</h2>
          <div className="space-y-3 mb-16">
            {servizi.map(s => (
              <div key={s.nome} className="card flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <h3 className="font-medium text-primary">{s.nome}</h3>
                  <p className="text-text-muted text-sm">{s.desc}</p>
                </div>
                <span className="font-[family-name:var(--font-serif)] text-xl text-primary font-semibold whitespace-nowrap">&euro; {s.prezzo}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/configuratore" className="btn-primary">
              Configura il Servizio <ChevronRight size={16} className="ml-1" />
            </Link>
            <a href="tel:+390815551234" className="btn-secondary">
              <Phone size={16} className="mr-2" /> Chiama per Preventivo
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
