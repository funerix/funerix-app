-- ============================================
-- FUNERIX — Nuovi Servizi
-- Previdenza Pet, Servizi Ricorrenti, Successione, Piano Protezione
-- ============================================

-- 1. Servizi Ricorrenti (fiori, manutenzione tomba, pulizia)
CREATE TABLE IF NOT EXISTS servizi_ricorrenti (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  slug TEXT UNIQUE,
  descrizione TEXT,
  categoria TEXT NOT NULL CHECK (categoria IN ('fiori', 'manutenzione', 'pulizia', 'visita', 'altro')),
  frequenza TEXT NOT NULL CHECK (frequenza IN ('settimanale', 'quindicinale', 'mensile', 'trimestrale', 'annuale', 'una_tantum')),
  prezzo DECIMAL(10,2) NOT NULL,
  prezzo_annuale DECIMAL(10,2), -- prezzo con sconto annuale
  foto TEXT,
  attivo BOOLEAN DEFAULT true,
  ordine INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Abbonamenti Ricorrenti (clienti che hanno sottoscritto)
CREATE TABLE IF NOT EXISTS abbonamenti_ricorrenti (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  servizio_id UUID REFERENCES servizi_ricorrenti(id),
  cliente_nome TEXT NOT NULL,
  cliente_telefono TEXT NOT NULL,
  cliente_email TEXT NOT NULL,
  defunto_nome TEXT, -- a chi e' dedicato
  cimitero TEXT,
  zona_tomba TEXT, -- settore, fila, numero
  frequenza TEXT NOT NULL,
  prezzo DECIMAL(10,2) NOT NULL,
  stato TEXT DEFAULT 'attivo' CHECK (stato IN ('attivo', 'sospeso', 'annullato')),
  data_inizio DATE DEFAULT CURRENT_DATE,
  prossima_esecuzione DATE,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Successione Ereditaria
CREATE TABLE IF NOT EXISTS pratiche_successione (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_nome TEXT NOT NULL,
  cliente_telefono TEXT NOT NULL,
  cliente_email TEXT NOT NULL,
  defunto_nome TEXT NOT NULL,
  defunto_data_decesso DATE,
  tipo_pratica TEXT DEFAULT 'standard' CHECK (tipo_pratica IN ('standard', 'complessa', 'con_immobili')),
  stato TEXT DEFAULT 'richiesta' CHECK (stato IN ('richiesta', 'in_lavorazione', 'documenti', 'presso_notaio', 'completata', 'annullata')),
  totale DECIMAL(10,2),
  pagato BOOLEAN DEFAULT false,
  documenti JSONB DEFAULT '[]',
  note_interne TEXT,
  consulente_id UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- DATI INIZIALI
-- ============================================

-- Servizi Ricorrenti
INSERT INTO servizi_ricorrenti (nome, slug, descrizione, categoria, frequenza, prezzo, prezzo_annuale, ordine) VALUES
  ('Fiori Freschi Settimanali', 'fiori-settimanali', 'Composizione di fiori freschi di stagione depositata sulla tomba ogni settimana.', 'fiori', 'settimanale', 25, 1100, 1),
  ('Fiori Freschi Quindicinali', 'fiori-quindicinali', 'Composizione di fiori freschi depositata ogni due settimane.', 'fiori', 'quindicinale', 25, 600, 2),
  ('Fiori Freschi Mensili', 'fiori-mensili', 'Composizione di fiori freschi depositata una volta al mese.', 'fiori', 'mensile', 30, 320, 3),
  ('Fiori per Ricorrenze', 'fiori-ricorrenze', 'Composizione speciale per anniversari, festivita e commemorazioni.', 'fiori', 'annuale', 45, null, 4),
  ('Pulizia Tomba Mensile', 'pulizia-mensile', 'Pulizia completa della tomba/loculo: lavaggio, lucidatura lapide, rimozione foglie.', 'pulizia', 'mensile', 35, 380, 5),
  ('Pulizia Tomba Trimestrale', 'pulizia-trimestrale', 'Pulizia completa della tomba ogni 3 mesi.', 'pulizia', 'trimestrale', 40, 140, 6),
  ('Manutenzione Monumento', 'manutenzione-monumento', 'Manutenzione annuale del monumento funebre: restauro scritte, lucidatura marmo, verifica strutturale.', 'manutenzione', 'annuale', 150, null, 7),
  ('Pacchetto Completo', 'pacchetto-completo', 'Fiori freschi mensili + pulizia mensile + manutenzione annuale. Il pacchetto piu scelto.', 'altro', 'mensile', 55, 600, 8),
  ('Visita e Foto', 'visita-foto', 'Un operatore visita la tomba, scatta foto e ve le invia su WhatsApp. Per chi vive lontano.', 'visita', 'mensile', 20, 200, 9);

-- Prezzi successione ereditaria
-- (gestiti come testo statico nella pagina, non serve tabella prezzi dedicata)

-- RLS
ALTER TABLE servizi_ricorrenti ENABLE ROW LEVEL SECURITY;
ALTER TABLE abbonamenti_ricorrenti ENABLE ROW LEVEL SECURITY;
ALTER TABLE pratiche_successione ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Servizi ricorrenti visibili a tutti" ON servizi_ricorrenti FOR SELECT USING (attivo = true);
