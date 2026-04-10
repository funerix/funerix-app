# Progetto: Portale Web per Servizi Funebri — Campania

## 1. Contesto e Visione

### 1.1 Chi siamo
Impresa funebre già operante e autorizzata in Regione Campania, iscritta al Registro Regionale delle imprese funebri (ai sensi della L.R. Campania n. 12/2001 e s.m.i. L.R. n. 7/2013).

### 1.2 Obiettivo
Realizzare una **web app in React** che consenta ai clienti di configurare un funerale per un proprio caro (scelta di bare, urne, auto funebri, fiori, cerimonia, ecc.), visualizzare un preventivo indicativo e inviare una richiesta di prenotazione — il tutto in un'esperienza digitale rispettosa, sobria e conforme alla normativa regionale.

### 1.3 Strategia di crescita
- **Fase 1 (MVP):** Portale esclusivo per la nostra impresa
- **Fase 2:** Apertura a imprese funebri partner (modello marketplace)
- **Fase 3 (da validare legalmente):** Integrazione pagamento online e tracking completo del servizio

---

## 2. Quadro Normativo — Vincoli e Opportunità

### 2.1 Riferimenti legislativi
| Norma | Contenuto chiave |
|---|---|
| D.P.R. 285/1990 | Regolamento nazionale di Polizia Mortuaria |
| L.R. Campania n. 12/2001 | Disciplina ed armonizzazione delle attività funerarie |
| L.R. Campania n. 7/2013 | Modifiche alla L.R. 12/2001 |
| D.G.R. Campania n. 732/2017 | Istituzione Registro Regionale imprese funebri |
| D.G.R. Campania n. 90/2018 | Requisiti strutturali case funerarie |
| GDPR (Reg. UE 2016/679) | Trattamento dati personali (dati del defunto e dei familiari) |

### 2.2 Vincoli normativi per il portale

**Cosa possiamo fare liberamente:**
- Mostrare catalogo prodotti e servizi con prezzi trasparenti (la legge lo incoraggia)
- Far configurare al cliente il tipo di funerale desiderato
- Generare un preventivo indicativo
- Raccogliere una richiesta di contatto / prenotazione

**Zona grigia — da validare con un legale:**
- Pagamento online del servizio funebre (il mandato funebre tradizionalmente richiede sottoscrizione formale)
- Firma digitale del mandato funebre (potenzialmente possibile con firma elettronica qualificata)
- Gestione dati del defunto online (richiede attenzione particolare al GDPR — dati di persona deceduta)

**Cosa NON possiamo fare:**
- Influenzare la scelta del cliente verso prodotti/servizi specifici (art. della L.R. 12/2001)
- Operare senza autorizzazione e iscrizione al Registro Regionale
- Nella fase marketplace: aggregare imprese non iscritte al Registro

### 2.3 Nota sulla presentazione dei prodotti
La L.R. 12/2001 prescrive che l'impresa funebre deve "presentare le diverse tipologie di funerale disponibili senza influenzare le scelte del cliente". Nel portale questo si traduce in:
- Nessun prodotto evidenziato come "consigliato" o "più venduto"
- Nessun dark pattern (urgenza artificiale, scarsità fittizia)
- Presentazione neutra e ordinata (es. per prezzo crescente, per tipologia)
- Informazioni complete e oggettive per ogni opzione

---

## 3. Architettura Tecnica Proposta

### 3.1 Stack tecnologico

```
Frontend:       React 18+ con TypeScript
Styling:        Tailwind CSS (tema sobrio e rispettoso)
State Mgmt:     Zustand o Redux Toolkit (per il configuratore)
Routing:        React Router v6
Backend:        Node.js + Express  OPPURE  Next.js (fullstack)
Database:       PostgreSQL (dati strutturati prodotti/ordini)
ORM:            Prisma
Storage:        S3-compatible (immagini prodotti)
Auth:           NextAuth / Clerk (per area admin)
Hosting:        Vercel (frontend) + Railway/Render (backend)
                OPPURE tutto su Next.js + Vercel
```

### 3.2 Perché React (e considerazione Next.js)
React è una scelta solida, ma consiglio di valutare **Next.js** (che è basato su React) perché offre:
- **SSR/SSG** — fondamentale per la SEO (i clienti cercano "funerali + città" su Google)
- **API Routes** — backend integrato, meno infrastruttura da gestire
- **Image Optimization** — immagini dei prodotti ottimizzate automaticamente
- **Deployment semplificato** su Vercel

### 3.3 Diagramma architetturale ad alto livello

```
┌─────────────────────────────────────────────────┐
│                    FRONTEND                      │
│              (React / Next.js)                   │
│                                                  │
│  ┌──────────┐ ┌───────────┐ ┌───────────────┐   │
│  │ Homepage  │ │Configura- │ │  Riepilogo &  │   │
│  │          │ │   tore    │ │  Preventivo   │   │
│  └──────────┘ └───────────┘ └───────────────┘   │
│  ┌──────────┐ ┌───────────┐ ┌───────────────┐   │
│  │ Chi Siamo │ │ Catalogo  │ │  Contatti &   │   │
│  │          │ │ Prodotti  │ │  Richiesta    │   │
│  └──────────┘ └───────────┘ └───────────────┘   │
│  ┌──────────────────────────────────────────┐   │
│  │        Dashboard Admin (protetta)         │   │
│  └──────────────────────────────────────────┘   │
└───────────────────────┬─────────────────────────┘
                        │ API REST / tRPC
┌───────────────────────┴─────────────────────────┐
│                    BACKEND                       │
│              (Node/Express o Next.js API)        │
│                                                  │
│  ┌──────────┐ ┌───────────┐ ┌───────────────┐   │
│  │ Catalogo │ │ Configu-  │ │  Richieste/   │   │
│  │   API    │ │ razioni   │ │   Ordini      │   │
│  └──────────┘ └───────────┘ └───────────────┘   │
│  ┌──────────┐ ┌───────────┐ ┌───────────────┐   │
│  │  Auth    │ │  Email/   │ │  Analytics    │   │
│  │  Admin   │ │  Notifiche│ │               │   │
│  └──────────┘ └───────────┘ └───────────────┘   │
└───────────────────────┬─────────────────────────┘
                        │
┌───────────────────────┴─────────────────────────┐
│                   DATABASE                       │
│                 (PostgreSQL)                      │
│                                                  │
│  prodotti · categorie · configurazioni           │
│  richieste · clienti · admin_users               │
└─────────────────────────────────────────────────┘
```

---

## 4. Funzionalità Dettagliate

### 4.1 Sezione Pubblica — Il Sito

**Homepage**
- Messaggio di accoglienza sobrio e rassicurante
- Call-to-action: "Configura il servizio funebre" e "Contattaci"
- Breve presentazione dell'impresa e dei valori
- Sezione FAQ (domande frequenti su procedura, documenti necessari, tempistiche)

**Chi Siamo**
- Storia dell'impresa, valori, team
- Autorizzazioni e iscrizioni (Registro Regionale)
- Strutture disponibili (casa funeraria se presente)

**Catalogo Prodotti**
- Navigazione per categoria: Bare, Urne, Auto funebri, Fiori e addobbi, Servizi aggiuntivi
- Scheda prodotto con foto, descrizione, materiali, dimensioni, prezzo
- Filtri: prezzo, materiale, tipologia
- Nessun ordinamento per "popolarità" o badge "consigliato" (vincolo normativo)

### 4.2 Il Configuratore — Cuore del Portale

Il configuratore guida il cliente attraverso un flusso a step, passo dopo passo:

```
STEP 1: Tipo di servizio
  ├── Inumazione (sepoltura in terra)
  ├── Tumulazione (sepoltura in loculo)
  └── Cremazione (con scelta urna)

STEP 2: Scelta della bara / urna
  ├── Catalogo bare (filtri: legno, metallo, economica, standard, premium)
  └── Se cremazione → scelta urna cineraria

STEP 3: Trasporto funebre
  ├── Auto funebre (tipologie disponibili)
  ├── Percorso (da casa/ospedale → chiesa → cimitero/crematorio)
  └── Distanza e costi km

STEP 4: Cerimonia
  ├── Tipo: religiosa (cattolica, altra confessione) / laica
  ├── Luogo: chiesa, casa funeraria, altro
  └── Servizi aggiuntivi: musica, addobbi floreali, libro firme

STEP 5: Fiori e addobbi
  ├── Composizioni floreali (corona, cuscino, mazzo, ecc.)
  ├── Addobbi per la camera ardente
  └── Personalizzazioni

STEP 6: Servizi extra
  ├── Necrologi (giornale, online)
  ├── Vestizione salma
  ├── Tanatocosmesi
  ├── Foto ricordo / santini commemorativi
  └── Assistenza pratiche burocratiche (certificato di morte, ecc.)

STEP 7: Riepilogo e Preventivo
  ├── Riepilogo visivo di tutte le scelte
  ├── Preventivo indicativo dettagliato (voce per voce)
  ├── Possibilità di modificare ogni step
  └── "Il prezzo finale sarà confermato dal nostro consulente"

STEP 8: Richiesta di contatto
  ├── Form: nome, telefono, email, note
  ├── Preferenza orario per essere ricontattati
  ├── Consenso privacy (GDPR)
  └── Invio richiesta → email/notifica allo staff
```

**Note UX importanti per il configuratore:**
- Tono sempre rispettoso e sobrio — nessun linguaggio commerciale aggressivo
- Progress bar per indicare a che punto si è nel percorso
- Possibilità di salvare la configurazione (link univoco) e riprenderla dopo
- Possibilità di saltare step e compilarli dopo
- Versione mobile-first (molti accessi saranno da smartphone, spesso in momenti di urgenza)

### 4.3 Dashboard Admin (Area Riservata)

**Gestione Catalogo**
- CRUD prodotti (aggiungi, modifica, elimina, disattiva)
- Upload foto prodotti
- Gestione categorie e sottocategorie
- Gestione prezzi e disponibilità

**Gestione Richieste**
- Lista richieste ricevute (con stato: nuova, in lavorazione, confermata, completata)
- Dettaglio configurazione scelta dal cliente
- Possibilità di contattare il cliente (log comunicazioni)
- Conversione richiesta → ordine confermato

**Reportistica**
- Richieste ricevute per periodo
- Prodotti/servizi più richiesti (dato interno, NON mostrato al cliente)
- Tasso di conversione richiesta → ordine

---

## 5. Schema Database (Concettuale)

```
CATEGORIE
  id, nome, slug, descrizione, ordine, icona, attiva

PRODOTTI
  id, categoria_id, nome, slug, descrizione, descrizione_breve
  materiale, dimensioni, prezzo, immagini[], attivo
  tipo_servizio (inumazione|tumulazione|cremazione|tutti)

CONFIGURAZIONI
  id, session_id, created_at, updated_at
  tipo_servizio, stato (bozza|completata|inviata)

CONFIGURAZIONE_PRODOTTI
  id, configurazione_id, prodotto_id, step, quantita, note

RICHIESTE
  id, configurazione_id, created_at
  nome_cliente, telefono, email, note
  preferenza_contatto, consenso_privacy
  stato (nuova|in_lavorazione|confermata|completata|annullata)

ADMIN_USERS
  id, email, password_hash, nome, ruolo

COMUNICAZIONI
  id, richiesta_id, tipo (email|telefono|nota_interna)
  contenuto, data, admin_user_id
```

### 5.1 Estensione futura per Marketplace (Fase 2)

```
IMPRESE
  id, ragione_sociale, partita_iva, registro_regionale_n
  indirizzo, telefono, email, logo, descrizione
  comuni_serviti[], attiva, verificata

PRODOTTI → aggiungere campo: impresa_id
RICHIESTE → aggiungere campo: impresa_id
```

---

## 6. Design e UX Guidelines

### 6.1 Principi di design
- **Sobrietà:** palette colori neutri/scuri (grigio scuro, bianco, accenti in oro/bronzo o blu scuro)
- **Rispetto:** nessun linguaggio commerciale aggressivo, nessun countdown, nessuna pressione
- **Chiarezza:** informazioni leggibili, font serif per i titoli (eleganza), sans-serif per il corpo
- **Accessibilità:** WCAG 2.1 AA come minimo (utenti anziani, dispositivi vari)
- **Mobile-first:** la maggior parte degli utenti accederà da smartphone

### 6.2 Palette colori suggerita
```
Primario:       #2C3E50 (blu scuro, serietà)
Secondario:     #8B7355 (bronzo/oro antico, eleganza)
Background:     #F8F6F3 (bianco caldo)
Testo:          #333333 (grigio scuro)
Accento:        #6B8E6B (verde salvia, per CTA discrete)
Errore:         #C0392B (rosso scuro)
```

### 6.3 Tono di comunicazione
- Evitare: "offerta", "sconto", "affare", "promozione", "best seller"
- Preferire: "accompagnamento", "supporto", "cura", "dignità", "rispetto"
- Evitare emoji e elementi grafici troppo vivaci
- Le CTA devono essere discrete: "Procedi", "Scopri le opzioni", "Richiedi assistenza"

---

## 7. Aspetti Legali e Privacy

### 7.1 GDPR — Trattamento dati
- **Dati del cliente (familiare):** nome, telefono, email → base giuridica: consenso o esecuzione pre-contrattuale
- **Dati del defunto:** trattare con estrema cautela — il GDPR non si applica formalmente ai dati dei defunti, ma il Codice Privacy italiano (D.Lgs. 196/2003 art. 2-terdecies) concede diritti ai familiari
- **Cookie policy:** necessaria (analytics, eventuali remarketing)
- **Informativa privacy:** obbligatoria, con dettaglio su finalità, base giuridica, conservazione, diritti

### 7.2 Documenti legali necessari
- Termini e Condizioni d'uso del portale
- Informativa Privacy (GDPR compliant)
- Cookie Policy
- Disclaimer: "Il preventivo generato online è indicativo e non costituisce proposta contrattuale"

### 7.3 Mandato funebre
Nella Fase 1 (Configura + Prenota), il mandato funebre viene firmato offline durante il primo incontro con il consulente. Il portale genera solo una richiesta di contatto, non un contratto.

---

## 8. Roadmap di Sviluppo

### Fase 1 — MVP (8-12 settimane)
| Settimana | Attività |
|---|---|
| 1-2 | Setup progetto Next.js, DB, design system base |
| 3-4 | Homepage, Chi Siamo, Contatti, layout generale |
| 5-7 | Configuratore funerale (tutti gli step) |
| 8-9 | Catalogo prodotti + schede prodotto |
| 10 | Dashboard admin base (gestione prodotti e richieste) |
| 11 | Integrazione email notifiche, test |
| 12 | Deploy, ottimizzazione SEO, go-live |

### Fase 2 — Consolidamento (4-6 settimane dopo il go-live)
- Analytics avanzati
- Blog / sezione informativa (guida ai documenti necessari, FAQ approfondite)
- Ottimizzazione SEO locale (Google My Business, schema markup)
- Chat / WhatsApp integration per supporto rapido

### Fase 3 — Marketplace (da pianificare)
- Onboarding altre imprese funebri (verifica Registro Regionale)
- Dashboard multi-impresa
- Sistema di matching cliente-impresa (per zona geografica)
- Valutazione integrazione pagamenti (previa consulenza legale)

---

## 9. Considerazioni SEO

Il portale deve posizionarsi per ricerche locali come:
- "onoranze funebri [città]"
- "funerali [zona della Campania]"
- "quanto costa un funerale [città]"
- "cremazione Campania"

Strategie:
- **Schema markup:** LocalBusiness, FuneralHome, Product
- **Pagine per città/zona:** landing page dedicate per ogni comune servito
- **Google My Business:** profilo ottimizzato con link al configuratore
- **Blog:** articoli informativi su documenti necessari, procedura dopo un decesso, diritti dei familiari
- **Performance:** Core Web Vitals ottimi (Next.js aiuta molto)

---

## 10. Stima Costi Indicativa

| Voce | Stima |
|---|---|
| Sviluppo MVP (freelance/agenzia) | €8.000 - €15.000 |
| Hosting annuo (Vercel + DB) | €300 - €600/anno |
| Dominio | €10 - €30/anno |
| Fotografia prodotti professionale | €500 - €1.500 |
| Consulenza legale (privacy, T&C) | €1.000 - €2.000 |
| Manutenzione annua | €2.000 - €4.000/anno |
| **Totale primo anno** | **€12.000 - €23.000** |

Se lo sviluppo è interno (con Claude Code in VS Code), i costi si riducono significativamente al solo hosting, dominio, foto e consulenza legale.

---

## 11. Istruzioni per Claude Code (VS Code)

Quando aprirai questo progetto in VS Code con Claude Code, puoi usare questo documento come riferimento. Ecco i primi prompt suggeriti:

### Setup iniziale
```
Crea un progetto Next.js 14+ con TypeScript, Tailwind CSS, Prisma e PostgreSQL.
Struttura il progetto secondo il documento di progetto che trovi in progetto-portale-funebre.md.
Inizia dal setup base: layout, tema colori, componenti UI fondamentali.
```

### Configuratore
```
Implementa il configuratore funerale multi-step come descritto nel documento di progetto
(sezione 4.2). Usa Zustand per lo state management del configuratore.
Il flusso è: tipo servizio → bara/urna → trasporto → cerimonia → fiori → extra → riepilogo → richiesta.
```

### Database
```
Crea lo schema Prisma seguendo lo schema concettuale nella sezione 5 del documento di progetto.
Genera le migration e crea un seed con dati di esempio per testare il configuratore.
```

---

## 12. Note Finali

Questo progetto ha il potenziale per essere innovativo nel settore funebre campano, dove la digitalizzazione è ancora molto limitata. La chiave del successo sarà bilanciare l'efficienza digitale con il rispetto e la sensibilità che questo tipo di servizio richiede.

**Azioni immediate consigliate:**
1. Consultare un avvocato per validare il modello "Configura + Prenota" e preparare i documenti legali
2. Registrare il dominio (suggerimenti: nomeimpresa.it, nomecittàfunerali.it)
3. Fare un servizio fotografico professionale dei prodotti
4. Iniziare lo sviluppo del MVP con Claude Code in VS Code seguendo le istruzioni nella sezione 11
