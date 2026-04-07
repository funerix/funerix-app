'use client'

import Link from "next/link"
import { ArrowLeft, ChevronRight, Heart, Phone } from "lucide-react"
import { useTranslations } from "next-intl"

export default function Page() {
  const t = useTranslations("guidaAnimali")
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Heart size={36} className="mx-auto mb-3 text-secondary-light" />
          <h1 className="font-[family-name:var(--font-serif)] text-4xl text-white">{t("heroTitolo")}</h1>
          <p className="mt-3 text-white/85">{t("heroSottotitolo")}</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <Link href="/guida" className="flex items-center gap-1 text-secondary text-sm mb-8 hover:underline">
            <ArrowLeft size={14} /> {t("tutteLeGuide")}
          </Link>

          <div className="prose max-w-none text-text-light leading-relaxed mb-8">
            <p className="text-lg">{t("intro")}</p>
          </div>

          <div className="space-y-4">
            <div className="card">
              <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">{t("individualeTitle")}</h2>
              <p className="text-sm text-text-light mb-3">{t("individualeDesc")}</p>
              <div className="bg-background rounded-lg p-3 space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-text-muted">{t("canePickola")}</span><span className="font-semibold text-primary">{t("canePickolaPrezzo")}</span></div>
                <div className="flex justify-between"><span className="text-text-muted">{t("caneMedia")}</span><span className="font-semibold text-primary">{t("caneMediaPrezzo")}</span></div>
                <div className="flex justify-between"><span className="text-text-muted">{t("caneGrande")}</span><span className="font-semibold text-primary">{t("caneGrandePrezzo")}</span></div>
                <div className="flex justify-between"><span className="text-text-muted">{t("gatto")}</span><span className="font-semibold text-primary">{t("gattoPrezzo")}</span></div>
                <div className="flex justify-between"><span className="text-text-muted">{t("altriAnimali")}</span><span className="font-semibold text-primary">{t("altriAnimaliPrezzo")}</span></div>
              </div>
            </div>

            <div className="card">
              <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">{t("collettivaTitle")}</h2>
              <p className="text-sm text-text-light mb-3">{t("collettivaDesc")}</p>
              <div className="bg-background rounded-lg p-3 text-sm">
                <div className="flex justify-between"><span className="text-text-muted">{t("collettivaVoce")}</span><span className="font-semibold text-primary">{t("collettivaPrezzo")}</span></div>
              </div>
            </div>

            <div className="card">
              <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">{t("aggiuntivi")}</h2>
              <div className="bg-background rounded-lg p-3 space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-text-muted">{t("ritiroDomicilio")}</span><span className="font-semibold text-primary">{t("ritiroDomicilioPrezzo")}</span></div>
                <div className="flex justify-between"><span className="text-text-muted">{t("urnaCeramica")}</span><span className="font-semibold text-primary">{t("urnaCeramicaPrezzo")}</span></div>
                <div className="flex justify-between"><span className="text-text-muted">{t("urnaLegno")}</span><span className="font-semibold text-primary">{t("urnaLegnoPrezzo")}</span></div>
                <div className="flex justify-between"><span className="text-text-muted">{t("urnaMarmo")}</span><span className="font-semibold text-primary">{t("urnaMarmoPrezzo")}</span></div>
                <div className="flex justify-between"><span className="text-text-muted">{t("impronta")}</span><span className="font-semibold text-primary">{t("improntaPrezzo")}</span></div>
              </div>
            </div>

            <div className="card">
              <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">{t("comeProcedereTitle")}</h2>
              <ol className="list-decimal pl-5 space-y-2 text-sm text-text-light">
                <li><strong>{t("passo1Titolo")}</strong> — {t("passo1Desc")}</li>
                <li><strong>{t("passo2Titolo")}</strong> — {t("passo2Desc")}</li>
                <li><strong>{t("passo3Titolo")}</strong> — {t("passo3Desc")}</li>
                <li><strong>{t("passo4Titolo")}</strong> — {t("passo4Desc")}</li>
                <li><strong>{t("passo5Titolo")}</strong> — {t("passo5Desc")}</li>
              </ol>
            </div>

            <div className="card">
              <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">{t("perditaTitolo")}</h2>
              <p className="text-sm text-text-light">{t("perditaDesc")}</p>
            </div>

            <div className="card">
              <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">{t("leggeTitolo")}</h2>
              <p className="text-sm text-text-light">{t("leggeDesc")}</p>
            </div>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/configuratore" className="btn-primary">
              {t("configuraCta")} <ChevronRight size={14} className="ml-1" />
            </Link>
            <a href="tel:+390815551234" className="btn-secondary">
              <Phone size={16} className="mr-2" /> {t("chiamaCta")}
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
