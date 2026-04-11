'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Shield, Award, Users, MapPin } from 'lucide-react'
import { useSitoStore } from '@/store/sito'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
}

export default function ChiSiamoPage() {
  const { contenuti } = useSitoStore()
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-primary py-20 md:py-28 relative overflow-hidden">
        <Image src="/images/hero-principale.png" alt="" fill className="object-cover opacity-20" sizes="100vw" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-[family-name:var(--font-serif)] text-4xl md:text-5xl text-white"
          >
            {contenuti.chiSiamoTitolo || 'Chi Siamo'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-white/90 text-lg leading-relaxed max-w-2xl mx-auto"
          >
            {contenuti.chiSiamoSottotitolo || 'Da oltre trent\'anni al fianco delle famiglie campane, con professionalità, rispetto e dedizione in ogni momento.'}
          </motion.p>
        </div>
      </section>

      {/* Storia */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.h2 variants={fadeUp} custom={0} className="font-[family-name:var(--font-serif)] text-3xl text-primary mb-6">
              La nostra storia
            </motion.h2>
            <motion.div variants={fadeUp} custom={1} className="prose prose-lg text-text-light leading-relaxed space-y-4">
              <p>
                <strong className="text-primary">Dal 1920</strong>, la nostra famiglia si dedica con passione e devozione
                all&apos;accompagnamento delle famiglie nei momenti pi&ugrave; delicati della vita.
                Oltre un secolo di esperienza, tramandata di generazione in generazione,
                ci ha insegnato che ogni persona merita un ultimo saluto fatto di rispetto,
                dignit&agrave; e cura in ogni dettaglio.
              </p>
              <p>
                La nostra impresa funebre, regolarmente iscritta al Registro Regionale della Campania,
                offre un servizio completo a 360 gradi: dalla vestizione della salma alla tanatocosmesi,
                dall&apos;organizzazione della cerimonia religiosa o laica alla gestione di tutte le
                pratiche burocratiche, dalla scelta dei fiori e degli addobbi alla stampa dei manifesti
                e dei santini commemorativi.
              </p>
              <p>
                Disponiamo di una <strong className="text-primary">casa funeraria moderna e accogliente</strong>,
                dotata di sale per la camera ardente, sala cerimonie con capienza fino a 100 posti,
                e un ampio showroom dove le famiglie possono visionare cofani, urne e composizioni
                floreali in un ambiente sereno e riservato.
              </p>
              <p>
                Siamo la <strong className="text-primary">prima agenzia funebre digitale in Italia</strong>:
                il nostro configuratore online permette di personalizzare ogni aspetto del servizio
                e ricevere un preventivo indicativo in pochi minuti, senza pressioni e senza obblighi.
                Un consulente dedicato vi contatta entro 30 minuti per accompagnarvi in tutto il percorso.
              </p>
              <p>
                Operiamo in tutta la <strong className="text-primary">Campania</strong> — Napoli, Caserta, Salerno,
                Avellino e Benevento — e gestiamo <strong className="text-primary">rimpatri ed espatri
                salme in tutto il mondo</strong>, con assistenza consolare e documentale completa.
                Offriamo inoltre il servizio di cremazione per animali domestici, esumazione e riesumazione,
                e il memorial online con QR Code per lapide.
              </p>
            </motion.div>
          </motion.div>

          {/* Immagini laterali */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-3 sm:gap-4"
          >
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden">
              <Image src="/images/chi-siamo-cappella.jpg" alt="Cappella" fill className="object-cover" sizes="(max-width: 768px) 45vw, 250px" />
            </div>
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden sm:mt-8">
              <Image src="/images/chi-siamo-cerimonia.jpg" alt="Cerimonia" fill className="object-cover" sizes="(max-width: 768px) 45vw, 250px" />
            </div>
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden">
              <Image src="/images/chi-siamo-team.jpg" alt="Il nostro team" fill className="object-cover" sizes="(max-width: 768px) 45vw, 250px" />
            </div>
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden sm:mt-8">
              <Image src="/images/chi-siamo-showroom.jpg" alt="Showroom" fill className="object-cover" sizes="(max-width: 768px) 45vw, 250px" />
            </div>
          </motion.div>
          </div>
        </div>
      </section>

      {/* Autorizzazioni */}
      <section className="py-16 bg-background-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeUp} custom={0}
            className="font-[family-name:var(--font-serif)] text-3xl text-primary mb-10 text-center"
          >
            Autorizzazioni e garanzie
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, titolo: 'Registro Regionale', desc: 'Iscritti al Registro Regionale delle imprese funebri della Campania (D.G.R. 732/2017)' },
              { icon: Award, titolo: 'Conformit\u00e0 normativa', desc: 'Operanti nel pieno rispetto della L.R. 12/2001 e del D.P.R. 285/1990' },
              { icon: Users, titolo: 'Formazione continua', desc: 'Personale qualificato e aggiornato sulle normative e le migliori pratiche del settore' },
              { icon: MapPin, titolo: 'Copertura regionale', desc: 'Servizio attivo in tutta la Campania con strutture a Napoli e provincia' },
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
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeUp} custom={0}
            className="font-[family-name:var(--font-serif)] text-3xl text-primary mb-4 text-center"
          >
            Cosa fare in caso di decesso
          </motion.h2>
          <motion.p
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeUp} custom={1}
            className="text-text-light text-center mb-10 max-w-2xl mx-auto"
          >
            Una guida pratica per orientarsi nei primi momenti, passo dopo passo.
          </motion.p>

          <div className="space-y-6">
            {[
              { step: '1', titolo: 'Chiamare il medico', desc: 'Il medico curante o il 118 dovr\u00e0 constatare il decesso e rilasciare il certificato di morte.' },
              { step: '2', titolo: 'Contattare l\'impresa funebre', desc: 'Chiamateci a qualsiasi ora. Ci occuperemo di tutto, incluso il trasporto della salma.' },
              { step: '3', titolo: 'Documenti necessari', desc: 'Carta d\'identit\u00e0 del defunto, tessera sanitaria, certificato di morte. Penseremo noi a tutto il resto.' },
              { step: '4', titolo: 'Scelta del servizio', desc: 'Insieme definiremo il tipo di cerimonia, la bara, i fiori e ogni dettaglio. Potete usare il nostro configuratore online.' },
              { step: '5', titolo: 'Pratiche burocratiche', desc: 'Ci occupiamo noi della denuncia di morte, dell\'autorizzazione al trasporto e delle pratiche cimiteriali.' },
              { step: '6', titolo: 'Cerimonia e sepoltura', desc: 'Organizziamo e coordiniamo l\'intera cerimonia secondo le vostre volont\u00e0.' },
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
