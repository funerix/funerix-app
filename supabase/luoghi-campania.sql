-- Cimiteri e Chiese della Campania
-- Per dropdown autocomplete nei form ordini

CREATE TABLE IF NOT EXISTS cimiteri (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  comune TEXT NOT NULL,
  provincia TEXT NOT NULL,
  indirizzo TEXT,
  cap TEXT,
  telefono TEXT,
  orari TEXT,
  note TEXT,
  attivo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS chiese (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  comune TEXT NOT NULL,
  provincia TEXT NOT NULL,
  indirizzo TEXT,
  cap TEXT,
  telefono TEXT,
  tipo TEXT DEFAULT 'parrocchia', -- parrocchia, cattedrale, cappella, basilica, santuario
  note TEXT,
  attivo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cimiteri_provincia ON cimiteri(provincia);
CREATE INDEX IF NOT EXISTS idx_cimiteri_comune ON cimiteri(comune);
CREATE INDEX IF NOT EXISTS idx_chiese_provincia ON chiese(provincia);
CREATE INDEX IF NOT EXISTS idx_chiese_comune ON chiese(comune);

ALTER TABLE cimiteri ENABLE ROW LEVEL SECURITY;
ALTER TABLE chiese ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS cimiteri_read ON cimiteri;
CREATE POLICY cimiteri_read ON cimiteri FOR SELECT USING (true);
DROP POLICY IF EXISTS cimiteri_write ON cimiteri;
CREATE POLICY cimiteri_write ON cimiteri FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS chiese_read ON chiese;
CREATE POLICY chiese_read ON chiese FOR SELECT USING (true);
DROP POLICY IF EXISTS chiese_write ON chiese;
CREATE POLICY chiese_write ON chiese FOR ALL USING (true) WITH CHECK (true);

-- =============================================
-- CIMITERI CAMPANIA (principali per provincia)
-- =============================================

-- NAPOLI
INSERT INTO cimiteri (nome, comune, provincia, indirizzo, cap) VALUES
('Cimitero di Poggioreale', 'Napoli', 'NA', 'Via del Campo 10', '80143'),
('Cimitero di Fuorigrotta', 'Napoli', 'NA', 'Via Terracina', '80125'),
('Cimitero dei Colerici', 'Napoli', 'NA', 'Via Poggioreale', '80143'),
('Cimitero Monumentale di Napoli', 'Napoli', 'NA', 'Via Nuova Poggioreale', '80143'),
('Cimitero di Chiaiano', 'Napoli', 'NA', 'Via Comunale Chiaiano', '80145'),
('Cimitero di Pianura', 'Napoli', 'NA', 'Via Montagna Spaccata', '80126'),
('Cimitero di Secondigliano', 'Napoli', 'NA', 'Via Limitone', '80144'),
('Cimitero di Posillipo', 'Napoli', 'NA', 'Via Posillipo', '80123'),
('Cimitero di Miano', 'Napoli', 'NA', 'Via Miano', '80145'),
('Cimitero di Barra', 'Napoli', 'NA', 'Via Figliola', '80147'),
('Cimitero di San Giovanni a Teduccio', 'Napoli', 'NA', 'Via Marvasi', '80146'),
('Cimitero di Ponticelli', 'Napoli', 'NA', 'Via Argine', '80147'),
('Cimitero di Soccavo', 'Napoli', 'NA', 'Via dell''Epomeo', '80126'),
('Cimitero Comunale', 'Pozzuoli', 'NA', 'Via Celle', '80078'),
('Cimitero Comunale', 'Giugliano in Campania', 'NA', 'Via Appia', '80014'),
('Cimitero Comunale', 'Torre del Greco', 'NA', 'Via Cimiteriale', '80059'),
('Cimitero Comunale', 'Portici', 'NA', 'Via Università', '80055'),
('Cimitero Comunale', 'Ercolano', 'NA', 'Via Cupa Rosario', '80056'),
('Cimitero Comunale', 'Castellammare di Stabia', 'NA', 'Via Cimitero', '80053'),
('Cimitero Comunale', 'Torre Annunziata', 'NA', 'Via Cimitero', '80058'),
('Cimitero Comunale', 'Marano di Napoli', 'NA', 'Via Cimitero', '80016'),
('Cimitero Comunale', 'Casoria', 'NA', 'Via Cimitero', '80026'),
('Cimitero Comunale', 'Afragola', 'NA', 'Via Cimitero', '80021'),
('Cimitero Comunale', 'Acerra', 'NA', 'Via Cimitero', '80011'),
('Cimitero Comunale', 'Nola', 'NA', 'Via Cimitero', '80035'),
('Cimitero Comunale', 'Pompei', 'NA', 'Via Cimitero', '80045'),
('Cimitero Comunale', 'San Giorgio a Cremano', 'NA', 'Via Cimitero', '80046'),
('Cimitero Comunale', 'Somma Vesuviana', 'NA', 'Via Cimitero', '80049'),
('Cimitero Comunale', 'Ottaviano', 'NA', 'Via Cimitero', '80044'),
('Cimitero Comunale', 'Quarto', 'NA', 'Via Cimitero', '80010'),
('Cimitero Comunale', 'Bacoli', 'NA', 'Via Cimitero', '80070'),
('Cimitero Comunale', 'Meta', 'NA', 'Via Cimitero', '80062'),
('Cimitero Comunale', 'Sorrento', 'NA', 'Via Cimitero', '80067'),
('Cimitero Comunale', 'Vico Equense', 'NA', 'Via Cimitero', '80069'),
('Cimitero Comunale', 'Piano di Sorrento', 'NA', 'Via Cimitero', '80063'),
('Cimitero Comunale', 'Sant''Anastasia', 'NA', 'Via Cimitero', '80048'),
('Cimitero Comunale', 'Ischia', 'NA', 'Via Cimitero', '80077'),
('Cimitero Comunale', 'Procida', 'NA', 'Via Cimitero', '80079'),

-- CASERTA
('Cimitero Comunale', 'Caserta', 'CE', 'Via Cimitero', '81100'),
('Cimitero Comunale', 'Aversa', 'CE', 'Via Cimitero', '81031'),
('Cimitero Comunale', 'Maddaloni', 'CE', 'Via Cimitero', '81024'),
('Cimitero Comunale', 'Santa Maria Capua Vetere', 'CE', 'Via Cimitero', '81055'),
('Cimitero Comunale', 'Marcianise', 'CE', 'Via Cimitero', '81025'),
('Cimitero Comunale', 'Capua', 'CE', 'Via Cimitero', '81043'),
('Cimitero Comunale', 'San Nicola la Strada', 'CE', 'Via Cimitero', '81020'),
('Cimitero Comunale', 'Mondragone', 'CE', 'Via Cimitero', '81034'),
('Cimitero Comunale', 'Sessa Aurunca', 'CE', 'Via Cimitero', '81037'),
('Cimitero Comunale', 'Trentola-Ducenta', 'CE', 'Via Cimitero', '81038'),
('Cimitero Comunale', 'Casal di Principe', 'CE', 'Via Cimitero', '81033'),
('Cimitero Comunale', 'Casagiove', 'CE', 'Via Cimitero', '81022'),
('Cimitero Comunale', 'Orta di Atella', 'CE', 'Via Cimitero', '81030'),
('Cimitero Comunale', 'Teverola', 'CE', 'Via Cimitero', '81030'),
('Cimitero Comunale', 'Piedimonte Matese', 'CE', 'Via Cimitero', '81016'),

-- SALERNO
('Cimitero Comunale', 'Salerno', 'SA', 'Via del Cimitero', '84100'),
('Cimitero Comunale', 'Battipaglia', 'SA', 'Via Cimitero', '84091'),
('Cimitero Comunale', 'Cava de'' Tirreni', 'SA', 'Via Cimitero', '84013'),
('Cimitero Comunale', 'Nocera Inferiore', 'SA', 'Via Cimitero', '84014'),
('Cimitero Comunale', 'Scafati', 'SA', 'Via Cimitero', '84018'),
('Cimitero Comunale', 'Pagani', 'SA', 'Via Cimitero', '84016'),
('Cimitero Comunale', 'Sarno', 'SA', 'Via Cimitero', '84087'),
('Cimitero Comunale', 'Eboli', 'SA', 'Via Cimitero', '84025'),
('Cimitero Comunale', 'Agropoli', 'SA', 'Via Cimitero', '84043'),
('Cimitero Comunale', 'Amalfi', 'SA', 'Via Cimitero', '84011'),
('Cimitero Comunale', 'Ravello', 'SA', 'Via Cimitero', '84010'),
('Cimitero Comunale', 'Maiori', 'SA', 'Via Cimitero', '84010'),
('Cimitero Comunale', 'Vietri sul Mare', 'SA', 'Via Cimitero', '84019'),
('Cimitero Comunale', 'Pontecagnano Faiano', 'SA', 'Via Cimitero', '84098'),
('Cimitero Comunale', 'Mercato San Severino', 'SA', 'Via Cimitero', '84085'),
('Cimitero Comunale', 'Nocera Superiore', 'SA', 'Via Cimitero', '84015'),
('Cimitero Comunale', 'Angri', 'SA', 'Via Cimitero', '84012'),
('Cimitero Comunale', 'San Valentino Torio', 'SA', 'Via Cimitero', '84010'),
('Cimitero Comunale', 'Baronissi', 'SA', 'Via Cimitero', '84081'),
('Cimitero Comunale', 'Sala Consilina', 'SA', 'Via Cimitero', '84036'),

-- AVELLINO
('Cimitero Comunale', 'Avellino', 'AV', 'Via Cimitero', '83100'),
('Cimitero Comunale', 'Ariano Irpino', 'AV', 'Via Cimitero', '83031'),
('Cimitero Comunale', 'Atripalda', 'AV', 'Via Cimitero', '83042'),
('Cimitero Comunale', 'Mercogliano', 'AV', 'Via Cimitero', '83013'),
('Cimitero Comunale', 'Monteforte Irpino', 'AV', 'Via Cimitero', '83024'),
('Cimitero Comunale', 'Solofra', 'AV', 'Via Cimitero', '83029'),
('Cimitero Comunale', 'Montella', 'AV', 'Via Cimitero', '83048'),
('Cimitero Comunale', 'Avella', 'AV', 'Via Cimitero', '83021'),
('Cimitero Comunale', 'Baiano', 'AV', 'Via Cimitero', '83022'),
('Cimitero Comunale', 'Cervinara', 'AV', 'Via Cimitero', '83012'),

-- BENEVENTO
('Cimitero Comunale', 'Benevento', 'BN', 'Via dei Mulini', '82100'),
('Cimitero Comunale', 'Montesarchio', 'BN', 'Via Cimitero', '82016'),
('Cimitero Comunale', 'San Giorgio del Sannio', 'BN', 'Via Cimitero', '82018'),
('Cimitero Comunale', 'Telese Terme', 'BN', 'Via Cimitero', '82037'),
('Cimitero Comunale', 'Airola', 'BN', 'Via Cimitero', '82011'),
('Cimitero Comunale', 'Sant''Agata de'' Goti', 'BN', 'Via Cimitero', '82019'),
('Cimitero Comunale', 'Solopaca', 'BN', 'Via Cimitero', '82036'),
('Cimitero Comunale', 'Cerreto Sannita', 'BN', 'Via Cimitero', '82032');

-- =============================================
-- CHIESE CAMPANIA (principali per cerimonie funebri)
-- =============================================

-- NAPOLI
INSERT INTO chiese (nome, comune, provincia, indirizzo, cap, tipo) VALUES
('Duomo di Napoli (Cattedrale di San Gennaro)', 'Napoli', 'NA', 'Via Duomo 149', '80138', 'cattedrale'),
('Basilica di Santa Chiara', 'Napoli', 'NA', 'Via Santa Chiara 49/C', '80134', 'basilica'),
('Chiesa del Gesù Nuovo', 'Napoli', 'NA', 'Piazza del Gesù Nuovo', '80134', 'parrocchia'),
('Basilica di San Lorenzo Maggiore', 'Napoli', 'NA', 'Piazza San Gaetano 316', '80138', 'basilica'),
('Chiesa di San Domenico Maggiore', 'Napoli', 'NA', 'Piazza San Domenico Maggiore 8A', '80134', 'parrocchia'),
('Basilica di San Francesco di Paola', 'Napoli', 'NA', 'Piazza del Plebiscito', '80132', 'basilica'),
('Chiesa della Pietrasanta', 'Napoli', 'NA', 'Piazzetta Pietrasanta 17', '80138', 'parrocchia'),
('Chiesa di San Ferdinando', 'Napoli', 'NA', 'Piazza Trieste e Trento', '80132', 'parrocchia'),
('Santuario di Santa Maria del Carmine Maggiore', 'Napoli', 'NA', 'Piazza del Carmine 2', '80142', 'santuario'),
('Chiesa di Santa Maria della Sanità', 'Napoli', 'NA', 'Piazza Sanità 14', '80137', 'parrocchia'),
('Chiesa di San Giovanni a Carbonara', 'Napoli', 'NA', 'Via San Giovanni a Carbonara 5', '80139', 'parrocchia'),
('Parrocchia San Vitale Martire', 'Napoli', 'NA', 'Via San Vitale', '80133', 'parrocchia'),
('Parrocchia Santa Maria degli Angeli', 'Napoli', 'NA', 'Via Mergellina', '80122', 'parrocchia'),
('Parrocchia San Giuseppe', 'Napoli', 'NA', 'Via Medina', '80133', 'parrocchia'),
('Chiesa di Sant''Anna dei Lombardi', 'Napoli', 'NA', 'Piazza Monteoliveto', '80134', 'parrocchia'),
('Parrocchia SS. Annunziata', 'Pozzuoli', 'NA', 'Via Annunziata', '80078', 'parrocchia'),
('Duomo di Pozzuoli', 'Pozzuoli', 'NA', 'Largo San Procolo', '80078', 'cattedrale'),
('Chiesa Madre', 'Giugliano in Campania', 'NA', 'Piazza Annunziata', '80014', 'parrocchia'),
('Basilica di Santa Croce', 'Torre del Greco', 'NA', 'Via Vittorio Emanuele', '80059', 'basilica'),
('Chiesa di San Ciro', 'Portici', 'NA', 'Via San Ciro', '80055', 'parrocchia'),
('Chiesa Madre', 'Ercolano', 'NA', 'Corso Resina', '80056', 'parrocchia'),
('Cattedrale di Castellammare', 'Castellammare di Stabia', 'NA', 'Piazza Giovanni XXIII', '80053', 'cattedrale'),
('Santuario della Madonna dell''Arco', 'Sant''Anastasia', 'NA', 'Via Madonna dell''Arco', '80048', 'santuario'),
('Basilica Pontificia di Pompei', 'Pompei', 'NA', 'Piazza Bartolo Longo 1', '80045', 'basilica'),
('Chiesa di Sant''Antonio', 'Sorrento', 'NA', 'Piazza Sant''Antonino', '80067', 'parrocchia'),
('Cattedrale dei SS. Filippo e Giacomo', 'Sorrento', 'NA', 'Corso Italia', '80067', 'cattedrale'),
('Chiesa di Santa Restituta', 'Ischia', 'NA', 'Piazza Santa Restituta', '80077', 'parrocchia'),

-- CASERTA
('Cattedrale di San Michele Arcangelo', 'Caserta', 'CE', 'Piazza Duomo', '81100', 'cattedrale'),
('Chiesa di San Sebastiano', 'Caserta', 'CE', 'Via San Sebastiano', '81100', 'parrocchia'),
('Cattedrale di San Paolo', 'Aversa', 'CE', 'Piazza Municipio', '81031', 'cattedrale'),
('Chiesa del Corpus Domini', 'Maddaloni', 'CE', 'Via Corpus Domini', '81024', 'parrocchia'),
('Basilica di Santa Maria Capua Vetere', 'Santa Maria Capua Vetere', 'CE', 'Via Duomo', '81055', 'basilica'),
('Duomo di Capua', 'Capua', 'CE', 'Via Duomo', '81043', 'cattedrale'),
('Chiesa di San Marcellino', 'Marcianise', 'CE', 'Via San Marcellino', '81025', 'parrocchia'),

-- SALERNO
('Cattedrale di San Matteo', 'Salerno', 'SA', 'Piazza Alfano I', '84100', 'cattedrale'),
('Chiesa del Crocifisso', 'Salerno', 'SA', 'Via dei Mercanti', '84100', 'parrocchia'),
('Abbazia della Santissima Trinità', 'Cava de'' Tirreni', 'SA', 'Via Abbazia', '84013', 'basilica'),
('Cattedrale di Amalfi', 'Amalfi', 'SA', 'Piazza Duomo', '84011', 'cattedrale'),
('Duomo di Ravello', 'Ravello', 'SA', 'Piazza Duomo', '84010', 'cattedrale'),
('Chiesa di Santa Maria a Mare', 'Maiori', 'SA', 'Corso Reginna', '84010', 'parrocchia'),
('Cattedrale di Nocera Inferiore', 'Nocera Inferiore', 'SA', 'Piazza del Corso', '84014', 'cattedrale'),
('Chiesa Madre', 'Battipaglia', 'SA', 'Via Roma', '84091', 'parrocchia'),
('Chiesa di San Giovanni Battista', 'Angri', 'SA', 'Piazza San Giovanni', '84012', 'parrocchia'),
('Chiesa della SS. Annunziata', 'Eboli', 'SA', 'Via Annunziata', '84025', 'parrocchia'),
('Chiesa dei SS. Pietro e Paolo', 'Agropoli', 'SA', 'Via Duomo', '84043', 'parrocchia'),

-- AVELLINO
('Cattedrale di Avellino', 'Avellino', 'AV', 'Piazza Duomo', '83100', 'cattedrale'),
('Santuario di Montevergine', 'Mercogliano', 'AV', 'Via Santuario', '83013', 'santuario'),
('Cattedrale di Ariano Irpino', 'Ariano Irpino', 'AV', 'Piazza Duomo', '83031', 'cattedrale'),
('Chiesa di Sant''Ippolisto', 'Atripalda', 'AV', 'Via Sant''Ippolisto', '83042', 'parrocchia'),
('Chiesa di San Michele', 'Solofra', 'AV', 'Via San Michele', '83029', 'parrocchia'),

-- BENEVENTO
('Cattedrale di Benevento', 'Benevento', 'BN', 'Via Carlo Torre', '82100', 'cattedrale'),
('Basilica di San Bartolomeo', 'Benevento', 'BN', 'Corso Garibaldi', '82100', 'basilica'),
('Chiesa di Santa Sofia', 'Benevento', 'BN', 'Piazza Santa Sofia', '82100', 'parrocchia'),
('Chiesa della SS. Annunziata', 'Montesarchio', 'BN', 'Piazza Umberto I', '82016', 'parrocchia'),
('Chiesa di San Giorgio', 'San Giorgio del Sannio', 'BN', 'Via Roma', '82018', 'parrocchia'),
('Cattedrale di Cerreto Sannita', 'Cerreto Sannita', 'BN', 'Piazza San Martino', '82032', 'cattedrale');
