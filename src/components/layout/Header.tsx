'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu, X, Phone, ChevronDown, ChevronRight, Cross, PawPrint, Shield, Plane, Euro,
  Shovel, ShoppingBag, Flower2, FileText, Package, Heart, MapPin, Building2,
  Stethoscope, Film, Printer, Users, Calendar
} from 'lucide-react'
import { useSitoStore } from '@/store/sito'
import { LanguageSelector } from '@/components/LanguageSelector'

// Mega menu structure
const menuServizi = {
  label: 'Servizi Funebri',
  cols: [
    {
      title: 'Servizi Principali',
      items: [
        { href: '/configuratore', label: 'Configura Funerale', desc: 'Preventivo personalizzato', icon: Cross },
        { href: '/rimpatri', label: 'Rimpatri Salme', desc: 'Trasporto internazionale', icon: Plane },
        { href: '/memorial', label: 'Memorial Online', desc: 'Necrologi e ricordi digitali', icon: Heart },
        { href: '/esumazione', label: 'Esumazione', desc: 'Trasferimento resti', icon: Shovel },
      ],
    },
    {
      title: 'Servizi Aggiuntivi',
      items: [
        { href: '/servizi-ricorrenti', label: 'Fiori e Cura Tomba', desc: 'Abbonamento fiori e pulizia', icon: Flower2 },
        { href: '/successione', label: 'Successione Ereditaria', desc: 'Assistenza dichiarazione', icon: FileText },
        { href: '/servizi', label: 'Video, Stampa e Altro', desc: 'Tributo, ricordi, cerimonia laica', icon: Package },
        { href: '/catalogo', label: 'Catalogo Prodotti', desc: 'Bare, urne, fiori', icon: ShoppingBag },
      ],
    },
  ],
  cta: { href: '/configuratore', label: 'Configura il tuo servizio' },
}

const menuAnimali = {
  label: 'Animali',
  cols: [
    {
      title: null,
      items: [
        { href: '/pet/configuratore', label: 'Cremazione Immediata', desc: 'Servizio per animale deceduto', icon: PawPrint },
        { href: '/pet/previdenza', label: 'Piano Previdenza Pet', desc: 'Configura e paga a rate', icon: Shield },
        { href: '/pet/catalogo', label: 'Catalogo Urne Pet', desc: 'Urne e accessori', icon: ShoppingBag },
        { href: '/pet/veterinari', label: 'Veterinari Partner', desc: 'Studi convenzionati', icon: Stethoscope },
        { href: '/pet/memorial', label: 'Memorial Pet', desc: 'Ricordo digitale', icon: Heart },
      ],
    },
  ],
  cta: { href: '/pet', label: 'Scopri Funerix Pet' },
}

const menuPrevidenza = {
  label: 'Previdenza',
  cols: [
    {
      title: null,
      items: [
        { href: '/previdenza', label: 'Come Funziona', desc: 'Pianificate oggi, vivete sereni', icon: Shield },
        { href: '/previdenza/piani', label: 'Confronta i Piani', desc: 'Base, Comfort, Premium', icon: Package },
        { href: '/previdenza/configuratore', label: 'Configura il Piano', desc: 'Personalizzato e a rate', icon: Calendar },
        { href: '/convenzioni', label: 'Convenzioni RSA', desc: 'Per strutture sanitarie', icon: Building2 },
      ],
    },
  ],
  cta: { href: '/previdenza/configuratore', label: 'Configura il tuo piano' },
}

const menus = [menuServizi, menuAnimali, menuPrevidenza]

// Mobile sections
const mobileSections = [
  {
    title: 'Servizi Funebri',
    items: [
      { href: '/configuratore', label: 'Configura Funerale', icon: Cross },
      { href: '/rimpatri', label: 'Rimpatri Salme', icon: Plane },
      { href: '/esumazione', label: 'Esumazione', icon: Shovel },
      { href: '/servizi-ricorrenti', label: 'Fiori e Cura Tomba', icon: Flower2 },
      { href: '/successione', label: 'Successione', icon: FileText },
      { href: '/servizi', label: 'Servizi Aggiuntivi', icon: Package },
      { href: '/catalogo', label: 'Catalogo', icon: ShoppingBag },
      { href: '/memorial', label: 'Memorial', icon: Heart },
    ],
  },
  {
    title: 'Animali',
    items: [
      { href: '/pet/configuratore', label: 'Cremazione Immediata', icon: PawPrint },
      { href: '/pet/previdenza', label: 'Previdenza Pet', icon: Shield },
      { href: '/pet/catalogo', label: 'Urne Pet', icon: ShoppingBag },
      { href: '/pet/veterinari', label: 'Veterinari', icon: Stethoscope },
    ],
  },
  {
    title: 'Previdenza',
    items: [
      { href: '/previdenza', label: 'Come Funziona', icon: Shield },
      { href: '/previdenza/piani', label: 'Confronta Piani', icon: Package },
      { href: '/previdenza/configuratore', label: 'Configura Piano', icon: Calendar },
      { href: '/convenzioni', label: 'Convenzioni RSA', icon: Building2 },
    ],
  },
]

export function Header() {
  const { impostazioni } = useSitoStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const navRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenMenu(null)
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
          <nav ref={navRef} className="hidden lg:flex items-center gap-1">
            <Link href="/" className="px-3 py-2 text-primary/70 hover:text-primary transition-colors text-sm font-medium rounded-lg hover:bg-background">
              Home
            </Link>

            {/* Mega Menus */}
            {menus.map((menu) => (
              <div key={menu.label} className="relative">
                <button
                  onClick={() => setOpenMenu(openMenu === menu.label ? null : menu.label)}
                  className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    openMenu === menu.label ? 'text-primary bg-background' : 'text-primary/70 hover:text-primary hover:bg-background'
                  }`}
                >
                  {menu.label}
                  <ChevronDown size={14} className={`transition-transform duration-200 ${openMenu === menu.label ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {openMenu === menu.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className={`absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-surface rounded-xl border border-border shadow-xl p-5 ${
                        menu.cols.length > 1 ? 'w-[560px]' : 'w-[300px]'
                      }`}
                    >
                      <div className={`grid gap-6 ${menu.cols.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                        {menu.cols.map((col, ci) => (
                          <div key={ci}>
                            {col.title && <p className="text-[10px] text-text-muted uppercase tracking-wider mb-2 px-2">{col.title}</p>}
                            <div className="space-y-0.5">
                              {col.items.map((item) => (
                                <Link key={item.href} href={item.href} onClick={() => setOpenMenu(null)}
                                  className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-background transition-colors group">
                                  <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-secondary/20 transition-colors">
                                    <item.icon size={15} className="text-secondary" />
                                  </div>
                                  <div className="min-w-0">
                                    <span className="text-sm font-medium text-primary block group-hover:text-secondary transition-colors">{item.label}</span>
                                    <span className="text-[11px] text-text-muted leading-tight">{item.desc}</span>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 pt-3 border-t border-border">
                        <Link href={menu.cta.href} onClick={() => setOpenMenu(null)}
                          className="btn-accent w-full text-sm py-2.5 justify-center">
                          {menu.cta.label} <ChevronRight size={14} className="ml-1" />
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}

            <Link href="/prezzi" className="px-3 py-2 text-primary/70 hover:text-primary transition-colors text-sm font-medium rounded-lg hover:bg-background">
              Prezzi
            </Link>
            <Link href="/guida" className="px-3 py-2 text-primary/70 hover:text-primary transition-colors text-sm font-medium rounded-lg hover:bg-background">
              Guide
            </Link>
            <Link href="/contatti" className="px-3 py-2 text-primary/70 hover:text-primary transition-colors text-sm font-medium rounded-lg hover:bg-background">
              Contatti
            </Link>
          </nav>

          {/* CTA + Phone */}
          <div className="hidden lg:flex items-center gap-3">
            <a href={`tel:${impostazioni.telefono.replace(/\s/g, '')}`}
              className="flex items-center gap-1.5 text-secondary font-medium text-sm">
              <Phone size={14} className="animate-pulse" />
              {impostazioni.telefono}
            </a>
            <LanguageSelector />
            <Link href="/configuratore" className="btn-accent text-sm py-2 px-4">
              Preventivo
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
            <nav className="px-4 py-3 max-h-[80vh] overflow-y-auto">

              {mobileSections.map((section) => (
                <div key={section.title} className="mb-3">
                  <p className="text-[10px] text-text-muted uppercase tracking-wider px-3 py-1.5 font-medium">{section.title}</p>
                  {section.items.map((item) => (
                    <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 py-2.5 px-3 hover:bg-background rounded-lg">
                      <item.icon size={16} className="text-secondary flex-shrink-0" />
                      <span className="text-sm font-medium text-primary">{item.label}</span>
                    </Link>
                  ))}
                </div>
              ))}

              <div className="border-t border-border mt-2 pt-3 space-y-1">
                <Link href="/prezzi" onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 py-2.5 px-3 hover:bg-background rounded-lg">
                  <Euro size={16} className="text-secondary" />
                  <span className="text-sm font-medium text-primary">Prezzi</span>
                </Link>
                <Link href="/guida" onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 py-2.5 px-3 hover:bg-background rounded-lg">
                  <FileText size={16} className="text-secondary" />
                  <span className="text-sm font-medium text-primary">Guide</span>
                </Link>
                <Link href="/contatti" onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 py-2.5 px-3 hover:bg-background rounded-lg">
                  <Phone size={16} className="text-secondary" />
                  <span className="text-sm font-medium text-primary">Contatti</span>
                </Link>
              </div>

              <div className="pt-3 border-t border-border mt-3 space-y-2">
                <a href={`tel:${impostazioni.telefono.replace(/\s/g, '')}`}
                  className="flex items-center gap-2 py-2.5 px-3 text-secondary font-medium">
                  <Phone size={16} /> {impostazioni.telefono}
                </a>
                <Link href="/configuratore" onClick={() => setMobileOpen(false)}
                  className="btn-accent w-full text-sm py-2.5 justify-center">Configura il Servizio</Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
