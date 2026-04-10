import Link from 'next/link'
import Image from 'next/image'
import { Globe, Plane, FileText, Phone, ChevronRight, Shield, Clock, MapPin } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Rimpatrio e Espatrio Salme — Trasporto Internazionale',
  description: 'Servizio di rimpatrio salme dall\'estero e espatrio dall\'Italia. Trasporto internazionale in tutto il mondo. Assistenza completa 24/7.',
}

const paesi = [
  { zona: 'Europa', paesi: 'Germania, Francia, Svizzera, Belgio, Olanda, Regno Unito, Spagna, Romania, Albania, Ucraina, Polonia', costo: '1.800 — 4.500' },
  { zona: 'Nord Africa', paesi: 'Marocco, Tunisia, Egitto, Algeria, Libia', costo: '2.500 — 5.500' },
  { zona: 'Americhe', paesi: 'USA, Canada, Brasile, Argentina, Venezuela', costo: '4.000 — 10.000' },
  { zona: 'Asia', paesi: 'Cina, India, Pakistan, Bangladesh, Filippine', costo: '5.000 — 12.000' },
  { zona: 'Africa Sub-Sahariana', paesi: 'Nigeria, Senegal, Ghana, Costa d\'Avorio', costo: '4.500 — 9.000' },
]

const steps = [
  { n: '01', titolo: 'Contattateci', desc: 'Chiamate 24/7. Raccogliamo tutte le informazioni necessarie sul luogo del decesso e la destinazione.' },
  { n: '02', titolo: 'Documentazione', desc: 'Ci occupiamo di certificato di morte, passaporto mortuario, traduzione, legalizzazione e autorizzazioni consolari.' },
  { n: '03', titolo: 'Preparazione', desc: 'Trattamento conservativo (tanatoprassi), cofano zincato a norma IATA per trasporto aereo internazionale.' },
  { n: '04', titolo: 'Trasporto', desc: 'Coordinamento con compagnie aeree, dogana, aeroporti di partenza e arrivo. Tracking in tempo reale.' },
  { n: '05', titolo: 'Consegna', desc: 'Accoglienza nel paese di destinazione con impresa funebre locale. Assistenza fino alla sepoltura.' },
]

export default function RimpatriPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-primary py-20 md:py-28 relative overflow-hidden">
        <Image src="/images/hero.jpg" alt="" fill className="object-cover opacity-20" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/90 to-primary/70" />
        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 text-sm px-4 py-2 rounded-full mb-6">
            <Globe size={16} /> Servizio internazionale in tutto il mondo
          </div>
          <h1 className="font-[family-name:var(--font-serif)] text-4xl md:text-5xl text-white mb-4">
            Rimpatrio e Espatrio Salme
          </h1>
          <p className="text-white/90 text-lg max-w-2xl mx-auto mb-8">
            Trasporto internazionale della salma da e verso qualsiasi paese del mondo.
            Assistenza completa per documentazione, pratiche consolari e logistica.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/rimpatri/configuratore" className="btn-accent text-base py-4 px-8">
              Configura Rimpatrio <ChevronRight size={18} className="ml-2" />
            </Link>
            <a href="tel:+390815551234" className="btn-secondary border-white/30 text-white hover:bg-white/10 hover:text-white text-base py-4 px-8">
              <Phone size={18} className="mr-2" /> Urgenze 24/7
            </a>
          </div>
        </div>
      </section>

      {/* Servizi */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                  <Plane size={22} className="text-secondary" />
                </div>
                <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary">Rimpatrio in Italia</h2>
              </div>
              <p className="text-text-light text-sm leading-relaxed mb-4">
                Il vostro caro &egrave; deceduto all&apos;estero? Ci occupiamo di tutto:
                dal recupero della salma nel paese straniero fino alla consegna in Italia.
              </p>
              <ul className="space-y-2 text-sm text-text-light">
                <li className="flex gap-2"><Shield size={14} className="text-accent mt-0.5 flex-shrink-0" /> Coordinamento con consolati e ambasciate</li>
                <li className="flex gap-2"><Shield size={14} className="text-accent mt-0.5 flex-shrink-0" /> Traduzione e legalizzazione documenti</li>
                <li className="flex gap-2"><Shield size={14} className="text-accent mt-0.5 flex-shrink-0" /> Trasporto aereo con cofano zincato IATA</li>
                <li className="flex gap-2"><Shield size={14} className="text-accent mt-0.5 flex-shrink-0" /> Accoglienza in aeroporto italiano</li>
              </ul>
            </div>

            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                  <Globe size={22} className="text-secondary" />
                </div>
                <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary">Espatrio dall&apos;Italia</h2>
              </div>
              <p className="text-text-light text-sm leading-relaxed mb-4">
                Un cittadino straniero &egrave; deceduto in Italia e la famiglia desidera
                il rimpatrio? Gestiamo il trasporto verso qualsiasi destinazione.
              </p>
              <ul className="space-y-2 text-sm text-text-light">
                <li className="flex gap-2"><Shield size={14} className="text-accent mt-0.5 flex-shrink-0" /> Pratiche con ASL e Comune italiano</li>
                <li className="flex gap-2"><Shield size={14} className="text-accent mt-0.5 flex-shrink-0" /> Passaporto mortuario internazionale</li>
                <li className="flex gap-2"><Shield size={14} className="text-accent mt-0.5 flex-shrink-0" /> Trattamento conservativo e imbalsamazione</li>
                <li className="flex gap-2"><Shield size={14} className="text-accent mt-0.5 flex-shrink-0" /> Consegna a impresa funebre nel paese di destinazione</li>
              </ul>
            </div>
          </div>

          {/* Come funziona */}
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary text-center mb-10">Come funziona</h2>
          <div className="space-y-6 mb-16">
            {steps.map((s, i) => (
              <div key={i} className="flex gap-5 items-start">
                <span className="font-[family-name:var(--font-serif)] text-4xl font-bold text-secondary/20 flex-shrink-0 w-12">{s.n}</span>
                <div>
                  <h3 className="font-[family-name:var(--font-serif)] text-lg text-primary mb-1">{s.titolo}</h3>
                  <p className="text-text-light text-sm">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Tabella costi per zona */}
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary text-center mb-6">Costi indicativi per zona</h2>
          <p className="text-text-muted text-center text-sm mb-8">I prezzi variano in base alla distanza, al paese e alle pratiche necessarie.</p>
          <div className="card overflow-x-auto mb-16">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-text-muted font-medium">Zona</th>
                  <th className="text-left py-3 px-4 text-text-muted font-medium">Paesi principali</th>
                  <th className="text-right py-3 px-4 text-text-muted font-medium">Costo indicativo (&euro;)</th>
                </tr>
              </thead>
              <tbody>
                {paesi.map(p => (
                  <tr key={p.zona} className="border-b border-border/50">
                    <td className="py-3 px-4 font-medium text-primary">{p.zona}</td>
                    <td className="py-3 px-4 text-text-light">{p.paesi}</td>
                    <td className="py-3 px-4 text-right font-[family-name:var(--font-serif)] font-semibold text-primary">&euro; {p.costo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Documenti necessari */}
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary text-center mb-8">Documenti necessari</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
            {[
              'Certificato di morte (originale + traduzione)',
              'Passaporto mortuario (rilasciato dal Comune)',
              'Nulla osta dell\'autorità consolare',
              'Autorizzazione al trasporto internazionale',
              'Certificato di imbalsamazione (se richiesto)',
              'Dichiarazione di non contenere oggetti estranei',
              'Passaporto o documento del defunto',
              'Atto di morte trascritto e legalizzato',
            ].map(doc => (
              <div key={doc} className="flex items-start gap-2 text-sm text-text-light">
                <FileText size={14} className="text-secondary mt-0.5 flex-shrink-0" />
                <span>{doc}</span>
              </div>
            ))}
            <p className="md:col-span-2 text-xs text-text-muted mt-2">
              Ci occupiamo noi di tutta la documentazione. Non dovrete preoccuparvi di nulla.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-white mb-4">
            Avete bisogno di un rimpatrio urgente?
          </h2>
          <p className="text-white/80 mb-8">
            Siamo operativi 24 ore su 24 per gestire rimpatri urgenti in tutto il mondo.
            Un consulente specializzato vi seguir&agrave; in ogni fase.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/rimpatri/configuratore" className="btn-accent text-lg py-4 px-10">
              Configura Rimpatrio <ChevronRight size={18} className="ml-2" />
            </Link>
            <a href="tel:+390815551234" className="btn-secondary border-white/30 text-white hover:bg-white/10 hover:text-white text-lg py-4 px-10">
              <Phone size={18} className="mr-2" /> Urgenze 24/7
            </a>
          </div>
        </div>
      </section>

      {/* Schema.org */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'Service',
        name: 'Rimpatrio e Espatrio Salme — Funerix',
        description: 'Servizio di trasporto internazionale salme da e verso qualsiasi paese del mondo.',
        provider: { '@type': 'FuneralHome', name: 'Funerix', telephone: '+390815551234' },
        areaServed: { '@type': 'Place', name: 'Worldwide' },
      })}} />
    </div>
  )
}
