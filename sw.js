// Offline shell: serve cached files first, refresh them in the background.
const CACHE = "liftlog-v4";
const SHELL = ["./", "index.html", "manifest.webmanifest", "icon-192%20(1).png", "icon-512%20(1).png", "icon-180.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL))); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.open(CACHE).then(async c => {
    const hit = await c.match(e.request);
    const net = fetch(e.request).then(r => { if (r.ok && (new URL(e.request.url).origin === location.origin || e.request.url.includes("fonts.g"))) c.put(e.request, r.clone()); return r; }).catch(() => hit);
    return hit || net;
  }));
});
