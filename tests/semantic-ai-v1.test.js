'use strict';
const assert=require('assert');
const ai=require('../js/semantic-ai-v1.js');
const db={
  toilet:{aliases:['toilet']},guitar:{aliases:['guitar']},chair:{aliases:['chair']},cabinet:{aliases:['cabinet']},space_heater:{aliases:['heater']},sink:{aliases:['sink']},
  surfboard:{aliases:['surfboard']},flip_flop:{aliases:['flip flop']},sandal:{aliases:['sandal']},shoe:{aliases:['shoe']},slipper:{aliases:['slipper']},skateboard:{aliases:['skateboard']}
};
assert.equal(ai.labelFor('floor',{floor:{aliases:['chao']}}),'floor','CLIP labels must remain English instead of using Portuguese learner aliases');
let list=ai.buildCandidates({currentKey:'toilet',db,limit:20});
assert(list.some(x=>x.key==='guitar'),'toilet confusion set must include guitar');
assert(list.find(x=>x.key==='guitar').label.toLowerCase().includes('guitar'));
list=ai.buildCandidates({currentKey:'surfboard',db,limit:20});
assert(list.some(x=>x.key==='flip_flop'),'surfboard confusion set must include flip-flop');
const stable=ai.decision([{key:'guitar',score:.78},{key:'toilet',score:.18}]);
assert.equal(stable.kind,'stable');assert.equal(stable.top.key,'guitar');
const tentative=ai.decision([{key:'flip_flop',score:.42},{key:'surfboard',score:.34}]);
assert.equal(tentative.kind,'tentative');
const unknown=ai.decision([{key:'shoe',score:.23},{key:'sandal',score:.21}]);
assert.equal(unknown.kind,'unknown');
const fused=ai.fuse([{key:'toilet',score:.52,sources:['detector']}],[{key:'guitar',score:.73}]);
const guitar=fused.find(x=>x.key==='guitar');
assert(guitar&&guitar.sources.includes('semantic-ai'));assert(guitar.semanticScore===.73);
console.log('semantic-ai-v1: candidate regressions, fusion and confidence policy OK');
