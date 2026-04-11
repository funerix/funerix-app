import { Flower2, Sparkles, Wrench, Camera, Package, ChevronRight, Check } from 'lucide-react'
import { PhoneLink } from '@/components/PhoneLink'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@supabase/supabase-js'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Fiori e Manutenzione Tomba — Servizi Ricorrenti Funerix',
  description: 'Abbonamento fiori freschi sulla tomba, pulizia e manutenzione monumento funebre. Servizio per chi vive lontano.',
}

const categorieIcon: Record<string, typeof Flower2> = { fiori: Flower2, pulizia: Sparkles, manutenzione: Wrench, visita: Camera, altro: Package }
const categorieLabel: Record<string, string> = { fiori: 'Fiori', pulizia: 'Pulizia', manutenzione: 'Manutenzione', visita: 'Visite', altro: 'Pacchetti' }
const frequenzeLabel: Record<string, string> = { settimanale: 'Settimanale', quindicinale: 'Quindicinale', mensile: 'Mensile', trimestrale: 'Trimestrale', annuale: 'Annuale', una_tantum: 'Una tantum' }

async function getServizi() {
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  const { data } = await sb.from('servizi_ricorrenti').select('*').eq('attivo', true).order('ordine')
  return data || []
}

export default async function ServiziRicorrentiPage() {
  const servizi = await getServizi()

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-primary py-20 md:py-28 relative overflow-hidden">
        <Image src="/images/hero-fiori.png" alt="" fill className="object-cover opacity-20" sizes="100vw" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <Flower2 size={40} className="mx-auto mb-4 text-secondary-light" />
          <h1 className="font-[family-name:var(--font-serif)] text-4xl md:text-5xl text-white mb-4">
            Fiori e Cura della Tomba
          </h1>
          <p className="text-white/90 text-lg max-w-2xl mx-auto">
            Non potete visitare spesso il cimitero? Ci pensiamo noi.
            Fiori freschi, pulizia e manutenzione con abbonamento mensile.
          </p>
        </div>
      </section>

      {/* Come funziona */}
      <section className="py-16 bg-background-dark">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary text-center mb-10">Come funziona</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { n: '01', t: 'Scegliete il servizio', d: 'Fiori, pulizia, manutenzione o pacchetto completo.' },
              { n: '02', t: 'Indicateci la tomba', d: 'Cimitero, settore, fila e numero. Verificheremo la posizione.' },
              { n: '03', t: 'Ci occupiamo di tutto', d: 'I nostri operatori eseguono il servizio con regolarità.' },
              { n: '04', t: 'Ricevete aggiornamenti', d: 'Foto su WhatsApp dopo ogni intervento. Tranquillità garantita.' },
            ].map(s => (
              <div key={s.n} className="text-center">
                <span className="text-secondary/30 text-3xl font-bold">{s.n}</span>
                <h3 className="font-[family-name:var(--font-serif)] text-lg text-primary mt-1 mb-2">{s.t}</h3>
                <p className="text-text-muted text-sm">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Servizi DA DB */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary text-center mb-10">I nostri servizi</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servizi.map((s: any) => {
              const Icon = categorieIcon[s.categoria] || Package
              return (
                <div key={s.id} className={`card flex flex-col ${s.slug === 'pacchetto-completo' ? 'border-2 border-secondary relative' : ''}`}>
                  {s.slug === 'pacchetto-completo' && (
                    <div className="bg-secondary text-white text-xs px-3 py-1.5 rounded-lg font-medium text-center mb-3 -mt-1">
                      Più scelto
                    </div>
                  )}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon size={18} className="text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-[family-name:var(--font-serif)] text-lg text-primary">{s.nome}</h3>
                      <span className="text-xs text-text-muted">{frequenzeLabel[s.frequenza]}</span>
                    </div>
                  </div>
                  <p className="text-text-light text-sm mb-4 flex-1">{s.descrizione}</p>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-2xl text-primary font-bold">&euro; {Number(s.prezzo).toLocaleString('it-IT')}</p>
                      <p className="text-text-muted text-xs">/{s.frequenza === 'annuale' ? 'anno' : s.frequenza === 'una_tantum' ? 'volta' : 'volta'}</p>
                    </div>
                    {s.prezzo_annuale && (
                      <div className="text-right">
                        <p className="text-xs text-accent font-medium">Abbonamento annuale</p>
                        <p className="text-lg text-accent font-bold">&euro; {Number(s.prezzo_annuale).toLocaleString('it-IT')}/anno</p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Perché sceglierci */}
      <section className="py-16 bg-background-dark">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary text-center mb-8">Perché scegliere Funerix</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              'Operatori dedicati e rispettosi',
              'Foto inviate dopo ogni intervento',
              'Fiori sempre freschi e di qualità',
              'Copertura su tutta la Campania',
              'Annullabile in qualsiasi momento',
              'Assistenza WhatsApp dedicata',
              'Nessun vincolo contrattuale',
              'Prezzi trasparenti senza sorprese',
            ].map(t => (
              <div key={t} className="flex gap-2 text-sm text-text-light">
                <Check size={14} className="text-accent mt-0.5 flex-shrink-0" /> {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16 relative overflow-hidden">
        <Image src="/images/hero-fiori.png" alt="" fill className="object-cover opacity-15" sizes="100vw" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-white mb-4">Attivate il servizio</h2>
          <p className="text-white/80 mb-8">Contattateci per attivare l&apos;abbonamento o per un servizio una tantum.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <PhoneLink className="btn-accent text-lg py-4 px-10" showIcon label="Chiama Ora" />
            <Link href="/contatti" className="btn-secondary border-white/30 text-white hover:bg-white/10 hover:text-white text-lg py-4 px-10">
              Compila il Form <ChevronRight size={18} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
