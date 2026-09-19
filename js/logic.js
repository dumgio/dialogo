// Logica pura di Dialogo: nessun accesso al browser, così si può provare con Node.

export const DURATE = {
  60: [8, 5, 11, 27, 9],
  90: [12, 8, 16, 41, 13],
  120: [16, 11, 22, 55, 16],
};
export const DURATA_MIN = 30;
export const DURATA_MAX = 240;
const PESI_FASI = [15, 10, 20, 50, 15]; // le proporzioni del kit (110 minuti in tutto)
export const TEMPO_INTERVENTO = { piccolo: 90, medio: 60, grande: 30 };
export const FASE_GIRO = 2;
export const FASE_DIALOGO = 3;
export const MIN_DIALOGO = 10;

// Minuti di ciascuna fase per una durata qualsiasi tra DURATA_MIN e DURATA_MAX.
// Per 60, 90 e 120 minuti si usa la tabella; per le altre durate si rispettano le proporzioni del kit
// e il dialogo aperto prende il resto, così la somma è sempre esatta.
export function minutiFasi(totale) {
  if (DURATE[totale]) return [...DURATE[totale]];
  const somma = PESI_FASI.reduce((a, b) => a + b, 0);
  const fasi = PESI_FASI.map((p) => Math.max(1, Math.round((totale * p) / somma)));
  const altri = fasi.reduce((a, m, i) => (i === FASE_DIALOGO ? a : a + m), 0);
  fasi[FASE_DIALOGO] = totale - altri;
  return fasi;
}

// Crea un incontro. Con «minuti» (5 numeri) le fasi sono quelle indicate; altrimenti si calcolano da «durata».
export function creaIncontro({ durata, gruppo, luogo, domanda, ora, minuti }) {
  let fasiMinuti = minuti;
  if (fasiMinuti) {
    if (!Array.isArray(fasiMinuti) || fasiMinuti.length !== PESI_FASI.length || !fasiMinuti.every((m) => Number.isFinite(m) && m >= 1)) {
      throw new Error('Fasi non valide: servono 5 numeri di minuti, ciascuno di almeno 1');
    }
  } else {
    if (!Number.isInteger(durata) || durata < DURATA_MIN || durata > DURATA_MAX) throw new Error('Durata non valida: ' + durata);
    fasiMinuti = minutiFasi(durata);
  }
  if (!TEMPO_INTERVENTO[gruppo]) throw new Error('Gruppo non valido: ' + gruppo);
  const totale = fasiMinuti.reduce((a, b) => a + b, 0);
  return {
    durata: totale, gruppo, luogo, domanda,
    fasi: fasiMinuti.map((m) => ({ minuti: m })),
    indice: 0,
    finito: false,
    fineFase: ora + fasiMinuti[0] * 60000,
    fine: ora + totale * 60000,
    minDialogo: Math.min(MIN_DIALOGO, fasiMinuti[FASE_DIALOGO]),
    tempoIntervento: 0,
  };
}

// Passa alla fase successiva. Il tempo risparmiato (o perso) nella fase appena chiusa passa al dialogo aperto,
// così la fine prevista dell'incontro non si sposta. Il dialogo non scende sotto i 10 minuti: se serve, la fine slitta.
export function avanti(st, ora) {
  if (st.indice >= st.fasi.length - 1) return { ...st, finito: true };
  const indice = st.indice + 1;
  const fasi = st.fasi.map((f) => ({ ...f }));
  let fine;
  if (indice <= FASE_DIALOGO) {
    const restantiMs = st.fine - ora;
    const altriMs = fasi.reduce((somma, f, k) => (k >= indice && k !== FASE_DIALOGO ? somma + f.minuti * 60000 : somma), 0);
    fasi[FASE_DIALOGO].minuti = Math.max(st.minDialogo ?? MIN_DIALOGO, (restantiMs - altriMs) / 60000);
    fine = ora + fasi.slice(indice).reduce((somma, f) => somma + f.minuti * 60000, 0);
  } else {
    fine = ora + fasi[indice].minuti * 60000;
  }
  return {
    ...st,
    fasi,
    indice,
    fineFase: ora + fasi[indice].minuti * 60000,
    fine,
    tempoIntervento: indice === FASE_GIRO ? TEMPO_INTERVENTO[st.gruppo] : 0,
  };
}

// Secondi che restano nella fase in corso. Diventano negativi quando il tempo è scaduto.
export function secondiFase(st, ora) {
  return Math.round((st.fineFase - ora) / 1000);
}

// Secondi che restano alla fine prevista dell'incontro.
export function secondiTotali(st, ora) {
  return Math.round((st.fine - ora) / 1000);
}

// Allunga (delta > 0) o accorcia (delta < 0) la fase in corso.
// Se la fase in corso viene prima del dialogo aperto, il dialogo assorbe la differenza (minimo 10 minuti).
export function regolaFase(st, deltaMin) {
  const fasi = st.fasi.map((f) => ({ ...f }));
  const i = st.indice;
  const nuovo = Math.max(1, fasi[i].minuti + deltaMin);
  const effettivo = nuovo - fasi[i].minuti;
  fasi[i].minuti = nuovo;
  let variazioneTotale = effettivo;
  if (i < FASE_DIALOGO) {
    const dialogo = Math.max(st.minDialogo ?? MIN_DIALOGO, fasi[FASE_DIALOGO].minuti - effettivo);
    variazioneTotale = effettivo - (fasi[FASE_DIALOGO].minuti - dialogo);
    fasi[FASE_DIALOGO].minuti = dialogo;
  }
  return {
    ...st,
    fasi,
    fineFase: st.fineFase + effettivo * 60000,
    fine: st.fine + variazioneTotale * 60000,
  };
}

export function formatTempo(secondi) {
  const s = Math.abs(secondi);
  const mm = Math.floor(s / 60);
  const ss = String(s % 60).padStart(2, '0');
  return (secondi < 0 ? '+' : '') + mm + ':' + ss;
}

// ---- Turni di parola ----

export function parseNomi(testo) {
  const t = String(testo).trim();
  if (/^\d+$/.test(t)) {
    const n = Math.min(Number(t), 40);
    return Array.from({ length: n }, (_, i) => 'Persona ' + (i + 1));
  }
  return t.split(/[\n,;]+/).map((s) => s.trim()).filter(Boolean).slice(0, 40);
}

export function creaTurni(nomi) {
  return nomi.map((nome) => ({ nome, interventi: 0 }));
}

export function registraIntervento(turni, i) {
  return turni.map((t, k) => (k === i ? { ...t, interventi: t.interventi + 1 } : t));
}

// 'silenzio': non ha ancora parlato mentre altri sì. 'molto': parla almeno il doppio della media.
export function statoPersona(turni, i) {
  const totale = turni.reduce((s, t) => s + t.interventi, 0);
  const media = totale / turni.length;
  const n = turni[i].interventi;
  if (n === 0 && totale >= 3) return 'silenzio';
  if (n >= 3 && n >= 2 * media) return 'molto';
  return 'normale';
}

// ---- Domande ----

export function prossimaDomanda(domande, usate, tema, rand = Math.random) {
  const libere = domande.filter((d) => !usate.includes(d.id));
  const inTema = tema ? libere.filter((d) => d.tema === tema) : libere;
  const pool = inTema.length ? inTema : libere.length ? libere : domande;
  return pool[Math.floor(rand() * pool.length)];
}

export function proponiTre(domande, rand = Math.random) {
  const copia = [...domande];
  const scelte = [];
  const temi = new Set();
  while (scelte.length < 3 && copia.length) {
    const d = copia.splice(Math.floor(rand() * copia.length), 1)[0];
    if (!temi.has(d.tema)) {
      temi.add(d.tema);
      scelte.push(d);
    }
  }
  return scelte;
}

// ---- Domande per pubblico ----

// «tutti» = tutte le domande; «scuola» o «adulti» = le domande per tutti più quelle specifiche.
export function domandePerPubblico(domande, pubblico) {
  if (pubblico === 'tutti') return domande;
  return domande.filter((d) => d.pubblico === 'tutti' || d.pubblico === pubblico);
}

// ---- Scheda di riflessione (dal kit) ----

export const VOCI_AUTOVALUTAZIONE = [
  'Ho lasciato parlare tutti i partecipanti',
  'Ho gestito bene le interruzioni',
  'Ho riformulato senza interpretare',
  'Ho mantenuto un clima aperto e non giudicante',
  'Il gruppo si è sentito a proprio agio',
];

// Compone il testo da copiare o condividere. Non salva niente.
export function testoScheda(s) {
  const v = (x, vuoto) => (x && String(x).trim() ? String(x).trim() : vuoto);
  const righe = [
    'Scheda di riflessione del facilitatore',
    '',
    'Data: ' + v(s.data, 'non indicata'),
    'Luogo: ' + v(s.luogo, 'non indicato'),
    'Domanda: ' + v(s.domanda, 'non indicata'),
    'Partecipanti: ' + v(s.partecipanti, 'non indicati'),
    '',
    'Che cosa ha funzionato bene?',
    v(s.bene, '—'),
    '',
    'Che cosa cambieresti la prossima volta?',
    v(s.cambiare, '—'),
    '',
    'Una frase o un pensiero emerso che ti ha colpito',
    v(s.frase, '—'),
    '',
    'Autovalutazione (da 1 = poco a 5 = molto)',
  ];
  VOCI_AUTOVALUTAZIONE.forEach((voce, i) => righe.push(voce + ': ' + (s.voti[i] ? s.voti[i] + '/5' : 'non indicato')));
  return righe.join('\n');
}

// ---- Ripresa dell'incontro ----

const OTTO_ORE = 8 * 60 * 60 * 1000;

// Controlla che un incontro salvato sul telefono si possa riprendere: struttura corretta, non concluso, non troppo vecchio.
export function incontroSalvatoValido(dati, adesso) {
  if (!dati || typeof dati.ts !== 'number' || adesso - dati.ts > OTTO_ORE) return false;
  const inc = dati.incontro;
  return !!inc && !inc.finito && Array.isArray(inc.fasi) && inc.fasi.length === PESI_FASI.length
    && Number.isInteger(inc.indice) && inc.indice >= 0 && inc.indice < PESI_FASI.length
    && Number.isFinite(inc.fine) && Number.isFinite(inc.fineFase)
    && inc.fasi.every((f) => f && Number.isFinite(f.minuti) && f.minuti >= 1);
}
