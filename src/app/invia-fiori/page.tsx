'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Flower2, ChevronRight, Check, MapPin, Calendar, Camera, Heart, Send } from 'lucide-react'
import { PhoneLink } from '@/components/PhoneLink'
import { useSitoStore } from '@/store/sito'
import { useState } from 'react'

const composizioni = [
  { id: 'mazzo', nome: 'Mazzo di fiori freschi', desc: 'Composizione elegante di fiori di stagione', prezzo: 35 },
  { id: 'mazzo_rose', nome: 'Mazzo di rose', desc: '12 rose rosse o bianche con verde ornamentale', prezzo: 50 },
  { id: 'cuscino', nome: 'Cuscino floreale', desc: 'Composizione a cuscino per la tomba', prezzo: 80 },
  { id: 'composizione', nome: 'Composizione decorativa', desc: 'Fiori misti con vaso o cesto decorativo', prezzo: 60 },
  { id: 'corona_piccola', nome: 'Corona piccola', desc: 'Corona funebre con nastro personalizzato', prezzo: 120 },
  { id: 'pianta', nome: 'Pianta perenne', desc: 'Pianta resistente per decorazione permanente', prezzo: 40 },
]

const occasioni = [
  'Anniversario della scomparsa',
  'Compleanno del defunto',
  'Festa dei morti (2 novembre)',
  'Natale',
  'Pasqua',
  'Festa della mamma / del papà',
  'Senza occasione particolare',
]

export default function InviaFioriPage() {
  const { impostazioni } = useSitoStore()
  const [selected, setSelected] = useState('')
  const [inviato, setInviato] = useState(false)

  const composizione = composizioni.find(c => c.id === selected)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const data = {
      nome: (form.querySelector('[name=nome]') as HTMLInputElement)?.value,
      telefono: (form.querySelector('[name=telefono]') as HTMLInputElement)?.value,
      email: (form.querySelector('[name=email]') as HTMLInputElement)?.value || '',
      cimitero: (form.querySelector('[name=cimitero]') as HTMLInputElement)?.value,
      zona_tomba: (form.querySelector('[name=zona_tomba]') as HTMLInputElement)?.value,
      defunto: (form.querySelector('[name=defunto]') as HTMLInputElement)?.value,
      occasione: (form.querySelector('[name=occasione]') as HTMLSelectElement)?.value,
      data_consegna: (form.querySelector('[name=data_consegna]') as HTMLInputElement)?.value,
      messaggio_nastro: (form.querySelector('[name=messaggio_nastro]') as HTMLTextAreaElement)?.value || '',
      composizione: composizione?.nome,
      prezzo: composizione?.prezzo,
    }

    await useSitoStore.getState().aggiungiRichiesta({
      nome: data.nome, telefono: data.telefono, email: data.email,
      modalita: 'telefonata', orario: '',
      note: `INVIO FIORI — ${data.composizione} (€${data.prezzo}) — Cimitero: ${data.cimitero}, Zona: ${data.zona_tomba} — Per: ${data.defunto} — Occasione: ${data.occasione} — Data: ${data.data_consegna} — Nastro: ${data.messaggio_nastro}`,
      configurazione: '', totale: data.prezzo || 0, stato: 'nuova', createdAt: new Date().toISOString(),
    })
    setInviato(true)
  }

  if (inviato) return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="card py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center"><Check size={32} className="text-accent" /></div>
          <h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-2">Richiesta inviata</h2>
          <p className="text-text-light">Vi contatteremo entro 30 minuti per confermare la consegna e il pagamento.</p>
          {composizione && (
            <div className="mt-4 bg-secondary/10 rounded-xl p-4">
              <p className="font-[family-name:var(--font-serif)] text-xl text-primary font-bold">{composizione.nome}</p>
              <p className="text-secondary font-medium">&euro; {composizione.prezzo}</p>
            </div>
          )}
          <Link href="/" className="btn-primary mt-6 text-sm">Torna alla Home</Link>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-primary py-20 md:py-28 relative overflow-hidden">
        <Image src="/images/hero-fiori.png" alt="" fill className="object-cover opacity-20" sizes="100vw" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <Flower2 size={40} className="mx-auto mb-4 text-secondary-light" />
          <h1 className="font-[family-name:var(--font-serif)] text-4xl md:text-5xl text-white mb-4">
            Inviate Fiori sulla Tomba
          </h1>
          <p className="text-white/90 text-lg max-w-2xl mx-auto">
            Vivete lontano? Un fiore fresco sulla tomba dei vostri cari, anche quando non potete esserci.
            Consegna con foto di conferma su WhatsApp.
          </p>
        </div>
      </section>

      {/* Sezione emotiva */}
      <section className="py-12 bg-background-dark">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Heart size={28} className="mx-auto mb-3 text-secondary" />
          <p className="font-[family-name:var(--font-serif)] text-xl text-primary leading-relaxed">
            &ldquo;Anche se la distanza vi separa, un gesto d&apos;amore pu&ograve; arrivare ovunque.
            Scegliete i fiori, indicateci la tomba, e ci occupiamo di tutto noi.&rdquo;
          </p>
        </div>
      </section>

      {/* Come funziona */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary text-center mb-10">Come funziona</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { n: '01', icon: Flower2, t: 'Scegliete i fiori', d: 'Mazzo, cuscino, corona o pianta. Per ogni occasione.' },
              { n: '02', icon: MapPin, t: 'Indicateci la tomba', d: 'Cimitero, settore, fila e numero. Verifichiamo la posizione.' },
              { n: '03', icon: Calendar, t: 'Scegliete la data', d: 'Consegna in giornata o nella data che preferite.' },
              { n: '04', icon: Camera, t: 'Foto di conferma', d: 'Ricevete foto su WhatsApp della consegna effettuata.' },
            ].map(s => (
              <div key={s.n} className="text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-secondary/10 flex items-center justify-center">
                  <s.icon size={24} className="text-secondary" />
                </div>
                <span className="text-secondary/30 font-[family-name:var(--font-serif)] text-3xl font-bold">{s.n}</span>
                <h3 className="font-[family-name:var(--font-serif)] text-lg text-primary mt-1 mb-2">{s.t}</h3>
                <p className="text-text-muted text-sm">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scelta composizione */}
      <section className="py-16 bg-background-dark">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary text-center mb-4">Scegliete la composizione</h2>
          <p className="text-text-light text-center mb-10">Fiori freschi di stagione, consegnati con cura sul luogo di sepoltura.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {composizioni.map(c => (
              <div key={c.id} onClick={() => setSelected(c.id)}
                className={`card cursor-pointer transition-all ${selected === c.id ? 'border-2 border-secondary bg-secondary/5' : 'hover:border-secondary/30'}`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Flower2 size={18} className="text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-[family-name:var(--font-serif)] text-lg text-primary">{c.nome}</h3>
                  </div>
                </div>
                <p className="text-text-light text-sm mb-3">{c.desc}</p>
                <div className="flex items-center justify-between">
                  <p className="font-[family-name:var(--font-serif)] text-2xl text-primary font-bold">&euro; {c.prezzo}</p>
                  {selected === c.id && <span className="text-accent text-sm font-medium">Selezionato</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form ordine */}
      {selected && (
        <section className="py-16">
          <div className="max-w-2xl mx-auto px-4">
            <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary text-center mb-8">Dettagli consegna</h2>
            <form className="card space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-text mb-1">Per chi sono i fiori? *</label>
                <input name="defunto" required className="input-field" placeholder="Nome del defunto" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Cimitero *</label>
                  <input name="cimitero" required className="input-field" placeholder="Es. Poggioreale, Napoli" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Zona tomba *</label>
                  <input name="zona_tomba" required className="input-field" placeholder="Settore, fila, numero" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Occasione</label>
                  <select name="occasione" className="input-field">
                    {occasioni.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Data consegna desiderata *</label>
                  <input name="data_consegna" type="date" required className="input-field" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1">Messaggio sul nastro (opzionale)</label>
                <textarea name="messaggio_nastro" rows={2} className="input-field" placeholder="Es. Con affetto, la vostra famiglia" />
              </div>

              <div className="border-t border-border pt-5 space-y-4">
                <h3 className="font-medium text-primary">I vostri dati</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-text mb-1">Nome *</label><input name="nome" required className="input-field" /></div>
                  <div><label className="block text-sm font-medium text-text mb-1">Telefono *</label><input name="telefono" required className="input-field" /></div>
                  <div><label className="block text-sm font-medium text-text mb-1">Email</label><input name="email" type="email" className="input-field" /></div>
                </div>
              </div>

              <div className="bg-secondary/10 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted">Composizione selezionata</p>
                  <p className="font-medium text-primary">{composizione?.nome}</p>
                </div>
                <p className="font-[family-name:var(--font-serif)] text-2xl text-primary font-bold">&euro; {composizione?.prezzo}</p>
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" required className="w-5 h-5 mt-0.5 rounded" />
                <span className="text-sm text-text-light">Acconsento al trattamento dei dati personali ai sensi del GDPR. *</span>
              </label>

              <button type="submit" className="btn-accent w-full py-4">
                <Send size={16} className="mr-2" /> Invia Richiesta
              </button>

              <p className="text-text-muted text-xs text-center">
                Vi contatteremo entro 30 minuti per confermare la consegna. Il pagamento avviene dopo la conferma.
              </p>
            </form>
          </div>
        </section>
      )}

      {/* Perché sceglierci */}
      <section className="py-16 bg-background-dark">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary text-center mb-8">Perch&eacute; scegliere Funerix</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              'Fiori freschi di stagione, mai artificiali',
              'Consegna con foto su WhatsApp',
              'Copertura su tutti i cimiteri della Campania',
              'Messaggio personalizzato sul nastro',
              'Consegna in giornata o data a scelta',
              'Nessun costo nascosto',
            ].map(t => (
              <div key={t} className="flex gap-2 text-sm text-text-light">
                <Check size={14} className="text-accent mt-0.5 flex-shrink-0" /> {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Abbonamento */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-text-light mb-4">Volete fiori freschi ogni mese? Scoprite i nostri abbonamenti ricorrenti.</p>
          <Link href="/servizi-ricorrenti" className="btn-secondary text-sm">
            Abbonamento Fiori Mensile <ChevronRight size={14} className="ml-1" />
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16 relative overflow-hidden">
        <Image src="/images/hero-fiori.png" alt="" fill className="object-cover opacity-15" sizes="100vw" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-white mb-4">Un pensiero che arriva lontano</h2>
          <p className="text-white/80 mb-8">Anche a distanza, potete dimostrare il vostro affetto con un gesto concreto.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <PhoneLink className="btn-accent text-lg py-4 px-10" showIcon label="Chiama Ora" />
            <Link href="/contatti" className="btn-secondary border-white/30 text-white hover:bg-white/10 hover:text-white text-lg py-4 px-10">
              Scrivici <ChevronRight size={18} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
