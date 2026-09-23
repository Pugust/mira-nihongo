const assert=require('assert');const F=require('../js/recognition-fusion-v1.js');
assert.equal(F.temporalAgreement(['car']),.5);assert.equal(F.temporalAgreement(['car','car','car']),1);assert(F.temporalAgreement(['car','sheep','floor'])<.5);
assert.equal(F.fuse({detector:.9,verifier:.88,objectness:.9,temporal:1,negative:.05}).kind,'stable');
assert.equal(F.fuse({detector:.51,verifier:.1,objectness:.15,temporal:.33,negative:.8,surfaceLike:true}).kind,'unknown');
assert(F.negativeEvidence({bbox:[0,0,100,95],frameWidth:100,frameHeight:100,detector:.35})>.4);console.log('recognition-fusion-v1 ok');
