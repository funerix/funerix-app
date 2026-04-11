import Link from 'next/link'
import Image from 'next/image'
import { Check, ChevronRight, Package } from 'lucide-react'
import { PhoneLink } from '@/components/PhoneLink'
import { createClient } from '@supabase/supabase-js'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Servizi Aggiuntivi — Funerix',
  description: 'Video tributo, stampa ricordo, disbrigo pratiche, trasporto e altri servizi aggiuntivi per personalizzare il servizio funebre.',
}

interface ServizioExtra {
  id: string
  nome: string
  descrizione: string
  categoria: string
  prezzo_min: number
  prezzo_max: number
  dettagli: any
  attivo: boolean
}

async function fetchServizi(): Promise<ServizioExtra[]> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const { data } = await supabase
      .from('servizi_extra')
      .select('*')
      .eq('attivo', true)
      .order('categoria')
    return (data as ServizioExtra[]) || []
  } catch {
    return []
  }
}

export default async function ServiziPage() {
  const servizi = await fetchServizi()

  const serviziDefault: ServizioExtra[] = servizi.length > 0 ? servizi : [
    { id: '1', nome: 'Video Tributo', descrizione: 'Un video personalizzato con foto e musica per ricordare il vostro caro durante la cerimonia e oltre.', categoria: 'multimedia', prezzo_min: 150, prezzo_max: 300, dettagli: { include: ['Montaggio professionale', 'Fino a 50 foto', 'Musica a scelta', 'Formato digitale HD'] }, attivo: true },
    { id: '2', nome: 'Stampa Ricordo', descrizione: 'Santini, manifesti e libretti cerimonia stampati con cura e personalizzati.', categoria: 'stampa', prezzo_min: 80, prezzo_max: 200, dettagli: { include: ['100 santini personalizzati', 'Manifesto funebre', 'Libretto cerimonia', 'Grafica personalizzata'] }, attivo: true },
    { id: '3', nome: 'Disbrigo Pratiche', descrizione: 'Gestione completa di tutte le pratiche burocratiche: certificati, permessi, comunicazioni.', categoria: 'burocrazia', prezzo_min: 200, prezzo_max: 400, dettagli: { include: ['Certificato di morte', 'Permesso di seppellimento', 'Comunicazioni INPS/INAIL', 'Volture utenze'] }, attivo: true },
    { id: '4', nome: 'Trasporto Extra', descrizione: 'Trasporto salma oltre i 50 km inclusi nel servizio base, verso qualsiasi destinazione.', categoria: 'trasporto', prezzo_min: 150, prezzo_max: 500, dettagli: { include: ['Auto funebre dedicata', 'Personale qualificato', 'Documenti di trasporto', 'Copertura assicurativa'] }, attivo: true },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-primary py-20 md:py-28 relative overflow-hidden">
        <Image src="/images/card-servizi-extra.png" alt="" fill className="object-cover opacity-20" sizes="100vw" />
        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <Package size={48} className="mx-auto mb-6 text-secondary-light" />
          <h1 className="font-[family-name:var(--font-serif)] text-4xl md:text-5xl text-white leading-tight">
            Servizi Aggiuntivi
          </h1>
          <p className="mt-4 text-white/80 text-lg max-w-2xl mx-auto">
            Personalizzate ogni aspetto del servizio funebre con i nostri servizi aggiuntivi.
            Video tributo, stampa ricordo, disbrigo pratiche e molto altro.
          </p>
        </div>
      </section>

      {/* Servizi Grid */}
      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {serviziDefault.map((servizio) => {
              const include: string[] = servizio.dettagli?.include || []

              return (
                <div key={servizio.id} className="card">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-[family-name:var(--font-serif)] text-xl text-primary">{servizio.nome}</h3>
                    <span className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-full capitalize">{servizio.categoria}</span>
                  </div>
                  <p className="text-text-light text-sm mb-4">{servizio.descrizione}</p>

                  {include.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-text-muted uppercase tracking-wider mb-2">Include</p>
                      <ul className="space-y-1.5">
                        {include.map((item) => (
                          <li key={item} className="flex gap-2 text-sm text-text-light">
                            <Check size={14} className="text-accent mt-0.5 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="pt-4 border-t border-border flex items-center justify-between">
                    <div>
                      <span className="font-[family-name:var(--font-serif)] text-xl text-primary font-semibold">
                        &euro; {servizio.prezzo_min.toLocaleString('it-IT')}
                      </span>
                      {servizio.prezzo_max > servizio.prezzo_min && (
                        <span className="text-text-muted text-sm"> — &euro; {servizio.prezzo_max.toLocaleString('it-IT')}</span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16 relative overflow-hidden">
        <Image src="/images/card-servizi-extra.png" alt="" fill className="object-cover opacity-15" sizes="100vw" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-white mb-4">Avete bisogno di un servizio aggiuntivo?</h2>
          <p className="text-white/80 mb-8">Contattateci per aggiungere uno o più servizi al vostro preventivo. Un consulente vi guiderà nella scelta.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/contatti" className="btn-accent text-lg py-4 px-10">
              Contattaci <ChevronRight size={18} className="ml-2" />
            </Link>
            <PhoneLink className="btn-secondary border-white/30 text-white hover:bg-white/10 hover:text-white text-lg py-4 px-10" showIcon label="Chiama ora" />
          </div>
        </div>
      </section>
    </div>
  )
}
