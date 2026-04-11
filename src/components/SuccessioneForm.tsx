'use client'

import { useState } from 'react'
import { Check, Send } from 'lucide-react'
import { useSitoStore } from '@/store/sito'

export function SuccessioneForm() {
  const [inviato, setInviato] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const nome = (form.querySelector('[name=nome]') as HTMLInputElement)?.value
    const telefono = (form.querySelector('[name=telefono]') as HTMLInputElement)?.value
    const email = (form.querySelector('[name=email]') as HTMLInputElement)?.value
    const tipo = (form.querySelector('[name=tipo_pratica]') as HTMLSelectElement)?.value
    const defuntoNome = (form.querySelector('[name=defunto_nome]') as HTMLInputElement)?.value || ''
    const defuntoData = (form.querySelector('[name=defunto_data]') as HTMLInputElement)?.value || ''
    const relazione = (form.querySelector('[name=relazione]') as HTMLSelectElement)?.value || ''
    const numEredi = (form.querySelector('[name=num_eredi]') as HTMLInputElement)?.value || ''
    const note = (form.querySelector('[name=note]') as HTMLTextAreaElement)?.value || ''

    const dettagli = [
      defuntoNome ? `Defunto: ${defuntoNome}` : '',
      defuntoData ? `Data decesso: ${defuntoData}` : '',
      relazione ? `Relazione: ${relazione}` : '',
      numEredi ? `N. eredi: ${numEredi}` : '',
    ].filter(Boolean).join(' — ')

    await useSitoStore.getState().aggiungiRichiesta({
      nome, telefono, email, modalita: 'telefonata', orario: '',
      note: `SUCCESSIONE — Tipo: ${tipo}${dettagli ? ` — ${dettagli}` : ''}${note ? ` — Note: ${note}` : ''}`,
      configurazione: '', totale: 0, stato: 'nuova', createdAt: new Date().toISOString(),
    })
    setInviato(true)
  }

  if (inviato) return (
    <div className="card text-center py-12">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center"><Check size={32} className="text-accent" /></div>
      <h3 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-2">Richiesta inviata</h3>
      <p className="text-text-light">Vi contatteremo entro 30 minuti per discutere la vostra pratica.</p>
    </div>
  )

  return (
    <form className="card space-y-5" onSubmit={handleSubmit}>
      {/* Dati defunto */}
      <div>
        <h3 className="font-medium text-primary mb-3">Informazioni sul defunto</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-text mb-1">Nome e cognome del defunto</label><input name="defunto_nome" className="input-field" placeholder="Es. Giuseppe Esposito" /></div>
          <div><label className="block text-sm font-medium text-text mb-1">Data del decesso</label><input name="defunto_data" type="date" className="input-field" /></div>
          <div><label className="block text-sm font-medium text-text mb-1">La vostra relazione</label>
            <select name="relazione" className="input-field">
              <option value="">Selezionate...</option>
              <option value="figlio/a">Figlio/a</option>
              <option value="coniuge">Coniuge</option>
              <option value="fratello/sorella">Fratello/Sorella</option>
              <option value="nipote">Nipote</option>
              <option value="altro">Altro parente</option>
            </select>
          </div>
          <div><label className="block text-sm font-medium text-text mb-1">Numero eredi</label><input name="num_eredi" type="number" min="1" className="input-field" placeholder="Es. 3" /></div>
        </div>
      </div>

      {/* Tipo pratica */}
      <div>
        <h3 className="font-medium text-primary mb-3">I vostri dati</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-text mb-1">Nome *</label><input name="nome" required className="input-field" /></div>
          <div><label className="block text-sm font-medium text-text mb-1">Telefono *</label><input name="telefono" required className="input-field" /></div>
          <div><label className="block text-sm font-medium text-text mb-1">Email *</label><input name="email" type="email" required className="input-field" /></div>
          <div><label className="block text-sm font-medium text-text mb-1">Tipo pratica</label>
            <select name="tipo_pratica" className="input-field">
              <option value="successione_legittima">Successione legittima</option>
              <option value="successione_testamentaria">Successione testamentaria</option>
              <option value="rinuncia">Rinuncia all&apos;eredit&agrave;</option>
              <option value="informazioni">Solo informazioni</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-text mb-1">Note (opzionale)</label>
        <textarea name="note" rows={3} className="input-field" placeholder="Descrivete brevemente la vostra situazione..." />
      </div>
      <label className="flex items-start gap-3 cursor-pointer">
        <input type="checkbox" required className="w-5 h-5 mt-0.5 rounded" />
        <span className="text-sm text-text-light">Acconsento al trattamento dei dati personali ai sensi del GDPR. *</span>
      </label>
      <button type="submit" className="btn-accent w-full py-4">
        <Send size={16} className="mr-2" /> Invia Richiesta
      </button>
      <p className="text-text-muted text-xs text-center">Vi contatteremo entro 30 minuti. Il preventivo &egrave; gratuito e senza impegno.</p>
    </form>
  )
}
