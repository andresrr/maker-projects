const CACHE='maker-projects-v2';
const ASSETS=["./","./index.html","./manifest.json","./styles.css","./app.js","./projects-1.js","./projects-2.js","./projects-3.js","./projects-4.js","./projects-5.js"];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))));
self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))));
