'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Shield, Clock, Lock, Heart, ChevronRight, Phone, Check, Euro, Calendar, Users } from 'lucide-react'
import { useState } from 'react'
import { useTranslations } from 'next-intl'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' as const } }),
}

export default function PrevidenzaPage() {
  const t = useTranslations('previdenza')
  const [rate, setRate] = useState(36)
  const totaleEsempio = 5000
  const rataMensile = Math.ceil(totaleEsempio / rate)

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative bg-primary py-20 md:py-28 overflow-hidden">
        <Image src="/images/hero-principale.png" alt="" fill className="object-cover opacity-15" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/90 to-primary/70" />
        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <motion.div initial="hidden" animate="visible">
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 bg-secondary/20 text-secondary-light text-xs px-4 py-2 rounded-full mb-5 border border-secondary/20">
              <Shield size={14} /> {t('badgeFondi')}
            </motion.div>
            <motion.h1 variants={fadeUp} custom={1} className="font-[family-name:var(--font-serif)] text-4xl md:text-5xl text-white leading-tight">
              {t('titolo')}
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="mt-4 text-xl text-secondary-light font-medium">
              {t('sottotitoloAccento')}
            </motion.p>
            <motion.p variants={fadeUp} custom={3} className="mt-4 text-white/80 text-lg max-w-2xl mx-auto">
              {t('sottotitolo')}
            </motion.p>
            <motion.div variants={fadeUp} custom={4} className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/configuratore?tipo=previdenza" className="btn-accent text-base py-4 px-8">
                {t('configuraPiano')} <ChevronRight size={18} className="ml-2" />
              </Link>
              <a href="tel:+390815551234" className="btn-secondary border-white/30 text-white hover:bg-white/10 hover:text-white text-base py-4 px-8">
                <Phone size={18} className="mr-2" /> {t('parlaConsulente')}
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Simulatore rate */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary text-center mb-4">{t('simulatoreTitolo')}</h2>
          <p className="text-text-light text-center mb-10">{t('simulatoreDesc')}</p>

          <div className="card p-8">
            <div className="text-center mb-8">
              <p className="text-text-muted text-sm">{t('esempiServizio')}</p>
              <p className="font-[family-name:var(--font-serif)] text-4xl text-primary font-bold">&euro; {totaleEsempio.toLocaleString('it-IT')}</p>
            </div>

            <div className="mb-8">
              <div className="flex justify-between text-sm text-text-muted mb-2">
                <span>{t('mesi12')}</span>
                <span>{rate} {t('mesi')}</span>
                <span>{t('mesi60')}</span>
              </div>
              <input
                type="range" min={12} max={60} step={6} value={rate}
                onChange={e => setRate(Number(e.target.value))}
                className="w-full h-2 bg-border rounded-full appearance-none cursor-pointer accent-secondary"
              />
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-background rounded-xl p-4">
                <p className="text-text-muted text-xs">{t('rate')}</p>
                <p className="font-[family-name:var(--font-serif)] text-2xl text-primary font-bold">{rate}</p>
                <p className="text-text-muted text-xs">{t('mesi')}</p>
              </div>
              <div className="bg-secondary/10 rounded-xl p-4">
                <p className="text-secondary text-xs font-medium">{t('alMese')}</p>
                <p className="font-[family-name:var(--font-serif)] text-2xl text-secondary font-bold">&euro; {rataMensile}</p>
                <p className="text-secondary/60 text-xs">{t('alMese').toLowerCase()}</p>
              </div>
              <div className="bg-background rounded-xl p-4">
                <p className="text-text-muted text-xs">{t('durata')}</p>
                <p className="font-[family-name:var(--font-serif)] text-2xl text-primary font-bold">{Math.ceil(rate / 12)}</p>
                <p className="text-text-muted text-xs">{rate <= 12 ? t('anno') : t('anni')}</p>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link href="/configuratore?tipo=previdenza" className="btn-primary">
                {t('configuraPianoPersonalizzato')} <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Come funziona */}
      <section className="py-16 bg-background-dark">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary text-center mb-12">{t('comeFunzionaTitolo')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { n: '01', icon: Heart, t: t('cf1Titolo'), d: t('cf1Desc') },
              { n: '02', icon: Calendar, t: t('cf2Titolo'), d: t('cf2Desc') },
              { n: '03', icon: Euro, t: t('cf3Titolo'), d: t('cf3Desc') },
              { n: '04', icon: Shield, t: t('cf4Titolo'), d: t('cf4Desc') },
            ].map((s, i) => (
              <motion.div key={s.n} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-secondary/10 flex items-center justify-center">
                  <s.icon size={24} className="text-secondary" />
                </div>
                <span className="text-secondary/30 font-[family-name:var(--font-serif)] text-3xl font-bold">{s.n}</span>
                <h3 className="font-[family-name:var(--font-serif)] text-lg text-primary mt-1 mb-2">{s.t}</h3>
                <p className="text-text-muted text-sm">{s.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Garanzie */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary text-center mb-10">{t('garanzieTitolo')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Lock, t: t('fondiProtettiTitolo'), d: t('fondiProtettiDesc') },
              { icon: Shield, t: t('prezzoBloccatoTitolo'), d: t('prezzoBloccatoDesc') },
              { icon: Users, t: t('trasferibileTitolo'), d: t('trasferibleDesc') },
            ].map((g, i) => (
              <motion.div key={g.t} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="card text-center">
                <g.icon size={28} className="mx-auto mb-3 text-accent" />
                <h3 className="font-[family-name:var(--font-serif)] text-lg text-primary mb-2">{g.t}</h3>
                <p className="text-text-muted text-sm">{g.d}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-8 card bg-primary/5 border-primary/10">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <Shield size={32} className="text-accent flex-shrink-0" />
              <div>
                <h3 className="font-medium text-primary">{t('dirittoDiRecessoTitolo')}</h3>
                <p className="text-text-muted text-sm">{t('dirittoDiRecessoDesc')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Per chi */}
      <section className="py-16 bg-background-dark">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary text-center mb-10">{t('perChiTitolo')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">{t('perVoiTitolo')}</h3>
              <p className="text-text-light text-sm mb-4">{t('perVoiDesc')}</p>
              <ul className="space-y-2">{[t('perVoi1'), t('perVoi2'), t('perVoi3'), t('perVoi4')].map(item=>
                <li key={item} className="flex gap-2 text-sm text-text-light"><Check size={14} className="text-accent mt-0.5 flex-shrink-0" />{item}</li>
              )}</ul>
            </div>
            <div className="card">
              <h3 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">{t('perFamiliareTitolo')}</h3>
              <p className="text-text-light text-sm mb-4">{t('perFamiliareDesc')}</p>
              <ul className="space-y-2">{[t('perFamiliare1'), t('perFamiliare2'), t('perFamiliare3'), t('perFamiliare4')].map(item=>
                <li key={item} className="flex gap-2 text-sm text-text-light"><Check size={14} className="text-accent mt-0.5 flex-shrink-0" />{item}</li>
              )}</ul>
            </div>
          </div>
        </div>
      </section>

      {/* RSA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary mb-4">{t('rsaTitolo')}</h2>
          <p className="text-text-light mb-6 max-w-xl mx-auto">
            {t('rsaDesc')}
          </p>
          <Link href="/convenzioni" className="btn-secondary">{t('scopriConvenzione')} <ChevronRight size={14} className="ml-1" /></Link>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-white mb-4">{t('ctaTitolo')}</h2>
          <p className="text-white/80 mb-8">{t('ctaDesc')}</p>
          <Link href="/configuratore?tipo=previdenza" className="btn-accent text-lg py-4 px-10">
            {t('configuraPiano')} <ChevronRight size={18} className="ml-2" />
          </Link>
        </div>
      </section>
    </div>
  )
}
