import { Shield, Check, ChevronRight, Euro } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@supabase/supabase-js'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Piani Previdenza Funeraria — Funerix Previdenza',
  description: 'Confronta i piani previdenza funeraria Funerix. Base, Comfort e Premium. Prezzo bloccato, rate mensili.',
}

const borderColors = ['border-border', 'border-secondary', 'border-accent']

async function getPiani() {
  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { data } = await sb
    .from('tipi_piano')
    .select('*')
    .eq('attivo', true)
    .order('ordine_visualizzazione', { ascending: true })
  return data || []
}

export default async function PianiPrevidenzaPage() {
  const piani = await getPiani()

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary py-20 md:py-28 relative overflow-hidden">
        <Image src="/images/hero-previdenza-piani.png" alt="" fill className="object-cover opacity-20" sizes="100vw" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <Shield size={32} className="mx-auto mb-3 text-secondary-light" />
          <h1 className="font-[family-name:var(--font-serif)] text-3xl md:text-4xl text-white mb-3">Piani Previdenza Funerix</h1>
          <p className="text-white/80">Scegliete il piano piu adatto. Tutti con prezzo bloccato e rate mensili.</p>
        </div>
      </section>
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {piani.map((piano: any, i: number) => {
              const servizi = Array.isArray(piano.servizi_inclusi) ? piano.servizi_inclusi : []
              const isMiddle = i === 1
              return (
                <div key={piano.id} className={`card border-2 ${borderColors[i] || 'border-border'} relative`}>
                  {isMiddle && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary text-white text-xs px-3 py-1 rounded-full font-medium">
                      Consigliato
                    </div>
                  )}
                  <h3 className="font-[family-name:var(--font-serif)] text-2xl text-primary text-center mb-1">{piano.nome}</h3>
                  {piano.descrizione && <p className="text-text-muted text-xs text-center mb-3">{piano.descrizione}</p>}
                  <p className="text-center mb-4">
                    <span className="font-[family-name:var(--font-serif)] text-3xl text-primary font-bold">
                      &euro; {Number(piano.prezzo_base).toLocaleString('it-IT')}
                    </span>
                  </p>
                  <p className="text-center text-text-muted text-xs mb-4">
                    da &euro; {Math.ceil(piano.prezzo_base / piano.durata_max_mesi)}/mese per {piano.durata_max_mesi} mesi
                  </p>
                  <ul className="space-y-2 mb-6">
                    {servizi.map((s: any, j: number) => (
                      <li key={j} className="flex gap-2 text-sm text-text-light">
                        <Check size={14} className="text-accent mt-0.5 flex-shrink-0" />
                        {s.nome || s}
                      </li>
                    ))}
                  </ul>
                  <Link href={`/previdenza/configuratore?piano=${piano.slug}`} className="btn-primary w-full justify-center text-sm">
                    Scegli {piano.nome} <ChevronRight size={14} className="ml-1" />
                  </Link>
                </div>
              )
            })}
          </div>
          <p className="text-text-muted text-center text-sm mt-8">
            Tutti i piani sono personalizzabili nel configuratore. I prezzi mostrati sono indicativi.
          </p>
          <div className="mt-6 bg-primary/5 border border-primary/10 rounded-xl p-4 max-w-2xl mx-auto flex items-start gap-3">
            <Euro size={18} className="text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-primary">Non &egrave; un finanziamento</p>
              <p className="text-xs text-text-muted">&Egrave; un semplice prepagamento rateale per un servizio futuro. Nessun interesse, nessuna segnalazione a centrali rischi, nessun prodotto finanziario. Non serve autorizzazione IVASS.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
