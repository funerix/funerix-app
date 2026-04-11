'use client'

import { useState } from 'react'
import { CreditCard, Check, Loader2 } from 'lucide-react'

interface PaymentButtonProps {
  amount: number
  label?: string
  onPaymentRequest?: () => Promise<void>
  disabled?: boolean
  className?: string
}

/**
 * Bottone di pagamento — pronto per Stripe.
 * Per ora mostra un messaggio "disponibile a breve" e salva la richiesta.
 * Quando Stripe sarà collegato, creerà una sessione di checkout.
 */
export function PaymentButton({ amount, label, onPaymentRequest, disabled, className = '' }: PaymentButtonProps) {
  const [loading, setLoading] = useState(false)
  const [showInfo, setShowInfo] = useState(false)

  const stripeEnabled = false // TODO: impostare a true quando Stripe è configurato

  const handleClick = async () => {
    if (stripeEnabled) {
      // Stripe checkout session
      setLoading(true)
      try {
        // const res = await fetch('/api/pagamento', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ amount, description: label }),
        // })
        // const { url } = await res.json()
        // window.location.href = url
        if (onPaymentRequest) await onPaymentRequest()
      } finally {
        setLoading(false)
      }
    } else {
      // Stripe non ancora attivo — mostra info
      if (onPaymentRequest) {
        setLoading(true)
        await onPaymentRequest()
        setLoading(false)
      }
      setShowInfo(true)
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || loading || amount <= 0}
        className={`btn-accent w-full py-4 disabled:opacity-50 ${className}`}
      >
        {loading ? (
          <><Loader2 size={16} className="mr-2 animate-spin" /> Elaborazione...</>
        ) : (
          <><CreditCard size={16} className="mr-2" /> {label || 'Paga ora'} — &euro; {amount}</>
        )}
      </button>

      {showInfo && !stripeEnabled && (
        <div className="mt-3 bg-secondary/10 border border-secondary/20 rounded-xl p-4 text-center">
          <Check size={20} className="mx-auto mb-2 text-accent" />
          <p className="text-sm font-medium text-primary">Richiesta inviata con successo</p>
          <p className="text-xs text-text-muted mt-1">
            Il pagamento online sar&agrave; disponibile a breve. Un consulente vi contatter&agrave; per finalizzare il pagamento.
          </p>
        </div>
      )}
    </div>
  )
}
