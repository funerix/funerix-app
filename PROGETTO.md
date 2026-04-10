# Funerix — La Prima Agenzia Funebre Digitale d'Italia

## Live: https://funerix.com | https://funerix-app.vercel.app
## GitHub: https://github.com/funerix/funerix-app
## Admin: admin@funerix.com / funerix2026

---

## Accessi e Deploy

### GitHub
- **Repo**: https://github.com/funerix/funerix-app
- **Remote con token**: gia configurato in `.git/config` con token ghp_
- **Push**: `git push origin main` -> auto-deploy Vercel
- **Workflow**: modifica codice -> commit -> push -> Vercel builda e deploya in automatico

### Supabase (Database PostgreSQL)
- **Progetto**: `rnimsuoabbucrtmhhcqx` (regione: **eu-west-1**)
- **Dashboard**: https://supabase.com/dashboard/project/rnimsuoabbucrtmhhcqx
- **Env vars** (in `.env.local`):
  - `NEXT_PUBLIC_SUPABASE_URL` — URL progetto (per client-side)
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — chiave pubblica (frontend, soggetta a RLS)
  - `SUPABASE_SERVICE_ROLE_KEY` — chiave admin (solo API server-side, bypassa RLS)
- **Connessione diretta PostgreSQL** (per eseguire SQL/DDL):
  - Host: `aws-0-eu-west-1.pooler.supabase.com`
  - Porta: `5432`
  - Database: `postgres`
  - User: `postgres.rnimsuoabbucrtmhhcqx`
  - Password: `funerix2026`

### Come eseguire SQL su Supabase (creare tabelle, migrazioni)
Il pacchetto `pg` e' gia installato. Usare questo pattern Node.js:
```bash
NODE_TLS_REJECT_UNAUTHORIZED=0 node -e "
const { Pool } = require('pg');
const fs = require('fs');
const pool = new Pool({
  host: 'aws-0-eu-west-1.pooler.supabase.com',
  port: 5432, database: 'postgres',
  user: 'postgres.rnimsuoabbucrtmhhcqx',
  password: 'funerix2026',
  ssl: true,
});
pool.query(fs.readFileSync('supabase/NOME-FILE.sql', 'utf8'))
  .then(() => console.log('OK'))
  .catch(e => console.error(e.message))
  .finally(() => pool.end());
"
```
In alternativa: copiare lo SQL nel Supabase Dashboard -> SQL Editor -> Run.

### Come leggere dati via REST API (verifica)
```bash
source .env.local && curl -s "https://rnimsuoabbucrtmhhcqx.supabase.co/rest/v1/NOME_TABELLA?select=*&limit=5" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY"
```

### Vercel
- **Deploy**: automatico su push a `main` (zero configurazione)
- **URL**: funerix-app.vercel.app + funerix.com
- **Env vars**: configurate su Vercel dashboard (stesse di .env.local)

---

## Visione

Funerix non e' un semplice sito di onoranze funebri. E' una **piattaforma digitale multi-verticale** che copre ogni aspetto del fine vita: servizi funebri, cremazione animali, previdenza funeraria e rimpatrio salme. Ogni verticale ha il proprio frontend, configuratore, area cliente e pannello admin — tutto gestibile da backend senza toccare codice.

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

## Architettura Multi-Verticale

```
funerix.com/                  -> Hub principale (onoranze funebri)
funerix.com/pet/              -> Funerix Pet (cremazione animali)
funerix.com/previdenza/       -> Funerix Previdenza (piani funerari + RSA)
funerix.com/rimpatri/         -> Funerix Rimpatri (rimpatrio salme internazionale)
```

Ogni verticale e' autonomo ma condivide: design system, auth admin, sidebar admin, traduzioni, sistema notifiche.

---

## Sistema Traduzioni

### Come funziona
- App scritta interamente in italiano
- Google Translate API traduce i testi visibili al volo
- 16 lingue: IT, EN, FR, ES, DE, PT, RO, AR, RU, ZH, UK, PL, SQ, HI, BN, TL
- Cache a 3 livelli: memoria -> localStorage -> Supabase Storage
- IP detection: Vercel middleware (x-vercel-ip-country) + fallback ipapi.co

### File chiave
- `src/lib/translate.ts` — Motore traduzione
- `src/components/LanguageSelector.tsx` — Selettore bandiere + IP detection
- `middleware.ts` — Vercel geo-detection

---

# UTENTI DELLA PIATTAFORMA

Ogni tipo di utente ha un ruolo preciso, azioni specifiche, e una UI dedicata.

## Tipi di utente globali

| Utente | Accesso | Verticali |
|---|---|---|
| **Visitatore** (non registrato) | Pubblico | Tutti |
| **Cliente Funebre** | Token via link | Funebre |
| **Cliente Pet** | Token via link | Pet |
| **Cliente Previdenza** | Email + password | Previdenza |
| **Veterinario Partner** | Email + password | Pet |
| **Operatore RSA** | Email + password | Previdenza |
| **Admin RSA** | Email + password | Previdenza |
| **Consulente Funerix** | Email + password | Tutti (filtrato per ruolo) |
| **Manager Funerix** | Email + password | Tutti |
| **Admin Funerix** | Email + password | Tutti |

---

# VERTICALE 1: FUNERIX PRINCIPALE (Onoranze Funebri)

## Stato: ✅ COMPLETATO (base funzionante)

## Utenti e Flussi

### UTENTE: Visitatore -> Cliente Funebre

#### Flusso completo: dalla visita alla pratica completata

```
1. SCOPERTA
   Visitatore arriva su funerix.com (da Google, social, referral)
   -> Vede homepage con servizi, prezzi, FAQ, testimonianze
   -> Puo navigare: catalogo, prezzi, guide, blog, memorial
   -> Puo chiamare, WhatsApp, o avviare configuratore

2. CONFIGURAZIONE (8 step)
   Step 1: Tipo servizio (inumazione/tumulazione/cremazione)
   Step 2: Scelta bara o urna (prodotti da DB con foto e prezzi)
   Step 3: Auto funebre (prodotti da DB)
   Step 4: Percorso (partenza, chiesa, cimitero + calcolo km: gratis primi 20km, poi 3€/km)
   Step 5: Cerimonia (tipo, luogo, musica, libro firme)
   Step 6: Fiori e servizi extra (prodotti da DB)
   Step 7: Dati contatto (nome, telefono, email, preferenza contatto, orario, GDPR)
   Step 8: Riepilogo con totale -> INVIA RICHIESTA

3. DOPO L'INVIO
   -> Richiesta salvata in DB con stato "nuova"
   -> Admin riceve notifica real-time (suono + browser notification)
   -> Visitatore vede pagina conferma con: "Ti contattiamo entro X"

4. CONTATTO CONSULENTE
   -> Admin/consulente vede richiesta in /admin/richieste
   -> Assegna consulente (opzionale) -> log + notifica WhatsApp al consulente
   -> Consulente contatta cliente (telefono/WhatsApp/videochiamata)
   -> Cambia stato: nuova -> in_lavorazione

5. CREAZIONE AREA CLIENTE
   -> Admin clicca "Crea area cliente" nella scheda richiesta
   -> Sistema genera token UUID + link: /cliente?token=xxx
   -> Admin invia link via WhatsApp/email/SMS (sceglie canale)
   -> Cliente accede senza password, solo con il link

6. AREA CLIENTE — Cosa puo fare il cliente:
   a) Vedere stato pratica (timeline 4 step: ricevuta -> confermata -> preparazione -> completata)
   b) Leggere riepilogo preventivo e totale
   c) Chattare con consulente assegnato (messaggi in tempo reale)
   d) Caricare documenti richiesti (carta identita, tessera sanitaria, certificato morte, ecc.)
   e) Vedere checklist documenti (completati / mancanti)
   f) Scaricare documenti caricati
   MANCA: pagamento online, download preventivo PDF, firma contratto

7. GESTIONE PRATICA (lato admin) — 6 tab:
   Tab Panoramica: stato, dati cliente, configurazione, azioni rapide
   Tab Defunto: anagrafica completa, dati manifesto, cornice, font, anteprima
   Tab Preventivo: righe editabili con importi, totale auto-calcolato
   Tab Documenti: checklist con stati, file caricati dal cliente
   Tab Cerimonia: dettagli cerimonia (tipo, data, luogo, musica)
   Tab Comunicazioni: note interne tra consulenti

8. MANIFESTO FUNEBRE
   -> Admin compila dati defunto + sceglie cornice (10+ design) + font + testo
   -> Anteprima live nel pannello
   -> Genera link pubblico: /manifesto/[id]
   -> Condivide via WhatsApp, email, copia link
   -> Scarica PDF

9. MEMORIAL
   -> Admin crea pagina memorial: nome, foto, date, biografia
   -> Link pubblico: /memorial/[id]
   -> Visitatori possono lasciare messaggi (moderati da admin)
   -> QR code generabile per stampa

10. COMPLETAMENTO
    -> Admin cambia stato a "completata"
    -> Cliente vede "Servizio completato" nella sua area
    -> FUTURO: invio automatico richiesta recensione
```

#### Cosa MANCA al flusso funebre per essere completo:
- ⬜ Pagamento online (Stripe) con link generabile da admin
- ⬜ Download preventivo PDF da area cliente
- ⬜ Firma digitale preventivo/contratto
- ⬜ Email automatiche per ogni cambio stato
- ⬜ SMS di conferma
- ⬜ Richiesta recensione automatica post-servizio
- ⬜ Notifica real-time in area cliente (ora serve refresh)

---

### UTENTE: Admin/Consulente Funerix (gia implementato)

#### Cosa puo fare:
| Azione | Dove | Stato |
|---|---|---|
| Vedere dashboard con stats | /admin | ✅ |
| Gestire richieste (lista + dettaglio 6 tab) | /admin/richieste | ✅ |
| Assegnare consulente a pratica | /admin/richieste/[id] | ✅ |
| Creare area cliente con link | /admin/richieste/[id] | ✅ |
| Aggiornare stato pratica | /admin/richieste/[id] | ✅ |
| Compilare dati defunto + manifesto | /admin/richieste/[id] | ✅ |
| Editare righe preventivo | /admin/richieste/[id] | ✅ |
| Chattare con cliente | /admin/richieste/[id] | ✅ |
| CRUD prodotti (bare, urne, auto, fiori) | /admin/prodotti | ✅ |
| CRUD memorial + messaggi | /admin/memorial | ✅ |
| CRUD blog | /admin/blog | ✅ |
| Editare homepage (servizi, FAQ, testimonianze) | /admin/homepage | ✅ |
| Editare contenuti sito | /admin/contenuti | ✅ |
| Gestire media/immagini | /admin/media | ✅ |
| Gestire consulenti e ruoli | /admin/consulenti | ✅ |
| Gestire referral | /admin/referral | ✅ |
| Vedere analytics | /admin/analytics | ✅ |
| Gestire calendario | /admin/calendario | ✅ |
| Configurare impostazioni | /admin/impostazioni | ✅ |

---

# VERTICALE 2: FUNERIX PET (Cremazione Animali)

## Stato: ⬜ DA COSTRUIRE

## Utenti e Flussi

### UTENTE: Proprietario Animale (Cliente Pet)

#### Flusso completo: dal lutto alla consegna ceneri

```
1. SCOPERTA
   Proprietario cerca "cremazione animale [citta]" su Google
   -> Arriva su /pet (landing dedicata)
   -> Vede: servizi offerti, prezzi chiari, processo spiegato, testimonianze
   -> Puo vedere catalogo urne /pet/catalogo
   -> Puo cercare veterinario partner vicino /pet/veterinari (mappa)

2. CONFIGURAZIONE PET (7 step — prezzi da DB, non hardcoded)
   Step 1: Tipo animale (cane/gatto/coniglio/uccello/rettile/altro)
           -> Se "altro": campo testo libero
   Step 2: Taglia (piccolo <10kg / medio 10-25kg / grande >25kg)
           -> Prezzi caricati da tabella pet_prezzi
           -> Gatti: taglia auto-settata a "piccolo"
   Step 3: Tipo cremazione
           -> Individuale (con restituzione ceneri) — prezzo da DB
           -> Collettiva (senza ceneri, piu economica) — prezzo da DB
           -> Se collettiva: skip step urna
   Step 4: Scelta urna (solo se individuale)
           -> Prodotti da tabella pet_prodotti con foto, prezzo, materiale
           -> Opzione "nessuna urna" (ceneri in sacchetto standard)
           -> Opzione impronta zampa (+prezzo da DB)
   Step 5: Ritiro
           -> Ritiro a domicilio (+prezzo da DB) -> campo indirizzo + data preferita
           -> Consegna presso struttura (gratuito) -> mostra indirizzo struttura
           -> Ritiro presso veterinario partner -> seleziona veterinario da lista
   Step 6: Riepilogo
           -> Totale dettagliato con ogni voce
           -> Possibilita di tornare indietro e modificare
   Step 7: Dati contatto + pagamento
           -> Nome, telefono, email
           -> Scelta: paga ora (Stripe) o paga al ritiro ceneri
           -> GDPR consent
           -> INVIA ORDINE

3. DOPO L'ORDINE
   Se paga ora:
   -> Redirect a Stripe checkout
   -> Successo: ordine confermato, email conferma
   -> Fallimento: ordine salvato come "in attesa pagamento"
   
   Se paga dopo:
   -> Ordine salvato con stato "ricevuto"
   -> Email conferma con riepilogo

   In entrambi i casi:
   -> Admin riceve notifica real-time
   -> Se ordinato tramite veterinario partner: notifica anche al veterinario
   -> Sistema genera link area cliente: /pet/area-cliente?token=xxx
   -> Link inviato via email automatica

4. AREA CLIENTE PET — Cosa puo fare il proprietario:
   a) Vedere stato ordine (timeline):
      Ordine ricevuto -> Animale ritirato/consegnato -> In cremazione -> Ceneri pronte -> Consegnato
   b) Vedere dettagli ordine (animale, servizio, urna, totale)
   c) Vedere data stimata consegna ceneri
   d) Scaricare certificato cremazione (PDF generato, disponibile dopo cremazione)
   e) Creare memorial per il proprio animale:
      -> Carica foto (fino a 10)
      -> Scrivi biografia/ricordo
      -> Scegli se rendere pubblico o privato
      -> Condividi link memorial
   f) Ricevere notifica quando ceneri pronte per ritiro/spedizione
   g) Lasciare recensione dopo il servizio

5. MEMORIAL PET — Pagina pubblica /pet/memorial/[id]
   -> Foto profilo animale + gallery
   -> Nome, specie, razza, date
   -> Biografia scritta dal proprietario
   -> Visitatori possono:
      -> Lasciare messaggio di condoglianze (moderato)
      -> Accendere candela virtuale (counter)
   -> Condivisibile via WhatsApp, social, link

6. COMPLETAMENTO
   -> Admin segna "ceneri pronte"
   -> Notifica automatica al cliente (email + WhatsApp)
   -> Cliente ritira o riceve spedizione
   -> Admin segna "consegnato"
   -> Dopo 3 giorni: email automatica con invito a lasciare recensione
   -> Dopo 7 giorni: email con suggerimento creare memorial (se non creato)
```

#### Logiche e trigger automatici:
| Evento | Trigger | Azione |
|---|---|---|
| Nuovo ordine pet | Cliente invia ordine | Notifica admin + email conferma cliente + notifica veterinario (se partner) |
| Pagamento ricevuto | Stripe webhook | Aggiorna stato ordine, email ricevuta |
| Stato -> "ritirato" | Admin aggiorna | Email al cliente: "Abbiamo ricevuto [nome animale]" |
| Stato -> "in_cremazione" | Admin aggiorna | Email al cliente: "Cremazione in corso" |
| Stato -> "ceneri_pronte" | Admin aggiorna | Email + WhatsApp al cliente: "Ceneri pronte per ritiro/spedizione" |
| Stato -> "consegnato" | Admin aggiorna | Email conferma + dopo 3gg invito recensione + dopo 7gg suggerimento memorial |
| Recensione lasciata | Cliente scrive | Notifica admin per moderazione |
| Memorial creato | Cliente crea | Pubblicato (se autoapproved) o in moderazione |

---

### UTENTE: Veterinario Partner

#### Come diventa partner:
```
1. Veterinario visita /pet/veterinari o viene contattato da Funerix
2. Compila form di adesione: dati studio, referente, email, telefono
3. Admin Funerix approva -> crea account portale veterinario
4. Veterinario riceve email con credenziali + codice convenzione
5. Veterinario puo accedere al suo portale: /pet/veterinari/portale
```

#### Portale Veterinario — Cosa puo fare:
```
/pet/veterinari/portale                -> Dashboard
/pet/veterinari/portale/ordini         -> I suoi ordini/segnalazioni
/pet/veterinari/portale/nuovo          -> Crea ordine per cliente
/pet/veterinari/portale/commissioni    -> Le sue commissioni
/pet/veterinari/portale/materiale      -> Materiale marketing (scaricabile)
```

| Azione | Dettaglio | Cosa succede |
|---|---|---|
| **Vedere dashboard** | Ordini segnalati, commissioni maturate, stats | — |
| **Segnalare nuovo caso** | Compila form: dati proprietario + dati animale + servizio consigliato | Ordine creato con codice_convenzione del veterinario. Admin notificato. Proprietario riceve link per confermare e pagare |
| **Vedere i suoi ordini** | Lista ordini collegati al suo codice, con stato | — |
| **Vedere commissioni** | Per ogni ordine completato: importo commissione, stato (maturata/pagata) | — |
| **Scaricare materiale** | Locandine, biglietti da visita co-branded, QR code per il suo studio | Admin carica materiale dal pannello |

#### Logiche veterinario:
| Evento | Trigger | Azione |
|---|---|---|
| Veterinario segnala caso | Form compilato | Ordine creato come "segnalato_veterinario". Email al proprietario con link per confermare. Admin notificato |
| Proprietario conferma | Clicca link + paga o conferma | Ordine diventa "confermato". Notifica admin + veterinario |
| Ordine completato | Admin segna consegnato | Commissione maturata per il veterinario (% su totale ordine). Visibile nel suo portale |
| Admin paga commissione | Admin approva pagamento | Stato commissione -> "pagata". Notifica veterinario |

#### Calcolo commissione veterinario:
- Percentuale configurabile da admin per ogni veterinario (default 10%)
- Commissione = totale_ordine * commissione_percentuale / 100
- Maturata solo quando ordine e' "consegnato" (non prima)
- Admin approva e segna come pagata manualmente (futuro: auto via Stripe)

---

### UTENTE: Admin Funerix (gestione Pet)

#### Pagine admin Pet:

**Dashboard Pet** `/admin/pet`
- Cards stats: ordini oggi, in cremazione, ceneri pronte, consegnati mese, revenue mese
- Ultimi 5 ordini con stato
- Alert: ordini in attesa da piu di 24h, ceneri pronte non ritirate da 7+ giorni
- Grafico ordini settimanale

**Ordini Pet** `/admin/pet/ordini`
- Tabella con filtri: stato, tipo cremazione, veterinario, data
- Per ogni ordine: nome animale, proprietario, tipo, stato, totale, data
- Click -> scheda ordine

**Scheda Ordine Pet** `/admin/pet/ordini/[id]`
- **Sezione Animale**: nome, specie, razza, taglia, peso, foto (se caricata)
- **Sezione Cliente**: nome, telefono, email, indirizzo (se ritiro domicilio)
- **Sezione Servizio**: tipo cremazione, urna scelta, impronta zampa, ritiro
- **Sezione Pagamento**: totale, metodo, stato pagamento, link Stripe
- **Sezione Stato**: timeline con bottoni per avanzare stato
  - Ricevuto -> Ritirato/Consegnato -> In cremazione -> Ceneri pronte -> Consegnato
  - Ogni cambio stato: data/ora + chi ha cambiato + trigger notifica
- **Sezione Veterinario** (se segnalato da partner): nome studio, commissione
- **Sezione Certificato**: genera certificato cremazione PDF (data cremazione, numero certificato)
- **Sezione Memorial**: link al memorial pet (se creato dal cliente)
- **Note interne**: appunti tra operatori

**Catalogo Pet** `/admin/pet/catalogo`
- CRUD prodotti pet: urne, cofanetti, impronte zampa, accessori
- Per ogni prodotto: nome, categoria, materiale, descrizione, prezzo, foto[], disponibile (toggle)
- Drag & drop per ordinamento visualizzazione
- Toggle visibilita (nascondi senza cancellare)

**Prezzi Pet** `/admin/pet/prezzi`
- Tabella editabile: per ogni combinazione specie/taglia/tipo_cremazione -> prezzo
- Prezzi extra editabili: ritiro domicilio, impronta zampa
- Storico modifiche prezzi (log)
- Preview: "come lo vedra il cliente nel configuratore"

**Veterinari Partner** `/admin/pet/veterinari`
- CRUD veterinari: dati studio, referente, commissione%, codice convenzione
- Per ogni veterinario: ordini totali, commissioni maturate, commissioni pagate
- Genera credenziali portale veterinario
- Toggle attivo/disattivo
- Mappa con posizioni studi

**Memorial Pet** `/admin/pet/memorial`
- Lista memorial creati dai clienti
- Moderazione: approva/rifiuta
- Moderazione messaggi visitatori
- Toggle pubblico/privato

**Contenuti Pet** `/admin/pet/contenuti`
- Editor testi landing /pet (hero titolo, sottotitolo, sezioni)
- Editor testi pagina servizi
- Editor testi guide
- Gestione testimonianze pet
- Gestione FAQ pet

---

## Tabelle Database Pet

```
pet_ordini
  id                  UUID PRIMARY KEY
  pet_cliente_id      UUID FK -> pet_clienti
  animale_nome        TEXT NOT NULL
  specie              TEXT NOT NULL (cane/gatto/coniglio/uccello/rettile/altro)
  specie_altro        TEXT (se specie = altro)
  razza               TEXT
  peso_kg             DECIMAL
  taglia              TEXT NOT NULL (piccolo/medio/grande)
  foto_animale        TEXT (url)
  tipo_cremazione     TEXT NOT NULL (individuale/collettiva)
  urna_id             UUID FK -> pet_prodotti (nullable, null se collettiva o nessuna urna)
  impronta_zampa      BOOLEAN DEFAULT false
  ritiro_tipo         TEXT NOT NULL (domicilio/struttura/veterinario)
  ritiro_indirizzo    TEXT (se domicilio)
  ritiro_data         DATE (data preferita ritiro)
  veterinario_id      UUID FK -> veterinari_partner (nullable)
  codice_convenzione  TEXT (nullable)
  stato               TEXT NOT NULL DEFAULT 'ricevuto'
                      (ricevuto/confermato/ritirato/in_cremazione/ceneri_pronte/consegnato/annullato)
  data_ritiro_effettivo   TIMESTAMP
  data_cremazione         TIMESTAMP
  data_ceneri_pronte      TIMESTAMP
  data_consegna           TIMESTAMP
  certificato_numero      TEXT
  certificato_url         TEXT
  totale              DECIMAL NOT NULL
  pagato              BOOLEAN DEFAULT false
  metodo_pagamento    TEXT (stripe/contanti/veterinario)
  stripe_payment_id   TEXT
  token_accesso       UUID (per area cliente)
  note_cliente        TEXT
  note_interne        TEXT
  created_at          TIMESTAMP DEFAULT now()
  updated_at          TIMESTAMP DEFAULT now()

pet_clienti
  id                  UUID PRIMARY KEY
  nome                TEXT NOT NULL
  cognome             TEXT
  telefono            TEXT NOT NULL
  email               TEXT NOT NULL
  indirizzo           TEXT
  citta               TEXT
  cap                 TEXT
  created_at          TIMESTAMP DEFAULT now()

pet_prodotti
  id                  UUID PRIMARY KEY
  nome                TEXT NOT NULL
  categoria           TEXT NOT NULL (urna/cofanetto/impronta/accessorio)
  materiale           TEXT (ceramica/legno/marmo/bronzo/biodegradabile)
  descrizione         TEXT
  prezzo              DECIMAL NOT NULL
  foto                TEXT[] (array url)
  disponibile         BOOLEAN DEFAULT true
  ordine_visualizzazione  INTEGER DEFAULT 0
  created_at          TIMESTAMP DEFAULT now()

pet_prezzi
  id                  UUID PRIMARY KEY
  specie              TEXT NOT NULL
  taglia              TEXT NOT NULL
  tipo_cremazione     TEXT NOT NULL
  prezzo              DECIMAL NOT NULL
  ritiro_domicilio_prezzo   DECIMAL DEFAULT 0
  impronta_zampa_prezzo     DECIMAL DEFAULT 0
  attivo              BOOLEAN DEFAULT true
  created_at          TIMESTAMP DEFAULT now()
  updated_at          TIMESTAMP DEFAULT now()

pet_memorial
  id                  UUID PRIMARY KEY
  ordine_id           UUID FK -> pet_ordini (nullable, puo essere creato senza ordine)
  cliente_id          UUID FK -> pet_clienti
  animale_nome        TEXT NOT NULL
  specie              TEXT
  razza               TEXT
  foto_profilo        TEXT (url)
  foto_gallery        TEXT[] (array url, max 10)
  data_nascita        DATE
  data_morte          DATE
  biografia           TEXT
  candele_accese      INTEGER DEFAULT 0
  pubblicato          BOOLEAN DEFAULT false
  approvato           BOOLEAN DEFAULT false
  created_at          TIMESTAMP DEFAULT now()

pet_memorial_messaggi
  id                  UUID PRIMARY KEY
  memorial_id         UUID FK -> pet_memorial
  autore_nome         TEXT NOT NULL
  messaggio           TEXT NOT NULL
  approvato           BOOLEAN DEFAULT false
  created_at          TIMESTAMP DEFAULT now()

veterinari_partner
  id                  UUID PRIMARY KEY
  nome_studio         TEXT NOT NULL
  nome_veterinario    TEXT NOT NULL
  indirizzo           TEXT
  citta               TEXT
  provincia           TEXT
  cap                 TEXT
  telefono            TEXT
  email               TEXT NOT NULL
  sito_web            TEXT
  commissione_percentuale   DECIMAL DEFAULT 10
  codice_convenzione  TEXT UNIQUE
  password_hash       TEXT (per login portale)
  ordini_totali       INTEGER DEFAULT 0
  commissioni_maturate    DECIMAL DEFAULT 0
  commissioni_pagate      DECIMAL DEFAULT 0
  attivo              BOOLEAN DEFAULT true
  latitudine          DECIMAL
  longitudine         DECIMAL
  ultimo_accesso      TIMESTAMP
  created_at          TIMESTAMP DEFAULT now()

pet_commissioni
  id                  UUID PRIMARY KEY
  veterinario_id      UUID FK -> veterinari_partner
  ordine_id           UUID FK -> pet_ordini
  importo             DECIMAL NOT NULL
  percentuale         DECIMAL NOT NULL
  stato               TEXT DEFAULT 'maturata' (maturata/approvata/pagata)
  data_maturazione    TIMESTAMP DEFAULT now()
  data_pagamento      TIMESTAMP
  note                TEXT
  created_at          TIMESTAMP DEFAULT now()

pet_contenuti
  id                  UUID PRIMARY KEY
  sezione             TEXT NOT NULL UNIQUE (hero/servizi/processo/faq/testimonianze/guide_cremazione/guide_lutto/guide_urne)
  titolo              TEXT
  sottotitolo         TEXT
  contenuto_json      JSONB (struttura flessibile per ogni sezione)
  updated_at          TIMESTAMP DEFAULT now()

pet_recensioni
  id                  UUID PRIMARY KEY
  ordine_id           UUID FK -> pet_ordini
  cliente_nome        TEXT
  voto                INTEGER CHECK (1-5)
  testo               TEXT
  risposta_admin      TEXT
  approvata           BOOLEAN DEFAULT false
  pubblicata          BOOLEAN DEFAULT false
  created_at          TIMESTAMP DEFAULT now()
```

---

# VERTICALE 3: FUNERIX PREVIDENZA (Piani Funerari + Portale RSA)

## Stato: ⬜ DA COSTRUIRE (il piu complesso)

## Utenti e Flussi

### UTENTE: Cliente Privato Previdenza

#### Flusso completo: dalla scoperta al piano attivo

```
1. SCOPERTA
   Persona cerca "piano funebre prepagato" o "previdenza funeraria"
   -> Arriva su /previdenza (landing)
   -> Vede: come funziona, vantaggi (prezzo bloccato, fondi protetti, trasferibile)
   -> Puo simulare le rate: /previdenza/simulatore
   -> Puo confrontare piani: /previdenza/piani

2. CONFRONTO PIANI
   /previdenza/piani mostra 3 piani (da DB, editabili da admin):
   
   PIANO BASE (es. €3.500)
   - Bara in legno massello
   - Auto funebre
   - Cerimonia semplice
   - Fiori base
   - Trasporto entro 20km
   
   PIANO COMFORT (es. €5.500)
   - Tutto il Base +
   - Bara premium
   - Auto funebre di lusso
   - Cerimonia con musica
   - Fiori composizione
   - Manifesto + memorial digitale
   - Trasporto entro 50km
   
   PIANO PREMIUM (es. €8.000)
   - Tutto il Comfort +
   - Bara di pregio
   - 2 auto funebri
   - Cerimonia completa con coro
   - Fiori premium
   - Manifesto + memorial + video tributo
   - Trasporto illimitato
   - Consulente dedicato
   
   Ogni piano e' personalizzabile nel configuratore.

3. SIMULATORE RATE
   /previdenza/simulatore:
   - Seleziona piano (o inserisci importo personalizzato)
   - Scegli durata: 12, 24, 36, 48, 60 mesi
   - Vedi: rata mensile, totale, risparmio vs prezzo futuro
   - Parametri simulatore tutti da DB (admin puo cambiare % maggiorazione annua, ecc.)
   - CTA: "Attiva il tuo piano" -> configuratore

4. CONFIGURATORE PREVIDENZA (8 step)
   Step 1: Per chi e' il piano?
           -> Per me stesso
           -> Per un familiare (nome, eta, relazione, codice fiscale)
           -> Da RSA (codice convenzione pre-compilato)
   Step 2: Scegli piano base (Base/Comfort/Premium da DB)
           -> Mostra dettagli inclusi in ogni piano
   Step 3: Personalizza bara (upgrade o downgrade dal piano scelto)
           -> Prodotti da DB con differenza prezzo (+€X / -€X)
   Step 4: Personalizza cerimonia
           -> Tipo (cattolica/laica/altra), musica, libro firme
           -> Ogni modifica ricalcola il totale
   Step 5: Servizi extra
           -> Fiori aggiuntivi, trasporto extra, memorial premium
           -> Prodotti da DB
   Step 6: Piano di pagamento
           -> Totale calcolato
           -> Scegli durata rate (12-60 mesi)
           -> Vedi rata mensile
           -> Metodo: addebito mensile Stripe / bonifico ricorrente
   Step 7: Riepilogo completo
           -> Ogni voce con prezzo
           -> Totale, rate, importo rata
           -> Condizioni: recesso 14gg rimborso 100%, dopo 5% trattenuta
   Step 8: Dati + Firma
           -> Dati anagrafici completi (nome, CF, indirizzo, ecc.)
           -> Dati beneficiario (se diverso)
           -> Upload documento identita
           -> Firma digitale contratto (canvas firma)
           -> Checkbox accettazione condizioni
           -> CONFERMA PIANO

5. DOPO LA CONFERMA
   -> Contratto PDF generato automaticamente con tutti i dati + firma
   -> Email al cliente con: contratto PDF, riepilogo, link area cliente
   -> Se prima rata con Stripe: redirect a checkout
   -> Piano creato in DB con stato "attivo"
   -> Admin notificato
   -> Se da RSA: notifica anche all'operatore RSA + commissione registrata

6. AREA CLIENTE PREVIDENZA — Login con email + password
   /previdenza/area-cliente

   Cosa puo fare il cliente:
   a) DASHBOARD
      -> Vedere piano attivo con dettagli (tipo, totale, rata, stato)
      -> Progress bar: saldo versato / totale (es. "€2.750 di €5.500 — 50%")
      -> Prossima rata: data + importo
      -> Stato: attivo / sospeso / completato

   b) RATE E PAGAMENTI
      -> Lista tutte le rate: numero, importo, scadenza, stato (pagata/pendente/scaduta)
      -> Per rate pendenti: bottone "Paga ora" -> Stripe
      -> Storico pagamenti con ricevute scaricabili (PDF)
      -> Alert rate scadute in rosso

   c) IL MIO PIANO
      -> Dettaglio completo di cosa e' incluso
      -> Non modificabile direttamente (deve contattare consulente)
      -> Bottone "Richiedi modifica" -> apre chat/ticket

   d) BENEFICIARIO
      -> Dati del beneficiario
      -> Aggiornamento dati (con verifica admin)
      -> Upload documenti aggiuntivi

   e) DOCUMENTI
      -> Contratto firmato (download PDF)
      -> Ricevute rate (download PDF)
      -> Documenti caricati

   f) CONTATTI
      -> Chat con consulente assegnato
      -> Richiesta appuntamento / videochiamata

   g) RECESSO
      -> Bottone "Richiedi recesso"
      -> Se entro 14 giorni dalla firma: rimborso 100%
      -> Se dopo: rimborso versato - 5% trattenuta amministrativa
      -> Richiesta va all'admin per approvazione

7. PAGAMENTO RATE — Flusso mensile
   -> 5 giorni prima della scadenza: email promemoria "Rata in scadenza"
   -> Giorno scadenza: tentativo addebito Stripe automatico
   -> Se ok: rata segnata "pagata", ricevuta generata, email conferma
   -> Se fallisce: email "Pagamento fallito, riprova"
   -> +7 giorni: secondo tentativo + email urgente
   -> +15 giorni: piano sospeso automaticamente, email + SMS al cliente
   -> +30 giorni: admin contatta manualmente
   -> Admin puo: riattivare piano, estendere scadenza, annullare

8. DECESSO DEL BENEFICIARIO
   -> Familiare o RSA comunica il decesso
   -> Admin cambia stato piano: attivo -> deceduto
   -> Sistema calcola: se rate completate -> servizio pieno
   -> Se rate parziali: servizio proporzionale o famiglia paga differenza
   -> Attivazione pratica funebre automatica con dati gia compilati
   -> Consulente contatta la famiglia per organizzare
```

#### Logiche e trigger automatici Previdenza:
| Evento | Trigger | Azione |
|---|---|---|
| Piano creato | Cliente firma | Genera contratto PDF, email con contratto, crea schedule rate, notifica admin |
| Rata pagata | Stripe webhook | Aggiorna rata, genera ricevuta PDF, email conferma, aggiorna progress |
| Rata in scadenza (5gg) | Cron job giornaliero | Email promemoria al cliente |
| Rata scaduta | Cron job giornaliero | Email urgente, +15gg sospensione automatica |
| Piano sospeso | Rate non pagate >15gg | Email + SMS al cliente, notifica admin |
| Piano completato | Tutte le rate pagate | Email congratulazioni, aggiorna stato, notifica admin |
| Recesso richiesto | Cliente clicca | Notifica admin, calcolo rimborso automatico |
| Decesso comunicato | Admin/RSA/famiglia | Stato -> deceduto, genera pratica funebre automatica |
| Modifica piano richiesta | Cliente chiede | Ticket per admin/consulente |

---

### UTENTE: Operatore RSA / Admin RSA

#### Come la RSA diventa partner:
```
1. RSA visita /convenzioni o viene contattata da Funerix
2. Compila form: dati struttura, referente, tipo (RSA/casa riposo/hospice/clinica)
3. Admin Funerix verifica e approva
4. Crea account portale RSA con 2 ruoli:
   - Admin RSA: vede tutto, gestisce operatori
   - Operatore RSA: crea piani, vede i suoi ospiti
5. RSA riceve email con credenziali + codice convenzione (RSA-XX-XXXX)
6. Admin RSA puo creare altri operatori dal suo portale
```

#### Portale RSA — Pagine e funzionalita:

```
/convenzioni/portale                    -> Login RSA
/convenzioni/portale/dashboard          -> Dashboard RSA
/convenzioni/portale/ospiti             -> Lista ospiti
/convenzioni/portale/ospiti/[id]        -> Scheda ospite
/convenzioni/portale/nuovo              -> Crea piano per ospite
/convenzioni/portale/commissioni        -> Report commissioni
/convenzioni/portale/documenti          -> Documenti e materiale
/convenzioni/portale/impostazioni       -> Impostazioni account RSA
```

**Dashboard RSA** `/convenzioni/portale/dashboard`
| Elemento | Dettaglio |
|---|---|
| Piani attivi | Numero + importo totale in gestione |
| Piani questo mese | Nuovi piani attivati nel mese |
| Commissioni maturate | Totale commissioni da incassare |
| Commissioni pagate | Totale gia ricevuto |
| Ultimi piani | Lista ultimi 5 piani creati |
| Alert | Piani con rate scadute dei propri ospiti |

**Lista Ospiti** `/convenzioni/portale/ospiti`
- Tabella: nome ospite, beneficiario, piano, stato, rata mensile, % completamento
- Filtri: stato piano, ricerca nome
- Export CSV

**Scheda Ospite** `/convenzioni/portale/ospiti/[id]`
- Dati ospite/beneficiario
- Dettaglio piano scelto
- Stato rate (pagate/pendenti/scadute)
- NON puo modificare il piano (solo Funerix admin puo)
- Puo: segnalare problema, richiedere modifica

**Crea Piano per Ospite** `/convenzioni/portale/nuovo`
```
Flusso semplificato (RSA version):
1. Dati ospite (nome, cognome, CF, data nascita, camera/reparto)
2. Dati familiare referente (chi paga: nome, telefono, email, relazione)
3. Scegli piano (Base/Comfort/Premium) — prezzi da DB
4. Scegli durata rate (12-60 mesi)
5. Riepilogo con: totale, rata mensile, commissione RSA visibile
6. Conferma -> Invia a Funerix per attivazione

Cosa succede:
-> Piano creato con stato "bozza" + rsa_id + codice_convenzione
-> Admin Funerix notificato: "RSA [nome] ha proposto un piano per [ospite]"
-> Admin verifica, approva, e contatta il familiare referente
-> Familiare firma contratto (digitale o in presenza)
-> Piano diventa "attivo"
-> Commissione RSA registrata (matura quando piano attivo)
```

**Commissioni RSA** `/convenzioni/portale/commissioni`
- Tabella: piano, ospite, importo piano, % commissione, importo commissione, stato
- Totali: maturate, in approvazione, pagate
- Storico pagamenti ricevuti

**Logiche RSA:**
| Evento | Trigger | Azione |
|---|---|---|
| RSA propone piano | Operatore crea piano | Stato "bozza", notifica admin Funerix |
| Admin approva piano | Admin cambia stato | Contatta familiare, invia contratto |
| Familiare firma | Firma digitale o conferma | Piano attivo, commissione RSA maturata |
| Ospite deceduto | RSA o famiglia comunica | Admin attiva pratica funebre, piano -> "deceduto" |
| Commissione pagata | Admin approva pagamento | Notifica RSA, aggiorna totali |
| Rate ospite scadute | Cron job | Alert a RSA per sollecitare familiare |

#### Calcolo commissione RSA:
- Percentuale configurabile per struttura (default 5-10%)
- Commissione = totale_piano * percentuale / 100
- Matura quando piano diventa "attivo" (dopo firma familiare)
- Admin Funerix approva e paga manualmente (futuro: auto mensile)
- RSA vede nel portale: maturata -> approvata -> pagata

---

### UTENTE: Admin Funerix (gestione Previdenza)

#### Pagine admin Previdenza:

**Dashboard Previdenza** `/admin/previdenza`
- Stats: piani attivi totali, valore totale gestito, rate in scadenza questa settimana, nuovi piani mese
- Alert: rate scadute, piani sospesi, recessi richiesti
- Grafico andamento piani + revenue

**Piani** `/admin/previdenza/piani`
- Tabella con filtri: stato, tipo piano, RSA/privato, ricerca
- Per ogni piano: cliente, beneficiario, tipo, totale, rata, rate pagate/totali, %, stato
- Click -> scheda piano

**Scheda Piano** `/admin/previdenza/piani/[id]`
- **Dati cliente**: anagrafica completa, contatti
- **Dati beneficiario**: anagrafica, relazione, documenti
- **Piano**: tipo, servizi inclusi, personalizzazioni, totale
- **Rate**: timeline tutte le rate con stato, date, importi. Azioni: segna pagata, rimanda, annulla
- **Contratto**: link PDF, stato firma, data
- **RSA** (se da struttura): quale RSA, operatore, commissione
- **Log**: ogni azione tracciata (chi, quando, cosa)
- **Azioni admin**: sospendi piano, riattiva, modifica importi, annulla con rimborso, segna decesso

**Rate e Pagamenti** `/admin/previdenza/rate`
- Vista calendario rate: questa settimana, prossima settimana, scadute
- Filtri: stato rata, metodo pagamento, RSA
- Azioni massive: segna pagate (per bonifici manuali)
- Export report pagamenti

**Tipi Piano** `/admin/previdenza/tipi-piano`
- CRUD piani tipo (Base/Comfort/Premium o personalizzati)
- Per ogni piano: nome, descrizione, prezzo base, servizi inclusi (lista editabile)
- Durata min/max rate
- Ordine visualizzazione
- Attivo/disattivo

**RSA Partner** `/admin/previdenza/rsa`
- CRUD strutture: dati, tipo, referente, commissione%, codice convenzione
- Per ogni RSA: piani attivi, commissioni maturate/pagate
- Gestione account portale RSA (crea utenti, reset password)
- Toggle attivo/disattivo

**Commissioni RSA** `/admin/previdenza/commissioni`
- Lista commissioni da approvare/pagare
- Workflow: maturata -> approvata -> pagata
- Per ogni commissione: RSA, piano, importo, percentuale
- Azione: approva, paga (con data e metodo)
- Report per RSA esportabile

**Beneficiari** `/admin/previdenza/beneficiari`
- Anagrafica tutti i beneficiari
- Documenti caricati per beneficiario
- Preferenze cerimonia salvate
- Link al piano associato

**Contratti** `/admin/previdenza/contratti`
- Lista contratti generati
- Stato: generato, inviato, firmato
- Download PDF
- Ri-generazione se dati modificati

**Template Contratto** `/admin/previdenza/template`
- Editor template contratto con campi dinamici
- Campi disponibili: {{cliente_nome}}, {{beneficiario_nome}}, {{piano_tipo}}, {{totale}}, {{rata}}, {{num_rate}}, ecc.
- Preview con dati esempio
- Versioning (storico modifiche)

**Contenuti Previdenza** `/admin/previdenza/contenuti`
- Testi landing /previdenza (hero, vantaggi, processo, CTA)
- Testi pagina piani
- Testi simulatore
- FAQ previdenza (CRUD)
- Testi landing /convenzioni (per RSA)

---

## Tabelle Database Previdenza

```
tipi_piano
  id                      UUID PRIMARY KEY
  nome                    TEXT NOT NULL (Base/Comfort/Premium)
  slug                    TEXT UNIQUE
  descrizione             TEXT
  prezzo_base             DECIMAL NOT NULL
  servizi_inclusi         JSONB NOT NULL
    [{ nome, descrizione, categoria }]
  durata_min_mesi         INTEGER DEFAULT 12
  durata_max_mesi         INTEGER DEFAULT 60
  maggiorazione_annua_pct DECIMAL DEFAULT 0 (per simulatore: aumento prezzo futuro)
  attivo                  BOOLEAN DEFAULT true
  ordine_visualizzazione  INTEGER DEFAULT 0
  created_at              TIMESTAMP DEFAULT now()

piani_previdenza
  id                      UUID PRIMARY KEY
  cliente_id              UUID FK -> clienti_previdenza
  beneficiario_id         UUID FK -> beneficiari
  tipo_piano_id           UUID FK -> tipi_piano
  tipo_piano_nome         TEXT (snapshot: Base/Comfort/Premium)
  configurazione          JSONB NOT NULL
    { bara: {id, nome, prezzo}, cerimonia: {...}, fiori: [...], extra: [...] }
  totale                  DECIMAL NOT NULL
  num_rate                INTEGER NOT NULL
  importo_rata            DECIMAL NOT NULL
  rate_pagate             INTEGER DEFAULT 0
  saldo_versato           DECIMAL DEFAULT 0
  saldo_residuo           DECIMAL NOT NULL
  stato                   TEXT NOT NULL DEFAULT 'bozza'
    (bozza/attivo/sospeso/completato/deceduto/annullato/recesso)
  rsa_id                  UUID FK -> rsa_convenzionate (nullable)
  rsa_operatore           TEXT (nome operatore che ha creato)
  codice_convenzione      TEXT
  contratto_url           TEXT
  contratto_firmato       BOOLEAN DEFAULT false
  data_firma              TIMESTAMP
  data_attivazione        TIMESTAMP
  data_completamento      TIMESTAMP
  data_sospensione        TIMESTAMP
  data_recesso            TIMESTAMP
  motivo_recesso          TEXT
  importo_rimborso        DECIMAL
  consulente_id           UUID FK -> admin_users (nullable)
  note_interne            TEXT
  created_at              TIMESTAMP DEFAULT now()
  updated_at              TIMESTAMP DEFAULT now()

pagamenti_rata
  id                      UUID PRIMARY KEY
  piano_id                UUID FK -> piani_previdenza
  numero_rata             INTEGER NOT NULL
  importo                 DECIMAL NOT NULL
  stato                   TEXT NOT NULL DEFAULT 'pendente'
    (pendente/pagato/scaduto/fallito/annullato)
  data_scadenza           DATE NOT NULL
  data_pagamento          TIMESTAMP
  metodo_pagamento        TEXT (stripe/bonifico/contanti)
  stripe_payment_id       TEXT
  ricevuta_url            TEXT
  tentativo_addebito      INTEGER DEFAULT 0
  created_at              TIMESTAMP DEFAULT now()

beneficiari
  id                      UUID PRIMARY KEY
  piano_id                UUID FK -> piani_previdenza
  nome                    TEXT NOT NULL
  cognome                 TEXT NOT NULL
  codice_fiscale          TEXT
  data_nascita            DATE
  luogo_nascita           TEXT
  relazione_con_cliente   TEXT (se_stesso/genitore/coniuge/figlio/altro)
  indirizzo               TEXT
  citta                   TEXT
  documenti               JSONB DEFAULT '[]'
    [{ tipo, url, data_upload }]
  preferenze_cerimonia    JSONB DEFAULT '{}'
    { tipo_cerimonia, musica, fiori_preferiti, luogo, note }
  created_at              TIMESTAMP DEFAULT now()
  updated_at              TIMESTAMP DEFAULT now()

clienti_previdenza
  id                      UUID PRIMARY KEY
  nome                    TEXT NOT NULL
  cognome                 TEXT NOT NULL
  codice_fiscale          TEXT
  data_nascita            DATE
  telefono                TEXT NOT NULL
  email                   TEXT NOT NULL UNIQUE
  password_hash           TEXT NOT NULL
  indirizzo               TEXT
  citta                   TEXT
  cap                     TEXT
  email_verificata        BOOLEAN DEFAULT false
  ultimo_accesso          TIMESTAMP
  created_at              TIMESTAMP DEFAULT now()

rsa_convenzionate
  id                      UUID PRIMARY KEY
  nome_struttura          TEXT NOT NULL
  tipo                    TEXT NOT NULL (rsa/casa_riposo/hospice/clinica)
  indirizzo               TEXT
  citta                   TEXT
  provincia               TEXT
  cap                     TEXT
  telefono                TEXT
  email                   TEXT
  sito_web                TEXT
  referente_nome          TEXT
  referente_telefono      TEXT
  referente_email         TEXT
  commissione_percentuale DECIMAL DEFAULT 5
  codice_convenzione      TEXT UNIQUE (RSA-XX-XXXX)
  piani_attivi            INTEGER DEFAULT 0
  piani_totali            INTEGER DEFAULT 0
  commissioni_maturate    DECIMAL DEFAULT 0
  commissioni_pagate      DECIMAL DEFAULT 0
  attivo                  BOOLEAN DEFAULT true
  latitudine              DECIMAL
  longitudine             DECIMAL
  created_at              TIMESTAMP DEFAULT now()

portale_rsa_users
  id                      UUID PRIMARY KEY
  rsa_id                  UUID FK -> rsa_convenzionate
  email                   TEXT NOT NULL UNIQUE
  password_hash           TEXT NOT NULL
  nome                    TEXT NOT NULL
  ruolo                   TEXT NOT NULL (admin_rsa/operatore_rsa)
  attivo                  BOOLEAN DEFAULT true
  ultimo_accesso          TIMESTAMP
  created_at              TIMESTAMP DEFAULT now()

commissioni_rsa
  id                      UUID PRIMARY KEY
  rsa_id                  UUID FK -> rsa_convenzionate
  piano_id                UUID FK -> piani_previdenza
  importo                 DECIMAL NOT NULL
  percentuale             DECIMAL NOT NULL
  stato                   TEXT DEFAULT 'maturata' (maturata/approvata/pagata)
  data_maturazione        TIMESTAMP DEFAULT now()
  data_approvazione       TIMESTAMP
  data_pagamento          TIMESTAMP
  metodo_pagamento        TEXT
  ricevuta_url            TEXT
  note                    TEXT
  created_at              TIMESTAMP DEFAULT now()

previdenza_contenuti
  id                      UUID PRIMARY KEY
  sezione                 TEXT NOT NULL UNIQUE
    (hero/vantaggi/processo/faq/simulatore/convenzioni_hero/convenzioni_vantaggi/convenzioni_processo)
  titolo                  TEXT
  sottotitolo             TEXT
  contenuto_json          JSONB
  updated_at              TIMESTAMP DEFAULT now()

previdenza_log
  id                      UUID PRIMARY KEY
  piano_id                UUID FK -> piani_previdenza
  azione                  TEXT NOT NULL
  dettaglio               TEXT
  utente_nome             TEXT
  utente_tipo             TEXT (admin/cliente/rsa)
  created_at              TIMESTAMP DEFAULT now()
```

---

# VERTICALE 4: FUNERIX RIMPATRI (Rimpatrio Salme Internazionale)

## Stato: ⬜ DA POTENZIARE

## Utenti e Flussi

### UTENTE: Familiare del Defunto (Cliente Rimpatri)

#### Flusso completo: dalla richiesta alla consegna

```
1. SCOPERTA
   Familiare cerca "rimpatrio salma [paese]" o "repatriacion Italia"
   -> Arriva su /rimpatri (landing)
   -> Vede: zone servite, processo step-by-step, tempistiche, prezzi indicativi
   -> Puo cercare il suo paese: /rimpatri/paesi
   -> Puo vedere requisiti specifici: /rimpatri/paesi/[paese]
   -> Pagine SEO per comunita: /rimpatri/comunita/rumena, /comunita/albanese, ecc.

2. PAGINA PAESE /rimpatri/paesi/[paese]
   Contenuto specifico (da DB, editabile da admin):
   -> Documenti necessari per quel paese (checklist)
   -> Tempi medi di rimpatrio
   -> Prezzo indicativo per zona
   -> Consolato di riferimento in Italia (link + contatti)
   -> Requisiti speciali (es. tanatoprassi obbligatoria, cassa zinco IATA)
   -> CTA: "Richiedi preventivo gratuito"

3. CONFIGURATORE RIMPATRI (7 step — tutto da DB)
   Step 1: Direzione
           -> Rimpatrio IN Italia (salma dall'estero)
           -> Rimpatrio DA Italia (salma verso estero)
   Step 2: Paese
           -> Seleziona zona (Europa, Nord Africa, Americhe, Asia, ecc.)
           -> Seleziona paese dalla zona
           -> Prezzo base caricato da DB per il paese/zona
   Step 3: Citta di partenza e destinazione
           -> Campi testo per citta partenza + citta arrivo
   Step 4: Servizi extra (da DB, con prezzi)
           -> Tanatoprassi (conservazione salma)
           -> Traduzione documenti
           -> Accompagnamento familiare in aeroporto
           -> Cerimonia pre-partenza
           -> Cassa zinco IATA (obbligatoria per voli intercontinentali)
           -> Assicurazione trasporto
   Step 5: Documenti gia disponibili
           -> Checklist documenti per quel paese (da DB)
           -> Cliente indica quali ha gia
           -> Sistema calcola: documenti mancanti da procurare
   Step 6: Riepilogo
           -> Totale dettagliato
           -> Tempi stimati
           -> Documenti mancanti evidenziati
   Step 7: Dati contatto
           -> Nome, telefono, email, relazione con defunto
           -> Lingua preferita per comunicazione (importante per stranieri!)
           -> GDPR + INVIA RICHIESTA

4. DOPO L'INVIO
   -> Richiesta salvata con stato "richiesta"
   -> Admin notificato
   -> Email conferma al cliente (nella sua lingua se possibile)
   -> Link area cliente generato

5. AREA CLIENTE RIMPATRI /rimpatri/area-cliente?token=xxx
   
   Cosa puo fare il cliente:
   a) TRACKING PRATICA (timeline visiva):
      Richiesta ricevuta -> Documenti in corso -> Autorizzazioni ottenute ->
      Salma in transito -> Arrivata a destinazione -> Pratica completata
      
      Ogni step con: data, descrizione, documenti allegati
   
   b) DOCUMENTI
      -> Checklist documenti necessari per il suo paese (da DB)
      -> Per ogni documento: stato (mancante/caricato/verificato/approvato)
      -> Upload documenti
      -> Admin verifica e approva ogni documento
      -> Se documento rifiutato: motivazione + possibilita di ri-caricare
   
   c) INFORMAZIONI VOLO (quando disponibili)
      -> Compagnia aerea, numero volo, data, tratta
      -> Tracking (se disponibile)
   
   d) CHAT CON CONSULENTE
      -> Messaggi in tempo reale
      -> Traduzione automatica (consulente vede in italiano, cliente scrive nella sua lingua)
   
   e) COSTI E PAGAMENTI
      -> Preventivo dettagliato
      -> Stato pagamento
      -> Bottone "Paga online" (Stripe)

6. GESTIONE DOCUMENTI — Il processo piu critico del rimpatrio
   
   Per ogni paese il sistema sa (da DB) quali documenti servono:
   
   Esempio Romania:
   - Certificato di morte (tradotto e apostillato)
   - Nulla osta del consolato romeno
   - Autorizzazione al trasporto ASL
   - Passaporto mortuario
   - Certificato di imbalsamazione (se richiesto)
   
   Per ogni documento:
   -> Cliente puo caricarlo -> admin verifica -> approva o rifiuta con motivazione
   -> Admin puo caricare documenti ottenuti da Funerix (es. autorizzazione ASL)
   -> Quando tutti i documenti sono approvati: pratica puo procedere
   -> Admin cambia stato: "documenti_completati" -> trigger notifica

7. COMPLETAMENTO
   -> Salma arriva a destinazione
   -> Partner locale conferma consegna
   -> Admin segna "completata"
   -> Email al cliente con riepilogo e ringraziamento
   -> Dopo 7gg: invito recensione
```

#### Logiche e trigger rimpatri:
| Evento | Trigger | Azione |
|---|---|---|
| Nuova richiesta | Cliente invia | Notifica admin, email conferma (multilingua), crea area cliente |
| Documento caricato | Cliente upload | Notifica admin per verifica |
| Documento approvato | Admin approva | Notifica cliente "documento ok" |
| Documento rifiutato | Admin rifiuta | Notifica cliente con motivazione, puo ri-caricare |
| Tutti documenti ok | Ultimo approvato | Notifica admin + cliente "pronti a procedere" |
| Stato -> in_transito | Admin aggiorna | Notifica cliente con info volo |
| Stato -> arrivata | Partner/admin conferma | Notifica cliente |
| Pratica completata | Admin segna | Email riepilogo, dopo 7gg invito recensione |

---

### UTENTE: Partner Funebre Estero (futuro)

Non ha un portale dedicato nella fase iniziale. Admin gestisce i partner da backend.

Funzionalita futura:
- Portale partner con login
- Conferma ricezione salma
- Upload documenti locali
- Comunicazione diretta con Funerix

---

### UTENTE: Admin Funerix (gestione Rimpatri)

#### Pagine admin Rimpatri:

**Dashboard Rimpatri** `/admin/rimpatri`
- Stats: pratiche attive, per zona, tempi medi, revenue mese
- Alert: pratiche ferme per documenti mancanti, in transito senza aggiornamento
- Mappa: pratiche attive per paese

**Pratiche** `/admin/rimpatri/pratiche`
- Tabella con filtri: stato, paese, zona, direzione, data
- Per ogni pratica: defunto, famiglia, paese, stato, totale, data
- Badge documenti: "3/6 documenti"

**Scheda Pratica** `/admin/rimpatri/pratiche/[id]`
- **Defunto**: nome, cognome, nazionalita, data decesso
- **Famiglia**: referente, contatti, lingua preferita
- **Itinerario**: partenza -> destinazione, zona, direzione
- **Servizi**: lista servizi con prezzi
- **Documenti**: checklist interattiva
  -> Per ogni documento: stato (mancante/caricato/in_verifica/approvato/rifiutato)
  -> Bottoni: approva, rifiuta (con motivazione), carica (admin puo caricare)
  -> Upload documenti ottenuti da Funerix (es. autorizzazione ASL)
- **Volo**: campi per compagnia, numero, data, tratta
- **Partner estero**: agenzia partner assegnata (se presente)
- **Pagamento**: totale, stato, link Stripe
- **Timeline**: ogni cambio stato con data/ora/operatore
- **Note interne**: appunti tra operatori
- **Chat cliente**: con traduzione automatica

**Paesi e Zone** `/admin/rimpatri/paesi`
- CRUD paesi: nome, codice ISO, zona, prezzo base, tempo medio, attivo
- Per ogni paese: documenti richiesti (lista editabile), requisiti specifici
- Gestione zone con prezzi base

**Consolati** `/admin/rimpatri/consolati`
- CRUD consolati: paese, citta, indirizzo, telefono, email, orari, mappa
- Collegamento automatico paese -> consolati disponibili

**Partner Esteri** `/admin/rimpatri/partner`
- CRUD agenzie: nome, paese, citta, contatto, servizi offerti, commissione%
- Assegnazione partner a pratiche

**Prezzi Rimpatri** `/admin/rimpatri/prezzi`
- Prezzi base per zona (editabili)
- Prezzi specifici per paese (override zona)
- Prezzi servizi extra (tutti editabili)
- Storico modifiche

**Documenti Template** `/admin/rimpatri/documenti`
- CRUD checklist documenti per paese
- Documenti universali (per tutti i paesi)
- Documenti specifici per paese
- Per ogni documento: nome, descrizione, obbligatorio, ordine

**Contenuti Rimpatri** `/admin/rimpatri/contenuti`
- Testi landing /rimpatri
- Testi pagine paese
- Testi pagine comunita SEO
- Guide rimpatrio

**Pagine SEO Comunita** `/admin/rimpatri/seo`
- CRUD pagine per comunita straniera in Italia
- Per ogni pagina: titolo, contenuto, meta tag, lingua target
- Preview come la vedra l'utente

---

## Tabelle Database Rimpatri

```
rimpatri_pratiche
  id                      UUID PRIMARY KEY
  cliente_id              UUID FK -> rimpatri_clienti
  defunto_nome            TEXT NOT NULL
  defunto_cognome         TEXT NOT NULL
  defunto_nazionalita     TEXT
  defunto_data_decesso    DATE
  direzione               TEXT NOT NULL (italia_estero/estero_italia)
  paese_id                UUID FK -> rimpatri_paesi
  citta_partenza          TEXT
  citta_destinazione      TEXT
  zona                    TEXT
  servizi_extra           JSONB DEFAULT '[]'
    [{ nome, prezzo }]
  stato                   TEXT NOT NULL DEFAULT 'richiesta'
    (richiesta/documenti_in_corso/documenti_completati/autorizzato/
     in_transito/arrivata/consegnata/completata/annullata)
  documenti               JSONB DEFAULT '[]'
    [{ nome, obbligatorio, stato: mancante|caricato|in_verifica|approvato|rifiutato,
       url, data_upload, motivo_rifiuto }]
  volo_compagnia          TEXT
  volo_numero             TEXT
  volo_data               TIMESTAMP
  volo_tratta             TEXT
  partner_estero_id       UUID FK -> rimpatri_partner (nullable)
  consolato_id            UUID FK -> rimpatri_consolati (nullable)
  totale                  DECIMAL
  pagato                  BOOLEAN DEFAULT false
  metodo_pagamento        TEXT
  stripe_payment_id       TEXT
  lingua_cliente          TEXT DEFAULT 'it'
  token_accesso           UUID
  consulente_id           UUID FK -> admin_users (nullable)
  note_cliente            TEXT
  note_interne            TEXT
  created_at              TIMESTAMP DEFAULT now()
  updated_at              TIMESTAMP DEFAULT now()

rimpatri_clienti
  id                      UUID PRIMARY KEY
  nome                    TEXT NOT NULL
  cognome                 TEXT NOT NULL
  telefono                TEXT NOT NULL
  email                   TEXT NOT NULL
  relazione_con_defunto   TEXT
  indirizzo               TEXT
  citta                   TEXT
  cap                     TEXT
  nazionalita             TEXT
  lingua_preferita        TEXT DEFAULT 'it'
  created_at              TIMESTAMP DEFAULT now()

rimpatri_paesi
  id                      UUID PRIMARY KEY
  nome                    TEXT NOT NULL
  codice_iso              TEXT NOT NULL (2 char)
  zona                    TEXT NOT NULL (europa/nord_africa/americhe/asia/africa_subsahariana/oceania)
  prezzo_base             DECIMAL NOT NULL
  tempo_medio_giorni      INTEGER
  documenti_richiesti     JSONB DEFAULT '[]'
    [{ nome, descrizione, obbligatorio, ordine }]
  requisiti_specifici     TEXT
  note                    TEXT
  bandiera_emoji          TEXT
  attivo                  BOOLEAN DEFAULT true
  created_at              TIMESTAMP DEFAULT now()

rimpatri_consolati
  id                      UUID PRIMARY KEY
  paese_id                UUID FK -> rimpatri_paesi
  citta                   TEXT NOT NULL
  indirizzo               TEXT
  telefono                TEXT
  email                   TEXT
  sito_web                TEXT
  orari                   TEXT
  latitudine              DECIMAL
  longitudine             DECIMAL
  note                    TEXT
  attivo                  BOOLEAN DEFAULT true
  created_at              TIMESTAMP DEFAULT now()

rimpatri_partner
  id                      UUID PRIMARY KEY
  nome_agenzia            TEXT NOT NULL
  paese                   TEXT
  citta                   TEXT
  indirizzo               TEXT
  telefono                TEXT
  email                   TEXT
  referente               TEXT
  servizi_offerti         JSONB DEFAULT '[]'
  commissione_percentuale DECIMAL
  pratiche_totali         INTEGER DEFAULT 0
  attivo                  BOOLEAN DEFAULT true
  created_at              TIMESTAMP DEFAULT now()

rimpatri_prezzi
  id                      UUID PRIMARY KEY
  zona                    TEXT (nullable, null = servizio extra generico)
  paese_id                UUID FK -> rimpatri_paesi (nullable, override zona)
  tipo                    TEXT NOT NULL (base/tanatoprassi/traduzione/accompagnamento/cerimonia/cassa_zinco/assicurazione)
  nome_servizio           TEXT NOT NULL
  prezzo                  DECIMAL NOT NULL
  obbligatorio_per_zona   BOOLEAN DEFAULT false
  attivo                  BOOLEAN DEFAULT true
  created_at              TIMESTAMP DEFAULT now()

rimpatri_documenti_template
  id                      UUID PRIMARY KEY
  paese_id                UUID FK -> rimpatri_paesi (nullable, null = universale)
  nome_documento          TEXT NOT NULL
  descrizione             TEXT
  obbligatorio            BOOLEAN DEFAULT true
  template_url            TEXT
  ordine                  INTEGER DEFAULT 0
  created_at              TIMESTAMP DEFAULT now()

rimpatri_contenuti_seo
  id                      UUID PRIMARY KEY
  tipo                    TEXT NOT NULL (comunita/guida/paese_extra)
  slug                    TEXT NOT NULL UNIQUE
  titolo                  TEXT NOT NULL
  sottotitolo             TEXT
  contenuto_html          TEXT
  meta_title              TEXT
  meta_description        TEXT
  lingua_target           TEXT
  pubblicato              BOOLEAN DEFAULT false
  created_at              TIMESTAMP DEFAULT now()
  updated_at              TIMESTAMP DEFAULT now()

rimpatri_timeline
  id                      UUID PRIMARY KEY
  pratica_id              UUID FK -> rimpatri_pratiche
  stato                   TEXT NOT NULL
  descrizione             TEXT
  documenti_allegati      JSONB DEFAULT '[]'
  operatore_nome          TEXT
  created_at              TIMESTAMP DEFAULT now()
```

---

# FUNZIONALITA TRASVERSALI (tutti i verticali)

## Sistema Notifiche Multi-Canale

### Come funziona:
```
1. Admin configura template per ogni evento (da /admin/notifiche)
2. Ogni template ha: verticale, evento, canale, oggetto, corpo con variabili
3. Quando un evento accade (es. cambio stato), il sistema:
   a) Cerca i template attivi per quell'evento
   b) Sostituisce le variabili ({{nome}}, {{stato}}, {{link}}, ecc.)
   c) Invia su tutti i canali configurati (email + SMS + WhatsApp)
   d) Logga l'invio (successo/fallimento)
4. Admin puo vedere storico notifiche inviate
```

### Eventi notificabili:
| Verticale | Evento | Destinatario | Canali |
|---|---|---|---|
| Funebre | Nuova richiesta | Admin | Browser + WhatsApp |
| Funebre | Stato cambiato | Cliente | Email |
| Funebre | Area cliente creata | Cliente | WhatsApp/Email/SMS |
| Funebre | Nuovo messaggio chat | Cliente/Consulente | Email |
| Pet | Nuovo ordine | Admin | Browser + WhatsApp |
| Pet | Ordine confermato | Cliente | Email |
| Pet | Animale ritirato | Cliente | Email |
| Pet | Ceneri pronte | Cliente | Email + WhatsApp |
| Pet | Consegnato | Cliente | Email |
| Pet | Invito recensione | Cliente | Email (dopo 3gg) |
| Pet | Suggerimento memorial | Cliente | Email (dopo 7gg) |
| Pet | Nuovo ordine da veterinario | Admin + Veterinario | Email |
| Previdenza | Piano creato | Admin | Browser |
| Previdenza | Piano attivato | Cliente + RSA | Email |
| Previdenza | Rata in scadenza (5gg) | Cliente | Email |
| Previdenza | Rata pagata | Cliente | Email |
| Previdenza | Rata scaduta | Cliente | Email + SMS |
| Previdenza | Piano sospeso | Cliente + Admin | Email + SMS |
| Previdenza | Piano completato | Cliente | Email |
| Previdenza | Recesso richiesto | Admin | Email |
| Previdenza | Decesso comunicato | Admin + Consulente | Email + WhatsApp |
| Previdenza | Commissione maturata | RSA | Email |
| Rimpatri | Nuova richiesta | Admin | Browser + WhatsApp |
| Rimpatri | Documento caricato | Admin | Email |
| Rimpatri | Documento approvato/rifiutato | Cliente | Email |
| Rimpatri | Tutti documenti ok | Admin + Cliente | Email |
| Rimpatri | Salma in transito | Cliente | Email + WhatsApp |
| Rimpatri | Arrivata a destinazione | Cliente | Email + WhatsApp |
| Rimpatri | Pratica completata | Cliente | Email |

### Admin Notifiche `/admin/notifiche`
- CRUD template notifiche
- Per ogni template: verticale, evento, canale, oggetto, corpo con editor variabili
- Test invio (invia a se stesso per verifica)
- Storico invii con stati
- Toggle attivo/disattivo per evento

---

## Dashboard Famiglia Real-Time (tracking pratica)

### Come funziona:
Ogni verticale ha la sua area cliente con una timeline visiva (stile tracking pacco).

Il cliente vede:
```
[✅] Richiesta ricevuta          12 Mar 2026, 14:30
[✅] Pratica presa in carico     12 Mar 2026, 16:00  — Consulente: Mario Rossi
[✅] Documenti completati        14 Mar 2026, 10:00
[🔄] In lavorazione             15 Mar 2026, 09:00  — "Stiamo preparando tutto"
[⬜] Servizio completato         —
```

Ogni step:
- Icona stato (completato/in corso/futuro)
- Data e ora
- Descrizione (personalizzabile da admin)
- Allegati opzionali (documenti, foto)
- Nota opzionale dell'operatore

Admin aggiorna lo stato -> timeline si aggiorna in real-time (Supabase Realtime) -> cliente vede senza refresh.

---

## Recensioni Verificate

### Flusso:
```
1. Pratica completata -> dopo X giorni (configurabile da admin): email automatica con link
2. Cliente clicca link -> pagina recensione: voto (1-5 stelle) + testo
3. Recensione salvata come "in attesa moderazione"
4. Admin vede in /admin/recensioni -> approva o rifiuta
5. Se approvata: pubblicata sul sito (nella landing del verticale corrispondente)
6. Admin puo rispondere alla recensione (visibile pubblicamente)
```

### Admin Recensioni `/admin/recensioni`
- Lista recensioni per verticale
- Filtri: stato, voto, verticale
- Azioni: approva, rifiuta, rispondi
- Stats: media voto per verticale, trend

---

## Comparatore Prezzi

### Come funziona:
```
/prezzi/[citta] -> "Quanto costa un funerale a [citta]?"
- Prezzo medio, min, max (da tabella prezzi_citta)
- Confronto con media nazionale
- Breakdown per tipo servizio
- CTA: "Configura il tuo preventivo gratuito"
```

### Admin `/admin/comparatore`
- CRUD prezzi per citta/provincia
- Import da CSV
- Fonte e anno riferimento

---

## AI Chatbot Assistente

### Come funziona:
```
1. Widget chat in basso a destra su tutte le pagine pubbliche
2. Utente scrive domanda
3. Sistema invia a OpenAI con:
   - Prompt di sistema (configurabile da admin)
   - FAQ del verticale corrente (da DB)
   - Contesto pagina corrente
4. AI risponde guidando verso il servizio giusto
5. Se AI non sa rispondere: "Vuoi parlare con un consulente?" -> form contatto
6. Tutte le conversazioni loggate per analisi
```

### Admin `/admin/chatbot`
- Prompt di sistema editabile
- FAQ per training (CRUD)
- Limiti risposta (es. "non dare prezzi esatti, rimanda al configuratore")
- Log conversazioni
- Stats: domande piu frequenti, conversion rate

---

## Video-Consulenza

### Flusso:
```
1. Cliente prenota da qualsiasi pagina (bottone "Prenota videocall")
2. Form: nome, email, telefono, motivo, data/ora preferita
3. Sistema mostra slot disponibili (da calendario consulenti)
4. Conferma prenotazione -> email al cliente con link meeting
5. Consulente riceve notifica + evento in calendario
6. Dopo la call: consulente puo creare richiesta/ordine collegato
```

### Admin `/admin/calendario` (potenziato)
- Calendario con appuntamenti + videocall
- Gestione disponibilita consulenti
- Link meeting automatici (Google Meet o Zoom)

---

# ADMIN — Struttura Completa Sidebar

```
PRINCIPALE
  Dashboard Globale              /admin
  Richieste Funebre              /admin/richieste
  Calendario                     /admin/calendario
  Analytics                      /admin/analytics

FUNERIX PET
  Dashboard Pet                  /admin/pet
  Ordini Pet                     /admin/pet/ordini
  Catalogo Pet                   /admin/pet/catalogo
  Prezzi Pet                     /admin/pet/prezzi
  Veterinari Partner             /admin/pet/veterinari
  Memorial Pet                   /admin/pet/memorial
  Contenuti Pet                  /admin/pet/contenuti

FUNERIX PREVIDENZA
  Dashboard Previdenza           /admin/previdenza
  Piani Attivi                   /admin/previdenza/piani
  Rate e Pagamenti               /admin/previdenza/rate
  Tipi Piano                     /admin/previdenza/tipi-piano
  RSA Partner                    /admin/previdenza/rsa
  Commissioni RSA                /admin/previdenza/commissioni
  Beneficiari                    /admin/previdenza/beneficiari
  Contratti                      /admin/previdenza/contratti
  Template Contratto             /admin/previdenza/template
  Contenuti Previdenza           /admin/previdenza/contenuti

FUNERIX RIMPATRI
  Dashboard Rimpatri             /admin/rimpatri
  Pratiche                       /admin/rimpatri/pratiche
  Paesi e Zone                   /admin/rimpatri/paesi
  Consolati                      /admin/rimpatri/consolati
  Partner Esteri                 /admin/rimpatri/partner
  Prezzi Rimpatri                /admin/rimpatri/prezzi
  Documenti Template             /admin/rimpatri/documenti
  Pagine SEO Comunita            /admin/rimpatri/seo
  Contenuti Rimpatri             /admin/rimpatri/contenuti

CATALOGO
  Prodotti Funebre               /admin/prodotti
  Memorial                       /admin/memorial
  Blog                           /admin/blog

CONTENUTI
  Homepage                       /admin/homepage
  Contenuti Sito                 /admin/contenuti
  Media                          /admin/media

MARKETING
  Referral                       /admin/referral
  Agenzie                        /admin/agenzie
  Recensioni                     /admin/recensioni
  Comparatore Prezzi             /admin/comparatore

SISTEMA
  Consulenti                     /admin/consulenti
  Notifiche Template             /admin/notifiche
  AI Chatbot Config              /admin/chatbot
  Impostazioni                   /admin/impostazioni
```

---

# DATABASE COMPLETO — Riepilogo

## Tabelle Esistenti (21)
| # | Tabella | Verticale |
|---|---|---|
| 1 | categorie | Funebre |
| 2 | prodotti | Funebre |
| 3 | memorial | Funebre |
| 4 | messaggi_memorial | Funebre |
| 5 | richieste | Funebre |
| 6 | clienti | Funebre |
| 7 | pagamenti | Funebre |
| 8 | impostazioni | Globale |
| 9 | contenuti | Globale |
| 10 | blog_posts | Globale |
| 11 | comunicazioni | Funebre |
| 12 | agenzie | Funebre |
| 13 | appuntamenti | Globale |
| 14 | referral | Marketing |
| 15 | admin_users | Sistema |
| 16 | servizi_homepage | Globale |
| 17 | faq | Globale |
| 18 | testimonianze | Globale |
| 19 | piani_previdenza | Previdenza |
| 20 | pagamenti_piano | Previdenza |
| 21 | rsa_convenzionate | Previdenza |

## Tabelle Nuove (35+)
| # | Tabella | Verticale |
|---|---|---|
| 22 | pet_ordini | Pet |
| 23 | pet_clienti | Pet |
| 24 | pet_prodotti | Pet |
| 25 | pet_prezzi | Pet |
| 26 | pet_memorial | Pet |
| 27 | pet_memorial_messaggi | Pet |
| 28 | veterinari_partner | Pet |
| 29 | pet_commissioni | Pet |
| 30 | pet_contenuti | Pet |
| 31 | pet_recensioni | Pet |
| 32 | tipi_piano | Previdenza |
| 33 | pagamenti_rata | Previdenza |
| 34 | beneficiari | Previdenza |
| 35 | clienti_previdenza | Previdenza |
| 36 | portale_rsa_users | Previdenza |
| 37 | commissioni_rsa | Previdenza |
| 38 | previdenza_contenuti | Previdenza |
| 39 | previdenza_log | Previdenza |
| 40 | rimpatri_pratiche | Rimpatri |
| 41 | rimpatri_clienti | Rimpatri |
| 42 | rimpatri_paesi | Rimpatri |
| 43 | rimpatri_consolati | Rimpatri |
| 44 | rimpatri_partner | Rimpatri |
| 45 | rimpatri_prezzi | Rimpatri |
| 46 | rimpatri_documenti_template | Rimpatri |
| 47 | rimpatri_contenuti_seo | Rimpatri |
| 48 | rimpatri_timeline | Rimpatri |
| 49 | notifiche_template | Globale |
| 50 | notifiche_inviate | Globale |
| 51 | recensioni_globali | Globale |
| 52 | prezzi_citta | Globale |
| 53 | chatbot_config | Globale |
| 54 | chatbot_conversazioni | Globale |
| 55 | video_consulenze | Globale |

**Totale: ~55 tabelle** (da 21 a 55)

---

# API ROUTES — Riepilogo Completo

## Esistenti (11)
| Endpoint | Funzione |
|---|---|
| /api/auth | Login, sessione, logout admin |
| /api/cliente | Account cliente, token |
| /api/cliente/chat | Chat consulente-cliente |
| /api/cliente/documenti | Upload/download documenti |
| /api/memorial | CRUD memorial |
| /api/notifica | Notifica WhatsApp |
| /api/notifica-stato | Email cambio stato |
| /api/prodotti | CRUD prodotti |
| /api/richieste | CRUD richieste |
| /api/upload | Upload immagini |
| /api/whatsapp | WhatsApp Business |

## Nuove (25+)
| Endpoint | Funzione |
|---|---|
| /api/pet/ordini | CRUD ordini pet + cambio stato + trigger notifiche |
| /api/pet/prodotti | CRUD catalogo pet (urne, accessori) |
| /api/pet/prezzi | CRUD listino pet per specie/taglia |
| /api/pet/veterinari | CRUD veterinari + auth portale |
| /api/pet/veterinari/ordini | Veterinario crea ordine per cliente |
| /api/pet/commissioni | CRUD commissioni veterinari |
| /api/pet/memorial | CRUD memorial pet + messaggi + moderazione |
| /api/pet/area-cliente | Auth token + dati ordine + tracking |
| /api/pet/recensioni | CRUD recensioni pet |
| /api/pet/contenuti | CRUD contenuti pagine pet |
| /api/previdenza/piani | CRUD piani + cambio stato + trigger |
| /api/previdenza/rate | CRUD rate + tracking pagamenti + webhook Stripe |
| /api/previdenza/tipi-piano | CRUD tipi piano (Base/Comfort/Premium) |
| /api/previdenza/beneficiari | CRUD beneficiari + documenti |
| /api/previdenza/contratti | Genera PDF + firma + download |
| /api/previdenza/area-cliente | Auth email/pwd + dashboard piano |
| /api/previdenza/rsa | CRUD RSA + auth portale RSA |
| /api/previdenza/rsa/piani | RSA crea piano per ospite |
| /api/previdenza/commissioni | CRUD commissioni RSA + approvazione |
| /api/previdenza/contenuti | CRUD contenuti pagine previdenza |
| /api/rimpatri/pratiche | CRUD pratiche + stati + timeline |
| /api/rimpatri/paesi | CRUD paesi + zone + documenti richiesti |
| /api/rimpatri/consolati | CRUD consolati |
| /api/rimpatri/partner | CRUD partner esteri |
| /api/rimpatri/prezzi | CRUD prezzi per zona/paese/servizio |
| /api/rimpatri/documenti | Upload + verifica + approvazione documenti |
| /api/rimpatri/area-cliente | Auth token + tracking pratica |
| /api/rimpatri/contenuti | CRUD contenuti + pagine SEO |
| /api/notifiche/engine | Motore invio notifiche multi-canale |
| /api/notifiche/template | CRUD template notifiche |
| /api/recensioni | CRUD recensioni globali + moderazione |
| /api/chatbot | Endpoint AI assistant (OpenAI) |
| /api/video-consulenza | Prenotazione videocall + calendario |
| /api/stripe/webhook | Webhook Stripe per pagamenti (pet + previdenza + funebre) |

---

# ORDINE DI SVILUPPO

## FASE A: Ristrutturazione Base
1. ⬜ Creare struttura routing /pet/, /previdenza/ (refactor), /rimpatri/ (refactor)
2. ⬜ Aggiornare admin sidebar con struttura per verticale
3. ⬜ Layout condivisi per verticale (header con branding verticale)
4. ⬜ Migrare prezzi hardcoded -> DB (pet_prezzi, rimpatri_prezzi)
5. ⬜ Aggiornare types e database.types.ts con tutti i nuovi tipi

## FASE B: Funerix Pet
6. ⬜ Creare tabelle Supabase pet (10 tabelle)
7. ⬜ Landing /pet con contenuti da DB
8. ⬜ Configuratore pet dedicato /pet/configuratore (prezzi da DB)
9. ⬜ Catalogo urne /pet/catalogo
10. ⬜ Admin pet: dashboard, ordini, scheda ordine, catalogo, prezzi
11. ⬜ Veterinari: pagina pubblica + mappa + admin CRUD + portale veterinario
12. ⬜ Memorial pet: pagine pubbliche + admin + moderazione
13. ⬜ Area cliente pet: tracking ordine, certificato ceneri, crea memorial
14. ⬜ Recensioni pet
15. ⬜ Guide pet (3 guide con contenuti da DB)

## FASE C: Funerix Previdenza
16. ⬜ Creare/completare tabelle Supabase previdenza (8 tabelle)
17. ⬜ Landing /previdenza potenziata
18. ⬜ Pagina confronto piani /previdenza/piani
19. ⬜ Simulatore avanzato /previdenza/simulatore
20. ⬜ Configuratore previdenza dedicato /previdenza/configuratore
21. ⬜ Admin previdenza: dashboard, piani, scheda piano, rate, tipi piano, beneficiari
22. ⬜ Generazione contratto PDF + firma digitale
23. ⬜ Area cliente previdenza (login email/pwd, dashboard piano, rate, documenti)
24. ⬜ Portale RSA (login, dashboard, ospiti, crea piano, commissioni, documenti)
25. ⬜ Admin RSA: gestione strutture, commissioni, approvazioni
26. ⬜ Logica rate: schedule automatico, promemoria, sospensione, recesso

## FASE D: Funerix Rimpatri
27. ⬜ Creare tabelle Supabase rimpatri (8 tabelle)
28. ⬜ Landing /rimpatri potenziata
29. ⬜ Configuratore rimpatri dedicato (prezzi da DB)
30. ⬜ Pagine paesi /rimpatri/paesi/[paese] (da DB)
31. ⬜ Mappa consolati /rimpatri/consolati
32. ⬜ Admin rimpatri: dashboard, pratiche, scheda pratica, paesi, consolati, partner, prezzi
33. ⬜ Area cliente rimpatri: tracking pratica + documenti + chat tradotta
34. ⬜ Checklist documenti per paese (template da admin)
35. ⬜ Pagine SEO comunita (da DB + admin)

## FASE E: Funzionalita Trasversali
36. ⬜ Sistema notifiche multi-canale (template da admin)
37. ⬜ Dashboard famiglia real-time (Supabase Realtime su tutte le aree cliente)
38. ⬜ Recensioni verificate post-servizio
39. ⬜ Comparatore prezzi per citta
40. ⬜ AI Chatbot assistente
41. ⬜ Video-consulenza (prenotazione + calendario)

## FASE F: Integrazioni Esterne (servono API key)
42. ⬜ Stripe pagamenti (funebre + pet + previdenza rate + rimpatri)
43. ⬜ Stripe webhook per automazione pagamenti
44. ⬜ Resend email (tutte le notifiche email)
45. ⬜ OpenAI (chatbot AI)
46. ⬜ Twilio SMS (notifiche urgenti)
47. ⬜ Google Calendar sync (appuntamenti + videocall)

## FASE G: Contenuti e Crescita
48. ⬜ Immagini AI per tutti i verticali
49. ⬜ Google Reviews widget
50. ⬜ A/B testing landing page
51. ⬜ App mobile consulente (React Native)

---

# PRINCIPI DI SVILUPPO

1. **Zero hardcoded** — Ogni prezzo, testo, opzione viene dal database ed e' editabile da admin
2. **Admin-first** — Ogni feature ha la sua controparte admin per gestione completa
3. **Ogni azione ha una conseguenza** — Cambio stato = notifica. Upload = verifica. Pagamento = ricevuta.
4. **Verticali autonomi** — Ogni verticale funziona indipendentemente
5. **Mobile-first** — Ogni pagina perfetta su mobile
6. **SEO-first** — Meta tag, Open Graph, structured data su ogni pagina pubblica
7. **Realtime** — Stati, chat, notifiche aggiornati via Supabase Realtime
8. **Traduzioni automatiche** — Ogni testo tradotto in 16 lingue
9. **Tracciabilita** — Ogni azione loggata (chi, quando, cosa)
10. **Sicurezza** — Token per clienti, password hash per portali, RLS su Supabase
