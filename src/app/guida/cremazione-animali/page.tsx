import Link from "next/link"
import { ArrowLeft, ChevronRight, Heart, Phone, Dog, Cat } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cremazione Animali Domestici — Guida completa",
  description: "Guida alla cremazione di cani, gatti e altri animali domestici. Cremazione individuale e collettiva, costi, urne, ritiro a domicilio, come affrontare la perdita.",
  keywords: "cremazione cane, cremazione gatto, cremazione animali napoli, costo cremazione animale, urna animale domestico, perdita animale domestico",
}

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Heart size={36} className="mx-auto mb-3 text-secondary-light" />
          <h1 className="font-[family-name:var(--font-serif)] text-4xl text-white">Cremazione Animali Domestici</h1>
          <p className="mt-3 text-white/85">Guida completa — un ultimo saluto dignitoso per il vostro compagno</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <Link href="/guida" className="flex items-center gap-1 text-secondary text-sm mb-8 hover:underline">
            <ArrowLeft size={14} /> Tutte le guide
          </Link>

          <div className="prose max-w-none text-text-light leading-relaxed mb-8">
            <p className="text-lg">
              Perdere un animale domestico &egrave; un dolore profondo. Sono compagni di vita che ci donano
              amore incondizionato per anni. Meritano un ultimo saluto fatto di rispetto e dignit&agrave;.
            </p>
          </div>

          <div className="space-y-4">
            <div className="card">
              <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">Cremazione individuale</h2>
              <p className="text-sm text-text-light mb-3">
                Il vostro animale viene cremato singolarmente. Le ceneri vengono raccolte e restituite
                alla famiglia in un&apos;urna dedicata. Potete scegliere tra urne in ceramica, legno o marmo.
              </p>
              <div className="bg-background rounded-lg p-3 space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-text-muted">Cane piccola taglia (fino a 10 kg)</span><span className="font-semibold text-primary">&euro; 150 — 200</span></div>
                <div className="flex justify-between"><span className="text-text-muted">Cane media taglia (10-25 kg)</span><span className="font-semibold text-primary">&euro; 200 — 300</span></div>
                <div className="flex justify-between"><span className="text-text-muted">Cane grande taglia (oltre 25 kg)</span><span className="font-semibold text-primary">&euro; 300 — 450</span></div>
                <div className="flex justify-between"><span className="text-text-muted">Gatto</span><span className="font-semibold text-primary">&euro; 120 — 180</span></div>
                <div className="flex justify-between"><span className="text-text-muted">Altri animali (conigli, uccelli, ecc.)</span><span className="font-semibold text-primary">&euro; 80 — 150</span></div>
              </div>
            </div>

            <div className="card">
              <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">Cremazione collettiva</h2>
              <p className="text-sm text-text-light mb-3">
                Pi&ugrave; animali vengono cremati insieme. Le ceneri vengono disperse in un&apos;area dedicata.
                Non &egrave; prevista la restituzione delle ceneri. Costo pi&ugrave; contenuto.
              </p>
              <div className="bg-background rounded-lg p-3 text-sm">
                <div className="flex justify-between"><span className="text-text-muted">Cremazione collettiva (qualsiasi animale)</span><span className="font-semibold text-primary">&euro; 50 — 100</span></div>
              </div>
            </div>

            <div className="card">
              <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">Servizi aggiuntivi</h2>
              <div className="bg-background rounded-lg p-3 space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-text-muted">Ritiro a domicilio</span><span className="font-semibold text-primary">&euro; 50 — 80</span></div>
                <div className="flex justify-between"><span className="text-text-muted">Urna in ceramica</span><span className="font-semibold text-primary">&euro; 30 — 60</span></div>
                <div className="flex justify-between"><span className="text-text-muted">Urna in legno con incisione</span><span className="font-semibold text-primary">&euro; 60 — 100</span></div>
                <div className="flex justify-between"><span className="text-text-muted">Urna in marmo</span><span className="font-semibold text-primary">&euro; 100 — 150</span></div>
                <div className="flex justify-between"><span className="text-text-muted">Impronta della zampa (calco in gesso)</span><span className="font-semibold text-primary">&euro; 30 — 50</span></div>
              </div>
            </div>

            <div className="card">
              <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">Come procedere</h2>
              <ol className="list-decimal pl-5 space-y-2 text-sm text-text-light">
                <li><strong>Contattateci</strong> — Chiamate o scrivete su WhatsApp a qualsiasi ora. Siamo disponibili anche la notte e nei festivi.</li>
                <li><strong>Ritiro</strong> — Se necessario, veniamo noi a ritirare il vostro animale presso la vostra abitazione o dal veterinario.</li>
                <li><strong>Scelta del servizio</strong> — Decidete insieme al consulente il tipo di cremazione, l&apos;urna e i servizi aggiuntivi.</li>
                <li><strong>Cremazione</strong> — La cremazione avviene in impianti autorizzati. Tempi: 24-72 ore.</li>
                <li><strong>Restituzione ceneri</strong> — Per la cremazione individuale, le ceneri vengono restituite nell&apos;urna scelta.</li>
              </ol>
            </div>

            <div className="card">
              <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">Affrontare la perdita</h2>
              <p className="text-sm text-text-light">
                Il dolore per la perdita di un animale domestico &egrave; reale e legittimo. Non vergognatevi di piangere
                il vostro compagno. Molti trovano conforto nel conservare le ceneri in un luogo speciale della casa,
                nel creare un piccolo memorial con foto e ricordi, o nel piantare un albero in memoria.
                Se il dolore persiste, non esitate a parlare con qualcuno.
              </p>
            </div>

            <div className="card">
              <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">Cosa dice la legge</h2>
              <p className="text-sm text-text-light">
                In Italia la cremazione degli animali domestici &egrave; regolata dal Regolamento CE 1069/2009
                e dal D.Lgs. 36/2005. Gli impianti devono essere autorizzati dalla ASL veterinaria.
                Le ceneri possono essere conservate a casa o disperse in aree private con il consenso del proprietario.
                &Egrave; vietato disperdere le ceneri in luoghi pubblici senza autorizzazione.
              </p>
            </div>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/configuratore" className="btn-primary">
              Configura cremazione animale <ChevronRight size={14} className="ml-1" />
            </Link>
            <a href="tel:+390815551234" className="btn-secondary">
              <Phone size={16} className="mr-2" /> Chiama Ora
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
