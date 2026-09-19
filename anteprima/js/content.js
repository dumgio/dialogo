// Contenuti di Dialogo. Fonte: kit «Caffè Filosofico Fai-da-Te» di Formebrevi APS (CC BY-NC-SA 4.0).
// I testi delle fasi e dei rilanci vanno riletti da Giovanni prima della pubblicazione.

export const FASI = [
  {
    id: 'benvenuto',
    titolo: 'Benvenuto e clima di ascolto',
    cosa: "Accogli i partecipanti in cerchio. Di' che non esistono risposte giuste o sbagliate e che tutti hanno diritto di parola. Proponi un minuto di silenzio per entrare nel clima.",
    online: "Accogli i partecipanti in videochiamata e chiedi di spegnere le notifiche. Di' che non esistono risposte giuste o sbagliate e che tutti hanno diritto di parola. Proponi un minuto di silenzio per entrare nel clima.",
    dici: 'Qui non esistono risposte giuste o sbagliate. Ognuno ha diritto di parola.',
  },
  {
    id: 'domanda',
    titolo: 'Presentazione della domanda',
    cosa: 'Leggi ad alta voce la domanda-stimolo. Lascia a ciascuno il tempo di scriverla su un foglio e di annotare un primo pensiero. Ancora non si discute: è un momento personale e silenzioso.',
    online: 'Scrivi la domanda in chat e leggila ad alta voce. Lascia a ciascuno il tempo di annotare un primo pensiero su un foglio. Ancora non si discute: è un momento personale e silenzioso.',
    dici: 'Ecco la domanda. Scrivi un primo pensiero, senza condividerlo per ora.',
  },
  {
    id: 'giro',
    titolo: 'Giro di parola iniziale',
    cosa: 'Ognuno condivide, in una o due frasi, la prima reazione alla domanda. Tu non commenti e non valuti: ringrazi e passi la parola.',
    online: 'Ognuno condivide, in una o due frasi, la prima reazione alla domanda. Stabilisci l\'ordine dei turni e passa la parola per nome. Tu non commenti e non valuti.',
    dici: 'Grazie. A chi tocca?',
  },
  {
    id: 'dialogo',
    titolo: 'Dialogo aperto',
    cosa: 'Si apre la discussione. Intervieni per riformulare, stimolare collegamenti, rallentare chi parla di più e dare spazio a chi tace.',
    online: 'Si apre la discussione. Chiedi di alzare la mano o di scrivere «prenoto» in chat. Intervieni per riformulare, stimolare collegamenti e dare spazio a chi tace.',
    dici: 'Qualcuno vuole rispondere a quanto è stato detto?',
  },
  {
    id: 'chiusura',
    titolo: 'Chiusura e raccoglimento',
    cosa: 'Ognuno condivide una parola o una frase su ciò che porta a casa. Tu non tiri conclusioni: il pensiero resta aperto.',
    online: 'Ognuno condivide una parola o una frase su ciò che porta a casa. Tu non tiri conclusioni: il pensiero resta aperto.',
    dici: 'Una parola o una frase: che cosa portate a casa?',
  },
];

export const TEMI = [
  'Identità', 'Giustizia', 'Verità', 'Felicità', 'Diversità',
  'Tecnologia', 'Tempo', 'Responsabilità', 'Linguaggio', 'Senso',
  'Amicizia', 'Regole', 'Coraggio', 'Lavoro', 'Libertà', 'Cura', 'Fiducia',
];

// Le prime 10 domande sono quelle del kit (per tutti). Le altre sono state scritte per questa app.
export const DOMANDE = [
  { id: 1, tema: 'Identità', pubblico: 'tutti', testo: 'Siamo liberi di scegliere chi essere, o siamo il prodotto di ciò che ci è capitato?' },
  { id: 2, tema: 'Giustizia', pubblico: 'tutti', testo: 'È possibile essere giusti senza essere crudeli?' },
  { id: 3, tema: 'Verità', pubblico: 'tutti', testo: "Ha ancora senso cercare la verità in un'epoca di opinioni infinite?" },
  { id: 4, tema: 'Felicità', pubblico: 'tutti', testo: 'La felicità si può imparare, o è un caso?' },
  { id: 5, tema: 'Diversità', pubblico: 'tutti', testo: 'La diversità arricchisce sempre, o può anche dividere?' },
  { id: 6, tema: 'Tecnologia', pubblico: 'tutti', testo: 'Le macchine possono pensare, o solo simulare il pensiero?' },
  { id: 7, tema: 'Tempo', pubblico: 'tutti', testo: 'Il passato esiste ancora, o esiste solo il presente?' },
  { id: 8, tema: 'Responsabilità', pubblico: 'tutti', testo: 'Fino a che punto siamo responsabili delle sofferenze degli altri?' },
  { id: 9, tema: 'Linguaggio', pubblico: 'tutti', testo: 'Le parole creano la realtà o la descrivono soltanto?' },
  { id: 10, tema: 'Senso', pubblico: 'tutti', testo: 'Ha senso fare il bene se non serve a nulla?' },
  { id: 11, tema: 'Amicizia', pubblico: 'scuola', testo: 'Un vero amico dice sempre la verità, o a volte la verità può ferire?' },
  { id: 12, tema: 'Regole', pubblico: 'scuola', testo: 'Le regole servono a proteggerci o a limitarci?' },
  { id: 13, tema: 'Giustizia', pubblico: 'scuola', testo: 'È giusto che tutti abbiano le stesse cose, o che ognuno abbia quello che merita?' },
  { id: 14, tema: 'Tecnologia', pubblico: 'scuola', testo: 'I social ci avvicinano agli altri o ci fanno sentire più soli?' },
  { id: 15, tema: 'Identità', pubblico: 'scuola', testo: 'Quando cambiamo idea, siamo ancora la stessa persona?' },
  { id: 16, tema: 'Coraggio', pubblico: 'scuola', testo: 'Essere coraggiosi significa avere paura di meno?' },
  { id: 17, tema: 'Lavoro', pubblico: 'adulti', testo: 'Il lavoro dà valore alla vita, o ce ne toglie?' },
  { id: 18, tema: 'Tempo', pubblico: 'adulti', testo: 'Abbiamo il dovere di ricordare, o a volte è meglio dimenticare?' },
  { id: 19, tema: 'Libertà', pubblico: 'adulti', testo: 'Si può essere liberi dentro una comunità?' },
  { id: 20, tema: 'Cura', pubblico: 'adulti', testo: 'Prendersi cura degli altri è un dovere o una scelta?' },
  { id: 21, tema: 'Fiducia', pubblico: 'adulti', testo: 'Come si costruisce la fiducia, e come si perde?' },
  { id: 22, tema: 'Responsabilità', pubblico: 'adulti', testo: 'Che cosa dobbiamo a chi non conosciamo?' },
];

export const RILANCI = [
  {
    id: 'bloccato',
    titolo: 'Il dialogo si è bloccato',
    frasi: [
      'Che cosa vi ha colpito di quello che è stato detto finora?',
      "C'è un'idea con cui non siete d'accordo?",
      'Proviamo a guardare la domanda da un altro lato: che cosa succederebbe se fosse vero il contrario?',
    ],
    consiglio: 'Aspetta qualche secondo prima di intervenire. Se il dialogo non riparte, usa la domanda di riserva.',
  },
  {
    id: 'troppo',
    titolo: 'Qualcuno parla troppo',
    frasi: [
      'Grazie, teniamo questa idea. Sentiamo anche gli altri.',
      'Riassumiamo in una frase quello che hai detto, poi diamo la parola a qualcun altro.',
    ],
    consiglio: 'Non è scortesia: è tutela del gruppo. Guarda nello strumento Turni chi non ha ancora parlato.',
  },
  {
    id: 'poco-chiaro',
    titolo: 'Qualcuno è stato poco chiaro',
    frasi: [
      'Ho capito bene che intendi dire...?',
      'Puoi farci un esempio?',
    ],
    consiglio: 'Riformula senza interpretare: non aggiungere cose che la persona non ha detto.',
  },
  {
    id: 'accordo',
    titolo: "Sono tutti d'accordo",
    frasi: [
      'Qualcuno vede una difficoltà in questa idea?',
      'Chi potrebbe pensarla in modo diverso, e perché?',
      'Che cosa c\'è di vero nella posizione opposta?',
    ],
    consiglio: "Un accordo troppo rapido spesso nasconde dubbi non detti. Dai valore al dubbio.",
  },
  {
    id: 'fuori-tema',
    titolo: 'Si va fuori tema',
    frasi: [
      'Questa idea è interessante. Come si collega alla nostra domanda?',
      'Teniamo questo pensiero da parte e torniamo alla domanda.',
    ],
    consiglio: 'Prima riconosci quello che è stato detto, poi riporta il gruppo alla domanda. Puoi rileggerla ad alta voce.',
  },
  {
    id: 'tono',
    titolo: 'Il tono si scalda',
    frasi: [
      'Fermiamoci un momento. Respiriamo e ascoltiamo.',
      "Prima di rispondere, ripeti con parole tue quello che ha detto l'altra persona.",
    ],
    consiglio: 'Rallenta tu: parla piano e proponi 20 secondi di silenzio. Ricorda che si discutono le idee, mai le persone.',
  },
  {
    id: 'silenzio',
    titolo: "C'è un lungo silenzio",
    frasi: [
      'Prendiamoci ancora qualche secondo di silenzio.',
      'Nessuna fretta: il pensiero ha bisogno di tempo.',
    ],
    consiglio: 'Un silenzio di 20 secondi è pensiero in corso: aspetta a riempirlo. Puoi avviare il timer nello strumento Tempo.',
  },
];

// ---- Contatti e collegamenti ----

export const VERSIONE = '1.1 · settembre 2026';

export const CONTATTI = {
  sito: 'https://www.formebrevi.it',
  app: 'https://dialogo.formebrevi.it',
  email: 'formebrevi@gmail.com',
  paypal: 'https://www.paypal.me/formebrevi',
  iscrizione: 'https://www.formebrevi.it/iscriviti.html',
  corsi: 'https://www.formebrevi.it/corsi.html',
  risorse: 'https://www.formebrevi.it/risorse.html',
  kalmly: 'https://kalmly.app',
};

export const mailto = (oggetto, corpo = '') =>
  'mailto:' + CONTATTI.email + '?subject=' + encodeURIComponent(oggetto) + (corpo ? '&body=' + encodeURIComponent(corpo) : '');

// Messaggi di posta già pronti (si aprono nell'app di posta del telefono).
export const MAIL = {
  domanda: mailto('Dialogo: suggerimento di una domanda', 'Domanda suggerita:\n\nTema:\n\nPer chi (tutti, scuola, adulti):\n'),
  problema: mailto('Dialogo: segnalazione di un problema', 'Che cosa è successo?\n\nChe telefono e che browser usi?\n'),
  scrivi: mailto('Messaggio da Dialogo'),
  corso: mailto('Richiesta di un corso o di un laboratorio', 'Chi siamo e dove:\n\nCosa ci interessa:\n'),
};

// ---- Pagine informative ----
// Tipi di blocco: h (titolo), p (testo), lista, passi, nota, link, azione, domande (elenco), durate (tabella).
// Nel testo, **così** diventa grassetto. I testi scritti per l'app vanno riletti da Giovanni prima della pubblicazione.

export const PAGINE = [
  {
    id: 'come-funziona',
    gruppo: 'imparare',
    titolo: 'Come funziona',
    sotto: 'Guida completa: preparare, condurre, strumenti, tempo, installazione.',
    blocchi: [
      { t: 'h', x: 'In breve' },
      { t: 'p', x: `Dialogo è la app di Formebrevi APS per chi conduce un dialogo filosofico di gruppo, in presenza o online. Ti accompagna nelle cinque fasi dell'incontro, tiene il tempo e ti dà sotto mano quattro strumenti per i momenti difficili. I partecipanti non devono installare niente: la usa solo chi conduce.` },
      { t: 'h', x: 'Come si usa, in cinque passi' },
      { t: 'passi', x: [
        { titolo: `Prepara l'incontro.`, testo: 'Scegli la durata, il gruppo, il luogo e la domanda.' },
        { titolo: `Apri l'incontro.`, testo: `Tocca «Inizia l'incontro»: parte la prima fase e il tempo comincia a scorrere.` },
        { titolo: 'Segui le fasi.', testo: `In ogni fase leggi cosa fare e cosa puoi dire. Quando sei pronto, tocca «Avanti».` },
        { titolo: 'Usa gli strumenti quando servono.', testo: 'Dalla barra in basso: Domanda, Turni, Rilancia e Tempo.' },
        { titolo: 'Chiudi.', testo: `Nell'ultima fase tocca «Concludi». Poi puoi compilare la scheda di riflessione.` },
      ] },
      { t: 'h', x: `Preparare l'incontro` },
      { t: 'lista', x: [
        `**Durata:** 60, 90 o 120 minuti. L'app adatta il tempo di ogni fase.`,
        `**Gruppo:** fino a 8 persone, da 9 a 15 oppure oltre 15. Serve a proporre il tempo giusto per ogni intervento nel giro di parola: 90, 60 o 30 secondi.`,
        `**Dove:** in presenza o online. Online, i suggerimenti tengono conto della videochiamata.`,
        `**Per chi:** tutti, scuola o adulti. Sceglie quali domande ti vengono proposte.`,
        `**La domanda:** scegli una delle tre proposte, tocca «Sorprendimi» o «Altre tre», oppure scrivi la tua.`,
        `Le scelte di durata, gruppo, luogo e pubblico restano sul telefono: la volta dopo le trovi già impostate.`,
      ] },
      { t: 'h', x: 'Le durate delle fasi' },
      { t: 'p', x: `Le fasi seguono il kit «Caffè Filosofico Fai-da-Te». Ecco quanti minuti ha ciascuna, in base alla durata scelta:` },
      { t: 'durate' },
      { t: 'h', x: `Come leggere lo schermo dell'incontro` },
      { t: 'lista', x: [
        `**In alto:** la fase in corso (per esempio «Fase 3 di 5») e, a destra, il tempo che resta per quella fase.`,
        `**Tempo dell'incontro:** quanto manca alla fine prevista.`,
        `**La domanda:** resta sempre visibile, in un riquadro colorato.`,
        `**Cosa fare:** una o due frasi che spiegano il compito della fase.`,
        `**Puoi dire:** una frase pronta da dire ad alta voce.`,
        `**Avanti:** passa alla fase successiva. Nell'ultima fase diventa «Concludi».`,
        `**La barra in basso:** i quattro strumenti.`,
      ] },
      { t: 'h', x: 'Il tempo' },
      { t: 'p', x: `L'app non cambia mai fase da sola: decidi tu quando passare oltre. Quando il tempo di una fase finisce, il numero diventa rosso, compare il segno «+» (per esempio +1:20 vuol dire un minuto e venti secondi di ritardo) e il telefono vibra, se lo permette.` },
      { t: 'p', x: `**Se passi alla fase dopo in anticipo o in ritardo,** il tempo dell'incontro non cambia: quello che hai risparmiato o perso si aggiunge o si toglie alla fase «Dialogo aperto», che è la più elastica. Il dialogo aperto non scende mai sotto i 10 minuti: se il ritardo è troppo, è la fine prevista dell'incontro a spostarsi.` },
      { t: 'p', x: `Il tempo si calcola dall'orologio del telefono, quindi resta giusto anche se lo schermo si spegne o esci un momento dall'app.` },
      { t: 'h', x: 'Strumento 1: Domanda' },
      { t: 'lista', x: [
        `Mostra la domanda in grande, con il suo tema.`,
        `**Altra dello stesso tema:** propone un'altra domanda dello stesso tema, se ce n'è.`,
        `**Una a caso:** ne propone una qualsiasi.`,
        `**Domanda di riserva:** serve quando il dialogo si blocca. Ne trovi una nuova, con l'etichetta «Domanda di riserva».`,
        `In un incontro l'app non ti ripropone le domande già usate. Se le finisci, ricomincia.`,
        `Se hai scritto tu la domanda, non ha un tema: «Altra dello stesso tema» non compare.`,
      ] },
      { t: 'h', x: 'Strumento 2: Turni' },
      { t: 'lista', x: [
        `La prima volta scrivi i nomi, uno per riga, oppure solo il numero delle persone (per esempio 8): l'app crea «Persona 1», «Persona 2» e così via, fino a 40.`,
        `Quando qualcuno parla, **tocca il suo nome**: accanto compare quante volte ha parlato.`,
        `**I colori ti aiutano:** in arancione chi non ha ancora parlato mentre altri sì, in rosa chi ha parlato almeno tre volte e almeno il doppio della media.`,
        `**Tempo per ogni intervento:** spento, 30, 60 o 90 secondi. Nel giro di parola l'app lo imposta da sola in base al gruppo. Parte quando tocchi un nome e vibra alla fine.`,
        `«Cambia l'elenco» ti fa riscrivere i nomi.`,
        `I nomi restano nella memoria del telefono e si cancellano a fine incontro. Nessuno li riceve.`,
      ] },
      { t: 'h', x: 'Strumento 3: Rilancia' },
      { t: 'lista', x: [
        `Un elenco di sette situazioni: il dialogo si è bloccato, qualcuno parla troppo, qualcuno è stato poco chiaro, sono tutti d'accordo, si va fuori tema, il tono si scalda, c'è un lungo silenzio.`,
        `Per ognuna trovi due o tre frasi da dire ad alta voce e un consiglio breve.`,
        `Con «Altre situazioni» torni all'elenco.`,
      ] },
      { t: 'h', x: 'Strumento 4: Tempo' },
      { t: 'lista', x: [
        `Mostra il tempo che resta nell'incontro e nella fase.`,
        `**Allunga 5 min** e **Accorcia 5 min** cambiano la durata della fase in corso. Se sei prima del dialogo aperto, è il dialogo ad assorbire la differenza (senza scendere sotto i 10 minuti); altrimenti cambia la fine dell'incontro. Una fase dura sempre almeno 1 minuto.`,
        `**Silenzio:** un timer di 1 minuto o di 20 secondi. Il primo serve all'inizio, il secondo durante il dialogo. Vibra alla fine.`,
      ] },
      { t: 'h', x: 'In presenza o online' },
      { t: 'lista', x: [
        `**In presenza:** metti il telefono sul tavolo o in tasca, con lo schermo acceso. Per passare la parola puoi usare un oggetto che gira nel cerchio.`,
        `**Online:** tieni Dialogo su un secondo schermo o sul telefono, accanto alla videochiamata. I testi delle fasi cambiano: per esempio chiedono di spegnere le notifiche, di scrivere la domanda in chat e di alzare la mano per prenotare l'intervento.`,
      ] },
      { t: 'h', x: 'Solo gli strumenti' },
      { t: 'p', x: `Dalla schermata iniziale puoi aprire i quattro strumenti senza le fasi e senza il tempo dell'incontro. È utile se hai già in testa il tuo modo di condurre e ti servono solo le domande, i turni, i rilanci e il timer del silenzio.` },
      { t: 'h', x: 'Installarla sul telefono' },
      { t: 'lista', x: [
        `**Android (Chrome):** tocca i tre puntini in alto a destra, poi «Installa app» o «Aggiungi a schermata Home».`,
        `**iPhone (Safari):** tocca il tasto Condividi (il quadrato con la freccia), poi «Aggiungi alla schermata Home».`,
        `Dopo l'installazione trovi l'icona di Dialogo con le altre app e si apre a schermo intero.`,
      ] },
      { t: 'h', x: 'Senza connessione' },
      { t: 'p', x: `Apri Dialogo una volta con la connessione: da quel momento tutto viene salvato sul telefono e l'app si apre anche senza rete, in un'aula o in un circolo dove il segnale è debole. Quando torna la connessione, si aggiorna da sola alla nuova versione.` },
      { t: 'h', x: 'Schermo e batteria' },
      { t: 'p', x: `Durante l'incontro l'app chiede al telefono di tenere lo schermo acceso, se il telefono lo permette. Prima di cominciare conviene caricare la batteria o avere il caricatore a portata di mano.` },
      { t: 'h', x: 'Privacy' },
      { t: 'p', x: `Dialogo non ha account, non ha pubblicità e non raccoglie dati. Sul telefono resta solo la tua ultima scelta di durata, gruppo, luogo e pubblico. La scheda di riflessione non viene salvata: la copi tu dove vuoi.` },
      { t: 'h', x: 'Domande frequenti' },
      { t: 'lista', x: [
        `**Il tempo dell'incontro non cambia quando premo «Avanti». È normale?** Sì, è voluto. Il tempo risparmiato o perso passa al dialogo aperto, così l'ora di fine resta quella prevista.`,
        `**Posso saltare una fase?** Sì, tocca «Avanti». Le fasi sono una guida, non un obbligo.`,
        `**Il telefono non vibra.** Non tutti i telefoni lo permettono (per esempio gli iPhone). Guarda il numero del tempo: diventa rosso e mostra il segno «+».`,
        `**Ho chiuso l'app durante un incontro.** L'incontro ricomincia da capo, perché l'app non salva quello in corso. Prepara di nuovo l'incontro e passa alla fase che stavi facendo.`,
        `**Funziona su computer e tablet?** Sì, si apre da qualunque browser all'indirizzo dialogo.formebrevi.it.`,
        `**È davvero gratuita?** Sì. Se ti è utile, puoi sostenere Formebrevi dalla pagina «Sostieni Formebrevi».`,
      ] },
      { t: 'azione', x: 'Serve aiuto? Vai a «Supporto»', az: 'pagina', id: 'supporto', stile: 'chiaro' },
    ],
  },
  {
    id: 'cos-e',
    gruppo: 'imparare',
    titolo: `Cos'è il dialogo filosofico`,
    sotto: `Che cosa è, a chi serve e che cosa può dare.`,
    blocchi: [
      { t: 'h', x: `Che cos'è` },
      { t: 'p', x: `Il dialogo filosofico, o caffè filosofico, è uno spazio informale di dialogo in cui chiunque, senza essere filosofo, può affrontare domande profonde su sé stesso, sulla società, sull'etica, sul senso della vita. Non esistono risposte giuste o sbagliate: conta il processo di pensiero condiviso.` },
      { t: 'p', x: `Nato in Francia negli anni '90, si è diffuso in tutto il mondo come pratica di filosofia applicata. Formebrevi lo promuove come strumento di inclusione, pensiero critico e comunità.` },
      { t: 'h', x: 'Che cosa non è' },
      { t: 'lista', x: [
        `**Una lezione?** No. Chi conduce ascolta e fa domande: spiegare e correggere non è il suo compito.`,
        `**Un dibattito?** No. Nessuno deve vincere o convincere gli altri.`,
        `**Una terapia di gruppo?** No. Si ragiona su idee e domande; i problemi personali di ciascuno hanno altri luoghi.`,
      ] },
      { t: 'h', x: 'Come si svolge' },
      { t: 'p', x: `Un incontro dura di solito circa due ore e segue cinque fasi: l'accoglienza, la presentazione della domanda, un giro di parola in cui tutti dicono la prima reazione, il dialogo aperto e la chiusura. Chi conduce, il facilitatore, non porta risposte: custodisce il dialogo.` },
      { t: 'h', x: 'A chi serve' },
      { t: 'lista', x: [
        'Insegnanti e formatori che vogliono sperimentare il dialogo in classe.',
        'Educatori e animatori di comunità.',
        `Genitori curiosi che vogliono un'esperienza diversa con altri genitori.`,
        'Chiunque voglia organizzare una serata di pensiero con amici o colleghi.',
        'Gruppi giovanili, parrocchie, biblioteche, circoli culturali.',
      ] },
      { t: 'h', x: 'Che cosa può dare' },
      { t: 'lista', x: [
        `Ascoltare davvero, senza aspettare soltanto il proprio turno.`,
        `Dire un'idea con parole proprie e vederla accolta.`,
        `Accorgersi che una stessa domanda si può guardare da lati diversi.`,
        `Allenare il pensiero critico e la partecipazione.`,
      ] },
      { t: 'link', x: `Scarica il kit «Caffè Filosofico Fai-da-Te»`, href: 'risorse', stile: 'chiaro' },
    ],
  },
  {
    id: 'prima',
    gruppo: 'imparare',
    titolo: 'Prima di cominciare',
    sotto: 'Che cosa serve e come prepararsi, in presenza e online.',
    blocchi: [
      { t: 'h', x: 'Cosa ti serve' },
      { t: 'lista', x: [
        'Uno spazio accogliente.',
        'Sedie disposte in cerchio.',
        'Da 6 a 15 persone.',
        'Una domanda-stimolo.',
        'Circa 2 ore di tempo.',
        'Un facilitatore: tu.',
      ] },
      { t: 'h', x: 'Il giorno prima' },
      { t: 'lista', x: [
        `Scegli la domanda e tieni pronta una domanda di riserva (l'app la trova per te).`,
        `Apri Dialogo una volta con la connessione, così viene salvata sul telefono.`,
        `Carica il telefono.`,
        `Decidi se usare i nomi o solo il numero delle persone per i turni.`,
      ] },
      { t: 'h', x: 'Nella stanza' },
      { t: 'lista', x: [
        `Disponi le sedie in cerchio, senza tavoli in mezzo.`,
        `Tieni un foglio e una penna per ciascuno: nella fase 2 ognuno scrive un primo pensiero.`,
        `Accogli le persone man mano che arrivano.`,
        `Spiega all'inizio, in poche parole, come funziona l'incontro.`,
      ] },
      { t: 'h', x: 'Online' },
      { t: 'lista', x: [
        `Invia il link della videochiamata con anticipo.`,
        `Chiedi di spegnere le notifiche e, se possibile, di tenere la telecamera accesa.`,
        `Decidi come prenotare la parola: mano alzata o una parola in chat.`,
        `Tieni Dialogo su un secondo schermo.`,
      ] },
      { t: 'azione', x: `Prepara un incontro`, az: 'prepara', stile: 'primario' },
    ],
  },
  {
    id: 'consigli',
    gruppo: 'imparare',
    titolo: 'Come condurre bene',
    sotto: 'I cinque consigli del kit e altri suggerimenti pratici.',
    blocchi: [
      { t: 'h', x: 'I cinque consigli del kit' },
      { t: 'passi', x: [
        { titolo: 'Non sei un insegnante.', testo: 'Il tuo ruolo non è spiegare né correggere. Sei un guardiano del dialogo, non un detentore di risposte. Più ti togli dalla scena, meglio funziona.' },
        { titolo: 'Valorizza il silenzio.', testo: 'Un silenzio di 20 secondi non è imbarazzante: è pensiero in corso. Non affrettarti a riempirlo.' },
        { titolo: 'Riformula, non interpretare.', testo: 'Se qualcuno dice qualcosa di confuso, chiedi: «Ho capito bene che intendi dire...?» Non aggiungere cose che non ha detto.' },
        { titolo: 'Gestisci i monopolizzatori.', testo: 'Se qualcuno parla troppo: «Grazie, teniamo questa idea. Sentiamo anche gli altri.» Non è scortesia: è tutela del gruppo.' },
        { titolo: 'Tieni una domanda di riserva.', testo: 'Se il dialogo si blocca, hai una seconda domanda pronta.' },
      ] },
      { t: 'h', x: 'Altri suggerimenti' },
      { t: 'lista', x: [
        `**Parla poco e piano.** Il gruppo prende il ritmo da chi conduce.`,
        `**Ringrazia chi parla,** anche quando la pensi diversamente: ringraziare non vuol dire approvare.`,
        `**Chiedi esempi.** «Puoi farci un esempio?» rende concrete le idee.`,
        `**Dai valore ai dubbi.** Chi dice «non lo so» sta pensando.`,
        `**Tieni per te la tua opinione** il più a lungo possibile. Se la dici, dopo gli altri.`,
        `**Osserva chi tace** senza obbligarlo a parlare: uno sguardo o un «vuoi aggiungere qualcosa?» bastano.`,
        `**Chiudi senza concludere.** L'ultima frase di ognuno vale più di un riassunto.`,
      ] },
      { t: 'nota', x: `Nell'app: lo strumento «Rilancia» ti dà frasi pronte per ogni situazione.` },
    ],
  },
  {
    id: 'domande',
    gruppo: 'imparare',
    titolo: 'Tutte le domande',
    sotto: 'Le domande di Dialogo, per tutti, per la scuola e per gli adulti.',
    blocchi: [
      { t: 'p', x: `Le prime dieci domande sono quelle del kit di Formebrevi. Le altre sono state scritte per questa app. Nella preparazione dell'incontro puoi scegliere per chi sono adatte.` },
      { t: 'domande' },
      { t: 'link', x: 'Suggerisci una domanda', href: 'mail:domanda', stile: 'chiaro' },
    ],
  },
  {
    id: 'scheda',
    gruppo: 'dopo',
    titolo: 'Scheda di riflessione',
    sotto: 'Da compilare dopo l’incontro, con l’autovalutazione del facilitatore.',
    blocchi: [],
  },
  {
    id: 'chi-siamo',
    gruppo: 'formebrevi',
    titolo: 'Chi siamo',
    sotto: 'Formebrevi APS, l’associazione che ha realizzato Dialogo.',
    blocchi: [
      { t: 'h', x: 'Chi ha realizzato Dialogo' },
      { t: 'p', x: `Dialogo è un progetto di Formebrevi APS, associazione di promozione sociale con sede a Caltanissetta. Promuove la riflessione, il pensiero critico e la produzione culturale come strumenti di formazione e di partecipazione civica.` },
      { t: 'p', x: `Formebrevi è un'associazione di volontari. Nasce nel 2015 per promuovere la cultura del libro, la lettura e la pratica del dialogo.` },
      { t: 'h', x: 'Che cosa facciamo' },
      { t: 'lista', x: [
        `**Formazione:** corsi, laboratori e seminari di pedagogia e filosofia, per chi educa e per chi vuole riflettere.`,
        `**Dialogo filosofico:** incontri aperti a tutti, online.`,
        `**Risorse gratuite:** kit didattici e guide, da scaricare liberamente con licenza Creative Commons.`,
        `**App gratuite:** Dialogo e Kalmly, per genitori ed educatori di bambini con ADHD.`,
        `**Ricerca:** un invito a contribuire con saggi in ambito pedagogico e filosofico.`,
      ] },
      { t: 'h', x: 'Porta il dialogo nel tuo territorio' },
      { t: 'p', x: `Formebrevi APS organizza laboratori, corsi di facilitazione e percorsi formativi per scuole, associazioni e comunità.` },
      { t: 'link', x: 'Scrivici per un corso o un laboratorio', href: 'mail:corso', stile: 'primario' },
      { t: 'link', x: 'Il sito di Formebrevi', href: 'sito', stile: 'chiaro' },
      { t: 'link', x: 'I corsi', href: 'corsi', stile: 'chiaro' },
      { t: 'link', x: 'Le risorse gratuite', href: 'risorse', stile: 'chiaro' },
      { t: 'link', x: 'Kalmly, l’app per l’ADHD', href: 'kalmly', stile: 'chiaro' },
      { t: 'nota', x: 'Formebrevi APS · Via Michelangelo s.n., 93100 Caltanissetta · C.F. 92064060855 · RUNTS n. 72338 del 07/11/2022' },
    ],
  },
  {
    id: 'sostieni',
    gruppo: 'formebrevi',
    titolo: 'Sostieni Formebrevi',
    sotto: 'Dialogo è gratuita: se ti è utile, aiutaci a continuare.',
    blocchi: [
      { t: 'p', x: `Dialogo è gratuita, senza pubblicità e senza account. È realizzata dai volontari di Formebrevi APS. Se ti è stata utile, puoi aiutare l'associazione a continuare.` },
      { t: 'h', x: 'Dona con PayPal' },
      { t: 'p', x: 'Una donazione libera, di qualsiasi importo.' },
      { t: 'link', x: 'Dona con PayPal', href: 'paypal', stile: 'primario' },
      { t: 'h', x: 'Associati a Formebrevi' },
      { t: 'p', x: `Diventare socio costa 10 € l'anno. Compili la domanda di ammissione, la esamina il Consiglio Direttivo e poi versi la quota. I soci partecipano gratuitamente alle sessioni di dialogo filosofico online.` },
      { t: 'link', x: 'Compila la domanda di ammissione', href: 'iscrizione', stile: 'chiaro' },
      { t: 'h', x: 'Fai conoscere Dialogo' },
      { t: 'p', x: `Il modo più semplice di aiutarci: parlane a un insegnante, a un'educatrice, a un amico che conduce gruppi.` },
      { t: 'azione', x: 'Condividi Dialogo', az: 'condividi', stile: 'chiaro' },
      { t: 'h', x: 'A che cosa serve il tuo contributo' },
      { t: 'p', x: `Il contributo aiuta l'associazione a mantenere gratuiti le app e i materiali, come Dialogo, Kalmly e i kit didattici. Grazie.` },
    ],
  },
  {
    id: 'supporto',
    gruppo: 'formebrevi',
    titolo: 'Supporto',
    sotto: 'Segnala un problema, suggerisci una domanda, scrivici.',
    blocchi: [
      { t: 'h', x: 'Serve aiuto?' },
      { t: 'p', x: `Scrivici: siamo un'associazione di volontari e rispondiamo di solito entro 3–5 giorni lavorativi.` },
      { t: 'link', x: 'Segnala un problema', href: 'mail:problema', stile: 'primario' },
      { t: 'link', x: 'Suggerisci una domanda', href: 'mail:domanda', stile: 'chiaro' },
      { t: 'link', x: 'Scrivi a Formebrevi', href: 'mail:scrivi', stile: 'chiaro' },
      { t: 'h', x: 'Prima di scrivere' },
      { t: 'lista', x: [
        `Guarda la pagina «Come funziona»: forse la risposta c'è già.`,
        `Se qualcosa non si vede bene, aggiorna la pagina con il tasto di ricarica del browser.`,
        `Dicci che telefono e che browser usi: ci aiuta a capire il problema.`,
      ] },
      { t: 'azione', x: 'Vai a «Come funziona»', az: 'pagina', id: 'come-funziona', stile: 'chiaro' },
    ],
  },
  {
    id: 'crediti',
    gruppo: 'formebrevi',
    titolo: 'Crediti e privacy',
    sotto: 'Autori, licenza, privacy e versione.',
    blocchi: [
      { t: 'h', x: 'Autori' },
      { t: 'p', x: 'Dialogo è realizzata da Formebrevi APS.' },
      { t: 'h', x: 'Contenuti e licenza' },
      { t: 'p', x: `Le fasi, le domande del kit e i cinque consigli vengono dal kit «Caffè Filosofico Fai-da-Te» di Formebrevi APS. I contenuti sono distribuiti con licenza Creative Commons BY-NC-SA 4.0: puoi usarli e condividerli per scopi non commerciali, citando la fonte. Le domande aggiuntive, i rilanci e i testi informativi sono stati scritti per questa app.` },
      { t: 'h', x: 'Privacy' },
      { t: 'p', x: `Dialogo non ha account, non ha pubblicità e non raccoglie dati. Non invia niente a nessuno. Sul telefono restano solo le impostazioni della preparazione.` },
      { t: 'h', x: 'Versione' },
      { t: 'p', x: `Dialogo, versione ${VERSIONE}.` },
    ],
  },
];
