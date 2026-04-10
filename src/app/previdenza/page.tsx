'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Shield, Clock, Lock, Heart, ChevronRight, Phone, Check, Euro, Calendar, Users } from 'lucide-react'
import { useState } from 'react'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' as const } }),
}

export default function PrevidenzaPage() {
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
              <Shield size={14} /> Fondi protetti su conto dedicato separato
            </motion.div>
            <motion.h1 variants={fadeUp} custom={1} className="font-[family-name:var(--font-serif)] text-4xl md:text-5xl text-white leading-tight">
              Previdenza Funerix
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="mt-4 text-xl text-secondary-light font-medium">
              Pianificate oggi, vivete sereni
            </motion.p>
            <motion.p variants={fadeUp} custom={3} className="mt-4 text-white/80 text-lg max-w-2xl mx-auto">
              Configurate il servizio funebre per voi o per un familiare, bloccate il prezzo
              e pagate comodamente a rate mensili. Quando il momento arriver&agrave;,
              tutto sar&agrave; gi&agrave; organizzato.
            </motion.p>
            <motion.div variants={fadeUp} custom={4} className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/previdenza/configuratore" className="btn-accent text-base py-4 px-8">
                Configura il tuo piano <ChevronRight size={18} className="ml-2" />
              </Link>
              <a href="tel:+390815551234" className="btn-secondary border-white/30 text-white hover:bg-white/10 hover:text-white text-base py-4 px-8">
                <Phone size={18} className="mr-2" /> Parla con un consulente
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Simulatore rate */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary text-center mb-4">Quanto costa al mese?</h2>
          <p className="text-text-light text-center mb-10">Simulate il costo mensile per un servizio funebre completo</p>

          <div className="card p-8">
            <div className="text-center mb-8">
              <p className="text-text-muted text-sm">Esempio servizio funebre completo</p>
              <p className="font-[family-name:var(--font-serif)] text-4xl text-primary font-bold">&euro; {totaleEsempio.toLocaleString('it-IT')}</p>
            </div>

            <div className="mb-8">
              <div className="flex justify-between text-sm text-text-muted mb-2">
                <span>12 mesi</span>
                <span>{rate} mesi</span>
                <span>60 mesi</span>
              </div>
              <input
                type="range" min={12} max={60} step={6} value={rate}
                onChange={e => setRate(Number(e.target.value))}
                className="w-full h-2 bg-border rounded-full appearance-none cursor-pointer accent-secondary"
              />
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-background rounded-xl p-4">
                <p className="text-text-muted text-xs">Rate</p>
                <p className="font-[family-name:var(--font-serif)] text-2xl text-primary font-bold">{rate}</p>
                <p className="text-text-muted text-xs">mesi</p>
              </div>
              <div className="bg-secondary/10 rounded-xl p-4">
                <p className="text-secondary text-xs font-medium">Al mese</p>
                <p className="font-[family-name:var(--font-serif)] text-2xl text-secondary font-bold">&euro; {rataMensile}</p>
                <p className="text-secondary/60 text-xs">al mese</p>
              </div>
              <div className="bg-background rounded-xl p-4">
                <p className="text-text-muted text-xs">Durata</p>
                <p className="font-[family-name:var(--font-serif)] text-2xl text-primary font-bold">{Math.ceil(rate / 12)}</p>
                <p className="text-text-muted text-xs">{rate <= 12 ? 'anno' : 'anni'}</p>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link href="/previdenza/configuratore" className="btn-primary">
                Configura il tuo piano personalizzato <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Come funziona */}
      <section className="py-16 bg-background-dark">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary text-center mb-12">Come funziona</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { n: '01', icon: Heart, t: 'Configurate', d: 'Scegliete ogni dettaglio del servizio: bara, fiori, cerimonia, trasporto.' },
              { n: '02', icon: Calendar, t: 'Scegliete il piano', d: 'Da 12 a 60 rate mensili. Prezzo bloccato per sempre.' },
              { n: '03', icon: Euro, t: 'Pagate a rate', d: 'Addebito automatico mensile su carta o conto corrente.' },
              { n: '04', icon: Shield, t: 'Vivete sereni', d: 'Quando il momento arriva, tutto è già organizzato e pagato.' },
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
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary text-center mb-10">Le nostre garanzie</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Lock, t: 'Fondi protetti', d: 'I versamenti sono depositati su un conto bancario dedicato e separato, non aggredibile. Rimborsabili in qualsiasi momento.' },
              { icon: Shield, t: 'Prezzo bloccato', d: 'Il prezzo che configurate oggi resta invariato per tutta la durata del piano, indipendentemente dall\'inflazione.' },
              { icon: Users, t: 'Trasferibile', d: 'Il piano può essere trasferito a un altro familiare o modificato in qualsiasi momento senza costi aggiuntivi.' },
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
                <h3 className="font-medium text-primary">Diritto di recesso</h3>
                <p className="text-text-muted text-sm">Potete annullare il piano in qualsiasi momento. Entro 14 giorni: rimborso totale. Dopo 14 giorni: rimborso del versato meno 5% di spese amministrative.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Per chi */}
      <section className="py-16 bg-background-dark">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary text-center mb-10">Per chi &egrave; pensato</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="font-[family-name:var(--font-serif)] text-lg text-primary mb-3">Per voi stessi</h3>
              <p className="text-text-light text-sm mb-4">Decidete oggi come volete essere ricordati, senza lasciare il peso delle scelte e delle spese ai vostri cari.</p>
              <ul className="space-y-2">{['Scegliete ogni dettaglio con calma','Il prezzo non aumenterà mai','La vostra famiglia non dovrà decidere nulla','Potete modificare le scelte in qualsiasi momento'].map(t=>
                <li key={t} className="flex gap-2 text-sm text-text-light"><Check size={14} className="text-accent mt-0.5 flex-shrink-0" />{t}</li>
              )}</ul>
            </div>
            <div className="card">
              <h3 className="font-[family-name:var(--font-serif)] text-lg text-primary mb-3">Per un familiare</h3>
              <p className="text-text-light text-sm mb-4">Organizzate in anticipo per un genitore anziano o un familiare, garantendogli il servizio che merita.</p>
              <ul className="space-y-2">{['Ideale per genitori anziani','Perfetto per ospiti di RSA e case di cura','Nessuna decisione da prendere nel dolore','Il servizio è garantito qualsiasi cosa accada'].map(t=>
                <li key={t} className="flex gap-2 text-sm text-text-light"><Check size={14} className="text-accent mt-0.5 flex-shrink-0" />{t}</li>
              )}</ul>
            </div>
          </div>
        </div>
      </section>

      {/* RSA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary mb-4">Sei una RSA o casa di cura?</h2>
          <p className="text-text-light mb-6 max-w-xl mx-auto">
            Offri ai familiari dei tuoi ospiti la tranquillit&agrave; di un piano previdenza funeraria.
            Diventa partner convenzionato Funerix.
          </p>
          <Link href="/convenzioni" className="btn-secondary">Scopri la convenzione <ChevronRight size={14} className="ml-1" /></Link>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-white mb-4">Iniziate oggi</h2>
          <p className="text-white/80 mb-8">Configurate il piano in 5 minuti. Un consulente vi contatter&agrave; entro 30 minuti.</p>
          <Link href="/previdenza/configuratore" className="btn-accent text-lg py-4 px-10">
            Configura il tuo piano <ChevronRight size={18} className="ml-2" />
          </Link>
        </div>
      </section>
    </div>
  )
}
