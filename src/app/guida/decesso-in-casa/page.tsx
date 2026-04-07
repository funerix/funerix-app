'use client'
import Link from 'next/link'
import { ArrowLeft, Phone, ChevronRight } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function Page() {
  const t = useTranslations('guidaDecesso')
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-[family-name:var(--font-serif)] text-4xl text-white">{t('titolo')}</h1>
          <p className="mt-3 text-white/90">{t('sottotitolo')}</p>
        </div>
      </section>
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <Link href="/guida" className="flex items-center gap-1 text-secondary text-sm mb-8 hover:underline">
            <ArrowLeft size={14} /> {t('tutteLeGuide')}
          </Link>
          <div className="prose max-w-none text-text-light leading-relaxed space-y-6">
            <div className="card">
              <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">{t('step1Titolo')}</h2>
              <p>{t('step1Testo')}</p>
            </div>
            <div className="card">
              <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">{t('step2Titolo')}</h2>
              <p>{t('step2Testo')}</p>
            </div>
            <div className="card">
              <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">{t('step3Titolo')}</h2>
              <p>{t('step3Testo')}</p>
            </div>
            <div className="card">
              <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">{t('step4Titolo')}</h2>
              <p>{t('step4Testo')}</p>
            </div>
            <div className="card">
              <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">{t('step5Titolo')}</h2>
              <p>{t('step5Testo')}</p>
            </div>
          </div>
          <div className="mt-12 text-center">
            <p className="text-text-muted mb-4">{t('assistenzaImmediata')}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="tel:+390815551234" className="btn-primary"><Phone size={16} className="mr-2" /> {t('chiamaOra')}</a>
              <Link href="/configuratore" className="btn-secondary">{t('configuraServizio')} <ChevronRight size={14} className="ml-1" /></Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
