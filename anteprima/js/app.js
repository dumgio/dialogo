import { FASI, DOMANDE, TEMI, RILANCI, PAGINE, CONTATTI } from './content.js';
import {
  DURATE, DURATA_MIN, DURATA_MAX, TEMPO_INTERVENTO, creaIncontro, avanti, regolaFase, secondiFase, secondiTotali,
  formatTempo, parseNomi, creaTurni, registraIntervento, statoPersona, prossimaDomanda, proponiTre,
  domandePerPubblico, testoScheda, minutiFasi, incontroSalvatoValido,
} from './logic.js';
import {
  esc, chips, editorDurata, controlliDomande, chipsPubblico, accordionDomande, blocco, vistaScheda,
} from './ui.js';

// ---- Orologio (con ?veloce=30 il tempo scorre 30 volte più in fretta: serve solo per le prove) ----
const scala = Math.max(1, Number(new URLSearchParams(location.search).get('veloce')) || 1);
const t0 = Date.now();
const ora = () => t0 + (Date.now() - t0) * scala;

// ---- Memoria del telefono: solo impostazioni e, durante un incontro, il suo stato (mai i nomi) ----
const CHIAVE = 'dialogo-impostazioni';
const CHIAVE_INCONTRO = 'dialogo-incontro';
const PREDEFINITE = { durata: 90, gruppo: 'medio', luogo: 'presenza', pubblico: 'tutti', suono: false };

function leggiImpostazioni() {
  try {
    const s = { ...PREDEFINITE, ...JSON.parse(localStorage.getItem(CHIAVE) || '{}') };
    const valida = Number.isInteger(s.durata) && s.durata >= DURATA_MIN && s.durata <= DURATA_MAX
      && TEMPO_INTERVENTO[s.gruppo] && ['presenza', 'online'].includes(s.luogo)
      && ['tutti', 'scuola', 'adulti'].includes(s.pubblico) && typeof s.suono === 'boolean';
    return valida ? s : { ...PREDEFINITE };
  } catch { return { ...PREDEFINITE }; }
}
function salvaImpostazioni(s) {
  try {
    localStorage.setItem(CHIAVE, JSON.stringify({ durata: s.durata, gruppo: s.gruppo, luogo: s.luogo, pubblico: s.pubblico, suono: !!s.suono }));
  } catch { /* facoltativo */ }
}

function salvaIncontro() {
  if (!incontro || soloStrumenti || scala !== 1) return;
  try {
    localStorage.setItem(CHIAVE_INCONTRO, JSON.stringify({ ts: Date.now(), incontro, usate, luogo, gruppo, pubblico, domandaCorrente, riserva, suono }));
  } catch { /* facoltativo */ }
}
function leggiIncontroSalvato() {
  try {
    const dati = JSON.parse(localStorage.getItem(CHIAVE_INCONTRO) || 'null');
    return incontroSalvatoValido(dati, Date.now()) ? dati : null;
  } catch { return null; }
}
function cancellaIncontroSalvato() {
  try { localStorage.removeItem(CHIAVE_INCONTRO); } catch { /* facoltativo */ }
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
let suono = false;            // suono di avviso acceso o spento
let audio = null;
let sfoglia = null;           // 'prepara' | 'sessione' | null: elenco delle domande aperto
let temaAperto = null;        // argomento aperto nell'elenco delle domande
let cerca = '';               // testo cercato nell'elenco delle domande
let filtroSfoglia = 'tutti';  // filtro «per chi» dell'elenco delle domande
let overlayVisibile = false;

const pool = () => domandePerPubblico(DOMANDE, pubblico);
const poolSfoglia = () => domandePerPubblico(DOMANDE, filtroSfoglia);
const setTesto = (id, testo) => { const el = document.getElementById(id); if (el && el.textContent !== testo) el.textContent = testo; };

// ---- Avvisi: vibrazione e suono ----
const vibra = (p) => { try { navigator.vibrate?.(p); } catch { /* non supportato */ } };

function preparaAudio() {
  try {
    audio = audio || new (window.AudioContext || window.webkitAudioContext)();
    if (audio.state === 'suspended') audio.resume();
  } catch { /* facoltativo */ }
}
function suona(note) {
  if (!suono || !audio) return;
  try {
    let t = audio.currentTime;
    for (const f of note) {
      const o = audio.createOscillator();
      const g = audio.createGain();
      o.type = 'sine';
      o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.3, t + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
      o.connect(g).connect(audio.destination);
      o.start(t);
      o.stop(t + 0.45);
      t += 0.5;
    }
  } catch { /* facoltativo */ }
}
const avvisoFase = () => { vibra([300, 150, 300]); suona([660, 880, 660]); };
const avvisoBreve = () => { vibra([200, 100, 200]); suona([740]); };

async function richiediWakeLock() {
  try { if ('wakeLock' in navigator) wakeLock = await navigator.wakeLock.request('screen'); } catch { /* facoltativo */ }
}
function rilasciaWakeLock() { try { wakeLock?.release(); } catch { /* già rilasciato */ } wakeLock = null; }
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && (incontro || soloStrumenti)) richiediWakeLock();
});

// ---- Viste ----
function mostra(nome, mantieniScroll) {
  const y = window.scrollY;
  vistaCorrente = nome;
  const viste = { apertura, info, pagina, prepara, sessione, fine };
  app.innerHTML = viste[nome]();
  window.scrollTo(0, mantieniScroll ? y : 0);
  const chiudi = app.querySelector('.foglio .chiudi');
  document.body.classList.toggle('sheet-aperto', !!app.querySelector('.velo'));
  if (chiudi && !overlayVisibile) chiudi.focus({ preventScroll: true });
  overlayVisibile = !!chiudi;
  if (nome === 'sessione') salvaIncontro();
  tick();
}

function apertura() {
  const salvato = leggiIncontroSalvato();
  const ripresa = salvato ? `
  <div class="scheda ripresa">
    <p class="cosa">Hai un incontro in corso</p>
    <p class="nota">Fase ${salvato.incontro.indice + 1} di ${FASI.length} · ${esc(FASI[salvato.incontro.indice].titolo)} · resta ${formatTempo(secondiTotali(salvato.incontro, Date.now()))}</p>
    <div class="duo">
      <button class="btn primario" data-az="riprendi">Riprendi</button>
      <button class="btn chiaro" data-az="scarta-incontro">Scarta</button>
    </div>
  </div>` : '';
  return `
  <p class="marchio">Formebrevi APS</p>
  <h1 class="titolo">Dialogo</h1>
  <p class="lead">La app gratuita di Formebrevi APS per chi conduce un dialogo filosofico di gruppo, in presenza o online. Ti guida nelle cinque fasi dell'incontro, tiene il tempo, ti propone domande per ogni argomento e ti dà frasi pronte per i momenti difficili.</p>
  ${ripresa}
  <div class="pila">
    <button class="btn primario" data-az="prepara">Prepara un incontro</button>
    <button class="btn" data-az="solo-strumenti">Solo gli strumenti</button>
    <button class="btn chiaro" data-az="pagina" data-id="come-funziona">Come funziona</button>
    <button class="btn chiaro" data-az="info">Informazioni</button>
  </div>
  <p class="piede">Gratuita, senza account e anche senza connessione. Contenuti dal kit «Caffè Filosofico Fai-da-Te» · Licenza CC BY-NC-SA 4.0 · Formebrevi APS</p>`;
}

function elencoSfoglia() {
  return `<div class="velo" data-az="velo-sfoglia"><div class="foglio" role="dialog" aria-modal="true" aria-label="Tutte le domande">
    <div class="foglio-testa"><h2>Tutte le domande</h2><button class="chiudi" data-az="chiudi-sfoglia">Chiudi</button></div>
    ${controlliDomande(cerca, filtroSfoglia)}
    <div id="lista-domande" style="margin-top:14px">${accordionDomande({ domande: poolSfoglia(), aperto: temaAperto, cerca, seleziona: true })}</div>
  </div></div>`;
}

function prepara() {
  const p = prep;
  const scelta = p.scelta && p.scelta.id > 0 && !p.proposte.some((x) => x.id === p.scelta.id) ? [p.scelta] : [];
  const opzioni = [...scelta, ...p.proposte];
  return `
  <button class="indietro" data-az="home">← Indietro</button>
  <h1 class="titolo" style="font-size:2rem">Prepara l'incontro</h1>
  <div class="gruppo"><h2>Quanto dura?</h2>${chips('durata', [[60, '60 minuti'], [90, '90 minuti'], [120, '120 minuti'], ['su-misura', 'Su misura']], p.suMisura ? 'su-misura' : p.durata)}
    ${p.suMisura ? editorDurata(p) : ''}</div>
  <div class="gruppo"><h2>Quante persone?</h2>${chips('gruppo', [['piccolo', 'Fino a 8'], ['medio', '9–15'], ['grande', 'Oltre 15']], p.gruppo)}</div>
  <div class="gruppo"><h2>Dove?</h2>${chips('luogo', [['presenza', 'In presenza'], ['online', 'Online']], p.luogo)}</div>
  <div class="gruppo"><h2>Per chi?</h2>${chips('pubblico', [['tutti', 'Tutti'], ['scuola', 'Scuola'], ['adulti', 'Adulti']], p.pubblico)}</div>
  <div class="gruppo"><h2>Con quale domanda?</h2>
    ${opzioni.map((d) => `<button class="opzione" data-az="scegli" data-id="${d.id}" aria-pressed="${!!p.scelta && p.scelta.id === d.id}"><small>${esc(d.tema)}</small>${esc(d.testo)}</button>`).join('')}
    <div class="duo" style="margin:4px 0 8px">
      <button class="btn chiaro piccolo" data-az="sorprendi">Sorprendimi</button>
      <button class="btn chiaro piccolo" data-az="altre-tre">Altre tre</button>
    </div>
    <button class="btn chiaro piccolo" data-az="sfoglia" style="margin-bottom:12px">Sfoglia tutte le domande</button>
    <label for="propria" class="nota">Oppure scrivi la tua domanda:</label>
    <textarea id="propria" placeholder="Scrivi qui la domanda">${p.scelta && p.scelta.id === 0 ? esc(p.scelta.testo) : ''}</textarea>
  </div>
  <div class="gruppo"><h2>Suono di avviso</h2>${chips('suono', [['no', 'Spento'], ['si', 'Acceso']], p.suono ? 'si' : 'no')}
    <p class="nota">Un breve suono a fine fase, con l'audio del telefono acceso. La vibrazione c'è comunque, se il telefono la permette.</p></div>
  <div class="gruppo"><button id="avvia" class="btn primario" data-az="avvia" ${p.scelta ? '' : 'disabled'}>Inizia l'incontro</button></div>
  ${sfoglia === 'prepara' ? elencoSfoglia() : ''}`;
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
      <div class="domanda-box"><small>La domanda</small>${esc(domandaCorrente ? domandaCorrente.testo : st.domanda.testo)}</div>
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
  ${pannello ? disegnaPannello() : ''}
  ${sfoglia === 'sessione' ? elencoSfoglia() : ''}`;
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
const domandeInPagina = () => controlliDomande(cerca, filtroSfoglia) +
  `<div id="lista-domande" style="margin-top:14px">${accordionDomande({ domande: poolSfoglia(), aperto: temaAperto, cerca, seleziona: false })}</div>`;

function info() {
  const gruppi = [['imparare', 'Per condurre bene'], ['dopo', "Dopo l'incontro"], ['formebrevi', 'Formebrevi']];
  return `
  <button class="indietro" data-az="home">← Indietro</button>
  <h1 class="titolo" style="font-size:2rem">Informazioni</h1>
  <p class="lead">Per condurre meglio un dialogo e per conoscere chi ha realizzato la app.</p>
  ${gruppi.map(([g, titolo]) => `<h2 class="grp">${esc(titolo)}</h2>` +
    PAGINE.filter((p) => p.gruppo === g).map((p) => `<button class="voce" data-az="pagina" data-id="${p.id}"><strong>${esc(p.titolo)}</strong><span>${esc(p.sotto)}</span></button>`).join('')).join('')}`;
}

function pagina() {
  const p = PAGINE.find((x) => x.id === paginaId);
  const corpo = p.id === 'scheda' ? vistaScheda(scheda) : p.blocchi.map((b) => blocco(b, domandeInPagina)).join('');
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
    <button class="btn chiaro" data-az="sfoglia">Sfoglia tutte le domande</button>
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
  const blocchetto = incontro
    ? `<p class="nota">Nell'incontro: <strong id="pTot">--:--</strong> · Nella fase: <strong id="pFase">--:--</strong></p>
       <div class="duo"><button class="btn chiaro" data-az="regola" data-d="-5">Accorcia 5 min</button><button class="btn chiaro" data-az="regola" data-d="5">Allunga 5 min</button></div>`
    : '';
  return `${testaPannello('Tempo')}
  ${blocchetto}
  <div class="sezione"><h3>Silenzio</h3>
    <div class="duo"><button class="btn chiaro" data-az="silenzio" data-s="60">1 minuto</button><button class="btn chiaro" data-az="silenzio" data-s="20">20 secondi</button></div>
    ${silenzio ? '<div class="contatore" id="tSil">--</div><button class="btn chiaro piccolo" data-az="ferma-silenzio">Ferma</button>' : ''}
    <p class="nota" style="margin-top:10px">Un silenzio di 20 secondi non è imbarazzante: è pensiero in corso.</p></div>
  <div class="sezione"><h3>Suono di avviso</h3>
    <button class="btn chiaro" data-az="suono" aria-pressed="${suono}">${suono ? 'Acceso: tocca per spegnere' : 'Spento: tocca per accendere'}</button></div>`;
}

// ---- Elenco delle domande: aggiornamento senza ridisegnare tutto ----
function aggiornaLista() {
  const lista = document.getElementById('lista-domande');
  if (!lista) return;
  lista.innerHTML = accordionDomande({ domande: poolSfoglia(), aperto: temaAperto, cerca, seleziona: !!lista.closest('.velo') });
  const c = document.getElementById('chips-pub');
  if (c) c.innerHTML = chipsPubblico(filtroSfoglia);
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
  pannello = null; rilancioAperto = null; silenzio = null; intervento = null; avvisata = false; sfoglia = null;
  suono = false;
  window.__tint = 0;
  rilasciaWakeLock();
}

function impostaDurataTotale(nuova) {
  if (nuova < DURATA_MIN || nuova > DURATA_MAX) { avviso(`La durata va da ${DURATA_MIN} a ${DURATA_MAX} minuti`); return; }
  prep.durata = nuova;
  prep.minuti = minutiFasi(nuova);
}

const azioni = {
  home: () => mostra('apertura'),
  apertura: () => { azzera(); scheda = null; mostra('apertura'); },
  info: () => mostra('info'),
  pagina: (d) => {
    if (vistaCorrente !== 'pagina') daVista = vistaCorrente;
    paginaId = d.id;
    if (d.id === 'scheda' && !scheda) scheda = nuovaScheda();
    if (d.id === 'domande') { cerca = ''; temaAperto = null; filtroSfoglia = 'tutti'; }
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

  riprendi: () => {
    const s = leggiIncontroSalvato();
    if (!s) { mostra('apertura'); return; }
    azzera();
    incontro = s.incontro; usate = s.usate || []; luogo = s.luogo; gruppo = s.gruppo; pubblico = s.pubblico;
    domandaCorrente = s.domandaCorrente || incontro.domanda; riserva = !!s.riserva; suono = !!s.suono;
    ultimaDomanda = incontro.domanda ? incontro.domanda.testo : '';
    if (suono) preparaAudio();
    richiediWakeLock();
    mostra('sessione');
  },
  'scarta-incontro': () => { cancellaIncontroSalvato(); mostra('apertura'); },

  prepara: () => {
    const s = leggiImpostazioni();
    prep = { ...s, scelta: null, suMisura: !DURATE[s.durata], minuti: DURATE[s.durata] ? null : minutiFasi(s.durata) };
    pubblico = prep.pubblico;
    prep.proposte = proponiTre(pool());
    sfoglia = null;
    mostra('prepara');
  },
  imposta: (d) => {
    if (d.k === 'durata') {
      if (d.v === 'su-misura') { prep.suMisura = true; prep.minuti = minutiFasi(prep.durata); }
      else { prep.durata = Number(d.v); prep.suMisura = false; prep.minuti = null; }
    } else if (d.k === 'suono') {
      prep.suono = d.v === 'si';
    } else {
      prep[d.k] = d.v;
    }
    if (d.k === 'pubblico') { pubblico = d.v; prep.proposte = proponiTre(pool()); prep.scelta = null; }
    mostra('prepara', true);
  },
  'durata-delta': (d) => { impostaDurataTotale(prep.durata + Number(d.d)); mostra('prepara', true); },
  'fase-delta': (d) => {
    const i = Number(d.i);
    const nuovi = [...prep.minuti];
    nuovi[i] = Math.min(120, Math.max(1, nuovi[i] + Number(d.d)));
    const totale = nuovi.reduce((a, b) => a + b, 0);
    if (totale < DURATA_MIN || totale > DURATA_MAX) avviso(`La durata totale va da ${DURATA_MIN} a ${DURATA_MAX} minuti`);
    else { prep.minuti = nuovi; prep.durata = totale; }
    mostra('prepara', true);
  },
  scegli: (d) => { prep.scelta = DOMANDE.find((x) => x.id === Number(d.id)); mostra('prepara', true); },
  sorprendi: () => {
    const tutte = pool();
    prep.scelta = tutte[Math.floor(Math.random() * tutte.length)];
    prep.proposte = [prep.scelta, ...proponiTre(tutte.filter((x) => x.id !== prep.scelta.id)).slice(0, 2)];
    mostra('prepara', true);
  },
  'altre-tre': () => { prep.proposte = proponiTre(pool()); prep.scelta = null; mostra('prepara', true); },

  sfoglia: () => {
    sfoglia = vistaCorrente === 'prepara' ? 'prepara' : 'sessione';
    cerca = ''; temaAperto = null; filtroSfoglia = pubblico;
    mostra(vistaCorrente, true);
  },
  'chiudi-sfoglia': () => { sfoglia = null; mostra(vistaCorrente, true); },
  'velo-sfoglia': (d, e, el) => { if (e.target === el) azioni['chiudi-sfoglia'](); },
  tema: (d) => { temaAperto = temaAperto === d.t ? null : d.t; aggiornaLista(); },
  'pub-sfoglia': (d) => { filtroSfoglia = d.v; aggiornaLista(); },
  'scegli-elenco': (d) => {
    const scelta = DOMANDE.find((x) => x.id === Number(d.id));
    if (!scelta) return;
    if (sfoglia === 'prepara') {
      prep.scelta = scelta;
      sfoglia = null;
      mostra('prepara', true);
    } else {
      if (!usate.includes(scelta.id)) usate.push(scelta.id);
      domandaCorrente = scelta; riserva = false;
      sfoglia = null;
      mostra('sessione', true);
    }
  },

  avvia: () => {
    salvaImpostazioni(prep);
    luogo = prep.luogo; gruppo = prep.gruppo; pubblico = prep.pubblico; suono = prep.suono;
    ultimaDomanda = prep.scelta.testo;
    if (suono) preparaAudio();
    incontro = creaIncontro({
      durata: prep.durata, minuti: prep.suMisura ? prep.minuti : undefined,
      gruppo: prep.gruppo, luogo: prep.luogo, domanda: prep.scelta, ora: ora(),
    });
    usate = prep.scelta.id > 0 ? [prep.scelta.id] : [];
    domandaCorrente = prep.scelta;
    soloStrumenti = false; turni = []; pannello = null; avvisata = false; sfoglia = null;
    richiediWakeLock();
    mostra('sessione');
  },
  'solo-strumenti': () => {
    const s = leggiImpostazioni();
    azzera();
    soloStrumenti = true; luogo = s.luogo; gruppo = s.gruppo; pubblico = s.pubblico; suono = s.suono;
    if (suono) preparaAudio();
    richiediWakeLock();
    mostra('sessione');
  },
  avanti: () => {
    incontro = avanti(incontro, ora());
    avvisata = false; intervento = null;
    if (incontro.finito) { cancellaIncontroSalvato(); azzera(); mostra('fine'); return; }
    mostra('sessione');
  },
  pannello: (d) => { pannello = d.p; rilancioAperto = null; mostra('sessione', true); },
  chiudi: () => { pannello = null; mostra('sessione', true); },
  velo: (d, e, el) => { if (e.target === el) azioni.chiudi(); },
  'altra-tema': () => { nuovaDomanda(domandaCorrente.tema, false); mostra('sessione', true); },
  'a-caso': () => { nuovaDomanda(null, false); mostra('sessione', true); },
  riserva: () => { nuovaDomanda(null, true); mostra('sessione', true); },
  'salva-nomi': () => { turni = creaTurni(parseNomi(document.getElementById('nomi').value)); mostra('sessione', true); },
  'cambia-nomi': () => { turni = []; intervento = null; mostra('sessione', true); },
  parla: (d) => {
    turni = registraIntervento(turni, Number(d.i));
    const secondi = incontro ? incontro.tempoIntervento : (window.__tint || 0);
    intervento = secondi > 0 ? { fine: ora() + secondi * 1000 } : null;
    mostra('sessione', true);
  },
  'ferma-intervento': () => { intervento = null; mostra('sessione', true); },
  rilancio: (d) => { rilancioAperto = d.id; mostra('sessione', true); },
  'rilancio-indietro': () => { rilancioAperto = null; mostra('sessione', true); },
  regola: (d) => { incontro = regolaFase(incontro, Number(d.d)); mostra('sessione', true); },
  silenzio: (d) => { silenzio = { fine: ora() + Number(d.s) * 1000 }; mostra('sessione', true); },
  'ferma-silenzio': () => { silenzio = null; mostra('sessione', true); },
  suono: () => {
    suono = !suono;
    if (suono) { preparaAudio(); suona([660]); }
    const s = leggiImpostazioni();
    salvaImpostazioni({ ...s, suono });
    mostra('sessione', true);
  },
};

app.addEventListener('click', (e) => {
  const el = e.target.closest('[data-az]');
  if (!el) return;
  // Il pulsante «chip» del tempo per intervento usa la stessa azione «imposta» ma agisce sui turni
  if (el.dataset.az === 'imposta' && el.dataset.k === 'tint') {
    const v = Number(el.dataset.v);
    if (incontro) incontro = { ...incontro, tempoIntervento: v }; else window.__tint = v;
    mostra('sessione', true);
    return;
  }
  const fn = azioni[el.dataset.az];
  if (fn) fn(el.dataset, e, el);
});

app.addEventListener('input', (e) => {
  if (e.target.dataset && e.target.dataset.campo && scheda) { scheda[e.target.dataset.campo] = e.target.value; return; }
  if (e.target.id === 'cerca') { cerca = e.target.value; aggiornaLista(); return; }
  if (e.target.id === 'propria') {
    const testo = e.target.value.trim();
    prep.scelta = testo ? { id: 0, tema: '', testo } : null;
    const b = document.getElementById('avvia');
    if (b) b.disabled = !prep.scelta;
    document.querySelectorAll('.opzione').forEach((o) => o.setAttribute('aria-pressed', 'false'));
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (sfoglia) azioni['chiudi-sfoglia']();
  else if (pannello) azioni.chiudi();
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
    if (sf <= 0 && !avvisata && !soloStrumenti) { avvisata = true; avvisoFase(); }
  }
  if (silenzio) {
    const r = Math.ceil((silenzio.fine - t) / 1000);
    if (r <= 0) { silenzio = null; avvisoFase(); if (vistaCorrente === 'sessione') mostra('sessione', true); }
    else setTesto('tSil', formatTempo(r));
  }
  if (intervento) {
    const r = Math.ceil((intervento.fine - t) / 1000);
    if (r <= 0) { intervento = null; avvisoBreve(); if (vistaCorrente === 'sessione') mostra('sessione', true); }
    else setTesto('tInt', formatTempo(r));
  }
}
setInterval(tick, 250);

if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
mostra('apertura');
