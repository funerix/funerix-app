-- ============================================
-- FUNERIX RIMPATRI — Tabelle Supabase
-- ============================================

-- 1. Clienti Rimpatri
CREATE TABLE IF NOT EXISTS rimpatri_clienti (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  cognome TEXT NOT NULL,
  telefono TEXT NOT NULL,
  email TEXT NOT NULL,
  relazione_con_defunto TEXT,
  indirizzo TEXT,
  citta TEXT,
  cap TEXT,
  nazionalita TEXT,
  lingua_preferita TEXT DEFAULT 'it',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Paesi
CREATE TABLE IF NOT EXISTS rimpatri_paesi (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  codice_iso TEXT NOT NULL,
  zona TEXT NOT NULL CHECK (zona IN ('europa', 'nord_africa', 'americhe', 'asia', 'africa_subsahariana', 'oceania')),
  prezzo_base DECIMAL(10,2) NOT NULL,
  tempo_medio_giorni INTEGER,
  documenti_richiesti JSONB DEFAULT '[]',
  requisiti_specifici TEXT,
  note TEXT,
  bandiera_emoji TEXT,
  attivo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Consolati
CREATE TABLE IF NOT EXISTS rimpatri_consolati (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paese_id UUID REFERENCES rimpatri_paesi(id),
  citta TEXT NOT NULL,
  indirizzo TEXT,
  telefono TEXT,
  email TEXT,
  sito_web TEXT,
  orari TEXT,
  latitudine DECIMAL(10,7),
  longitudine DECIMAL(10,7),
  note TEXT,
  attivo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Partner Esteri
CREATE TABLE IF NOT EXISTS rimpatri_partner (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome_agenzia TEXT NOT NULL,
  paese TEXT,
  citta TEXT,
  indirizzo TEXT,
  telefono TEXT,
  email TEXT,
  referente TEXT,
  servizi_offerti JSONB DEFAULT '[]',
  commissione_percentuale DECIMAL(5,2),
  pratiche_totali INTEGER DEFAULT 0,
  attivo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Prezzi Rimpatri
CREATE TABLE IF NOT EXISTS rimpatri_prezzi (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zona TEXT,
  paese_id UUID REFERENCES rimpatri_paesi(id),
  tipo TEXT NOT NULL,
  nome_servizio TEXT NOT NULL,
  prezzo DECIMAL(10,2) NOT NULL,
  obbligatorio_per_zona BOOLEAN DEFAULT false,
  attivo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Pratiche Rimpatri
CREATE TABLE IF NOT EXISTS rimpatri_pratiche (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID REFERENCES rimpatri_clienti(id),
  defunto_nome TEXT NOT NULL,
  defunto_cognome TEXT NOT NULL,
  defunto_nazionalita TEXT,
  defunto_data_decesso DATE,
  direzione TEXT NOT NULL CHECK (direzione IN ('italia_estero', 'estero_italia')),
  paese_id UUID REFERENCES rimpatri_paesi(id),
  citta_partenza TEXT,
  citta_destinazione TEXT,
  zona TEXT,
  servizi_extra JSONB DEFAULT '[]',
  stato TEXT NOT NULL DEFAULT 'richiesta' CHECK (stato IN ('richiesta', 'documenti_in_corso', 'documenti_completati', 'autorizzato', 'in_transito', 'arrivata', 'consegnata', 'completata', 'annullata')),
  documenti JSONB DEFAULT '[]',
  volo_compagnia TEXT,
  volo_numero TEXT,
  volo_data TIMESTAMPTZ,
  volo_tratta TEXT,
  partner_estero_id UUID REFERENCES rimpatri_partner(id),
  consolato_id UUID REFERENCES rimpatri_consolati(id),
  totale DECIMAL(10,2),
  pagato BOOLEAN DEFAULT false,
  metodo_pagamento TEXT,
  stripe_payment_id TEXT,
  lingua_cliente TEXT DEFAULT 'it',
  token_accesso UUID DEFAULT gen_random_uuid(),
  consulente_id UUID,
  note_cliente TEXT,
  note_interne TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Timeline Rimpatri (traccia ogni step della pratica)
CREATE TABLE IF NOT EXISTS rimpatri_timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pratica_id UUID REFERENCES rimpatri_pratiche(id) ON DELETE CASCADE,
  stato TEXT NOT NULL,
  descrizione TEXT,
  documenti_allegati JSONB DEFAULT '[]',
  operatore_nome TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Documenti Template (checklist per paese)
CREATE TABLE IF NOT EXISTS rimpatri_documenti_template (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paese_id UUID REFERENCES rimpatri_paesi(id),
  nome_documento TEXT NOT NULL,
  descrizione TEXT,
  obbligatorio BOOLEAN DEFAULT true,
  template_url TEXT,
  ordine INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. Contenuti SEO Rimpatri
CREATE TABLE IF NOT EXISTS rimpatri_contenuti_seo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo TEXT NOT NULL CHECK (tipo IN ('comunita', 'guida', 'paese_extra')),
  slug TEXT NOT NULL UNIQUE,
  titolo TEXT NOT NULL,
  sottotitolo TEXT,
  contenuto_html TEXT,
  meta_title TEXT,
  meta_description TEXT,
  lingua_target TEXT,
  pubblicato BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- DATI INIZIALI
-- ============================================

-- Paesi principali per zona
INSERT INTO rimpatri_paesi (nome, codice_iso, zona, prezzo_base, tempo_medio_giorni, bandiera_emoji, documenti_richiesti) VALUES
  ('Romania', 'RO', 'europa', 2500, 5, '🇷🇴', '[{"nome":"Certificato di morte tradotto","obbligatorio":true,"ordine":1},{"nome":"Nulla osta consolato romeno","obbligatorio":true,"ordine":2},{"nome":"Autorizzazione trasporto ASL","obbligatorio":true,"ordine":3},{"nome":"Passaporto mortuario","obbligatorio":true,"ordine":4}]'),
  ('Albania', 'AL', 'europa', 2800, 5, '🇦🇱', '[{"nome":"Certificato di morte tradotto","obbligatorio":true,"ordine":1},{"nome":"Nulla osta ambasciata albanese","obbligatorio":true,"ordine":2},{"nome":"Autorizzazione trasporto","obbligatorio":true,"ordine":3},{"nome":"Passaporto mortuario","obbligatorio":true,"ordine":4}]'),
  ('Germania', 'DE', 'europa', 2200, 3, '🇩🇪', '[{"nome":"Certificato di morte","obbligatorio":true,"ordine":1},{"nome":"Autorizzazione trasporto","obbligatorio":true,"ordine":2},{"nome":"Passaporto mortuario","obbligatorio":true,"ordine":3}]'),
  ('Francia', 'FR', 'europa', 2000, 3, '🇫🇷', '[{"nome":"Certificato di morte","obbligatorio":true,"ordine":1},{"nome":"Autorizzazione trasporto","obbligatorio":true,"ordine":2},{"nome":"Passaporto mortuario","obbligatorio":true,"ordine":3}]'),
  ('Svizzera', 'CH', 'europa', 2200, 3, '🇨🇭', '[{"nome":"Certificato di morte","obbligatorio":true,"ordine":1},{"nome":"Autorizzazione trasporto","obbligatorio":true,"ordine":2},{"nome":"Passaporto mortuario","obbligatorio":true,"ordine":3}]'),
  ('Ucraina', 'UA', 'europa', 3500, 7, '🇺🇦', '[{"nome":"Certificato di morte tradotto","obbligatorio":true,"ordine":1},{"nome":"Nulla osta consolato","obbligatorio":true,"ordine":2},{"nome":"Autorizzazione trasporto","obbligatorio":true,"ordine":3},{"nome":"Passaporto mortuario","obbligatorio":true,"ordine":4},{"nome":"Certificato imbalsamazione","obbligatorio":true,"ordine":5}]'),
  ('Polonia', 'PL', 'europa', 2400, 4, '🇵🇱', '[{"nome":"Certificato di morte","obbligatorio":true,"ordine":1},{"nome":"Autorizzazione trasporto","obbligatorio":true,"ordine":2},{"nome":"Passaporto mortuario","obbligatorio":true,"ordine":3}]'),
  ('Marocco', 'MA', 'nord_africa', 3500, 7, '🇲🇦', '[{"nome":"Certificato di morte tradotto e legalizzato","obbligatorio":true,"ordine":1},{"nome":"Nulla osta consolato marocchino","obbligatorio":true,"ordine":2},{"nome":"Autorizzazione trasporto","obbligatorio":true,"ordine":3},{"nome":"Certificato imbalsamazione","obbligatorio":true,"ordine":4},{"nome":"Passaporto mortuario","obbligatorio":true,"ordine":5}]'),
  ('Tunisia', 'TN', 'nord_africa', 3200, 7, '🇹🇳', '[{"nome":"Certificato di morte tradotto","obbligatorio":true,"ordine":1},{"nome":"Nulla osta consolato","obbligatorio":true,"ordine":2},{"nome":"Autorizzazione trasporto","obbligatorio":true,"ordine":3},{"nome":"Passaporto mortuario","obbligatorio":true,"ordine":4}]'),
  ('Egitto', 'EG', 'nord_africa', 4000, 10, '🇪🇬', '[{"nome":"Certificato di morte tradotto e apostillato","obbligatorio":true,"ordine":1},{"nome":"Nulla osta ambasciata","obbligatorio":true,"ordine":2},{"nome":"Autorizzazione trasporto","obbligatorio":true,"ordine":3},{"nome":"Certificato imbalsamazione","obbligatorio":true,"ordine":4},{"nome":"Cassa zinco IATA","obbligatorio":true,"ordine":5}]'),
  ('USA', 'US', 'americhe', 6000, 10, '🇺🇸', '[{"nome":"Certificato di morte tradotto e apostillato","obbligatorio":true,"ordine":1},{"nome":"Autorizzazione consolato USA","obbligatorio":true,"ordine":2},{"nome":"Cassa zinco IATA","obbligatorio":true,"ordine":3},{"nome":"Certificato imbalsamazione","obbligatorio":true,"ordine":4},{"nome":"Passaporto mortuario","obbligatorio":true,"ordine":5}]'),
  ('Brasile', 'BR', 'americhe', 7000, 12, '🇧🇷', '[{"nome":"Certificato di morte tradotto","obbligatorio":true,"ordine":1},{"nome":"Nulla osta consolato brasiliano","obbligatorio":true,"ordine":2},{"nome":"Cassa zinco IATA","obbligatorio":true,"ordine":3},{"nome":"Certificato imbalsamazione","obbligatorio":true,"ordine":4}]'),
  ('Cina', 'CN', 'asia', 7000, 14, '🇨🇳', '[{"nome":"Certificato di morte tradotto in cinese","obbligatorio":true,"ordine":1},{"nome":"Nulla osta ambasciata cinese","obbligatorio":true,"ordine":2},{"nome":"Cassa zinco IATA","obbligatorio":true,"ordine":3},{"nome":"Certificato imbalsamazione","obbligatorio":true,"ordine":4},{"nome":"Passaporto mortuario","obbligatorio":true,"ordine":5}]'),
  ('India', 'IN', 'asia', 6500, 12, '🇮🇳', '[{"nome":"Certificato di morte tradotto","obbligatorio":true,"ordine":1},{"nome":"Nulla osta ambasciata","obbligatorio":true,"ordine":2},{"nome":"Cassa zinco IATA","obbligatorio":true,"ordine":3},{"nome":"Certificato imbalsamazione","obbligatorio":true,"ordine":4}]'),
  ('Bangladesh', 'BD', 'asia', 6500, 14, '🇧🇩', '[{"nome":"Certificato di morte tradotto","obbligatorio":true,"ordine":1},{"nome":"Nulla osta ambasciata","obbligatorio":true,"ordine":2},{"nome":"Cassa zinco IATA","obbligatorio":true,"ordine":3},{"nome":"Certificato imbalsamazione","obbligatorio":true,"ordine":4}]'),
  ('Nigeria', 'NG', 'africa_subsahariana', 5500, 12, '🇳🇬', '[{"nome":"Certificato di morte tradotto","obbligatorio":true,"ordine":1},{"nome":"Nulla osta ambasciata nigeriana","obbligatorio":true,"ordine":2},{"nome":"Cassa zinco IATA","obbligatorio":true,"ordine":3},{"nome":"Certificato imbalsamazione","obbligatorio":true,"ordine":4}]'),
  ('Senegal', 'SN', 'africa_subsahariana', 5000, 10, '🇸🇳', '[{"nome":"Certificato di morte tradotto","obbligatorio":true,"ordine":1},{"nome":"Nulla osta consolato","obbligatorio":true,"ordine":2},{"nome":"Cassa zinco IATA","obbligatorio":true,"ordine":3},{"nome":"Certificato imbalsamazione","obbligatorio":true,"ordine":4}]'),
  ('Filippine', 'PH', 'asia', 7000, 14, '🇵🇭', '[{"nome":"Certificato di morte tradotto","obbligatorio":true,"ordine":1},{"nome":"Nulla osta ambasciata","obbligatorio":true,"ordine":2},{"nome":"Cassa zinco IATA","obbligatorio":true,"ordine":3},{"nome":"Certificato imbalsamazione","obbligatorio":true,"ordine":4}]');

-- Prezzi servizi extra
INSERT INTO rimpatri_prezzi (zona, tipo, nome_servizio, prezzo, obbligatorio_per_zona) VALUES
  (null, 'tanatoprassi', 'Trattamento conservativo (tanatoprassi)', 500, false),
  (null, 'traduzione', 'Traduzione e legalizzazione documenti', 300, false),
  (null, 'accompagnamento', 'Accompagnamento familiare in aeroporto', 200, false),
  (null, 'cerimonia', 'Cerimonia pre-partenza', 400, false),
  (null, 'cassa_zinco', 'Cassa zinco IATA per trasporto aereo', 800, false),
  (null, 'assicurazione', 'Assicurazione trasporto salma', 150, false),
  ('americhe', 'cassa_zinco', 'Cassa zinco IATA (obbligatoria)', 800, true),
  ('asia', 'cassa_zinco', 'Cassa zinco IATA (obbligatoria)', 800, true),
  ('africa_subsahariana', 'cassa_zinco', 'Cassa zinco IATA (obbligatoria)', 800, true);

-- RLS
ALTER TABLE rimpatri_clienti ENABLE ROW LEVEL SECURITY;
ALTER TABLE rimpatri_paesi ENABLE ROW LEVEL SECURITY;
ALTER TABLE rimpatri_consolati ENABLE ROW LEVEL SECURITY;
ALTER TABLE rimpatri_partner ENABLE ROW LEVEL SECURITY;
ALTER TABLE rimpatri_prezzi ENABLE ROW LEVEL SECURITY;
ALTER TABLE rimpatri_pratiche ENABLE ROW LEVEL SECURITY;
ALTER TABLE rimpatri_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE rimpatri_documenti_template ENABLE ROW LEVEL SECURITY;
ALTER TABLE rimpatri_contenuti_seo ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Paesi rimpatri visibili a tutti" ON rimpatri_paesi FOR SELECT USING (attivo = true);
CREATE POLICY "Consolati rimpatri visibili a tutti" ON rimpatri_consolati FOR SELECT USING (attivo = true);
CREATE POLICY "Prezzi rimpatri visibili a tutti" ON rimpatri_prezzi FOR SELECT USING (attivo = true);
CREATE POLICY "Contenuti SEO rimpatri pubblicati" ON rimpatri_contenuti_seo FOR SELECT USING (pubblicato = true);
