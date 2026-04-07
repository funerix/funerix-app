'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { TOTAL_STEPS } from '@/store/configuratore'
import { useTranslations } from 'next-intl'

export function StepIndicator({ currentStep }: { currentStep: number }) {
  const t = useTranslations('configuratore')

  const stepLabels = [
    t('stepServizio'),
    t('stepBaraUrna'),
    t('stepTrasporto'),
    t('stepCerimonia'),
    t('stepFiori'),
    t('stepExtra'),
    t('stepRiepilogo'),
    t('stepContatto'),
  ]

  return (
    <div className="w-full mb-10">
      <div className="md:hidden text-center mb-2">
        <span className="text-sm text-text-light">
          {t('passo')} {currentStep} / {TOTAL_STEPS}
        </span>
        <h3 className="font-[family-name:var(--font-serif)] text-lg text-primary">
          {stepLabels[currentStep - 1]}
        </h3>
      </div>

      <div className="md:hidden w-full h-1.5 bg-border rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-secondary rounded-full"
          initial={false}
          animate={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        />
      </div>

      <div className="hidden md:flex items-center justify-between">
        {Array.from({ length: TOTAL_STEPS }, (_, i) => {
          const step = i + 1
          const isCompleted = step < currentStep
          const isActive = step === currentStep
          return (
            <div key={step} className="flex items-center flex-1 last:flex-initial">
              <div className="flex flex-col items-center">
                <div
                  className={
                    isCompleted
                      ? 'w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center text-sm font-semibold'
                      : isActive
                      ? 'w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold ring-4 ring-primary/20'
                      : 'w-10 h-10 rounded-full bg-border text-text-muted flex items-center justify-center text-sm font-semibold'
                  }
                >
                  {isCompleted ? <Check size={18} /> : step}
                </div>
                <span
                  className={`mt-2 text-xs whitespace-nowrap ${
                    isActive ? 'text-primary font-semibold' : 'text-text-muted'
                  }`}
                >
                  {stepLabels[i]}
                </span>
              </div>
              {step < TOTAL_STEPS && (
                <div className="flex-1 mx-2 h-0.5 bg-border relative">
                  {isCompleted && (
                    <motion.div
                      className="absolute inset-0 bg-accent"
                      layoutId={`step-line-${step}`}
                      initial={false}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
