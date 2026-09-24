'use strict';
let pipelineFn=null,classifier=null,backend='none',loadPromise=null,lastUse=0,disposeTimer=null;
const CDN='https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1';
function postStatus(status,extra={}){self.postMessage({type:'status',status,backend,loaded:!!classifier,...extra})}
async function lib(){if(!pipelineFn){const m=await import(CDN);pipelineFn=m.pipeline}return pipelineFn}
async function loadClassifier(){
  if(classifier)return classifier;if(loadPromise)return loadPromise;
  loadPromise=(async()=>{
    const pipeline=await lib();const progress_callback=p=>{const pr=Number(p?.progress);postStatus('loading',{progress:Number.isFinite(pr)?pr/100:0,file:p?.file||''})};
    if(self.navigator?.gpu){try{classifier=await pipeline('zero-shot-image-classification','Xenova/clip-vit-base-patch32',{device:'webgpu',dtype:'q8',progress_callback});backend='webgpu'}catch(e){postStatus('fallback',{error:String(e?.message||e)});classifier=null}}
    if(!classifier){classifier=await pipeline('zero-shot-image-classification','Xenova/clip-vit-base-patch32',{device:'wasm',dtype:'q8',progress_callback});backend='wasm'}
    postStatus('ready',{progress:1});return classifier;
  })().finally(()=>{loadPromise=null});return loadPromise;
}
function armDispose(){if(disposeTimer)clearTimeout(disposeTimer);disposeTimer=setTimeout(disposeNow,120000)}
async function disposeNow(){if(disposeTimer)clearTimeout(disposeTimer);disposeTimer=null;const c=classifier;classifier=null;backend='none';if(c?.dispose)try{await c.dispose()}catch(_){}postStatus('idle',{progress:0})}
self.onmessage=async e=>{
  const m=e.data||{};if(m.type==='dispose'){await disposeNow();return}if(m.type!=='analyze')return;const t=performance.now();lastUse=Date.now();
  try{
    const c=await loadClassifier();postStatus('analyzing');const labels=m.candidates.map(x=>x.label);const raw=await c(m.image,labels,{hypothesis_template:'a clear photo of {}'});const byLabel=new Map(m.candidates.map(x=>[x.label,x.key]));const results=(Array.isArray(raw)?raw:[]).map(x=>({key:byLabel.get(x.label),label:x.label,score:Number(x.score)||0})).filter(x=>x.key).sort((a,b)=>b.score-a.score);self.postMessage({type:'result',id:m.id,results:results.slice(0,12),backend,ms:performance.now()-t});postStatus('ready');armDispose();
  }catch(err){self.postMessage({type:'error',id:m.id,error:String(err?.message||err)});postStatus('error')}
};
