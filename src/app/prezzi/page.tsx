'use client'

import Link from 'next/link'
import { ChevronRight, Euro } from 'lucide-react'
import { useTranslations } from 'next-intl'

const prezziProvincia = [
  { provincia: 'Napoli', inumazione: '2.500', tumulazione: '4.500', cremazione: '2.200', premium: '8.000' },
  { provincia: 'Caserta', inumazione: '2.200', tumulazione: '4.000', cremazione: '2.000', premium: '7.500' },
  { provincia: 'Salerno', inumazione: '2.300', tumulazione: '4.200', cremazione: '2.100', premium: '7.800' },
  { provincia: 'Avellino', inumazione: '2.000', tumulazione: '3.800', cremazione: '1.900', premium: '7.000' },
  { provincia: 'Benevento', inumazione: '2.000', tumulazione: '3.700', cremazione: '1.800', premium: '6.800' },
]

const costiDettaglio = [
  { voce: 'Cofano funebre', economico: '350 — 700', standard: '800 — 2.000', premium: '2.000 — 4.000+' },
  { voce: 'Trasporto funebre', economico: '300 — 500', standard: '500 — 800', premium: '800 — 1.500' },
  { voce: 'Corona fiori', economico: '80 — 150', standard: '150 — 300', premium: '300 — 500+' },
  { voce: 'Vestizione salma', economico: '100 — 150', standard: '150 — 250', premium: '250 — 400' },
  { voce: 'Necrologi', economico: '50 — 100', standard: '100 — 300', premium: '300 — 600' },
  { voce: 'Pratiche burocratiche', economico: '150 — 250', standard: '250 — 400', premium: 'Incluse' },
  { voce: 'Camera ardente', economico: '—', standard: '200 — 500', premium: '500 — 800/giorno' },
  { voce: 'Tanatocosmesi', economico: '—', standard: '200 — 350', premium: '350 — 800' },
  { voce: 'Concessione cimiteriale', economico: '300 — 600', standard: '1.500 — 3.000', premium: '3.000 — 8.000' },
  { voce: 'Urna cineraria', economico: '50 — 150', standard: '150 — 400', premium: '400 — 1.200' },
]

export default function PrezziPage() {
  const t = useTranslations('prezzi')

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Euro size={40} className="mx-auto mb-4 text-secondary-light" />
          <h1 className="font-[family-name:var(--font-serif)] text-4xl md:text-5xl text-white mb-4">
            {t('titolo')}
          </h1>
          <p className="text-white/90 text-lg max-w-2xl mx-auto">
            {t('sottotitolo')}
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          {/* Tabella per provincia */}
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary text-center mb-8">{t('prezziMediTitolo')}</h2>
          <div className="card overflow-x-auto mb-16">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-text-muted font-medium">{t('colProvincia')}</th>
                  <th className="text-right py-3 px-4 text-text-muted font-medium">{t('colInumazione')}</th>
                  <th className="text-right py-3 px-4 text-text-muted font-medium">{t('colTumulazione')}</th>
                  <th className="text-right py-3 px-4 text-text-muted font-medium">{t('colCremazione')}</th>
                  <th className="text-right py-3 px-4 text-text-muted font-medium">{t('colPremium')}</th>
                </tr>
              </thead>
              <tbody>
                {prezziProvincia.map(p => (
                  <tr key={p.provincia} className="border-b border-border/50 hover:bg-background transition-colors">
                    <td className="py-4 px-4 font-medium text-primary">{p.provincia}</td>
                    <td className="py-4 px-4 text-right font-[family-name:var(--font-serif)]">{t('da')} &euro; {p.inumazione}</td>
                    <td className="py-4 px-4 text-right font-[family-name:var(--font-serif)]">{t('da')} &euro; {p.tumulazione}</td>
                    <td className="py-4 px-4 text-right font-[family-name:var(--font-serif)]">{t('da')} &euro; {p.cremazione}</td>
                    <td className="py-4 px-4 text-right font-[family-name:var(--font-serif)] font-semibold text-primary">{t('da')} &euro; {p.premium}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Dettaglio costi */}
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary text-center mb-8">{t('dettaglioCostiTitolo')}</h2>
          <div className="card overflow-x-auto mb-16">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-text-muted font-medium">{t('colServizio')}</th>
                  <th className="text-right py-3 px-4 text-text-muted font-medium">{t('colEconomico')}</th>
                  <th className="text-right py-3 px-4 text-text-muted font-medium">{t('colStandard')}</th>
                  <th className="text-right py-3 px-4 text-text-muted font-medium">{t('colPremium')}</th>
                </tr>
              </thead>
              <tbody>
                {costiDettaglio.map(c => (
                  <tr key={c.voce} className="border-b border-border/50">
                    <td className="py-3 px-4 text-text">{c.voce}</td>
                    <td className="py-3 px-4 text-right text-text-light">&euro; {c.economico}</td>
                    <td className="py-3 px-4 text-right text-text-light">&euro; {c.standard}</td>
                    <td className="py-3 px-4 text-right text-text-light">&euro; {c.premium}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-primary/5 border border-primary/10 rounded-xl p-6 text-center mb-16">
            <p className="text-xs text-text-muted mb-4">
              {t('notaLegale')}
            </p>
          </div>

          <div className="text-center">
            <h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-4">{t('preventivoPersonalizzatoTitolo')}</h2>
            <p className="text-text-light mb-6">{t('preventivoPersonalizzatoDesc')}</p>
            <Link href="/configuratore" className="btn-primary text-base py-4 px-10">
              {t('configuraServizio')} <ChevronRight size={18} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
