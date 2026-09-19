import { FASI, DOMANDE, RILANCI, PAGINE, CONTATTI, MAIL } from './content.js';
import {
  DURATE, TEMPO_INTERVENTO, creaIncontro, avanti, regolaFase, secondiFase, secondiTotali,
  formatTempo, parseNomi, creaTurni, registraIntervento, statoPersona, prossimaDomanda, proponiTre,
  domandePerPubblico, testoScheda, VOCI_AUTOVALUTAZIONE,
} from './logic.js';

// ---- Orologio (con ?veloce=30 il tempo scorre 30 volte più in fretta: serve solo per le prove) ----
const scala = Math.max(1, Number(new URLSearchParams(location.search).get('veloce')) || 1);
const t0 = Date.now();
const ora = () => t0 + (Date.now() - t0) * scala;

// ---- Impostazioni salvate solo su questo telefono ----
const CHIAVE = 'dialogo-impostazioni';
const PREDEFINITE = { durata: 90, gruppo: 'medio', luogo: 'presenza', pubblico: 'tutti' };
function leggiImpostazioni() {
  try {
    const s = { ...PREDEFINITE, ...JSON.parse(localStorage.getItem(CHIAVE) || '{}') };
    if (!DURATE[s.durata] || !TEMPO_INTERVENTO[s.gruppo] || !['presenza', 'online'].includes(s.luogo) || !['tutti', 'scuola', 'adulti'].includes(s.pubblico)) return { ...PREDEFINITE };
    return s;
  } catch { return { ...PREDEFINITE }; }
}
function salvaImpostazioni(s) {
  try { localStorage.setItem(CHIAVE, JSON.stringify({ durata: s.durata, gruppo: s.gruppo, luogo: s.luogo, pubblico: s.pubblico })); } catch { /* facoltativo */ }
}

// ---- Stato ----
const app = document.getElementById('app');
let vistaCorrente = 'apertura';
let prep = null;              // scelte della schermata di preparazione
let incontro = null;          // stato di logic.js (null in modalità «solo strumenti»)
let soloStrumenti = false;
let luogo = 'presenza';
let gruppo = 'medio';
let turni = [];
let usate = [];
let domandaCorrente = null;
let riserva = false;
let pannello = null;          // 'domanda' | 'turni' | 'rilancia' | 'tempo' | null
let rilancioAperto = null;
let silenzio = null;          // { fine } in ms dell'orologio
let intervento = null;        // { fine }
let avvisata = false;
let wakeLock = null;
let pubblico = 'tutti';       // quali domande proporre: tutti, scuola, adulti
let paginaId = null;          // pagina informativa aperta
let daVista = 'apertura';     // da dove si è arrivati alla pagina, per il tasto «Indietro»
let scheda = null;            // scheda di riflessione (resta solo in memoria)
let ultimaDomanda = '';       // testo dell'ultima domanda usata, per precompilare la scheda
const pool = () => domandePerPubblico(DOMANDE, pubblico);

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const vibra = (p) => { try { navigator.vibrate?.(p); } catch { /* non supportato */ } };
const setTesto = (id, testo) => { const el = document.getElementById(id); if (el && el.textContent !== testo) el.textContent = testo; };

async function richiediWakeLock() {
  try { if ('wakeLock' in navigator) wakeLock = await navigator.wakeLock.request('screen'); } catch { /* facoltativo */ }
}
function rilasciaWakeLock() { try { wakeLock?.release(); } catch { /* già rilasciato */ } wakeLock = null; }
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && (incontro || soloStrumenti)) richiediWakeLock();
});

// ---- Viste ----
function mostra(nome) {
  vistaCorrente = nome;
  const viste = { apertura, info, pagina, prepara, sessione, fine };
  app.innerHTML = viste[nome]();
  window.scrollTo(0, 0);
  tick();
}

function apertura() {
  return `
  <p class="marchio">Formebrevi APS</p>
  <h1 class="titolo">Dialogo</h1>
  <p class="lead">Un aiuto per condurre un dialogo filosofico di gruppo, in presenza o online.</p>
  <div class="pila">
    <button class="btn primario" data-az="prepara">Prepara un incontro</button>
    <button class="btn" data-az="solo-strumenti">Solo gli strumenti</button>
    <button class="btn chiaro" data-az="pagina" data-id="come-funziona">Come funziona</button>
    <button class="btn chiaro" data-az="info">Informazioni e sostegno</button>
  </div>
  <p class="piede">Gratuita, senza account e anche senza connessione. Contenuti dal kit «Caffè Filosofico Fai-da-Te» · Licenza CC BY-NC-SA 4.0 · Formebrevi APS</p>`;
}

function chips(chiave, valori, corrente) {
  return `<div class="chips">${valori.map(([v, testo]) =>
    `<button class="chip" data-az="imposta" data-k="${chiave}" data-v="${v}" aria-pressed="${String(v) === String(corrente)}">${testo}</button>`).join('')}</div>`;
}

function prepara() {
  const p = prep;
  return `
  <button class="indietro" data-az="apertura">← Indietro</button>
  <h1 class="titolo" style="font-size:2rem">Prepara l'incontro</h1>
  <div class="gruppo"><h2>Quanto dura?</h2>${chips('durata', [[60, '60 minuti'], [90, '90 minuti'], [120, '120 minuti']], p.durata)}</div>
  <div class="gruppo"><h2>Quante persone?</h2>${chips('gruppo', [['piccolo', 'Fino a 8'], ['medio', '9–15'], ['grande', 'Oltre 15']], p.gruppo)}</div>
  <div class="gruppo"><h2>Dove?</h2>${chips('luogo', [['presenza', 'In presenza'], ['online', 'Online']], p.luogo)}</div>
  <div class="gruppo"><h2>Per chi?</h2>${chips('pubblico', [['tutti', 'Tutti'], ['scuola', 'Scuola'], ['adulti', 'Adulti']], p.pubblico)}</div>
  <div class="gruppo"><h2>Con quale domanda?</h2>
    ${p.proposte.map((d) => `<button class="opzione" data-az="scegli" data-id="${d.id}" aria-pressed="${p.scelta && p.scelta.id === d.id}"><small>${esc(d.tema)}</small>${esc(d.testo)}</button>`).join('')}
    <div class="duo" style="margin:4px 0 12px">
      <button class="btn chiaro piccolo" data-az="sorprendi">Sorprendimi</button>
      <button class="btn chiaro piccolo" data-az="altre-tre">Altre tre</button>
    </div>
    <label for="propria" class="nota">Oppure scrivi la tua domanda:</label>
    <textarea id="propria" placeholder="Scrivi qui la domanda">${p.scelta && p.scelta.id === 0 ? esc(p.scelta.testo) : ''}</textarea>
  </div>
  <div class="gruppo"><button id="avvia" class="btn primario" data-az="avvia" ${p.scelta ? '' : 'disabled'}>Inizia l'incontro</button></div>`;
}

function sessione() {
  const st = incontro;
  const barra = soloStrumenti
    ? `<div class="barra"><span class="fase">Solo gli strumenti</span></div>`
    : `<div class="barra"><span class="fase">Fase ${st.indice + 1} di ${FASI.length} · ${esc(FASI[st.indice].titolo)}</span><span class="tempo" id="tFase">--:--</span></div>
       <p class="totale">Tempo dell'incontro: <strong id="tTot">--:--</strong></p>`;
  let corpo;
  if (soloStrumenti) {
    corpo = `<div class="scheda"><h1>Gli strumenti sono qui sotto</h1><p class="cosa">Scegli una domanda, segna i turni di parola, cerca una frase per rilanciare o avvia un silenzio.</p></div>`;
  } else {
    const f = FASI[st.indice];
    corpo = `
      <div class="domanda-box"><small>La domanda</small>${esc(st.domanda.testo)}</div>
      <div class="scheda"><p class="cosa">${esc(luogo === 'online' ? f.online : f.cosa)}</p>
      <p class="dici">Puoi dire: «${esc(f.dici)}»</p></div>
      <div class="avanza"><button class="btn primario" data-az="avanti">${st.indice === FASI.length - 1 ? 'Concludi' : 'Avanti →'}</button></div>`;
  }
  return `${barra}${corpo}
  <nav class="strumenti" aria-label="Strumenti">
    <button class="btn chiaro" data-az="pannello" data-p="domanda">Domanda</button>
    <button class="btn chiaro" data-az="pannello" data-p="turni">Turni</button>
    <button class="btn chiaro" data-az="pannello" data-p="rilancia">Rilancia</button>
    <button class="btn chiaro" data-az="pannello" data-p="tempo">Tempo</button>
  </nav>
  ${pannello ? disegnaPannello() : ''}`;
}

function fine() {
  return `
  <p class="marchio">Formebrevi APS</p>
  <h1 class="titolo" style="font-size:2rem">Incontro concluso</h1>
  <div class="scheda"><p class="cosa">Non concludere: lascia il pensiero aperto.</p></div>
  <p class="nota">Ti è stata utile Dialogo? Compila la scheda di riflessione o sostieni Formebrevi, che ha realizzato la app.</p>
  <div class="pila">
    <button class="btn chiaro" data-az="pagina" data-id="scheda">Compila la scheda di riflessione</button>
    <button class="btn chiaro" data-az="pagina" data-id="sostieni">Sostieni Formebrevi</button>
    <button class="btn primario" data-az="apertura">Torna all'inizio</button>
  </div>`;
}

// ---- Informazioni, pagine e scheda ----
const ricco = (t) => esc(t).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
const risolviHref = (h) => (h.startsWith('mail:') ? MAIL[h.slice(5)] : CONTATTI[h]);

function tabellaDurate() {
  const righe = FASI.map((f, i) => `<tr><td>${i + 1} · ${esc(f.titolo)}</td>${[60, 90, 120].map((d) => `<td>${DURATE[d][i]}</td>`).join('')}</tr>`).join('');
  return `<table class="tabella"><thead><tr><th>Fase</th><th>60 min</th><th>90 min</th><th>120 min</th></tr></thead><tbody>${righe}</tbody></table>`;
}

function elencoDomande() {
  const gruppi = [['tutti', 'Per tutti'], ['scuola', 'Per la scuola'], ['adulti', 'Per gli adulti']];
  return gruppi.map(([k, titolo]) => `<h3 class="info-h">${titolo}</h3>` +
    DOMANDE.filter((d) => d.pubblico === k).map((d) => `<p class="frase"><small class="etichetta-tema">${esc(d.tema)}</small>${esc(d.testo)}</p>`).join('')).join('');
}

function blocco(b) {
  switch (b.t) {
    case 'h': return `<h3 class="info-h">${esc(b.x)}</h3>`;
    case 'p': return `<p class="info-p">${ricco(b.x)}</p>`;
    case 'lista': return `<ul class="info-lista">${b.x.map((v) => `<li>${ricco(v)}</li>`).join('')}</ul>`;
    case 'passi': return `<ol class="info-passi">${b.x.map((v) => `<li><strong>${esc(v.titolo)}</strong> ${ricco(v.testo)}</li>`).join('')}</ol>`;
    case 'nota': return `<p class="consiglio">${ricco(b.x)}</p>`;
    case 'link': {
      const h = risolviHref(b.href);
      return `<a class="btn ${b.stile || 'chiaro'} info-btn" href="${esc(h)}"${h.startsWith('http') ? ' target="_blank" rel="noopener"' : ''}>${esc(b.x)}</a>`;
    }
    case 'azione': return `<button class="btn ${b.stile || 'chiaro'} info-btn" data-az="${esc(b.az)}"${b.id ? ` data-id="${esc(b.id)}"` : ''}>${esc(b.x)}</button>`;
    case 'domande': return elencoDomande();
    case 'durate': return tabellaDurate();
    default: return '';
  }
}

function info() {
  const gruppi = [['imparare', 'Per condurre bene'], ['dopo', "Dopo l'incontro"], ['formebrevi', 'Formebrevi']];
  return `
  <button class="indietro" data-az="apertura">← Indietro</button>
  <h1 class="titolo" style="font-size:2rem">Informazioni e sostegno</h1>
  <p class="lead">Per condurre meglio un dialogo e per sostenere chi ha realizzato la app.</p>
  ${gruppi.map(([g, titolo]) => `<h2 class="grp">${esc(titolo)}</h2>` +
    PAGINE.filter((p) => p.gruppo === g).map((p) => `<button class="voce" data-az="pagina" data-id="${p.id}"><strong>${esc(p.titolo)}</strong><span>${esc(p.sotto)}</span></button>`).join('')).join('')}`;
}

function pagina() {
  const p = PAGINE.find((x) => x.id === paginaId);
  const corpo = p.id === 'scheda' ? vistaScheda() : p.blocchi.map(blocco).join('');
  return `
  <button class="indietro" data-az="pagina-indietro">← Indietro</button>
  <h1 class="titolo" style="font-size:2rem">${esc(p.titolo)}</h1>
  <p class="lead">${esc(p.sotto)}</p>
  <div class="info">${corpo}</div>`;
}

const nuovaScheda = () => ({
  data: new Date().toLocaleDateString('it-IT'), luogo: '', domanda: ultimaDomanda, partecipanti: '',
  bene: '', cambiare: '', frase: '', voti: [0, 0, 0, 0, 0],
});

function vistaScheda() {
  const s = scheda;
  const campo = (k, etichetta, area) => `<label class="campo" for="c-${k}">${etichetta}</label>` +
    (area ? `<textarea id="c-${k}" data-campo="${k}">${esc(s[k])}</textarea>` : `<input type="text" id="c-${k}" data-campo="${k}" value="${esc(s[k])}">`);
  return `
  <p class="nota">Compila la scheda entro 24 ore dall'incontro, come suggerisce il kit. Non viene salvata: alla fine la copi nelle tue note.</p>
  ${campo('data', 'Data')}${campo('luogo', 'Luogo')}${campo('domanda', 'Domanda usata', true)}
  ${campo('partecipanti', 'Numero di partecipanti e composizione del gruppo')}
  ${campo('bene', 'Che cosa ha funzionato bene?', true)}${campo('cambiare', 'Che cosa cambieresti la prossima volta?', true)}
  ${campo('frase', 'Una frase o un pensiero emerso che ti ha colpito', true)}
  <h3 class="info-h">Autovalutazione</h3><p class="nota">Da 1 (poco) a 5 (molto). Tocca di nuovo per togliere il voto.</p>
  ${VOCI_AUTOVALUTAZIONE.map((v, i) => `<div class="voto-riga"><p>${esc(v)}</p><div class="voti">${[1, 2, 3, 4, 5].map((n) =>
    `<button class="chip voto" data-az="voto" data-i="${i}" data-v="${n}" aria-pressed="${s.voti[i] === n}">${n}</button>`).join('')}</div></div>`).join('')}
  <div class="pila" style="margin-top:18px">
    <button class="btn primario" data-az="copia-scheda">Copia il testo</button>
    <button class="btn chiaro" data-az="condividi-scheda">Condividi</button>
  </div>`;
}

function avviso(testo) {
  const el = document.createElement('div');
  el.className = 'avviso';
  el.setAttribute('role', 'status');
  el.textContent = testo;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2200);
}

async function copia(testo) {
  try {
    await navigator.clipboard.writeText(testo);
    avviso('Copiato negli appunti');
  } catch {
    const t = document.createElement('textarea');
    t.value = testo; document.body.appendChild(t); t.select();
    try { document.execCommand('copy'); avviso('Copiato negli appunti'); } catch { avviso('Non è stato possibile copiare'); }
    t.remove();
  }
}

async function condividi(testo, url) {
  try {
    if (navigator.share) { await navigator.share(url ? { title: 'Dialogo', text: testo, url } : { title: 'Scheda di riflessione', text: testo }); return; }
  } catch (e) { if (e && e.name === 'AbortError') return; }
  await copia(url ? testo + ' ' + url : testo);
}

// ---- Pannelli degli strumenti ----
function testaPannello(titolo) {
  return `<div class="foglio-testa"><h2>${titolo}</h2><button class="chiudi" data-az="chiudi">Chiudi</button></div>`;
}

function disegnaPannello() {
  let dentro = '';
  if (pannello === 'domanda') dentro = pannelloDomanda();
  if (pannello === 'turni') dentro = pannelloTurni();
  if (pannello === 'rilancia') dentro = pannelloRilancia();
  if (pannello === 'tempo') dentro = pannelloTempo();
  return `<div class="velo" data-az="velo"><div class="foglio" role="dialog" aria-modal="true">${dentro}</div></div>`;
}

function pannelloDomanda() {
  const d = domandaCorrente;
  return `${testaPannello('Domanda')}
  ${d ? `${riserva ? '<span class="etichetta-riserva">Domanda di riserva</span>' : ''}
    <p class="grande">${esc(d.testo)}</p>${d.tema ? `<p class="tema">Tema: ${esc(d.tema)}</p>` : ''}`
    : '<p class="nota">Scegli una domanda con uno dei pulsanti.</p>'}
  <div class="pila">
    ${d && d.tema ? '<button class="btn chiaro" data-az="altra-tema">Altra dello stesso tema</button>' : ''}
    <button class="btn chiaro" data-az="a-caso">Una a caso</button>
    <button class="btn" data-az="riserva">Domanda di riserva</button>
  </div>
  <p class="nota" style="margin-top:14px">La domanda di riserva serve quando il dialogo si blocca: ne trovi una nuova, mai usata in questo incontro.</p>`;
}

function pannelloTurni() {
  if (!turni.length) {
    return `${testaPannello('Turni')}
    <p class="nota">Scrivi un nome per riga, oppure solo il numero delle persone (per esempio 8). I nomi restano su questo telefono e vengono cancellati a fine incontro.</p>
    <textarea id="nomi" placeholder="Anna&#10;Marco&#10;Luca"></textarea>
    <div class="gruppo"><button class="btn primario" data-az="salva-nomi">Salva</button></div>`;
  }
  const tempi = [[0, 'Spento'], [30, '30 s'], [60, '60 s'], [90, '90 s']];
  const tInt = incontro ? incontro.tempoIntervento : (window.__tint || 0);
  return `${testaPannello('Turni')}
  <p class="nota">Tocca il nome di chi prende la parola. In arancione chi non ha ancora parlato, in rosa chi ha parlato molto.</p>
  ${turni.map((t, i) => `<button class="riga ${statoPersona(turni, i) === 'normale' ? '' : statoPersona(turni, i)}" data-az="parla" data-i="${i}"><span>${esc(t.nome)}</span><span class="n">${t.interventi}</span></button>`).join('')}
  <div class="sezione"><h3>Tempo per ogni intervento</h3>${chips('tint', tempi, tInt)}
    ${intervento ? '<div class="contatore" id="tInt">--</div><button class="btn chiaro piccolo" data-az="ferma-intervento">Ferma</button>' : ''}</div>
  <div class="sezione"><button class="btn chiaro piccolo" data-az="cambia-nomi">Cambia l'elenco</button></div>`;
}

function pannelloRilancia() {
  if (rilancioAperto) {
    const r = RILANCI.find((x) => x.id === rilancioAperto);
    return `${testaPannello(esc(r.titolo))}
    <button class="indietro" data-az="rilancio-indietro">← Altre situazioni</button>
    ${r.frasi.map((f) => `<p class="frase">«${esc(f)}»</p>`).join('')}
    <p class="consiglio">${esc(r.consiglio)}</p>`;
  }
  return `${testaPannello('Rilancia')}
  <p class="nota">Che cosa sta succedendo?</p>
  ${RILANCI.map((r) => `<button class="riga" data-az="rilancio" data-id="${r.id}"><span>${esc(r.titolo)}</span><span>›</span></button>`).join('')}`;
}

function pannelloTempo() {
  const blocco = incontro
    ? `<p class="nota">Nell'incontro: <strong id="pTot">--:--</strong> · Nella fase: <strong id="pFase">--:--</strong></p>
       <div class="duo"><button class="btn chiaro" data-az="regola" data-d="-5">Accorcia 5 min</button><button class="btn chiaro" data-az="regola" data-d="5">Allunga 5 min</button></div>`
    : '';
  return `${testaPannello('Tempo')}
  ${blocco}
  <div class="sezione"><h3>Silenzio</h3>
    <div class="duo"><button class="btn chiaro" data-az="silenzio" data-s="60">1 minuto</button><button class="btn chiaro" data-az="silenzio" data-s="20">20 secondi</button></div>
    ${silenzio ? '<div class="contatore" id="tSil">--</div><button class="btn chiaro piccolo" data-az="ferma-silenzio">Ferma</button>' : ''}
    <p class="nota" style="margin-top:10px">Un silenzio di 20 secondi non è imbarazzante: è pensiero in corso.</p></div>`;
}

// ---- Azioni ----
function nuovaDomanda(tema, comeRiserva) {
  const d = prossimaDomanda(pool(), usate, tema, Math.random);
  usate.push(d.id);
  domandaCorrente = d;
  riserva = comeRiserva;
}

function azzera() {
  incontro = null; soloStrumenti = false; turni = []; usate = []; domandaCorrente = null; riserva = false;
  pannello = null; rilancioAperto = null; silenzio = null; intervento = null; avvisata = false;
  window.__tint = 0;
  rilasciaWakeLock();
}

const azioni = {
  apertura: () => { azzera(); scheda = null; mostra('apertura'); },
  info: () => mostra('info'),
  pagina: (d) => {
    if (vistaCorrente !== 'pagina') daVista = vistaCorrente;
    paginaId = d.id;
    if (d.id === 'scheda' && !scheda) scheda = nuovaScheda();
    mostra('pagina');
  },
  'pagina-indietro': () => mostra(['info', 'fine'].includes(daVista) ? daVista : 'apertura'),
  condividi: () => condividi('Dialogo: la app gratuita per condurre un dialogo filosofico di gruppo.', CONTATTI.app),
  voto: (d) => {
    const i = Number(d.i), v = Number(d.v);
    scheda.voti[i] = scheda.voti[i] === v ? 0 : v;
    document.querySelectorAll(`.voto[data-i="${i}"]`).forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.v) === scheda.voti[i])));
  },
  'copia-scheda': () => copia(testoScheda(scheda)),
  'condividi-scheda': () => condividi(testoScheda(scheda)),
  prepara: () => {
    prep = { ...leggiImpostazioni(), scelta: null };
    pubblico = prep.pubblico;
    prep.proposte = proponiTre(pool());
    mostra('prepara');
  },
  imposta: (d) => {
    prep[d.k] = d.k === 'durata' ? Number(d.v) : d.v;
    if (d.k === 'pubblico') { pubblico = d.v; prep.proposte = proponiTre(pool()); prep.scelta = null; }
    mostra('prepara');
  },
  scegli: (d) => { prep.scelta = pool().find((x) => x.id === Number(d.id)); mostra('prepara'); },
  sorprendi: () => {
    const tutte = pool();
    prep.scelta = tutte[Math.floor(Math.random() * tutte.length)];
    prep.proposte = [prep.scelta, ...proponiTre(tutte.filter((x) => x.id !== prep.scelta.id)).slice(0, 2)];
    mostra('prepara');
  },
  'altre-tre': () => { prep.proposte = proponiTre(pool()); prep.scelta = null; mostra('prepara'); },
  avvia: () => {
    salvaImpostazioni(prep);
    luogo = prep.luogo; gruppo = prep.gruppo; pubblico = prep.pubblico;
    ultimaDomanda = prep.scelta.testo;
    incontro = creaIncontro({ durata: prep.durata, gruppo: prep.gruppo, luogo: prep.luogo, domanda: prep.scelta, ora: ora() });
    usate = prep.scelta.id > 0 ? [prep.scelta.id] : [];
    domandaCorrente = prep.scelta;
    soloStrumenti = false; turni = []; pannello = null; avvisata = false;
    richiediWakeLock();
    mostra('sessione');
  },
  'solo-strumenti': () => {
    const s = leggiImpostazioni();
    azzera();
    soloStrumenti = true; luogo = s.luogo; gruppo = s.gruppo; pubblico = s.pubblico;
    richiediWakeLock();
    mostra('sessione');
  },
  avanti: () => {
    incontro = avanti(incontro, ora());
    avvisata = false; intervento = null;
    if (incontro.finito) { azzera(); mostra('fine'); return; }
    mostra('sessione');
  },
  pannello: (d) => { pannello = d.p; rilancioAperto = null; mostra('sessione'); },
  chiudi: () => { pannello = null; mostra('sessione'); },
  velo: (d, e) => { if (e.target === e.currentTarget) azioni.chiudi(); },
  'altra-tema': () => { nuovaDomanda(domandaCorrente.tema, false); mostra('sessione'); },
  'a-caso': () => { nuovaDomanda(null, false); mostra('sessione'); },
  riserva: () => { nuovaDomanda(null, true); mostra('sessione'); },
  'salva-nomi': () => { turni = creaTurni(parseNomi(document.getElementById('nomi').value)); mostra('sessione'); },
  'cambia-nomi': () => { turni = []; intervento = null; mostra('sessione'); },
  parla: (d) => {
    turni = registraIntervento(turni, Number(d.i));
    const secondi = incontro ? incontro.tempoIntervento : (window.__tint || 0);
    intervento = secondi > 0 ? { fine: ora() + secondi * 1000 } : null;
    mostra('sessione');
  },
  'ferma-intervento': () => { intervento = null; mostra('sessione'); },
  rilancio: (d) => { rilancioAperto = d.id; mostra('sessione'); },
  'rilancio-indietro': () => { rilancioAperto = null; mostra('sessione'); },
  regola: (d) => {
    incontro = regolaFase(incontro, Number(d.d));
    mostra('sessione');
  },
  silenzio: (d) => { silenzio = { fine: ora() + Number(d.s) * 1000 }; mostra('sessione'); },
  'ferma-silenzio': () => { silenzio = null; mostra('sessione'); },
};

app.addEventListener('click', (e) => {
  const el = e.target.closest('[data-az]');
  if (!el) return;
  // Il pulsante «chip» del tempo per intervento usa la stessa azione «imposta» ma agisce sui turni
  if (el.dataset.az === 'imposta' && el.dataset.k === 'tint') {
    const v = Number(el.dataset.v);
    if (incontro) incontro = { ...incontro, tempoIntervento: v }; else window.__tint = v;
    mostra('sessione');
    return;
  }
  const fn = azioni[el.dataset.az];
  if (fn) fn(el.dataset, e);
});

app.addEventListener('input', (e) => {
  if (e.target.dataset && e.target.dataset.campo && scheda) { scheda[e.target.dataset.campo] = e.target.value; return; }
  if (e.target.id === 'propria') {
    const testo = e.target.value.trim();
    prep.scelta = testo ? { id: 0, tema: '', testo } : null;
    const b = document.getElementById('avvia');
    if (b) b.disabled = !prep.scelta;
    document.querySelectorAll('.opzione').forEach((o) => o.setAttribute('aria-pressed', 'false'));
  }
});

// ---- Orologio a schermo ----
function tick() {
  const t = ora();
  if (incontro && !incontro.finito) {
    const sf = secondiFase(incontro, t);
    setTesto('tFase', formatTempo(sf));
    document.getElementById('tFase')?.classList.toggle('scaduto', sf <= 0);
    setTesto('tTot', formatTempo(secondiTotali(incontro, t)));
    setTesto('pFase', formatTempo(sf));
    setTesto('pTot', formatTempo(secondiTotali(incontro, t)));
    if (sf > 0) avvisata = false;
    if (sf <= 0 && !avvisata) { avvisata = true; vibra([300, 150, 300]); }
  }
  if (silenzio) {
    const r = Math.ceil((silenzio.fine - t) / 1000);
    if (r <= 0) { silenzio = null; vibra([300, 150, 300]); if (vistaCorrente === 'sessione') mostra('sessione'); }
    else setTesto('tSil', formatTempo(r));
  }
  if (intervento) {
    const r = Math.ceil((intervento.fine - t) / 1000);
    if (r <= 0) { intervento = null; vibra([200, 100, 200]); if (vistaCorrente === 'sessione') mostra('sessione'); }
    else setTesto('tInt', formatTempo(r));
  }
}
setInterval(tick, 250);

if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
mostra('apertura');
