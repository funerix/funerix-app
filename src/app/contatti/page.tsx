'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react'
import { useSitoStore } from '@/store/sito'
import { useState } from 'react'

export default function ContattiPage() {
  const { impostazioni } = useSitoStore()
  const [inviato, setInviato] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary py-20 md:py-28 relative overflow-hidden">
        <Image src="/images/fiori-bianchi.jpg" alt="" fill className="object-cover opacity-25" sizes="100vw" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-[family-name:var(--font-serif)] text-4xl md:text-5xl text-white"
          >
            Contatti
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-white/90 text-lg"
          >
            Siamo sempre disponibili. Non esitate a contattarci per qualsiasi necessit&agrave;.
          </motion.p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Info contatto */}
            <div className="space-y-6">
              {[
                { icon: Phone, label: 'Telefono (24/7)', value: impostazioni.telefono, href: `tel:${impostazioni.telefono.replace(/\s/g, '')}` },
                { icon: MessageCircle, label: 'WhatsApp', value: impostazioni.whatsapp, href: `https://wa.me/${impostazioni.whatsapp.replace(/\s/g, '')}` },
                { icon: Mail, label: 'Email', value: impostazioni.email, href: `mailto:${impostazioni.email}` },
                { icon: MapPin, label: 'Sede', value: impostazioni.indirizzo, href: undefined },
                { icon: Clock, label: 'Orari ufficio', value: `${impostazioni.orari}\nReperibilit\u00e0: sempre`, href: undefined },
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
                <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary mb-6">
                  Scriveteci un messaggio
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
                    <h3 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-2">Messaggio inviato</h3>
                    <p className="text-text-light">Vi risponderemo il prima possibile. Grazie per averci contattato.</p>
                  </motion.div>
                ) : (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault()
                      const form = e.target as HTMLFormElement
                      const data = {
                        nome: (form.querySelector('[name=nome]') as HTMLInputElement).value,
                        telefono: (form.querySelector('[name=telefono]') as HTMLInputElement).value,
                        email: (form.querySelector('[name=email]') as HTMLInputElement)?.value || '',
                        modalita: 'form_contatti',
                        orario: 'Quando possibile',
                        note: `Oggetto: ${(form.querySelector('[name=oggetto]') as HTMLSelectElement).value}\n\n${(form.querySelector('[name=messaggio]') as HTMLTextAreaElement).value}`,
                        configurazione: 'Messaggio dal form contatti',
                        totale: 0,
                        stato: 'nuova',
                        createdAt: new Date().toISOString(),
                      }
                      try {
                        await fetch('/api/richieste', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
                      } catch {}
                      setInviato(true)
                    }}
                    className="space-y-5"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-text mb-1">Nome e Cognome *</label>
                        <input name="nome" type="text" required className="input-field" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text mb-1">Telefono *</label>
                        <input name="telefono" type="tel" required className="input-field" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text mb-1">Email</label>
                        <input name="email" type="email" className="input-field" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text mb-1">Oggetto</label>
                        <select name="oggetto" className="input-field">
                          <option>Richiesta informazioni</option>
                          <option>Richiesta preventivo</option>
                          <option>Cremazione animali</option>
                          <option>Previdenza funeraria</option>
                          <option>Rimpatrio salma</option>
                          <option>Esumazione</option>
                          <option>Memorial online</option>
                          <option>Altro</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text mb-1">Messaggio *</label>
                      <textarea name="messaggio" rows={5} required className="input-field" />
                    </div>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" required className="w-5 h-5 mt-0.5 rounded border-border" />
                      <span className="text-sm text-text-light">
                        Acconsento al trattamento dei dati personali ai sensi del GDPR. *
                      </span>
                    </label>
                    <button type="submit" className="btn-primary w-full py-4">
                      Invia Messaggio
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
