'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Send, Bot, User, Phone, MessageCircle, ChevronDown, ChevronRight, Heart } from 'lucide-react'
import { useSitoStore } from '@/store/sito'

// FAQ database — il chatbot risponde da qui
const faqDatabase = [
  {
    keywords: ['costo', 'costa', 'prezzo', 'quanto', 'preventivo', 'spesa'],
    domanda: 'Quanto costa un funerale?',
    risposta: 'Il costo di un funerale in Campania varia in base al servizio scelto:\n\n• Funerale economico: €2.500 - €4.000\n• Funerale standard: €5.000 - €8.000\n• Funerale completo: €8.000 - €12.000\n• Cremazione: €2.000 - €4.500\n\nPotete ottenere un preventivo dettagliato e personalizzato usando il nostro configuratore online. Il preventivo è indicativo e senza impegno.',
  },
  {
    keywords: ['documento', 'documenti', 'carta', 'tessera', 'certificato', 'serve'],
    domanda: 'Quali documenti servono?',
    risposta: 'Per organizzare un funerale servono:\n\n• Carta d\'identità del defunto\n• Tessera sanitaria\n• Certificato di morte (rilasciato dal medico)\n\nNoi ci occupiamo di tutto il resto: denuncia di morte al Comune, autorizzazione al trasporto, pratiche cimiteriali e autorizzazione alla sepoltura o cremazione.',
  },
  {
    keywords: ['cremazione', 'cremare', 'crematorio', 'ceneri', 'urna'],
    domanda: 'Come funziona la cremazione?',
    risposta: 'La cremazione in Campania prevede:\n\n1. Richiesta firmata dai familiari\n2. Autorizzazione ASL\n3. Trasporto al crematorio (Poggioreale a Napoli o Salerno)\n4. Cremazione\n5. Consegna urna alla famiglia\n\nTempi: 10-30 giorni per la disponibilità del crematorio.\nCosto tariffa cremazione: €500-€800 + urna €80-€1.200.\n\nCi occupiamo noi di tutta la procedura.',
  },
  {
    keywords: ['tempo', 'tempi', 'quando', 'quanto tempo', 'veloce', 'urgente', 'contatt'],
    domanda: 'In quanto tempo vengo contattato?',
    risposta: 'Un nostro consulente vi contatterà entro 30 minuti dall\'invio della richiesta, 24 ore su 24, 7 giorni su 7.\n\nPotete scegliere come essere contattati: telefonata, videochiamata o WhatsApp.\n\nPer urgenze immediate, chiamateci direttamente.',
  },
  {
    keywords: ['configuratore', 'online', 'configura', 'scegliere', 'personalizza'],
    domanda: 'Come funziona il configuratore?',
    risposta: 'Il nostro configuratore vi guida in 8 semplici step:\n\n1. Scelta tipo di servizio (inumazione, tumulazione, cremazione)\n2. Scelta della bara o urna\n3. Trasporto funebre\n4. Tipo di cerimonia\n5. Fiori e addobbi\n6. Servizi extra\n7. Riepilogo e preventivo\n8. Richiesta di contatto\n\nÈ completamente gratuito e senza impegno. Il preventivo è indicativo.',
  },
  {
    keywords: ['memorial', 'ricordo', 'pagina', 'qr', 'necrologio', 'condoglianz'],
    domanda: 'Cos\'è il Memorial Online?',
    risposta: 'Il Memorial Online è una pagina web dedicata al vostro caro dove:\n\n• Familiari e amici possono lasciare messaggi di condoglianze\n• Si possono condividere foto e ricordi\n• Include un QR Code stampabile su lapide o santino\n• Possibilità di raccogliere donazioni in memoria\n\nÈ un servizio incluso nel nostro pacchetto e resta attivo per sempre.',
  },
  {
    keywords: ['zona', 'dove', 'napoli', 'caserta', 'salerno', 'campania', 'coprite', 'servite'],
    domanda: 'Quali zone coprite?',
    risposta: 'Operiamo in tutta la Campania:\n\n• Napoli e provincia\n• Caserta e provincia\n• Salerno e provincia\n• Avellino e provincia\n• Benevento e provincia\n\nSiamo disponibili 24 ore su 24, 7 giorni su 7.',
  },
  {
    keywords: ['preventivo', 'vincolante', 'obbligo', 'impegno', 'gratuito', 'gratis'],
    domanda: 'Il preventivo è vincolante?',
    risposta: 'No, il preventivo generato dal configuratore è puramente indicativo e non costituisce proposta contrattuale.\n\nNon c\'è nessun obbligo e nessun impegno. Il prezzo definitivo viene concordato con il consulente durante il primo colloquio.\n\nIl servizio di configurazione e preventivo è completamente gratuito.',
  },
  {
    keywords: ['modifica', 'cambiare', 'dopo', 'annullare'],
    domanda: 'Posso modificare il servizio dopo la richiesta?',
    risposta: 'Assolutamente sì. La configurazione online è solo un punto di partenza.\n\nIl consulente personalizzerà ogni dettaglio in base alle vostre esigenze durante il colloquio. Potete aggiungere, rimuovere o modificare qualsiasi elemento del servizio.',
  },
  {
    keywords: ['pagamento', 'pagare', 'rate', 'acconto', 'carta', 'bonifico'],
    domanda: 'Come posso pagare?',
    risposta: 'Accettiamo diversi metodi di pagamento:\n\n• Contanti\n• Bonifico bancario\n• Carta di credito/debito\n• PayPal\n• Pagamento a rate (Klarna)\n\nIl consulente vi illustrerà tutte le opzioni durante il colloquio.',
  },
  {
    keywords: ['notte', 'sera', 'festivo', 'domenica', 'orario', 'disponibil'],
    domanda: 'Siete disponibili di notte e nei festivi?',
    risposta: 'Sì, siamo disponibili 24 ore su 24, 7 giorni su 7, inclusi festivi e notturni.\n\nChiamateci o inviate una richiesta dal configuratore a qualsiasi ora. Un consulente vi risponderà sempre entro 30 minuti.',
  },
]

interface Messaggio {
  autore: 'bot' | 'utente'
  testo: string
  timestamp: Date
}

function trovaRisposta(domanda: string): string {
  const lower = domanda.toLowerCase()
  for (const faq of faqDatabase) {
    if (faq.keywords.some(k => lower.includes(k))) {
      return faq.risposta
    }
  }
  return 'Mi dispiace, non ho trovato una risposta precisa alla vostra domanda. Vi consiglio di:\n\n• Usare il configuratore per un preventivo personalizzato\n• Contattarci direttamente per telefono\n• Scriverci su WhatsApp\n\nUn consulente sarà felice di aiutarvi.'
}

export default function AssistenzaPage() {
  const { impostazioni } = useSitoStore()
  const [messaggi, setMessaggi] = useState<Messaggio[]>([
    { autore: 'bot', testo: 'Buongiorno, sono l\'assistente Funerix. Come posso aiutarvi?\n\nPotete farmi domande su costi, documenti, cremazione, tempistiche, o qualsiasi altra informazione.\n\nOppure cliccate su una delle domande frequenti qui sotto.', timestamp: new Date() },
  ])
  const [input, setInput] = useState('')
  const [faqAperta, setFaqAperta] = useState<number | null>(null)
  const chatRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' })
  }, [messaggi])

  const inviaMessaggio = (testo: string) => {
    if (!testo.trim()) return
    const nuoviMsg: Messaggio[] = [
      ...messaggi,
      { autore: 'utente', testo, timestamp: new Date() },
    ]
    setMessaggi(nuoviMsg)
    setInput('')

    // Risposta bot con delay
    setTimeout(() => {
      const risposta = trovaRisposta(testo)
      setMessaggi(prev => [...prev, { autore: 'bot', testo: risposta, timestamp: new Date() }])
    }, 800)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-primary py-20 md:py-28 relative overflow-hidden">
        <Image src="/images/hero-principale.png" alt="" fill className="object-cover opacity-20" sizes="100vw" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-[family-name:var(--font-serif)] text-4xl md:text-5xl text-white">
            Come possiamo aiutarvi?
          </h1>
          <p className="mt-3 text-white/80">
            Chiedete all&apos;assistente o contattate direttamente un consulente
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chat */}
          <div className="lg:col-span-2">
            <div className="card p-0 overflow-hidden">
              {/* Header chat */}
              <div className="bg-primary px-5 py-3 flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Assistente Funerix</p>
                  <p className="text-white/60 text-[10px]">Risponde subito alle vostre domande</p>
                </div>
              </div>

              {/* Messaggi */}
              <div ref={chatRef} className="h-96 overflow-y-auto p-4 space-y-4 bg-background-dark">
                {messaggi.map((msg, i) => (
                  <div key={i} className={`flex gap-2 ${msg.autore === 'utente' ? 'justify-end' : ''}`}>
                    {msg.autore === 'bot' && (
                      <div className="w-7 h-7 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Bot size={14} className="text-secondary" />
                      </div>
                    )}
                    <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-line ${
                      msg.autore === 'bot'
                        ? 'bg-surface text-text border border-border rounded-tl-none'
                        : 'bg-primary text-white rounded-tr-none'
                    }`}>
                      {msg.testo}
                    </div>
                    {msg.autore === 'utente' && (
                      <div className="w-7 h-7 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <User size={14} className="text-primary" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Suggerimenti rapidi */}
              <div className="px-4 py-2 border-t border-border flex gap-2 overflow-x-auto">
                {['Quanto costa?', 'Quali documenti?', 'Cremazione', 'Zone coperte', 'Memorial'].map(s => (
                  <button key={s} onClick={() => inviaMessaggio(s)}
                    className="text-[10px] px-3 py-1.5 bg-secondary/10 text-secondary rounded-full whitespace-nowrap hover:bg-secondary/20 transition-colors">
                    {s}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="p-3 border-t border-border flex gap-2">
                <input
                  type="text" className="input-field flex-1 text-sm py-2"
                  placeholder="Scrivete la vostra domanda..."
                  value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && inviaMessaggio(input)}
                />
                <button onClick={() => inviaMessaggio(input)} className="btn-primary px-4 py-2">
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contatto diretto */}
            <div className="card">
              <h3 className="font-[family-name:var(--font-serif)] text-lg text-primary mb-4">Contatto diretto</h3>
              <p className="text-text-light text-sm mb-4">
                Preferite parlare con un consulente? Siamo disponibili 24/7.
              </p>
              <div className="space-y-2">
                <a href={`tel:${impostazioni.telefono.replace(/\s/g, '')}`}
                  className="btn-primary w-full text-sm py-3 justify-center">
                  <Phone size={16} className="mr-2" /> Chiama {impostazioni.telefono}
                </a>
                <a href={`https://wa.me/${impostazioni.whatsapp.replace(/\s/g, '')}`} target="_blank" rel="noopener noreferrer"
                  className="btn-secondary w-full text-sm py-3 justify-center border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white">
                  <MessageCircle size={16} className="mr-2" /> WhatsApp
                </a>
                <Link href="/configuratore"
                  className="btn-secondary w-full text-sm py-3 justify-center">
                  <Heart size={16} className="mr-2" /> Configura il Servizio
                </Link>
              </div>
            </div>

            {/* FAQ */}
            <div className="card">
              <h3 className="font-[family-name:var(--font-serif)] text-lg text-primary mb-4">Domande frequenti</h3>
              <div className="space-y-1 max-h-72 overflow-y-auto">
                {faqDatabase.map((faq, i) => (
                  <div key={i}>
                    <button
                      onClick={() => setFaqAperta(faqAperta === i ? null : i)}
                      className="w-full text-left flex items-center justify-between py-2 px-2 text-sm text-text hover:bg-background rounded transition-colors"
                    >
                      <span className="pr-2">{faq.domanda}</span>
                      <ChevronDown size={14} className={`text-text-muted flex-shrink-0 transition-transform ${faqAperta === i ? 'rotate-180' : ''}`} />
                    </button>
                    {faqAperta === i && (
                      <div className="px-2 pb-3 text-xs text-text-light whitespace-pre-line leading-relaxed bg-background rounded-b mx-2">
                        {faq.risposta}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
