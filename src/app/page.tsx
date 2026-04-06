'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Cross, Shield, Clock, ChevronRight, Phone, MessageCircle, Star, ChevronDown, Globe, Plane, PawPrint, Shovel, Euro, ShoppingBag } from 'lucide-react'
import { useSitoStore, type ServiziHomepage } from '@/store/sito'
import type { LucideIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

const iconMap: Record<string, LucideIcon> = { Cross, Plane, PawPrint, Shovel, ShoppingBag, Euro, Globe }
import { useState } from 'react'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' as const },
  }),
}

export default function HomePage() {
  const t = useTranslations('home')
  const { impostazioni, serviziHomepage, faqList, testimonianzeList } = useSitoStore()
  const [faqAperta, setFaqAperta] = useState<number | null>(null)

  const servizi = [
    { href: '/configuratore', img: '/images/card-servizio-funebre.jpg', titolo: t('serv1Titolo'), desc: t('serv1Desc'), icon: Cross },
    { href: '/rimpatri', img: '/images/card-rimpatri.jpg', titolo: t('serv2Titolo'), desc: t('serv2Desc'), icon: Plane },
    { href: '/cremazione-animali', img: '/images/card-cremazione-animali.jpg', titolo: t('serv3Titolo'), desc: t('serv3Desc'), icon: PawPrint },
    { href: '/esumazione', img: '/images/card-esumazione.jpg', titolo: t('serv4Titolo'), desc: t('serv4Desc'), icon: Shovel },
    { href: '/catalogo', img: '/images/card-catalogo.jpg', titolo: t('serv5Titolo'), desc: t('serv5Desc'), icon: ShoppingBag },
    { href: '/prezzi', img: '/images/card-prezzi.jpg', titolo: t('serv6Titolo'), desc: t('serv6Desc'), icon: Euro },
  ]

  const testimonianze = [
    { nome: t('test1Nome'), citta: t('test1Citta'), testo: t('test1Testo'), stelle: 5 },
    { nome: t('test2Nome'), citta: t('test2Citta'), testo: t('test2Testo'), stelle: 5 },
    { nome: t('test3Nome'), citta: t('test3Citta'), testo: t('test3Testo'), stelle: 5 },
  ]

  const faqItems = [
    { domanda: t('faq1D'), risposta: t('faq1R') },
    { domanda: t('faq2D'), risposta: t('faq2R') },
    { domanda: t('faq3D'), risposta: t('faq3R') },
    { domanda: t('faq4D'), risposta: t('faq4R') },
    { domanda: t('faq5D'), risposta: t('faq5R') },
    { domanda: t('faq6D'), risposta: t('faq6R') },
  ]

  // Usa dati da DB se disponibili, altrimenti i tradotti sopra
  const serviziDaMostrare = serviziHomepage.length > 0 ? serviziHomepage : servizi.map((s, i) => ({ ...s, id: String(i), icona: '', immagine: s.img, descrizione: s.desc, ordine: i, attivo: true } as unknown as ServiziHomepage))
  const faqDaMostrare = faqList.length > 0 ? faqList.map(f => ({ domanda: f.domanda, risposta: f.risposta })) : faqItems
  const testimonianzeDaMostrare = testimonianzeList.length > 0 ? testimonianzeList.map(tst => ({ nome: tst.nome, citta: tst.citta, testo: tst.testo, stelle: tst.stelle })) : testimonianze


  return (
    <>
      {/* ═══════════════ 1. HERO ═══════════════ */}
      <section className="relative bg-primary overflow-hidden h-[90vh] min-h-[650px] md:min-h-[550px] max-h-[800px]">
        <Image src="/images/hero-principale.png" alt="" fill className="object-cover opacity-25" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/90 via-primary/70 to-primary-dark/50" />
        <div className="relative h-full flex flex-col justify-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <motion.div initial="hidden" animate="visible" className="max-w-2xl">
            <motion.div variants={fadeUp} custom={0}
              className="inline-flex items-center gap-2 bg-secondary/20 text-secondary-light text-xs px-4 py-2 rounded-full mb-5 backdrop-blur-sm border border-secondary/20">
              <Shield size={14} /> {t('heroBadge')}
            </motion.div>
            <motion.h1 variants={fadeUp} custom={1}
              className="font-[family-name:var(--font-serif)] text-4xl md:text-5xl lg:text-6xl text-white leading-[1.1]">
              {t('heroH1')}<br />
              <span className="text-secondary-light">{t('heroH1Span')}</span>
            </motion.h1>
            <motion.p variants={fadeUp} custom={2}
              className="mt-5 text-base md:text-lg text-white/85 leading-relaxed max-w-xl">
              {t('heroDesc')}
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link href="/configuratore" className="btn-accent text-base py-3.5 px-7">
                {t('heroConfigura')} <ChevronRight size={18} className="ml-2" />
              </Link>
              <a href={`tel:${impostazioni.telefono.replace(/\s/g, '')}`}
                className="btn-secondary border-white/30 text-white hover:bg-white/10 hover:text-white text-base py-3.5 px-7">
                <Phone size={18} className="mr-2" /> {t('ctaChiama')}
              </a>
            </motion.div>
          </motion.div>

          <motion.div variants={fadeUp} custom={4}
            className="absolute bottom-0 left-0 right-0 bg-black/30 backdrop-blur-sm">
            <div className="max-w-6xl mx-auto px-4 py-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {[
                { v: '< 30 min', l: t('statTempo') },
                { v: 'In 5 min', l: t('statPreventivo') },
                { v: '24/7', l: t('statDisponibili') },
                { v: '2.000+', l: t('statFamiglie') },
              ].map(s => (
                <div key={s.l}><p className="text-white font-semibold text-sm">{s.v}</p><p className="text-white/50 text-xs">{s.l}</p></div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ 2. SERVIZI ═══════════════ */}
      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
            <motion.h2 variants={fadeUp} custom={0} className="font-[family-name:var(--font-serif)] text-3xl md:text-4xl text-primary">
              {t('serviziTitolo')}
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="mt-3 text-text-light text-lg">
              {t('portaleDesc')}
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {serviziDaMostrare.map((s, i) => {
              const Icon = iconMap[s.icona || (s as any).icon?.name] || Cross
              const img = s.immagine || (s as any).img || '/images/hero.jpg'
              return (
              <motion.div key={s.href} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <Link href={s.href} className="group block overflow-hidden rounded-xl border border-border bg-surface hover:shadow-md transition-all duration-300 h-full flex flex-col">
                  <div className="relative h-44 overflow-hidden flex-shrink-0">
                    <Image src={img} alt={s.titolo} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 33vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                      <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                        <Icon size={16} className="text-white" />
                      </div>
                      <span className="text-white font-semibold text-sm">{s.titolo}</span>
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <p className="text-text-light text-sm leading-relaxed flex-1">{s.descrizione || (s as any).desc}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-secondary text-sm font-medium group-hover:gap-2 transition-all">
                      {t('scopri')} <ChevronRight size={14} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            )})}
          </div>
        </div>
      </section>

      {/* ═══════════════ 3. COME FUNZIONA ═══════════════ */}
      <section className="py-16 bg-primary text-white relative overflow-hidden">
        <Image src="/images/hero-come-funziona.png" alt="" fill className="object-cover opacity-15" sizes="100vw" />
        <div className="relative max-w-5xl mx-auto px-4">
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-center text-white mb-12">{t('comeFunzionaTitolo')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { n: '01', tKey: 'step1T' as const, dKey: 'step1' as const },
              { n: '02', tKey: 'step2T' as const, dKey: 'step2' as const },
              { n: '03', tKey: 'step3T' as const, dKey: 'step3' as const },
            ].map((s, i) => (
              <motion.div key={s.n} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <span className="font-[family-name:var(--font-serif)] text-5xl font-bold text-white/10">{s.n}</span>
                <h3 className="font-[family-name:var(--font-serif)] text-xl text-white mt-1 mb-2">{t(s.tKey)}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{t(s.dKey)}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/configuratore" className="btn-accent text-base py-3.5 px-8">
              {t('iniziaConfig')} <ChevronRight size={18} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════ 4. PREZZI ═══════════════ */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary">{t('prezziChiari')}</h2>
            <p className="mt-2 text-text-light">{t('prezziPartenza')}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-8">
            {[
              { provincia: 'Napoli', da: '1.350' },
              { provincia: 'Caserta', da: '1.200' },
              { provincia: 'Salerno', da: '1.300' },
              { provincia: 'Avellino', da: '1.100' },
              { provincia: 'Benevento', da: '1.100' },
            ].map(p => (
              <div key={p.provincia} className="card text-center py-5">
                <p className="text-text-muted text-[10px] uppercase tracking-wider">{p.provincia}</p>
                <p className="font-[family-name:var(--font-serif)] text-2xl text-primary font-bold mt-1">&euro; {p.da}</p>
                <p className="text-text-muted text-[10px] mt-0.5">{t('aPartireDa')}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {[
              { servizio: t('cremazione'), da: '1.370' },
              { servizio: t('rimpatrioEuropa'), da: '1.800' },
              { servizio: t('cremazioneAnimaliPrezzo'), da: '120' },
              { servizio: t('esumazionePrezzo'), da: '400' },
            ].map(s => (
              <div key={s.servizio} className="bg-background-dark rounded-xl p-4 text-center">
                <p className="text-text-muted text-xs">{s.servizio}</p>
                <p className="font-[family-name:var(--font-serif)] text-lg text-primary font-bold">da &euro; {s.da}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link href="/prezzi" className="btn-secondary text-sm">
              {t('vediPrezzi')} <ChevronRight size={14} className="ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════ 5. TESTIMONIANZE ═══════════════ */}
      <section className="py-16 bg-background-dark">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary text-center mb-10">
            {t('famiglieAccompagnate')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonianzeDaMostrare.map((tst, i) => (
              <motion.div key={tst.nome} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="card">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: tst.stelle }).map((_, j) => <Star key={j} size={14} className="text-secondary fill-secondary" />)}
                </div>
                <p className="text-text-light text-sm leading-relaxed italic mb-4">&ldquo;{tst.testo}&rdquo;</p>
                <div className="pt-3 border-t border-border">
                  <p className="font-medium text-primary text-sm">{tst.nome}</p>
                  <p className="text-text-muted text-xs">{tst.citta}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ 6. FAQ ═══════════════ */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary text-center mb-10">{t('faqTitolo')}</h2>
          <div className="space-y-2">
            {faqDaMostrare.map((item, i) => (
              <div key={i} className="card cursor-pointer" onClick={() => setFaqAperta(faqAperta === i ? null : i)}>
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-primary text-sm pr-4">{item.domanda}</h3>
                  <ChevronDown size={16} className={`text-secondary flex-shrink-0 transition-transform ${faqAperta === i ? 'rotate-180' : ''}`} />
                </div>
                {faqAperta === i && (
                  <p className="mt-3 text-text-light text-sm leading-relaxed border-t border-border pt-3">{item.risposta}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ 7. CTA FINALE ═══════════════ */}
      <section className="relative py-16 overflow-hidden">
        <Image src="/images/hero-cta-finale.png" alt="" fill className="object-cover opacity-20" sizes="100vw" />
        <div className="absolute inset-0 bg-primary/90" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-white mb-3">{t('ctaTitolo')}</h2>
          <p className="text-white/80 mb-8">{t('disponibili247')}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/configuratore" className="btn-accent text-base py-3.5 px-7">
              {t('ctaConfigura')} <ChevronRight size={18} className="ml-2" />
            </Link>
            <a href={`tel:${impostazioni.telefono.replace(/\s/g, '')}`}
              className="btn-secondary border-white/30 text-white hover:bg-white/10 hover:text-white text-base py-3.5 px-7">
              <Phone size={18} className="mr-2" /> {impostazioni.telefono}
            </a>
            <a href={`https://wa.me/${impostazioni.whatsapp.replace(/\s/g, '')}`} target="_blank" rel="noopener noreferrer"
              className="btn-secondary border-[#25D366]/50 text-[#25D366] hover:bg-[#25D366]/10 text-base py-3.5 px-7">
              <MessageCircle size={18} className="mr-2" /> WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* WhatsApp Floating */}
      <a href={`https://wa.me/${impostazioni.whatsapp.replace(/\s/g, '')}?text=Buongiorno%2C%20avrei%20bisogno%20di%20assistenza`}
        target="_blank" rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all"
        aria-label="WhatsApp">
        <MessageCircle size={26} className="text-white" />
      </a>
    </>
  )
}
