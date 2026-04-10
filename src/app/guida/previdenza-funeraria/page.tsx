import Link from 'next/link'
import { Shield, Check, ChevronRight, Phone, AlertTriangle } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Guida alla Previdenza Funeraria — Pianificare il Funerale in Anticipo',
  description: 'Tutto sulla previdenza funeraria: come funziona, quanto costa, vantaggi, diritto di recesso. Guida completa per pianificare il funerale in anticipo.',
}

export default function GuidaPrevidenzaPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Shield size={40} className="mx-auto mb-4 text-secondary-light" />
          <h1 className="font-[family-name:var(--font-serif)] text-3xl md:text-4xl text-white mb-4">Guida alla Previdenza Funeraria</h1>
          <p className="text-white/80 text-lg">Tutto quello che dovete sapere per pianificare in anticipo.</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 prose max-w-none">
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary mb-6">Cos&apos;e la previdenza funeraria?</h2>
          <p className="text-text-light mb-4">La previdenza funeraria e un servizio che permette di <strong>pianificare e pagare in anticipo il proprio funerale</strong> o quello di un familiare. Non si tratta di un finanziamento o di un&apos;assicurazione, ma di un semplice <strong>prepagamento rateale per un servizio futuro</strong>.</p>
          <p className="text-text-light mb-8">E come comprare un viaggio a rate: scegliete ogni dettaglio oggi, pagate comodamente mese per mese, e quando il momento arrivera tutto sara gia organizzato e pagato.</p>

          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary mb-6">Come funziona?</h2>
          <div className="space-y-4 mb-8">
            {[
              { n: '1', t: 'Configurate il servizio', d: 'Scegliete ogni dettaglio: tipo di cerimonia, bara, fiori, trasporto, musica. Avrete un preventivo chiaro e dettagliato.' },
              { n: '2', t: 'Scegliete la durata', d: 'Da 12 a 60 rate mensili. Il prezzo e bloccato per sempre, indipendentemente dall\'inflazione.' },
              { n: '3', t: 'Pagate a rate', d: 'Addebito mensile automatico su carta o conto. Nessun interesse, nessuna maggiorazione.' },
              { n: '4', t: 'Firmate il contratto', d: 'Contratto chiaro con tutte le condizioni. Firma digitale direttamente online.' },
              { n: '5', t: 'Vivete sereni', d: 'Quando il momento arriva, Funerix si attiva automaticamente. La famiglia non deve decidere nulla.' },
            ].map(s => (
              <div key={s.n} className="flex gap-4 items-start">
                <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-secondary font-bold text-sm">{s.n}</span>
                </div>
                <div><h3 className="font-medium text-primary">{s.t}</h3><p className="text-text-light text-sm">{s.d}</p></div>
              </div>
            ))}
          </div>

          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary mb-6">Quanto costa?</h2>
          <p className="text-text-light mb-4">Il costo dipende dal servizio scelto. Funerix offre 3 piani base personalizzabili:</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              { nome: 'Base', prezzo: '3.500', rata: '~97/mese per 36 mesi' },
              { nome: 'Comfort', prezzo: '5.500', rata: '~153/mese per 36 mesi' },
              { nome: 'Premium', prezzo: '8.000', rata: '~222/mese per 36 mesi' },
            ].map(p => (
              <div key={p.nome} className="card text-center">
                <h3 className="font-[family-name:var(--font-serif)] text-lg text-primary mb-1">{p.nome}</h3>
                <p className="font-[family-name:var(--font-serif)] text-2xl font-bold text-primary">&euro; {p.prezzo}</p>
                <p className="text-text-muted text-xs mt-1">{p.rata}</p>
              </div>
            ))}
          </div>

          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary mb-6">I vostri diritti</h2>
          <div className="card bg-primary/5 border-primary/10 mb-8">
            <div className="flex gap-3 items-start">
              <AlertTriangle size={20} className="text-accent flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-medium text-primary mb-2">Diritto di recesso</h3>
                <ul className="space-y-2 text-sm text-text-light">
                  <li className="flex gap-2"><Check size={14} className="text-accent mt-0.5 flex-shrink-0" /> Entro 14 giorni dalla firma: rimborso totale al 100%</li>
                  <li className="flex gap-2"><Check size={14} className="text-accent mt-0.5 flex-shrink-0" /> Dopo 14 giorni: rimborso del versato meno 5% spese amministrative</li>
                  <li className="flex gap-2"><Check size={14} className="text-accent mt-0.5 flex-shrink-0" /> Potete annullare in qualsiasi momento, senza penali nascoste</li>
                  <li className="flex gap-2"><Check size={14} className="text-accent mt-0.5 flex-shrink-0" /> I fondi sono su conto dedicato separato, non aggredibile</li>
                </ul>
              </div>
            </div>
          </div>

          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary mb-6">Polizza di Copertura (opzionale)</h2>
          <p className="text-text-light mb-4">Funerix predispone la possibilita di abbinare al piano una <strong>polizza assicurativa di copertura</strong> tramite compagnie convenzionate. In caso di decesso del beneficiario prima del completamento delle rate, la polizza copre la differenza residua.</p>
          <p className="text-text-light mb-4">La polizza e facoltativa e viene emessa da compagnie assicurative autorizzate IVASS. Funerix non eroga direttamente il servizio assicurativo ma facilita l&apos;attivazione.</p>
          <p className="text-text-light mb-4"><strong>Senza polizza:</strong> se il beneficiario viene a mancare prima del completamento delle rate, il servizio verra erogato in proporzione a quanto versato oppure la famiglia potra saldare la differenza.</p>
          <p className="text-text-light mb-8"><strong>Con polizza:</strong> il servizio viene erogato integralmente indipendentemente dalle rate versate.</p>

          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary mb-6">Domande frequenti</h2>
          <div className="space-y-4 mb-8">
            {[
              { q: 'E un finanziamento?', a: 'No. E un prepagamento rateale per un servizio futuro. Non ci sono interessi, non serve IVASS, non e un prodotto finanziario.' },
              { q: 'Posso modificare le scelte?', a: 'Si, in qualsiasi momento contattando il consulente. Le modifiche non comportano costi aggiuntivi.' },
              { q: 'E trasferibile?', a: 'Si. Il piano puo essere trasferito a un altro familiare senza costi.' },
              { q: 'Cosa succede se salto una rata?', a: 'Riceverete un promemoria. Dopo 15 giorni il piano viene sospeso (riattivabile). Non perderete quanto versato.' },
              { q: 'E adatto per ospiti di RSA?', a: 'Si. Le RSA convenzionate possono proporre il piano ai familiari dei loro ospiti.' },
            ].map(f => (
              <div key={f.q} className="card">
                <h3 className="font-medium text-primary mb-1">{f.q}</h3>
                <p className="text-text-light text-sm">{f.a}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/previdenza/piani" className="btn-primary text-base py-4 px-10">
              Scopri i Piani <ChevronRight size={18} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
