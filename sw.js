const CACHE = 'lovely-v1';
const ASSETS = [
  './',
  './index.html',
  './settings.html',
  './birthday.html',
  './galaxy.html',
  './manifest.webmanifest',

  // fonts (nếu bạn dùng Google Fonts qua link thì không cần liệt kê)
  // './assets/fonts/...' 

  // ảnh mặc định đang dùng
  './assets/OIP.webp',
  './assets/OIP.png',
  './assets/cute.svg',
  './assets/icon-192.png',
  './assets/icon-512.png'
];

self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
});
self.addEventListener('activate', e=>{
  e.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
  );
});
self.addEventListener('fetch', e=>{
  e.respondWith(
    caches.match(e.request).then(r=> r || fetch(e.request))
  );
});
