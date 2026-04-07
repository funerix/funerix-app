# Funerix — Progetto Completo

## Live: https://funerix.com | https://funerix-app.vercel.app
## GitHub: https://github.com/funerix/funerix-app
## Admin: admin@funerix.com / funerix2026

---

## Stack Tecnologico
- **Frontend**: Next.js 16 + TypeScript + Tailwind CSS v4
- **Backend**: Supabase (PostgreSQL + Auth + Storage + Realtime)
- **State**: Zustand
- **Animazioni**: Framer Motion
- **PDF**: jsPDF
- **Grafici**: Recharts
- **Mappe**: Leaflet + React-Leaflet
- **QR Code**: qrcode.react
- **i18n**: next-intl (16 lingue, JSON statici)
- **Traduzioni**: DeepL API Free (sync script) + traduzione manuale Claude
- **Test**: Vitest (29 test)
- **Deploy**: Vercel (auto-deploy da GitHub)
- **Dominio**: funerix.com (DNS su Register.it → Vercel)

---

## Sistema Multi-Lingua

### Come funziona
- Ogni pagina usa `useTranslations('sezione')` da next-intl
- Tutte le stringhe visibili sono chiavi in file JSON (`src/i18n/messages/{lingua}.json`)
- 16 lingue supportate: IT, EN, FR, ES, DE, PT, RO, AR, RU, ZH, UK, PL, SQ, HI, BN, TL
- Rilevamento automatico lingua browser al primo accesso
- Selettore lingua nel header (16 bandiere)
- Supporto RTL per arabo

### Come aggiornare le traduzioni
1. **Modificare un testo**: cambiare il valore in `it.json`, poi aggiornare gli altri 15 file
2. **Aggiungere una feature/pagina**: aggiungere le chiavi in `it.json` sotto una nuova sezione, poi tradurre in tutti i file
3. **Script automatico**: `npm run translate` (quando quota DeepL disponibile) traduce da it.json a tutte le lingue
4. **Contenuti da DB**: quando lingua != IT, il frontend usa le traduzioni JSON; quando lingua = IT, usa i dati dal database Supabase

### Sezioni JSON (it.json)
header, home, footer, cookie, configuratore, common, catalogo, chiSiamo, contatti, cremazioneAnimali, esumazione, prezzi, rimpatri, previdenza, assistenza, memorial, convenzioni, guida, blog + 12 guide singole + cliente, memorialDettaglio, blogPost, onoranzeComune, manifesto

### Variabili d'ambiente
- `DEEPL_API_KEY` — chiave DeepL API Free per script npm run translate
- Deve essere configurata anche su Vercel (Settings → Environment Variables)

---

## Database: 22 tabelle Supabase

| Tabella | Rows | Frontend | Admin |
|---|---|---|---|
| categorie | 5 | ✅ Catalogo + Configuratore | ❌ |
| prodotti | 36 | ✅ Catalogo + Configuratore | ✅ CRUD (via API route) |
| memorial | 4 | ✅ /memorial | ✅ CRUD |
| messaggi_memorial | 5 | ✅ /memorial/[id] | ✅ |
| richieste | 6+ | ✅ Configuratore → Admin | ✅ Lista + Scheda 6 tab |
| clienti | 3+ | ✅ /cliente?token= | ✅ |
| pagamenti | 0 | ❌ | ❌ (attesa Stripe) |
| impostazioni | 1 | ✅ Header, Footer, Contatti | ✅ |
| contenuti | 1 | ✅ Homepage, Footer (solo IT) | ✅ |
| blog_posts | 5 | ✅ /blog | ✅ CRUD |
| comunicazioni | 0+ | ✅ Chat consulente-cliente | ✅ |
| agenzie | 1 | ✅ Manifesto | ✅ |
| appuntamenti | 0 | ❌ Solo admin | ✅ Calendario |
| referral | 0+ | ✅ Sconto in configuratore | ✅ CRUD |
| admin_users | 3+ | ✅ /admin/login | ✅ CRUD con ruoli |
| servizi_homepage | 6 | ✅ Homepage card (solo IT) | ✅ CRUD |
| faq | 6 | ✅ Homepage FAQ (solo IT) | ✅ CRUD |
| testimonianze | 3 | ✅ Homepage (solo IT) | ✅ CRUD |
| piani_previdenza | 0 | ✅ /previdenza | ✅ Lista |
| pagamenti_piano | 0 | ❌ | ❌ (attesa Stripe) |
| rsa_convenzionate | 0 | ✅ /convenzioni | ✅ CRUD |
| log_attivita | 0+ | ❌ | ✅ Log azioni admin |

Supabase Storage:
- Bucket `translations` — cache traduzioni per lingua (file JSON)

---

## Pagine Frontend (48+)

### Pubbliche
| Pagina | URL | Tradotta |
|---|---|---|
| Homepage | / | ✅ 100% |
| Configuratore (4 tipi) | /configuratore | ✅ 100% |
| Catalogo | /catalogo | ✅ 100% |
| Prezzi | /prezzi | ✅ 100% |
| Rimpatri | /rimpatri | ✅ 100% |
| Cremazione Animali | /cremazione-animali | ✅ 100% |
| Esumazione | /esumazione | ✅ 100% |
| Previdenza | /previdenza | ✅ 100% |
| Convenzioni RSA | /convenzioni | ✅ 100% |
| Memorial lista | /memorial | ✅ 100% |
| Memorial singolo | /memorial/[id] | ✅ In corso |
| Manifesto | /manifesto/[id] | ✅ In corso |
| Blog | /blog | ✅ 100% |
| Blog articolo | /blog/[slug] | ✅ In corso |
| Guide indice | /guida | ✅ 100% |
| 12 guide singole | /guida/* | ✅ In corso |
| Chi Siamo | /chi-siamo | ✅ 100% |
| Contatti | /contatti | ✅ 100% |
| Assistenza | /assistenza | ✅ 100% |
| Area Cliente | /cliente?token= | ✅ In corso |
| SEO comuni | /onoranze-funebri/[comune] | ✅ In corso |
| Sitemap | /sitemap.xml | ✅ |
| Robots | /robots.txt | ✅ |

### Admin (16 pagine — NON tradotte, solo italiano)
| Pagina | URL | Stato |
|---|---|---|
| Login | /admin/login | ✅ |
| Dashboard | /admin | ✅ Stats reali |
| Richieste lista | /admin/richieste | ✅ |
| Scheda cliente | /admin/richieste/[id] | ✅ 6 tab + traduttore chat |
| Prodotti | /admin/prodotti | ✅ CRUD (via API route) |
| Consulenti | /admin/consulenti | ✅ 3 ruoli + permessi |
| Homepage | /admin/homepage | ✅ CRUD servizi/FAQ/testimonianze |
| Memorial | /admin/memorial | ✅ CRUD |
| Blog | /admin/blog | ✅ CRUD |
| Contenuti | /admin/contenuti | ✅ Editor testi |
| Impostazioni | /admin/impostazioni | ✅ WhatsApp + dati |
| Media | /admin/media | ✅ Galleria |
| Agenzie | /admin/agenzie | ✅ CRUD |
| Calendario | /admin/calendario | ✅ Appuntamenti |
| Analytics | /admin/analytics | ✅ Grafici |
| Referral | /admin/referral | ✅ Codici sconto |
| Previdenza | /admin/previdenza | ✅ Lista piani |
| RSA | /admin/rsa | ✅ CRUD strutture |

---

## API Routes (12)
| Endpoint | Metodo | Funzione |
|---|---|---|
| /api/auth | POST/GET/DELETE | Login, check sessione, logout |
| /api/cliente | POST/GET | Crea account cliente, verifica token |
| /api/cliente/chat | POST | Messaggi chat cliente-consulente |
| /api/cliente/documenti | POST/GET | Upload/download documenti |
| /api/memorial | POST/PUT | CRUD memorial |
| /api/notifica | POST | Notifica consulente (WhatsApp Business) |
| /api/notifica-stato | POST | Email cambio stato (Resend predisposto) |
| /api/prodotti | GET/POST/PUT/DELETE | CRUD prodotti (service role key) |
| /api/richieste | POST/GET | CRUD richieste |
| /api/translate | POST | Traduzione testi via DeepL + cache Storage |
| /api/upload | POST | Upload immagini Supabase Storage |
| /api/whatsapp | POST | Invio WhatsApp Business API |

---

## FASI COMPLETATE

### FASE 1: Backend Admin ✅ COMPLETATA
1. ✅ Sidebar admin con navigazione raggruppata
2. ✅ Gestione consulenti — 3 ruoli (admin/manager/consulente) + permessi personalizzabili
3. ✅ Dashboard consulente — vista filtrata per pratiche assegnate
4. ✅ Assegnazione pratiche — con notifiche e log attività
5. ✅ CRUD servizi homepage — tab servizi in /admin/homepage
6. ✅ CRUD FAQ — tab FAQ in /admin/homepage
7. ✅ CRUD testimonianze — tab testimonianze in /admin/homepage
8. ✅ Referral collegato al configuratore — sconto automatico con codice URL

### FASE 3: Completamento ✅ COMPLETATA
9. ✅ Fix salvataggio prodotti DB — API route con service role key (bypassa RLS)
10. ✅ 18 prodotti nuovi aggiunti al DB (totale 36 prodotti)
11. ✅ Cookie banner GDPR — 3 livelli (necessari/analytics/marketing)
12. ✅ Multi-lingua completa — next-intl, 16 lingue, ogni pagina tradotta
13. ✅ Test automatici — Vitest, 29 test (i18n, types, utils, API)
14. ✅ DeepL integrato — script npm run translate + API route con cache
15. ✅ Traduttore chat admin — widget real-time in tab Comunicazioni

---

## COSA FARE — Prossimi step

### FASE 2: Integrazioni esterne ⏸️ IN STANDBY (servono API key)
1. ⬜ **Stripe pagamenti** — acconto, rate previdenza, link pagamento
2. ⬜ **Resend email** — conferma cliente, notifiche stato, email consulente
3. ⬜ **OpenAI chatbot** — assistente AI invece di keyword match

### FASE 4: Contenuti e media
4. ⬜ **61 immagini AI** — prodotti, servizi, sfondi (prompt pronti)
5. ⬜ **Piani previdenza flusso completo** — pagamento ricorrente Stripe, dashboard rate

### FASE 5: Crescita
6. ⬜ **Google Reviews widget** — recensioni reali
7. ⬜ **Google Calendar sync** — appuntamenti
8. ⬜ **SMS automatici** — Twilio per cambio stato
9. ⬜ **App mobile consulente** — React Native
10. ⬜ **A/B testing** — landing page

---

## Componenti chiave

### Store (Zustand)
- `src/store/sito.ts` — Store principale: prodotti, categorie, memorial, richieste, impostazioni, contenuti, servizi homepage, FAQ, testimonianze. Carica da Supabase via `loadFromSupabase()`.
- `src/store/configuratore.ts` — Stato del configuratore: step, selezioni, totale.

### Hooks
- `src/lib/useAdminUser.ts` — Ruolo e permessi utente admin
- `src/lib/useAutoTranslate.ts` — Traduzione automatica contenuti DB (per chat cliente)
- `src/lib/useTranslateContent.ts` — Hook traduzione con cache localStorage

### i18n
- `src/i18n/config.ts` — Lista 16 lingue e default locale
- `src/i18n/provider.tsx` — Context provider con lazy loading messaggi + detect browser language
- `src/i18n/messages/*.json` — File traduzione per lingua (30+ sezioni, 600+ chiavi)

### Admin
- `src/components/admin/ChatTranslator.tsx` — Traduttore real-time per comunicazioni con clienti stranieri
- `src/app/admin/layout.tsx` — Sidebar con filtro per ruolo/permessi + `data-admin` per esclusione traduzioni

### Scripts
- `scripts/translate.mjs` — Sync traduzioni da it.json a tutte le lingue via DeepL API
  - Uso: `npm run translate`
  - Richiede: DEEPL_API_KEY in .env.local
  - Limite: 500.000 caratteri/mese (Free tier)
