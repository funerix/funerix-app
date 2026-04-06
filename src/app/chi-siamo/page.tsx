'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Shield, Award, Users, MapPin } from 'lucide-react'
import { useTranslations } from 'next-intl'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
}

export default function ChiSiamoPage() {
  const t = useTranslations('chiSiamo')
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-primary py-20 md:py-28 relative overflow-hidden">
        <Image src="/images/sala.jpg" alt="La nostra sede" fill className="object-cover opacity-30" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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
            className="mt-6 text-white/90 text-lg leading-relaxed max-w-2xl mx-auto"
          >
            {t('sottotitolo')}
          </motion.p>
        </div>
      </section>

      {/* Storia */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.h2 variants={fadeUp} custom={0} className="font-[family-name:var(--font-serif)] text-3xl text-primary mb-6">
              {t('storiaTitolo')}
            </motion.h2>
            <motion.div variants={fadeUp} custom={1} className="prose prose-lg text-text-light leading-relaxed space-y-4">
              <p>{t('storiaP1')}</p>
              <p>{t('storiaP2')}</p>
              <p>{t('storiaP3')}</p>
              <p>{t('storiaP4')}</p>
              <p>{t('storiaP5')}</p>
            </motion.div>
          </motion.div>

          {/* Immagini laterali */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden">
              <Image src="/images/chi-siamo-cappella.jpg" alt="Cappella" fill className="object-cover" sizes="250px" />
            </div>
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden mt-8">
              <Image src="/images/chi-siamo-cerimonia.jpg" alt="Cerimonia" fill className="object-cover" sizes="250px" />
            </div>
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden">
              <Image src="/images/chi-siamo-team.jpg" alt="Il nostro team" fill className="object-cover" sizes="250px" />
            </div>
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden mt-8">
              <Image src="/images/chi-siamo-showroom.jpg" alt="Showroom" fill className="object-cover" sizes="250px" />
            </div>
          </motion.div>
          </div>
        </div>
      </section>

      {/* Autorizzazioni */}
      <section className="py-20 bg-background-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeUp} custom={0}
            className="font-[family-name:var(--font-serif)] text-3xl text-primary mb-10 text-center"
          >
            {t('autorizzazioniTitolo')}
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, titolo: t('registroRegionale'), desc: t('registroRegionaleDesc') },
              { icon: Award, titolo: t('conformitaNormativa'), desc: t('conformitaNormativaDesc') },
              { icon: Users, titolo: t('formazioneContinua'), desc: t('formazioneContinuaDesc') },
              { icon: MapPin, titolo: t('coperturaRegionale'), desc: t('coperturaRegionaleDesc') },
            ].map((item, i) => (
              <motion.div
                key={item.titolo}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} custom={i}
                className="card text-center"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-secondary/10 flex items-center justify-center">
                  <item.icon size={22} className="text-secondary" />
                </div>
                <h3 className="font-[family-name:var(--font-serif)] text-lg text-primary mb-2">{item.titolo}</h3>
                <p className="text-text-light text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cosa fare quando */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeUp} custom={0}
            className="font-[family-name:var(--font-serif)] text-3xl text-primary mb-4 text-center"
          >
            {t('cosaDareTitolo')}
          </motion.h2>
          <motion.p
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeUp} custom={1}
            className="text-text-light text-center mb-10 max-w-2xl mx-auto"
          >
            {t('cosaDareDesc')}
          </motion.p>

          <div className="space-y-6">
            {[
              { step: '1', titolo: t('step1Titolo'), desc: t('step1Desc') },
              { step: '2', titolo: t('step2Titolo'), desc: t('step2Desc') },
              { step: '3', titolo: t('step3Titolo'), desc: t('step3Desc') },
              { step: '4', titolo: t('step4Titolo'), desc: t('step4Desc') },
              { step: '5', titolo: t('step5Titolo'), desc: t('step5Desc') },
              { step: '6', titolo: t('step6Titolo'), desc: t('step6Desc') },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} custom={i}
                className="flex gap-5"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-sm">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-serif)] text-lg text-primary mb-1">{item.titolo}</h3>
                  <p className="text-text-light text-sm">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
