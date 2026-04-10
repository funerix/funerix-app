'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Phone, Shield, PawPrint, Heart, ChevronLeft as ArrowLeft, ChevronRight as ArrowRight } from 'lucide-react'

interface Slide {
  id: number
  badge: string
  badgeIcon: typeof Shield
  title: string
  highlight: string
  desc: string
  cta: { label: string; href: string }
  ctaSecondary?: { label: string; href: string }
  bgImage: string
  gradientFrom: string
  accentColor: string
}

const slides: Slide[] = [
  {
    id: 0,
    badge: 'Dal 1920 al servizio delle famiglie',
    badgeIcon: Shield,
    title: 'La prima agenzia funebre',
    highlight: 'digitale in Italia',
    desc: 'Configurate il servizio funebre online in 5 minuti. Prezzi trasparenti, consulente dedicato entro 30 minuti, assistenza 24/7.',
    cta: { label: 'Configura il Servizio', href: '/configuratore' },
    ctaSecondary: { label: 'Prezzi', href: '/prezzi' },
    bgImage: '/images/hero-principale.png',
    gradientFrom: 'from-primary-dark/90 via-primary/70 to-primary-dark/50',
    accentColor: 'text-secondary-light',
  },
  {
    id: 1,
    badge: 'Funerix Pet',
    badgeIcon: PawPrint,
    title: 'Per il vostro compagno',
    highlight: 'di vita',
    desc: 'Cremazione individuale con restituzione ceneri. Urne commemorative, memorial digitale. Anche con piano previdenza a rate.',
    cta: { label: 'Cremazione Immediata', href: '/pet/configuratore' },
    ctaSecondary: { label: 'Piano Previdenza Pet', href: '/pet/previdenza' },
    bgImage: '/images/hero-pet.png',
    gradientFrom: 'from-[#1a3a2a]/90 via-[#2a4a3a]/70 to-[#1a3a2a]/50',
    accentColor: 'text-accent-light',
  },
  {
    id: 2,
    badge: 'Fondi protetti su conto dedicato',
    badgeIcon: Heart,
    title: 'Pianificate oggi',
    highlight: 'vivete sereni',
    desc: 'Configurate il servizio funebre per voi o un familiare. Bloccate il prezzo di oggi e pagate a rate da 12 a 60 mesi. Zero interessi.',
    cta: { label: 'Configura il Piano', href: '/previdenza/configuratore' },
    ctaSecondary: { label: 'Confronta i Piani', href: '/previdenza/piani' },
    bgImage: '/images/hero-previdenza.png',
    gradientFrom: 'from-[#3a2a1a]/90 via-[#4a3a2a]/70 to-[#3a2a1a]/50',
    accentColor: 'text-secondary-light',
  },
]

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -300 : 300, opacity: 0 }),
}

export function HeroSlideshow({ telefono, heroBottone }: { telefono: string; heroBottone: string }) {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)
  const [isPaused, setIsPaused] = useState(false)

  const goTo = useCallback((index: number) => {
    setDirection(index > current ? 1 : -1)
    setCurrent(index)
  }, [current])

  const next = useCallback(() => {
    setDirection(1)
    setCurrent(c => (c + 1) % slides.length)
  }, [])

  const prev = useCallback(() => {
    setDirection(-1)
    setCurrent(c => (c - 1 + slides.length) % slides.length)
  }, [])

  // Auto-advance every 6 seconds
  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(next, 6000)
    return () => clearInterval(timer)
  }, [isPaused, next])

  const slide = slides[current]

  return (
    <section
      className="relative bg-primary overflow-hidden h-[90vh] min-h-[650px] md:min-h-[550px] max-h-[800px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background image — crossfade */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <Image src={slide.bgImage} alt="" fill className="object-cover opacity-25" priority sizes="100vw" />
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradientFrom}`} />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={slide.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 text-xs px-4 py-2 rounded-full mb-5 backdrop-blur-sm border border-white/10">
              <slide.badgeIcon size={14} /> {slide.badge}
            </div>
            <h1 className="font-[family-name:var(--font-serif)] text-3xl sm:text-4xl md:text-5xl text-white leading-[1.1]">
              {slide.title}<br />
              <span className={slide.accentColor}>{slide.highlight}</span>
            </h1>
            <p className="mt-5 text-base md:text-lg text-white/85 leading-relaxed max-w-xl">
              {slide.desc}
            </p>
            <div className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Link href={slide.cta.href} className="btn-accent text-sm md:text-base py-3 md:py-4 px-6 md:px-8">
                {slide.id === 0 ? heroBottone : slide.cta.label} <ChevronRight size={16} className="ml-1" />
              </Link>
              {slide.ctaSecondary && (
                <Link href={slide.ctaSecondary.href}
                  className="btn-secondary border-white/30 text-white hover:bg-white/10 hover:text-white text-sm md:text-base py-3 md:py-4 px-6 md:px-8">
                  {slide.ctaSecondary.label}
                </Link>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows — hidden on small mobile, visible on md+ */}
        <div className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 hidden sm:flex flex-col gap-2">
          <button onClick={prev} className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors">
            <ArrowLeft size={16} className="text-white" />
          </button>
          <button onClick={next} className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors">
            <ArrowRight size={16} className="text-white" />
          </button>
        </div>

        {/* Dots + Stats */}
        <div className="absolute bottom-0 left-0 right-0">
          {/* Slide indicators */}
          <div className="flex justify-center gap-2 mb-3">
            {slides.map((_, i) => (
              <button key={i} onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === current ? 'w-8 bg-secondary' : 'w-3 bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>

          {/* Stats bar */}
          <div className="bg-black/30 backdrop-blur-sm">
            <div className="max-w-6xl mx-auto px-4 py-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {[
                { v: '< 30 min', l: 'Tempo di risposta' },
                { v: 'In 5 minuti', l: 'Preventivo online' },
                { v: '24/7', l: 'Sempre disponibili' },
                { v: '2.000+', l: 'Famiglie assistite' },
              ].map(s => (
                <div key={s.l}>
                  <p className="text-white font-semibold text-sm">{s.v}</p>
                  <p className="text-white/50 text-xs">{s.l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Progress bar */}
          {!isPaused && (
            <motion.div
              key={current}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 6, ease: 'linear' }}
              className="h-0.5 bg-secondary"
            />
          )}
        </div>
      </div>
    </section>
  )
}
