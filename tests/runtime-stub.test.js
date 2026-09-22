'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
class ClassList{constructor(){this.s=new Set()}add(...x){x.forEach(v=>this.s.add(v))}remove(...x){x.forEach(v=>this.s.delete(v))}toggle(v,f){if(f===undefined)f=!this.s.has(v);f?this.s.add(v):this.s.delete(v);return f}contains(v){return this.s.has(v)}}
class El{
  constructor(id=''){this.id=id;this.classList=new ClassList();this.children=[];this.dataset={};this.style={};this.value='';this.checked=false;this.disabled=false;this.textContent='';this.innerHTML='';this.open=false;this.videoWidth=0;this.videoHeight=0;this.readyState=4;this.listeners={};this.attrs={};this.clientWidth=412;this.clientHeight=915}
  addEventListener(t,f){this.listeners[t]=f} appendChild(x){this.children.push(x);return x} replaceChildren(...x){this.children=[...x]} setAttribute(k,v){this.attrs[k]=v} getAttribute(k){return this.attrs[k]}
  querySelector(sel){this._qs=this._qs||{};return this._qs[sel]||(this._qs[sel]=new El(sel))} querySelectorAll(sel){return this.children.filter(()=>true)} closest(){return null}
  showModal(){this.open=true} close(){this.open=false} pause(){} play(){return Promise.resolve()} focus(){} getBoundingClientRect(){return{left:0,top:0,width:this.clientWidth,height:this.clientHeight}}
  getContext(){return{clearRect(){},drawImage(){},setTransform(){},getImageData(){return{data:new Uint8ClampedArray(9*8*4),width:9,height:8}}}}
}
const els=new Map();const idNames=[...fs.readFileSync(path.join(__dirname,'../index.html'),'utf8').matchAll(/id="([^"]+)"/g)].map(m=>m[1]);for(const id of idNames)els.set(id,new El(id));
// Ensure elements used as select/range have sane values.
els.get('performanceMode').value='balanced';els.get('immersionLevel').value='auto';els.get('confidenceRange').value='0.50';els.get('stickyStrength').value='strong';
const modeBtns=['daily','actions','location','scene','quiz','immersion'].map(m=>{const e=new El();e.dataset.mode=m;return e});
const demoBtns=['kore','sore','are'].map(m=>{const e=new El();e.dataset.demo=m;return e});
els.get('demonstrativeControl').querySelectorAll=()=>demoBtns;
const store=new Map([['mn-onboarded-v05','1']]);
const document={
  hidden:false,
  getElementById:id=>els.get(id)||new El(id),
  createElement:tag=>new El(tag),
  querySelectorAll:sel=>sel.includes('.mode-btn')?modeBtns:[],
  addEventListener(){},
};
const localStorage={getItem:k=>store.has(k)?store.get(k):null,setItem:(k,v)=>store.set(k,String(v)),removeItem:k=>store.delete(k)};
const windowObj={document,localStorage,devicePixelRatio:1,addEventListener(){},speechSynthesis:{cancel(){},speak(){},getVoices(){return[]}},tf:{setBackend:async()=>{},ready:async()=>{}},cocoSsd:{load:async()=>({detect:async()=>[]})},mobilenet:{load:async()=>({classify:async()=>[]})}};
const context={window:windowObj,document,localStorage,navigator:{},console,performance:{now:()=>1},requestAnimationFrame:f=>{},setInterval:()=>0,setTimeout:(f)=>0,clearTimeout(){},Uint8ClampedArray,Date,Math,JSON,String,Number,Object,Array,Map,Set,RegExp,Error,Promise,globalThis:null,SpeechSynthesisUtterance:function(t){this.text=t}};
context.globalThis=context;Object.assign(context,windowObj);windowObj.window=windowObj;windowObj.MiraDebug=undefined;
vm.createContext(context);
for(const f of ['recognition-policy.js','vision-engine.js','japanese-data.js','learning-engine.js','app.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'../js',f),'utf8'),context,{filename:f});
const D=context.window.MiraDebug;assert(D,'MiraDebug');
assert.equal(D.state.stickyStrength,'strong');assert.equal(D.state.autoFreezeEnabled,true);
D.state.autoFreezeEnabled=false;D.state.candidates=[{key:'utility_knife',score:.65},{key:'switch',score:.47}];
D.selectObject('utility_knife',{class:'utility_knife',score:.65,bbox:[0,0,100,30]},{kind:'tentative',reason:'qa'});
assert.equal(D.state.selectedKey,'utility_knife');assert.equal(els.get('jpWord').textContent,'カッターナイフ');assert(D.state.history.some(x=>x.key==='utility_knife'));
assert(els.get('candidateStrip').children.length>=2,'candidate strip');
D.setFrozen(true,'qa');assert.equal(D.state.frozen,true);assert(els.get('freezeBanner').classList.contains('hidden')===false);
D.resumeLive();assert.equal(D.state.frozen,false);assert.equal(D.state.selectedKey,null);
console.log('runtime-stub: 8/8 passed');
