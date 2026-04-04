import Link from 'next/link'
import { Heart, Phone, ChevronRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cremazione Animali Domestici — Cani, Gatti',
  description: 'Servizio di cremazione per animali domestici in Campania. Cremazione individuale con restituzione ceneri. Urne e memorial per il tuo amico a quattro zampe.',
}

const servizi = [
  { nome: 'Cremazione individuale cane (piccola taglia)', prezzo: '150 — 200', desc: 'Fino a 10 kg. Restituzione ceneri in urna.' },
  { nome: 'Cremazione individuale cane (media taglia)', prezzo: '200 — 300', desc: 'Da 10 a 25 kg. Restituzione ceneri in urna.' },
  { nome: 'Cremazione individuale cane (grande taglia)', prezzo: '300 — 450', desc: 'Oltre 25 kg. Restituzione ceneri in urna.' },
  { nome: 'Cremazione individuale gatto', prezzo: '120 — 180', desc: 'Restituzione ceneri in urna dedicata.' },
  { nome: 'Cremazione collettiva', prezzo: '50 — 100', desc: 'Senza restituzione ceneri. Dispersione in area dedicata.' },
  { nome: 'Ritiro a domicilio', prezzo: '50 — 80', desc: 'Ritiro del vostro animale presso la vostra abitazione.' },
  { nome: 'Urna commemorativa', prezzo: '30 — 150', desc: 'Ampia scelta di urne in ceramica, legno e marmo.' },
]

export default function CremazioneAnimaliPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Heart size={40} className="mx-auto mb-4 text-secondary-light" />
          <h1 className="font-[family-name:var(--font-serif)] text-4xl md:text-5xl text-white mb-4">
            Cremazione Animali Domestici
          </h1>
          <p className="text-white/90 text-lg max-w-2xl mx-auto">
            Un ultimo saluto dignitoso per il vostro amico a quattro zampe.
            Servizio rispettoso e professionale in tutta la Campania.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="prose max-w-none text-text-light mb-12">
            <p className="text-lg">
              Sappiamo quanto sia doloroso perdere un compagno di vita. Per questo offriamo un servizio
              di cremazione dedicato agli animali domestici, con la stessa cura e rispetto che riserviamo
              alle persone.
            </p>
          </div>

          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary mb-8 text-center">Servizi e prezzi</h2>
          <div className="space-y-3 mb-16">
            {servizi.map(s => (
              <div key={s.nome} className="card flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <h3 className="font-medium text-primary">{s.nome}</h3>
                  <p className="text-text-muted text-sm">{s.desc}</p>
                </div>
                <span className="font-[family-name:var(--font-serif)] text-xl text-primary font-semibold whitespace-nowrap">
                  &euro; {s.prezzo}
                </span>
              </div>
            ))}
          </div>

          <div className="card bg-secondary/5 border-secondary/20 text-center">
            <h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-3">
              Come procedere
            </h2>
            <p className="text-text-light mb-6 max-w-xl mx-auto">
              Contattateci telefonicamente o via WhatsApp. Organizzeremo il ritiro del vostro animale
              e vi accompagneremo in ogni fase con delicatezza e rispetto.
            </p>
            <a href="tel:+390815551234" className="btn-primary">
              <Phone size={18} className="mr-2" /> Chiama Ora
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
