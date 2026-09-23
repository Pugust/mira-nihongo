'use strict';
const assert=require('assert');
Object.defineProperty(global.navigator,'hardwareConcurrency',{value:8,configurable:true});Object.defineProperty(global.navigator,'deviceMemory',{value:8,configurable:true});
require('../js/perception-engine-v2.js');
const P=global.MiraPerceptionV2;

assert.equal(P.chooseHuman({faces:[{conceptId:'face',confidence:.9}],hands:[],current:'hand'}).conceptId,'face');
assert.equal(P.chooseHuman({faces:[],hands:[{conceptId:'hand',confidence:.9}],current:'person'}).conceptId,'hand');
assert.equal(P.chooseHuman({faces:[],hands:[],poses:[{conceptId:'head'}],current:'person'}).conceptId,'person');
// Spatial arbitration: a nearby hand must beat a high-confidence face elsewhere.
const pick=P.chooseHuman({
  faces:[{conceptId:'face',confidence:.99,bbox:[400,20,100,100]}],
  hands:[{conceptId:'hand',confidence:.82,bbox:[25,25,110,110]}],
  current:'person',targetBox:[20,20,120,120]
});
assert.equal(pick.conceptId,'hand');

const t=new P.TemporalTracker(5);t.push('shoe',.86);t.push('shoe',.82);const flip=t.push('laptop',.61);assert.equal(flip.stableLabel,'shoe');assert.equal(t.shouldAccept('laptop',.61),false);
assert.equal(P.tierFromEnvironment({cores:8,memory:8,avgInferenceMs:70}),'advanced');
const profiler=new P.AdaptiveProfiler('auto');for(let i=0;i<8;i++)profiler.observe(500);assert.equal(profiler.tier(),'lite');profiler.set('advanced');assert.equal(profiler.tier(),'advanced');
assert.equal(P.structureFirstDecision([{key:'sheep',support:5,mean:.9},{key:'cabinet',support:2,mean:.3}],{largeRegion:true}).key,'cabinet');

const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
  // Cancellation invalidates stale UI but does not clear the heavyweight budget early.
  const r=new P.BudgetRouter();let active=0,maxActive=0,release;
  const gate=new Promise(res=>release=res);
  const first=r.run('old',async()=>{active++;maxActive=Math.max(maxActive,active);await gate;active--;return'old'});
  await sleep(0);r.cancel('scene-changed');
  assert.equal(r.snapshot().busy,true,'cancel must not pretend a still-running heavy job ended');
  const dropped=await r.run('immediate',async()=>1);assert(dropped.dropped,'non-deferred work must drop while heavy job runs');
  const next=r.run('new',async()=>{active++;maxActive=Math.max(maxActive,active);active--;return'new'},{defer:true,priority:3});
  await sleep(0);assert.equal(maxActive,1);release();
  const oldResult=await first,newResult=await next;
  assert(oldResult.cancelled&&oldResult.stale);assert(newResult.ok&&newResult.value==='new');assert.equal(maxActive,1,'heavy jobs must never overlap');

  // Pending queue is bounded to one and higher/equal priority supersedes stale pending work.
  const q=new P.BudgetRouter();let unlock;const hold=new Promise(res=>unlock=res);
  const running=q.run('running',async()=>{await hold;return 1});await sleep(0);
  const low=q.run('low',async()=>2,{defer:true,priority:1});
  const high=q.run('high',async()=>3,{defer:true,priority:4});
  assert.equal(q.snapshot().queueDepth,1);unlock();
  const [runResult,lowResult,highResult]=await Promise.all([running,low,high]);
  assert(runResult.ok);assert(lowResult.superseded);assert(highResult.ok&&highResult.value===3);assert.equal(q.snapshot().queueDepth,0);
  console.log('perception-v2: arbitration, temporal hold, adaptive profile and budget router OK');
})().catch(e=>{console.error(e);process.exit(1)});
