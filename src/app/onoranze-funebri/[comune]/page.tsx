import Link from 'next/link'
import Image from 'next/image'
import { Phone, ChevronRight, MapPin, Clock, Shield } from 'lucide-react'
import { comuniCampania } from '@/lib/comuni-campania'
import type { Metadata } from 'next'

export function generateStaticParams() {
  return comuniCampania.map((c) => ({ comune: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ comune: string }> }): Promise<Metadata> {
  const { comune: slug } = await params
  const comune = comuniCampania.find((c) => c.slug === slug)
  const nome = comune?.nome || slug
  return {
    title: `Onoranze Funebri ${nome} — Funerix`,
    description: `Servizi funebri a ${nome} (${comune?.provincia}). Configura il funerale online, preventivo immediato. Impresa funebre autorizzata. Disponibili 24/7.`,
    keywords: `onoranze funebri ${nome.toLowerCase()}, funerali ${nome.toLowerCase()}, impresa funebre ${nome.toLowerCase()}, cremazione ${nome.toLowerCase()}`,
  }
}

export default async function ComunePage({ params }: { params: Promise<{ comune: string }> }) {
  const { comune: slug } = await params
  const comune = comuniCampania.find((c) => c.slug === slug)
  const nome = comune?.nome || slug
  const provincia = comune?.provincia || ''

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative bg-primary py-20 md:py-28 overflow-hidden">
        <Image src="/images/hero.jpg" alt="" fill className="object-cover opacity-30" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/80 to-primary/60" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-[family-name:var(--font-serif)] text-4xl md:text-5xl text-white mb-4">
            Onoranze Funebri a {nome}
          </h1>
          <p className="text-white/90 text-lg max-w-2xl mx-auto mb-8">
            Servizi funebri completi a {nome} ({provincia}). Vi accompagniamo con rispetto e trasparenza
            in ogni momento. Configurate il servizio online e ricevete un preventivo immediato.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/configuratore" className="btn-accent text-base py-4 px-8">
              Configura il Servizio <ChevronRight size={18} className="ml-2" />
            </Link>
            <Link href="/contatti" className="btn-secondary border-white/30 text-white hover:bg-white/10 hover:text-white text-base py-4 px-8">
              <Phone size={18} className="mr-2" /> Contattaci
            </Link>
          </div>
        </div>
      </section>

      {/* Servizi */}
      <section className="py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary mb-8 text-center">
            I nostri servizi funebri a {nome}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { titolo: 'Inumazione', desc: `Servizio completo di sepoltura in terra presso i cimiteri di ${nome} e comuni limitrofi.` },
              { titolo: 'Tumulazione', desc: `Sepoltura in loculo presso il cimitero di ${nome}. Assistenza per concessione e pratiche.` },
              { titolo: 'Cremazione', desc: `Servizio di cremazione completo con trasporto al crematorio più vicino a ${nome}.` },
            ].map((s) => (
              <div key={s.titolo} className="card text-center">
                <h3 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">{s.titolo}</h3>
                <p className="text-text-light text-sm">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="prose max-w-none text-text-light leading-relaxed space-y-4">
            <h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary">
              Impresa funebre a {nome}: perch&eacute; scegliere Funerix
            </h2>
            <p>
              Funerix &egrave; la prima agenzia funebre digitale in Campania. Operiamo a {nome} e in tutta
              la provincia di {provincia} offrendo un servizio completo, trasparente e rispettoso.
              Il nostro configuratore online vi permette di personalizzare ogni aspetto del servizio
              funebre e ricevere un preventivo indicativo in pochi minuti.
            </p>
            <p>
              A differenza delle imprese funebri tradizionali, con Funerix potete prendervi tutto il tempo
              necessario per scegliere, confrontare e decidere senza alcuna pressione. Un nostro consulente
              dedicato vi contatter&agrave; entro 30 minuti per accompagnarvi in ogni fase del percorso.
            </p>

            <h3 className="font-[family-name:var(--font-serif)] text-xl text-primary">
              Cosa include il nostro servizio a {nome}
            </h3>
            <ul>
              <li>Trasporto della salma da casa, ospedale o RSA di {nome}</li>
              <li>Ampia scelta di cofani funebri, urne cinerarie e composizioni floreali</li>
              <li>Organizzazione della cerimonia religiosa o laica</li>
              <li>Camera ardente presso la nostra struttura o a domicilio</li>
              <li>Assistenza completa per pratiche burocratiche e cimiteriali</li>
              <li>Necrologi su giornali locali e manifesti funebri</li>
              <li>Pagina Memorial Online con QR Code</li>
              <li>Disponibilit&agrave; 24 ore su 24, 7 giorni su 7</li>
            </ul>

            <h3 className="font-[family-name:var(--font-serif)] text-xl text-primary">
              Quanto costa un funerale a {nome}?
            </h3>
            <p>
              Il costo di un funerale a {nome} varia in base al tipo di servizio scelto.
              Un funerale completo con inumazione parte da circa &euro;2.500, mentre un servizio
              standard con tumulazione in loculo si aggira tra &euro;4.000 e &euro;8.000.
              La cremazione ha costi compresi tra &euro;2.000 e &euro;4.500.
              Utilizzate il nostro configuratore per avere un preventivo personalizzato e dettagliato.
            </p>
          </div>
        </div>
      </section>

      {/* Vantaggi */}
      <section className="py-16 bg-background-dark">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Clock, titolo: 'Risposta in 30 minuti', desc: 'Un consulente vi contatta entro mezz\'ora dalla richiesta, 24/7.' },
              { icon: Shield, titolo: 'Prezzi trasparenti', desc: 'Preventivo dettagliato voce per voce. Nessun costo nascosto.' },
              { icon: MapPin, titolo: `Operiamo a ${nome}`, desc: `Conosciamo il territorio e i cimiteri di ${nome} e provincia.` },
            ].map((v) => (
              <div key={v.titolo} className="card text-center">
                <v.icon size={28} className="mx-auto mb-3 text-secondary" />
                <h3 className="font-[family-name:var(--font-serif)] text-lg text-primary mb-2">{v.titolo}</h3>
                <p className="text-text-light text-sm">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary mb-4">
            Avete bisogno di assistenza a {nome}?
          </h2>
          <p className="text-text-light mb-8">
            Configurate il servizio online o contattateci direttamente. Siamo sempre al vostro fianco.
          </p>
          <Link href="/configuratore" className="btn-primary text-base py-4 px-10">
            Configura il Servizio <ChevronRight size={18} className="ml-2" />
          </Link>
        </div>
      </section>

      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FuneralHome',
            name: `Funerix — Onoranze Funebri ${nome}`,
            description: `Servizi funebri completi a ${nome}. Configura online, preventivo immediato.`,
            url: `https://funerix.com/onoranze-funebri/${slug}`,
            telephone: '+390815551234',
            areaServed: { '@type': 'City', name: nome },
            address: {
              '@type': 'PostalAddress',
              addressLocality: nome,
              addressRegion: 'Campania',
              addressCountry: 'IT',
            },
            openingHours: 'Mo-Su 00:00-23:59',
            priceRange: '€€',
          }),
        }}
      />
    </div>
  )
}
