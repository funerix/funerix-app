'use client'
import Link from "next/link"
import { ArrowLeft, Phone, FileText, CheckCircle2 } from "lucide-react"
import { useTranslations } from 'next-intl'

export default function Page() {
  const t = useTranslations('guidaDocumenti')
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary py-16"><div className="max-w-4xl mx-auto px-4 text-center">
        <FileText size={36} className="mx-auto mb-3 text-secondary-light" />
        <h1 className="font-[family-name:var(--font-serif)] text-4xl text-white">{t('titolo')}</h1>
        <p className="mt-3 text-white/85">{t('sottotitolo')}</p>
      </div></section>
      <section className="py-16"><div className="max-w-3xl mx-auto px-4">
        <Link href="/guida" className="flex items-center gap-1 text-secondary text-sm mb-8 hover:underline"><ArrowLeft size={14} /> {t('tutteLeGuide')}</Link>
        <div className="space-y-4">
          <div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">{t('voisTitolo')}</h2>
          <div className="space-y-2">{([t('doc1'), t('doc2'), t('doc3'), t('doc4')] as string[]).map(d=>
            <div key={d} className="flex gap-2 text-sm text-text-light"><CheckCircle2 size={16} className="text-accent flex-shrink-0 mt-0.5" />{d}</div>)}</div></div>
          <div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">{t('noiTitolo')}</h2>
          <div className="space-y-2">{([t('noi1'), t('noi2'), t('noi3'), t('noi4'), t('noi5'), t('noi6'), t('noi7')] as string[]).map(d=>
            <div key={d} className="flex gap-2 text-sm text-text-light"><CheckCircle2 size={16} className="text-secondary flex-shrink-0 mt-0.5" />{d}</div>)}</div></div>
          <div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">{t('tempisticheTitolo')}</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm text-text-light">
            <li>{t('temp1')}</li>
            <li>{t('temp2')}</li>
            <li>{t('temp3')}</li>
            <li>{t('temp4')}</li>
          </ul></div>
        </div>
        <div className="mt-12 text-center">
          <a href="tel:+390815551234" className="btn-primary"><Phone size={16} className="mr-2" /> {t('chiamaci')}</a>
        </div>
      </div></section>
    </div>
  )
}
