const assert=require('assert');const O=require('../js/visual-ontology-v1.js');
assert.equal(O.typeOf('forest'),'environment');assert.equal(O.typeOf('ground'),'surface');assert(O.partsFor('car').includes('wheel'));assert(O.partsFor('hand').includes('nail'));const db={};O.install(db);assert.equal(db.forest.jp,'森');assert.equal(db.nail.jp,'爪');console.log('visual-ontology-v1 ok');
