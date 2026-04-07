'use client'

import Link from "next/link"
import { ArrowLeft, ChevronRight, Flame } from "lucide-react"
import { useTranslations } from "next-intl"

export default function Page() {
  const t = useTranslations("guidaCremazione")
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary py-16"><div className="max-w-4xl mx-auto px-4 text-center">
        <Flame size={36} className="mx-auto mb-3 text-secondary-light" />
        <h1 className="font-[family-name:var(--font-serif)] text-4xl text-white">{t("heroTitolo")}</h1>
        <p className="mt-3 text-white/85">{t("heroSottotitolo")}</p>
      </div></section>
      <section className="py-16"><div className="max-w-3xl mx-auto px-4">
        <Link href="/guida" className="flex items-center gap-1 text-secondary text-sm mb-8 hover:underline"><ArrowLeft size={14} /> {t("tutteLeGuide")}</Link>
        <div className="space-y-4">
          <div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">{t("proceduraTitolo")}</h2>
          <ol className="list-decimal pl-5 space-y-2 text-sm text-text-light"><li>{t("procedura1")}</li><li>{t("procedura2")}</li><li>{t("procedura3")}</li><li>{t("procedura4")}</li><li>{t("procedura5")}</li></ol></div>
          <div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">{t("crematoriTitolo")}</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm text-text-light"><li><strong>{t("crematorio1")}</strong> — {t("crematorio1Desc")}</li><li><strong>{t("crematorio2")}</strong></li></ul>
          <p className="text-sm text-text-muted mt-2">{t("tempiAttesa")}</p></div>
          <div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">{t("costiTitolo")}</h2>
          <div className="space-y-2 text-sm text-text-light"><p>{t("costoTariffaLabel")} <strong>{t("costoTariffaValore")}</strong></p><p>{t("costoCellaLabel")} <strong>{t("costoCellaValore")}</strong></p><p>{t("costoUrnaLabel")} <strong>{t("costoUrnaValore")}</strong></p><p>{t("costoCofanoLabel")} <strong>{t("costoCofanoValore")}</strong></p><p className="font-medium text-primary mt-2">{t("costoPackage")}</p></div></div>
          <div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">{t("destinazioneTitolo")}</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm text-text-light"><li>{t("destinazione1")}</li><li>{t("destinazione2")}</li><li>{t("destinazione3")}</li><li>{t("destinazione4")}</li></ul></div>
        </div>
        <div className="mt-12 text-center"><Link href="/configuratore" className="btn-primary">{t("configuraCta")} <ChevronRight size={14} className="ml-1" /></Link></div>
      </div></section>
    </div>
  )
}
