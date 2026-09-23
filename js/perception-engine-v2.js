'use strict';
(function(root){
  const now=()=>root.performance?.now?.()??Date.now();
  const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,Number(n)||0));

  class BudgetRouter{
    constructor(){
      this.busy=false;this.active=null;this.pending=null;this.epoch=0;
      this.metrics={runs:0,dropped:0,deferred:0,superseded:0,cancelled:0,errors:0,totalMs:0,lastMs:0,byTask:{}};
    }
    _task(name){return this.metrics.byTask[name]||(this.metrics.byTask[name]={runs:0,dropped:0,deferred:0,cancelled:0,errors:0,totalMs:0,lastMs:0,status:'idle'});}
    snapshot(){
      const m=this.metrics;
      return{busy:this.busy,activeTask:this.active?.task||null,pendingTask:this.pending?.task||null,epoch:this.epoch,...m,avgMs:m.runs?m.totalMs/m.runs:0,queueDepth:this.pending?1:0,byTask:Object.fromEntries(Object.entries(m.byTask).map(([k,v])=>[k,{...v,avgMs:v.runs?v.totalMs/v.runs:0}]))};
    }
    cancel(reason='cancelled'){
      this.epoch++;
      if(this.pending){this.pending.resolve({ok:false,cancelled:true,reason});this._task(this.pending.task).cancelled++;this.metrics.cancelled++;this.pending=null;}
      if(this.active&&!this.active.cancelled){this.active.cancelled=true;this.active.reason=reason;this.metrics.cancelled++;this._task(this.active.task).cancelled++;try{this.active.controller.abort(reason)}catch(_){}}
      // Keep busy=true until the active promise really settles. This is deliberate:
      // cancelling stale UI must never allow a second heavyweight model to overlap it.
    }
    async run(task,fn,{defer=false,priority=0}={}){
      if(typeof fn!=='function')throw new TypeError('BudgetRouter.run requires a function');
      const request={task:String(task||'task'),fn,priority:Number(priority)||0,epoch:this.epoch};
      if(this.busy){
        if(!defer){this.metrics.dropped++;this._task(request.task).dropped++;return{ok:false,dropped:true};}
        this.metrics.deferred++;this._task(request.task).deferred++;
        return new Promise(resolve=>{
          request.resolve=resolve;
          if(this.pending){
            if(request.priority>=this.pending.priority){this.pending.resolve({ok:false,superseded:true});this.metrics.superseded++;this.pending=request;}
            else{this.metrics.dropped++;this._task(request.task).dropped++;resolve({ok:false,dropped:true});}
          }else this.pending=request;
        });
      }
      return this._execute(request);
    }
    async _execute(request){
      // A deferred request becomes stale if the session epoch changed while waiting.
      if(request.epoch!==this.epoch){const out={ok:false,cancelled:true,stale:true};request.resolve?.(out);return out;}
      const controller=new AbortController();const active={...request,controller,cancelled:false};
      this.active=active;this.busy=true;const t=now();const tm=this._task(request.task);tm.status='active';
      let out;
      try{
        const value=await request.fn({signal:controller.signal,isCurrent:()=>request.epoch===this.epoch&&!active.cancelled,epoch:request.epoch});
        if(request.epoch!==this.epoch||active.cancelled)out={ok:false,cancelled:true,stale:true};
        else{const ms=Math.max(0,now()-t);this._record(request.task,ms);out={ok:true,value,ms};}
      }catch(error){
        if(controller.signal.aborted||active.cancelled||request.epoch!==this.epoch)out={ok:false,cancelled:true,stale:true,error};
        else{this.metrics.errors++;tm.errors++;out={ok:false,error};}
      }finally{
        tm.status='idle';this.busy=false;this.active=null;
        request.resolve?.(out);
        const next=this.pending;this.pending=null;
        if(next){queueMicrotask(()=>this._execute(next));}
      }
      return out;
    }
    _record(task,ms){
      this.metrics.runs++;this.metrics.lastMs=ms;this.metrics.totalMs+=ms;
      const m=this._task(task);m.runs++;m.totalMs+=ms;m.lastMs=ms;
    }
  }

  class TemporalTracker{
    constructor(max=6,{holdMargin=.20}={}){this.max=max;this.holdMargin=holdMargin;this.items=[];this.locked=null;}
    push(label,score=.5,meta={}){
      if(label)this.items.push({label,score:clamp(score),at:Date.now(),trackId:meta.trackId||null});
      this.items=this.items.slice(-this.max);
      const best=this.best();if(!best)return null;
      if(!this.locked)this.locked={label:best.label,score:best.score};
      else if(best.label===this.locked.label)this.locked={label:best.label,score:best.score};
      else if(best.margin>=this.holdMargin&&best.score>=this.locked.score*.82)this.locked={label:best.label,score:best.score};
      return{...best,stableLabel:this.locked.label};
    }
    best(){
      const sums={};const t=Date.now();
      for(const x of this.items){const age=Math.max(0,t-x.at),w=Math.max(.28,1-age/6500);sums[x.label]=(sums[x.label]||0)+x.score*w;}
      const ranked=Object.entries(sums).sort((a,b)=>b[1]-a[1]);
      return ranked[0]?{label:ranked[0][0],score:ranked[0][1],margin:ranked[0][1]-(ranked[1]?.[1]||0),samples:this.items.length}:null;
    }
    shouldAccept(label,score=.5){
      if(!label)return false;const b=this.best();if(!b||this.items.length<2)return true;
      if(label===b.label)return true;
      // One contradictory frame is not enough to flip a strong recent concept.
      return Number(score)>=.90&&b.margin<.18;
    }
    reset(){this.items=[];this.locked=null;}
  }

  function boxCenter(b){return b?[b[0]+b[2]/2,b[1]+b[3]/2]:null}
  function iou(a,b){if(!a||!b)return 0;const x=Math.max(a[0],b[0]),y=Math.max(a[1],b[1]),r=Math.min(a[0]+a[2],b[0]+b[2]),d=Math.min(a[1]+a[3],b[1]+b[3]);const inter=Math.max(0,r-x)*Math.max(0,d-y),u=a[2]*a[3]+b[2]*b[3]-inter;return u?inter/u:0}
  function centerDistance(a,b){const ac=boxCenter(a),bc=boxCenter(b);if(!ac||!bc)return Infinity;const norm=Math.max(1,Math.hypot(b[2],b[3]));return Math.hypot(ac[0]-bc[0],ac[1]-bc[1])/norm}
  function bestEntity(list,concept,targetBox){
    const all=(list||[]).filter(x=>x.conceptId===concept);
    if(!all.length)return null;if(!targetBox)return all.sort((a,b)=>(b.confidence||0)-(a.confidence||0))[0];
    const candidates=all.filter(x=>x.bbox);if(!candidates.length)return null;
    return candidates.map(x=>({x,match:iou(x.bbox,targetBox)*1.8+Math.max(0,1-centerDistance(x.bbox,targetBox))+(x.confidence||0)*.25})).sort((a,b)=>b.match-a.match)[0]?.x||null;
  }
  function chooseHuman({faces=[],hands=[],poses=[],current=null,targetBox=null}={}){
    const face=bestEntity(faces,'face',targetBox),hand=bestEntity(hands,'hand',targetBox);
    // Current semantic intent decides which specialist receives a small prior, while
    // spatial overlap keeps a face elsewhere in the frame from stealing a hand target.
    const fs=face?clamp(face.confidence||.85)+iou(face.bbox,targetBox)*.55+(current==='face'?.12:0):0;
    const hs=hand?clamp(hand.confidence||.82)+iou(hand.bbox,targetBox)*.55+(current==='hand'?.12:0):0;
    if(face||hand){
      if(face&&(!hand||fs>=hs+.03))return{conceptId:'face',entity:face,reason:'face-landmarks',score:fs};
      if(hand)return{conceptId:'hand',entity:hand,reason:'hand-landmarks',score:hs};
    }
    if((poses||[]).length&&current==='person')return{conceptId:'person',entity:null,reason:'body-pose',score:.72};
    return null;
  }

  const TIER_CONFIG={
    lite:{sampleMultiplier:1.30,multiscaleRegions:1,sceneSpecialists:1,ocrScale:.80,label:'Lite'},
    standard:{sampleMultiplier:1.00,multiscaleRegions:2,sceneSpecialists:2,ocrScale:1,label:'Standard'},
    advanced:{sampleMultiplier:.86,multiscaleRegions:3,sceneSpecialists:3,ocrScale:1,label:'Advanced'}
  };
  function tierFromEnvironment({cores,memory,avgInferenceMs=0}={}){
    const nav=root.navigator||{};cores=Number(cores??nav.hardwareConcurrency??2);memory=Number(memory??nav.deviceMemory??0);
    let score=0;if(cores>=8)score+=2;else if(cores>=4)score+=1;if(memory>=8)score+=2;else if(memory>=4)score+=1;
    if(avgInferenceMs>0){if(avgInferenceMs<95)score+=2;else if(avgInferenceMs<185)score+=1;else if(avgInferenceMs>420)score-=2;else if(avgInferenceMs>280)score-=1;}
    return score>=5?'advanced':score>=3?'standard':'lite';
  }
  class AdaptiveProfiler{
    constructor(setting='auto'){this.setting=['auto','lite','standard','advanced'].includes(setting)?setting:'auto';this.samples=[];this.lastAuto=tierFromEnvironment();}
    set(setting){this.setting=['auto','lite','standard','advanced'].includes(setting)?setting:'auto';return this.tier();}
    observe(ms){ms=Number(ms);if(Number.isFinite(ms)&&ms>0){this.samples.push(ms);this.samples=this.samples.slice(-8);this.lastAuto=tierFromEnvironment({avgInferenceMs:this.average()});}return this.tier();}
    average(){return this.samples.length?this.samples.reduce((a,b)=>a+b,0)/this.samples.length:0}
    tier(){return this.setting==='auto'?this.lastAuto:this.setting}
    config(){return TIER_CONFIG[this.tier()]||TIER_CONFIG.standard}
    snapshot(){return{setting:this.setting,tier:this.tier(),averageMs:this.average(),samples:this.samples.length,config:this.config()}}
  }

  function structureFirstDecision(candidates=[],{largeRegion=true}={}){
    const structural=new Set(['cabinet','wardrobe','shelf','drawer','door','window','desk','table','dining table','refrigerator','oven','microwave','sink','building','wall','floor','ceiling']);
    const c=(candidates||[]).filter(x=>x?.key&&(!largeRegion||structural.has(x.key))).sort((a,b)=>(b.support||0)-(a.support||0)||(b.mean||0)-(a.mean||0));
    return c[0]||null;
  }

  root.MiraPerceptionV2={BudgetRouter,TemporalTracker,chooseHuman,tierFromEnvironment,AdaptiveProfiler,TIER_CONFIG,structureFirstDecision,iou};
  if(typeof module!=='undefined')module.exports=root.MiraPerceptionV2;
})(typeof window!=='undefined'?window:globalThis);
