'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Heart, QrCode, MessageCircle, ImageIcon, Gift, Search, Calendar } from 'lucide-react'
import { useSitoStore } from '@/store/sito'
import { useState } from 'react'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
}

// I necrologi vengono dallo store globale (gestiti dall'admin)

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('it-IT', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

export default function MemorialPage() {
  const { memorial } = useSitoStore()
  const [ricerca, setRicerca] = useState('')

  const necrologi = memorial.filter(m => m.attivo).map(m => ({
    ...m,
    messaggiCount: m.messaggi.length,
    bio: m.biografia,
  }))

  const necrologiFiltrati = necrologi.filter(n =>
    n.nome.toLowerCase().includes(ricerca.toLowerCase()) ||
    n.comune.toLowerCase().includes(ricerca.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-primary py-20 md:py-28 relative overflow-hidden">
        <Image src="/images/candele.jpg" alt="" fill className="object-cover opacity-25" sizes="100vw" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Heart size={40} className="mx-auto mb-6 text-secondary-light" />
            <h1 className="font-[family-name:var(--font-serif)] text-4xl md:text-5xl text-white">
              Necrologi e Memorial
            </h1>
            <p className="mt-6 text-white/90 text-lg leading-relaxed max-w-2xl mx-auto">
              Uno spazio per onorare e ricordare chi non c&apos;&egrave; pi&ugrave;.
              Lasciate un pensiero, una condoglianza o un ricordo per i vostri cari.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Necrologi — Elenco pubblico */}
      <section className="py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <div>
              <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary">
                Necrologi recenti
              </h2>
              <p className="text-text-light mt-1">
                Lasciate un messaggio di cordoglio per i defunti assistiti dalla nostra impresa.
              </p>
            </div>
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Cerca per nome o comune..."
                className="input-field pl-10 w-full md:w-72"
                value={ricerca}
                onChange={(e) => setRicerca(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            {necrologiFiltrati.map((necrologio, i) => (
              <motion.div
                key={necrologio.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
              >
                <Link href={`/memorial/${necrologio.id}`} className="block">
                  <div className="card group">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      {/* Foto defunto */}
                      <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary/10 relative overflow-hidden ring-2 ring-border">
                        {necrologio.foto ? (
                          <Image src={necrologio.foto} alt={necrologio.nome} fill className="object-cover" sizes="64px" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Heart size={24} className="text-secondary" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-[family-name:var(--font-serif)] text-xl text-primary group-hover:text-secondary transition-colors">
                          {necrologio.nome}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-text-muted">
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {formatDate(necrologio.dataNascita)} — {formatDate(necrologio.dataMorte)}
                          </span>
                          <span>{necrologio.comune}</span>
                        </div>
                        <p className="text-text-light text-sm mt-2 line-clamp-2">{necrologio.bio}</p>
                      </div>

                      {/* Messaggi count */}
                      <div className="flex-shrink-0 text-center md:text-right">
                        <div className="inline-flex items-center gap-1.5 bg-background-dark rounded-full px-3 py-1.5">
                          <MessageCircle size={14} className="text-secondary" />
                          <span className="text-sm font-medium text-primary">{necrologio.messaggiCount}</span>
                        </div>
                        <p className="text-xs text-text-muted mt-1">condoglianze</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}

            {necrologiFiltrati.length === 0 && (
              <div className="text-center py-12 text-text-muted">
                <Search size={32} className="mx-auto mb-3 opacity-30" />
                <p>Nessun risultato per &ldquo;{ricerca}&rdquo;</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Come funziona */}
      <section className="py-16 md:py-20 bg-background-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary">
              Come funziona il Memorial
            </h2>
            <p className="text-text-light mt-2">
              Ogni defunto assistito dalla nostra impresa pu&ograve; avere una pagina memorial dedicata.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: QrCode,
                titolo: 'QR Code',
                desc: 'Un codice QR unico da stampare su lapide, santino o manifesto funebre.',
              },
              {
                icon: MessageCircle,
                titolo: 'Condoglianze',
                desc: 'Chiunque pu\u00f2 lasciare un messaggio di cordoglio, anche da lontano.',
              },
              {
                icon: ImageIcon,
                titolo: 'Foto e ricordi',
                desc: 'Una galleria di immagini condivise da chi ha conosciuto il defunto.',
              },
              {
                icon: Gift,
                titolo: 'Donazioni in memoria',
                desc: 'Possibilit\u00e0 di indicare un\'associazione per offerte in memoria.',
              },
            ].map((item, i) => (
              <motion.div
                key={item.titolo}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="card text-center"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-secondary/10 flex items-center justify-center">
                  <item.icon size={24} className="text-secondary" />
                </div>
                <h3 className="font-[family-name:var(--font-serif)] text-lg text-primary mb-2">{item.titolo}</h3>
                <p className="text-text-light text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary mb-4">
            Desiderate un memorial per il vostro caro?
          </h2>
          <p className="text-text-light mb-8 max-w-xl mx-auto">
            Il memorial online &egrave; incluso come servizio aggiuntivo nel configuratore,
            oppure potete richiederlo contattandoci direttamente.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/configuratore" className="btn-primary">
              Vai al configuratore
            </Link>
            <Link href="/contatti" className="btn-secondary">
              Contattaci
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
