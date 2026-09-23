const assert=require('assert');const W=require('../js/world-model-v1.js');
const s=W.createScene({width:100,height:100});const car=W.addEntity(s,{conceptId:'car',bbox:[10,10,80,60],confidence:.9,status:'stable'});const wheel=W.addEntity(s,{conceptId:'wheel',semanticType:'part',bbox:[15,50,20,20],parentId:car.id,confidence:.8});
assert.equal(W.hitTest(s,20,55).id,wheel.id);assert.equal(W.select(s,wheel.id).conceptId,'wheel');assert.deepEqual(s.breadcrumb,[car.id,wheel.id]);assert(W.relate(s,car.id,wheel.id,'HAS'));assert.equal(W.children(s,car.id).length,1);console.log('world-model-v1 ok');
