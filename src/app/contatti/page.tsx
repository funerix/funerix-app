'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react'
import { useSitoStore } from '@/store/sito'
import { useState } from 'react'
import { useTranslations } from 'next-intl'

export default function ContattiPage() {
  const t = useTranslations('contatti')
  const { impostazioni } = useSitoStore()
  const [inviato, setInviato] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary py-16 md:py-24 relative overflow-hidden">
        <Image src="/images/fiori-bianchi.jpg" alt="" fill className="object-cover opacity-25" sizes="100vw" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-[family-name:var(--font-serif)] text-4xl md:text-5xl text-white"
          >
            {t('titolo')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-white/90 text-lg"
          >
            {t('sottotitolo')}
          </motion.p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Info contatto */}
            <div className="space-y-6">
              {[
                { icon: Phone, label: t('telefono'), value: impostazioni.telefono, href: `tel:${impostazioni.telefono.replace(/\s/g, '')}` },
                { icon: MessageCircle, label: t('whatsapp'), value: impostazioni.whatsapp, href: `https://wa.me/${impostazioni.whatsapp.replace(/\s/g, '')}` },
                { icon: Mail, label: t('email'), value: impostazioni.email, href: `mailto:${impostazioni.email}` },
                { icon: MapPin, label: t('sede'), value: impostazioni.indirizzo, href: undefined },
                { icon: Clock, label: t('orariUfficio'), value: `${impostazioni.orari}\n${t('reperibilita')}`, href: undefined },
              ].map((item) => (
                <div key={item.label} className="card flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                    <item.icon size={18} className="text-secondary" />
                  </div>
                  <div>
                    <span className="text-xs text-text-muted uppercase tracking-wider">{item.label}</span>
                    {item.href ? (
                      <a href={item.href} className="block text-primary font-medium hover:text-secondary transition-colors whitespace-pre-line">
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-primary font-medium whitespace-pre-line">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Form contatto */}
            <div className="lg:col-span-2">
              <div className="card">
                <h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-6">
                  {t('scriveciMessaggio')}
                </h2>

                {inviato ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                      <Mail size={28} className="text-accent" />
                    </div>
                    <h3 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-2">{t('messaggioInviato')}</h3>
                    <p className="text-text-light">{t('messaggioInviatoDesc')}</p>
                  </motion.div>
                ) : (
                  <form
                    onSubmit={(e) => { e.preventDefault(); setInviato(true) }}
                    className="space-y-5"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-text mb-1">{t('nomeCognome')}</label>
                        <input type="text" required className="input-field" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text mb-1">{t('telefono2')}</label>
                        <input type="tel" required className="input-field" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text mb-1">{t('email2')}</label>
                        <input type="email" className="input-field" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text mb-1">{t('oggetto')}</label>
                        <select className="input-field">
                          <option>{t('richiestaInformazioni')}</option>
                          <option>{t('richiestaPreventivo')}</option>
                          <option>{t('assistenzaInCorso')}</option>
                          <option>{t('memorialOnline')}</option>
                          <option>{t('altro')}</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text mb-1">{t('messaggio')}</label>
                      <textarea rows={5} required className="input-field" />
                    </div>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" required className="w-5 h-5 mt-0.5 rounded border-border" />
                      <span className="text-sm text-text-light">
                        {t('gdprConsento')}
                      </span>
                    </label>
                    <button type="submit" className="btn-primary w-full py-4">
                      {t('inviaMessaggio')}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
