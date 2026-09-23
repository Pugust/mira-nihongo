'use strict';
const assert=require('assert');const O=require('../js/visual-ontology-v1.js');const {JAPANESE_DB}=require('../js/japanese-data.js');
assert.equal(O.typeOf('forest'),'environment');assert.equal(O.typeOf('ground'),'surface');assert(O.partsFor('car').includes('wheel'));assert(O.partsFor('hand').includes('fingernail'));assert(!O.partsFor('hand').includes('nail'));
assert.equal(Object.keys(JAPANESE_DB).length,383,'base vocabulary count must remain frozen for migration compatibility');assert.equal(JAPANESE_DB.nail.jp,'釘','base nail means metal nail/prego');
const db=JSON.parse(JSON.stringify(JAPANESE_DB));O.install(db);assert.equal(db.fingernail.jp,'爪');assert.equal(db.pull_tab.jp,'引き手');assert.equal(db.nail.jp,'釘','ontology install must not overwrite existing canonical vocabulary');assert(Object.keys(db).length>=383);
console.log('visual-ontology-v1: semantic collision guard + runtime ontology install OK');
