'use client'

import Link from "next/link"
import { ArrowLeft, Users } from "lucide-react"
import { useTranslations } from "next-intl"

export default function Page() {
  const t = useTranslations("guidaLutto")
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary py-16"><div className="max-w-4xl mx-auto px-4 text-center"><Users size={36} className="mx-auto mb-3 text-secondary-light" /><h1 className="font-[family-name:var(--font-serif)] text-4xl text-white">{t("heroTitolo")}</h1><p className="mt-3 text-white/85">{t("heroSottotitolo")}</p></div></section>
      <section className="py-16"><div className="max-w-3xl mx-auto px-4">
        <Link href="/guida" className="flex items-center gap-1 text-secondary text-sm mb-8 hover:underline"><ArrowLeft size={14} /> {t("tutteLeGuide")}</Link>
        <div className="space-y-4">
          <div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">{t("fasiTitolo")}</h2><p className="text-sm text-text-light">{t("fasiDesc")}</p></div>
          <div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">{t("aiutoTitolo")}</h2><ul className="list-disc pl-5 space-y-1 text-sm text-text-light"><li>{t("aiuto1")}</li><li>{t("aiuto2")}</li><li>{t("aiuto3")}</li><li>{t("aiuto4")}</li><li>{t("aiuto5")}</li></ul></div>
          <div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">{t("risorseTitolo")}</h2><ul className="list-disc pl-5 space-y-1 text-sm text-text-light"><li>{t("risorsa1")}</li><li>{t("risorsa2")}</li><li>{t("risorsa3")}</li><li>{t("risorsa4")}</li></ul></div>
          <div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">{t("memorialTitolo")}</h2><p className="text-sm text-text-light">{t("memorialDesc")}</p></div>
        </div>
        <div className="mt-12 text-center"><Link href="/memorial" className="btn-secondary text-sm">{t("memorialCta")}</Link></div>
      </div></section>
    </div>
  )
}
