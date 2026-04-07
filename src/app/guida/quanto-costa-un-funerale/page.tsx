'use client'
import Link from "next/link"
import { ArrowLeft, ChevronRight, Euro } from "lucide-react"
import { useTranslations } from 'next-intl'

export default function Page() {
  const t = useTranslations('guidaCosti')
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary py-16"><div className="max-w-4xl mx-auto px-4 text-center">
        <Euro size={36} className="mx-auto mb-3 text-secondary-light" />
        <h1 className="font-[family-name:var(--font-serif)] text-4xl text-white">{t('titolo')}</h1>
        <p className="mt-3 text-white/85">{t('sottotitolo')}</p>
      </div></section>
      <section className="py-16"><div className="max-w-3xl mx-auto px-4">
        <Link href="/guida" className="flex items-center gap-1 text-secondary text-sm mb-8 hover:underline"><ArrowLeft size={14} /> {t('tutteLeGuide')}</Link>
        <div className="prose max-w-none text-text-light leading-relaxed space-y-6">
          <div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">{t('economicoTitolo')}</h2>
          <p>{t('economicoTesto')}</p></div>
          <div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">{t('standardTitolo')}</h2>
          <p>{t('standardTesto')}</p></div>
          <div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">{t('premiumTitolo')}</h2>
          <p>{t('premiumTesto')}</p></div>
          <div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">{t('cremazioneTitolo')}</h2>
          <p>{t('cremazioneTesto')}</p></div>
          <div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">{t('cosaCostaTitolo')}</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>{t('voce1')}</li>
            <li>{t('voce2')}</li>
            <li>{t('voce3')}</li>
            <li>{t('voce4')}</li>
            <li>{t('voce5')}</li>
            <li>{t('voce6')}</li>
          </ul></div>
        </div>
        <div className="mt-12 text-center">
          <Link href="/configuratore" className="btn-primary">{t('calcolaPreventivo')} <ChevronRight size={14} className="ml-1" /></Link>
        </div>
      </div></section>
    </div>
  )
}
