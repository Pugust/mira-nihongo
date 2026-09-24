'use strict';
const assert=require('assert');
const ai=require('../js/language-ai-v1.js');
assert.equal(ai.heuristicLanguage('EMPURRE A PORTA'),'pt');
assert.equal(ai.heuristicLanguage('Atenção: não entre'),'pt');
assert.equal(ai.heuristicLanguage('PUSH THE DOOR'),'en');
assert.equal(ai.heuristicLanguage('ドアを押してください'),'ja');
console.log('language-ai-v1: PT/EN/JA heuristic routing OK');
