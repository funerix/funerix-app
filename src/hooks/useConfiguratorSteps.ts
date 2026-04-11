import { useState, useCallback } from 'react'

/**
 * Hook condiviso per la navigazione step nei configuratori.
 * Usato da: ConfiguratoreAnimale, ConfiguratorePrevidenza, ConfiguratoreRimpatrio,
 * pet/previdenza/configuratore, configuratore/page.
 */
export function useConfiguratorSteps(totalSteps: number) {
  const [step, setStep] = useState(1)

  const next = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setStep(s => Math.min(totalSteps, s + 1))
  }, [totalSteps])

  const prev = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setStep(s => Math.max(1, s - 1))
  }, [])

  return { step, setStep, next, prev }
}
