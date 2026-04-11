-- Tabella cache traduzioni
-- Creata: 2026-04-11

CREATE TABLE IF NOT EXISTS traduzioni (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lingua TEXT NOT NULL,
  originale TEXT NOT NULL,
  traduzione TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(lingua, originale)
);

CREATE INDEX IF NOT EXISTS idx_traduzioni_lingua ON traduzioni(lingua);

ALTER TABLE traduzioni ENABLE ROW LEVEL SECURITY;

-- Lettura pubblica (il frontend carica le traduzioni)
DROP POLICY IF EXISTS traduzioni_read ON traduzioni;
CREATE POLICY traduzioni_read ON traduzioni FOR SELECT USING (true);

-- Scrittura completa (service_role per API)
DROP POLICY IF EXISTS traduzioni_write ON traduzioni;
CREATE POLICY traduzioni_write ON traduzioni FOR ALL USING (true) WITH CHECK (true);
