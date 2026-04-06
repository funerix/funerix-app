'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin } from 'lucide-react'
import { useSitoStore } from '@/store/sito'
import { useTranslations } from 'next-intl'
import { useLocale } from '@/i18n/provider'

export function Footer() {
  const t = useTranslations('footer')
  const { locale } = useLocale()
  const isIt = locale === 'it'
  const { impostazioni, contenuti } = useSitoStore()
  return (
    <footer className="bg-primary text-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start md:pt-1">
          {/* Brand — 4 colonne */}
          <div className="md:col-span-4">
            <Image src="/images/logo-white.png" alt="Funerix" width={280} height={84} className="h-16 w-auto -mt-3 mb-1" />
            <p className="text-sm leading-relaxed text-white/70">
              {isIt ? contenuti.footerDescrizione : t('descrizione')}
            </p>
          </div>

          {/* Servizi — 2 colonne */}
          <div className="md:col-span-2">
            <h4 className="text-white font-semibold mb-4 text-xs uppercase tracking-wider">
              {t('servizi')}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/configuratore" className="hover:text-white transition-colors">{t('configuraServizio')}</Link></li>
              <li><Link href="/catalogo" className="hover:text-white transition-colors">{t('catalogoProdotti')}</Link></li>
              <li><Link href="/memorial" className="hover:text-white transition-colors">{t('memorialOnline')}</Link></li>
              <li><Link href="/contatti" className="hover:text-white transition-colors">{t('contatti')}</Link></li>
            </ul>
          </div>

          {/* Info — 2 colonne */}
          <div className="md:col-span-2">
            <h4 className="text-white font-semibold mb-4 text-xs uppercase tracking-wider">
              {t('azienda')}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/chi-siamo" className="hover:text-white transition-colors">{t('chiSiamo')}</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">{t('privacy')}</Link></li>
              <li><Link href="/cookie" className="hover:text-white transition-colors">{t('cookie')}</Link></li>
              <li><Link href="/termini" className="hover:text-white transition-colors">{t('termini')}</Link></li>
            </ul>
          </div>

          {/* Contatti — 4 colonne */}
          <div className="md:col-span-4">
            <h4 className="text-white font-semibold mb-4 text-xs uppercase tracking-wider">
              {t('contatti')}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2.5">
                <Phone size={14} className="text-secondary-light flex-shrink-0" />
                <a href={`tel:${impostazioni.telefono.replace(/\s/g, '')}`} className="hover:text-white transition-colors">{impostazioni.telefono}</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={14} className="text-secondary-light flex-shrink-0" />
                <a href={`mailto:${impostazioni.email}`} className="hover:text-white transition-colors">{impostazioni.email}</a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={14} className="text-secondary-light flex-shrink-0 mt-0.5" />
                <span>{impostazioni.indirizzo}</span>
              </li>
            </ul>
            <p className="text-xs text-white/50 mt-4">
              {t('disponibili247')}
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs text-white/50">
            &copy; {new Date().getFullYear()} Funerix — {t('diritti')}
          </p>
          <p className="text-xs text-white/40">
            {isIt ? contenuti.footerNotaPreventivi : t('notaPreventivi')}
          </p>
        </div>
      </div>
    </footer>
  )
}
