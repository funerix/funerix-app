'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Heart, MapPin, Gift, Calendar, Send } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { useSitoStore } from '@/store/sito'
import { useState, use } from 'react'

export default function MemorialDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { memorial: allMemorial, aggiungiMessaggioMemorial } = useSitoStore()
  const memorial = allMemorial.find(m => m.id === id) || allMemorial[0]
  const [nuovoMessaggio, setNuovoMessaggio] = useState('')
  const [autore, setAutore] = useState('')

  if (!memorial) return <div className="min-h-screen flex items-center justify-center text-text-muted">Memorial non trovato</div>

  const messaggi = memorial.messaggi

  const handleInviaMessaggio = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nuovoMessaggio.trim() || !autore.trim()) return
    aggiungiMessaggioMemorial(memorial.id, autore, nuovoMessaggio)
    setNuovoMessaggio('')
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const anniFra = (nascita: string, morte: string) => {
    const n = new Date(nascita)
    const m = new Date(morte)
    return m.getFullYear() - n.getFullYear()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header memorial */}
      <section className="bg-primary py-20 md:py-28 relative overflow-hidden">
        <Image src="/images/tramonto-sereno.png" alt="" fill className="object-cover opacity-20" sizes="100vw" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Foto defunto */}
            <div className="w-32 h-32 mx-auto rounded-full bg-white/10 mb-6 ring-4 ring-secondary/30 relative overflow-hidden">
              {memorial.foto ? (
                <Image src={memorial.foto} alt={memorial.nome} fill className="object-cover" sizes="128px" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Heart size={40} className="text-secondary-light" />
                </div>
              )}
            </div>

            <h1 className="font-[family-name:var(--font-serif)] text-3xl md:text-4xl text-white">
              {memorial.nome}
            </h1>
            <p className="mt-2 text-white/70 text-lg">
              {formatDate(memorial.dataNascita)} — {formatDate(memorial.dataMorte)}
            </p>
            <p className="text-white/60 text-sm mt-1">
              {anniFra(memorial.dataNascita, memorial.dataMorte)} anni
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Contenuto principale */}
          <div className="lg:col-span-2 space-y-10">
            {/* Biografia */}
            {memorial.biografia && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
              >
                <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-4">
                  In ricordo
                </h2>
                <p className="text-text-light leading-relaxed">{memorial.biografia}</p>
              </motion.div>
            )}

            {/* Messaggi */}
            <div>
              <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-6">
                Messaggi di cordoglio ({messaggi.length})
              </h2>
              <div className="space-y-4">
                {messaggi.map((msg, i) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="card"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-primary">{msg.autore}</span>
                      <span className="text-xs text-text-muted">
                        {formatDate(msg.createdAt)}
                      </span>
                    </div>
                    <p className="text-text-light text-sm leading-relaxed">{msg.contenuto}</p>
                  </motion.div>
                ))}
              </div>

              {/* Form nuovo messaggio */}
              <form onSubmit={handleInviaMessaggio} className="mt-8 card">
                <h3 className="font-[family-name:var(--font-serif)] text-lg text-primary mb-4">
                  Lascia un pensiero
                </h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Il tuo nome"
                    className="input-field"
                    value={autore}
                    onChange={(e) => setAutore(e.target.value)}
                    required
                  />
                  <textarea
                    rows={3}
                    placeholder="Scrivi un messaggio di cordoglio o condividi un ricordo..."
                    className="input-field"
                    value={nuovoMessaggio}
                    onChange={(e) => setNuovoMessaggio(e.target.value)}
                    required
                  />
                  <button type="submit" className="btn-primary">
                    <Send size={16} className="mr-2" />
                    Invia messaggio
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* QR Code */}
            <div className="card text-center">
              <h3 className="font-[family-name:var(--font-serif)] text-lg text-primary mb-4">
                QR Code Memorial
              </h3>
              <div className="flex justify-center mb-4">
                <QRCodeSVG
                  value={`https://funerix.com/memorial/${memorial.id}`}
                  size={160}
                  fgColor="#2C3E50"
                  bgColor="transparent"
                />
              </div>
              <p className="text-xs text-text-muted">
                Scansiona per visitare questa pagina.
                Stampalo su santino o lapide.
              </p>
            </div>

            {/* Luogo sepoltura */}
            {memorial.luogoSepoltura && (
              <div className="card">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin size={16} className="text-secondary" />
                  <h3 className="font-[family-name:var(--font-serif)] text-lg text-primary">
                    Luogo di sepoltura
                  </h3>
                </div>
                <p className="text-text-light text-sm">{memorial.luogoSepoltura}</p>
              </div>
            )}

            {/* Donazioni */}
            {memorial.donazioneUrl && (
              <div className="card border-secondary/30 bg-secondary/5">
                <div className="flex items-center gap-2 mb-3">
                  <Gift size={16} className="text-secondary" />
                  <h3 className="font-[family-name:var(--font-serif)] text-lg text-primary">
                    Donazioni in memoria
                  </h3>
                </div>
                <p className="text-text-light text-sm mb-4">{memorial.donazioneDescrizione}</p>
                <a
                  href={memorial.donazioneUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary text-sm w-full"
                >
                  Dona in memoria di {memorial.nome.split(' ')[0]}
                </a>
              </div>
            )}

            {/* Date importanti */}
            <div className="card">
              <div className="flex items-center gap-2 mb-3">
                <Calendar size={16} className="text-secondary" />
                <h3 className="font-[family-name:var(--font-serif)] text-lg text-primary">
                  Date da ricordare
                </h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-muted">Nascita</span>
                  <span className="text-text">{formatDate(memorial.dataNascita)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Scomparsa</span>
                  <span className="text-text">{formatDate(memorial.dataMorte)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Primo anniversario</span>
                  <span className="text-text">
                    {formatDate(
                      new Date(new Date(memorial.dataMorte).setFullYear(
                        new Date(memorial.dataMorte).getFullYear() + 1
                      )).toISOString()
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
