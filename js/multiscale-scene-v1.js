'use strict';
(function(root){
  const STRUCTURAL=new Set(['cabinet','wardrobe','shelf','drawer','door','window','desk','table','refrigerator','oven','microwave','sink','building']);
  function regions(w,h){return[
    {name:'whole',x:0,y:0,w,h,weight:1},
    {name:'center',x:w*.08,y:h*.08,w:w*.84,h:h*.84,weight:.96},
    {name:'upper',x:0,y:0,w,h:h*.64,weight:.90},
    {name:'lower',x:0,y:h*.36,w,h:h*.64,weight:.90},
    {name:'left',x:0,y:h*.08,w:w*.64,h:h*.84,weight:.84},
    {name:'right',x:w*.36,y:h*.08,w:w*.64,h:h*.84,weight:.84}
  ]}
  function aggregate(samples){const m=new Map();for(const s of samples||[])for(const c of s.candidates||[]){if(!c?.key)continue;const score=(Number(c.probability??c.score)||0)*(s.weight||1);const a=m.get(c.key)||{key:c.key,support:0,max:0,total:0,regions:[]};a.support++;a.max=Math.max(a.max,score);a.total+=score;a.regions.push(s.name);m.set(c.key,a)}return[...m.values()].map(a=>({...a,mean:a.total/a.support,structural:STRUCTURAL.has(a.key)})).sort((a,b)=>(b.support*1.2+b.mean+b.max)-(a.support*1.2+a.mean+a.max))}
  function accept(a){if(!a)return false;if(a.structural)return a.support>=2&&a.max>=.18&&a.mean>=.10;return a.support>=2&&a.max>=.28&&a.mean>=.15}
  root.MiraMultiScaleSceneV1={regions,aggregate,accept,STRUCTURAL};if(typeof module!=='undefined')module.exports=root.MiraMultiScaleSceneV1;
})(typeof window!=='undefined'?window:globalThis);
