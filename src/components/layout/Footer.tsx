'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin } from 'lucide-react'
import { useSitoStore } from '@/store/sito'

export function Footer() {
  const { impostazioni, contenuti } = useSitoStore()
  return (
    <footer className="bg-primary text-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-6 items-start">
          {/* Brand — 3 colonne */}
          <div className="col-span-2 md:col-span-3">
            <Image src="/images/logo-white.png" alt="Funerix" width={280} height={84} className="h-14 w-auto mb-3" />
            <p className="text-xs leading-relaxed text-white/60">
              {contenuti.footerDescrizione}
            </p>
          </div>

          {/* Servizi — 3 colonne */}
          <div className="md:col-span-3">
            <h4 className="text-white font-semibold mb-2 text-[10px] uppercase tracking-wider">Servizi</h4>
            <ul className="space-y-1 text-xs">
              {[
                ['/configuratore', 'Configura il Servizio'],
                ['/catalogo', 'Catalogo Prodotti'],
                ['/pet', 'Pet'],
                ['/previdenza', 'Previdenza'],
                ['/rimpatri', 'Rimpatri'],
                ['/servizi-ricorrenti', 'Fiori e Cura Tomba'],
                ['/successione', 'Successione'],
                ['/servizi', 'Servizi Aggiuntivi'],
              ].map(([href, label]) => (
                <li key={href}><Link href={href} className="hover:text-white transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Info — 2 colonne */}
          <div className="md:col-span-2">
            <h4 className="text-white font-semibold mb-2 text-[10px] uppercase tracking-wider">Info</h4>
            <ul className="space-y-1 text-xs">
              {[
                ['/chi-siamo', 'Chi Siamo'],
                ['/blog', 'Blog'],
                ['/guida', 'Guide'],
                ['/prezzi', 'Prezzi'],
                ['/privacy', 'Privacy Policy'],
                ['/cookie', 'Cookie Policy'],
                ['/termini', 'Termini'],
              ].map(([href, label]) => (
                <li key={href}><Link href={href} className="hover:text-white transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contatti — 4 colonne */}
          <div className="md:col-span-4">
            <h4 className="text-white font-semibold mb-2 text-[10px] uppercase tracking-wider">Contatti</h4>
            <ul className="space-y-1.5 text-xs">
              <li className="flex items-center gap-2">
                <Phone size={12} className="text-secondary-light flex-shrink-0" />
                <a href={`tel:${impostazioni.telefono.replace(/\s/g, '')}`} className="hover:text-white transition-colors">{impostazioni.telefono}</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={12} className="text-secondary-light flex-shrink-0" />
                <a href={`mailto:${impostazioni.email}`} className="hover:text-white transition-colors">{impostazioni.email}</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={12} className="text-secondary-light flex-shrink-0 mt-0.5" />
                <span>{impostazioni.indirizzo}</span>
              </li>
            </ul>
            <p className="text-[10px] text-white/40 mt-2">Disponibili 24/7</p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-[10px] text-white/50">
            &copy; {new Date().getFullYear()} {contenuti.footerCopyright}
            {impostazioni.registroRegionale && ` — Reg. Campania n. ${impostazioni.registroRegionale}`}
          </p>
          <p className="text-[10px] text-white/40">
            {contenuti.footerNotaPreventivi}
          </p>
        </div>
      </div>
    </footer>
  )
}
