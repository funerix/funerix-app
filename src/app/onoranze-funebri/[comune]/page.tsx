import Link from 'next/link'
import Image from 'next/image'
import { Phone, ChevronRight, MapPin, Clock, Shield } from 'lucide-react'
import { comuniCampania } from '@/lib/comuni-campania'
import type { Metadata } from 'next'
import ComuneClient from './ComuneClient'

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
    <>
      <ComuneClient nome={nome} provincia={provincia} slug={slug} />
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
    </>
  )
}
