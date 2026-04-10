import Link from 'next/link'
import Image from 'next/image'
import { Home, Building2, Globe, PawPrint, ChevronRight, Phone, Euro, FileText, Flame, BookOpen, ScrollText, Users } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Guide Funebri — Cosa fare in caso di decesso',
  description: 'Guide pratiche complete: cosa fare quando muore un familiare, documenti necessari, costi funerale, cremazione, inumazione, tumulazione, manifesto funebre, testamento.',
  keywords: 'cosa fare quando muore un familiare, documenti funerale, costi funerale napoli, cremazione campania, manifesto funebre, inumazione tumulazione differenze',
}

const guideScenari = [
  { href: '/guida/decesso-in-casa', icon: Home, titolo: 'Decesso in casa', desc: 'I primi passi quando il decesso avviene in abitazione. Medico, documenti, trasporto.' },
  { href: '/guida/decesso-in-ospedale', icon: Building2, titolo: 'Decesso in ospedale', desc: 'Procedura ospedaliera, obitorio, ritiro salma e pratiche con la struttura.' },
  { href: '/guida/decesso-allestero', icon: Globe, titolo: 'Decesso all\'estero', desc: 'Come gestire un decesso fuori Italia: consolato, rimpatrio salma, documenti.' },
  { href: '/guida/decesso-in-rsa', icon: Users, titolo: 'Decesso in RSA o casa di riposo', desc: 'Procedura nelle strutture assistenziali e comunicazione con la direzione.' },
]

const guideInformative = [
  { href: '/guida/quanto-costa-un-funerale', icon: Euro, titolo: 'Quanto costa un funerale?', desc: 'Guida completa ai costi: economico, standard, premium. Cosa incide sul prezzo.' },
  { href: '/guida/documenti-necessari', icon: FileText, titolo: 'Documenti necessari', desc: 'Lista completa dei documenti per organizzare un funerale. Cosa portare, dove richiederli.' },
  { href: '/guida/cremazione-come-funziona', icon: Flame, titolo: 'Cremazione: come funziona', desc: 'Procedura, tempi, costi, crematori in Campania, scelta dell\'urna, dispersione ceneri.' },
  { href: '/guida/inumazione-o-tumulazione', icon: BookOpen, titolo: 'Inumazione o tumulazione?', desc: 'Le differenze spiegate: costi, tempistiche, concessioni cimiteriali, come scegliere.' },
  { href: '/guida/manifesto-funebre', icon: ScrollText, titolo: 'Il manifesto funebre', desc: 'Come scrivere il manifesto: testo, formato, dove affiggerlo, costi stampa.' },
  { href: '/guida/testamento-e-volonta', icon: FileText, titolo: 'Testamento e volontà', desc: 'Disposizioni anticipate, testamento biologico, volontà sulla cerimonia e la sepoltura.' },
  { href: '/guida/lutto-e-supporto', icon: Users, titolo: 'Elaborazione del lutto', desc: 'Come affrontare il dolore, supporto psicologico, gruppi di mutuo aiuto in Campania.' },
  { href: '/guida/cremazione-animali', icon: PawPrint, titolo: 'Cremazione animali domestici', desc: 'Cremazione cani, gatti e altri animali: individuale, collettiva, costi, urne, ritiro.' },
]

export default function GuidaPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary py-20 md:py-28 relative overflow-hidden">
        <Image src="/images/candele.jpg" alt="" fill className="object-cover opacity-20" sizes="100vw" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-[family-name:var(--font-serif)] text-4xl md:text-5xl text-white mb-4">
            Guide e Informazioni
          </h1>
          <p className="text-white/85 text-lg max-w-2xl mx-auto">
            Tutto quello che serve sapere, spiegato con chiarezza. Per orientarvi nei momenti difficili senza fretta e senza pressioni.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          {/* Scenari decesso */}
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary mb-6">Cosa fare in caso di decesso</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
            {guideScenari.map(g => (
              <Link key={g.href} href={g.href} className="card group flex items-start gap-4">
                <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-secondary/20 transition">
                  <g.icon size={20} className="text-secondary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-primary group-hover:text-secondary transition">{g.titolo}</h3>
                  <p className="text-text-muted text-sm mt-0.5">{g.desc}</p>
                  <span className="text-secondary text-xs mt-2 inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                    Leggi la guida <ChevronRight size={12} />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Guide informative */}
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary mb-6">Guide informative</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
            {guideInformative.map(g => (
              <Link key={g.href} href={g.href} className="card group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center group-hover:bg-secondary/20 transition">
                    <g.icon size={16} className="text-secondary" />
                  </div>
                  <h3 className="font-medium text-primary group-hover:text-secondary transition text-sm">{g.titolo}</h3>
                </div>
                <p className="text-text-muted text-xs leading-relaxed">{g.desc}</p>
              </Link>
            ))}
          </div>

          <div className="card bg-primary/5 border-primary/10 text-center">
            <p className="text-text-light mb-4">Non trovate quello che cercate? Siamo a vostra disposizione 24/7.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="tel:+390815551234" className="btn-primary text-sm"><Phone size={16} className="mr-2" /> Chiama Ora</a>
              <Link href="/assistenza" className="btn-secondary text-sm">Chatta con noi</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
