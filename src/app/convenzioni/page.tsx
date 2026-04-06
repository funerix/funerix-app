'use client'

import Link from 'next/link'
import { Shield, Euro, Users, Phone, ChevronRight, Check, Building2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function ConvenzioniPage() {
  const t = useTranslations('convenzioni')
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Building2 size={40} className="mx-auto mb-4 text-secondary-light" />
          <h1 className="font-[family-name:var(--font-serif)] text-4xl md:text-5xl text-white mb-4">{t('titolo')}</h1>
          <p className="text-white/85 text-lg max-w-2xl mx-auto">
            {t('sottotitolo')}
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              { icon: Users, t: t('perFamiliariTitolo'), d: t('perFamiliariDesc') },
              { icon: Euro, t: t('commissioneTitolo'), d: t('commissioneDesc') },
              { icon: Shield, t: t('assistenzaTotaleTitolo'), d: t('assistenzaTotaleDesc') },
            ].map(v => (
              <div key={v.t} className="card text-center">
                <v.icon size={28} className="mx-auto mb-3 text-secondary" />
                <h3 className="font-[family-name:var(--font-serif)] text-lg text-primary mb-2">{v.t}</h3>
                <p className="text-text-muted text-sm">{v.d}</p>
              </div>
            ))}
          </div>

          <div className="card mb-12">
            <h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-6">{t('comeFunzionaTitolo')}</h2>
            <div className="space-y-4">
              {[
                { n: '1', t: t('step1Titolo'), d: t('step1Desc') },
                { n: '2', t: t('step2Titolo'), d: t('step2Desc') },
                { n: '3', t: t('step3Titolo'), d: t('step3Desc') },
                { n: '4', t: t('step4Titolo'), d: t('step4Desc') },
                { n: '5', t: t('step5Titolo'), d: t('step5Desc') },
              ].map(s => (
                <div key={s.n} className="flex gap-4 items-start">
                  <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-secondary font-bold text-sm">{s.n}</span>
                  </div>
                  <div><h3 className="font-medium text-primary">{s.t}</h3><p className="text-text-muted text-sm">{s.d}</p></div>
                </div>
              ))}
            </div>
          </div>

          <div className="card mb-12">
            <h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-4">{t('vantaggiTitolo')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                t('vantaggio1'),
                t('vantaggio2'),
                t('vantaggio3'),
                t('vantaggio4'),
                t('vantaggio5'),
                t('vantaggio6'),
                t('vantaggio7'),
                t('vantaggio8'),
              ].map(v => (
                <div key={v} className="flex gap-2 text-sm text-text-light"><Check size={14} className="text-accent mt-0.5 flex-shrink-0" />{v}</div>
              ))}
            </div>
          </div>

          <div className="card bg-secondary/5 border-secondary/20 text-center">
            <h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-3">{t('diventaPartnerTitolo')}</h2>
            <p className="text-text-light mb-6 max-w-lg mx-auto">{t('diventaPartnerDesc')}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="tel:+390815551234" className="btn-primary"><Phone size={16} className="mr-2" /> {t('chiamaOra')}</a>
              <Link href="/contatti" className="btn-secondary">{t('compilaForm')}</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
