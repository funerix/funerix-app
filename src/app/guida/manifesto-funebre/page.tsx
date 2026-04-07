'use client'

import Link from "next/link"
import { ArrowLeft, ScrollText } from "lucide-react"
import { useTranslations } from "next-intl"

export default function Page() {
  const t = useTranslations("guidaManifesto")
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary py-16"><div className="max-w-4xl mx-auto px-4 text-center"><ScrollText size={36} className="mx-auto mb-3 text-secondary-light" /><h1 className="font-[family-name:var(--font-serif)] text-4xl text-white">{t("heroTitolo")}</h1><p className="mt-3 text-white/85">{t("heroSottotitolo")}</p></div></section>
      <section className="py-16"><div className="max-w-3xl mx-auto px-4">
        <Link href="/guida" className="flex items-center gap-1 text-secondary text-sm mb-8 hover:underline"><ArrowLeft size={14} /> {t("tutteLeGuide")}</Link>
        <div className="space-y-4">
          <div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">{t("strutturaTitolo")}</h2><p className="text-sm text-text-light">{t("strutturaDesc")}</p></div>
          <div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">{t("costiTitolo")}</h2><ul className="list-disc pl-5 space-y-1 text-sm text-text-light"><li>{t("costo1Label")} <strong>{t("costo1Valore")}</strong></li><li>{t("costo2Label")} <strong>{t("costo2Valore")}</strong></li><li>{t("costo3Label")} <strong>{t("costo3Valore")}</strong></li><li>{t("costo4Label")} <strong>{t("costo4Valore")}</strong></li></ul></div>
          <div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">{t("doveTitolo")}</h2><p className="text-sm text-text-light">{t("doveDesc")}</p></div>
          <div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">{t("serviziTitolo")}</h2><p className="text-sm text-text-light">{t("serviziDesc")}</p></div>
        </div>
      </div></section>
    </div>
  )
}
