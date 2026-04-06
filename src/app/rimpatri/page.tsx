'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Globe, Plane, FileText, Phone, ChevronRight, Shield } from 'lucide-react'
import { useTranslations } from 'next-intl'

const paesi = [
  { zona: 'Europa', paesi: 'Germania, Francia, Svizzera, Belgio, Olanda, Regno Unito, Spagna, Romania, Albania, Ucraina, Polonia', costo: '1.800 — 4.500' },
  { zona: 'Nord Africa', paesi: 'Marocco, Tunisia, Egitto, Algeria, Libia', costo: '2.500 — 5.500' },
  { zona: 'Americhe', paesi: 'USA, Canada, Brasile, Argentina, Venezuela', costo: '4.000 — 10.000' },
  { zona: 'Asia', paesi: 'Cina, India, Pakistan, Bangladesh, Filippine', costo: '5.000 — 12.000' },
  { zona: 'Africa Sub-Sahariana', paesi: 'Nigeria, Senegal, Ghana, Costa d\'Avorio', costo: '4.500 — 9.000' },
]

export default function RimpatriPage() {
  const t = useTranslations('rimpatri')

  const steps = [
    { n: '01', titolo: t('step01Titolo'), desc: t('step01Desc') },
    { n: '02', titolo: t('step02Titolo'), desc: t('step02Desc') },
    { n: '03', titolo: t('step03Titolo'), desc: t('step03Desc') },
    { n: '04', titolo: t('step04Titolo'), desc: t('step04Desc') },
    { n: '05', titolo: t('step05Titolo'), desc: t('step05Desc') },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-primary py-20 md:py-28 relative overflow-hidden">
        <Image src="/images/hero.jpg" alt="" fill className="object-cover opacity-20" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/90 to-primary/70" />
        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 text-sm px-4 py-2 rounded-full mb-6">
            <Globe size={16} /> {t('badgeServizio')}
          </div>
          <h1 className="font-[family-name:var(--font-serif)] text-4xl md:text-5xl text-white mb-4">
            {t('titolo')}
          </h1>
          <p className="text-white/90 text-lg max-w-2xl mx-auto mb-8">
            {t('sottotitolo')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/configuratore?tipo=rimpatrio" className="btn-accent text-base py-4 px-8">
              {t('configuraRimpatrio')} <ChevronRight size={18} className="ml-2" />
            </Link>
            <a href="tel:+390815551234" className="btn-secondary border-white/30 text-white hover:bg-white/10 hover:text-white text-base py-4 px-8">
              <Phone size={18} className="mr-2" /> {t('urgenze247')}
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
                <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary">{t('rimpatrioItaliaTitolo')}</h2>
              </div>
              <p className="text-text-light text-sm leading-relaxed mb-4">
                {t('rimpatrioItaliaDesc')}
              </p>
              <ul className="space-y-2 text-sm text-text-light">
                <li className="flex gap-2"><Shield size={14} className="text-accent mt-0.5 flex-shrink-0" /> {t('rimpatrioItalia1')}</li>
                <li className="flex gap-2"><Shield size={14} className="text-accent mt-0.5 flex-shrink-0" /> {t('rimpatrioItalia2')}</li>
                <li className="flex gap-2"><Shield size={14} className="text-accent mt-0.5 flex-shrink-0" /> {t('rimpatrioItalia3')}</li>
                <li className="flex gap-2"><Shield size={14} className="text-accent mt-0.5 flex-shrink-0" /> {t('rimpatrioItalia4')}</li>
              </ul>
            </div>

            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                  <Globe size={22} className="text-secondary" />
                </div>
                <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary">{t('espatrioItaliaTitolo')}</h2>
              </div>
              <p className="text-text-light text-sm leading-relaxed mb-4">
                {t('espatrioItaliaDesc')}
              </p>
              <ul className="space-y-2 text-sm text-text-light">
                <li className="flex gap-2"><Shield size={14} className="text-accent mt-0.5 flex-shrink-0" /> {t('espatrioItalia1')}</li>
                <li className="flex gap-2"><Shield size={14} className="text-accent mt-0.5 flex-shrink-0" /> {t('espatrioItalia2')}</li>
                <li className="flex gap-2"><Shield size={14} className="text-accent mt-0.5 flex-shrink-0" /> {t('espatrioItalia3')}</li>
                <li className="flex gap-2"><Shield size={14} className="text-accent mt-0.5 flex-shrink-0" /> {t('espatrioItalia4')}</li>
              </ul>
            </div>
          </div>

          {/* Come funziona */}
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary text-center mb-10">{t('comeFunzionaTitolo')}</h2>
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
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary text-center mb-6">{t('costiZonaTitolo')}</h2>
          <p className="text-text-muted text-center text-sm mb-8">{t('costiZonaNota')}</p>
          <div className="card overflow-x-auto mb-16">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-text-muted font-medium">{t('colZona')}</th>
                  <th className="text-left py-3 px-4 text-text-muted font-medium">{t('colPaesi')}</th>
                  <th className="text-right py-3 px-4 text-text-muted font-medium">{t('colCosto')}</th>
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
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary text-center mb-8">{t('documentiTitolo')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
            {[
              t('doc1'),
              t('doc2'),
              t('doc3'),
              t('doc4'),
              t('doc5'),
              t('doc6'),
              t('doc7'),
              t('doc8'),
            ].map(doc => (
              <div key={doc} className="flex items-start gap-2 text-sm text-text-light">
                <FileText size={14} className="text-secondary mt-0.5 flex-shrink-0" />
                <span>{doc}</span>
              </div>
            ))}
            <p className="md:col-span-2 text-xs text-text-muted mt-2">
              {t('documentiNota')}
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-white mb-4">
            {t('ctaTitolo')}
          </h2>
          <p className="text-white/80 mb-8">
            {t('ctaDesc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/configuratore?tipo=rimpatrio" className="btn-accent text-lg py-4 px-10">
              {t('configuraRimpatrio')} <ChevronRight size={18} className="ml-2" />
            </Link>
            <a href="tel:+390815551234" className="btn-secondary border-white/30 text-white hover:bg-white/10 hover:text-white text-lg py-4 px-10">
              <Phone size={18} className="mr-2" /> {t('urgenze247')}
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
