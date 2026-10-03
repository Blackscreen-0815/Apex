/* Apex Service Worker – offline-first, ohne externe Anfragen
   Bei jeder Änderung an index.html die VERSION erhöhen, damit Nutzer das Update bekommen. */
const VERSION = 'v2.2.4';
const SHELL = `apex-shell-${VERSION}`;
const RUNTIME = `apex-runtime-${VERSION}`;
const SHELL_FILES = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/maskable-192.png',
  './icons/maskable-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL);
    await cache.addAll(SHELL_FILES);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keep = [SHELL, RUNTIME];
    const keys = await caches.keys();
    await Promise.all(keys
      .filter((k) => (k.startsWith('apex-') || k.startsWith('hp-')) && !keep.includes(k))
      .map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  /* Seitenaufrufe: Netzwerk zuerst, offline die gecachte App-Shell */
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const cache = await caches.open(SHELL);
        cache.put('./index.html', fresh.clone());
        return fresh;
      } catch (e) {
        return (await caches.match('./index.html')) || (await caches.match('./')) || Response.error();
      }
    })());
    return;
  }

  /* Eigene Dateien: Stale-while-revalidate */
  if (url.origin === self.location.origin) {
    event.respondWith((async () => {
      const cached = await caches.match(req, { ignoreSearch: true });
      const update = fetch(req).then(async (res) => {
        if (res && res.ok) (await caches.open(SHELL)).put(req, res.clone());
        return res;
      }).catch(() => cached);
      return cached || update;
    })());
  }
});
