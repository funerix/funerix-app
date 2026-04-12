'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, X, Loader2 } from 'lucide-react'
import { getSupabase } from '@/lib/supabase-client'

interface ImageFieldProps {
  label: string
  value: string
  onChange: (url: string) => void
  hint?: string
}

export function ImageField({ label, value, onChange, hint }: ImageFieldProps) {
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const sb = getSupabase()
      const name = `cms/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`

      // Prova upload
      let { error } = await sb.storage.from('media').upload(name, file, { cacheControl: '31536000', upsert: false })

      if (error?.message?.includes('not found')) {
        await sb.storage.createBucket('media', { public: true })
        const retry = await sb.storage.from('media').upload(name, file, { cacheControl: '31536000', upsert: false })
        error = retry.error
      }

      if (!error) {
        const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${name}`
        onChange(url)
      } else {
        alert(`Errore: ${error.message}`)
      }
    } catch {
      alert('Errore durante il caricamento')
    }
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <div>
      <label className="block text-sm font-medium text-text mb-1">{label}</label>
      <div className="flex gap-3 items-start">
        <div className="flex-1">
          <input
            type="text"
            className="input-field text-xs"
            placeholder="/images/hero-xxx.png o URL caricata"
            value={value}
            onChange={e => onChange(e.target.value)}
          />
          {hint && <p className="text-xs text-text-muted mt-1">{hint}</p>}
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
            className="btn-secondary text-xs py-2 px-3 disabled:opacity-50">
            {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          </button>
          {value && (
            <button type="button" onClick={() => onChange('')} className="text-text-muted hover:text-error p-2">
              <X size={14} />
            </button>
          )}
        </div>
      </div>
      {value && (
        <div className="mt-2 relative w-full h-24 rounded-lg overflow-hidden bg-background-dark">
          <Image src={value} alt="Anteprima" fill className="object-cover" sizes="300px" unoptimized />
        </div>
      )}
    </div>
  )
}
