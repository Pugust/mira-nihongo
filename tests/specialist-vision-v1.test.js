const assert=require('assert');
const S=require('../js/specialist-vision-v1.js');
const pts=[];
const names=['wrist','thumb_cmc','thumb_mcp','thumb_ip','thumb_tip','index_finger_mcp','index_finger_pip','index_finger_dip','index_finger_tip','middle_finger_mcp','middle_finger_pip','middle_finger_dip','middle_finger_tip','ring_finger_mcp','ring_finger_pip','ring_finger_dip','ring_finger_tip','pinky_finger_mcp','pinky_finger_pip','pinky_finger_dip','pinky_finger_tip'];
names.forEach((name,i)=>pts.push({name,x:80+(i%5)*22,y:180-Math.floor(i/5)*25}));
const e=S.handEntities({score:.94,keypoints:pts},320,320);
for(const k of ['hand','palm','thumb','index_finger','middle_finger','ring_finger','pinky_finger','wrist'])assert(e.some(x=>x.conceptId===k),k+' missing');
assert.equal(S.SEGMENT_MAP.floor,'floor');assert.equal(S.SEGMENT_MAP.wall,'wall');assert.equal(S.SEGMENT_MAP.door,'door');
console.log('specialist-vision-v1: ok');
