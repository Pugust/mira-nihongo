'use strict';
(function(root){
  function clamp(n){return Math.max(0,Math.min(1,Number(n)||0))}
  function fuse(input={}){
    const detector=clamp(input.detector),verifier=clamp(input.verifier),objectness=input.objectness==null?.5:clamp(input.objectness),temporal=input.temporal==null?.5:clamp(input.temporal),memory=clamp(input.memory),negative=clamp(input.negative),surface=!!input.surfaceLike;
    const sources=[detector,verifier].filter(x=>x>0);const agreement=sources.length>1?1-Math.min(1,Math.abs(detector-verifier)):.5;
    let score=detector*.38+verifier*.27+objectness*.14+temporal*.11+agreement*.06+memory*.04-negative*.42-(surface?.12:0);
    score=clamp(score);
    let kind='unknown';if(score>=.68&&objectness>=.42&&negative<.55)kind='stable';else if(score>=.45&&negative<.72)kind='tentative';
    return{kind,score,signals:{detector,verifier,objectness,temporal,agreement,memory,negative,surfaceLike:surface}};
  }
  function temporalAgreement(labels=[]){const a=labels.filter(Boolean);if(!a.length)return 0;if(a.length===1)return .5;const c={};for(const x of a)c[x]=(c[x]||0)+1;return Math.max(...Object.values(c))/a.length}
  function negativeEvidence({bbox,frameWidth,frameHeight,sharpness=1,detector=0}={}){let n=0;if(Array.isArray(bbox)&&frameWidth&&frameHeight){const ratio=(bbox[2]*bbox[3])/(frameWidth*frameHeight);if(ratio>.82)n+=.28;if(ratio<.004)n+=.16;const flat=bbox[2]/Math.max(1,bbox[3]);if(flat>7||flat<.14)n+=.12}if(sharpness<.018)n+=.18;if(detector<.42)n+=.22;return clamp(n)}
  const api={fuse,temporalAgreement,negativeEvidence};root.MiraRecognitionFusionV1=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
