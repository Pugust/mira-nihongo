'use strict';

(function(root,factory){
  const api=factory();
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.MiraAdaptiveLearning=api;
  if(root.window&&root.window!==root)root.window.MiraAdaptiveLearning=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const MIN=60*1000,HOUR=60*MIN,DAY=24*HOUR;
  const REVIEW_INTERVALS=[0,15*MIN,6*HOUR,DAY,3*DAY,7*DAY];
  const STAGES=['Nova','Descobrindo','Aprendendo','Familiar','Forte','Dominada'];

  function clamp(v,a,b){return Math.min(b,Math.max(a,Number(v)||0))}
  function cloneObj(v){return v&&typeof v==='object'&&!Array.isArray(v)?{...v}:{} }
  function normalizeWord(raw={},now=Date.now()){
    const mastery=clamp(raw.mastery,0,5);
    const firstSeen=Number(raw.firstSeen)||Number(raw.lastSeen)||0;
    const lastSeen=Number(raw.lastSeen)||0;
    const intervalIndex=clamp(raw.intervalIndex??mastery,0,5);
    const dueAt=Number(raw.dueAt)||((lastSeen&&mastery>0)?lastSeen+REVIEW_INTERVALS[intervalIndex]:0);
    return {
      seen:Math.max(0,Number(raw.seen)||0), mastery, firstSeen, lastSeen,
      successes:Math.max(0,Number(raw.successes)||0), reviewRequests:Math.max(0,Number(raw.reviewRequests)||0),
      intervalIndex, dueAt, exposures:cloneObj(raw.exposures), lastContentId:String(raw.lastContentId||''),
      lastOutcome:String(raw.lastOutcome||''), updatedAt:Number(raw.updatedAt)||lastSeen||now
    };
  }
  function normalizeGrammar(raw={}){
    const out={};
    for(const [id,p] of Object.entries(raw||{}))out[id]={seen:Math.max(0,Number(p?.seen)||0),mastery:clamp(p?.mastery,0,5),lastSeen:Number(p?.lastSeen)||0,label:String(p?.label||id)};
    return out;
  }
  function migrateLegacy(legacy={}){
    const words={};
    for(const [key,p] of Object.entries(legacy||{}))words[key]=normalizeWord(p);
    return {version:7,words,grammar:{},createdAt:Date.now(),updatedAt:Date.now()};
  }
  function normalizeStore(store,legacy={}){
    const src=store&&Number(store.version)>=7?store:migrateLegacy(legacy);
    const words={};for(const [k,p] of Object.entries(src.words||{}))words[k]=normalizeWord(p);
    return {version:7,words,grammar:normalizeGrammar(src.grammar),createdAt:Number(src.createdAt)||Date.now(),updatedAt:Number(src.updatedAt)||Date.now()};
  }
  function stageFor(p){return STAGES[clamp(normalizeWord(p).mastery,0,5)]}
  function isDue(p,now=Date.now()){const x=normalizeWord(p,now);return x.mastery>0&&x.dueAt>0&&now>=x.dueAt}
  function nextReviewText(p,now=Date.now()){
    const x=normalizeWord(p,now);if(x.mastery===0||!x.dueAt)return'quando você reencontrar';
    const ms=x.dueAt-now;if(ms<=0)return'agora';if(ms<60*MIN)return`em ${Math.max(1,Math.round(ms/MIN))} min`;if(ms<24*HOUR)return`em ${Math.max(1,Math.round(ms/HOUR))} h`;return`em ${Math.max(1,Math.round(ms/DAY))} d`;
  }
  function recordEncounter(raw,now=Date.now()){
    const p=normalizeWord(raw,now);const counted=!p.lastSeen||now-p.lastSeen>45000;
    if(counted){p.seen++;if(!p.firstSeen)p.firstSeen=now}
    p.lastSeen=now;p.updatedAt=now;return{profile:p,counted,due:isDue(p,now)};
  }
  function applyOutcome(raw,outcome,now=Date.now()){
    const p=normalizeWord(raw,now);
    if(outcome==='known'){
      p.mastery=clamp(p.mastery+1,0,5);p.successes++;p.intervalIndex=clamp(Math.max(p.intervalIndex,p.mastery),0,5);p.lastOutcome='known';
    }else if(outcome==='review'){
      p.mastery=clamp(p.mastery-1,0,5);p.reviewRequests++;p.intervalIndex=clamp(Math.min(p.intervalIndex,Math.max(1,p.mastery)),0,5);p.lastOutcome='review';
    }else if(outcome==='seen')p.lastOutcome='seen';
    p.lastSeen=now;p.updatedAt=now;p.dueAt=p.mastery>0?now+REVIEW_INTERVALS[p.intervalIndex]:0;return p;
  }
  function contentId(sentence){return sentence?`${sentence.kind||'sentence'}:${sentence.jp||''}`:'none'}
  function skillInfo(sentence){
    if(!sentence)return[];const out=[];const add=(id,label)=>{if(!out.some(x=>x.id===id))out.push({id,label})};
    if(sentence.kind==='identify')add('pattern:identify','Identificar: これは〜です');
    if(sentence.kind==='location')add('pattern:location','Localização: 〜は〜にあります/います');
    if(sentence.kind==='scene')add('pattern:scene','Relação entre objetos na cena');
    if(sentence.kind==='action')add('pattern:action','Ação: 〜を〜ます');
    const jp=sentence.jp||'';
    for(const [p,label] of [['は','partícula は'],['が','partícula が'],['を','partícula を'],['に','partícula に'],['で','partícula で'],['の','partícula の']])if(jp.includes(p))add(`particle:${p}`,label);
    const verb=(jp.match(/([^はがをにでの、。！？]+(?:します|います|あります|ます))。?$/)||[])[1];if(verb)add(`verb:${verb}`,`Verbo: ${verb}`);
    return out;
  }
  function recordExposure(rawWord,grammar,sentence,now=Date.now()){
    const p=normalizeWord(rawWord,now),g=normalizeGrammar(grammar);const cid=contentId(sentence);if(!cid||cid==='none')return{profile:p,grammar:g,skills:[]};
    p.exposures[cid]=(Number(p.exposures[cid])||0)+1;p.lastContentId=cid;p.updatedAt=now;
    const skills=skillInfo(sentence);for(const s of skills){const x=g[s.id]||{seen:0,mastery:0,lastSeen:0,label:s.label};x.seen++;x.lastSeen=now;x.label=s.label;g[s.id]=x}
    return{profile:p,grammar:g,skills};
  }
  function reinforceSkills(grammar,sentence,outcome,now=Date.now()){
    const g=normalizeGrammar(grammar);for(const s of skillInfo(sentence)){const x=g[s.id]||{seen:0,mastery:0,lastSeen:0,label:s.label};if(outcome==='known')x.mastery=clamp(x.mastery+1,0,5);if(outcome==='review')x.mastery=clamp(x.mastery-1,0,5);x.lastSeen=now;x.label=s.label;g[s.id]=x}return g;
  }
  function chooseCandidate(candidates,rawWord,grammar,offset=0){
    if(!Array.isArray(candidates)||!candidates.length)return null;const p=normalizeWord(rawWord),g=normalizeGrammar(grammar);
    const scored=candidates.map((c,i)=>{
      const cid=contentId(c),seen=Number(p.exposures[cid])||0,skills=skillInfo(c);const grammarNeed=skills.length?skills.reduce((a,s)=>a+(5-(g[s.id]?.mastery||0)),0)/skills.length:2.5;
      let score=8-seen*2+grammarNeed*.7;
      if(c.kind==='identify')score+=p.mastery===0?10:Math.max(-4,2-p.mastery*1.5);
      if(c.kind==='action')score+=p.mastery>=1?4:0;
      if(c.kind==='location'||c.kind==='scene')score+=p.mastery>=2?5:-2;
      if(cid===p.lastContentId)score-=4;
      score+=((i+offset)%Math.max(1,candidates.length))*.01;
      return{c,score,i};
    }).sort((a,b)=>b.score-a.score||a.i-b.i);
    const shift=Math.abs(Number(offset)||0)%scored.length;return scored[shift]?.c||scored[0].c;
  }
  function shouldRecall(rawWord,now=Date.now(),enabled=true){const p=normalizeWord(rawWord,now);return!!enabled&&p.seen>=2&&p.mastery>=1&&isDue(p,now)}
  function recallPrompt(item,demo='kore'){
    if(item?.jp==='人')return{jp:'この人は何と言いますか？',romaji:'Kono hito wa nan to iimasu ka?',pt:'Como se diz “esta pessoa” em japonês?'};
    const d=demo==='sore'?['それ','Sore']:demo==='are'?['あれ','Are']:['これ','Kore'];return{jp:`${d[0]}は何ですか？`,romaji:`${d[1]} wa nan desu ka?`,pt:'Tente lembrar antes de revelar.'};
  }
  function summary(store,now=Date.now()){
    const s=normalizeStore(store),counts={new:0,learning:0,familiar:0,strong:0,mastered:0,due:0};
    for(const p of Object.values(s.words)){const m=p.mastery;if(m===0)counts.new++;else if(m<=2)counts.learning++;else if(m===3)counts.familiar++;else if(m===4)counts.strong++;else counts.mastered++;if(isDue(p,now))counts.due++}
    const grammar=Object.entries(s.grammar).sort((a,b)=>(b[1].seen||0)-(a[1].seen||0)).slice(0,8).map(([id,p])=>({id,...p}));
    return{...counts,total:Object.keys(s.words).length,grammar};
  }
  return{REVIEW_INTERVALS,STAGES,normalizeWord,normalizeGrammar,normalizeStore,migrateLegacy,stageFor,isDue,nextReviewText,recordEncounter,applyOutcome,contentId,skillInfo,recordExposure,reinforceSkills,chooseCandidate,shouldRecall,recallPrompt,summary};
});
