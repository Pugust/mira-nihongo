'use strict';
const CACHE='mira-nihongo-v0-9-r1';
const LOCAL=['./','./index.html','./css/app.css','./js/recognition-policy.js','./js/world-context.js','./js/vision-engine.js','./js/japanese-data.js','./js/learning-engine.js','./js/adaptive-learning.js','./js/interaction-engine.js','./js/reliability-engine.js','./js/app.js','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(LOCAL)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(k=>k.startsWith('mira-nihongo-')&&k!==CACHE).map(k=>caches.delete(k)));await self.clients.claim()})())});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);if(u.origin!==self.location.origin)return;
  if(e.request.mode==='navigate'){
    e.respondWith((async()=>{try{const r=await fetch(e.request);if(r&&r.ok)(await caches.open(CACHE)).put('./index.html',r.clone());return r}catch{return (await caches.match('./index.html'))||Response.error()}})());return;
  }
  e.respondWith((async()=>{const cached=await caches.match(e.request);if(cached)return cached;try{const r=await fetch(e.request);if(r&&r.ok)(await caches.open(CACHE)).put(e.request,r.clone());return r}catch{return Response.error()}})());
});
