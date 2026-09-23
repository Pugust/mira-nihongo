'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const store=new Map([['mn-v07-learning','{"version":7}'],['other-app','keep']]);
const localStorage={get length(){return store.size},key:i=>[...store.keys()][i]??null,getItem:k=>store.get(k)??null,setItem:(k,v)=>store.set(k,String(v)),removeItem:k=>store.delete(k)};
const elements=new Map();
function el(){return {classList:{toggle(){}},addEventListener(){},textContent:'',innerHTML:'',dataset:{}}}
const document={readyState:'loading',getElementById:id=>elements.get(id)||null,addEventListener(){}};
const context={window:null,document,localStorage,navigator:{onLine:true,mediaDevices:{getUserMedia(){}}},performance:{now:()=>10},Blob,Date,JSON,Object,Array,Number,String,Map,Set,URL:{createObjectURL(){return'x'},revokeObjectURL(){}},addEventListener(){},setTimeout(){},confirm(){return false},caches:{keys:async()=>['mira-nihongo-v0-9-r1']},console};
context.window=context;context.cocoSsd={};context.mobilenet={};context.tf={};context.MiraAdaptiveLearning={};context.MiraWorldContext={};context.navigator.serviceWorker={};
vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(__dirname,'../js/reliability-engine.js'),'utf8'),context);
const R=context.MiraReliability;let n=0;const ok=(x,m)=>{assert.ok(x,m);n++};
ok(R.SCHEMA===9,'schema');
const snap=R.storageSnapshot();ok(snap['mn-v07-learning']!==undefined,'Mira key exported');ok(snap['other-app']===undefined,'foreign key excluded');
const p=R.exportPayload();ok(p.format==='mira-nihongo-backup','format');ok(p.appVersion==='0.9','version');ok(R.validateBackup(p),'own backup valid');
ok(!R.validateBackup({format:'mira-nihongo-backup',schema:99,data:{}}),'future schema rejected');
ok(!R.validateBackup({format:'mira-nihongo-backup',schema:9,data:{evil:'x'}}),'foreign key rejected');
const count=R.importPayload({format:'mira-nihongo-backup',schema:9,data:{'mn-v09-test':'ok'}});ok(count===1,'import count');ok(localStorage.getItem('mn-v09-test')==='ok','imported');
R.health().then(h=>{ok(h.camera,'camera capability');ok(h.detector&&h.mobileNet&&h.tensorFlow,'models');ok(h.adaptive&&h.worldContext,'engines');ok(h.cache,'cache');console.log(`Reliability: ${n}/14 passed`)});
