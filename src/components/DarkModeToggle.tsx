'use client'

import { useState, useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'

export function DarkModeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('funerix-dark')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const isDark = saved ? saved === 'true' : prefersDark
    setDark(isDark)
    document.documentElement.classList.toggle('dark', isDark)
  }, [])

  const toggle = () => {
    const newDark = !dark
    setDark(newDark)
    document.documentElement.classList.toggle('dark', newDark)
    localStorage.setItem('funerix-dark', String(newDark))
  }

  return (
    <button onClick={toggle} className="p-1.5 text-primary/50 hover:text-primary transition-colors" aria-label="Tema">
      {dark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  )
}
