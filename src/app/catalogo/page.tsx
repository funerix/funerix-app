'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { PawPrint } from 'lucide-react'
import { useSitoStore } from '@/store/sito'
import { useState } from 'react'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.05, duration: 0.4 },
  }),
}

export default function CatalogoPage() {
  const { prodotti, categorie } = useSitoStore()
  const [categoriaAttiva, setCategoriaAttiva] = useState<string | null>(null)
  const [ordinamento, setOrdinamento] = useState<'prezzo_asc' | 'prezzo_desc' | 'nome'>('prezzo_asc')

  const prodottiFiltrati = prodotti
    .filter((p) => p.attivo)
    .filter((p) => !categoriaAttiva || p.categoriaId === categoriaAttiva)
    .sort((a, b) => {
      if (ordinamento === 'prezzo_asc') return a.prezzo - b.prezzo
      if (ordinamento === 'prezzo_desc') return b.prezzo - a.prezzo
      return a.nome.localeCompare(b.nome)
    })

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="text-center mb-12">
          <h1 className="font-[family-name:var(--font-serif)] text-3xl md:text-4xl text-primary">
            Catalogo Prodotti e Servizi
          </h1>
          <p className="mt-3 text-text-light text-lg max-w-2xl mx-auto">
            Tutti i nostri prodotti e servizi presentati con la massima trasparenza.
            I prezzi sono indicativi e soggetti a conferma.
          </p>
        </div>

        {/* Filtri */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCategoriaAttiva(null)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                !categoriaAttiva ? 'bg-primary text-white' : 'bg-surface text-text-light border border-border hover:bg-background-dark'
              }`}
            >
              Tutti
            </button>
            {categorie.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoriaAttiva(cat.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  categoriaAttiva === cat.id ? 'bg-primary text-white' : 'bg-surface text-text-light border border-border hover:bg-background-dark'
                }`}
              >
                {cat.nome}
              </button>
            ))}
          </div>
          <select
            value={ordinamento}
            onChange={(e) => setOrdinamento(e.target.value as typeof ordinamento)}
            className="input-field w-auto text-sm"
          >
            <option value="prezzo_asc">Prezzo: dal pi&ugrave; basso</option>
            <option value="prezzo_desc">Prezzo: dal pi&ugrave; alto</option>
            <option value="nome">Nome A-Z</option>
          </select>
        </div>

        {/* Grid Prodotti */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prodottiFiltrati.map((prodotto, i) => (
            <motion.div
              key={prodotto.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i % 6}
              className="card group"
            >
              <div className="w-full h-48 bg-background-dark rounded-lg mb-4 relative overflow-hidden">
                {prodotto.immagini[0] ? (
                  <Image src={prodotto.immagini[0]} alt={prodotto.nome} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-text-muted text-sm">Foto prodotto</span>
                  </div>
                )}
              </div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-[family-name:var(--font-serif)] text-lg text-primary">
                  {prodotto.nome}
                </h3>
              </div>
              <p className="text-text-light text-sm mb-3">{prodotto.descrizioneBreve}</p>
              {prodotto.materiale && (
                <p className="text-xs text-text-muted">Materiale: {prodotto.materiale}</p>
              )}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <span className="font-[family-name:var(--font-serif)] text-xl text-primary font-semibold">
                  &euro; {prodotto.prezzo.toLocaleString('it-IT')}
                </span>
                <span className="text-xs text-text-muted">
                  {categorie.find((c) => c.id === prodotto.categoriaId)?.nome}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pet Catalogo Banner */}
        <div className="mt-10">
          <Link href="/pet/catalogo" className="block card bg-secondary/5 border-secondary/20 hover:bg-secondary/10 transition-colors group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <PawPrint size={24} className="text-secondary" />
              </div>
              <div className="flex-1">
                <h3 className="font-[family-name:var(--font-serif)] text-lg text-primary group-hover:text-secondary transition-colors">
                  Cerchi urne per animali?
                </h3>
                <p className="text-text-muted text-sm">Scopri il catalogo dedicato ai nostri amici a quattro zampe.</p>
              </div>
              <span className="text-secondary text-sm font-medium hidden sm:block">Scopri &rarr;</span>
            </div>
          </Link>
        </div>

        <div className="text-center mt-12">
          <p className="text-text-muted text-sm mb-4">
            Non trovate quello che cercate? Il nostro catalogo completo &egrave; disponibile su richiesta.
          </p>
          <Link href="/configuratore" className="btn-primary">
            Configura il tuo servizio
          </Link>
        </div>
      </div>
    </div>
  )
}
