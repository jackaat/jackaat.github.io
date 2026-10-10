var C='toilet-v2';
var SHELL=['./','index.html','toilets.json','manifest.webmanifest','icon-192.png',
'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js',
'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css'];
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(C).then(function(c){
    return Promise.all(SHELL.map(function(u){return c.add(u).catch(function(){})}));
  }).then(function(){return self.skipWaiting()}));
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.filter(function(k){return k!==C}).map(function(k){return caches.delete(k)}));
  }).then(function(){return self.clients.claim()}));
});
self.addEventListener('fetch',function(e){
  var r=e.request;
  if(r.method!=='GET')return;
  var u=new URL(r.url);
  if(u.origin!==location.origin&&u.hostname!=='cdnjs.cloudflare.com')return;
  e.respondWith(caches.match(r).then(function(hit){
    var net=fetch(r).then(function(res){
      if(res&&res.ok){var cp=res.clone();caches.open(C).then(function(c){c.put(r,cp)})}
      return res;
    }).catch(function(){return hit});
    return hit||net;
  }));
});
