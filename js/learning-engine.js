'use strict';

(function(root){
  const PARTICLES={
    'は':{reading:'wa',role:'marca o tópico da frase'},
    'が':{reading:'ga',role:'marca o sujeito ou aquilo que se destaca'},
    'を':{reading:'o',role:'marca o objeto direto da ação'},
    'に':{reading:'ni',role:'marca destino, ponto de chegada ou localização'},
    'で':{reading:'de',role:'marca o lugar onde uma ação acontece ou o meio usado'},
    'の':{reading:'no',role:'liga dois nomes; pode indicar posse ou relação'},
    'と':{reading:'to',role:'marca companhia, citação ou ligação entre nomes'},
    'へ':{reading:'e',role:'marca direção'},
    'から':{reading:'kara',role:'marca origem ou ponto inicial'},
    'まで':{reading:'made',role:'marca limite ou destino final'}
  };

  const LEXICON={
    'です':{reading:'desu',meaning:'é / forma polida de identificação',role:'cópula polida'},
    'あります':{reading:'arimasu',meaning:'há / está (coisas)',role:'verbo de existência para coisas'},
    'います':{reading:'imasu',meaning:'há / está (seres vivos)',role:'verbo de existência para seres vivos'},
    '使います':{reading:'tsukaimasu',meaning:'usar',role:'verbo na forma polida'},
    '取ります':{reading:'torimasu',meaning:'pegar',role:'verbo na forma polida'},
    '持ちます':{reading:'mochimasu',meaning:'segurar / carregar',role:'verbo na forma polida'},
    '置きます':{reading:'okimasu',meaning:'colocar',role:'verbo na forma polida'},
    '見ます':{reading:'mimasu',meaning:'ver / olhar',role:'verbo na forma polida'},
    '開けます':{reading:'akemasu',meaning:'abrir algo',role:'verbo transitivo na forma polida'},
    '閉めます':{reading:'shimemasu',meaning:'fechar algo',role:'verbo transitivo na forma polida'},
    '飲みます':{reading:'nomimasu',meaning:'beber',role:'verbo na forma polida'},
    '食べます':{reading:'tabemasu',meaning:'comer',role:'verbo na forma polida'},
    '座ります':{reading:'suwarimasu',meaning:'sentar',role:'verbo na forma polida'},
    '履きます':{reading:'hakimasu',meaning:'calçar / vestir da cintura para baixo',role:'verbo na forma polida'},
    '脱ぎます':{reading:'nugimasu',meaning:'tirar roupa ou calçado',role:'verbo na forma polida'},
    'つけます':{reading:'tsukemasu',meaning:'ligar / colocar',role:'verbo; o sentido depende do objeto'},
    '消します':{reading:'keshimasu',meaning:'desligar / apagar',role:'verbo na forma polida'},
    '書きます':{reading:'kakimasu',meaning:'escrever',role:'verbo na forma polida'},
    '読みます':{reading:'yomimasu',meaning:'ler',role:'verbo na forma polida'},
    '充電します':{reading:'jūden shimasu',meaning:'carregar a bateria',role:'verbo composto com します'},
    '何':{reading:'nani / nan',meaning:'o que',role:'pronome interrogativo'},
    'この':{reading:'kono',meaning:'este / esta',role:'demonstrativo usado antes de um substantivo'},
    'どこ':{reading:'doko',meaning:'onde',role:'pronome interrogativo de lugar'},
    'ここ':{reading:'koko',meaning:'aqui',role:'lugar perto de quem fala'},
    'そこ':{reading:'soko',meaning:'aí',role:'lugar perto de quem escuta'},
    'あそこ':{reading:'asoko',meaning:'ali / lá',role:'lugar longe de ambos'},
    '上':{reading:'ue',meaning:'em cima',role:'nome de posição'},
    '下':{reading:'shita',meaning:'embaixo',role:'nome de posição'},
    '中':{reading:'naka',meaning:'dentro',role:'nome de posição'},
    '左':{reading:'hidari',meaning:'esquerda',role:'nome de posição'},
    '右':{reading:'migi',meaning:'direita',role:'nome de posição'}
  };

  const FAMILY_ACTIONS={
    container:[
      ['を取ります。','o torimasu.','Pego {pt}.'],['を置きます。','o okimasu.','Coloco {pt}.']
    ],
    tool:[['を使います。','o tsukaimasu.','Uso {pt}.'],['を取ります。','o torimasu.','Pego {pt}.']],
    electronic:[['を使います。','o tsukaimasu.','Uso {pt}.'],['を見ます。','o mimasu.','Olho para {pt}.']],
    furniture:[['を使います。','o tsukaimasu.','Uso {pt}.']],
    wearable:[['を使います。','o tsukaimasu.','Uso {pt}.']],
    default:[['を見ます。','o mimasu.','Olho para {pt}.'],['を使います。','o tsukaimasu.','Uso {pt}.']]
  };

  const GROUPS={
    container:new Set(['bottle','cup','wine glass','mug','glass','jar','can','bowl','plate','food_container','lunchbox','bucket','bag','box','cardboard_box']),
    tool:new Set(['knife','utility_knife','scissors','hammer','screwdriver','wrench','hex_key','drill','saw','ruler','tape_measure','stapler','marker','pen','pencil']),
    electronic:new Set(['cell phone','laptop','tv','remote','keyboard','mouse','camera_device','speaker','headphones','earphones','router','printer','calculator','power_bank']),
    furniture:new Set(['chair','couch','bed','dining table','desk','bench','shelf','wardrobe','cabinet']),
    wearable:new Set(['shoe','shirt','pants','shorts','sock','glove','hat','belt','watch','ring','tie'])
  };

  const DEMOS={
    kore:{jp:'これ',romaji:'kore',pt:'isto'},sore:{jp:'それ',romaji:'sore',pt:'isso'},are:{jp:'あれ',romaji:'are',pt:'aquilo'}
  };

  function groupFor(key){for(const [name,set] of Object.entries(GROUPS))if(set.has(key))return name;return 'default'}
  function titlePt(item){return item.pt.replace(/^(o |a |os |as )/i,'')}
  function genericActions(key,item){
    const templates=FAMILY_ACTIONS[groupFor(key)]||FAMILY_ACTIONS.default;
    return templates.map(([jp,romaji,pt])=>({jp:`${item.jp}${jp}`,romaji:`${capitalize(item.romaji)} ${romaji}`,pt:pt.replace('{pt}',titlePt(item))}));
  }
  function actionPool(key,item){return item.actions?.length?item.actions:genericActions(key,item)}
  function identifySentence(item,demo='kore'){
    const d=DEMOS[demo]||DEMOS.kore;
    if(item.jp==='人'){
      const human={kore:['この','kono','esta'],sore:['その','sono','essa'],are:['あの','ano','aquela']}[demo]||['この','kono','esta'];
      return {jp:`${human[0]}人です。`,romaji:`${capitalize(human[1])} hito desu.`,pt:`É ${human[2]} pessoa.`,kind:'identify'};
    }
    return {jp:`${d.jp}は${item.jp}です。`,romaji:`${capitalize(d.romaji)} wa ${item.romaji} desu.`,pt:`${capitalize(d.pt)} é ${item.pt}.`,kind:'identify'};
  }
  function locationSentence(item,demo='kore'){
    const loc=demo==='sore'?{jp:'そこ',romaji:'soko',pt:'aí'}:demo==='are'?{jp:'あそこ',romaji:'asoko',pt:'ali'}:{jp:'ここ',romaji:'koko',pt:'aqui'};
    const verb=item.animate?{jp:'います',romaji:'imasu'}:{jp:'あります',romaji:'arimasu'};
    return {jp:`${item.jp}は${loc.jp}に${verb.jp}。`,romaji:`${capitalize(item.romaji)} wa ${loc.romaji} ni ${verb.romaji}.`,pt:`${capitalize(item.pt)} está ${loc.pt}.`,kind:'location'};
  }
  function chooseMoment({key,item,mode='daily',level=0,actionIndex=0,demo='kore',scene=null}){
    if(mode==='scene'&&scene)return scene;
    if(mode==='location')return locationSentence(item,demo);
    const actions=actionPool(key,item);
    if(mode==='actions')return {...actions[actionIndex%actions.length],kind:'action'};
    if(mode==='quiz')return identifySentence(item,demo);
    if(level<=0)return identifySentence(item,demo);
    if(level===1)return {...actions[0],kind:'action'};
    if(level===2)return {...actions[Math.min(1,actions.length-1)],kind:'action'};
    if(level===3)return scene || locationSentence(item,demo);
    return {...actions[actionIndex%actions.length],kind:'action'};
  }
  function helpLevel(progress,setting='auto'){
    if(setting!=='auto')return Number(setting)||1;
    const mastery=progress?.mastery||0;
    if(mastery>=4)return 3;
    if(mastery>=2)return 2;
    return 1;
  }
  function tokenize(sentence,item){
    if(!sentence?.jp)return [];
    let text=sentence.jp.replace(/[。？！]/g,'');
    const tokens=[];
    const candidates=[item.jp,'これ','それ','あれ','ここ','そこ','あそこ','どこ','あります','います','です',...Object.keys(LEXICON),...Object.keys(PARTICLES)].sort((a,b)=>b.length-a.length);
    while(text){
      let matched=null;
      for(const c of candidates){if(text.startsWith(c)){matched=c;break}}
      if(matched){tokens.push(makeToken(matched,item));text=text.slice(matched.length);continue}
      let cut=1;
      for(let i=1;i<text.length;i++){
        if(candidates.some(c=>text.slice(i).startsWith(c))){cut=i;break}
        cut=i+1;
      }
      const raw=text.slice(0,cut);tokens.push(makeToken(raw,item));text=text.slice(cut);
    }
    return tokens.filter(t=>t.text);
  }
  function makeToken(text,item){
    if(text===item.jp)return {text,reading:item.romaji,meaning:item.pt,role:'substantivo principal — o objeto que você está aprendendo'};
    if(PARTICLES[text])return {text,reading:PARTICLES[text].reading,meaning:'partícula',role:PARTICLES[text].role};
    if(LEXICON[text])return {text,reading:LEXICON[text].reading,meaning:LEXICON[text].meaning,role:LEXICON[text].role};
    if(DEMOS.kore.jp===text||DEMOS.sore.jp===text||DEMOS.are.jp===text){const d=Object.values(DEMOS).find(v=>v.jp===text);return {text,reading:d.romaji,meaning:d.pt,role:'demonstrativo'};}
    return {text,reading:'',meaning:'bloco da frase',role:'parte lexical; veja a tradução natural da frase'};
  }
  function patternFor(tokens){
    const texts=tokens.map(t=>t.text);
    if(texts.includes('です'))return '[demonstrativo] は [objeto] です  →  “isto/isso/aquilo é …”';
    if(texts.includes('あります')&&texts.includes('に'))return '[coisa] は [lugar] に あります  →  localização de objetos';
    if(texts.includes('を')&&texts.includes('に'))return '[objeto] を [lugar] に [verbo]  →  fazer algo levando-o a um lugar';
    if(texts.includes('を'))return '[objeto] を [verbo]  →  fazer uma ação sobre o objeto';
    return 'Observe a ordem japonesa pelos blocos, não tente traduzir palavra por palavra.';
  }
  function intentSentence(intent,item,demo='kore'){
    const d=DEMOS[demo]||DEMOS.kore;
    const map={
      identify:{jp:`${d.jp}は何ですか？`,romaji:`${capitalize(d.romaji)} wa nan desu ka?`,pt:'O que é isto/isso/aquilo?'},
      use:{jp:`${item.jp}を使っています。`,romaji:`${capitalize(item.romaji)} o tsukatte imasu.`,pt:`Estou usando ${item.pt}.`},
      take:{jp:`${item.jp}を取ります。`,romaji:`${capitalize(item.romaji)} o torimasu.`,pt:`Vou pegar ${item.pt}.`},
      place:{jp:`${item.jp}をここに置きます。`,romaji:`${capitalize(item.romaji)} o koko ni okimasu.`,pt:`Vou colocar ${item.pt} aqui.`},
      where:{jp:`${item.jp}はどこですか？`,romaji:`${capitalize(item.romaji)} wa doko desu ka?`,pt:`Onde está ${item.pt}?`},
      describe:{jp:`この${item.jp}を見ます。`,romaji:`Kono ${item.romaji} o mimasu.`,pt:`Olho para este(a) ${item.pt}.`}
    };
    return map[intent]||map.identify;
  }
  function capitalize(s){return s?String(s).charAt(0).toUpperCase()+String(s).slice(1):''}
  root.MiraLearning={identifySentence,locationSentence,chooseMoment,helpLevel,tokenize,patternFor,intentSentence,actionPool};
})(typeof globalThis!=='undefined'?globalThis:this);
