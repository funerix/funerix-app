'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Phone, ChevronRight, MapPin, Clock, Shield } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface Props {
  nome: string
  provincia: string
  slug: string
}

export default function ComuneClient({ nome, provincia }: Props) {
  const t = useTranslations('onoranzeComune')

  const servizi = [
    { titolo: t('inumazione'), desc: `${t('inumazioneDesc').replace('{nome}', nome)}` },
    { titolo: t('tumulazione'), desc: `${t('tumuazioneDesc').replace('{nome}', nome)}` },
    { titolo: t('cremazione'), desc: `${t('cremazioneDesc').replace('{nome}', nome)}` },
  ]

  const vantaggi = [
    { icon: Clock, titolo: t('rispostaIn30'), desc: t('rispostaIn30Desc') },
    { icon: Shield, titolo: t('prezziTrasparenti'), desc: t('prezziTrasparentiDesc') },
    { icon: MapPin, titolo: `${t('operiamoA')} ${nome}`, desc: t('operiamoDesc').replace('{nome}', nome) },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative bg-primary py-20 md:py-28 overflow-hidden">
        <Image src="/images/hero.jpg" alt="" fill className="object-cover opacity-30" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/80 to-primary/60" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-[family-name:var(--font-serif)] text-4xl md:text-5xl text-white mb-4">
            {t('heroTitolo')} {nome}
          </h1>
          <p className="text-white/90 text-lg max-w-2xl mx-auto mb-8">
            {t('heroDesc').replace('{nome}', nome).replace('{provincia}', provincia)}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/configuratore" className="btn-accent text-base py-4 px-8">
              {t('configuraServizio')} <ChevronRight size={18} className="ml-2" />
            </Link>
            <Link href="/contatti" className="btn-secondary border-white/30 text-white hover:bg-white/10 hover:text-white text-base py-4 px-8">
              <Phone size={18} className="mr-2" /> {t('contattaci')}
            </Link>
          </div>
        </div>
      </section>

      {/* Servizi */}
      <section className="py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary mb-8 text-center">
            {t('serviziTitolo')} {nome}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {servizi.map((s) => (
              <div key={s.titolo} className="card text-center">
                <h3 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">{s.titolo}</h3>
                <p className="text-text-light text-sm">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="prose max-w-none text-text-light leading-relaxed space-y-4">
            <h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary">
              {t('percheScegliereTitolo').replace('{nome}', nome)}
            </h2>
            <p>{t('percheScegliere1').replace('{nome}', nome).replace('{provincia}', provincia)}</p>
            <p>{t('percheScegliere2')}</p>

            <h3 className="font-[family-name:var(--font-serif)] text-xl text-primary">
              {t('cosaIncludeTitolo')} {nome}
            </h3>
            <ul>
              <li>{t('cosaInclude1').replace('{nome}', nome)}</li>
              <li>{t('cosaInclude2')}</li>
              <li>{t('cosaInclude3')}</li>
              <li>{t('cosaInclude4')}</li>
              <li>{t('cosaInclude5')}</li>
              <li>{t('cosaInclude6')}</li>
              <li>{t('cosaInclude7')}</li>
              <li>{t('cosaInclude8')}</li>
            </ul>

            <h3 className="font-[family-name:var(--font-serif)] text-xl text-primary">
              {t('costoTitolo')} {nome}?
            </h3>
            <p>{t('costoDesc').replace('{nome}', nome)}</p>
          </div>
        </div>
      </section>

      {/* Vantaggi */}
      <section className="py-16 bg-background-dark">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {vantaggi.map((v) => (
              <div key={v.titolo} className="card text-center">
                <v.icon size={28} className="mx-auto mb-3 text-secondary" />
                <h3 className="font-[family-name:var(--font-serif)] text-lg text-primary mb-2">{v.titolo}</h3>
                <p className="text-text-light text-sm">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary mb-4">
            {t('ctaTitolo')} {nome}?
          </h2>
          <p className="text-text-light mb-8">
            {t('ctaDesc')}
          </p>
          <Link href="/configuratore" className="btn-primary text-base py-4 px-10">
            {t('configuraServizio')} <ChevronRight size={18} className="ml-2" />
          </Link>
        </div>
      </section>
    </div>
  )
}
