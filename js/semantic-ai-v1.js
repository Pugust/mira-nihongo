'use strict';
(function(root){
  const CONFUSION_GROUPS={
    toilet:['toilet','guitar','chair','cabinet','space_heater','sink'],
    surfboard:['surfboard','flip_flop','sandal','shoe','slipper','skateboard'],
    person:['person','hand','face','shoe','shirt'],
    laptop:['laptop','shoe','book','keyboard','monitor'],
    shoe:['shoe','flip_flop','sandal','slipper','surfboard'],
    cabinet:['cabinet','wardrobe','shelf','refrigerator','door','drawer'],
    animal:['dog','cat','bird','person','plant','bag']
  };
  const PRIORITY_KEYS=['guitar','flip_flop','sandal','slipper','shoe','toilet','surfboard','cabinet','wardrobe','shelf','chair','table','desk','door','window','bottle','bottle_cap','cup','mug','glass','plate','fork','knife','spoon','phone','laptop','keyboard','monitor','mouse','book','backpack','bag','car','bicycle','motorcycle','bus','person','hand','face','tree','flower','plant','floor','wall','sink','refrigerator','microwave','oven','fan','space_heater','toolbox','utility_knife','scissors','clock','remote','tv'];
  const LABEL_OVERRIDES={
    guitar:'acoustic or electric guitar',flip_flop:'flip-flop sandal',sandal:'sandal footwear',slipper:'slipper footwear',
    toilet:'toilet or bathroom fixture',surfboard:'surfboard',space_heater:'portable space heater',utility_knife:'utility knife or box cutter',
    bottle_cap:'bottle cap',trash_bin:'trash can',washing_machine:'washing machine',frying_pan:'frying pan'
  };
  const now=()=>root.performance?.now?.()??Date.now();
  function labelFor(key,db){void db;return LABEL_OVERRIDES[key]||String(key||'').replaceAll('_',' ')}
  function uniq(arr){const s=new Set;return arr.filter(x=>x&&!s.has(x)&&(s.add(x),true))}
  function buildCandidates({currentKey=null,candidates=[],db={},limit=72}={}){
    const keys=[];
    keys.push(currentKey);
    for(const c of candidates||[])keys.push(c?.key);
    for(const k of CONFUSION_GROUPS[currentKey]||[])keys.push(k);
    if(currentKey&&root.MiraVisualHierarchyV1?.childrenFor){for(const k of root.MiraVisualHierarchyV1.childrenFor(currentKey)||[])keys.push(k)}
    for(const k of PRIORITY_KEYS)keys.push(k);
    for(const k of Object.keys(db||{})){if(keys.length>=limit*2)break;keys.push(k)}
    return uniq(keys).filter(k=>db?.[k]).slice(0,limit).map(key=>({key,label:labelFor(key,db)}));
  }
  function normalizeResults(results=[]){return(results||[]).filter(x=>x?.key&&Number.isFinite(Number(x.score))).map(x=>({...x,score:Math.max(0,Math.min(1,Number(x.score)))})).sort((a,b)=>b.score-a.score)}
  function fuse(existing=[],ai=[]){
    const m=new Map();
    for(const c of existing||[]){if(!c?.key)continue;m.set(c.key,{...c,key:c.key,score:Number(c.score||c.probability||0),sources:[...(c.sources||[])]})}
    for(const a of normalizeResults(ai).slice(0,8)){
      const old=m.get(a.key)||{key:a.key,score:0,sources:[]};
      const oldScore=Math.max(0,Math.min(1,Number(old.score||0)));
      const semantic=Math.max(0,Math.min(1,a.score));
      const score=1-(1-oldScore*.68)*(1-semantic*.82);
      m.set(a.key,{...old,score,semanticScore:semantic,sources:uniq([...(old.sources||[]),'semantic-ai'])});
    }
    return [...m.values()].sort((a,b)=>b.score-a.score);
  }
  function decision(results=[]){const r=normalizeResults(results),a=r[0],b=r[1];if(!a)return{kind:'unknown',top:null,margin:0};const margin=a.score-(b?.score||0);if(a.score>=.60&&margin>=.14)return{kind:'stable',top:a,margin};if(a.score>=.30&&margin>=.045)return{kind:'tentative',top:a,margin};return{kind:'unknown',top:a,margin}}

  let worker=null,seq=0,status='idle',loaded=false,backend='none',lastMs=0,lastError=null,progress=0,pending=new Map(),idleTimer=null;
  function clearIdle(){if(idleTimer){clearTimeout(idleTimer);idleTimer=null}}
  function armIdle(){clearIdle();idleTimer=setTimeout(()=>dispose(),120000)}
  function ensureWorker(){
    if(worker)return worker;if(typeof Worker==='undefined')throw new Error('Web Worker indisponível');
    worker=new Worker('js/semantic-ai-worker-v1.js',{type:'module'});
    worker.onmessage=e=>{
      const m=e.data||{};
      if(m.type==='status'){status=m.status||status;progress=Number(m.progress)||0;if(m.backend)backend=m.backend;if(m.loaded!=null)loaded=!!m.loaded;for(const p of pending.values())p.onProgress?.(m);return}
      const p=pending.get(m.id);if(!p)return;pending.delete(m.id);if(m.type==='result'){loaded=true;status='ready';backend=m.backend||backend;lastMs=Number(m.ms)||0;p.resolve({results:m.results||[],backend,lastMs})}else{lastError=m.error||'Falha na IA semântica';status='error';p.reject(new Error(lastError))}armIdle();
    };
    worker.onerror=e=>{lastError=e.message||'Falha no worker semântico';status='error';for(const p of pending.values())p.reject(new Error(lastError));pending.clear();worker?.terminate();worker=null};
    return worker;
  }
  function canvasToBlob(canvas){return new Promise((resolve,reject)=>{if(!canvas?.toBlob)return reject(new Error('Canvas inválido'));canvas.toBlob(b=>b?resolve(b):reject(new Error('Falha ao preparar imagem')),'image/jpeg',.88)})}
  async function analyze(canvas,candidates,{signal,profile='standard',onProgress,timeoutMs=480000}={}){
    if(signal?.aborted)throw new DOMException('Aborted','AbortError');const list=(candidates||[]).filter(x=>x?.key&&x?.label);if(list.length<2)throw new Error('Poucos candidatos semânticos');
    const blob=await canvasToBlob(canvas);if(signal?.aborted)throw new DOMException('Aborted','AbortError');const w=ensureWorker(),id=++seq;status=loaded?'analyzing':'loading';clearIdle();
    return new Promise((resolve,reject)=>{
      const t=setTimeout(()=>{if(!pending.has(id))return;pending.delete(id);reject(new Error('IA semântica excedeu o tempo limite'));dispose()},timeoutMs);
      const finish={onProgress,resolve:v=>{clearTimeout(t);resolve(v)},reject:e=>{clearTimeout(t);reject(e)}};pending.set(id,finish);
      const abort=()=>{if(!pending.has(id))return;pending.delete(id);clearTimeout(t);reject(new DOMException('Aborted','AbortError'));dispose()};signal?.addEventListener('abort',abort,{once:true});
      w.postMessage({type:'analyze',id,image:blob,candidates:list,profile});
    });
  }
  function dispose(){clearIdle();for(const p of pending.values())p.reject(new Error('IA semântica reiniciada'));pending.clear();if(worker){try{worker.postMessage({type:'dispose'})}catch(_){}worker.terminate();worker=null}loaded=false;status='idle';progress=0;backend='none'}
  function snapshot(){return{status,loaded,backend,lastMs,progress,error:lastError}}
  const api={CONFUSION_GROUPS,PRIORITY_KEYS,LABEL_OVERRIDES,labelFor,buildCandidates,fuse,decision,analyze,dispose,snapshot};root.MiraSemanticAIV1=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
