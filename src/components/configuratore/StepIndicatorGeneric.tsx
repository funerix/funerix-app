'use client'

import { Check } from 'lucide-react'

export function StepIndicator({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="w-full mb-10">
      <div className="md:hidden text-center mb-2">
        <span className="text-sm text-text-light">Passo {current} di {steps.length}</span>
        <h3 className="font-[family-name:var(--font-serif)] text-lg text-primary">{steps[current - 1]}</h3>
      </div>
      <div className="md:hidden w-full h-1.5 bg-border rounded-full overflow-hidden">
        <div className="h-full bg-secondary rounded-full transition-all duration-400" style={{ width: `${(current / steps.length) * 100}%` }} />
      </div>
      <div className="hidden md:flex items-center justify-between">
        {steps.map((label, i) => {
          const stepNum = i + 1
          const completed = stepNum < current
          const active = stepNum === current
          return (
            <div key={label} className="flex items-center flex-1 last:flex-initial">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                  completed ? 'bg-accent text-white' : active ? 'bg-primary text-white ring-4 ring-primary/20' : 'bg-border text-text-muted'
                }`}>{completed ? <Check size={18} /> : stepNum}</div>
                <span className={`mt-2 text-xs whitespace-nowrap ${active ? 'text-primary font-semibold' : 'text-text-muted'}`}>{label}</span>
              </div>
              {i < steps.length - 1 && <div className={`flex-1 mx-2 h-0.5 ${completed ? 'bg-accent' : 'bg-border'}`} />}
            </div>
          )
        })}
      </div>
    </div>
  )
}
