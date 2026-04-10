-- ============================================
-- PIANO PROTEZIONE + PREVIDENZA PET + SERVIZI EXTRA
-- ============================================

-- 1. Piano Protezione (opzione aggiuntiva sui piani previdenza)
-- Non e' una tabella separata: e' un flag boolean sul piano previdenza
ALTER TABLE piani_previdenza ADD COLUMN IF NOT EXISTS protezione_attiva BOOLEAN DEFAULT false;
ALTER TABLE piani_previdenza ADD COLUMN IF NOT EXISTS protezione_costo_extra DECIMAL(10,2) DEFAULT 0;
-- Se protezione_attiva = true e il beneficiario muore prima di completare le rate,
-- Funerix eroga comunque il servizio completo. Il costo extra e' un sovrapprezzo mensile.

-- 2. Previdenza Pet (piani prepagati per cremazione animali)
CREATE TABLE IF NOT EXISTS piani_pet (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_nome TEXT NOT NULL,
  cliente_telefono TEXT NOT NULL,
  cliente_email TEXT NOT NULL,
  animale_nome TEXT,
  specie TEXT,
  taglia TEXT,
  tipo_cremazione TEXT DEFAULT 'individuale',
  urna_id UUID,
  totale DECIMAL(10,2) NOT NULL,
  num_rate INTEGER NOT NULL DEFAULT 12,
  importo_rata DECIMAL(10,2) NOT NULL,
  rate_pagate INTEGER DEFAULT 0,
  saldo_versato DECIMAL(10,2) DEFAULT 0,
  saldo_residuo DECIMAL(10,2) NOT NULL,
  stato TEXT DEFAULT 'attivo' CHECK (stato IN ('attivo', 'sospeso', 'completato', 'utilizzato', 'annullato')),
  veterinario_id UUID,
  codice_convenzione TEXT,
  data_attivazione DATE DEFAULT CURRENT_DATE,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Servizi Extra standalone
CREATE TABLE IF NOT EXISTS servizi_extra (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  slug TEXT UNIQUE,
  categoria TEXT NOT NULL CHECK (categoria IN ('disbrigo_pratiche', 'trasporto', 'video_tributo', 'stampa_ricordo', 'altro')),
  descrizione TEXT,
  prezzo_min DECIMAL(10,2),
  prezzo_max DECIMAL(10,2),
  dettagli JSONB DEFAULT '{}',
  attivo BOOLEAN DEFAULT true,
  ordine INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Richieste servizi extra (quando un cliente chiede un servizio)
CREATE TABLE IF NOT EXISTS richieste_servizi_extra (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  servizio_id UUID REFERENCES servizi_extra(id),
  cliente_nome TEXT NOT NULL,
  cliente_telefono TEXT NOT NULL,
  cliente_email TEXT,
  dettagli_richiesta TEXT,
  stato TEXT DEFAULT 'richiesta' CHECK (stato IN ('richiesta', 'in_lavorazione', 'completata', 'annullata')),
  totale DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- DATI INIZIALI
-- ============================================

-- Servizi Extra
INSERT INTO servizi_extra (nome, slug, categoria, descrizione, prezzo_min, prezzo_max, dettagli, ordine) VALUES
  ('Disbrigo Pratiche Burocratiche', 'disbrigo-pratiche', 'disbrigo_pratiche', 'Gestione completa di certificati, volture, pensione di reversibilita, chiusura conti. Servizio dedicato per sollevarvi da ogni incombenza burocratica.', 150, 500, '{"include": ["Certificato di morte", "Voltura utenze", "Pensione reversibilita", "Chiusura conti bancari", "Comunicazioni INPS/INAIL", "Assicurazioni vita"]}', 1),
  ('Trasporto e Accompagnamento', 'trasporto-accompagnamento', 'trasporto', 'Servizio navetta per anziani e familiari per visitare il cimitero. Ideale per chi non guida o vive lontano. Accompagnamento rispettoso.', 30, 80, '{"include": ["Ritiro a domicilio", "Accompagnamento al cimitero", "Attesa durante la visita", "Rientro a domicilio"], "nota": "Prezzo per singola visita, sconti per abbonamento mensile"}', 2),
  ('Video Tributo Commemorativo', 'video-tributo', 'video_tributo', 'Video professionale con foto, musica e testi. Condivisibile online, proiettabile durante la cerimonia. Un ricordo eterno per il vostro caro.', 150, 500, '{"include": ["Raccolta foto e video familiari", "Montaggio professionale", "Musica personalizzata", "Testi e dediche", "Formato HD condivisibile", "Link permanente online"], "durata": "3-5 minuti"}', 3),
  ('Stampa Ricordo Personalizzata', 'stampa-ricordo', 'stampa_ricordo', 'Bigliettini, segnalibri, foto ricordo e santini personalizzati con foto e dedica. Stampati su carta pregiata.', 50, 200, '{"prodotti": [{"nome": "Santini ricordo (100 pz)", "prezzo": "80-120"}, {"nome": "Segnalibri (50 pz)", "prezzo": "60-100"}, {"nome": "Biglietti ringraziamento (50 pz)", "prezzo": "50-80"}, {"nome": "Poster commemorativo", "prezzo": "30-60"}, {"nome": "Album foto ricordo", "prezzo": "100-200"}]}', 4),
  ('Cerimonia Laica Personalizzata', 'cerimonia-laica', 'altro', 'Organizzazione completa di cerimonia laica con celebrante, musica dal vivo, letture personalizzate. Per chi desidera un saluto non religioso ma altrettanto significativo.', 300, 800, '{"include": ["Celebrante professionista", "Copione personalizzato", "Musica dal vivo o registrata", "Letture e poesie", "Coordinamento logistico"]}', 5),
  ('Consulenza Pre-Need', 'consulenza-pre-need', 'altro', 'Consulenza gratuita e senza impegno per pianificare in anticipo il proprio funerale o quello di un familiare. Un consulente dedicato vi guidera nelle scelte.', 0, 0, '{"nota": "Servizio gratuito, senza impegno"}', 6);

-- RLS
ALTER TABLE piani_pet ENABLE ROW LEVEL SECURITY;
ALTER TABLE servizi_extra ENABLE ROW LEVEL SECURITY;
ALTER TABLE richieste_servizi_extra ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Servizi extra visibili" ON servizi_extra FOR SELECT USING (attivo = true);
