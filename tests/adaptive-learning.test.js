'use strict';
const assert=require('assert');
const A=require('../js/adaptive-learning.js');
const {JAPANESE_DB}=require('../js/japanese-data.js');
const now=1_800_000_000_000;
let checks=0;const ok=(v,m)=>{assert(v,m);checks++};

const legacy={bottle:{seen:3,mastery:2,lastSeen:now-86400000}};
const migrated=A.normalizeStore(null,legacy);
ok(migrated.version===7,'version');ok(migrated.words.bottle.mastery===2,'legacy mastery');ok(migrated.words.bottle.seen===3,'legacy seen');

let p=A.normalizeWord({seen:2,mastery:1,lastSeen:now-86400000,dueAt:now-1,intervalIndex:1},now);
ok(A.isDue(p,now),'due profile');ok(A.shouldRecall(p,now,true),'due recall');ok(!A.shouldRecall(p,now,false),'review switch');

let r=A.recordEncounter(p,now);ok(r.profile.seen===3,'encounter counted');ok(r.due===true,'due preserved on encounter');
p=A.applyOutcome(r.profile,'known',now);ok(p.mastery===2,'known increases mastery');ok(p.successes===1,'known success count');ok(p.dueAt>now,'known schedules next review');
p=A.applyOutcome(p,'review',now+1000);ok(p.mastery===1,'review lowers mastery');ok(p.reviewRequests===1,'review count');

const bottle=JAPANESE_DB.bottle;
const identify={jp:'これはボトルです。',romaji:'Kore wa botoru desu.',pt:'Isto é uma garrafa.',kind:'identify'};
const action={jp:'ボトルを取ります。',romaji:'Botoru o torimasu.',pt:'Pego a garrafa.',kind:'action'};
const location={jp:'ボトルはここにあります。',romaji:'Botoru wa koko ni arimasu.',pt:'A garrafa está aqui.',kind:'location'};
ok(A.skillInfo(identify).some(x=>x.id==='pattern:identify'),'identify skill');
ok(A.skillInfo(action).some(x=>x.id==='particle:を'),'particle skill');
ok(A.skillInfo(location).some(x=>x.id==='pattern:location'),'location skill');

let grammar={};let exp=A.recordExposure(A.normalizeWord({mastery:2}),grammar,action,now);grammar=exp.grammar;
ok(exp.profile.exposures[A.contentId(action)]===1,'content exposure');ok(grammar['pattern:action'].seen===1,'grammar exposure');
grammar=A.reinforceSkills(grammar,action,'known',now);ok(grammar['pattern:action'].mastery===1,'grammar reinforced');

const fresh=A.normalizeWord({mastery:0});
const c1=A.chooseCandidate([identify,action,location],fresh,{},0);ok(c1.kind==='identify','fresh word identifies first');
let familiar=A.normalizeWord({mastery:3,exposures:{[A.contentId(identify)]:5,[A.contentId(action)]:3}});
const c2=A.chooseCandidate([identify,action,location],familiar,{},0);ok(c2.kind==='location','familiar word advances to weaker content');
const c3=A.chooseCandidate([identify,action,location],familiar,{},1);ok(c3&&c3.jp,'offset returns candidate');

const q=A.recallPrompt(bottle,'sore');ok(q.jp==='それは何ですか？','recall demonstrative');
ok(A.stageFor({mastery:0})==='Nova','stage new');ok(A.stageFor({mastery:5})==='Dominada','stage mastered');

const store=A.normalizeStore({version:7,words:{a:{mastery:5,seen:9,dueAt:now-1},b:{mastery:2,seen:4,dueAt:now+999999}},grammar:{'particle:を':{seen:6,mastery:3,label:'partícula を'}}});
const sum=A.summary(store,now);ok(sum.total===2,'summary total');ok(sum.mastered===1,'summary mastered');ok(sum.learning===1,'summary learning');ok(sum.due===1,'summary due');ok(sum.grammar[0].id==='particle:を','summary grammar');

console.log(`adaptive-learning: ${checks}/${checks} passed`);
