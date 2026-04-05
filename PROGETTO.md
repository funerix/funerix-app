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
- **Deploy**: Vercel (auto-deploy da GitHub)
- **Dominio**: funerix.com (DNS su Register.it → Vercel)

---

## Database: 21 tabelle Supabase

| Tabella | Rows | Collegata a Frontend | Admin UI |
|---|---|---|---|
| categorie | 5 | ✅ Catalogo + Configuratore | ❌ |
| prodotti | 18 | ✅ Catalogo + Configuratore | ✅ CRUD completo |
| memorial | 4 | ✅ /memorial | ✅ CRUD |
| messaggi_memorial | 5 | ✅ /memorial/[id] | ✅ (in scheda) |
| richieste | 6 | ✅ Configuratore → Admin | ✅ Lista + Scheda 6 tab |
| clienti | 3 | ✅ /cliente?token= | ✅ (in scheda richiesta) |
| pagamenti | 0 | ❌ NON COLLEGATA | ❌ |
| impostazioni | 1 | ✅ Header, Footer, Contatti | ✅ Impostazioni |
| contenuti | 1 | ✅ Homepage hero, footer | ✅ Contenuti |
| blog_posts | 5 | ✅ /blog | ✅ CRUD |
| comunicazioni | 0 | ✅ (in scheda richiesta) | ✅ (in scheda) |
| agenzie | 1 | ✅ Manifesto | ✅ CRUD |
| appuntamenti | 0 | ❌ Solo admin | ✅ Calendario |
| referral | 0 | ❌ NON collegato al config | ✅ CRUD |
| admin_users | 1 | ✅ /admin/login | ❌ Solo 1 utente |
| servizi_homepage | 6 | ✅ Homepage card | ❌ MANCA ADMIN |
| faq | 6 | ✅ Homepage FAQ | ❌ MANCA ADMIN |
| testimonianze | 3 | ✅ Homepage testimonianze | ❌ MANCA ADMIN |
| piani_previdenza | 0 | ✅ /previdenza | ✅ Lista (base) |
| pagamenti_piano | 0 | ❌ NON COLLEGATA | ❌ |
| rsa_convenzionate | 0 | ✅ /convenzioni | ✅ CRUD |

---

## Pagine Frontend (48+)

### Pubbliche
| Pagina | URL | Stato |
|---|---|---|
| Homepage | / | ✅ Hero + 6 servizi + prezzi + FAQ + testimonianze |
| Configuratore (4 tipi) | /configuratore | ✅ Funebre 8 step, Animali 7, Rimpatri 6, Previdenza 8 |
| Catalogo | /catalogo | ✅ Filtri + immagini |
| Prezzi | /prezzi | ✅ Per provincia + dettaglio |
| Rimpatri | /rimpatri | ✅ Zone, costi, documenti |
| Cremazione Animali | /cremazione-animali | ✅ Listino + procedura |
| Esumazione | /esumazione | ✅ Servizi + listino |
| Previdenza | /previdenza | ✅ Landing + simulatore rate |
| Convenzioni RSA | /convenzioni | ✅ Landing B2B |
| Memorial lista | /memorial | ✅ Necrologi pubblici |
| Memorial singolo | /memorial/[id] | ✅ QR Code + messaggi |
| Manifesto | /manifesto/[id] | ✅ Cornici + stampa |
| Blog | /blog | ✅ 5 articoli |
| Blog articolo | /blog/[slug] | ✅ |
| Guide indice | /guida | ✅ 12 guide |
| 12 guide singole | /guida/* | ✅ SEO |
| Chi Siamo | /chi-siamo | ✅ Storia 1920 + foto |
| Contatti | /contatti | ✅ Form + info |
| Assistenza | /assistenza | ✅ Chatbot FAQ + contatti |
| Area Cliente | /cliente?token= | ✅ Timeline + chat + documenti + firma |
| SEO comuni | /onoranze-funebri/[comune] | ✅ 37 pagine |
| Sitemap | /sitemap.xml | ✅ |
| Robots | /robots.txt | ✅ |
| PWA Manifest | /manifest.json | ✅ |

### Admin (16 pagine)
| Pagina | URL | Stato |
|---|---|---|
| Login | /admin/login | ✅ |
| Dashboard | /admin | ✅ Stats reali |
| Richieste lista | /admin/richieste | ✅ |
| Scheda cliente | /admin/richieste/[id] | ✅ 6 tab |
| Prodotti | /admin/prodotti | ✅ CRUD + upload |
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

## API Routes (10)
| Endpoint | Metodo | Funzione |
|---|---|---|
| /api/auth | POST/GET/DELETE | Login, check sessione, logout |
| /api/cliente | POST/GET | Crea account cliente, verifica token |
| /api/cliente/chat | POST | Messaggi chat cliente-consulente |
| /api/cliente/documenti | POST/GET | Upload/download documenti |
| /api/memorial | POST/PUT | CRUD memorial |
| /api/notifica | POST | Notifica consulente (WhatsApp Business API) |
| /api/notifica-stato | POST | Email cambio stato (Resend predisposto) |
| /api/richieste | POST/GET | CRUD richieste |
| /api/upload | POST | Upload immagini Supabase Storage |
| /api/whatsapp | POST | Invio WhatsApp Business API |

---

## COSA FARE — Priorità

### FASE 1: Backend Admin (URGENTE)
1. ⬜ **Sidebar admin** — sostituire top-bar con sidebar laterale
2. ⬜ **Gestione consulenti** — CRUD utenti admin con ruoli (admin/consulente)
3. ⬜ **Dashboard consulente** — vista limitata alle proprie pratiche
4. ⬜ **Assegnazione pratiche** — admin assegna richiesta a consulente
5. ⬜ **CRUD servizi homepage** — gestire card servizi dalla admin
6. ⬜ **CRUD FAQ** — gestire domande frequenti
7. ⬜ **CRUD testimonianze** — gestire recensioni
8. ⬜ **Collegare referral al configuratore** — applicare sconto

### FASE 2: Integrazioni (servono API key)
9. ⬜ **Stripe pagamenti** — acconto, rate previdenza, link pagamento
10. ⬜ **Resend email** — conferma cliente, notifiche stato, email consulente
11. ⬜ **OpenAI chatbot** — assistente AI invece di keyword match

### FASE 3: Completamento
12. ⬜ **61 immagini AI** — prodotti, servizi, sfondi (prompt pronti)
13. ⬜ **14 prodotti nuovi** — bare, urne, auto, fiori da aggiungere al DB
14. ⬜ **Multi-lingua routing** — next-intl, traduzione pagine reale
15. ⬜ **Cookie banner GDPR** — consenso + privacy policy
16. ⬜ **Test automatici** — Vitest, flusso configuratore
17. ⬜ **Piani previdenza flusso completo** — pagamento ricorrente, dashboard rate

### FASE 4: Crescita
18. ⬜ **Google Reviews widget** — recensioni reali
19. ⬜ **Google Calendar sync** — appuntamenti
20. ⬜ **SMS automatici** — Twilio per cambio stato
21. ⬜ **App mobile consulente** — React Native
22. ⬜ **A/B testing** — landing page
