-- ============================================
-- FUNERIX — Schema Database Supabase
-- Esegui questo file nel SQL Editor di Supabase
-- Dashboard → SQL Editor → New query → Incolla → Run
-- ============================================

-- Categorie prodotti
CREATE TABLE categorie (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  descrizione TEXT DEFAULT '',
  ordine INT DEFAULT 0,
  icona TEXT DEFAULT '',
  attiva BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Prodotti / Servizi
CREATE TABLE prodotti (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  categoria_id UUID REFERENCES categorie(id) ON DELETE SET NULL,
  nome TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  descrizione TEXT DEFAULT '',
  descrizione_breve TEXT DEFAULT '',
  materiale TEXT,
  dimensioni TEXT,
  prezzo DECIMAL(10,2) NOT NULL DEFAULT 0,
  immagini TEXT[] DEFAULT '{}',
  attivo BOOLEAN DEFAULT true,
  tipo_servizio TEXT DEFAULT 'tutti' CHECK (tipo_servizio IN ('inumazione','tumulazione','cremazione','tutti')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Memorial / Necrologi
CREATE TABLE memorial (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  foto TEXT DEFAULT '',
  data_nascita DATE NOT NULL,
  data_morte DATE NOT NULL,
  comune TEXT DEFAULT '',
  biografia TEXT DEFAULT '',
  luogo_sepoltura TEXT DEFAULT '',
  donazione_url TEXT DEFAULT '',
  donazione_descrizione TEXT DEFAULT '',
  attivo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Messaggi condoglianze memorial
CREATE TABLE messaggi_memorial (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  memorial_id UUID REFERENCES memorial(id) ON DELETE CASCADE,
  autore TEXT NOT NULL,
  contenuto TEXT NOT NULL,
  foto TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Richieste preventivo dal configuratore
CREATE TABLE richieste (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  telefono TEXT NOT NULL,
  email TEXT DEFAULT '',
  modalita TEXT DEFAULT '',
  orario TEXT DEFAULT '',
  note TEXT DEFAULT '',
  configurazione TEXT DEFAULT '',
  totale DECIMAL(10,2) DEFAULT 0,
  stato TEXT DEFAULT 'nuova' CHECK (stato IN ('nuova','in_lavorazione','confermata','completata','annullata')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Clienti (per area riservata)
CREATE TABLE clienti (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  richiesta_id UUID REFERENCES richieste(id) ON DELETE SET NULL,
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  telefono TEXT DEFAULT '',
  stato_servizio TEXT DEFAULT 'richiesta' CHECK (stato_servizio IN ('richiesta','confermata','in_corso','completata')),
  dettagli_cerimonia JSONB DEFAULT '{}',
  documenti_checklist JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Pagamenti acconto
CREATE TABLE pagamenti (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  richiesta_id UUID REFERENCES richieste(id) ON DELETE CASCADE,
  cliente_id UUID REFERENCES clienti(id) ON DELETE SET NULL,
  importo DECIMAL(10,2) NOT NULL,
  metodo TEXT DEFAULT '' CHECK (metodo IN ('carta','paypal','klarna','bonifico','')),
  stato TEXT DEFAULT 'in_attesa' CHECK (stato IN ('in_attesa','pagato','rateizzato','fallito','rimborsato')),
  stripe_payment_id TEXT,
  stripe_checkout_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Impostazioni sito (singola riga)
CREATE TABLE impostazioni (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  ragione_sociale TEXT DEFAULT 'Funerix S.r.l.',
  partita_iva TEXT DEFAULT '',
  telefono TEXT DEFAULT '081 555 1234',
  whatsapp TEXT DEFAULT '393331234567',
  email TEXT DEFAULT 'info@funerix.com',
  indirizzo TEXT DEFAULT 'Via Roma 123, 80100 Napoli (NA)',
  orari TEXT DEFAULT 'Lun-Sab 9:00-18:00',
  registro_regionale TEXT DEFAULT '',
  autorizzazione_comunale TEXT DEFAULT '',
  km_inclusi INT DEFAULT 20,
  costo_km_extra DECIMAL(5,2) DEFAULT 3,
  comuni_serviti TEXT DEFAULT 'Napoli, Caserta, Salerno, Avellino, Benevento e province',
  email_richieste TEXT DEFAULT 'richieste@funerix.com',
  email_memorial TEXT DEFAULT 'memorial@funerix.com',
  whatsapp_business_token TEXT DEFAULT '',
  whatsapp_business_phone_id TEXT DEFAULT '',
  whatsapp_business_enabled BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Contenuti sito (singola riga)
CREATE TABLE contenuti (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  hero_titolo TEXT DEFAULT 'Vi accompagniamo con cura nei momenti più difficili',
  hero_sottotitolo TEXT DEFAULT 'Configurate il servizio funebre per il vostro caro in tutta tranquillità. Prezzi trasparenti, nessun obbligo, massimo rispetto.',
  hero_bottone TEXT DEFAULT 'Configura il Servizio',
  chi_siamo_titolo TEXT DEFAULT 'Chi Siamo',
  chi_siamo_sottotitolo TEXT DEFAULT 'Da oltre trent''anni al fianco delle famiglie campane.',
  chi_siamo_storia TEXT DEFAULT '',
  footer_descrizione TEXT DEFAULT 'Accompagniamo le famiglie con rispetto e dignità nei momenti più difficili.',
  footer_copyright TEXT DEFAULT 'Funerix — Tutti i diritti riservati.',
  footer_nota_preventivi TEXT DEFAULT 'I preventivi generati online sono indicativi e non costituiscono proposta contrattuale.',
  disclaimer_preventivo TEXT DEFAULT '',
  meta_title TEXT DEFAULT 'Funerix — Servizi Funebri in Campania',
  meta_description TEXT DEFAULT 'Configura il servizio funebre per il tuo caro con rispetto e trasparenza.',
  meta_keywords TEXT DEFAULT 'onoranze funebri, funerali Campania, servizi funebri Napoli',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Blog
CREATE TABLE blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titolo TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  contenuto TEXT DEFAULT '',
  excerpt TEXT DEFAULT '',
  immagine TEXT DEFAULT '',
  pubblicato BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Comunicazioni interne (log contatti con cliente)
CREATE TABLE comunicazioni (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  richiesta_id UUID REFERENCES richieste(id) ON DELETE CASCADE,
  tipo TEXT DEFAULT 'nota' CHECK (tipo IN ('email','telefono','whatsapp','nota')),
  contenuto TEXT NOT NULL,
  admin_nome TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- INSERISCI DATI INIZIALI
-- ============================================

-- Impostazioni default
INSERT INTO impostazioni (id) VALUES (1);

-- Contenuti default
INSERT INTO contenuti (id) VALUES (1);

-- Categorie
INSERT INTO categorie (nome, slug, descrizione, ordine, icona) VALUES
  ('Bare', 'bare', 'Cofani funebri in legno e metallo', 1, 'coffin'),
  ('Urne Cinerarie', 'urne', 'Urne per la conservazione delle ceneri', 2, 'urn'),
  ('Auto Funebri', 'auto-funebri', 'Veicoli per il trasporto funebre', 3, 'car'),
  ('Fiori e Addobbi', 'fiori', 'Composizioni floreali e addobbi', 4, 'flower'),
  ('Servizi Aggiuntivi', 'servizi', 'Necrologi, vestizione, tanatocosmesi e altro', 5, 'service');

-- Prodotti (bare)
INSERT INTO prodotti (categoria_id, nome, slug, descrizione, descrizione_breve, materiale, dimensioni, prezzo, immagini) VALUES
  ((SELECT id FROM categorie WHERE slug='bare'), 'Cofano in Rovere Massello', 'cofano-rovere-massello', 'Cofano funebre realizzato interamente in rovere massello con finitura lucida. Interni in raso bianco trapuntato.', 'Rovere massello, finitura lucida, interni in raso', 'Rovere massello', '195x65x55 cm', 2800, ARRAY['/images/bara-rovere.jpg']),
  ((SELECT id FROM categorie WHERE slug='bare'), 'Cofano in Noce Nazionale', 'cofano-noce', 'Cofano in noce nazionale con lavorazione artigianale. Interni in cotone bianco.', 'Noce nazionale, lavorazione artigianale', 'Noce nazionale', '195x65x55 cm', 2200, ARRAY['/images/bara-noce.jpg']),
  ((SELECT id FROM categorie WHERE slug='bare'), 'Cofano in Paulownia', 'cofano-paulownia', 'Cofano in legno di paulownia con finitura naturale. Soluzione dignitosa e accessibile.', 'Paulownia, finitura naturale, essenziale', 'Paulownia', '195x65x55 cm', 1200, ARRAY['/images/bara-paulownia.jpg']),
  ((SELECT id FROM categorie WHERE slug='bare'), 'Cofano in Mogano', 'cofano-mogano', 'Cofano in mogano pregiato con finitura satinata. Interni in seta avorio trapuntata.', 'Mogano pregiato, seta avorio, bronzo', 'Mogano', '195x65x55 cm', 3500, ARRAY['/images/bara-mogano.jpg']);

-- Prodotti (urne)
INSERT INTO prodotti (categoria_id, nome, slug, descrizione, descrizione_breve, materiale, dimensioni, prezzo, immagini, tipo_servizio) VALUES
  ((SELECT id FROM categorie WHERE slug='urne'), 'Urna in Marmo di Carrara', 'urna-marmo-carrara', 'Urna cineraria in marmo bianco di Carrara con incisione personalizzata.', 'Marmo bianco di Carrara, incisione personalizzata', 'Marmo di Carrara', '25x25x30 cm', 650, ARRAY['/images/urna-marmo.jpg'], 'cremazione'),
  ((SELECT id FROM categorie WHERE slug='urne'), 'Urna in Ceramica Artistica', 'urna-ceramica', 'Urna in ceramica dipinta a mano con motivi floreali. Pezzo unico artigianale campano.', 'Ceramica dipinta a mano, motivi floreali', 'Ceramica', '22x22x28 cm', 450, ARRAY['/images/urna-ceramica.jpg'], 'cremazione'),
  ((SELECT id FROM categorie WHERE slug='urne'), 'Urna in Legno di Olivo', 'urna-olivo', 'Urna in legno di olivo con venature naturali. Finitura a cera d''api.', 'Olivo con venature naturali', 'Legno di olivo', '20x20x26 cm', 380, ARRAY['/images/urna-olivo.jpg'], 'cremazione');

-- Prodotti (auto)
INSERT INTO prodotti (categoria_id, nome, slug, descrizione, descrizione_breve, prezzo, immagini) VALUES
  ((SELECT id FROM categorie WHERE slug='auto-funebri'), 'Mercedes Classe E Funebre', 'mercedes-classe-e', 'Auto funebre Mercedes Classe E allestita con interni in velluto.', 'Mercedes Classe E, interni in velluto', 800, ARRAY['/images/auto-mercedes.jpg']),
  ((SELECT id FROM categorie WHERE slug='auto-funebri'), 'Trasporto Standard', 'trasporto-standard', 'Veicolo funebre professionale per il trasporto della salma.', 'Veicolo funebre professionale', 450, ARRAY['/images/auto-standard.jpg']);

-- Prodotti (fiori)
INSERT INTO prodotti (categoria_id, nome, slug, descrizione, descrizione_breve, materiale, dimensioni, prezzo, immagini) VALUES
  ((SELECT id FROM categorie WHERE slug='fiori'), 'Corona di Rose Bianche', 'corona-rose-bianche', 'Corona funebre di grandi dimensioni composta da rose bianche fresche.', 'Rose bianche, nastro personalizzato', 'Fiori freschi', '120 cm diametro', 250, ARRAY['/images/corona-rose.jpg']),
  ((SELECT id FROM categorie WHERE slug='fiori'), 'Cuscino di Fiori Misti', 'cuscino-fiori-misti', 'Composizione a cuscino con fiori misti di stagione.', 'Fiori misti di stagione, colori delicati', 'Fiori freschi', '80x60 cm', 180, ARRAY['/images/cuscino-fiori.jpg']),
  ((SELECT id FROM categorie WHERE slug='fiori'), 'Mazzo di Gigli Bianchi', 'mazzo-gigli', 'Mazzo di gigli bianchi con verde decorativo. Simbolo di purezza.', 'Gigli bianchi, simbolo di purezza', 'Fiori freschi', '60 cm', 90, ARRAY['/images/mazzo-gigli.jpg']);

-- Prodotti (servizi)
INSERT INTO prodotti (categoria_id, nome, slug, descrizione, descrizione_breve, prezzo, immagini) VALUES
  ((SELECT id FROM categorie WHERE slug='servizi'), 'Necrologio su Giornale Locale', 'necrologio-giornale', 'Pubblicazione dell''annuncio funebre su quotidiano locale.', 'Annuncio su quotidiano locale con foto', 150, ARRAY[]::TEXT[]),
  ((SELECT id FROM categorie WHERE slug='servizi'), 'Vestizione della Salma', 'vestizione-salma', 'Servizio di vestizione professionale della salma.', 'Vestizione professionale e curata', 200, ARRAY[]::TEXT[]),
  ((SELECT id FROM categorie WHERE slug='servizi'), 'Tanatocosmesi', 'tanatocosmesi', 'Trattamento estetico post-mortem per un aspetto sereno e naturale.', 'Trattamento estetico professionale', 350, ARRAY[]::TEXT[]),
  ((SELECT id FROM categorie WHERE slug='servizi'), 'Santini Commemorativi (100 pz)', 'santini-commemorativi', 'Stampa di 100 santini commemorativi personalizzati con foto.', '100 santini personalizzati con foto', 120, ARRAY[]::TEXT[]),
  ((SELECT id FROM categorie WHERE slug='servizi'), 'Assistenza Pratiche Burocratiche', 'assistenza-pratiche', 'Assistenza completa per certificato di morte e pratiche cimiteriali.', 'Gestione completa documentazione', 300, ARRAY[]::TEXT[]),
  ((SELECT id FROM categorie WHERE slug='servizi'), 'Pagina Memorial Online', 'memorial-online', 'Pagina commemorativa online con QR Code per lapide/santino.', 'Pagina commemorativa con QR Code', 80, ARRAY[]::TEXT[]);

-- Memorial di esempio
INSERT INTO memorial (nome, foto, data_nascita, data_morte, comune, biografia, luogo_sepoltura, donazione_url, donazione_descrizione) VALUES
  ('Maria Rossi', '/images/memorial-maria.jpg', '1940-03-15', '2026-03-28', 'Napoli', 'Maria è stata una donna straordinaria, madre amorevole e nonna devota. Ha dedicato la sua vita alla famiglia e alla comunità di Napoli.', 'Cimitero di Poggioreale, Napoli — Viale dei Cipressi, Lotto 42', 'https://esempio-associazione.it/dona', 'In memoria di Maria, la famiglia chiede di devolvere eventuali offerte alla Fondazione per la Ricerca sul Cancro.'),
  ('Antonio Esposito', '/images/memorial-antonio.jpg', '1955-08-22', '2026-03-25', 'Caserta', 'Artigiano stimato, uomo di grande generosità e spirito.', 'Cimitero di Caserta', '', ''),
  ('Rosa De Luca', '/images/memorial-rosa.jpg', '1948-12-01', '2026-03-20', 'Salerno', 'Insegnante per oltre 35 anni, ha ispirato generazioni di studenti.', 'Cimitero di Salerno', '', ''),
  ('Giuseppe Ferrara', '/images/memorial-giuseppe.jpg', '1938-06-10', '2026-03-18', 'Napoli', 'Commerciante storico del quartiere, sempre disponibile con un sorriso.', 'Cimitero di Poggioreale, Napoli', '', '');

-- Messaggi memorial di esempio
INSERT INTO messaggi_memorial (memorial_id, autore, contenuto, created_at) VALUES
  ((SELECT id FROM memorial WHERE nome='Maria Rossi'), 'Giuseppe Rossi', 'Cara mamma, il tuo sorriso illuminerà sempre le nostre giornate. Ci manchi tanto.', '2026-03-29T10:00:00Z'),
  ((SELECT id FROM memorial WHERE nome='Maria Rossi'), 'Anna Verdi', 'La signora Maria era una persona speciale. Mi ha insegnato ad amare la poesia.', '2026-03-29T14:30:00Z'),
  ((SELECT id FROM memorial WHERE nome='Maria Rossi'), 'Luca Bianchi', 'Una grande donna che lascia un vuoto incolmabile nella nostra comunità.', '2026-03-30T09:15:00Z');

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Abilita RLS su tutte le tabelle
ALTER TABLE categorie ENABLE ROW LEVEL SECURITY;
ALTER TABLE prodotti ENABLE ROW LEVEL SECURITY;
ALTER TABLE memorial ENABLE ROW LEVEL SECURITY;
ALTER TABLE messaggi_memorial ENABLE ROW LEVEL SECURITY;
ALTER TABLE richieste ENABLE ROW LEVEL SECURITY;
ALTER TABLE clienti ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagamenti ENABLE ROW LEVEL SECURITY;
ALTER TABLE impostazioni ENABLE ROW LEVEL SECURITY;
ALTER TABLE contenuti ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comunicazioni ENABLE ROW LEVEL SECURITY;

-- Policy: lettura pubblica per il frontend
CREATE POLICY "Categorie visibili" ON categorie FOR SELECT USING (attiva = true);
CREATE POLICY "Prodotti visibili" ON prodotti FOR SELECT USING (attivo = true);
CREATE POLICY "Memorial visibili" ON memorial FOR SELECT USING (attivo = true);
CREATE POLICY "Messaggi memorial leggibili" ON messaggi_memorial FOR SELECT USING (true);
CREATE POLICY "Messaggi memorial inseribili" ON messaggi_memorial FOR INSERT WITH CHECK (true);
CREATE POLICY "Impostazioni leggibili" ON impostazioni FOR SELECT USING (true);
CREATE POLICY "Contenuti leggibili" ON contenuti FOR SELECT USING (true);
CREATE POLICY "Blog pubblicati" ON blog_posts FOR SELECT USING (pubblicato = true);

-- Policy: le richieste possono essere inserite da chiunque (dal configuratore)
CREATE POLICY "Richieste inseribili" ON richieste FOR INSERT WITH CHECK (true);

-- Policy: admin ha accesso completo (tramite service role, non anon key)
-- L'admin userà la service role key per operazioni CRUD complete

-- ============================================
-- REALTIME (per notifiche in tempo reale)
-- ============================================

-- Abilita realtime sulle richieste
ALTER PUBLICATION supabase_realtime ADD TABLE richieste;
ALTER PUBLICATION supabase_realtime ADD TABLE messaggi_memorial;
