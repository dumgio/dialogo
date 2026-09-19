// Funzioni che costruiscono i pezzi di schermata (HTML). Non hanno stato: ricevono i dati e restituiscono testo.

import { FASI, TEMI, MAIL, CONTATTI } from './content.js';
import { DURATE, DURATA_MIN, DURATA_MAX, VOCI_AUTOVALUTAZIONE } from './logic.js';

export const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Nel testo, **così** diventa grassetto.
export const ricco = (t) => esc(t).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

export const risolviHref = (h) => (h.startsWith('mail:') ? MAIL[h.slice(5)] : CONTATTI[h]);

export function chips(chiave, valori, corrente) {
  return `<div class="chips">${valori.map(([v, testo]) =>
    `<button class="chip" data-az="imposta" data-k="${chiave}" data-v="${v}" aria-pressed="${String(v) === String(corrente)}">${testo}</button>`).join('')}</div>`;
}

// ---- Durata su misura ----

export function editorDurata(p) {
  return `
  <div class="scheda editor">
    <p class="nota">Durata totale dell'incontro (da ${DURATA_MIN} a ${DURATA_MAX} minuti)</p>
    <div class="stepper">
      <button class="btn chiaro piccolo" data-az="durata-delta" data-d="-5" aria-label="5 minuti in meno">−5</button>
      <strong>${p.durata} minuti</strong>
      <button class="btn chiaro piccolo" data-az="durata-delta" data-d="5" aria-label="5 minuti in più">+5</button>
    </div>
    <p class="nota" style="margin-top:14px">Le fasi seguono le proporzioni del kit. Se vuoi, cambia i minuti di ogni fase: la durata totale si aggiorna da sola.</p>
    ${FASI.map((f, i) => `
    <div class="fase-riga"><span>${i + 1} · ${esc(f.titolo)}</span>
      <div class="stepper">
        <button class="btn chiaro piccolo" data-az="fase-delta" data-i="${i}" data-d="-1" aria-label="Un minuto in meno: ${esc(f.titolo)}">−</button>
        <strong>${p.minuti[i]} min</strong>
        <button class="btn chiaro piccolo" data-az="fase-delta" data-i="${i}" data-d="1" aria-label="Un minuto in più: ${esc(f.titolo)}">+</button>
      </div></div>`).join('')}
  </div>`;
}

// ---- Elenco delle domande, per argomento ----

const normalizza = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export function chipsPubblico(corrente) {
  return `<div class="chips" role="group" aria-label="Per chi">${[['tutti', 'Tutte'], ['scuola', 'Scuola'], ['adulti', 'Adulti']].map(([v, t]) =>
    `<button class="chip" data-az="pub-sfoglia" data-v="${v}" aria-pressed="${v === corrente}">${t}</button>`).join('')}</div>`;
}

export function controlliDomande(cerca, filtro) {
  return `
  <label class="campo" for="cerca">Cerca una domanda o un argomento</label>
  <input type="search" id="cerca" placeholder="Per esempio: amicizia, libertà, scuola" value="${esc(cerca)}" autocomplete="off">
  <div id="chips-pub" style="margin-top:10px">${chipsPubblico(filtro)}</div>`;
}

// Un menu a tendina per argomento. Con «seleziona» ogni domanda è un pulsante, altrimenti solo testo.
export function accordionDomande({ domande, aperto, cerca, seleziona }) {
  const q = normalizza(cerca.trim());
  const trovate = q ? domande.filter((d) => normalizza(d.testo).includes(q) || normalizza(d.tema).includes(q)) : domande;
  if (!trovate.length) return '<p class="nota">Nessuna domanda trovata. Prova con un\'altra parola.</p>';
  return TEMI.filter((t) => trovate.some((d) => d.tema === t)).map((t) => {
    const lista = trovate.filter((d) => d.tema === t);
    const aperta = q ? true : aperto === t;
    const id = 'acc-' + normalizza(t).replace(/[^a-z]/g, '');
    return `<div class="acc">
      <button class="acc-testa" data-az="tema" data-t="${esc(t)}" aria-expanded="${aperta}" aria-controls="${id}"><span>${esc(t)}</span><span class="acc-n">${lista.length}</span></button>
      <div class="acc-corpo" id="${id}"${aperta ? '' : ' hidden'}>${lista.map((d) => (seleziona
    ? `<button class="opzione" data-az="scegli-elenco" data-id="${d.id}">${esc(d.testo)}</button>`
    : `<p class="frase">${esc(d.testo)}</p>`)).join('')}</div></div>`;
  }).join('');
}

// ---- Pagine informative ----

export function tabellaDurate() {
  const righe = FASI.map((f, i) => `<tr><td>${i + 1} · ${esc(f.titolo)}</td>${[60, 90, 120].map((d) => `<td>${DURATE[d][i]}</td>`).join('')}</tr>`).join('');
  return `<table class="tabella"><thead><tr><th>Fase</th><th>60 min</th><th>90 min</th><th>120 min</th></tr></thead><tbody>${righe}</tbody></table>`;
}

// domandeHtml è una funzione che restituisce l'elenco delle domande (dipende dallo stato dell'app).
export function blocco(b, domandeHtml) {
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
    case 'domande': return domandeHtml();
    case 'durate': return tabellaDurate();
    default: return '';
  }
}

// ---- Scheda di riflessione ----

export function vistaScheda(s) {
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
