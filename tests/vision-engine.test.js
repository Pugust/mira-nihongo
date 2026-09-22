'use strict';
const assert=require('assert');
const V=require('../js/vision-engine.js');

function ranked(o){const r=V.rankCandidates(o);return {r,d:V.decide(r)}}

{
  const {r,d}=ranked({detector:{key:'bottle',score:.91},bbox:[0,0,100,240],frameWidth:640,frameHeight:480});
  assert.equal(r[0].key,'bottle');assert.equal(d.kind,'stable');
}
{
  const {r,d}=ranked({detector:{key:'switch',score:.80},verifier:[{key:'switch',probability:.22}],bbox:[0,0,50,300],frameWidth:640,frameHeight:480});
  assert.equal(r[0].key,'utility_knife');assert.notEqual(d.kind,'stable','ambiguous knife must request confirmation');
}
{
  const {r,d}=ranked({detector:{key:'cell phone',score:.76},verifier:[{key:'cell phone',probability:.18}],bbox:[0,0,45,280],frameWidth:640,frameHeight:480});
  assert.equal(r[0].key,'utility_knife');assert.notEqual(d.kind,'stable');
}
{
  const {r,d}=ranked({detector:{key:'person',score:.90},bbox:[0,0,300,330],frameWidth:640,frameHeight:480,skinRatio:.55});
  assert.equal(r[0].key,'hand');assert.equal(d.kind,'tentative');
}
{
  const {r,d}=ranked({detector:{key:'person',score:.83},verifier:[{key:'shoe',probability:.27}],bbox:[0,0,180,350],frameWidth:640,frameHeight:480,skinRatio:.02});
  assert.equal(r[0].key,'shoe');assert.equal(d.kind,'tentative');
}
{
  const {r,d}=ranked({detector:{key:'frisbee',score:.82},verifier:[{key:'frisbee',probability:.14}],bbox:[0,0,70,72],frameWidth:640,frameHeight:480});
  assert.equal(r[0].key,'bottle_cap');assert.equal(d.kind,'tentative');
}
{
  const part=V.inferPartCandidate({target:{class:'bottle',bbox:[100,100,120,300]},focusPoint:{x:160,y:130},focusBox:[135,110,50,50]});
  assert(part);assert.equal(part.key,'bottle_cap');
  const {r,d}=ranked({detector:{key:'bottle',score:.92},bbox:[100,100,120,300],frameWidth:640,frameHeight:480,part});
  assert.equal(r[0].key,'bottle_cap');assert.equal(d.kind,'stable');
}
{
  let streak=0;for(let i=0;i<4;i++){const x=V.trackingChanged({motion:.20,distance:32,strength:'strong',streak});streak=x.next;assert.equal(x.release,false)}
  const x=V.trackingChanged({motion:.20,distance:32,strength:'strong',streak});assert.equal(x.release,true);
}
{
  const r=V.rankCandidates({detector:{key:'frisbee',score:.30},bbox:[0,0,200,200],frameWidth:640,frameHeight:480});const d=V.decide(r);assert.notEqual(d.kind,'stable');
}
console.log('vision-engine: 9/9 passed');
