'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin } from 'lucide-react'
import { useSitoStore } from '@/store/sito'

export function Footer() {
  const { impostazioni, contenuti } = useSitoStore()
  return (
    <footer className="bg-primary text-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-6">
          {/* Brand */}
          <div className="md:col-span-4">
            <Image src="/images/logo-white.png" alt="Funerix" width={280} height={84} className="h-12 w-auto mb-4" />
            <p className="text-sm leading-relaxed text-white/60 max-w-xs">
              {contenuti.footerDescrizione}
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a href={`tel:${impostazioni.telefono.replace(/\s/g, '')}`}
                className="flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors">
                <Phone size={14} className="text-secondary-light" />
                {impostazioni.telefono}
              </a>
            </div>
          </div>

          {/* Servizi */}
          <div className="md:col-span-3">
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Servizi</h4>
            <ul className="space-y-2 text-sm">
              {[
                ['/configuratore', 'Configura il Servizio'],
                ['/catalogo', 'Catalogo Prodotti'],
                ['/pet', 'Pet'],
                ['/previdenza', 'Previdenza'],
                ['/rimpatri', 'Rimpatri'],
                ['/invia-fiori', 'Invia Fiori'],
                ['/condoglianze', 'Invia Condoglianze'],
                ['/servizi-ricorrenti', 'Fiori e Cura Tomba'],
                ['/successione', 'Successione'],
                ['/servizi', 'Servizi Aggiuntivi'],
              ].map(([href, label]) => (
                <li key={href}><Link href={href} className="text-white/60 hover:text-white transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div className="md:col-span-2">
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Info</h4>
            <ul className="space-y-2 text-sm">
              {[
                ['/chi-siamo', 'Chi Siamo'],
                ['/blog', 'Blog'],
                ['/guida', 'Guide'],
                ['/prezzi', 'Prezzi'],
                ['/privacy', 'Privacy Policy'],
                ['/cookie', 'Cookie Policy'],
                ['/termini', 'Termini'],
              ].map(([href, label]) => (
                <li key={href}><Link href={href} className="text-white/60 hover:text-white transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contatti */}
          <div className="md:col-span-3">
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Contatti</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2.5">
                <Phone size={14} className="text-secondary-light flex-shrink-0" />
                <a href={`tel:${impostazioni.telefono.replace(/\s/g, '')}`} className="text-white/60 hover:text-white transition-colors">{impostazioni.telefono}</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={14} className="text-secondary-light flex-shrink-0" />
                <a href={`mailto:${impostazioni.email}`} className="text-white/60 hover:text-white transition-colors">{impostazioni.email}</a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={14} className="text-secondary-light flex-shrink-0 mt-0.5" />
                <span className="text-white/60">{impostazioni.indirizzo}</span>
              </li>
            </ul>
            <p className="text-xs text-white/40 mt-4">Disponibili 24 ore su 24, 7 giorni su 7</p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs text-white/50">
            &copy; {new Date().getFullYear()} {contenuti.footerCopyright}
            {impostazioni.registroRegionale && ` — Reg. Campania n. ${impostazioni.registroRegionale}`}
          </p>
          <p className="text-xs text-white/40 text-center md:text-right">
            {contenuti.footerNotaPreventivi}
          </p>
        </div>
      </div>
    </footer>
  )
}
