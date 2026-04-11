import Link from 'next/link'
import Image from 'next/image'
import { Heart, ChevronRight, PawPrint, Truck, Award, Star, MapPin } from 'lucide-react'
import { PhoneLink } from '@/components/PhoneLink'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Funerix Pet — Cremazione Animali Domestici',
  description: 'Servizio di cremazione per animali domestici. Cremazione individuale con restituzione ceneri, urne commemorative, memorial digitale. Veterinari convenzionati.',
}

const servizi = [
  { icon: Heart, nome: 'Cremazione Individuale', desc: 'Con restituzione ceneri in urna dedicata. Per cani, gatti e altri animali.' },
  { icon: PawPrint, nome: 'Impronta della Zampa', desc: 'Calco in ceramica o argilla della zampa del vostro compagno.' },
  { icon: Award, nome: 'Urne Commemorative', desc: 'Ampia scelta in ceramica, legno, marmo e materiali biodegradabili.' },
  { icon: Truck, nome: 'Ritiro a Domicilio', desc: 'Ritiriamo il vostro animale direttamente a casa vostra con rispetto.' },
  { icon: Star, nome: 'Memorial Digitale', desc: 'Pagina web dedicata con foto, messaggi e candele virtuali.' },
  { icon: MapPin, nome: 'Veterinari Partner', desc: 'Rete di veterinari convenzionati per un servizio senza pensieri.' },
]

export default function PetPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-primary py-20 md:py-28 relative overflow-hidden">
        <Image src="/images/hero-pet.png" alt="" fill className="object-cover opacity-20" sizes="100vw" />
        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-secondary/20 text-secondary-light text-xs px-4 py-2 rounded-full mb-5 border border-secondary/20">
            <PawPrint size={14} /> Funerix Pet
          </div>
          <h1 className="font-[family-name:var(--font-serif)] text-4xl md:text-5xl text-white mb-4">
            Cremazione Animali Domestici
          </h1>
          <p className="text-white/90 text-lg max-w-2xl mx-auto mb-8">
            Un ultimo saluto dignitoso per il vostro compagno di vita.
            Servizio rispettoso e professionale con restituzione ceneri.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/pet/configuratore" className="btn-accent text-base py-4 px-8">
              Configura Cremazione <ChevronRight size={18} className="ml-2" />
            </Link>
            <PhoneLink className="btn-secondary border-white/30 text-white hover:bg-white/10 hover:text-white text-base py-4 px-8" showIcon label="Parla con noi" />
          </div>
        </div>
      </section>

      {/* Servizi */}
      <section className="py-16 bg-background-dark">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary text-center mb-4">I nostri servizi</h2>
          <p className="text-text-light text-center mb-10 max-w-2xl mx-auto">
            Sappiamo quanto sia doloroso perdere un compagno di vita. Per questo offriamo un servizio
            dedicato con la stessa cura e rispetto che riserviamo alle persone.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servizi.map(s => (
              <div key={s.nome} className="card text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-secondary/10 rounded-full flex items-center justify-center">
                  <s.icon size={22} className="text-secondary" />
                </div>
                <h3 className="font-[family-name:var(--font-serif)] text-lg text-primary mb-2">{s.nome}</h3>
                <p className="text-text-muted text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Come funziona */}
      <section className="py-16 bg-background-dark">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary text-center mb-12">Come funziona</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { n: '01', t: 'Configurate', d: 'Scegliete tipo di cremazione, urna e servizi aggiuntivi.' },
              { n: '02', t: 'Ritiriamo', d: 'Ritiriamo il vostro animale a domicilio o presso il veterinario.' },
              { n: '03', t: 'Cremiamo', d: 'Cremazione individuale con certificato e restituzione ceneri.' },
              { n: '04', t: 'Ricordate', d: 'Create un memorial digitale per il vostro compagno.' },
            ].map(s => (
              <div key={s.n} className="text-center">
                <span className="text-secondary/30 font-[family-name:var(--font-serif)] text-3xl font-bold">{s.n}</span>
                <h3 className="font-[family-name:var(--font-serif)] text-lg text-primary mt-1 mb-2">{s.t}</h3>
                <p className="text-text-muted text-sm">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Link sezioni */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/pet/catalogo" className="card hover:border-secondary/30 transition-colors group">
              <Award size={24} className="text-secondary mb-3" />
              <h3 className="font-[family-name:var(--font-serif)] text-lg text-primary mb-1 group-hover:text-secondary transition-colors">Catalogo Urne</h3>
              <p className="text-text-muted text-sm">Sfoglia la nostra collezione di urne e accessori commemorativi.</p>
            </Link>
            <Link href="/pet/veterinari" className="card hover:border-secondary/30 transition-colors group">
              <MapPin size={24} className="text-secondary mb-3" />
              <h3 className="font-[family-name:var(--font-serif)] text-lg text-primary mb-1 group-hover:text-secondary transition-colors">Veterinari Partner</h3>
              <p className="text-text-muted text-sm">Trova il veterinario convenzionato piu vicino a te.</p>
            </Link>
            <Link href="/pet/memorial" className="card hover:border-secondary/30 transition-colors group">
              <Heart size={24} className="text-secondary mb-3" />
              <h3 className="font-[family-name:var(--font-serif)] text-lg text-primary mb-1 group-hover:text-secondary transition-colors">Memorial Pet</h3>
              <p className="text-text-muted text-sm">Crea una pagina ricordo per il tuo compagno di vita.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16 relative overflow-hidden">
        <Image src="/images/hero-pet.png" alt="" fill className="object-cover opacity-15" sizes="100vw" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <PawPrint size={32} className="mx-auto mb-4 text-secondary-light" />
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-white mb-4">
            Configurate il servizio in pochi minuti
          </h2>
          <p className="text-white/80 mb-8">
            Scegliete tipo di cremazione, urna e servizi. Un operatore vi contatter&agrave; per organizzare tutto.
          </p>
          <Link href="/pet/configuratore" className="btn-accent text-lg py-4 px-10">
            Configura Cremazione Pet <ChevronRight size={18} className="ml-2" />
          </Link>
        </div>
      </section>
    </div>
  )
}
