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
- **Traduzioni**: Google Translate API (gratuita) + cache Supabase Storage
- **Test**: Vitest
- **Deploy**: Vercel (auto-deploy da GitHub)
- **Dominio**: funerix.com

---

## Sistema Traduzioni

### Come funziona
- App scritta interamente in italiano
- Google Translate API traduce i testi visibili al volo
- 16 lingue: IT, EN, FR, ES, DE, PT, RO, AR, RU, ZH, UK, PL, SQ, HI, BN, TL
- Cache a 3 livelli: memoria → localStorage → Supabase Storage
- IP detection: Vercel middleware (x-vercel-ip-country) + fallback ipapi.co
- Loading overlay durante traduzione
- Selettore bandiere nel header

### Flusso traduzione
1. Utente arriva → middleware setta cookie `funerix-country` dal suo IP
2. LanguageSelector legge il paese → trova la lingua → traduce automaticamente
3. Traduzioni salvate su Supabase Storage (`translations/cache-{lang}.json`)
4. Prossimo utente nella stessa lingua → legge da Supabase → istantaneo

### Come aggiornare
- Modifichi/aggiungi testo in italiano → tradotto automaticamente al primo accesso
- Per pre-caricare cache: visita il sito e clicca ogni lingua una volta
- Nuovi prodotti/pagine: zero intervento, tradotti al primo accesso straniero

### File chiave
- `src/lib/translate.ts` — Motore traduzione (API Google + cache)
- `src/components/LanguageSelector.tsx` — Selettore con bandiere + IP detection
- `middleware.ts` — Vercel geo-detection via x-vercel-ip-country

---

## Database: 21 tabelle Supabase

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
| contenuti | 1 | ✅ Homepage, Footer | ✅ |
| blog_posts | 5 | ✅ /blog | ✅ CRUD |
| comunicazioni | 0+ | ✅ Chat consulente-cliente | ✅ |
| agenzie | 1 | ✅ Manifesto | ✅ |
| appuntamenti | 0 | ❌ Solo admin | ✅ Calendario |
| referral | 0+ | ✅ Sconto in configuratore | ✅ CRUD |
| admin_users | 3+ | ✅ /admin/login | ✅ CRUD con ruoli |
| servizi_homepage | 6 | ✅ Homepage card | ✅ CRUD |
| faq | 6 | ✅ Homepage FAQ | ✅ CRUD |
| testimonianze | 3 | ✅ Homepage | ✅ CRUD |
| piani_previdenza | 0 | ✅ /previdenza | ✅ Lista |
| pagamenti_piano | 0 | ❌ | ❌ (attesa Stripe) |
| rsa_convenzionate | 0 | ✅ /convenzioni | ✅ CRUD |

Supabase Storage:
- Bucket `translations` (pubblico) — cache traduzioni per lingua

---

## Pagine Frontend (48+)

### Pubbliche (tutte tradotte via Google Translate)
| Pagina | URL | Stato |
|---|---|---|
| Homepage | / | ✅ |
| Configuratore (4 tipi) | /configuratore | ✅ |
| Catalogo | /catalogo | ✅ |
| Prezzi | /prezzi | ✅ |
| Rimpatri | /rimpatri | ✅ |
| Cremazione Animali | /cremazione-animali | ✅ |
| Esumazione | /esumazione | ✅ |
| Previdenza | /previdenza | ✅ |
| Convenzioni RSA | /convenzioni | ✅ |
| Memorial lista | /memorial | ✅ |
| Memorial singolo | /memorial/[id] | ✅ |
| Manifesto | /manifesto/[id] | ✅ |
| Blog | /blog | ✅ |
| Blog articolo | /blog/[slug] | ✅ |
| Guide indice | /guida | ✅ |
| 12 guide singole | /guida/* | ✅ |
| Chi Siamo | /chi-siamo | ✅ |
| Contatti | /contatti | ✅ |
| Assistenza | /assistenza | ✅ |
| Area Cliente | /cliente?token= | ✅ |
| SEO comuni (37) | /onoranze-funebri/[comune] | ✅ |
| Sitemap | /sitemap.xml | ✅ |
| Robots | /robots.txt | ✅ |

### Admin (16 pagine — solo italiano)
| Pagina | URL | Stato |
|---|---|---|
| Login | /admin/login | ✅ |
| Dashboard | /admin | ✅ |
| Richieste | /admin/richieste | ✅ |
| Scheda cliente | /admin/richieste/[id] | ✅ 6 tab + traduttore chat |
| Prodotti | /admin/prodotti | ✅ CRUD |
| Consulenti | /admin/consulenti | ✅ 3 ruoli + permessi |
| Homepage | /admin/homepage | ✅ CRUD servizi/FAQ/testimonianze |
| Memorial | /admin/memorial | ✅ |
| Blog | /admin/blog | ✅ |
| Contenuti | /admin/contenuti | ✅ |
| Impostazioni | /admin/impostazioni | ✅ |
| Media | /admin/media | ✅ |
| Agenzie | /admin/agenzie | ✅ |
| Calendario | /admin/calendario | ✅ |
| Analytics | /admin/analytics | ✅ |
| Referral | /admin/referral | ✅ |
| Previdenza | /admin/previdenza | ✅ |
| RSA | /admin/rsa | ✅ |

---

## API Routes (11)
| Endpoint | Metodo | Funzione |
|---|---|---|
| /api/auth | POST/GET/DELETE | Login, check sessione, logout |
| /api/cliente | POST/GET | Crea account cliente, verifica token |
| /api/cliente/chat | POST | Messaggi chat |
| /api/cliente/documenti | POST/GET | Upload/download documenti |
| /api/memorial | POST/PUT | CRUD memorial |
| /api/notifica | POST | Notifica consulente (WhatsApp Business) |
| /api/notifica-stato | POST | Email cambio stato (Resend predisposto) |
| /api/prodotti | GET/POST/PUT/DELETE | CRUD prodotti |
| /api/richieste | POST/GET | CRUD richieste |
| /api/upload | POST | Upload immagini |
| /api/whatsapp | POST | Invio WhatsApp Business API |

---

## FASI COMPLETATE

### FASE 1: Backend Admin ✅
1. ✅ Sidebar admin con navigazione raggruppata
2. ✅ Gestione consulenti — 3 ruoli + permessi personalizzabili
3. ✅ Dashboard consulente — vista filtrata
4. ✅ Assegnazione pratiche — notifiche + log
5. ✅ CRUD servizi homepage, FAQ, testimonianze
6. ✅ Referral collegato al configuratore

### FASE 3: Completamento ✅
7. ✅ Fix salvataggio prodotti DB (API route)
8. ✅ 18 prodotti nuovi (totale 36)
9. ✅ Cookie banner GDPR
10. ✅ Traduzioni 16 lingue (Google Translate API + cache Supabase)
11. ✅ IP detection automatica (Vercel middleware)
12. ✅ Traduttore chat admin
13. ✅ Test automatici Vitest

---

## COSA FARE — Prossimi step

### FASE 2: Integrazioni esterne ⏸️ IN STANDBY (servono API key)
1. ⬜ **Stripe pagamenti** — acconto, rate previdenza, link pagamento
2. ⬜ **Resend email** — conferma cliente, notifiche stato
3. ⬜ **OpenAI chatbot** — assistente AI

### FASE 4: Contenuti e media
4. ⬜ **61 immagini AI** — prodotti, servizi, sfondi (prompt pronti)
5. ⬜ **Piani previdenza flusso completo** — Stripe + dashboard rate

### FASE 5: Crescita
6. ⬜ **Google Reviews widget** — recensioni reali
7. ⬜ **Google Calendar sync** — appuntamenti
8. ⬜ **SMS automatici** — Twilio
9. ⬜ **App mobile consulente** — React Native
10. ⬜ **A/B testing** — landing page
