'use client'

import Link from 'next/link'
import { Heart } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function CremazioneAnimaliPage() {
  const t = useTranslations('cremazioneAnimali')

  const servizi = [
    { nome: t('cremIndividualeCanePiccola'), prezzo: t('cremIndividualeCanePiccolaPrezzo'), desc: t('cremIndividualeCanePiccolaDesc') },
    { nome: t('cremIndividualeCaneMeda'), prezzo: t('cremIndividualeCaneMedaPrezzo'), desc: t('cremIndividualeCaneMedaDesc') },
    { nome: t('cremIndividualeCanGrande'), prezzo: t('cremIndividualeCanGrandePrezzo'), desc: t('cremIndividualeCanGrandeDesc') },
    { nome: t('cremIndividualeGatto'), prezzo: t('cremIndividualeGattoPrezzo'), desc: t('cremIndividualeGattoDesc') },
    { nome: t('cremCollettiva'), prezzo: t('cremCollettivaPrezzo'), desc: t('cremCollettivaDesc') },
    { nome: t('ritiroDomicilio'), prezzo: t('ritiroDomicilioPrezzo'), desc: t('ritiroDomicilioDesc') },
    { nome: t('urnaCommemorativa'), prezzo: t('urnaCommemorativaPrezzo'), desc: t('urnaCommemorativaDesc') },
  ]

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Heart size={40} className="mx-auto mb-4 text-secondary-light" />
          <h1 className="font-[family-name:var(--font-serif)] text-4xl md:text-5xl text-white mb-4">
            {t('titolo')}
          </h1>
          <p className="text-white/90 text-lg max-w-2xl mx-auto">
            {t('sottotitolo')}
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="prose max-w-none text-text-light mb-12">
            <p className="text-lg">
              {t('intro')}
            </p>
          </div>

          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary mb-8 text-center">{t('serviziPrezziTitolo')}</h2>
          <div className="space-y-3 mb-16">
            {servizi.map(s => (
              <div key={s.nome} className="card flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <h3 className="font-medium text-primary">{s.nome}</h3>
                  <p className="text-text-muted text-sm">{s.desc}</p>
                </div>
                <span className="font-[family-name:var(--font-serif)] text-xl text-primary font-semibold whitespace-nowrap">
                  &euro; {s.prezzo}
                </span>
              </div>
            ))}
          </div>

          <div className="card bg-secondary/5 border-secondary/20 text-center">
            <h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-3">
              {t('comeProcedereTitolo')}
            </h2>
            <p className="text-text-light mb-6 max-w-xl mx-auto">
              {t('comeProcedereDesc')}
            </p>
            <Link href="/configuratore?tipo=animale" className="btn-primary">
              {t('configuraCremazione')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
