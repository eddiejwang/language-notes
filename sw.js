// Saves a copy of the app and notes on the phone so it works offline.
// With signal, it always fetches the latest version first (giving up after 3 seconds).
const CACHE = 'notes-v1';
const CORE = ['./', 'index.html', 'notebooks.json', 'vendor/marked.min.js', 'manifest.webmanifest', 'icon-180.png', 'icon-192.png', 'icon-512.png'];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(CORE);
    try {
      const list = await (await fetch('notebooks.json', { cache: 'no-cache' })).json();
      await cache.addAll(list.flatMap(n => [n.file, n.verbs].filter(Boolean)));
    } catch (e) {}
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const url = req.url.split('#')[0];
    const network = fetch(url, { cache: 'no-cache', credentials: 'same-origin' }).then(res => {
      if (res.ok) cache.put(url, res.clone());
      return res;
    });
    network.catch(() => {});
    const timeout = new Promise(resolve => setTimeout(resolve, 3000, null));
    try {
      const res = await Promise.race([network, timeout]);
      if (res) return res;
    } catch (e) {}
    const saved = await cache.match(url, { ignoreSearch: true });
    return saved || network;
  })());
});
