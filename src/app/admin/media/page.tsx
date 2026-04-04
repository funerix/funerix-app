'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Upload, Trash2, Copy } from 'lucide-react'

const immagini = [
  { nome: 'hero.jpg', percorso: '/images/hero.jpg', dimensione: '242 KB', uso: 'Hero Homepage' },
  { nome: 'hero2.jpg', percorso: '/images/hero2.jpg', dimensione: '165 KB', uso: 'Non assegnata' },
  { nome: 'sala.jpg', percorso: '/images/sala.jpg', dimensione: '108 KB', uso: 'Hero Chi Siamo' },
  { nome: 'bara-rovere.jpg', percorso: '/images/bara-rovere.jpg', dimensione: '431 KB', uso: 'Prodotto: Cofano in Rovere' },
  { nome: 'bara-noce.jpg', percorso: '/images/bara-noce.jpg', dimensione: '381 KB', uso: 'Prodotto: Cofano in Noce' },
  { nome: 'bara-paulownia.jpg', percorso: '/images/bara-paulownia.jpg', dimensione: '447 KB', uso: 'Prodotto: Cofano in Paulownia' },
  { nome: 'bara-mogano.jpg', percorso: '/images/bara-mogano.jpg', dimensione: '443 KB', uso: 'Prodotto: Cofano in Mogano' },
  { nome: 'urna-marmo.jpg', percorso: '/images/urna-marmo.jpg', dimensione: '195 KB', uso: 'Prodotto: Urna Marmo' },
  { nome: 'urna-ceramica.jpg', percorso: '/images/urna-ceramica.jpg', dimensione: '501 KB', uso: 'Prodotto: Urna Ceramica' },
  { nome: 'urna-olivo.jpg', percorso: '/images/urna-olivo.jpg', dimensione: '477 KB', uso: 'Prodotto: Urna Olivo' },
  { nome: 'auto-mercedes.jpg', percorso: '/images/auto-mercedes.jpg', dimensione: '74 KB', uso: 'Prodotto: Mercedes Classe E' },
  { nome: 'auto-standard.jpg', percorso: '/images/auto-standard.jpg', dimensione: '76 KB', uso: 'Prodotto: Trasporto Standard' },
  { nome: 'corona-rose.jpg', percorso: '/images/corona-rose.jpg', dimensione: '217 KB', uso: 'Prodotto: Corona Rose' },
  { nome: 'cuscino-fiori.jpg', percorso: '/images/cuscino-fiori.jpg', dimensione: '164 KB', uso: 'Prodotto: Cuscino Fiori' },
  { nome: 'mazzo-gigli.jpg', percorso: '/images/mazzo-gigli.jpg', dimensione: '522 KB', uso: 'Prodotto: Mazzo Gigli' },
]

export default function AdminMediaPage() {
  return (
    <div className="min-h-screen bg-background-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-text-muted hover:text-primary transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="font-[family-name:var(--font-serif)] text-3xl text-primary">Galleria Media</h1>
              <p className="text-text-light text-sm">{immagini.length} immagini caricate</p>
            </div>
          </div>
          <button className="btn-accent text-sm">
            <Upload size={16} className="mr-2" />
            Carica immagine
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {immagini.map(img => (
            <div key={img.nome} className="card p-3 group">
              <div className="w-full h-32 bg-background-dark rounded-lg relative overflow-hidden mb-3">
                <Image src={img.percorso} alt={img.nome} fill className="object-cover" sizes="200px" />
              </div>
              <p className="text-xs font-medium text-primary truncate">{img.nome}</p>
              <p className="text-[10px] text-text-muted">{img.dimensione}</p>
              <p className="text-[10px] text-secondary truncate">{img.uso}</p>
              <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 text-text-muted hover:text-primary transition-colors" title="Copia percorso">
                  <Copy size={12} />
                </button>
                <button className="p-1.5 text-text-muted hover:text-error transition-colors" title="Elimina">
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
