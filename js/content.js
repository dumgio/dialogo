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
];

export const DOMANDE = [
  { id: 1, tema: 'Identità', testo: 'Siamo liberi di scegliere chi essere, o siamo il prodotto di ciò che ci è capitato?' },
  { id: 2, tema: 'Giustizia', testo: 'È possibile essere giusti senza essere crudeli?' },
  { id: 3, tema: 'Verità', testo: "Ha ancora senso cercare la verità in un'epoca di opinioni infinite?" },
  { id: 4, tema: 'Felicità', testo: 'La felicità si può imparare, o è un caso?' },
  { id: 5, tema: 'Diversità', testo: 'La diversità arricchisce sempre, o può anche dividere?' },
  { id: 6, tema: 'Tecnologia', testo: 'Le macchine possono pensare, o solo simulare il pensiero?' },
  { id: 7, tema: 'Tempo', testo: 'Il passato esiste ancora, o esiste solo il presente?' },
  { id: 8, tema: 'Responsabilità', testo: 'Fino a che punto siamo responsabili delle sofferenze degli altri?' },
  { id: 9, tema: 'Linguaggio', testo: 'Le parole creano la realtà o la descrivono soltanto?' },
  { id: 10, tema: 'Senso', testo: 'Ha senso fare il bene se non serve a nulla?' },
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
