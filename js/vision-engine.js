'use strict';

(function(root,factory){
  const api=factory();
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.MiraVisionEngine=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const FAMILY_LABELS={
    person:{pt:'pessoa / corpo',jp:'身体',romaji:'shintai'},
    body:{pt:'parte do corpo',jp:'体の一部',romaji:'karada no ichibu'},
    tool:{pt:'ferramenta',jp:'工具',romaji:'kōgu'},
    electronic:{pt:'eletrônico',jp:'電子機器',romaji:'denshi kiki'},
    container:{pt:'recipiente',jp:'容器',romaji:'yōki'},
    kitchen:{pt:'utensílio de cozinha',jp:'台所用品',romaji:'daidokoro yōhin'},
    furniture:{pt:'móvel',jp:'家具',romaji:'kagu'},
    clothing:{pt:'roupa / acessório',jp:'衣類',romaji:'irui'},
    vehicle:{pt:'veículo',jp:'乗り物',romaji:'norimono'},
    animal:{pt:'animal',jp:'動物',romaji:'dōbutsu'},
    food:{pt:'alimento',jp:'食べ物',romaji:'tabemono'},
    office:{pt:'material de escritório',jp:'文房具',romaji:'bunbōgu'},
    home:{pt:'objeto doméstico',jp:'生活用品',romaji:'seikatsu yōhin'},
    nature:{pt:'natureza',jp:'自然',romaji:'shizen'},
    unknown:{pt:'objeto',jp:'物',romaji:'mono'}
  };

  const FAMILIES={
    person:'person',hand:'body',finger:'body',arm:'body',leg:'body',foot:'body',face:'body',eye:'body',ear:'body',nose:'body',mouth:'body',head:'body',hair:'body',
    utility_knife:'tool',knife:'tool',scissors:'tool',screwdriver:'tool',hammer:'tool',wrench:'tool',hex_key:'tool',drill:'tool',saw:'tool',pliers:'tool',tweezers:'tool',file_tool:'tool',tape_measure:'tool',clamp:'tool',blade:'tool',tool_handle:'tool',
    'cell phone':'electronic',laptop:'electronic',mouse:'electronic',keyboard:'electronic',remote:'electronic',tv:'electronic',camera_device:'electronic',router:'electronic',speaker:'electronic',headphones:'electronic',earphones:'electronic',calculator:'electronic',printer:'electronic',switch:'electronic',charger:'electronic',power_bank:'electronic',usb_drive:'electronic',memory_card:'electronic',
    bottle:'container',bottle_cap:'container',lid:'container',jar:'container',can:'container',cup:'container',mug:'container',glass:'container','wine glass':'container',bowl:'container',bucket:'container',food_container:'container',lunchbox:'container',cardboard_box:'container',box:'container',suitcase:'container',backpack:'container',handbag:'container',
    fork:'kitchen',spoon:'kitchen',plate:'kitchen',pot:'kitchen',frying_pan:'kitchen',kettle:'kitchen',spatula:'kitchen',ladle:'kitchen',tongs:'kitchen',strainer:'kitchen',grater:'kitchen',cutting_board:'kitchen',can_opener:'kitchen',bottle_opener:'kitchen',corkscrew:'kitchen',measuring_cup:'kitchen',whisk:'kitchen',peeler:'kitchen',tray:'kitchen',
    chair:'furniture',couch:'furniture',bed:'furniture','dining table':'furniture',desk:'furniture',bench:'furniture',shelf:'furniture',wardrobe:'furniture',cabinet:'furniture',stool:'furniture',workbench:'furniture',
    shoe:'clothing',shoelace:'clothing',shoe_sole:'clothing',shirt:'clothing',pants:'clothing',shorts:'clothing',sock:'clothing',glove:'clothing',hat:'clothing',belt:'clothing',watch:'clothing',tie:'clothing',jacket:'clothing',coat:'clothing',t_shirt:'clothing',underwear:'clothing',zipper:'clothing',pocket:'clothing',
    bicycle:'vehicle',car:'vehicle',motorcycle:'vehicle',airplane:'vehicle',bus:'vehicle',train:'vehicle',truck:'vehicle',boat:'vehicle',
    cat:'animal',dog:'animal',bird:'animal',horse:'animal',sheep:'animal',cow:'animal',elephant:'animal',bear:'animal',zebra:'animal',giraffe:'animal',
    banana:'food',apple:'food',orange:'food',broccoli:'food',carrot:'food',pizza:'food','hot dog':'food',sandwich:'food',donut:'food',cake:'food',water:'food',coffee:'food',tea:'food',milk:'food',rice:'food',bread:'food',egg:'food',meat:'food',chicken_food:'food',fish_food:'food',salt:'food',sugar:'food',
    pen:'office',pencil:'office',marker:'office',eraser:'office',sharpener:'office',stapler:'office',paper_clip:'office',clipboard:'office',envelope:'office',label:'office',barcode:'office',ruler:'office',
    fan:'home',fan_blade:'home',fan_base:'home',lamp:'home',light_bulb:'home',air_conditioner:'home',mirror:'home',pillow:'home',blanket:'home',curtain:'home',hanger:'home',trash_bin:'home',broom:'home',mop:'home',sponge:'home',soap:'home',towel:'home',vacuum:'home',washing_machine:'home',dishwasher:'home',iron:'home',sewing_machine:'home',space_heater:'home',
    tree:'nature',leaf:'nature',flower:'nature',grass:'nature',stone:'nature',sky:'nature',cloud:'nature',sun:'nature',moon:'nature',rain:'nature'
  };

  const HIGH_RISK=new Set(['person','switch','cell phone','skateboard','frisbee','suitcase','oven','bench','dining table','remote','knife','scissors']);

  const GEOMETRY={
    utility_knife:{minAspect:2.5,maxAspect:9,targetAspect:4.2},
    screwdriver:{minAspect:2.2,maxAspect:9,targetAspect:4.0},
    pen:{minAspect:3,maxAspect:14,targetAspect:6},pencil:{minAspect:3,maxAspect:14,targetAspect:7},
    ruler:{minAspect:3,maxAspect:18,targetAspect:7},
    'cell phone':{minAspect:1.25,maxAspect:2.7,targetAspect:1.9},remote:{minAspect:1.6,maxAspect:4.2,targetAspect:2.6},
    switch:{minAspect:.7,maxAspect:2.3,targetAspect:1.2},
    bottle:{minAspect:1.35,maxAspect:4.5,targetAspect:2.3},bottle_cap:{minAspect:.65,maxAspect:1.55,targetAspect:1},
    plate:{minAspect:.65,maxAspect:1.55,targetAspect:1},frisbee:{minAspect:.65,maxAspect:1.55,targetAspect:1},
    shoe:{minAspect:1.4,maxAspect:3.8,targetAspect:2.2},
    cardboard_box:{minAspect:.75,maxAspect:2.6,targetAspect:1.35},box:{minAspect:.75,maxAspect:2.8,targetAspect:1.4},
    fan:{minAspect:.65,maxAspect:1.6,targetAspect:1.05}
  };

  function clamp(v,a=0,b=1){return Math.max(a,Math.min(b,v))}
  function familyOf(key){return FAMILIES[key]||'unknown'}
  function familyLabel(keyOrFamily){return FAMILY_LABELS[FAMILY_LABELS[keyOrFamily]?keyOrFamily:familyOf(keyOrFamily)]||FAMILY_LABELS.unknown}
  function aspectOf(bbox){if(!bbox||bbox[2]<=0||bbox[3]<=0)return 1;return Math.max(bbox[2]/bbox[3],bbox[3]/bbox[2])}
  function areaFraction(bbox,fw,fh){return bbox&&fw&&fh?clamp((bbox[2]*bbox[3])/(fw*fh),0,1):0}

  function geometryCompatibility(key,bbox,fw,fh){
    if(!bbox)return .55;
    const p=GEOMETRY[key];
    if(!p)return .62;
    const a=aspectOf(bbox);
    if(a<p.minAspect*.82||a>p.maxAspect*1.18)return .05;
    if(a<p.minAspect||a>p.maxAspect)return .28;
    const delta=Math.abs(Math.log(a/p.targetAspect));
    return clamp(1-delta*.62,.35,1);
  }

  function detectorPriors(detector,bbox,fw,fh){
    const extras=[];if(!detector?.key)return extras;
    const a=aspectOf(bbox),frac=areaFraction(bbox,fw,fh),k=detector.key;
    // Physical regression: utility knives were repeatedly called skateboard,
    // phone or switch. Only add this prior when the observed shape is truly elongated.
    if(['skateboard','cell phone','switch','knife'].includes(k)&&a>=3.0&&frac<=.62)extras.push({key:'utility_knife',probability:.52,source:'shape'});
    if(k==='frisbee'&&frac<.04)extras.push({key:'bottle_cap',probability:.50,source:'scale'});
    if(k==='person'&&frac<.78)extras.push({key:'hand',probability:.08,source:'body-part'});
    return extras;
  }

  function inferPartCandidate({target,focusPoint,focusBox}){
    if(!target?.bbox||!focusPoint)return null;
    const [x,y,w,h]=target.bbox;if(w<=0||h<=0)return null;
    const rx=(focusPoint.x-x)/w,ry=(focusPoint.y-y)/h;
    if(rx<0||rx>1||ry<0||ry>1)return null;
    const focusArea=focusBox?focusBox[2]*focusBox[3]:0,targetArea=w*h;
    const local=focusArea>0&&focusArea/Math.max(1,targetArea)<.34;
    if(target.class==='bottle'&&local&&ry<=.23&&rx>.18&&rx<.82)return{key:'bottle_cap',score:.91,reason:'A mira está na parte superior de uma garrafa.'};
    if(target.class==='shoe'&&local&&ry>.20&&ry<.62&&rx>.18&&rx<.82)return{key:'shoelace',score:.76,reason:'A mira está sobre a região dos cadarços.'};
    if(target.class==='fan'&&local){if(ry<.68)return{key:'fan_blade',score:.79,reason:'A mira está na região das hélices.'};if(ry>.72)return{key:'fan_base',score:.78,reason:'A mira está na base do ventilador.'}}
    if(target.class==='utility_knife'&&local){if(ry<.27||rx<.24)return{key:'blade',score:.78,reason:'A mira está na extremidade de corte.'};return{key:'tool_handle',score:.72,reason:'A mira está sobre a empunhadura.'}}
    return null;
  }

  function rankCandidates({detector=null,verifier=[],bbox=null,frameWidth=1,frameHeight=1,part=null,skinRatio=0}){
    const pool=new Map();
    const add=(key,amount,source,raw)=>{if(!key)return;const p=pool.get(key)||{key,score:0,sources:[],detectorScore:0,verifierScore:0};p.score+=amount;p.sources.push(source);if(source==='detector')p.detectorScore=Math.max(p.detectorScore,raw||0);if(source==='verifier')p.verifierScore=Math.max(p.verifierScore,raw||0);pool.set(key,p)};
    if(detector?.key){const risk=HIGH_RISK.has(detector.key);add(detector.key,(risk?.50:.75)*clamp(detector.score||0),'detector',detector.score||0)}
    for(const v of verifier||[]){const scaled=clamp((v.probability||0)/.24);add(v.key,.46*scaled,'verifier',v.probability||0)}
    for(const e of detectorPriors(detector,bbox,frameWidth,frameHeight))add(e.key,e.probability,e.source,e.probability);
    if(part)add(part.key,Math.min(.84,part.score||.7),'part',part.score||0);
    if(skinRatio>=.29)add('hand',Math.min(.50,.20+skinRatio*.55),'skin',skinRatio);

    const detectorFamily=detector?.key?familyOf(detector.key):null;
    for(const p of pool.values()){
      const geom=geometryCompatibility(p.key,bbox,frameWidth,frameHeight);p.geometry=geom;p.score+=.17*geom;
      if(detectorFamily&&familyOf(p.key)===detectorFamily&&p.key!==detector.key)p.score+=.045;
      if(p.sources.includes('detector')&&p.sources.includes('verifier'))p.score+=.16;
      if(p.sources.includes('part'))p.score+=.12;
      if(p.key==='person'&&skinRatio>=.29)p.score-=.24;
      if(p.key==='person'&&areaFraction(bbox,frameWidth,frameHeight)<.65)p.score-=.14;
      if(p.key==='switch'&&aspectOf(bbox)>=2.8)p.score-=.52;
      if(p.key==='cell phone'&&aspectOf(bbox)>=3.1)p.score-=.46;
      if(p.key==='skateboard'&&areaFraction(bbox,frameWidth,frameHeight)<.22)p.score-=.32;
      if(p.key==='frisbee'&&areaFraction(bbox,frameWidth,frameHeight)<.08)p.score-=.45;
      p.score=clamp(p.score,0,1);
    }
    return [...pool.values()].sort((a,b)=>b.score-a.score||b.verifierScore-a.verifierScore).slice(0,5);
  }

  function decide(ranked){
    if(!ranked?.length)return{kind:'unknown',top:null,margin:0};
    const top=ranked[0],second=ranked[1];const margin=top.score-(second?.score||0);
    const risky=HIGH_RISK.has(top.key);
    const stableMin=risky?.84:.76,stableMargin=risky?.14:.10;
    if(top.score>=stableMin&&margin>=stableMargin)return{kind:'stable',top,margin};
    if(top.score>=.49)return{kind:'tentative',top,margin};
    return{kind:'unknown',top,margin};
  }

  function familyConsensus(ranked){
    if(!ranked?.length)return null;const sums={};for(const c of ranked)sums[familyOf(c.key)]=(sums[familyOf(c.key)]||0)+c.score;const sorted=Object.entries(sums).sort((a,b)=>b[1]-a[1]);if(!sorted.length)return null;const [family,score]=sorted[0];const margin=score-(sorted[1]?.[1]||0);return score>=.55&&margin>=.12?{family,score,label:familyLabel(family)}:null;
  }

  function trackingChanged({motion=0,distance=0,strength='strong',streak=0}){
    const cfg={normal:{motion:.14,distance:25,frames:3},strong:{motion:.19,distance:30,frames:5}}[strength]||{motion:.19,distance:30,frames:5};
    const changed=motion>cfg.motion||distance>cfg.distance;const next=changed?streak+1:Math.max(0,streak-1);return{changed,next,release:next>=cfg.frames,cfg};
  }

  return{FAMILY_LABELS,FAMILIES,HIGH_RISK,familyOf,familyLabel,aspectOf,areaFraction,geometryCompatibility,inferPartCandidate,rankCandidates,decide,familyConsensus,trackingChanged};
});
