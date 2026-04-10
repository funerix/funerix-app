'use client'

import Link from 'next/link'
import Image from 'next/image'
import { getSupabase } from '@/lib/supabase-client'
import { useEffect, useState } from 'react'
import { Calendar } from 'lucide-react'

interface Post { id: string; titolo: string; slug: string; excerpt: string; immagine: string; created_at: string }

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    getSupabase().from('blog_posts').select('*').eq('pubblicato', true).order('created_at', { ascending: false })
      .then(({ data }: { data: unknown[] | null }) => setPosts((data || []) as Post[]))
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary py-20 md:py-28 relative overflow-hidden">
        <Image src="/images/hero-come-funziona.png" alt="" fill className="object-cover opacity-20" sizes="100vw" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-[family-name:var(--font-serif)] text-4xl md:text-5xl text-white">Guida e Informazioni</h1>
          <p className="mt-4 text-white/80 text-lg">Articoli utili per orientarsi nei momenti difficili</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-16">
        {posts.length === 0 ? (
          <p className="text-center text-text-muted py-16">Nessun articolo pubblicato ancora.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="card group">
                {post.immagine && (
                  <div className="w-full h-40 bg-background-dark rounded-lg mb-4 relative overflow-hidden">
                    <Image src={post.immagine} alt={post.titolo} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="300px" />
                  </div>
                )}
                <h2 className="font-[family-name:var(--font-serif)] text-lg text-primary group-hover:text-secondary transition-colors mb-2">{post.titolo}</h2>
                <p className="text-text-light text-sm line-clamp-3 mb-3">{post.excerpt}</p>
                <span className="flex items-center gap-1 text-xs text-text-muted">
                  <Calendar size={12} /> {new Date(post.created_at).toLocaleDateString('it-IT')}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
