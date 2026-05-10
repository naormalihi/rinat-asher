const CACHE = 'rinat-asher-v2026.05.10.0515';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
     .then(() => self.clients.matchAll())
     .then(clients => clients.forEach(c => c.postMessage('reload')))
  );
});

self.addEventListener('fetch', e => {
  // תמיד נסה לטעון מהרשת קודם
  e.respondWith(
    fetch(e.request, {cache: 'no-cache'})
      .then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
