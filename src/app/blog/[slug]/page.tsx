'use client'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getSupabase } from '@/lib/supabase-client'
import { ArrowLeft, Calendar, ChevronRight } from 'lucide-react'

interface Post { titolo: string; contenuto: string; immagine: string; created_at: string }

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [post, setPost] = useState<Post | null>(null)

  useEffect(() => {
    getSupabase().from('blog_posts').select('*').eq('slug', slug).eq('pubblicato', true).single()
      .then(({ data }: { data: unknown }) => setPost(data as Post | null))
  }, [slug])

  if (!post) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-3 border-secondary border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div className="min-h-screen bg-background">
      {post.immagine && (
        <div className="relative h-64 md:h-80">
          <Image src={post.immagine} alt={post.titolo} fill className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>
      )}
      <div className="max-w-3xl mx-auto px-4 py-10">
        <Link href="/blog" className="flex items-center gap-1 text-secondary text-sm mb-6 hover:underline">
          <ArrowLeft size={14} /> Torna al blog
        </Link>
        <h1 className="font-[family-name:var(--font-serif)] text-3xl md:text-4xl text-primary mb-3">{post.titolo}</h1>
        <span className="flex items-center gap-1 text-sm text-text-muted mb-8">
          <Calendar size={14} /> {new Date(post.created_at).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}
        </span>
        <div className="prose prose-lg max-w-none text-text-light leading-relaxed" dangerouslySetInnerHTML={{ __html: post.contenuto.replace(/\n/g, '<br/>') }} />

        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-text-muted mb-4">Avete bisogno di assistenza?</p>
          <Link href="/configuratore" className="btn-primary">Configura il Servizio <ChevronRight size={16} className="ml-1" /></Link>
        </div>
      </div>
    </div>
  )
}
