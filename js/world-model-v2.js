'use strict';
(function(root){
  const TYPES=new Set(['object','part','subpart','living','surface','structure','environment','collective','spatial','material','unknown']);
  const RELATIONS=new Set(['PART_OF','HAS','INSIDE','ON','UNDER','NEXT_TO','NEAR','HOLDS','WEARS','TEXT_ON']);
  const clamp01=n=>{n=Number(n);return Number.isFinite(n)?Math.max(0,Math.min(1,n)):0};
  const normBox=b=>{if(!Array.isArray(b)||b.length!==4)return null;const a=b.map(Number);return a.every(Number.isFinite)&&a[2]>=0&&a[3]>=0?a:null};
  const cleanText=t=>Array.isArray(t)?t.filter(Boolean).map(x=>typeof x==='string'?{text:x}:({...x})) : [];
  function createScene(meta={}){return{id:meta.id||`scene-${Date.now()}`,schemaVersion:2,createdAt:meta.createdAt||Date.now(),updatedAt:Date.now(),width:Number(meta.width)||0,height:Number(meta.height)||0,entities:[],relations:[],selectedId:null,breadcrumb:[],meta:{...(meta.meta||{})}}}
  function addEntity(scene,input={}){
    if(!scene||!Array.isArray(scene.entities))throw new Error('Invalid scene');
    const e={id:input.id||`e${scene.entities.length+1}`,conceptId:String(input.conceptId||'unknown'),semanticType:TYPES.has(input.semanticType)?input.semanticType:'object',bbox:normBox(input.bbox),region:input.region||null,confidence:clamp01(input.confidence),status:['stable','tentative','unknown'].includes(input.status)?input.status:'tentative',source:String(input.source||'unknown'),parentId:input.parentId||null,children:Array.isArray(input.children)?input.children.slice():[],evidence:Array.isArray(input.evidence)?input.evidence.map(x=>({...x})):[],relations:Array.isArray(input.relations)?input.relations.slice():[],trackingId:input.trackingId||null,text:cleanText(input.text),attributes:{...(input.attributes||{})},userConfirmed:!!input.userConfirmed,userCorrected:!!input.userCorrected,createdAt:input.createdAt||Date.now(),updatedAt:Date.now()};
    scene.entities.push(e);scene.updatedAt=Date.now();
    if(e.parentId){const p=scene.entities.find(x=>x.id===e.parentId);if(p){if(!p.children.includes(e.id))p.children.push(e.id);relate(scene,e.id,p.id,'PART_OF',e.confidence,{source:'hierarchy'});relate(scene,p.id,e.id,'HAS',e.confidence,{source:'hierarchy'})}}
    return e;
  }
  function updateEntity(scene,id,patch={}){
    const e=scene?.entities?.find(x=>x.id===id);if(!e)return null;const oldParent=e.parentId;
    for(const k of ['conceptId','semanticType','status','source','trackingId','parentId'])if(k in patch&&patch[k]!=null)e[k]=patch[k];
    if('bbox' in patch)e.bbox=normBox(patch.bbox);if('region' in patch)e.region=patch.region||null;if('confidence' in patch)e.confidence=Math.max(e.confidence,clamp01(patch.confidence));if(patch.attributes)e.attributes={...e.attributes,...patch.attributes};if(Array.isArray(patch.text))e.text=cleanText(patch.text);if('userConfirmed' in patch)e.userConfirmed=!!patch.userConfirmed;if('userCorrected' in patch)e.userCorrected=!!patch.userCorrected;
    if(Array.isArray(patch.evidence))for(const ev of patch.evidence)addEvidence(scene,id,ev);
    if(oldParent!==e.parentId){
      const old=scene.entities.find(x=>x.id===oldParent);if(old){old.children=old.children.filter(x=>x!==id);old.relations=old.relations.filter(r=>!(r.toId===id&&r.type==='HAS'))}
      e.relations=e.relations.filter(r=>!(r.toId===oldParent&&r.type==='PART_OF'));
      scene.relations=scene.relations.filter(r=>!(r.meta?.source==='hierarchy'&&((r.fromId===id&&r.toId===oldParent)||(r.fromId===oldParent&&r.toId===id))));
      const p=scene.entities.find(x=>x.id===e.parentId);if(p){if(!p.children.includes(id))p.children.push(id);relate(scene,id,p.id,'PART_OF',e.confidence,{source:'hierarchy'});relate(scene,p.id,id,'HAS',e.confidence,{source:'hierarchy'})}
    }
    e.updatedAt=Date.now();scene.updatedAt=Date.now();return e;
  }
  function addEvidence(scene,id,evidence={}){const e=scene?.entities?.find(x=>x.id===id);if(!e)return null;const ev={...evidence,at:evidence.at||Date.now()};const same=e.evidence.find(x=>x.source===ev.source&&x.kind===ev.kind&&x.label===ev.label);if(same)Object.assign(same,ev);else e.evidence.push(ev);e.updatedAt=Date.now();return ev}
  function attachText(scene,id,item={}){const e=scene?.entities?.find(x=>x.id===id);if(!e)return null;const t=typeof item==='string'?{text:item}:{...item};if(!t.text)return null;const key=`${t.text}|${JSON.stringify(t.bbox||null)}`;if(!e.text.some(x=>`${x.text}|${JSON.stringify(x.bbox||null)}`===key))e.text.push(t);e.updatedAt=Date.now();return t}
  function relate(scene,fromId,toId,type,confidence=1,meta={}){if(!RELATIONS.has(type))throw new Error('Unsupported relation');if(!scene.entities.some(e=>e.id===fromId)||!scene.entities.some(e=>e.id===toId))return null;let r=scene.relations.find(x=>x.fromId===fromId&&x.toId===toId&&x.type===type);if(r){r.confidence=Math.max(r.confidence,clamp01(confidence));Object.assign(r.meta,meta);return r}r={fromId,toId,type,confidence:clamp01(confidence),meta:{...meta}};scene.relations.push(r);const a=scene.entities.find(x=>x.id===fromId);if(a&&!a.relations.some(x=>x.toId===toId&&x.type===type))a.relations.push({toId,type});return r}
  function area(e){return e?.bbox?e.bbox[2]*e.bbox[3]:Infinity}
  function hitTest(scene,x,y){return(scene?.entities||[]).filter(e=>e.bbox&&x>=e.bbox[0]&&x<=e.bbox[0]+e.bbox[2]&&y>=e.bbox[1]&&y<=e.bbox[1]+e.bbox[3]).sort((a,b)=>area(a)-area(b)||b.confidence-a.confidence)[0]||null}
  function select(scene,id){const e=(scene?.entities||[]).find(x=>x.id===id)||null;if(!e)return null;scene.selectedId=e.id;const chain=[];let cur=e,guard=0;while(cur&&guard++<16){chain.unshift(cur);cur=cur.parentId?scene.entities.find(x=>x.id===cur.parentId):null}scene.breadcrumb=chain.map(x=>x.id);return e}
  function children(scene,id){return(scene?.entities||[]).filter(e=>e.parentId===id)}
  function byTrackingId(scene,trackingId){return(scene?.entities||[]).find(e=>e.trackingId&&e.trackingId===trackingId)||null}
  function snapshot(scene){return JSON.parse(JSON.stringify(scene))}
  const api={TYPES,RELATIONS,createScene,addEntity,updateEntity,addEvidence,attachText,relate,hitTest,select,children,byTrackingId,snapshot};
  // Compatibility alias: existing Mira code can migrate incrementally while receiving schema v2.
  root.MiraWorldModelV2=api;root.MiraWorldModelV1=api;
  if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
