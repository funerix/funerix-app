'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Phone, ChevronDown, Cross, Globe, PawPrint, BookOpen, Euro, ShoppingBag, Shovel, Plane, Shield, Flower2, FileText, Package } from 'lucide-react'
import { useSitoStore } from '@/store/sito'
import { LanguageSelector } from '@/components/LanguageSelector'

const serviziMenu = [
  { href: '/configuratore', label: 'Configura Servizio Funebre', desc: 'Preventivo personalizzato in 5 minuti', icon: Cross },
  { href: '/pet', label: 'Funerix Pet', desc: 'Cremazione animali domestici', icon: PawPrint },
  { href: '/previdenza', label: 'Funerix Previdenza', desc: 'Piani funerari prepagati a rate mensili', icon: Shield },
  { href: '/rimpatri', label: 'Funerix Rimpatri', desc: 'Trasporto internazionale salme', icon: Plane },
  { href: '/esumazione', label: 'Esumazione e Riesumazione', desc: 'Trasferimento resti e cremazione', icon: Shovel },
  { href: '/catalogo', label: 'Catalogo Prodotti', desc: 'Bare, urne, fiori, auto funebri', icon: ShoppingBag },
  { href: '/prezzi', label: 'Prezzi per Provincia', desc: 'Confronta i costi in Campania', icon: Euro },
  { href: '/servizi-ricorrenti', label: 'Fiori e Cura Tomba', desc: 'Abbonamento fiori, pulizia e manutenzione', icon: Flower2 },
  { href: '/successione', label: 'Successione Ereditaria', desc: 'Assistenza completa dichiarazione successione', icon: FileText },
  { href: '/servizi', label: 'Servizi Aggiuntivi', desc: 'Video tributo, stampa ricordo, disbrigo pratiche', icon: Package },
]

const navLinks = [
  { href: '/memorial', label: 'Necrologi' },
  { href: '/blog', label: 'Blog' },
  { href: '/guida', label: 'Guide' },
  { href: '/contatti', label: 'Contatti' },
]

export function Header() {
  const { impostazioni } = useSitoStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [serviziOpen, setServiziOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Chiudi dropdown al click fuori
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setServiziOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-surface/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image src="/images/logo.png" alt="Funerix" width={500} height={150} className="h-20 md:h-24 w-auto -my-4" priority />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link href="/" className="text-primary/70 hover:text-primary transition-colors text-sm font-medium">Home</Link>

            {/* Servizi Dropdown */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setServiziOpen(!serviziOpen)}
                className="flex items-center gap-1 text-primary/70 hover:text-primary transition-colors text-sm font-medium"
              >
                Servizi <ChevronDown size={14} className={`transition-transform ${serviziOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {serviziOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[480px] bg-surface rounded-xl border border-border shadow-xl p-4"
                  >
                    <div className="grid grid-cols-2 gap-1">
                      {serviziMenu.map((s) => (
                        <Link
                          key={s.href}
                          href={s.href}
                          onClick={() => setServiziOpen(false)}
                          className="flex items-start gap-3 p-3 rounded-lg hover:bg-background transition-colors group"
                        >
                          <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-secondary/20">
                            <s.icon size={16} className="text-secondary" />
                          </div>
                          <div>
                            <span className="text-sm font-medium text-primary block group-hover:text-secondary transition-colors">{s.label}</span>
                            <span className="text-[11px] text-text-muted">{s.desc}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-border">
                      <Link href="/configuratore" onClick={() => setServiziOpen(false)}
                        className="btn-accent w-full text-sm py-2.5 justify-center">
                        Configura il tuo servizio
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className="text-primary/70 hover:text-primary transition-colors text-sm font-medium">
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA + Phone */}
          <div className="hidden lg:flex items-center gap-3">
            <a href={`tel:${impostazioni.telefono.replace(/\s/g, '')}`}
              className="relative flex items-center gap-1.5 text-secondary font-medium text-sm overflow-hidden group">
              <Phone size={14} className="animate-pulse" />
              <span className="relative">
                {impostazioni.telefono}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 shimmer-auto" />
              </span>
            </a>
            <LanguageSelector />
            <Link href="/assistenza" className="btn-accent text-sm py-2 px-4">
              Assistenza
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 text-primary" aria-label="Menu">
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-border bg-surface overflow-hidden">
            <nav className="px-4 py-3 space-y-1 max-h-[80vh] overflow-y-auto">
              <Link href="/" onClick={() => setMobileOpen(false)}
                className="block py-2.5 px-3 text-primary/70 hover:text-primary hover:bg-background rounded-lg font-medium">Home</Link>

              <p className="text-[10px] text-text-muted uppercase tracking-wider px-3 pt-3 pb-1">Servizi</p>
              {serviziMenu.map((s) => (
                <Link key={s.href} href={s.href} onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 py-2.5 px-3 hover:bg-background rounded-lg">
                  <s.icon size={16} className="text-secondary flex-shrink-0" />
                  <div>
                    <span className="text-sm font-medium text-primary block">{s.label}</span>
                    <span className="text-[10px] text-text-muted">{s.desc}</span>
                  </div>
                </Link>
              ))}

              <p className="text-[10px] text-text-muted uppercase tracking-wider px-3 pt-3 pb-1">Informazioni</p>
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                  className="block py-2.5 px-3 text-primary/70 hover:text-primary hover:bg-background rounded-lg font-medium">
                  {link.label}
                </Link>
              ))}

              <div className="pt-3 border-t border-border mt-3 space-y-2">
                <a href={`tel:${impostazioni.telefono.replace(/\s/g, '')}`}
                  className="flex items-center gap-2 py-2.5 px-3 text-secondary font-medium">
                  <Phone size={16} /> {impostazioni.telefono}
                </a>
                <Link href="/assistenza" onClick={() => setMobileOpen(false)}
                  className="btn-accent w-full text-sm py-2.5 justify-center">Richiedi Assistenza</Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
