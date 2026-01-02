const CACHE_NAME = "bajao-v1";

const APP_SHELL = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/bajao_icon.png"
];

// Install
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

// Activate
self.addEventListener("activate", () => {
  self.clients.claim();
});

// Fetch (network-first for APIs & streams)
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Don't cache streams or APIs
  if (
    request.url.includes("/api") ||
    request.destination === "audio"
  ) {
    return;
  }

  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});
