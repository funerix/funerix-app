# Funerix — Progetto Completo

## Stato: MVP Avanzato — Voto 72/100

### Stack
- **Frontend**: Next.js 16 + TypeScript + Tailwind CSS v4
- **Backend**: Supabase (PostgreSQL + Auth + Storage + Realtime)
- **State**: Zustand (persistente)
- **Animazioni**: Framer Motion
- **PDF**: jsPDF
- **Grafici**: Recharts
- **Mappe**: Leaflet + React-Leaflet
- **QR Code**: qrcode.react

### Database: 18 tabelle
categorie, prodotti, memorial, messaggi_memorial, richieste, clienti, pagamenti, impostazioni, contenuti, blog_posts, comunicazioni, agenzie, appuntamenti, referral, admin_users, servizi_homepage, faq, testimonianze

### Credenziali
- **Admin**: admin@funerix.com / funerix2026
- **Supabase URL**: https://rnimsuoabbucrtmhhcqx.supabase.co

---

## Pagine Frontend (44+)

### Pubbliche
- `/` — Homepage (hero, servizi, come funziona, prezzi, testimonianze, FAQ, CTA)
- `/configuratore` — Configuratore multi-tipo (funebre 8 step, animali 7 step, rimpatri 6 step)
- `/catalogo` — Catalogo prodotti con filtri
- `/prezzi` — Prezzi per provincia + dettaglio costi
- `/rimpatri` — Rimpatri ed espatri salme internazionali
- `/cremazione-animali` — Cremazione animali domestici
- `/esumazione` — Esumazione e riesumazione
- `/memorial` — Lista necrologi pubblici
- `/memorial/[id]` — Memorial singolo con QR Code
- `/manifesto/[id]` — Manifesto funebre con cornici
- `/blog` — Lista articoli (5 seed)
- `/blog/[slug]` — Articolo singolo
- `/guida` — Indice 12 guide
- `/guida/*` — 12 guide SEO (decesso casa/ospedale/estero/RSA, costi, documenti, cremazione, inumazione/tumulazione, manifesto, testamento, lutto, cremazione animali)
- `/chi-siamo` — Storia dal 1920, autorizzazioni, guida post-decesso
- `/contatti` — Form + info contatto
- `/assistenza` — Chatbot FAQ + contatto diretto
- `/cliente?token=xxx` — Area cliente (timeline, chat, documenti, firma)
- `/onoranze-funebri/[comune]` — 37 pagine SEO locali
- `/sitemap.xml`, `/robots.txt`, `/manifest.json`

### Admin (protetto da login)
- `/admin/login` — Login
- `/admin` — Dashboard con stats reali
- `/admin/richieste` — Lista richieste
- `/admin/richieste/[id]` — Scheda cliente 6 tab (panoramica, persona cara, preventivo, documenti, cerimonia, comunicazioni)
- `/admin/prodotti` — CRUD prodotti
- `/admin/memorial` — CRUD memorial
- `/admin/blog` — CRUD articoli
- `/admin/contenuti` — Editor testi sito
- `/admin/impostazioni` — Dati aziendali, WhatsApp Business API
- `/admin/media` — Galleria immagini
- `/admin/agenzie` — CRUD agenzie partner
- `/admin/analytics` — Grafici (recharts)
- `/admin/calendario` — Calendario appuntamenti
- `/admin/referral` — Codici sconto

---

## 15 PUNTI DA COMPLETARE (da audit)

### Per arrivare a 85/100:
1. ⬜ **40 immagini AI** — prodotti, servizi, sfondi (prompt pronti, in produzione)
2. ⬜ **Admin CRUD per servizi homepage + FAQ + testimonianze** — i dati sono nel DB ma manca la UI admin
3. ⬜ **Guide decesso con contenuti unici** — le 4 guide scenario hanno contenuto generico simile
4. ⬜ **Stripe pagamenti** — serve STRIPE_SECRET_KEY + STRIPE_PUBLISHABLE_KEY
5. ⬜ **Resend email** — serve RESEND_API_KEY

### Per arrivare a 95/100:
6. ⬜ **Multi-lingua funzionante** — next-intl routing, traduzione pagine
7. ⬜ **Google Reviews widget** — mostrare recensioni reali
8. ⬜ **Analytics reali** — Vercel Analytics o Plausible
9. ⬜ **Cookie banner GDPR** — consenso cookie + privacy policy
10. ⬜ **Test automatici** — Vitest, almeno flusso configuratore

### Per il 100/100:
11. ⬜ **Chatbot AI con OpenAI** — serve OPENAI_API_KEY
12. ⬜ **App mobile React Native** — per il consulente
13. ⬜ **Google Calendar integrazione** — sync appuntamenti
14. ⬜ **SMS automatici** — cambio stato → SMS al cliente
15. ⬜ **Deploy Vercel + dominio funerix.com**

---

## Prodotti da aggiungere al DB (con immagini)

### Bare (aggiungi 6 — totale 10)
- Cofano in Abete €450
- Cofano in Pino €700
- Cofano in Castagno €1.600
- Cofano in Ciliegio Laccato €3.000
- Cofano in Noce Intarsiato €4.500
- Cofano Presidenziale Oro €7.000

### Urne (aggiungi 4 — totale 7)
- Urna Economica Resina €120
- Urna in Bronzo Antico €850
- Urna in Onice €1.100
- Urna Biodegradabile €200

### Auto (aggiungi 2 — totale 4)
- Auto Premium BMW €1.200
- Auto Luxury Maserati €2.000

### Fiori (aggiungi 4 — totale 7)
- Bouquet Rose Bianche €60
- Composizione Orchidee Altare €350
- Copertura Bara Floreale €450
- Corona Grande Deluxe €500

### Servizi (aggiungi 2 — totale 8)
- Manifesti Funebri 50pz €100
- Camera Ardente giornata €400

### Totale prodotti: da 18 a 32
