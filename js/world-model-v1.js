'use strict';
(function(root){
  const TYPES=new Set(['object','part','subpart','living','surface','structure','environment','collective','spatial','material','unknown']);
  const RELATIONS=new Set(['PART_OF','HAS','INSIDE','ON','UNDER','NEXT_TO','NEAR','HOLDS','WEARS']);
  function clamp01(n){n=Number(n);return Number.isFinite(n)?Math.max(0,Math.min(1,n)):0}
  function normBox(b){if(!Array.isArray(b)||b.length!==4)return null;const a=b.map(Number);return a.every(Number.isFinite)&&a[2]>=0&&a[3]>=0?a:null}
  function createScene(meta={}){return{id:meta.id||`scene-${Date.now()}`,createdAt:meta.createdAt||Date.now(),width:Number(meta.width)||0,height:Number(meta.height)||0,entities:[],relations:[],selectedId:null,breadcrumb:[]}}
  function addEntity(scene,input={}){if(!scene||!Array.isArray(scene.entities))throw new Error('Invalid scene');const e={id:input.id||`e${scene.entities.length+1}`,conceptId:String(input.conceptId||'unknown'),semanticType:TYPES.has(input.semanticType)?input.semanticType:'object',bbox:normBox(input.bbox),region:input.region||null,confidence:clamp01(input.confidence),status:['stable','tentative','unknown'].includes(input.status)?input.status:'tentative',source:String(input.source||'unknown'),parentId:input.parentId||null,evidence:Array.isArray(input.evidence)?input.evidence.slice():[],userConfirmed:!!input.userConfirmed,userCorrected:!!input.userCorrected};scene.entities.push(e);return e}
  function relate(scene,fromId,toId,type,confidence=1){if(!RELATIONS.has(type))throw new Error('Unsupported relation');if(!scene.entities.some(e=>e.id===fromId)||!scene.entities.some(e=>e.id===toId))return null;const r={fromId,toId,type,confidence:clamp01(confidence)};if(!scene.relations.some(x=>x.fromId===fromId&&x.toId===toId&&x.type===type))scene.relations.push(r);return r}
  function area(e){return e?.bbox?e.bbox[2]*e.bbox[3]:Infinity}
  function hitTest(scene,x,y){return(scene?.entities||[]).filter(e=>e.bbox&&x>=e.bbox[0]&&x<=e.bbox[0]+e.bbox[2]&&y>=e.bbox[1]&&y<=e.bbox[1]+e.bbox[3]).sort((a,b)=>area(a)-area(b)||b.confidence-a.confidence)[0]||null}
  function select(scene,id){const e=(scene?.entities||[]).find(x=>x.id===id)||null;if(!e)return null;scene.selectedId=e.id;const chain=[];let cur=e,guard=0;while(cur&&guard++<16){chain.unshift(cur);cur=cur.parentId?scene.entities.find(x=>x.id===cur.parentId):null}scene.breadcrumb=chain.map(x=>x.id);return e}
  function children(scene,id){return(scene?.entities||[]).filter(e=>e.parentId===id)}
  function snapshot(scene){return JSON.parse(JSON.stringify(scene))}
  const api={TYPES,RELATIONS,createScene,addEntity,relate,hitTest,select,children,snapshot};root.MiraWorldModelV1=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
