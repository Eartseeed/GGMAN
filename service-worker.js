const CACHE = "pos-cache-v24";

const FILES = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./logo.png"
];

// ຕິດຕັ້ງ
self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(FILES))
  );
});

// ລ້າງ cache ເກົ່າ
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      );
    })
  );
});

// ດືງ file
self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});
