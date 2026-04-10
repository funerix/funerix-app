-- ============================================
-- FUNERIX COMPARATORE PREZZI — Database completo
-- Prezzi funebri Italia (20 regioni), Europa (15 paesi), Mondo (8 paesi)
-- Prezzi per servizio, cremazione animali, rimpatrio
-- ============================================

-- 1. Prezzi per area geografica (regioni Italia, paesi Europa/Mondo)
CREATE TABLE IF NOT EXISTS prezzi_aree (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo TEXT NOT NULL CHECK (tipo IN ('regione', 'provincia', 'citta', 'paese_eu', 'paese_mondo')),
  nome TEXT NOT NULL,
  codice TEXT, -- codice regione/ISO
  nazione TEXT DEFAULT 'Italia',
  zona TEXT, -- nord/centro/sud per Italia, continente per mondo
  funerale_base_min DECIMAL(10,2),
  funerale_base_max DECIMAL(10,2),
  funerale_standard_min DECIMAL(10,2),
  funerale_standard_max DECIMAL(10,2),
  cremazione_min DECIMAL(10,2),
  cremazione_max DECIMAL(10,2),
  tumulazione_min DECIMAL(10,2),
  tumulazione_max DECIMAL(10,2),
  premium_min DECIMAL(10,2),
  premium_max DECIMAL(10,2),
  valuta TEXT DEFAULT 'EUR',
  note TEXT,
  fonte TEXT,
  anno_riferimento INTEGER DEFAULT 2025,
  attivo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Prezzi per singolo servizio/voce
CREATE TABLE IF NOT EXISTS prezzi_servizi (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  categoria TEXT NOT NULL, -- cofano, trasporto, fiori, cerimonia, urna, burocrazia, extra
  nome TEXT NOT NULL,
  fascia TEXT NOT NULL CHECK (fascia IN ('economico', 'standard', 'premium')),
  prezzo_min DECIMAL(10,2) NOT NULL,
  prezzo_max DECIMAL(10,2) NOT NULL,
  unita TEXT, -- 'pezzo', 'al_km', 'al_giorno', 'a_persona'
  note TEXT,
  ordine INTEGER DEFAULT 0,
  attivo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- DATI: ITALIA — 20 REGIONI
-- ============================================

INSERT INTO prezzi_aree (tipo, nome, codice, nazione, zona, funerale_base_min, funerale_base_max, funerale_standard_min, funerale_standard_max, cremazione_min, cremazione_max, tumulazione_min, tumulazione_max, premium_min, premium_max, fonte) VALUES
('regione', 'Lombardia', 'LOM', 'Italia', 'nord', 1400, 1600, 3000, 4000, 2000, 2800, 4000, 5500, 5000, 8000, 'Federconsumatori/miofunerale.it'),
('regione', 'Piemonte', 'PIE', 'Italia', 'nord', 1000, 1500, 2000, 3000, 1800, 2500, 3500, 5000, 4500, 7000, 'Federconsumatori'),
('regione', 'Veneto', 'VEN', 'Italia', 'nord', 1400, 1600, 2500, 3500, 1800, 2500, 3800, 5000, 4500, 7500, 'Federconsumatori'),
('regione', 'Emilia-Romagna', 'EMR', 'Italia', 'nord', 1400, 1600, 2500, 3500, 1800, 2500, 3800, 5000, 4500, 7500, 'Federconsumatori'),
('regione', 'Toscana', 'TOS', 'Italia', 'centro', 1300, 1600, 2500, 3500, 1800, 2500, 3500, 4800, 4500, 7500, 'Federconsumatori'),
('regione', 'Lazio', 'LAZ', 'Italia', 'centro', 950, 1500, 2500, 3500, 1800, 2500, 3500, 5000, 4000, 8000, 'Funus.it/Federconsumatori'),
('regione', 'Campania', 'CAM', 'Italia', 'sud', 1000, 1500, 2000, 3000, 1500, 2200, 3000, 4500, 4000, 7000, 'Federconsumatori'),
('regione', 'Puglia', 'PUG', 'Italia', 'sud', 1500, 1800, 3000, 4000, 1800, 2500, 3500, 5000, 5000, 8000, 'Federconsumatori'),
('regione', 'Sicilia', 'SIC', 'Italia', 'sud', 1200, 1500, 2000, 3000, 1500, 2200, 3000, 4500, 4000, 7000, 'Federconsumatori'),
('regione', 'Sardegna', 'SAR', 'Italia', 'sud', 1500, 1800, 2500, 3500, 1800, 2500, 3500, 5000, 4500, 7500, 'Federconsumatori'),
('regione', 'Liguria', 'LIG', 'Italia', 'nord', 1300, 1600, 2000, 3000, 1800, 2500, 3500, 4800, 4000, 7000, 'Federconsumatori'),
('regione', 'Friuli Venezia Giulia', 'FVG', 'Italia', 'nord', 1200, 1500, 2000, 3000, 1800, 2500, 3500, 4800, 4000, 7000, 'Federconsumatori'),
('regione', 'Trentino-Alto Adige', 'TAA', 'Italia', 'nord', 1500, 1800, 2500, 3500, 2000, 2800, 4000, 5500, 5000, 8500, 'Stima costo vita'),
('regione', 'Marche', 'MAR', 'Italia', 'centro', 1300, 1600, 2300, 3200, 1700, 2400, 3200, 4500, 4000, 7000, 'Federconsumatori'),
('regione', 'Abruzzo', 'ABR', 'Italia', 'centro', 1300, 1600, 2500, 3500, 1700, 2400, 3200, 4500, 4000, 7000, 'Federconsumatori'),
('regione', 'Umbria', 'UMB', 'Italia', 'centro', 1300, 1600, 2000, 3000, 1700, 2400, 3200, 4500, 4000, 6500, 'Federconsumatori'),
('regione', 'Calabria', 'CAL', 'Italia', 'sud', 1500, 1800, 3000, 4000, 1800, 2500, 3500, 5000, 5000, 8000, 'Federconsumatori'),
('regione', 'Basilicata', 'BAS', 'Italia', 'sud', 1500, 1800, 3000, 4000, 1800, 2500, 3500, 5000, 5000, 7500, 'Federconsumatori'),
('regione', 'Molise', 'MOL', 'Italia', 'sud', 1200, 1500, 2000, 3000, 1500, 2200, 3000, 4200, 3500, 6500, 'Stima'),
('regione', 'Valle d''Aosta', 'VDA', 'Italia', 'nord', 1800, 2200, 4500, 5500, 2500, 3200, 5000, 6500, 6000, 10000, 'Stima costo vita');

-- ============================================
-- DATI: EUROPA — 15 PAESI
-- ============================================

INSERT INTO prezzi_aree (tipo, nome, codice, nazione, zona, funerale_base_min, funerale_base_max, funerale_standard_min, funerale_standard_max, cremazione_min, cremazione_max, tumulazione_min, tumulazione_max, premium_min, premium_max, fonte) VALUES
('paese_eu', 'Regno Unito', 'GB', 'Regno Unito', 'europa', 3500, 4500, 5000, 6500, 3000, 4500, 5500, 8000, 7000, 12000, 'SunLife Cost of Dying'),
('paese_eu', 'Francia', 'FR', 'Francia', 'europa', 3000, 3800, 4000, 5000, 2500, 4000, 4500, 6000, 5000, 8000, 'Connexion France'),
('paese_eu', 'Germania', 'DE', 'Germania', 'europa', 5000, 7000, 7000, 10000, 4000, 6000, 8000, 13000, 10000, 20000, 'Meolea/lovemoney'),
('paese_eu', 'Spagna', 'ES', 'Spagna', 'europa', 2500, 3000, 3000, 4000, 2000, 3500, 3500, 4500, 4000, 7000, 'lovemoney.com'),
('paese_eu', 'Olanda', 'NL', 'Olanda', 'europa', 6000, 8000, 8000, 10000, 5000, 7000, 9000, 12000, 10000, 14000, 'NL Times'),
('paese_eu', 'Belgio', 'BE', 'Belgio', 'europa', 4000, 4500, 4500, 5500, 3500, 5000, 5000, 7000, 6000, 10000, 'Meolea'),
('paese_eu', 'Svizzera', 'CH', 'Svizzera', 'europa', 4200, 5500, 5500, 7000, 4000, 6000, 6000, 8500, 7000, 12000, 'Stima'),
('paese_eu', 'Austria', 'AT', 'Austria', 'europa', 3000, 3500, 3500, 4500, 2500, 3800, 4000, 6000, 5000, 8000, 'lovemoney'),
('paese_eu', 'Portogallo', 'PT', 'Portogallo', 'europa', 2000, 2800, 2800, 3500, 1800, 3000, 3000, 4500, 3500, 6000, 'Stima'),
('paese_eu', 'Grecia', 'GR', 'Grecia', 'europa', 1500, 2200, 2200, 3000, 1500, 2500, 2500, 4000, 3000, 5000, 'Stima'),
('paese_eu', 'Polonia', 'PL', 'Polonia', 'europa', 400, 600, 600, 1000, 350, 700, 700, 1500, 1000, 2500, 'Meolea'),
('paese_eu', 'Romania', 'RO', 'Romania', 'europa', 300, 500, 500, 800, 300, 600, 500, 1200, 800, 2000, 'Stima'),
('paese_eu', 'Svezia', 'SE', 'Svezia', 'europa', 2000, 2800, 2800, 3500, 1800, 3000, 3000, 5000, 4000, 7000, 'SunLife'),
('paese_eu', 'Norvegia', 'NO', 'Norvegia', 'europa', 2500, 3000, 3000, 4000, 2200, 3500, 3500, 5000, 4000, 7000, 'SunLife'),
('paese_eu', 'Danimarca', 'DK', 'Danimarca', 'europa', 800, 1200, 1200, 2000, 700, 1500, 1500, 3000, 2000, 4000, 'SunLife');

-- ============================================
-- DATI: MONDO — 8 PAESI
-- ============================================

INSERT INTO prezzi_aree (tipo, nome, codice, nazione, zona, funerale_base_min, funerale_base_max, funerale_standard_min, funerale_standard_max, cremazione_min, cremazione_max, tumulazione_min, tumulazione_max, premium_min, premium_max, valuta, fonte) VALUES
('paese_mondo', 'Stati Uniti', 'US', 'Stati Uniti', 'americhe', 5500, 7000, 7000, 9000, 5500, 7500, 8000, 12000, 10000, 20000, 'USD', 'NFDA/finder.com'),
('paese_mondo', 'Canada', 'CA', 'Canada', 'americhe', 2500, 4000, 4000, 7000, 2000, 5000, 5000, 10000, 7000, 15000, 'CAD', 'Stima'),
('paese_mondo', 'Brasile', 'BR', 'Brasile', 'americhe', 200, 400, 400, 800, 200, 600, 400, 1200, 800, 2500, 'EUR', 'lovemoney'),
('paese_mondo', 'Australia', 'AU', 'Australia', 'oceania', 2500, 3500, 3500, 5000, 2000, 4000, 4000, 8000, 5000, 12000, 'AUD', 'SunLife'),
('paese_mondo', 'Giappone', 'JP', 'Giappone', 'asia', 5000, 8000, 8000, 15000, 4000, 7000, 10000, 25000, 15000, 40000, 'EUR', 'Statista'),
('paese_mondo', 'Cina', 'CN', 'Cina', 'asia', 2000, 4000, 4000, 7000, 1500, 3000, 5000, 15000, 7000, 20000, 'EUR', 'Stima'),
('paese_mondo', 'India', 'IN', 'India', 'asia', 50, 120, 120, 300, 50, 150, 200, 500, 300, 1000, 'EUR', 'Stima'),
('paese_mondo', 'Emirati Arabi', 'AE', 'Emirati Arabi', 'medio_oriente', 1500, 2500, 2500, 4000, 2000, 3500, 3000, 6000, 4000, 10000, 'EUR', 'Stima');

-- ============================================
-- DATI: PREZZI PER SERVIZIO
-- ============================================

INSERT INTO prezzi_servizi (categoria, nome, fascia, prezzo_min, prezzo_max, unita, ordine) VALUES
-- Cofano
('cofano', 'Cofano in abete/pioppo', 'economico', 350, 600, 'pezzo', 1),
('cofano', 'Cofano in abete rifinito', 'standard', 490, 960, 'pezzo', 2),
('cofano', 'Cofano in frassino/frake', 'standard', 840, 1600, 'pezzo', 3),
('cofano', 'Cofano in mogano', 'premium', 1500, 2000, 'pezzo', 4),
('cofano', 'Cofano in rovere/noce', 'premium', 1700, 2400, 'pezzo', 5),
('cofano', 'Cofano di lusso (rovere pregiato)', 'premium', 2500, 7000, 'pezzo', 6),
-- Trasporto
('trasporto', 'Trasporto locale (entro comune)', 'economico', 200, 400, 'pezzo', 1),
('trasporto', 'Trasporto fuori comune', 'standard', 400, 800, 'pezzo', 2),
('trasporto', 'Auto funebre Mercedes', 'standard', 290, 440, 'pezzo', 3),
('trasporto', 'Auto funebre limousine', 'premium', 710, 1240, 'pezzo', 4),
('trasporto', 'Costo al km (breve distanza)', 'economico', 0.90, 0.90, 'al_km', 5),
('trasporto', 'Costo al km (lunga distanza)', 'economico', 0.60, 0.70, 'al_km', 6),
-- Fiori
('fiori', 'Corona piccola (garofani)', 'economico', 120, 200, 'pezzo', 1),
('fiori', 'Cuscino classico', 'standard', 130, 160, 'pezzo', 2),
('fiori', 'Copricassa classico', 'standard', 177, 227, 'pezzo', 3),
('fiori', 'Copricassa extra', 'premium', 286, 326, 'pezzo', 4),
('fiori', 'Corona grande (fiori misti)', 'standard', 200, 300, 'pezzo', 5),
('fiori', 'Corona rose/fiori speciali', 'premium', 400, 500, 'pezzo', 6),
('fiori', 'Copricassa top', 'premium', 384, 500, 'pezzo', 7),
-- Cerimonia
('cerimonia', 'Vestizione salma', 'standard', 150, 250, 'pezzo', 1),
('cerimonia', 'Camera ardente', 'standard', 200, 500, 'al_giorno', 2),
('cerimonia', 'Tanatocosmesi', 'premium', 200, 800, 'pezzo', 3),
('cerimonia', 'Portatori (per persona)', 'standard', 87, 87, 'a_persona', 4),
('cerimonia', 'Maniglie lusso', 'premium', 185, 185, 'pezzo', 5),
-- Urna
('urna', 'Urna cineraria base', 'economico', 42, 90, 'pezzo', 1),
('urna', 'Urna cineraria media', 'standard', 90, 250, 'pezzo', 2),
('urna', 'Urna cineraria pregiata', 'premium', 250, 475, 'pezzo', 3),
-- Burocrazia
('burocrazia', 'Disbrigo pratiche burocratiche', 'standard', 150, 400, 'pezzo', 1),
('burocrazia', 'Necrologi giornale', 'standard', 150, 500, 'pezzo', 2),
('burocrazia', 'Concessione loculo (media)', 'standard', 800, 3000, 'pezzo', 3),
('burocrazia', 'Concessione campo terra', 'economico', 300, 1000, 'pezzo', 4),
-- Extra
('extra', 'Lapide', 'standard', 622, 1672, 'pezzo', 1),
('extra', 'Monumentino', 'premium', 950, 2390, 'pezzo', 2),
('extra', 'Frigo/conservazione', 'standard', 360, 360, 'al_giorno', 3);

-- RLS
ALTER TABLE prezzi_aree ENABLE ROW LEVEL SECURITY;
ALTER TABLE prezzi_servizi ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Prezzi aree visibili a tutti" ON prezzi_aree FOR SELECT USING (attivo = true);
CREATE POLICY "Prezzi servizi visibili a tutti" ON prezzi_servizi FOR SELECT USING (attivo = true);
