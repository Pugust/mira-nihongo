'use strict';
((root)=>{
  class VisionScheduler{
    constructor(){this.epoch=0;this.busy=false;this.kind=null;this.startedAt=0;this.lastMs=0;this.dropped=0}
    cancel(){this.epoch++;this.busy=false;this.kind=null}
    token(){return this.epoch}
    valid(t){return t===this.epoch}
    async run(kind,fn){if(this.busy){this.dropped++;return{skipped:true}}const t=this.epoch;this.busy=true;this.kind=kind;this.startedAt=performance.now?.()||Date.now();try{const value=await fn(()=>this.valid(t));return this.valid(t)?{value,skipped:false}:{cancelled:true}}finally{this.lastMs=Math.max(0,(performance.now?.()||Date.now())-this.startedAt);if(this.valid(t)){this.busy=false;this.kind=null}}}
    snapshot(){return{busy:this.busy,kind:this.kind,lastMs:this.lastMs,dropped:this.dropped,epoch:this.epoch}}
  }
  function shouldEscalate({hasStable=false,manual=false,explore=false}={}){return !hasStable&&(manual||explore)}
  root.MiraPerformanceV1={VisionScheduler,shouldEscalate};if(typeof module!=='undefined')module.exports=root.MiraPerformanceV1;
})(typeof window!=='undefined'?window:globalThis);
