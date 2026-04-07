'use client'

import Link from "next/link"
import { ArrowLeft, ChevronRight, BookOpen } from "lucide-react"
import { useTranslations } from "next-intl"

export default function Page() {
  const t = useTranslations("guidaInumazione")
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary py-16"><div className="max-w-4xl mx-auto px-4 text-center"><BookOpen size={36} className="mx-auto mb-3 text-secondary-light" /><h1 className="font-[family-name:var(--font-serif)] text-4xl text-white">{t("heroTitolo")}</h1><p className="mt-3 text-white/85">{t("heroSottotitolo")}</p></div></section>
      <section className="py-16"><div className="max-w-3xl mx-auto px-4">
        <Link href="/guida" className="flex items-center gap-1 text-secondary text-sm mb-8 hover:underline"><ArrowLeft size={14} /> {t("tutteLeGuide")}</Link>
        <div className="space-y-4">
          <div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">{t("inumazioneTitolo")}</h2><p className="text-sm text-text-light">{t("inumazioneDesc")} <strong>{t("inumazioneCosto")}</strong>{t("inumazioneNote")}</p></div>
          <div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">{t("tumulazioneTitolo")}</h2><p className="text-sm text-text-light">{t("tulazioneDesc")} <strong>{t("tumulazioneCosto")}</strong>{t("tulazioneNote")}</p></div>
          <div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">{t("sceltaTitolo")}</h2><ul className="list-disc pl-5 space-y-1 text-sm text-text-light"><li>{t("scelta1")}</li><li>{t("scelta2")}</li><li>{t("scelta3")}</li><li>{t("scelta4")}</li><li>{t("scelta5")}</li></ul></div>
        </div>
        <div className="mt-12 text-center"><Link href="/configuratore" className="btn-primary">{t("configuraCta")} <ChevronRight size={14} className="ml-1" /></Link></div>
      </div></section>
    </div>
  )
}
