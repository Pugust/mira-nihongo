'use strict';
const assert=require('assert');
const r=require('../js/japanese-reading-v1.js');
const sentence=r.analyze('ドアを押してください',{});
assert.equal(sentence.kana,'どあ を おして ください');
assert.equal(sentence.romaji,'doa o oshite kudasai');
assert.equal(sentence.complete,true);
const db={flip_flop:{jp:'ビーチサンダル',kana:'びーちさんだる',romaji:'bīchi sandaru'}};
const exact=r.analyze('ビーチサンダル',db);
assert.equal(exact.romaji,'bīchi sandaru');
assert.equal(r.kataToHira('カメラ'),'かめら');

const tokenized=r.tokensToReading([
  {surface:'ドア',reading:'ドア'},
  {surface:'を',reading:'ヲ'},
  {surface:'押し',reading:'オシ'},
  {surface:'て',reading:'テ'},
  {surface:'ください',reading:'クダサイ'}
],'ドアを押してください');
assert.equal(tokenized.kana,'どあ を おし て ください');
assert.equal(tokenized.romaji,'doa o oshi te kudasai');
assert.equal(tokenized.complete,true);
console.log('japanese-reading-v1: instruction, DB and tokenized reading OK');
