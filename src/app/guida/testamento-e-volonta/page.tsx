'use client'

import Link from "next/link"
import { ArrowLeft, FileText } from "lucide-react"
import { useTranslations } from "next-intl"

export default function Page() {
  const t = useTranslations("guidaTestamento")
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary py-16"><div className="max-w-4xl mx-auto px-4 text-center"><FileText size={36} className="mx-auto mb-3 text-secondary-light" /><h1 className="font-[family-name:var(--font-serif)] text-4xl text-white">{t("heroTitolo")}</h1><p className="mt-3 text-white/85">{t("heroSottotitolo")}</p></div></section>
      <section className="py-16"><div className="max-w-3xl mx-auto px-4">
        <Link href="/guida" className="flex items-center gap-1 text-secondary text-sm mb-8 hover:underline"><ArrowLeft size={14} /> {t("tutteLeGuide")}</Link>
        <div className="space-y-4">
          <div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">{t("disposizioniTitolo")}</h2><p className="text-sm text-text-light">{t("disposizioniDesc")}</p></div>
          <div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">{t("testamentoBiologicoTitolo")}</h2><p className="text-sm text-text-light">{t("testamentoBiologicoDesc")}</p></div>
          <div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">{t("pianificazioneTitolo")}</h2><p className="text-sm text-text-light">{t("pianificazioneDesc")}</p></div>
        </div>
      </div></section>
    </div>
  )
}
