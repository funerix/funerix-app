'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Upload, X, Loader2 } from 'lucide-react'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  bucket?: string
  folder?: string
}

export function ImageUpload({ value, onChange, bucket = 'prodotti-immagini', folder = '' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('bucket', bucket)
    formData.append('folder', folder)

    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    const data = await res.json()

    if (data.success) {
      onChange(data.url)
    }
    setUploading(false)
  }

  return (
    <div className="relative">
      {value ? (
        <div className="relative w-full h-32 bg-background-dark rounded-lg overflow-hidden group">
          <Image src={value} alt="" fill className="object-cover" sizes="200px" />
          <button
            onClick={() => onChange('')}
            className="absolute top-2 right-2 w-6 h-6 bg-error text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={12} />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-32 bg-background-dark rounded-lg border-2 border-dashed border-border hover:border-secondary cursor-pointer transition-colors">
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          {uploading ? (
            <Loader2 size={20} className="text-secondary animate-spin" />
          ) : (
            <>
              <Upload size={20} className="text-text-muted mb-1" />
              <span className="text-[10px] text-text-muted">Clicca per caricare</span>
            </>
          )}
        </label>
      )}
    </div>
  )
}
