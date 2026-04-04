'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Cross, Shield, Clock, ChevronRight, Phone, MessageCircle, Star, ChevronDown, Globe, Plane, PawPrint, Shovel, Euro, ShoppingBag } from 'lucide-react'
import { useSitoStore, type ServiziHomepage } from '@/store/sito'
import type { LucideIcon } from 'lucide-react'

const iconMap: Record<string, LucideIcon> = { Cross, Plane, PawPrint, Shovel, ShoppingBag, Euro, Globe }
import { useState } from 'react'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' as const },
  }),
}

const servizi = [
  { href: '/configuratore', img: '/images/card-servizio-funebre.jpg', titolo: 'Servizio Funebre', desc: 'Configurate il funerale online. Preventivo immediato, nessun obbligo.', icon: Cross },
  { href: '/rimpatri', img: '/images/card-rimpatri.jpg', titolo: 'Rimpatri ed Espatri', desc: 'Trasporto internazionale salme da e verso qualsiasi paese del mondo.', icon: Plane },
  { href: '/cremazione-animali', img: '/images/card-cremazione-animali.jpg', titolo: 'Cremazione Animali', desc: 'Un ultimo saluto dignitoso per il vostro compagno di vita.', icon: PawPrint },
  { href: '/esumazione', img: '/images/card-esumazione.jpg', titolo: 'Esumazione', desc: 'Trasferimento resti, ricollocazione e cremazione resti.', icon: Shovel },
  { href: '/catalogo', img: '/images/card-catalogo.jpg', titolo: 'Catalogo', desc: 'Bare, urne, fiori, auto funebri e servizi aggiuntivi.', icon: ShoppingBag },
  { href: '/prezzi', img: '/images/card-prezzi.jpg', titolo: 'Prezzi', desc: 'Trasparenza totale. Confrontate i costi per provincia.', icon: Euro },
]

const testimonianze = [
  { nome: 'Famiglia Esposito', citta: 'Napoli', testo: 'In un momento così difficile, avere la possibilità di organizzare tutto online è stato fondamentale. Il consulente ci ha seguito con delicatezza straordinaria.', stelle: 5 },
  { nome: 'Famiglia De Luca', citta: 'Caserta', testo: 'Trasparenza totale sui prezzi, nessuna sorpresa. Ci hanno accompagnato dalla prima telefonata fino alla cerimonia.', stelle: 5 },
  { nome: 'Famiglia Romano', citta: 'Salerno', testo: 'Il memorial online per nostro padre è un regalo meraviglioso. Parenti da tutto il mondo hanno potuto lasciare un pensiero.', stelle: 5 },
]

const faq = [
  { domanda: 'Il preventivo online è vincolante?', risposta: 'No, il preventivo è puramente indicativo e non costituisce proposta contrattuale. Il prezzo definitivo viene concordato con il consulente.' },
  { domanda: 'In quanto tempo vengo contattato?', risposta: 'Un nostro consulente vi contatterà entro 30 minuti dall\'invio della richiesta, 24 ore su 24, 7 giorni su 7.' },
  { domanda: 'Quali zone coprite?', risposta: 'Operiamo in tutta la Campania e per i rimpatri/espatri in tutto il mondo.' },
  { domanda: 'Posso modificare il servizio dopo la richiesta?', risposta: 'Assolutamente sì. La configurazione è un punto di partenza, il consulente personalizzerà tutto.' },
  { domanda: 'Offrite cremazione per animali?', risposta: 'Sì, offriamo cremazione individuale e collettiva per cani, gatti e altri animali domestici.' },
  { domanda: 'Come funziona il rimpatrio salme?', risposta: 'Ci occupiamo di tutto: documentazione, consolati, trasporto aereo e consegna. Assistenza 24/7.' },
]

const prezziRapidi = [
  { provincia: 'Napoli', da: '1.350', tipo: 'Funerale economico' },
  { provincia: 'Caserta', da: '1.200', tipo: 'Funerale economico' },
  { provincia: 'Salerno', da: '1.300', tipo: 'Funerale economico' },
  { provincia: 'Avellino', da: '1.100', tipo: 'Funerale economico' },
  { provincia: 'Benevento', da: '1.100', tipo: 'Funerale economico' },
]

export default function HomePage() {
  const { contenuti, impostazioni, serviziHomepage, faqList, testimonianzeList } = useSitoStore()

  // Fallback se DB vuoto
  const serviziDaMostrare = serviziHomepage.length > 0 ? serviziHomepage : servizi.map((s, i) => ({ ...s, id: String(i), icona: '', immagine: s.img, descrizione: s.desc, ordine: i, attivo: true } as unknown as ServiziHomepage))
  const faqDaMostrare = faqList.length > 0 ? faqList.map(f => ({ domanda: f.domanda, risposta: f.risposta })) : faq
  const testimonianzeDaMostrare = testimonianzeList.length > 0 ? testimonianzeList.map(t => ({ nome: t.nome, citta: t.citta, testo: t.testo, stelle: t.stelle })) : testimonianze
  const [faqAperta, setFaqAperta] = useState<number | null>(null)

  return (
    <>
      {/* ═══════════════ 1. HERO ═══════════════ */}
      <section className="relative bg-primary overflow-hidden h-[80vh] min-h-[550px] max-h-[700px]">
        <Image src="/images/hero-principale.png" alt="" fill className="object-cover opacity-25" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/90 via-primary/70 to-primary-dark/50" />
        <div className="relative h-full flex flex-col justify-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" animate="visible" className="max-w-2xl">
            <motion.div variants={fadeUp} custom={0}
              className="inline-flex items-center gap-2 bg-secondary/20 text-secondary-light text-xs px-4 py-2 rounded-full mb-5 backdrop-blur-sm border border-secondary/20">
              <Shield size={14} /> Dal 1920 al servizio delle famiglie — Registro Regionale Campania
            </motion.div>
            <motion.h1 variants={fadeUp} custom={1}
              className="font-[family-name:var(--font-serif)] text-4xl md:text-5xl lg:text-6xl text-white leading-[1.1]">
              La prima agenzia funebre<br />
              <span className="text-secondary-light">digitale in Italia</span>
            </motion.h1>
            <motion.p variants={fadeUp} custom={2}
              className="mt-5 text-base md:text-lg text-white/85 leading-relaxed max-w-xl">
              Configurate il servizio funebre online in 5 minuti. Prezzi trasparenti, consulente dedicato entro 30 minuti, assistenza 24/7.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link href="/configuratore" className="btn-accent text-base py-3.5 px-7">
                {contenuti.heroBottone} <ChevronRight size={18} className="ml-2" />
              </Link>
              <a href={`tel:${impostazioni.telefono.replace(/\s/g, '')}`}
                className="btn-secondary border-white/30 text-white hover:bg-white/10 hover:text-white text-base py-3.5 px-7">
                <Phone size={18} className="mr-2" /> Chiama Ora
              </a>
            </motion.div>
          </motion.div>

          {/* Stats in basso */}
          <motion.div variants={fadeUp} custom={4}
            className="absolute bottom-0 left-0 right-0 bg-black/30 backdrop-blur-sm">
            <div className="max-w-6xl mx-auto px-4 py-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {[
                { v: '< 30 min', l: 'Tempo di risposta' },
                { v: 'In 5 minuti', l: 'Preventivo online' },
                { v: '24/7', l: 'Sempre disponibili' },
                { v: 'Oltre 2.000', l: 'Famiglie assistite' },
              ].map(s => (
                <div key={s.l}><p className="text-white font-semibold text-sm">{s.v}</p><p className="text-white/50 text-xs">{s.l}</p></div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ 2. SERVIZI — 6 card cliccabili ═══════════════ */}
      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
            <motion.h2 variants={fadeUp} custom={0} className="font-[family-name:var(--font-serif)] text-3xl md:text-4xl text-primary">
              I nostri servizi
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="mt-3 text-text-light text-lg">
              Un portale completo a 360 gradi per ogni esigenza
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {serviziDaMostrare.map((s, i) => {
              const Icon = iconMap[s.icona || (s as any).icon?.name] || Cross
              const img = s.immagine || (s as any).img || '/images/hero.jpg'
              const href = s.href
              return (
              <motion.div key={href} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <Link href={href} className="group block overflow-hidden rounded-xl border border-border bg-surface hover:shadow-md transition-all duration-300 h-full flex flex-col">
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
                      Scopri <ChevronRight size={14} />
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
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-center text-white mb-12">Come funziona</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { n: '01', t: 'Configurate online', d: 'Scegliete tipo di servizio, prodotti e dettagli. Ricevete un preventivo indicativo in 5 minuti.' },
              { n: '02', t: 'Vi contattiamo noi', d: 'Un consulente dedicato vi chiama entro 30 minuti per accompagnarvi in ogni dettaglio.' },
              { n: '03', t: 'Ci occupiamo di tutto', d: 'Dalla burocrazia alla cerimonia, gestiamo ogni aspetto con cura e rispetto.' },
            ].map((s, i) => (
              <motion.div key={s.n} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <span className="font-[family-name:var(--font-serif)] text-5xl font-bold text-white/10">{s.n}</span>
                <h3 className="font-[family-name:var(--font-serif)] text-xl text-white mt-1 mb-2">{s.t}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{s.d}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/configuratore" className="btn-accent text-base py-3.5 px-8">
              Inizia la Configurazione <ChevronRight size={18} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════ 4. PREZZI RAPIDI ═══════════════ */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary">Prezzi chiari, senza sorprese</h2>
            <p className="mt-2 text-text-light">Funerale completo a partire da — per provincia</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-8">
            {prezziRapidi.map(p => (
              <div key={p.provincia} className="card text-center py-5">
                <p className="text-text-muted text-[10px] uppercase tracking-wider">{p.provincia}</p>
                <p className="font-[family-name:var(--font-serif)] text-2xl text-primary font-bold mt-1">
                  &euro; {p.da}
                </p>
                <p className="text-text-muted text-[10px] mt-0.5">a partire da</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {[
              { servizio: 'Cremazione', da: '1.370' },
              { servizio: 'Rimpatrio Europa', da: '1.800' },
              { servizio: 'Cremazione animali', da: '120' },
              { servizio: 'Esumazione', da: '400' },
            ].map(s => (
              <div key={s.servizio} className="bg-background-dark rounded-xl p-4 text-center">
                <p className="text-text-muted text-xs">{s.servizio}</p>
                <p className="font-[family-name:var(--font-serif)] text-lg text-primary font-bold">da &euro; {s.da}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link href="/prezzi" className="btn-secondary text-sm">
              Vedi tutti i prezzi dettagliati <ChevronRight size={14} className="ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════ 5. TESTIMONIANZE ═══════════════ */}
      <section className="py-16 bg-background-dark">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary text-center mb-10">
            Le famiglie che abbiamo accompagnato
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonianzeDaMostrare.map((t, i) => (
              <motion.div key={t.nome} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="card">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.stelle }).map((_, j) => <Star key={j} size={14} className="text-secondary fill-secondary" />)}
                </div>
                <p className="text-text-light text-sm leading-relaxed italic mb-4">&ldquo;{t.testo}&rdquo;</p>
                <div className="pt-3 border-t border-border">
                  <p className="font-medium text-primary text-sm">{t.nome}</p>
                  <p className="text-text-muted text-xs">{t.citta}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ 6. FAQ ═══════════════ */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary text-center mb-10">Domande frequenti</h2>
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
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-white mb-3">
            Avete bisogno di assistenza?
          </h2>
          <p className="text-white/80 mb-8">
            Siamo disponibili 24 ore su 24, 7 giorni su 7. Configurate online o chiamateci.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/configuratore" className="btn-accent text-base py-3.5 px-7">
              Configura il Servizio <ChevronRight size={18} className="ml-2" />
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
