'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Heart, ChevronRight, Check, Flower2, Send, MessageCircle, MapPin } from 'lucide-react'
import { PhoneLink } from '@/components/PhoneLink'
import { LuogoSelector } from '@/components/LuogoSelector'
import { PaymentButton } from '@/components/PaymentButton'
import { useSitoStore } from '@/store/sito'
import { useState } from 'react'

const opzioniFiori = [
  { id: 'nessuno', nome: 'Solo messaggio', desc: 'Inviate le vostre condoglianze senza fiori', prezzo: 0 },
  { id: 'mazzo', nome: 'Mazzo di fiori', desc: 'Composizione elegante di fiori di stagione', prezzo: 35 },
  { id: 'cuscino', nome: 'Cuscino floreale', desc: 'Composizione a cuscino con nastro personalizzato', prezzo: 80 },
  { id: 'corona', nome: 'Corona funebre', desc: 'Corona con nastro e dedica personalizzata', prezzo: 150 },
]

export default function CondoglianzePage() {
  const [fioriSel, setFioriSel] = useState('nessuno')
  const [luogoConsegna, setLuogoConsegna] = useState('')
  const [luogoNome, setLuogoNome] = useState('')
  const [inviato, setInviato] = useState(false)

  const fiori = opzioniFiori.find(f => f.id === fioriSel)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const data = {
      mittente_nome: (form.querySelector('[name=mittente_nome]') as HTMLInputElement)?.value,
      mittente_telefono: (form.querySelector('[name=mittente_telefono]') as HTMLInputElement)?.value,
      mittente_email: (form.querySelector('[name=mittente_email]') as HTMLInputElement)?.value || '',
      destinatario_famiglia: (form.querySelector('[name=destinatario_famiglia]') as HTMLInputElement)?.value,
      defunto_nome: (form.querySelector('[name=defunto_nome]') as HTMLInputElement)?.value,
      messaggio: (form.querySelector('[name=messaggio]') as HTMLTextAreaElement)?.value,
      luogo: luogoConsegna,
      indirizzo: (form.querySelector('[name=indirizzo_consegna]') as HTMLInputElement)?.value || '',
      fiori: fiori?.nome,
      prezzo: fiori?.prezzo || 0,
      nastro: (form.querySelector('[name=nastro]') as HTMLInputElement)?.value || '',
    }

    await useSitoStore.getState().aggiungiRichiesta({
      nome: data.mittente_nome, telefono: data.mittente_telefono, email: data.mittente_email,
      modalita: 'telefonata', orario: '',
      note: `CONDOGLIANZE — Da: ${data.mittente_nome} — A famiglia: ${data.destinatario_famiglia} — Defunto: ${data.defunto_nome} — Consegna: ${data.luogo} (${data.indirizzo}) — Messaggio: "${data.messaggio}" — Fiori: ${data.fiori} (€${data.prezzo})${data.nastro ? ` — Nastro: "${data.nastro}"` : ''}`,
      configurazione: '', totale: data.prezzo, stato: 'nuova', createdAt: new Date().toISOString(),
    })
    setInviato(true)
  }

  if (inviato) return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="card py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center"><Heart size={32} className="text-accent" /></div>
          <h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-2">Condoglianze inviate</h2>
          <p className="text-text-light">Il vostro messaggio e i fiori verranno consegnati alla famiglia. Vi contatteremo per la conferma.</p>
          <Link href="/" className="btn-primary mt-6 text-sm">Torna alla Home</Link>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-primary py-20 md:py-28 relative overflow-hidden">
        <Image src="/images/hero-principale.png" alt="" fill className="object-cover opacity-20" sizes="100vw" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <Heart size={40} className="mx-auto mb-4 text-secondary-light" />
          <h1 className="font-[family-name:var(--font-serif)] text-4xl md:text-5xl text-white mb-4">
            Inviate le Vostre Condoglianze
          </h1>
          <p className="text-white/90 text-lg max-w-2xl mx-auto">
            Un messaggio di vicinanza e, se lo desiderate, una composizione floreale
            consegnata direttamente alla famiglia o sulla tomba.
          </p>
        </div>
      </section>

      {/* Come funziona */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary text-center mb-10">Come funziona</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { n: '01', icon: MessageCircle, t: 'Scrivete il messaggio', d: 'Esprimete la vostra vicinanza alla famiglia con un messaggio personale.' },
              { n: '02', icon: Flower2, t: 'Aggiungete i fiori', d: 'Scegliete una composizione floreale da consegnare alla famiglia o sulla tomba.' },
              { n: '03', icon: Heart, t: 'Noi consegniamo', d: 'Portiamo il vostro messaggio e i fiori. Foto di conferma su WhatsApp.' },
            ].map(s => (
              <div key={s.n} className="text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-secondary/10 flex items-center justify-center">
                  <s.icon size={24} className="text-secondary" />
                </div>
                <span className="text-secondary/30 text-3xl font-bold">{s.n}</span>
                <h3 className="font-[family-name:var(--font-serif)] text-lg text-primary mt-1 mb-2">{s.t}</h3>
                <p className="text-text-muted text-sm">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-16 bg-background-dark">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary text-center mb-8">Le vostre condoglianze</h2>

          <form className="card space-y-5" onSubmit={handleSubmit}>
            {/* Destinatario */}
            <div>
              <h3 className="font-medium text-primary mb-3">A chi sono destinate?</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Famiglia destinataria *</label>
                  <input name="destinatario_famiglia" required className="input-field" placeholder="Es. Famiglia Esposito" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Nome del defunto *</label>
                  <input name="defunto_nome" required className="input-field" placeholder="Es. Giuseppe Esposito" />
                </div>
              </div>
            </div>

            {/* Dove consegnare */}
            <div>
              <h3 className="font-medium text-primary mb-3">Dove consegnare?</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                {[
                  { id: 'cimitero', label: 'Cimitero', desc: 'Sulla tomba' },
                  { id: 'chiesa', label: 'Chiesa', desc: 'Per la cerimonia' },
                  { id: 'domicilio', label: 'A domicilio', desc: 'Casa della famiglia' },
                ].map(l => (
                  <div key={l.id} onClick={() => { setLuogoConsegna(l.id); setLuogoNome('') }}
                    className={`card cursor-pointer text-center py-3 transition-all ${luogoConsegna === l.id ? 'border-2 border-secondary bg-secondary/5' : 'hover:border-secondary/30'}`}>
                    <MapPin size={18} className={`mx-auto mb-1 ${luogoConsegna === l.id ? 'text-secondary' : 'text-text-muted'}`} />
                    <p className="font-medium text-primary text-sm">{l.label}</p>
                    <p className="text-text-muted text-xs">{l.desc}</p>
                  </div>
                ))}
              </div>
              {luogoConsegna === 'cimitero' && (
                <div className="space-y-3">
                  <LuogoSelector tipo="cimitero" value={luogoNome} onChange={setLuogoNome} required />
                  <div>
                    <label className="block text-sm font-medium text-text mb-1">Posizione tomba (settore, fila, numero)</label>
                    <input name="indirizzo_consegna" className="input-field" placeholder="Es. Settore 3, Fila 12, n. 45" />
                  </div>
                </div>
              )}
              {luogoConsegna === 'chiesa' && (
                <LuogoSelector tipo="chiesa" value={luogoNome} onChange={setLuogoNome} required />
              )}
              {luogoConsegna === 'domicilio' && (
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Indirizzo completo *</label>
                  <input name="indirizzo_consegna" required className="input-field" placeholder="Es. Via Roma 25, 80100 Napoli" value={luogoNome} onChange={e => setLuogoNome(e.target.value)} />
                </div>
              )}
            </div>

            {/* Messaggio */}
            <div>
              <label className="block text-sm font-medium text-text mb-1">Il vostro messaggio di condoglianze *</label>
              <textarea name="messaggio" required rows={4} className="input-field"
                placeholder="Es. Carissimi, siamo vicini a voi in questo momento di dolore..." />
            </div>

            {/* Fiori opzionali */}
            <div>
              <h3 className="font-medium text-primary mb-3">Desiderate aggiungere dei fiori?</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {opzioniFiori.map(f => (
                  <div key={f.id} onClick={() => setFioriSel(f.id)}
                    className={`card cursor-pointer transition-all text-center py-4 ${fioriSel === f.id ? 'border-2 border-secondary bg-secondary/5' : 'hover:border-secondary/30'}`}>
                    {f.id !== 'nessuno' ? <Flower2 size={24} className="mx-auto mb-2 text-secondary" /> : <MessageCircle size={24} className="mx-auto mb-2 text-text-muted" />}
                    <h4 className="font-medium text-primary text-sm">{f.nome}</h4>
                    <p className="text-text-muted text-xs mt-1">{f.desc}</p>
                    {f.prezzo > 0 && <p className="text-lg text-primary font-bold mt-2">&euro; {f.prezzo}</p>}
                    {f.prezzo === 0 && <p className="text-accent text-xs font-medium mt-2">Gratuito</p>}
                  </div>
                ))}
              </div>
            </div>

            {/* Nastro */}
            {fioriSel !== 'nessuno' && (
              <div>
                <label className="block text-sm font-medium text-text mb-1">Dedica sul nastro (opzionale)</label>
                <input name="nastro" className="input-field" placeholder="Es. Con affetto e vicinanza, la famiglia Russo" />
              </div>
            )}

            {/* Dati mittente */}
            <div className="border-t border-border pt-5 space-y-4">
              <h3 className="font-medium text-primary">I vostri dati</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-text mb-1">Il vostro nome *</label><input name="mittente_nome" required className="input-field" /></div>
                <div><label className="block text-sm font-medium text-text mb-1">Telefono *</label><input name="mittente_telefono" required className="input-field" /></div>
                <div><label className="block text-sm font-medium text-text mb-1">Email *</label><input name="mittente_email" type="email" required className="input-field" /></div>
              </div>
            </div>

            {/* Riepilogo */}
            {fioriSel !== 'nessuno' && fiori && (
              <div className="bg-secondary/10 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted">Composizione floreale</p>
                  <p className="font-medium text-primary">{fiori.nome}</p>
                </div>
                <p className="text-2xl text-primary font-bold">&euro; {fiori.prezzo}</p>
              </div>
            )}

            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" required className="w-5 h-5 mt-0.5 rounded" />
              <span className="text-sm text-text-light">Acconsento al trattamento dei dati personali ai sensi del GDPR. *</span>
            </label>

            {fioriSel !== 'nessuno' && fiori && fiori.prezzo > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button type="submit" className="btn-primary py-4">
                  <Send size={16} className="mr-2" /> Invia Richiesta
                </button>
                <PaymentButton
                  amount={fiori.prezzo}
                  label="Paga e Invia"
                  onPaymentRequest={async () => {
                    const form = document.querySelector('form') as HTMLFormElement
                    if (form?.checkValidity()) form.requestSubmit()
                  }}
                />
              </div>
            ) : (
              <button type="submit" className="btn-accent w-full py-4">
                <Send size={16} className="mr-2" /> Invia Condoglianze
              </button>
            )}

            <p className="text-text-muted text-xs text-center">
              Vi contatteremo per confermare la consegna. Il pagamento dei fiori avviene dopo la conferma.
            </p>
          </form>
        </div>
      </section>

      {/* Memorial */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-3">Cercate un Memorial?</h2>
          <p className="text-text-light mb-4">Se il defunto ha una pagina memorial su Funerix, potete lasciare un messaggio direttamente l&igrave;.</p>
          <Link href="/memorial" className="btn-secondary text-sm">
            Cerca Memorial <ChevronRight size={14} className="ml-1" />
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-white mb-4">Siamo qui per voi</h2>
          <p className="text-white/80 mb-8">Un gesto di vicinanza, anche quando non potete esserci di persona.</p>
          <PhoneLink className="btn-accent text-lg py-4 px-10" showIcon label="Chiama Ora" />
        </div>
      </section>
    </div>
  )
}
