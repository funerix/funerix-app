-- ============================================
-- FUNERIX PREVIDENZA — Tabelle Supabase
-- ============================================

-- 1. Tipi Piano (Base, Comfort, Premium)
CREATE TABLE IF NOT EXISTS tipi_piano (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  slug TEXT UNIQUE,
  descrizione TEXT,
  prezzo_base DECIMAL(10,2) NOT NULL,
  servizi_inclusi JSONB NOT NULL DEFAULT '[]',
  durata_min_mesi INTEGER DEFAULT 12,
  durata_max_mesi INTEGER DEFAULT 60,
  maggiorazione_annua_pct DECIMAL(5,2) DEFAULT 0,
  attivo BOOLEAN DEFAULT true,
  ordine_visualizzazione INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Clienti Previdenza (con login email/password)
CREATE TABLE IF NOT EXISTS clienti_previdenza (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  cognome TEXT NOT NULL,
  codice_fiscale TEXT,
  data_nascita DATE,
  telefono TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  indirizzo TEXT,
  citta TEXT,
  cap TEXT,
  email_verificata BOOLEAN DEFAULT false,
  ultimo_accesso TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Beneficiari
CREATE TABLE IF NOT EXISTS beneficiari (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  piano_id UUID,
  nome TEXT NOT NULL,
  cognome TEXT NOT NULL,
  codice_fiscale TEXT,
  data_nascita DATE,
  luogo_nascita TEXT,
  relazione_con_cliente TEXT DEFAULT 'se_stesso',
  indirizzo TEXT,
  citta TEXT,
  documenti JSONB DEFAULT '[]',
  preferenze_cerimonia JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Piani Previdenza (aggiorna la tabella esistente o crea nuova versione)
-- La tabella piani_previdenza esiste gia ma con schema vecchio, la aggiorniamo
DO $$ BEGIN
  -- Aggiungi colonne mancanti se non esistono
  ALTER TABLE piani_previdenza ADD COLUMN IF NOT EXISTS cliente_id UUID;
  ALTER TABLE piani_previdenza ADD COLUMN IF NOT EXISTS beneficiario_id UUID;
  ALTER TABLE piani_previdenza ADD COLUMN IF NOT EXISTS tipo_piano_id UUID;
  ALTER TABLE piani_previdenza ADD COLUMN IF NOT EXISTS tipo_piano_nome TEXT;
  ALTER TABLE piani_previdenza ADD COLUMN IF NOT EXISTS configurazione JSONB DEFAULT '{}';
  ALTER TABLE piani_previdenza ADD COLUMN IF NOT EXISTS num_rate INTEGER DEFAULT 36;
  ALTER TABLE piani_previdenza ADD COLUMN IF NOT EXISTS importo_rata DECIMAL(10,2) DEFAULT 0;
  ALTER TABLE piani_previdenza ADD COLUMN IF NOT EXISTS rate_pagate INTEGER DEFAULT 0;
  ALTER TABLE piani_previdenza ADD COLUMN IF NOT EXISTS saldo_versato DECIMAL(10,2) DEFAULT 0;
  ALTER TABLE piani_previdenza ADD COLUMN IF NOT EXISTS saldo_residuo DECIMAL(10,2) DEFAULT 0;
  ALTER TABLE piani_previdenza ADD COLUMN IF NOT EXISTS rsa_id UUID;
  ALTER TABLE piani_previdenza ADD COLUMN IF NOT EXISTS rsa_operatore TEXT;
  ALTER TABLE piani_previdenza ADD COLUMN IF NOT EXISTS codice_convenzione TEXT;
  ALTER TABLE piani_previdenza ADD COLUMN IF NOT EXISTS contratto_url TEXT;
  ALTER TABLE piani_previdenza ADD COLUMN IF NOT EXISTS contratto_firmato BOOLEAN DEFAULT false;
  ALTER TABLE piani_previdenza ADD COLUMN IF NOT EXISTS data_firma TIMESTAMPTZ;
  ALTER TABLE piani_previdenza ADD COLUMN IF NOT EXISTS data_attivazione TIMESTAMPTZ;
  ALTER TABLE piani_previdenza ADD COLUMN IF NOT EXISTS data_completamento TIMESTAMPTZ;
  ALTER TABLE piani_previdenza ADD COLUMN IF NOT EXISTS data_sospensione TIMESTAMPTZ;
  ALTER TABLE piani_previdenza ADD COLUMN IF NOT EXISTS data_recesso TIMESTAMPTZ;
  ALTER TABLE piani_previdenza ADD COLUMN IF NOT EXISTS motivo_recesso TEXT;
  ALTER TABLE piani_previdenza ADD COLUMN IF NOT EXISTS importo_rimborso DECIMAL(10,2);
  ALTER TABLE piani_previdenza ADD COLUMN IF NOT EXISTS consulente_id UUID;
  ALTER TABLE piani_previdenza ADD COLUMN IF NOT EXISTS note_interne TEXT;
  ALTER TABLE piani_previdenza ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Some columns already exist, continuing...';
END $$;

-- 5. Pagamenti Rata
CREATE TABLE IF NOT EXISTS pagamenti_rata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  piano_id UUID REFERENCES piani_previdenza(id),
  numero_rata INTEGER NOT NULL,
  importo DECIMAL(10,2) NOT NULL,
  stato TEXT NOT NULL DEFAULT 'pendente' CHECK (stato IN ('pendente', 'pagato', 'scaduto', 'fallito', 'annullato')),
  data_scadenza DATE NOT NULL,
  data_pagamento TIMESTAMPTZ,
  metodo_pagamento TEXT,
  stripe_payment_id TEXT,
  ricevuta_url TEXT,
  tentativo_addebito INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Portale RSA Users
CREATE TABLE IF NOT EXISTS portale_rsa_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rsa_id UUID REFERENCES rsa_convenzionate(id),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  nome TEXT NOT NULL,
  ruolo TEXT NOT NULL DEFAULT 'operatore_rsa' CHECK (ruolo IN ('admin_rsa', 'operatore_rsa')),
  attivo BOOLEAN DEFAULT true,
  ultimo_accesso TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Commissioni RSA
CREATE TABLE IF NOT EXISTS commissioni_rsa (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rsa_id UUID REFERENCES rsa_convenzionate(id),
  piano_id UUID REFERENCES piani_previdenza(id),
  importo DECIMAL(10,2) NOT NULL,
  percentuale DECIMAL(5,2) NOT NULL,
  stato TEXT DEFAULT 'maturata' CHECK (stato IN ('maturata', 'approvata', 'pagata')),
  data_maturazione TIMESTAMPTZ DEFAULT now(),
  data_approvazione TIMESTAMPTZ,
  data_pagamento TIMESTAMPTZ,
  metodo_pagamento TEXT,
  ricevuta_url TEXT,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Contenuti Previdenza (testi editabili da admin)
CREATE TABLE IF NOT EXISTS previdenza_contenuti (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sezione TEXT NOT NULL UNIQUE,
  titolo TEXT,
  sottotitolo TEXT,
  contenuto_json JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 9. Log Previdenza (traccia ogni azione)
CREATE TABLE IF NOT EXISTS previdenza_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  piano_id UUID REFERENCES piani_previdenza(id),
  azione TEXT NOT NULL,
  dettaglio TEXT,
  utente_nome TEXT,
  utente_tipo TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Aggiorna rsa_convenzionate con colonne mancanti
DO $$ BEGIN
  ALTER TABLE rsa_convenzionate ADD COLUMN IF NOT EXISTS tipo TEXT DEFAULT 'rsa';
  ALTER TABLE rsa_convenzionate ADD COLUMN IF NOT EXISTS sito_web TEXT;
  ALTER TABLE rsa_convenzionate ADD COLUMN IF NOT EXISTS referente_telefono TEXT;
  ALTER TABLE rsa_convenzionate ADD COLUMN IF NOT EXISTS referente_email TEXT;
  ALTER TABLE rsa_convenzionate ADD COLUMN IF NOT EXISTS piani_totali INTEGER DEFAULT 0;
  ALTER TABLE rsa_convenzionate ADD COLUMN IF NOT EXISTS commissioni_maturate DECIMAL(10,2) DEFAULT 0;
  ALTER TABLE rsa_convenzionate ADD COLUMN IF NOT EXISTS commissioni_pagate DECIMAL(10,2) DEFAULT 0;
  ALTER TABLE rsa_convenzionate ADD COLUMN IF NOT EXISTS latitudine DECIMAL(10,7);
  ALTER TABLE rsa_convenzionate ADD COLUMN IF NOT EXISTS longitudine DECIMAL(10,7);
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'RSA columns update skipped';
END $$;

-- ============================================
-- DATI INIZIALI
-- ============================================

-- Tipi Piano
INSERT INTO tipi_piano (nome, slug, descrizione, prezzo_base, servizi_inclusi, durata_min_mesi, durata_max_mesi, ordine_visualizzazione) VALUES
(
  'Base', 'base', 'Servizio funebre essenziale con tutto il necessario.',
  3500,
  '[{"nome": "Bara in legno massello", "categoria": "bara"},
    {"nome": "Auto funebre", "categoria": "trasporto"},
    {"nome": "Cerimonia semplice", "categoria": "cerimonia"},
    {"nome": "Composizione fiori base", "categoria": "fiori"},
    {"nome": "Trasporto entro 20km", "categoria": "trasporto"}]'::jsonb,
  12, 60, 1
),
(
  'Comfort', 'comfort', 'Servizio funebre completo con finiture di qualita.',
  5500,
  '[{"nome": "Bara premium in legno pregiato", "categoria": "bara"},
    {"nome": "Auto funebre di lusso", "categoria": "trasporto"},
    {"nome": "Cerimonia con musica", "categoria": "cerimonia"},
    {"nome": "Composizione fiori elegante", "categoria": "fiori"},
    {"nome": "Manifesto funebre", "categoria": "extra"},
    {"nome": "Memorial digitale", "categoria": "extra"},
    {"nome": "Trasporto entro 50km", "categoria": "trasporto"}]'::jsonb,
  12, 60, 2
),
(
  'Premium', 'premium', 'Servizio funebre di prestigio, ogni dettaglio curato.',
  8000,
  '[{"nome": "Bara di pregio in legno massello", "categoria": "bara"},
    {"nome": "2 auto funebri di lusso", "categoria": "trasporto"},
    {"nome": "Cerimonia completa con coro", "categoria": "cerimonia"},
    {"nome": "Composizione fiori premium", "categoria": "fiori"},
    {"nome": "Manifesto funebre premium", "categoria": "extra"},
    {"nome": "Memorial digitale con video tributo", "categoria": "extra"},
    {"nome": "Trasporto illimitato", "categoria": "trasporto"},
    {"nome": "Consulente dedicato", "categoria": "extra"}]'::jsonb,
  12, 60, 3
);

-- Contenuti iniziali previdenza
INSERT INTO previdenza_contenuti (sezione, titolo, sottotitolo, contenuto_json) VALUES
  ('hero', 'Previdenza Funerix', 'Pianificate oggi, vivete sereni', '{"cta_testo": "Configura il tuo piano", "cta_link": "/previdenza/configuratore", "badge": "Fondi protetti su conto dedicato separato"}'),
  ('vantaggi', 'Le nostre garanzie', null, '{"items": [{"titolo": "Fondi protetti", "desc": "I versamenti sono depositati su un conto bancario dedicato e separato."}, {"titolo": "Prezzo bloccato", "desc": "Il prezzo configurato oggi resta invariato per tutta la durata del piano."}, {"titolo": "Trasferibile", "desc": "Il piano puo essere trasferito a un altro familiare senza costi."}]}'),
  ('processo', 'Come funziona', null, '{"steps": [{"n": "01", "titolo": "Configurate", "desc": "Scegliete ogni dettaglio del servizio."}, {"n": "02", "titolo": "Scegliete il piano", "desc": "Da 12 a 60 rate mensili. Prezzo bloccato."}, {"n": "03", "titolo": "Pagate a rate", "desc": "Addebito automatico mensile."}, {"n": "04", "titolo": "Vivete sereni", "desc": "Quando il momento arriva, tutto e gia organizzato."}]}'),
  ('simulatore', 'Quanto costa al mese?', 'Simulate il costo mensile per un servizio funebre completo', '{}'),
  ('faq', 'Domande Frequenti', null, '{"items": [{"q": "Posso annullare il piano?", "a": "Si, entro 14 giorni rimborso totale. Dopo, rimborso del versato meno 5% spese amministrative."}, {"q": "Cosa succede se salto una rata?", "a": "Riceverete un promemoria. Dopo 15 giorni di mancato pagamento il piano viene sospeso temporaneamente."}, {"q": "Il prezzo puo aumentare?", "a": "No, il prezzo configurato e bloccato per sempre."}, {"q": "Posso modificare le scelte?", "a": "Si, contattando il vostro consulente potete modificare il piano in qualsiasi momento."}]}'),
  ('convenzioni_hero', 'Convenzioni RSA e Case di Cura', 'Offrite ai familiari dei vostri ospiti un servizio funebre gia organizzato.', '{}'),
  ('convenzioni_vantaggi', 'Vantaggi per la struttura', null, '{"items": ["Nessun costo di adesione", "Commissione su ogni piano attivato", "Dashboard dedicata per monitorare i piani", "Materiale informativo fornito", "Assistenza dedicata", "Servizio professionale garantito", "Nessuna responsabilita gestionale", "Report mensile trasparente"]}');

-- RLS
ALTER TABLE tipi_piano ENABLE ROW LEVEL SECURITY;
ALTER TABLE clienti_previdenza ENABLE ROW LEVEL SECURITY;
ALTER TABLE beneficiari ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagamenti_rata ENABLE ROW LEVEL SECURITY;
ALTER TABLE portale_rsa_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissioni_rsa ENABLE ROW LEVEL SECURITY;
ALTER TABLE previdenza_contenuti ENABLE ROW LEVEL SECURITY;
ALTER TABLE previdenza_log ENABLE ROW LEVEL SECURITY;

-- Policies pubbliche
CREATE POLICY "Tipi piano visibili a tutti" ON tipi_piano FOR SELECT USING (attivo = true);
CREATE POLICY "Contenuti previdenza visibili a tutti" ON previdenza_contenuti FOR SELECT USING (true);
