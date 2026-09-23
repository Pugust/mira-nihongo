'use strict';
(function(g){
  const REL={on:{jp:'上',romaji:'ue',pt:'em cima de'},above:{jp:'上',romaji:'ue',pt:'acima de'},below:{jp:'下',romaji:'shita',pt:'embaixo de'},inside:{jp:'中',romaji:'naka',pt:'dentro de'},left:{jp:'左',romaji:'hidari',pt:'à esquerda de'},right:{jp:'右',romaji:'migi',pt:'à direita de'},near:{jp:'隣',romaji:'tonari',pt:'ao lado de'}};
  const PARTS={
    bottle:[['cap','キャップ','kyappu','tampa']],
    'cell phone':[['screen','画面','gamen','tela']],
    laptop:[['screen','画面','gamen','tela'],['keyboard','キーボード','kiiboodo','teclado']],
    fan:[['blade','羽根','hane','hélice'],['base','台','dai','base']],
    shoe:[['lace','靴ひも','kutsuhimo','cadarço']],
    person:[['hand','手','te','mão'],['arm','腕','ude','braço'],['foot','足','ashi','pé']],
    car:[['wheel','タイヤ','taiya','pneu'],['door','ドア','doa','porta']]
  };
  const STATES={
    bottle:[['full','いっぱい','ippai','cheia'],['empty','空です','kara desu','vazia']],
    cup:[['full','いっぱい','ippai','cheio'],['empty','空です','kara desu','vazio']],
    door:[['open','開いています','aite imasu','aberta'],['closed','閉まっています','shimatte imasu','fechada']],
    laptop:[['on','ついています','tsuite imasu','ligado'],['off','消えています','kiete imasu','desligado']],
    tv:[['on','ついています','tsuite imasu','ligada'],['off','消えています','kiete imasu','desligada']],
    fan:[['on','ついています','tsuite imasu','ligado'],['off','止まっています','tomatte imasu','parado']]
  };
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  function area(b){return Math.max(0,b?.[2]||0)*Math.max(0,b?.[3]||0)}
  function center(b){return[(b?.[0]||0)+(b?.[2]||0)/2,(b?.[1]||0)+(b?.[3]||0)/2]}
  function relation(a,b){
    if(!a?.bbox||!b?.bbox)return null;const A=a.bbox,B=b.bbox,[ax,ay]=center(A),[bx,by]=center(B),aw=A[2],ah=A[3],bw=B[2],bh=B[3];
    const ix=Math.max(0,Math.min(A[0]+aw,B[0]+bw)-Math.max(A[0],B[0]));
    const iy=Math.max(0,Math.min(A[1]+ah,B[1]+bh)-Math.max(A[1],B[1]));
    const inter=ix*iy, amin=Math.max(1,Math.min(area(A),area(B)));
    if(inter/amin>.72 && area(A)<area(B)*.72)return{relation:'inside',confidence:clamp(inter/amin,0,1)};
    const dx=(ax-bx)/Math.max(aw,bw,1),dy=(ay-by)/Math.max(ah,bh,1);
    const horizOverlap=ix/Math.max(1,Math.min(aw,bw));
    if(horizOverlap>.35 && dy<-.42)return{relation:'above',confidence:clamp(Math.abs(dy),0,1)};
    if(horizOverlap>.35 && dy>.42)return{relation:'below',confidence:clamp(Math.abs(dy),0,1)};
    if(Math.abs(dy)<.48 && Math.abs(dx)>.45)return{relation:dx<0?'left':'right',confidence:clamp(Math.abs(dx),0,1)};
    if(Math.hypot(dx,dy)<.72)return{relation:'near',confidence:clamp(1-Math.hypot(dx,dy)/.72,.55,.9)};
    return null;
  }
  function bestRelation(selected,others=[]){let best=null;for(const o of others){if(!o||o===selected)continue;const r=relation(selected,o);if(r&&r.confidence>=.58&&(!best||r.confidence>best.confidence))best={...r,other:o};}return best}
  function relationSentence(a,b,r){const f=REL[r];if(!a||!b||!f)return null;const exist=a.animate?['います','imasu']:['あります','arimasu'];return{jp:`${a.jp}は${b.jp}の${f.jp}に${exist[0]}。`,romaji:`${cap(a.romaji)} wa ${b.romaji} no ${f.romaji} ni ${exist[1]}.`,pt:`${cap(a.pt)} está ${f.pt} ${b.pt}.`,kind:'scene',relation:r}}
  function stateOptions(key){return(STATES[key]||[]).map(x=>({id:x[0],jp:x[1],romaji:x[2],pt:x[3]}))}
  function partsFor(key){return(PARTS[key]||[]).map(x=>({id:x[0],jp:x[1],romaji:x[2],pt:x[3]}))}
  function confirmedStateSentence(item,state){if(!item||!state)return null;return{jp:`${item.jp}は${state.jp}。`,romaji:`${cap(item.romaji)} wa ${state.romaji}.`,pt:`${cap(item.pt)} está ${state.pt}.`,kind:'state'}}
  function compare(a,b,metric='size'){if(!a?.bbox||!b?.bbox)return null;const ratio=area(a.bbox)/Math.max(1,area(b.bbox));if(metric==='size'&&ratio>1.45)return{a:'大きい',b:'小さい',romajiA:'ookii',romajiB:'chiisai',ptA:'grande',ptB:'pequeno'};if(metric==='size'&&ratio<.69)return{a:'小さい',b:'大きい',romajiA:'chiisai',romajiB:'ookii',ptA:'pequeno',ptB:'grande'};return null}
  function cap(s=''){return s?String(s)[0].toUpperCase()+String(s).slice(1):''}
  g.MiraWorldContext={REL,relation,bestRelation,relationSentence,stateOptions,partsFor,confirmedStateSentence,compare};
})(window);
