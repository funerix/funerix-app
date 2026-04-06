'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Home, Building2, Globe, PawPrint, ChevronRight, Phone, Euro, FileText, Flame, BookOpen, ScrollText, Users } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function GuidaPage() {
  const t = useTranslations('guida')

  const guideScenari = [
    { href: '/guida/decesso-in-casa', icon: Home, titolo: t('guide1Titolo'), desc: t('guide1Desc') },
    { href: '/guida/decesso-in-ospedale', icon: Building2, titolo: t('guide2Titolo'), desc: t('guide2Desc') },
    { href: '/guida/decesso-allestero', icon: Globe, titolo: t('guide3Titolo'), desc: t('guide3Desc') },
    { href: '/guida/decesso-in-rsa', icon: Users, titolo: t('guide4Titolo'), desc: t('guide4Desc') },
  ]

  const guideInformative = [
    { href: '/guida/quanto-costa-un-funerale', icon: Euro, titolo: t('guideInfo1Titolo'), desc: t('guideInfo1Desc') },
    { href: '/guida/documenti-necessari', icon: FileText, titolo: t('guideInfo2Titolo'), desc: t('guideInfo2Desc') },
    { href: '/guida/cremazione-come-funziona', icon: Flame, titolo: t('guideInfo3Titolo'), desc: t('guideInfo3Desc') },
    { href: '/guida/inumazione-o-tumulazione', icon: BookOpen, titolo: t('guideInfo4Titolo'), desc: t('guideInfo4Desc') },
    { href: '/guida/manifesto-funebre', icon: ScrollText, titolo: t('guideInfo5Titolo'), desc: t('guideInfo5Desc') },
    { href: '/guida/testamento-e-volonta', icon: FileText, titolo: t('guideInfo6Titolo'), desc: t('guideInfo6Desc') },
    { href: '/guida/lutto-e-supporto', icon: Users, titolo: t('guideInfo7Titolo'), desc: t('guideInfo7Desc') },
    { href: '/guida/cremazione-animali', icon: PawPrint, titolo: t('guideInfo8Titolo'), desc: t('guideInfo8Desc') },
  ]

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary py-16 md:py-20 relative overflow-hidden">
        <Image src="/images/candele.jpg" alt="" fill className="object-cover opacity-20" sizes="100vw" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-[family-name:var(--font-serif)] text-4xl md:text-5xl text-white mb-4">
            {t('titolo')}
          </h1>
          <p className="text-white/85 text-lg max-w-2xl mx-auto">
            {t('sottotitolo')}
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          {/* Scenari decesso */}
          <h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-6">{t('cosaDareTitolo')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
            {guideScenari.map(g => (
              <Link key={g.href} href={g.href} className="card group flex items-start gap-4">
                <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-secondary/20 transition">
                  <g.icon size={20} className="text-secondary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-primary group-hover:text-secondary transition">{g.titolo}</h3>
                  <p className="text-text-muted text-sm mt-0.5">{g.desc}</p>
                  <span className="text-secondary text-xs mt-2 inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                    {t('leggiGuida')} <ChevronRight size={12} />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Guide informative */}
          <h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-6">{t('guideInformativeTitolo')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
            {guideInformative.map(g => (
              <Link key={g.href} href={g.href} className="card group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center group-hover:bg-secondary/20 transition">
                    <g.icon size={16} className="text-secondary" />
                  </div>
                  <h3 className="font-medium text-primary group-hover:text-secondary transition text-sm">{g.titolo}</h3>
                </div>
                <p className="text-text-muted text-xs leading-relaxed">{g.desc}</p>
              </Link>
            ))}
          </div>

          <div className="card bg-primary/5 border-primary/10 text-center">
            <p className="text-text-light mb-4">{t('nonTrovate')}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="tel:+390815551234" className="btn-primary text-sm"><Phone size={16} className="mr-2" /> {t('chiamaOra')}</a>
              <Link href="/assistenza" className="btn-secondary text-sm">{t('chattaConNoi')}</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
