// Service worker di Dialogo: salva i file sul telefono così la app funziona senza connessione.
// Quando cambi un file dell'app, cambia anche il numero di versione qui sotto.
const CACHE = 'dialogo-v5';
const FILE = [
  './', 'index.html', 'manifest.json', 'css/stile.css',
  'js/app.js', 'js/logic.js', 'js/content.js', 'js/ui.js',
  'icon/icon-192.png', 'icon/icon-512.png', 'icon/icon-maskable-512.png', 'icon/apple-touch-icon.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((nomi) => Promise.all(nomi.filter((n) => n !== CACHE).map((n) => caches.delete(n))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  if (new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then((trovato) =>
      trovato || fetch(e.request).catch(() => caches.match('index.html'))),
  );
});
