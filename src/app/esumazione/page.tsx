'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'

export default function EsumazionePage() {
  const t = useTranslations('esumazione')

  const servizi = [
    { nome: t('esumazioneOrdinaria'), prezzo: t('esumazioneOrdinariaPrezzo'), desc: t('esumazioneOrdinariaDesc') },
    { nome: t('esumazioneStaordinaria'), prezzo: t('esumazioneStaordinariaPrezzo'), desc: t('esumazioneStaordinariaDesc') },
    { nome: t('riesumazioneDaLoculo'), prezzo: t('riesumazioneDaLocoloPrezzo'), desc: t('riesumazioneDaLocoloDesc') },
    { nome: t('cremazioneResti'), prezzo: t('cremazioneRestiPrezzo'), desc: t('cremazioneRestiDesc') },
    { nome: t('trasferimentoAltroCimitero'), prezzo: t('trasferimentoAltroCimiteroPrezzo'), desc: t('trasferimentoAltroCimiteroDesc') },
    { nome: t('ricollocazioneLoculo'), prezzo: t('ricollocazioneLocoloPrezzo'), desc: t('ricollocazioneLocoloDesc') },
    { nome: t('assistenzaPratiche'), prezzo: t('assistenzaPratichePrezzo'), desc: t('assistenzaPraticheDesc') },
  ]

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-[family-name:var(--font-serif)] text-4xl md:text-5xl text-white mb-4">{t('titolo')}</h1>
          <p className="text-white/90 text-lg max-w-2xl mx-auto">
            {t('sottotitolo')}
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary text-center mb-8">{t('serviziCostiTitolo')}</h2>
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

          <div className="text-center">
            <Link href="/contatti" className="btn-primary">{t('richiediPreventivo')}</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
