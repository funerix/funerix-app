'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { Prodotto } from '@/types'

interface ProductSelectorProps {
  prodotti: Prodotto[]
  selected: Prodotto | null
  onSelect: (prodotto: Prodotto) => void
  multiple?: false
}

interface ProductSelectorMultipleProps {
  prodotti: Prodotto[]
  selected: Prodotto[]
  onToggle: (prodotto: Prodotto) => void
  multiple: true
}

type Props = ProductSelectorProps | ProductSelectorMultipleProps

export function ProductSelector(props: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {props.prodotti.map((prodotto, i) => {
        const isSelected = props.multiple
          ? props.selected.some((s) => s.id === prodotto.id)
          : props.selected?.id === prodotto.id

        return (
          <motion.div
            key={prodotto.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => {
              if (props.multiple) {
                props.onToggle(prodotto)
              } else {
                props.onSelect(prodotto)
              }
            }}
            className={isSelected ? 'product-card-selected' : 'product-card'}
          >
            <div className="w-full h-40 bg-background-dark rounded-lg mb-4 relative overflow-hidden">
              {prodotto.immagini[0] ? (
                <Image src={prodotto.immagini[0]} alt={prodotto.nome} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-text-muted text-sm">Foto prodotto</span>
                </div>
              )}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-3 right-3 w-8 h-8 bg-accent rounded-full flex items-center justify-center"
                >
                  <Check size={16} className="text-white" />
                </motion.div>
              )}
            </div>

            <h4 className="font-[family-name:var(--font-serif)] text-base md:text-lg text-primary mb-1 break-words">
              {prodotto.nome}
            </h4>
            <p className="text-text-light text-xs md:text-sm mb-3 break-words">{prodotto.descrizioneBreve}</p>

            {prodotto.materiale && (
              <p className="text-xs text-text-muted mb-1">
                Materiale: {prodotto.materiale}
              </p>
            )}
            {prodotto.dimensioni && (
              <p className="text-xs text-text-muted mb-3">
                Dimensioni: {prodotto.dimensioni}
              </p>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-border">
              <span className="font-[family-name:var(--font-serif)] text-xl text-primary font-semibold">
                &euro; {prodotto.prezzo.toLocaleString('it-IT')}
              </span>
              {isSelected && (
                <span className="text-accent text-sm font-medium">Selezionato</span>
              )}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
