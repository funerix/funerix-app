'use client'

import Link from 'next/link'
import Image from 'next/image'
import { getSupabase } from '@/lib/supabase-client'
import { useEffect, useState } from 'react'
import { Calendar } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useLocale } from '@/i18n/provider'
import { useTranslateDB } from '@/lib/useTranslateDB'

interface Post { id: string; titolo: string; slug: string; excerpt: string; immagine: string; created_at: string }

export default function BlogPage() {
  const t = useTranslations('blog')
  const { locale } = useLocale()
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    getSupabase().from('blog_posts').select('*').eq('pubblicato', true).order('created_at', { ascending: false })
      .then(({ data }: { data: unknown[] | null }) => setPosts((data || []) as Post[]))
  }, [])

  const tTitoli = useTranslateDB(posts.map(p => p.titolo), locale)
  const tExcerpt = useTranslateDB(posts.map(p => p.excerpt), locale)

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary py-16 relative overflow-hidden">
        <Image src="/images/candele.jpg" alt="" fill className="object-cover opacity-25" sizes="100vw" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-[family-name:var(--font-serif)] text-4xl text-white">{t('titolo')}</h1>
          <p className="mt-4 text-white/80 text-lg">{t('sottotitolo')}</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {posts.length === 0 ? (
          <p className="text-center text-text-muted py-16">{t('nessunoArticolo')}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="card group">
                {post.immagine && (
                  <div className="w-full h-40 bg-background-dark rounded-lg mb-4 relative overflow-hidden">
                    <Image src={post.immagine} alt={post.titolo} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="300px" />
                  </div>
                )}
                <h2 className="font-[family-name:var(--font-serif)] text-lg text-primary group-hover:text-secondary transition-colors mb-2">{tTitoli[posts.indexOf(post)] || post.titolo}</h2>
                <p className="text-text-light text-sm line-clamp-3 mb-3">{tExcerpt[posts.indexOf(post)] || post.excerpt}</p>
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
