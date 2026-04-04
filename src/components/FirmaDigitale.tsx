'use client'

import { useRef, useState, useEffect } from 'react'
import { Eraser, Check } from 'lucide-react'

interface FirmaDigitaleProps {
  onSave: (dataUrl: string) => void
  saved?: boolean
}

export function FirmaDigitale({ onSave, saved }: FirmaDigitaleProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [disegno, setDisegno] = useState(false)
  const [firmato, setFirmato] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    canvas.width = canvas.offsetWidth * 2
    canvas.height = canvas.offsetHeight * 2
    ctx.scale(2, 2)
    ctx.strokeStyle = '#2C3E50'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
  }, [])

  const getPos = (e: React.TouchEvent | React.MouseEvent) => {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    if ('touches' in e) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top }
    }
    return { x: (e as React.MouseEvent).clientX - rect.left, y: (e as React.MouseEvent).clientY - rect.top }
  }

  const startDraw = (e: React.TouchEvent | React.MouseEvent) => {
    setDisegno(true)
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    const { x, y } = getPos(e)
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e: React.TouchEvent | React.MouseEvent) => {
    if (!disegno) return
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    const { x, y } = getPos(e)
    ctx.lineTo(x, y)
    ctx.stroke()
    setFirmato(true)
  }

  const stopDraw = () => setDisegno(false)

  const pulisci = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setFirmato(false)
  }

  const salva = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dataUrl = canvas.toDataURL('image/png')
    onSave(dataUrl)
  }

  return (
    <div>
      <div className="border-2 border-dashed border-border rounded-lg bg-surface overflow-hidden touch-none">
        <canvas
          ref={canvasRef}
          className="w-full"
          style={{ height: 120 }}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={stopDraw}
        />
      </div>
      <div className="flex items-center justify-between mt-2">
        <button onClick={pulisci} className="text-xs text-text-muted hover:text-error flex items-center gap-1">
          <Eraser size={12} /> Pulisci
        </button>
        <div className="flex items-center gap-2">
          {saved && <span className="text-xs text-accent flex items-center gap-1"><Check size={12} /> Firmato</span>}
          {firmato && !saved && (
            <button onClick={salva} className="btn-accent text-xs py-1.5 px-3">
              <Check size={12} className="mr-1" /> Conferma firma
            </button>
          )}
        </div>
      </div>
      <p className="text-[10px] text-text-muted mt-1">Firmate con il dito (mobile) o con il mouse nell&apos;area sopra</p>
    </div>
  )
}
