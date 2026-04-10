-- ============================================
-- FUNERIX PET — Tabelle Supabase
-- Eseguire su Supabase SQL Editor
-- ============================================

-- 1. Clienti Pet
CREATE TABLE IF NOT EXISTS pet_clienti (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  cognome TEXT,
  telefono TEXT NOT NULL,
  email TEXT NOT NULL,
  indirizzo TEXT,
  citta TEXT,
  cap TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Prodotti Pet (urne, cofanetti, accessori)
CREATE TABLE IF NOT EXISTS pet_prodotti (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  categoria TEXT NOT NULL CHECK (categoria IN ('urna', 'cofanetto', 'impronta', 'accessorio')),
  materiale TEXT,
  descrizione TEXT,
  prezzo DECIMAL(10,2) NOT NULL,
  foto TEXT[] DEFAULT '{}',
  disponibile BOOLEAN DEFAULT true,
  ordine_visualizzazione INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Prezzi Pet (per specie/taglia/tipo)
CREATE TABLE IF NOT EXISTS pet_prezzi (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  specie TEXT NOT NULL,
  taglia TEXT NOT NULL CHECK (taglia IN ('piccolo', 'medio', 'grande')),
  tipo_cremazione TEXT NOT NULL CHECK (tipo_cremazione IN ('individuale', 'collettiva')),
  prezzo DECIMAL(10,2) NOT NULL,
  ritiro_domicilio_prezzo DECIMAL(10,2) DEFAULT 0,
  impronta_zampa_prezzo DECIMAL(10,2) DEFAULT 0,
  attivo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Veterinari Partner
CREATE TABLE IF NOT EXISTS veterinari_partner (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome_studio TEXT NOT NULL,
  nome_veterinario TEXT NOT NULL,
  indirizzo TEXT,
  citta TEXT,
  provincia TEXT,
  cap TEXT,
  telefono TEXT,
  email TEXT NOT NULL,
  sito_web TEXT,
  commissione_percentuale DECIMAL(5,2) DEFAULT 10,
  codice_convenzione TEXT UNIQUE,
  password_hash TEXT,
  ordini_totali INTEGER DEFAULT 0,
  commissioni_maturate DECIMAL(10,2) DEFAULT 0,
  commissioni_pagate DECIMAL(10,2) DEFAULT 0,
  attivo BOOLEAN DEFAULT true,
  latitudine DECIMAL(10,7),
  longitudine DECIMAL(10,7),
  ultimo_accesso TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Ordini Pet
CREATE TABLE IF NOT EXISTS pet_ordini (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_cliente_id UUID REFERENCES pet_clienti(id),
  animale_nome TEXT NOT NULL,
  specie TEXT NOT NULL,
  specie_altro TEXT,
  razza TEXT,
  peso_kg DECIMAL(5,2),
  taglia TEXT NOT NULL CHECK (taglia IN ('piccolo', 'medio', 'grande')),
  foto_animale TEXT,
  tipo_cremazione TEXT NOT NULL CHECK (tipo_cremazione IN ('individuale', 'collettiva')),
  urna_id UUID REFERENCES pet_prodotti(id),
  impronta_zampa BOOLEAN DEFAULT false,
  ritiro_tipo TEXT NOT NULL CHECK (ritiro_tipo IN ('domicilio', 'struttura', 'veterinario')),
  ritiro_indirizzo TEXT,
  ritiro_data DATE,
  veterinario_id UUID REFERENCES veterinari_partner(id),
  codice_convenzione TEXT,
  stato TEXT NOT NULL DEFAULT 'ricevuto' CHECK (stato IN ('ricevuto', 'confermato', 'ritirato', 'in_cremazione', 'ceneri_pronte', 'consegnato', 'annullato')),
  data_ritiro_effettivo TIMESTAMPTZ,
  data_cremazione TIMESTAMPTZ,
  data_ceneri_pronte TIMESTAMPTZ,
  data_consegna TIMESTAMPTZ,
  certificato_numero TEXT,
  certificato_url TEXT,
  totale DECIMAL(10,2) NOT NULL,
  pagato BOOLEAN DEFAULT false,
  metodo_pagamento TEXT,
  stripe_payment_id TEXT,
  token_accesso UUID DEFAULT gen_random_uuid(),
  note_cliente TEXT,
  note_interne TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Pet Memorial
CREATE TABLE IF NOT EXISTS pet_memorial (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ordine_id UUID REFERENCES pet_ordini(id),
  cliente_id UUID REFERENCES pet_clienti(id),
  animale_nome TEXT NOT NULL,
  specie TEXT,
  razza TEXT,
  foto_profilo TEXT,
  foto_gallery TEXT[] DEFAULT '{}',
  data_nascita DATE,
  data_morte DATE,
  biografia TEXT,
  candele_accese INTEGER DEFAULT 0,
  pubblicato BOOLEAN DEFAULT false,
  approvato BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Messaggi Memorial Pet
CREATE TABLE IF NOT EXISTS pet_memorial_messaggi (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  memorial_id UUID REFERENCES pet_memorial(id) ON DELETE CASCADE,
  autore_nome TEXT NOT NULL,
  messaggio TEXT NOT NULL,
  approvato BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Commissioni Veterinari
CREATE TABLE IF NOT EXISTS pet_commissioni (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  veterinario_id UUID REFERENCES veterinari_partner(id),
  ordine_id UUID REFERENCES pet_ordini(id),
  importo DECIMAL(10,2) NOT NULL,
  percentuale DECIMAL(5,2) NOT NULL,
  stato TEXT DEFAULT 'maturata' CHECK (stato IN ('maturata', 'approvata', 'pagata')),
  data_maturazione TIMESTAMPTZ DEFAULT now(),
  data_pagamento TIMESTAMPTZ,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. Contenuti Pet (testi editabili da admin)
CREATE TABLE IF NOT EXISTS pet_contenuti (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sezione TEXT NOT NULL UNIQUE,
  titolo TEXT,
  sottotitolo TEXT,
  contenuto_json JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 10. Recensioni Pet
CREATE TABLE IF NOT EXISTS pet_recensioni (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ordine_id UUID REFERENCES pet_ordini(id),
  cliente_nome TEXT,
  voto INTEGER CHECK (voto >= 1 AND voto <= 5),
  testo TEXT,
  risposta_admin TEXT,
  approvata BOOLEAN DEFAULT false,
  pubblicata BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- DATI INIZIALI
-- ============================================

-- Prezzi iniziali per specie/taglia
INSERT INTO pet_prezzi (specie, taglia, tipo_cremazione, prezzo, ritiro_domicilio_prezzo, impronta_zampa_prezzo) VALUES
  ('cane', 'piccolo', 'individuale', 150, 60, 40),
  ('cane', 'piccolo', 'collettiva', 50, 60, 0),
  ('cane', 'medio', 'individuale', 250, 60, 40),
  ('cane', 'medio', 'collettiva', 70, 60, 0),
  ('cane', 'grande', 'individuale', 380, 60, 40),
  ('cane', 'grande', 'collettiva', 100, 60, 0),
  ('gatto', 'piccolo', 'individuale', 120, 60, 40),
  ('gatto', 'piccolo', 'collettiva', 50, 60, 0),
  ('coniglio', 'piccolo', 'individuale', 100, 60, 30),
  ('coniglio', 'piccolo', 'collettiva', 40, 60, 0),
  ('uccello', 'piccolo', 'individuale', 80, 60, 0),
  ('uccello', 'piccolo', 'collettiva', 30, 60, 0),
  ('rettile', 'piccolo', 'individuale', 80, 60, 0),
  ('rettile', 'piccolo', 'collettiva', 30, 60, 0),
  ('altro', 'piccolo', 'individuale', 100, 60, 30),
  ('altro', 'piccolo', 'collettiva', 40, 60, 0),
  ('altro', 'medio', 'individuale', 200, 60, 40),
  ('altro', 'medio', 'collettiva', 60, 60, 0),
  ('altro', 'grande', 'individuale', 350, 60, 40),
  ('altro', 'grande', 'collettiva', 90, 60, 0);

-- Prodotti pet iniziali (urne)
INSERT INTO pet_prodotti (nome, categoria, materiale, descrizione, prezzo, disponibile, ordine_visualizzazione) VALUES
  ('Urna Standard', 'urna', 'ceramica', 'Urna in ceramica semplice con coperchio.', 30, true, 1),
  ('Urna Elegance', 'urna', 'legno', 'Urna in legno di noce con incisione nome.', 80, true, 2),
  ('Urna Prestige', 'urna', 'marmo', 'Urna in marmo bianco di Carrara con placca.', 150, true, 3),
  ('Urna Natura', 'urna', 'biodegradabile', 'Urna biodegradabile per dispersione in natura.', 45, true, 4),
  ('Cofanetto Ricordo', 'cofanetto', 'legno', 'Cofanetto in legno per ceneri con cornice foto.', 60, true, 5),
  ('Impronta Zampa Ceramica', 'impronta', 'ceramica', 'Calco della zampa in ceramica dipinta a mano.', 40, true, 6),
  ('Impronta Zampa Argilla', 'impronta', 'argilla', 'Calco della zampa in argilla naturale.', 30, true, 7),
  ('Ciondolo Ceneri', 'accessorio', 'argento', 'Ciondolo in argento 925 per conservare una piccola parte di ceneri.', 65, true, 8),
  ('Cornice Memorial', 'accessorio', 'legno', 'Cornice con spazio per foto e targhetta nome.', 35, true, 9);

-- Contenuti iniziali pet
INSERT INTO pet_contenuti (sezione, titolo, sottotitolo, contenuto_json) VALUES
  ('hero', 'Cremazione Animali Domestici', 'Un ultimo saluto dignitoso per il vostro compagno di vita.', '{"cta_testo": "Configura Cremazione", "cta_link": "/pet/configuratore"}'),
  ('servizi', 'I nostri servizi', 'Sappiamo quanto sia doloroso perdere un compagno di vita.', '{}'),
  ('processo', 'Come funziona', null, '{"steps": [{"n": "01", "titolo": "Configurate", "desc": "Scegliete tipo di cremazione, urna e servizi."}, {"n": "02", "titolo": "Ritiriamo", "desc": "A domicilio o presso il veterinario."}, {"n": "03", "titolo": "Cremiamo", "desc": "Cremazione con certificato e restituzione ceneri."}, {"n": "04", "titolo": "Ricordate", "desc": "Create un memorial digitale."}]}'),
  ('faq', 'Domande Frequenti', null, '{"items": []}'),
  ('testimonianze', 'Cosa dicono i nostri clienti', null, '{"items": []}');

-- ============================================
-- RLS Policies (Row Level Security)
-- ============================================

-- Abilita RLS
ALTER TABLE pet_clienti ENABLE ROW LEVEL SECURITY;
ALTER TABLE pet_prodotti ENABLE ROW LEVEL SECURITY;
ALTER TABLE pet_prezzi ENABLE ROW LEVEL SECURITY;
ALTER TABLE veterinari_partner ENABLE ROW LEVEL SECURITY;
ALTER TABLE pet_ordini ENABLE ROW LEVEL SECURITY;
ALTER TABLE pet_memorial ENABLE ROW LEVEL SECURITY;
ALTER TABLE pet_memorial_messaggi ENABLE ROW LEVEL SECURITY;
ALTER TABLE pet_commissioni ENABLE ROW LEVEL SECURITY;
ALTER TABLE pet_contenuti ENABLE ROW LEVEL SECURITY;
ALTER TABLE pet_recensioni ENABLE ROW LEVEL SECURITY;

-- Policy: lettura pubblica per prodotti, prezzi, contenuti, memorial pubblicati, recensioni approvate
CREATE POLICY "Prodotti pet visibili a tutti" ON pet_prodotti FOR SELECT USING (disponibile = true);
CREATE POLICY "Prezzi pet visibili a tutti" ON pet_prezzi FOR SELECT USING (attivo = true);
CREATE POLICY "Contenuti pet visibili a tutti" ON pet_contenuti FOR SELECT USING (true);
CREATE POLICY "Memorial pet pubblici" ON pet_memorial FOR SELECT USING (pubblicato = true AND approvato = true);
CREATE POLICY "Messaggi memorial pet approvati" ON pet_memorial_messaggi FOR SELECT USING (approvato = true);
CREATE POLICY "Recensioni pet pubblicate" ON pet_recensioni FOR SELECT USING (pubblicata = true);
CREATE POLICY "Veterinari attivi visibili" ON veterinari_partner FOR SELECT USING (attivo = true);

-- Policy: servizio role (per API server-side) - accesso completo
-- NOTA: le API usano supabase service_role key, quindi bypassa RLS.
-- Queste policy sono per il client-side (anon key).

-- Policy: inserimento messaggi memorial da visitatori
CREATE POLICY "Visitatori possono lasciare messaggi" ON pet_memorial_messaggi FOR INSERT WITH CHECK (true);

-- Policy: inserimento recensioni da clienti
CREATE POLICY "Clienti possono lasciare recensioni" ON pet_recensioni FOR INSERT WITH CHECK (true);
