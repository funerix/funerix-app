'use client'

import { Phone } from 'lucide-react'
import { useSitoStore } from '@/store/sito'

interface PhoneLinkProps {
  className?: string
  showIcon?: boolean
  label?: string
}

export function PhoneLink({ className = '', showIcon = false, label }: PhoneLinkProps) {
  const { impostazioni } = useSitoStore()
  const tel = impostazioni.telefono
  const href = `tel:${tel.replace(/\s/g, '')}`

  return (
    <a href={href} className={className}>
      {showIcon && <Phone size={16} className="mr-2" />}
      {label || tel}
    </a>
  )
}
