'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Upload, Trash2, Copy, Check, Loader2 } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { getSupabase } from '@/lib/supabase-client'

interface MediaFile {
  name: string
  url: string
  size: number
}

export default function AdminMediaPage() {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [copied, setCopied] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadFiles()
  }, [])

  const loadFiles = async () => {
    try {
      const sb = getSupabase()
      const { data } = await sb.storage.from('media').list('uploads', { limit: 200, sortBy: { column: 'created_at', order: 'desc' } })
      if (data) {
        const mediaFiles = (data as any[])
          .filter((f: any) => !f.name.startsWith('.'))
          .map((f: any) => ({
            name: f.name,
            url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/uploads/${f.name}`,
            size: f.metadata?.size || 0,
          }))
        setFiles(mediaFiles)
      }
    } catch { /* bucket might not exist yet */ }
    setLoading(false)
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const sb = getSupabase()
      const ext = file.name.split('.').pop()
      const name = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`

      const { error } = await sb.storage.from('media').upload(`uploads/${name}`, file, {
        cacheControl: '31536000',
        upsert: false,
      })

      if (error) {
        // Se il bucket non esiste, proviamo a crearlo
        if (error.message.includes('not found')) {
          await sb.storage.createBucket('media', { public: true })
          await sb.storage.from('media').upload(`uploads/${name}`, file, { cacheControl: '31536000', upsert: false })
        } else {
          alert(`Errore: ${error.message}`)
          setUploading(false)
          return
        }
      }

      await loadFiles()
    } catch (err) {
      alert('Errore durante il caricamento')
    }
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleDelete = async (name: string) => {
    if (!confirm(`Eliminare ${name}?`)) return
    const sb = getSupabase()
    await sb.storage.from('media').remove([`uploads/${name}`])
    setFiles(prev => prev.filter(f => f.name !== name))
  }

  const handleCopy = (url: string, name: string) => {
    navigator.clipboard.writeText(url)
    setCopied(name)
    setTimeout(() => setCopied(''), 2000)
  }

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '—'
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1048576) return `${Math.round(bytes / 1024)} KB`
    return `${(bytes / 1048576).toFixed(1)} MB`
  }

  return (
    <div className="min-h-screen bg-background-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-text-muted hover:text-primary"><ArrowLeft size={20} /></Link>
            <div>
              <h1 className="font-[family-name:var(--font-serif)] text-3xl text-primary">Galleria Media</h1>
              <p className="text-text-light text-sm">{files.length} file caricati</p>
            </div>
          </div>
          <div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
            <button onClick={() => fileRef.current?.click()} disabled={uploading} className="btn-accent text-sm disabled:opacity-50">
              {uploading ? <><Loader2 size={16} className="mr-2 animate-spin" /> Caricamento...</> : <><Upload size={16} className="mr-2" /> Carica immagine</>}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12"><div className="w-8 h-8 border-3 border-secondary border-t-transparent rounded-full animate-spin mx-auto" /></div>
        ) : files.length === 0 ? (
          <div className="card p-12 text-center">
            <Upload size={40} className="mx-auto mb-4 text-text-muted" />
            <p className="text-text-muted mb-2">Nessun file caricato</p>
            <p className="text-text-muted text-sm">Caricate immagini per usarle nei prodotti, blog e memorial.</p>
            <p className="text-text-muted text-xs mt-4">Nota: le immagini statiche del sito sono in /public/images/ e non appaiono qui.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {files.map(f => (
              <div key={f.name} className="card p-3 group">
                <div className="w-full h-32 bg-background-dark rounded-lg relative overflow-hidden mb-3">
                  <Image src={f.url} alt={f.name} fill className="object-cover" sizes="200px" unoptimized />
                </div>
                <p className="text-xs font-medium text-primary truncate">{f.name}</p>
                <p className="text-[10px] text-text-muted">{formatSize(f.size)}</p>
                <div className="flex gap-1 mt-2">
                  <button onClick={() => handleCopy(f.url, f.name)}
                    className="p-1.5 text-text-muted hover:text-primary transition-colors" title="Copia URL">
                    {copied === f.name ? <Check size={12} className="text-accent" /> : <Copy size={12} />}
                  </button>
                  <button onClick={() => handleDelete(f.name)}
                    className="p-1.5 text-text-muted hover:text-error transition-colors" title="Elimina">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
