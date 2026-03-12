const CACHE='oral-ledo-v9';
const STATIC=['/oral-ledo/','/oral-ledo/index.html'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(STATIC).catch(()=>{})));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener('fetch',e=>{
  if(e.request.url.includes('supabase.co')){e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));return;}
  e.respondWith(caches.match(e.request).then(cached=>{
    if(cached)return cached;
    return fetch(e.request).then(r=>{
      if(r&&r.status===200&&r.type==='basic'){const c=r.clone();caches.open(CACHE).then(cache=>cache.put(e.request,c));}
      return r;
    }).catch(()=>caches.match('/oral-ledo/index.html'));
  }));
});