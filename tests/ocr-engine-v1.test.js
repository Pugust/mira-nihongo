'use strict';
const assert=require('assert');
const ocr=require('../js/ocr-engine-v1.js');
const words=[
  {text:'EMPURRE',confidence:92,bbox:{x0:10,y0:10,x1:80,y1:30}},
  {text:'A',confidence:94,bbox:{x0:86,y0:10,x1:96,y1:30}},
  {text:'PORTA',confidence:90,bbox:{x0:102,y0:11,x1:150,y1:30}},
  {text:'SAÍDA',confidence:88,bbox:{x0:12,y0:55,x1:62,y1:76}}
];
const lines=ocr.groupWordsToLines(words);
assert.equal(lines.length,2);
assert.equal(lines[0].text,'EMPURRE A PORTA');
assert.equal(lines[1].text,'SAÍDA');
assert.deepEqual(lines[0].bbox,{x0:10,y0:10,x1:150,y1:30});
console.log('ocr-engine-v1: line reconstruction + bounding boxes OK');
