// Logica pura di Dialogo: nessun accesso al browser, così si può provare con Node.

export const DURATE = {
  60: [8, 5, 11, 27, 9],
  90: [12, 8, 16, 41, 13],
  120: [16, 11, 22, 55, 16],
};
export const TEMPO_INTERVENTO = { piccolo: 90, medio: 60, grande: 30 };
export const FASE_GIRO = 2;
export const FASE_DIALOGO = 3;
export const MIN_DIALOGO = 10;

export function creaIncontro({ durata, gruppo, luogo, domanda, ora }) {
  const minuti = DURATE[durata];
  if (!minuti) throw new Error('Durata non valida: ' + durata);
  if (!TEMPO_INTERVENTO[gruppo]) throw new Error('Gruppo non valido: ' + gruppo);
  return {
    durata, gruppo, luogo, domanda,
    fasi: minuti.map((m) => ({ minuti: m })),
    indice: 0,
    finito: false,
    fineFase: ora + minuti[0] * 60000,
    fine: ora + minuti.reduce((a, b) => a + b, 0) * 60000,
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
    fasi[FASE_DIALOGO].minuti = Math.max(MIN_DIALOGO, (restantiMs - altriMs) / 60000);
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
    const dialogo = Math.max(MIN_DIALOGO, fasi[FASE_DIALOGO].minuti - effettivo);
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
