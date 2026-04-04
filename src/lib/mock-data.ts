import { Categoria, Prodotto, Memorial } from '@/types'

export const categorie: Categoria[] = [
  { id: '1', nome: 'Bare', slug: 'bare', descrizione: 'Cofani funebri in legno e metallo', ordine: 1, icona: 'coffin', attiva: true },
  { id: '2', nome: 'Urne Cinerarie', slug: 'urne', descrizione: 'Urne per la conservazione delle ceneri', ordine: 2, icona: 'urn', attiva: true },
  { id: '3', nome: 'Auto Funebri', slug: 'auto-funebri', descrizione: 'Veicoli per il trasporto funebre', ordine: 3, icona: 'car', attiva: true },
  { id: '4', nome: 'Fiori e Addobbi', slug: 'fiori', descrizione: 'Composizioni floreali e addobbi', ordine: 4, icona: 'flower', attiva: true },
  { id: '5', nome: 'Servizi Aggiuntivi', slug: 'servizi', descrizione: 'Necrologi, vestizione, tanatocosmesi e altro', ordine: 5, icona: 'service', attiva: true },
]

export const prodotti: Prodotto[] = [
  // Bare
  {
    id: 'b1', categoriaId: '1', nome: 'Cofano in Rovere Massello', slug: 'cofano-rovere-massello',
    descrizione: 'Cofano funebre realizzato interamente in rovere massello con finitura lucida. Interni in raso bianco trapuntato. Crocifisso e maniglie in ottone brunito.',
    descrizioneBreve: 'Rovere massello, finitura lucida, interni in raso',
    materiale: 'Rovere massello', dimensioni: '195x65x55 cm', prezzo: 2800,
    immagini: ['/images/bara-rovere.jpg'], attivo: true, tipoServizio: 'tutti'
  },
  {
    id: 'b2', categoriaId: '1', nome: 'Cofano in Noce Nazionale', slug: 'cofano-noce',
    descrizione: 'Cofano in noce nazionale con lavorazione artigianale. Interni in cotone bianco. Crocifisso e maniglie in metallo argentato.',
    descrizioneBreve: 'Noce nazionale, lavorazione artigianale',
    materiale: 'Noce nazionale', dimensioni: '195x65x55 cm', prezzo: 2200,
    immagini: ['/images/bara-noce.jpg'], attivo: true, tipoServizio: 'tutti'
  },
  {
    id: 'b3', categoriaId: '1', nome: 'Cofano in Paulownia', slug: 'cofano-paulownia',
    descrizione: 'Cofano in legno di paulownia con finitura naturale. Interni in tessuto bianco. Soluzione dignitosa e accessibile.',
    descrizioneBreve: 'Paulownia, finitura naturale, essenziale',
    materiale: 'Paulownia', dimensioni: '195x65x55 cm', prezzo: 1200,
    immagini: ['/images/bara-paulownia.jpg'], attivo: true, tipoServizio: 'tutti'
  },
  {
    id: 'b4', categoriaId: '1', nome: 'Cofano in Mogano', slug: 'cofano-mogano',
    descrizione: 'Cofano in mogano pregiato con finitura satinata. Interni in seta avorio trapuntata. Crocifisso in bronzo e maniglie lavorate.',
    descrizioneBreve: 'Mogano pregiato, seta avorio, bronzo',
    materiale: 'Mogano', dimensioni: '195x65x55 cm', prezzo: 3500,
    immagini: ['/images/bara-mogano.jpg'], attivo: true, tipoServizio: 'tutti'
  },

  // Urne
  {
    id: 'u1', categoriaId: '2', nome: 'Urna in Marmo di Carrara', slug: 'urna-marmo-carrara',
    descrizione: 'Urna cineraria in marmo bianco di Carrara con incisione personalizzata. Design classico ed elegante.',
    descrizioneBreve: 'Marmo bianco di Carrara, incisione personalizzata',
    materiale: 'Marmo di Carrara', dimensioni: '25x25x30 cm', prezzo: 650,
    immagini: ['/images/urna-marmo.jpg'], attivo: true, tipoServizio: 'cremazione'
  },
  {
    id: 'u2', categoriaId: '2', nome: 'Urna in Ceramica Artistica', slug: 'urna-ceramica',
    descrizione: 'Urna in ceramica dipinta a mano con motivi floreali. Pezzo unico realizzato da artigiani campani.',
    descrizioneBreve: 'Ceramica dipinta a mano, motivi floreali',
    materiale: 'Ceramica', dimensioni: '22x22x28 cm', prezzo: 450,
    immagini: ['/images/urna-ceramica.jpg'], attivo: true, tipoServizio: 'cremazione'
  },
  {
    id: 'u3', categoriaId: '2', nome: 'Urna in Legno di Olivo', slug: 'urna-olivo',
    descrizione: 'Urna in legno di olivo con venature naturali. Chiusura ermetica. Finitura a cera d\'api.',
    descrizioneBreve: 'Olivo con venature naturali',
    materiale: 'Legno di olivo', dimensioni: '20x20x26 cm', prezzo: 380,
    immagini: ['/images/urna-olivo.jpg'], attivo: true, tipoServizio: 'cremazione'
  },

  // Auto funebri
  {
    id: 'a1', categoriaId: '3', nome: 'Mercedes Classe E Funebre', slug: 'mercedes-classe-e',
    descrizione: 'Auto funebre Mercedes Classe E allestita con interni in velluto. Massima dignità e sobrietà per il trasporto.',
    descrizioneBreve: 'Mercedes Classe E, interni in velluto',
    materiale: undefined, dimensioni: undefined, prezzo: 800,
    immagini: ['/images/auto-mercedes.jpg'], attivo: true, tipoServizio: 'tutti'
  },
  {
    id: 'a2', categoriaId: '3', nome: 'Trasporto Standard', slug: 'trasporto-standard',
    descrizione: 'Veicolo funebre professionale per il trasporto della salma. Servizio dignitoso e curato.',
    descrizioneBreve: 'Veicolo funebre professionale',
    materiale: undefined, dimensioni: undefined, prezzo: 450,
    immagini: ['/images/auto-standard.jpg'], attivo: true, tipoServizio: 'tutti'
  },

  // Fiori
  {
    id: 'f1', categoriaId: '4', nome: 'Corona di Rose Bianche', slug: 'corona-rose-bianche',
    descrizione: 'Corona funebre di grandi dimensioni composta da rose bianche fresche con nastro personalizzato.',
    descrizioneBreve: 'Rose bianche, nastro personalizzato',
    materiale: 'Fiori freschi', dimensioni: '120 cm diametro', prezzo: 250,
    immagini: ['/images/corona-rose.jpg'], attivo: true, tipoServizio: 'tutti'
  },
  {
    id: 'f2', categoriaId: '4', nome: 'Cuscino di Fiori Misti', slug: 'cuscino-fiori-misti',
    descrizione: 'Composizione a cuscino con fiori misti di stagione. Colori delicati e naturali.',
    descrizioneBreve: 'Fiori misti di stagione, colori delicati',
    materiale: 'Fiori freschi', dimensioni: '80x60 cm', prezzo: 180,
    immagini: ['/images/cuscino-fiori.jpg'], attivo: true, tipoServizio: 'tutti'
  },
  {
    id: 'f3', categoriaId: '4', nome: 'Mazzo di Gigli Bianchi', slug: 'mazzo-gigli',
    descrizione: 'Mazzo di gigli bianchi con verde decorativo. Simbolo di purezza e rinascita.',
    descrizioneBreve: 'Gigli bianchi, simbolo di purezza',
    materiale: 'Fiori freschi', dimensioni: '60 cm', prezzo: 90,
    immagini: ['/images/mazzo-gigli.jpg'], attivo: true, tipoServizio: 'tutti'
  },

  // Servizi extra
  {
    id: 's1', categoriaId: '5', nome: 'Necrologio su Giornale Locale', slug: 'necrologio-giornale',
    descrizione: 'Pubblicazione dell\'annuncio funebre su quotidiano locale. Testo personalizzato con foto.',
    descrizioneBreve: 'Annuncio su quotidiano locale con foto',
    materiale: undefined, dimensioni: undefined, prezzo: 150,
    immagini: [], attivo: true, tipoServizio: 'tutti'
  },
  {
    id: 's2', categoriaId: '5', nome: 'Vestizione della Salma', slug: 'vestizione-salma',
    descrizione: 'Servizio di vestizione professionale della salma con massimo rispetto e cura.',
    descrizioneBreve: 'Vestizione professionale e curata',
    materiale: undefined, dimensioni: undefined, prezzo: 200,
    immagini: [], attivo: true, tipoServizio: 'tutti'
  },
  {
    id: 's3', categoriaId: '5', nome: 'Tanatocosmesi', slug: 'tanatocosmesi',
    descrizione: 'Trattamento estetico post-mortem per restituire un aspetto sereno e naturale al defunto.',
    descrizioneBreve: 'Trattamento estetico professionale',
    materiale: undefined, dimensioni: undefined, prezzo: 350,
    immagini: [], attivo: true, tipoServizio: 'tutti'
  },
  {
    id: 's4', categoriaId: '5', nome: 'Santini Commemorativi (100 pz)', slug: 'santini-commemorativi',
    descrizione: 'Stampa di 100 santini commemorativi personalizzati con foto, preghiera e dati del defunto.',
    descrizioneBreve: '100 santini personalizzati con foto',
    materiale: 'Carta patinata', dimensioni: '7x12 cm', prezzo: 120,
    immagini: [], attivo: true, tipoServizio: 'tutti'
  },
  {
    id: 's5', categoriaId: '5', nome: 'Assistenza Pratiche Burocratiche', slug: 'assistenza-pratiche',
    descrizione: 'Assistenza completa per certificato di morte, autorizzazione al trasporto, pratiche cimiteriali e documenti necessari.',
    descrizioneBreve: 'Gestione completa documentazione',
    materiale: undefined, dimensioni: undefined, prezzo: 300,
    immagini: [], attivo: true, tipoServizio: 'tutti'
  },
  {
    id: 's6', categoriaId: '5', nome: 'Pagina Memorial Online', slug: 'memorial-online',
    descrizione: 'Pagina commemorativa online dedicata al defunto con QR Code per lapide/santino. Amici e familiari possono lasciare messaggi e ricordi.',
    descrizioneBreve: 'Pagina commemorativa con QR Code',
    materiale: undefined, dimensioni: undefined, prezzo: 80,
    immagini: [], attivo: true, tipoServizio: 'tutti'
  },
]

export const memorialEsempio: Memorial = {
  id: 'mem-001',
  nomeDefunto: 'Maria Rossi',
  dataNascita: '1940-03-15',
  dataMorte: '2026-03-28',
  foto: '/images/memorial-maria.jpg',
  biografia: 'Maria è stata una donna straordinaria, madre amorevole e nonna devota. Ha dedicato la sua vita alla famiglia e alla comunità di Napoli, dove era conosciuta per la sua generosità e il suo sorriso contagioso. Insegnante per oltre 30 anni, ha ispirato generazioni di studenti con la sua passione per la letteratura italiana.',
  luogoSepoltura: 'Cimitero di Poggioreale, Napoli — Viale dei Cipressi, Lotto 42',
  mappaUrl: undefined,
  musicaUrl: undefined,
  donazioneUrl: 'https://esempio-associazione.it/dona',
  donazioneDescrizione: 'In memoria di Maria, la famiglia chiede di devolvere eventuali offerte alla Fondazione per la Ricerca sul Cancro.',
  messaggi: [
    {
      id: 'msg-1', memorialId: 'mem-001', autore: 'Giuseppe Rossi',
      contenuto: 'Cara mamma, il tuo sorriso illuminerà sempre le nostre giornate. Ci manchi tanto.',
      createdAt: '2026-03-29T10:00:00Z'
    },
    {
      id: 'msg-2', memorialId: 'mem-001', autore: 'Anna Verdi',
      contenuto: 'La signora Maria era una persona speciale. Mi ha insegnato ad amare la poesia. Riposi in pace.',
      createdAt: '2026-03-29T14:30:00Z'
    },
    {
      id: 'msg-3', memorialId: 'mem-001', autore: 'Luca Bianchi',
      contenuto: 'Una grande donna che lascia un vuoto incolmabile nella nostra comunità. Le mie più sentite condoglianze alla famiglia.',
      createdAt: '2026-03-30T09:15:00Z'
    },
  ],
  createdAt: '2026-03-28T18:00:00Z'
}
