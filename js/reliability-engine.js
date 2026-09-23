'use strict';
(() => {
  const SCHEMA=9, PREFIX='mn-', started=performance.now();
  const state={errors:[],lastHealth:null};
  const byId=id=>document.getElementById(id);
  const safeJson=(s,f=null)=>{try{return JSON.parse(s)}catch{return f}};
  const bytes=s=>{try{return typeof Blob==='function'?new Blob([s]).size:new TextEncoder().encode(s).length}catch{return s.length*2}};
  function storageSnapshot(){
    const data={};
    for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.startsWith(PREFIX))data[k]=localStorage.getItem(k)}
    return data;
  }
  function exportPayload(){
    return {format:'mira-nihongo-backup',schema:SCHEMA,appVersion:'0.9',exportedAt:new Date().toISOString(),data:storageSnapshot()};
  }
  function validateBackup(x){
    if(!x||x.format!=='mira-nihongo-backup'||!Number.isInteger(x.schema)||x.schema<6||x.schema>SCHEMA||!x.data||Array.isArray(x.data)||typeof x.data!=='object')return false;
    return Object.keys(x.data).every(k=>k.startsWith(PREFIX)&&typeof x.data[k]==='string');
  }
  function importPayload(x){
    if(!validateBackup(x))throw new Error('Backup incompatível ou inválido.');
    const before=storageSnapshot();
    try{
      Object.entries(x.data).forEach(([k,v])=>localStorage.setItem(k,v));
      localStorage.setItem('mn-v09-last-import',new Date().toISOString());
    }catch(e){
      Object.keys(storageSnapshot()).forEach(k=>localStorage.removeItem(k));
      Object.entries(before).forEach(([k,v])=>localStorage.setItem(k,v));
      throw e;
    }
    return Object.keys(x.data).length;
  }
  async function health(){
    const cacheSupported='caches' in window;
    let cacheOk=false;
    if(cacheSupported){try{cacheOk=(await caches.keys()).some(k=>k.includes('mira-nihongo-v0-9'))}catch{}}
    const data=JSON.stringify(storageSnapshot());
    let quota=null,usage=null;try{if(navigator.storage?.estimate){const est=await navigator.storage.estimate();quota=est.quota??null;usage=est.usage??null}}catch{}
    const h={
      version:'0.9',online:navigator.onLine!==false,camera:!!(navigator.mediaDevices&&navigator.mediaDevices.getUserMedia),
      detector:!!window.cocoSsd,mobileNet:!!window.mobilenet,tensorFlow:!!window.tf,
      adaptive:!!window.MiraAdaptiveLearning,worldContext:!!window.MiraWorldContext,
      storage:true,serviceWorker:'serviceWorker' in navigator,cache:cacheOk,
      localBytes:bytes(data),quota,usage,errors:state.errors.length,startupMs:Math.round(performance.now()-started)
    };
    state.lastHealth=h; return h;
  }
  function renderHealth(h){
    const el=byId('healthSummary'),adv=byId('advancedDiagnostics'); if(!el)return;
    const rows=[['Câmera',h.camera],['Detector',h.detector],['MobileNet',h.mobileNet],['Adaptive Learning',h.adaptive],['World Context',h.worldContext],['Armazenamento',h.storage],['PWA',h.serviceWorker],['Cache V0.9',h.cache]];
    el.innerHTML=rows.map(([n,v])=>`<span><b>${v?'✓':'—'}</b>${n}</span>`).join('');
    if(adv)adv.textContent=`Mira Nihongo V0.9\nRede: ${h.online?'online':'offline'}\nInicialização do diagnóstico: ${h.startupMs} ms\nDados locais Mira: ${(h.localBytes/1024).toFixed(1)} KB\nArmazenamento do navegador: ${h.usage==null?'indisponível':(h.usage/1048576).toFixed(1)+' MB'}\nErros capturados nesta sessão: ${h.errors}\nService Worker: ${h.serviceWorker?'disponível':'indisponível'}\nCache V0.9: ${h.cache?'ativo':'aguardando ativação'}`;
  }
  async function refresh(){renderHealth(await health())}
  function updateNetwork(){
    const el=byId('networkChip');if(!el)return;
    const off=navigator.onLine===false;el.classList.toggle('hidden',!off);el.textContent=off?'Offline · usando recursos locais':'Online';
  }
  function status(msg,bad=false){const el=byId('backupStatus');if(el){el.textContent=msg;el.dataset.bad=bad?'1':'0'}}
  function bind(){
    updateNetwork(); addEventListener('online',()=>{updateNetwork();refresh()});addEventListener('offline',()=>{updateNetwork();refresh()});
    byId('refreshHealthBtn')?.addEventListener('click',refresh);
    byId('exportDataBtn')?.addEventListener('click',()=>{
      try{const blob=new Blob([JSON.stringify(exportPayload(),null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`mira-nihongo-backup-${new Date().toISOString().slice(0,10)}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);status('Backup exportado.')}catch(e){status('Não foi possível exportar o backup.',true)}
    });
    byId('importDataBtn')?.addEventListener('click',()=>byId('importDataFile')?.click());
    byId('importDataFile')?.addEventListener('change',async e=>{
      const f=e.target.files?.[0];if(!f)return;
      try{const x=safeJson(await f.text());const n=importPayload(x);status(`${n} registros importados. Reabra o Mira para aplicar tudo.`);refresh()}catch(err){status(err.message||'Backup inválido.',true)}finally{e.target.value=''}
    });
    byId('clearLocalDataBtn')?.addEventListener('click',()=>{
      if(!confirm('Apagar aprendizado, correções e preferências salvos neste aparelho? Esta ação não pode ser desfeita sem um backup.'))return;
      Object.keys(storageSnapshot()).forEach(k=>localStorage.removeItem(k));status('Dados locais do Mira apagados. Reabra o app.');refresh();
    });
    refresh();
  }
  addEventListener('error',e=>{state.errors.push({type:'error',message:String(e.message||'erro'),at:Date.now()});if(state.errors.length>20)state.errors.shift()});
  addEventListener('unhandledrejection',e=>{state.errors.push({type:'promise',message:String(e.reason?.message||e.reason||'rejeição'),at:Date.now()});if(state.errors.length>20)state.errors.shift()});
  window.MiraReliability={SCHEMA,storageSnapshot,exportPayload,validateBackup,importPayload,health};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind);else bind();
})();
