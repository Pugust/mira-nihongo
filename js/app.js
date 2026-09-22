'use strict';

(() => {
  const els = {
    stage: document.getElementById('cameraStage'), video: document.getElementById('camera'), focus: document.getElementById('focusCanvas'), detect: document.getElementById('detectCanvas'), crop: document.getElementById('cropCanvas'), boxes: document.getElementById('boxesLayer'),
    status: document.getElementById('statusText'), start: document.getElementById('startBtn'), flip: document.getElementById('flipCameraBtn'), settings: document.getElementById('settingsBtn'), settingsDialog: document.getElementById('settingsDialog'),
    study: document.getElementById('studyBtn'), studyDialog: document.getElementById('studyDialog'), studyModeIcon: document.getElementById('studyModeIcon'), studyModeLabel: document.getElementById('studyModeLabel'),
    crosshairWrap: document.getElementById('crosshairWrap'), holdRing: document.getElementById('holdRing'), emptyHint: document.getElementById('emptyHint'), scan: document.getElementById('scanBtn'), loadChip: document.getElementById('loadChip'), loadText: document.getElementById('loadText'),
    lessonCard: document.getElementById('lessonCard'), expandLesson: document.getElementById('expandLessonBtn'), lessonDetails: document.getElementById('lessonDetails'), recognitionState: document.getElementById('recognitionState'),
    jpWord: document.getElementById('jpWord'), kana: document.getElementById('kanaText'), romaji: document.getElementById('romajiText'), translationInline: document.getElementById('translationInline'), readingRow: document.getElementById('readingRow'), sentenceCompact: document.getElementById('sentenceCompact'), sentenceJp: document.getElementById('sentenceJp'), sentenceRomaji: document.getElementById('sentenceRomaji'), sentencePt: document.getElementById('sentencePt'),
    tentativePanel: document.getElementById('tentativePanel'), tentativeReason: document.getElementById('tentativeReason'), confirm: document.getElementById('confirmBtn'), correct: document.getElementById('correctBtn'),
    breakdownToggle: document.getElementById('breakdownToggle'), breakdownPanel: document.getElementById('breakdownPanel'), breakdownTokens: document.getElementById('breakdownTokens'), tokenExplain: document.getElementById('tokenExplain'), patternBox: document.getElementById('patternBox'),
    sayToggle: document.getElementById('saySomethingToggle'), sayPanel: document.getElementById('saySomethingPanel'), intentGrid: document.getElementById('intentGrid'), intentAnswer: document.getElementById('intentAnswer'), sceneLine: document.getElementById('sceneLine'),
    speakWord: document.getElementById('speakWordBtn'), speakSentence: document.getElementById('speakSentenceBtn'), know: document.getElementById('knowBtn'), review: document.getElementById('reviewBtn'), nextAction: document.getElementById('nextActionBtn'), freeze: document.getElementById('freezeBtn'), learnThis: document.getElementById('learnThisBtn'), progressHint: document.getElementById('progressHint'),
    immersion: document.getElementById('immersionLevel'), performanceMode: document.getElementById('performanceMode'), confidence: document.getElementById('confidenceRange'), confidenceValue: document.getElementById('confidenceValue'), deepVision: document.getElementById('deepVisionToggle'), showBoxes: document.getElementById('showBoxesToggle'), diagnostics: document.getElementById('diagnosticsToggle'), telemetryBox: document.getElementById('telemetryBox'), demoControl: document.getElementById('demonstrativeControl'),
    clearCorrections: document.getElementById('clearCorrectionsBtn'), correctionCount: document.getElementById('correctionCount'), resetProgress: document.getElementById('resetProgressBtn'),
    vocabBtn: document.getElementById('vocabBtn'), vocabDialog: document.getElementById('vocabDialog'), vocabSearch: document.getElementById('vocabSearch'), vocabList: document.getElementById('vocabList'), correctionDialog: document.getElementById('correctionDialog'), correctionSearch: document.getElementById('correctionSearch'), correctionList: document.getElementById('correctionList'), cancelCorrection: document.getElementById('cancelCorrectionBtn'),
    onboarding: document.getElementById('onboardingDialog'), onboardingContinue: document.getElementById('onboardingContinue'), toast: document.getElementById('toast')
  };

  const MODE_META = { daily:{icon:'👁',label:'Cotidiano'}, actions:{icon:'⚡',label:'Ações'}, location:{icon:'📍',label:'Local'}, scene:{icon:'🧭',label:'Cena'}, quiz:{icon:'🎯',label:'Quiz'}, immersion:{icon:'◉',label:'Imersão'} };
  const VERIFIER_RULES = [
    [/bottlecap|bottle cap/i, 'bottle_cap'],
    [/electric fan/i, 'fan'],
    [/running shoe|sneaker|loafer|clog|cowboy boot|rubber boot|shoe shop/i, 'shoe'],
    [/letter opener|paper knife/i, 'utility_knife'],
    [/plate|dish/i, 'plate'],
    [/beer glass|goblet/i, 'glass'],
    [/coffee mug/i, 'mug'],
    [/jar|jarred/i, 'jar'],
    [/tin can/i, 'can'],
    [/frying pan/i, 'frying_pan'],
    [/teapot|kettle/i, 'kettle'],
    [/spatula/i, 'spatula'],
    [/strainer/i, 'strainer'],
    [/trash can|garbage can|ashcan|wastebin/i, 'trash_bin'],
    [/bucket|pail/i, 'bucket'],
    [/bath towel|paper towel|towel/i, 'towel'],
    [/mirror/i, 'mirror'],
    [/pillow/i, 'pillow'],
    [/shower curtain|curtain/i, 'curtain'],
    [/wardrobe|chiffonier/i, 'wardrobe'],
    [/switch/i, 'switch'],
    [/table lamp|lampshade/i, 'lamp'],
    [/air conditioner/i, 'air_conditioner'],
    [/desk/i, 'desk'],
    [/wrench|spanner/i, 'wrench'],
    [/power drill|drill/i, 'drill'],
    [/chain saw|handsaw|saw/i, 'saw'],
    [/stapler/i, 'stapler'],
    [/rubber eraser|eraser/i, 'eraser'],
    [/pencil sharpener/i, 'sharpener'],
    [/calculator/i, 'calculator'],
    [/printer/i, 'printer'],
    [/envelope/i, 'envelope'],
    [/headphone/i, 'headphones'],
    [/loudspeaker|speaker/i, 'speaker'],
    [/reflex camera|camera/i, 'camera_device'],
    [/tripod/i, 'tripod'],
    [/modem|router/i, 'router'],
    [/jersey|shirt/i, 'shirt'],
    [/jean|trouser|pants/i, 'pants'],
    [/sock/i, 'sock'],
    [/cowboy hat|sombrero|baseball cap|hat/i, 'hat'],
    [/digital watch|stopwatch|watch/i, 'watch'],
    [/wallet/i, 'wallet'],
    [/blower/i, 'fan'],
    [/carton/i, 'cardboard_box'],
    [/crate|packing case/i, 'box'],
    [/bookcase/i, 'shelf'],
    [/ballpoint|fountain pen/i, 'pen'],
    [/pencil/i, 'pencil'],
    [/screwdriver/i, 'screwdriver'],
    [/hammer/i, 'hammer'],
    [/rule|ruler/i, 'ruler'],
    [/notebook computer|laptop/i, 'laptop'],
    [/computer keyboard/i, 'keyboard'],
    [/computer mouse/i, 'mouse'],
    [/remote control/i, 'remote'],
    [/cellular telephone|cell phone|hand-held computer/i, 'cell phone'],
    [/water bottle|pop bottle|beer bottle|wine bottle/i, 'bottle'],
    [/coffee mug|cup/i, 'cup'],
    [/wine glass/i, 'wine glass'],
    [/fork/i, 'fork'],
    [/spoon/i, 'spoon'],
    [/cleaver|butcher knife|knife/i, 'knife'],
    [/mixing bowl|bowl/i, 'bowl'],
    [/rocking chair|folding chair|barber chair/i, 'chair'],
    [/studio couch|sofa/i, 'couch'],
    [/refrigerator/i, 'refrigerator'],
    [/microwave/i, 'microwave'],
    [/toaster/i, 'toaster'],
    [/stove|range/i, 'oven'],
    [/washbasin|wash basin/i, 'sink'],
    [/television|monitor/i, 'tv'],
    [/analog clock|digital clock|wall clock/i, 'clock'],
    [/book jacket|book/i, 'book'],
    [/scissors/i, 'scissors'],
    [/toothbrush/i, 'toothbrush'],
    [/bow tie|necktie/i, 'tie'],
    [/backpack/i, 'backpack'],
    [/umbrella/i, 'umbrella'],
    [/handbag/i, 'handbag'],
    [/suitcase/i, 'suitcase'],
    [/bicycle-built-for-two|mountain bike/i, 'bicycle'],
    [/sports car|limousine|minivan|model t|racer/i, 'car'],
    [/motor scooter|moped/i, 'motorcycle'],
    [/airliner|warplane/i, 'airplane'],
    [/school bus|minibus/i, 'bus'],
    [/freight car|passenger car/i, 'train'],
    [/pickup|tow truck|trailer truck/i, 'truck'],
    [/speedboat|canoe|lifeboat/i, 'boat'],
    [/park bench/i, 'bench'],
    [/tabby|tiger cat|persian cat|siamese cat|egyptian cat/i, 'cat'],
    [/labrador|retriever|terrier|shepherd|poodle|chihuahua|beagle|husky|malamute|dog/i, 'dog'],
    [/sorrel/i, 'horse'],
    [/zebra/i, 'zebra'],
    [/ram|sheep/i, 'sheep'],
    [/ox|cow/i, 'cow'],
    [/african elephant|indian elephant/i, 'elephant'],
    [/brown bear|american black bear|ice bear|sloth bear/i, 'bear'],
    [/giraffe/i, 'giraffe'],
    [/banana/i, 'banana'],
    [/granny smith|apple/i, 'apple'],
    [/orange/i, 'orange'],
    [/broccoli/i, 'broccoli'],
    [/pizza/i, 'pizza'],
    [/hotdog/i, 'hot dog'],
    [/cheeseburger|sandwich/i, 'sandwich'],
    [/donut|doughnut/i, 'donut'],
    [/cake/i, 'cake'],
    [/toilet seat/i, 'toilet'],
    [/potted plant|flowerpot/i, 'potted plant'],
    [/vase/i, 'vase'],
    [/hair spray|hair drier|hair dryer/i, 'hair drier']
  ];

  const state = {
    detector:null, detectorError:null, verifier:null, verifierLoading:false, verifierError:null,
    stream:null, cameraStarted:false, facingMode:'environment', analyzing:false, verifying:false,
    mode:localStorage.getItem('mn-v04-mode')||'daily', demonstrative:localStorage.getItem('mn-demo')||'kore', immersionSetting:localStorage.getItem('mn-immersion')||'auto',
    performanceMode:localStorage.getItem('mn-performance')||'balanced', minScore:finiteOr(localStorage.getItem('mn-score'),.50), deepVisionEnabled:localStorage.getItem('mn-deep-vision')!=='0', showBoxes:localStorage.getItem('mn-boxes')==='1', diagnostics:localStorage.getItem('mn-diagnostics')==='1',
    selectedKey:null, selectedPrediction:null, rawDetectorKey:null, lastPredictions:[], recognition:{kind:'idle',reason:'',detectorScore:null,verifierScore:null,verifierLabel:''},
    frozen:false, detailsOpen:false, actionIndex:0, quizRevealed:false, currentCropHash:null, corrections:readJson('mn-corrections',[]), progress:readJson('mn-v04-progress',{}),
    focus:{nx:.5,ny:.45,phase:'observing',stable:0,moving:0,prevPixels:null,lastHash:null,trackingHash:null,loopTimer:null,lastAnalysisAt:0,lastMotion:1,lastSharpness:0},
    revealPhase:0, revealTimer:null, analysisToken:0,
    telemetry:{startedAt:Date.now(),focusSamples:0,heavyTotal:0,heavyTimes:[],avgHeavyMs:0,lastHeavyMs:0}, toastTimer:null
  };

  init();

  function init(){
    restoreControls(); bindEvents(); renderVocabulary(els.vocabList,'',selectManual); renderVocabulary(els.correctionList,'',applyCorrection); updateDemoButtons(); updateStudyButton(); updateMemoryControls(); updateTelemetry();
    if(!localStorage.getItem('mn-onboarded-v04')) requestAnimationFrame(()=>safeShowModal(els.onboarding));
    if('serviceWorker' in navigator) window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
    loadDetector();
    setInterval(updateTelemetry,1200);
  }

  function bindEvents(){
    els.start.addEventListener('click',startCamera); els.flip.addEventListener('click',flipCamera); els.settings.addEventListener('click',()=>safeShowModal(els.settingsDialog)); els.study.addEventListener('click',()=>safeShowModal(els.studyDialog)); els.scan.addEventListener('click',()=>requestAnalysis(true));
    els.stage.addEventListener('pointerup',handleStageTap);
    els.expandLesson.addEventListener('click',toggleDetails); els.breakdownToggle.addEventListener('click',()=>togglePanel(els.breakdownPanel)); els.sayToggle.addEventListener('click',()=>togglePanel(els.sayPanel));
    els.intentGrid.addEventListener('click',e=>{const b=e.target.closest('[data-intent]');if(b)showIntent(b.dataset.intent)});
    els.speakWord.addEventListener('click',()=>{const i=currentItem();if(i)speak(i.jp)}); els.speakSentence.addEventListener('click',()=>{const s=currentSentence();if(s)speak(s.jp)});
    els.know.addEventListener('click',()=>adjustMastery(1)); els.review.addEventListener('click',()=>adjustMastery(-1)); els.nextAction.addEventListener('click',()=>{state.actionIndex++;state.quizRevealed=false;renderLesson()}); els.freeze.addEventListener('click',()=>setFrozen(!state.frozen));
    els.confirm.addEventListener('click',confirmSelection); els.correct.addEventListener('click',openCorrection); els.learnThis.addEventListener('click',openCorrection); els.cancelCorrection.addEventListener('click',()=>{});
    els.vocabBtn.addEventListener('click',()=>{safeClose(els.studyDialog);setTimeout(()=>safeShowModal(els.vocabDialog),0)}); els.vocabSearch.addEventListener('input',()=>renderVocabulary(els.vocabList,els.vocabSearch.value,selectManual)); els.correctionSearch.addEventListener('input',()=>renderVocabulary(els.correctionList,els.correctionSearch.value,applyCorrection));
    document.querySelectorAll('.mode-btn[data-mode]').forEach(b=>b.addEventListener('click',()=>{setMode(b.dataset.mode);safeClose(els.studyDialog)}));
    els.demoControl.querySelectorAll('[data-demo]').forEach(b=>b.addEventListener('click',()=>{state.demonstrative=b.dataset.demo;localStorage.setItem('mn-demo',state.demonstrative);updateDemoButtons();renderLesson()}));
    els.performanceMode.addEventListener('change',async()=>{state.performanceMode=els.performanceMode.value;localStorage.setItem('mn-performance',state.performanceMode);if(state.cameraStarted){await openCamera(state.facingMode);resetObservation('Perfil atualizado')}showToast(`Perfil ${profile().label}.`)});
    els.immersion.addEventListener('change',()=>{state.immersionSetting=els.immersion.value;localStorage.setItem('mn-immersion',state.immersionSetting);renderLesson()});
    els.confidence.addEventListener('input',()=>{state.minScore=Number(els.confidence.value);els.confidenceValue.value=`${Math.round(state.minScore*100)}%`;localStorage.setItem('mn-score',String(state.minScore))});
    els.deepVision.addEventListener('change',()=>{state.deepVisionEnabled=els.deepVision.checked;localStorage.setItem('mn-deep-vision',state.deepVisionEnabled?'1':'0')});
    els.showBoxes.addEventListener('change',()=>{state.showBoxes=els.showBoxes.checked;localStorage.setItem('mn-boxes',state.showBoxes?'1':'0');renderBoxes()});
    els.diagnostics.addEventListener('change',()=>{state.diagnostics=els.diagnostics.checked;localStorage.setItem('mn-diagnostics',state.diagnostics?'1':'0');updateTelemetry();renderRecognitionState()});
    els.clearCorrections.addEventListener('click',()=>{state.corrections=[];localStorage.removeItem('mn-corrections');updateMemoryControls();showToast('Correções visuais apagadas.')});
    els.resetProgress.addEventListener('click',()=>{state.progress={};localStorage.removeItem('mn-v04-progress');renderLesson();showToast('Progresso por palavra redefinido.')});
    els.onboardingContinue.addEventListener('click',()=>localStorage.setItem('mn-onboarded-v04','1'));
    window.addEventListener('resize',()=>{positionCrosshair();renderBoxes()}); window.addEventListener('pagehide',stopCamera); document.addEventListener('visibilitychange',()=>{if(document.hidden&&window.speechSynthesis)window.speechSynthesis.cancel()});
  }

  async function loadDetector(){
    setStatus('Carregando detector…');
    try{if(!window.tf||!window.cocoSsd)throw new Error('Bibliotecas indisponíveis');try{await tf.setBackend('webgl')}catch(_){await tf.setBackend('cpu')}await tf.ready();state.detector=await cocoSsd.load({base:'lite_mobilenet_v2'});setStatus(state.cameraStarted?'Mire e estabilize':'IA pronta · abra a câmera');if(state.cameraStarted)startFocusLoop()}
    catch(e){state.detectorError=e;setStatus('IA indisponível · use Vocabulário');showToast('Detector visual não carregou. O vocabulário manual continua ativo.',4200);console.error(e)}
  }

  async function ensureVerifier(){
    if(state.verifier||state.verifierLoading||state.verifierError)return state.verifier;
    if(!window.mobilenet){state.verifierError=new Error('MobileNet indisponível');return null}
    state.verifierLoading=true;
    try{state.verifier=await mobilenet.load({version:2,alpha:.50});return state.verifier}catch(e){state.verifierError=e;console.warn(e);return null}finally{state.verifierLoading=false}
  }

  async function startCamera(){
    if(!navigator.mediaDevices?.getUserMedia){showToast('Câmera web não disponível. Use HTTPS.',4500);return}
    els.start.disabled=true;setStatus('Pedindo acesso à câmera…');
    try{await openCamera(state.facingMode);state.cameraStarted=true;els.start.classList.add('hidden');resetObservation('Mire em algo');startFocusLoop()}catch(e){console.error(e);els.start.disabled=false;setStatus(e?.name==='NotAllowedError'?'Permissão da câmera negada':'Não foi possível abrir a câmera');showToast('Verifique a permissão da câmera.',4200)}
  }

  async function openCamera(mode){
    stopStreamOnly();const p=profile();state.stream=await navigator.mediaDevices.getUserMedia({audio:false,video:{facingMode:{ideal:mode},width:{ideal:p.width},height:{ideal:p.height},frameRate:{ideal:p.fps,max:p.maxFps}}});els.video.srcObject=state.stream;await els.video.play();await waitForVideo();const track=state.stream.getVideoTracks()[0];state.facingMode=track?.getSettings?.().facingMode||mode;els.stage.classList.toggle('camera-user',state.facingMode==='user');await tryEnableContinuousAutofocus(track);positionCrosshair()
  }
  async function flipCamera(){if(!state.cameraStarted)return;state.facingMode=state.facingMode==='environment'?'user':'environment';try{await openCamera(state.facingMode);resetObservation('Câmera trocada')}catch(e){showToast('Não consegui trocar de câmera.')}}
  async function tryEnableContinuousAutofocus(track){try{const caps=track?.getCapabilities?.();if(caps?.focusMode?.includes?.('continuous'))await track.applyConstraints({advanced:[{focusMode:'continuous'}]})}catch(_){/* recurso opcional do navegador/câmera */}}
  function waitForVideo(){if(els.video.videoWidth)return Promise.resolve();return new Promise(r=>{const done=()=>r();els.video.addEventListener('loadedmetadata',done,{once:true});setTimeout(done,1500)})}
  function stopStreamOnly(){if(state.stream){state.stream.getTracks().forEach(t=>t.stop());state.stream=null}}
  function stopCamera(){clearTimeout(state.focus.loopTimer);clearTimeout(state.revealTimer);stopStreamOnly()}

  function profile(){const ps={eco:{label:'Econômico',width:480,height:360,fps:15,maxFps:18,sampleMs:320,required:2,motion:.040,change:.115,detectRatio:.54,deepRatio:.30},balanced:{label:'Equilibrado',width:640,height:480,fps:18,maxFps:22,sampleMs:230,required:2,motion:.035,change:.105,detectRatio:.62,deepRatio:.28},accuracy:{label:'Precisão',width:960,height:540,fps:22,maxFps:25,sampleMs:170,required:3,motion:.030,change:.095,detectRatio:.68,deepRatio:.25}};return ps[state.performanceMode]||ps.balanced}

  function startFocusLoop(){clearTimeout(state.focus.loopTimer);const tick=()=>{focusTick().finally(()=>{state.focus.loopTimer=setTimeout(tick,profile().sampleMs)})};tick()}
  async function focusTick(){
    if(!state.cameraStarted||document.hidden||els.video.readyState<2||!els.video.videoWidth)return;
    const sample=sampleFocus();state.telemetry.focusSamples++;state.focus.lastMotion=sample.motion;state.focus.lastSharpness=sample.sharpness;
    if(state.frozen){setPhase('tracking');return}
    if(state.focus.phase==='tracking'){
      const d=state.focus.trackingHash?hammingHex(sample.hash,state.focus.trackingHash):0;
      const changed=sample.motion>profile().change||d>18;
      state.focus.moving=changed?state.focus.moving+1:Math.max(0,state.focus.moving-1);
      if(state.focus.moving>=2){resetObservation('A mira mudou · buscando novo objeto')}
      return;
    }
    const stable=sample.motion<profile().motion&&sample.sharpness>.025;
    state.focus.stable=stable?state.focus.stable+1:0;
    setPhase(state.focus.stable?'focusing':'observing');
    if(state.focus.stable>=profile().required&&!state.analyzing&&!state.verifying&&Date.now()-state.focus.lastAnalysisAt>450){requestAnalysis(false)}
  }

  function sampleFocus(){
    const box=focusBox(profile().deepRatio);drawVideoBoxToCanvas(box,els.focus);const ctx=els.focus.getContext('2d',{willReadFrequently:true});const {data,width,height}=ctx.getImageData(0,0,els.focus.width,els.focus.height);const pixels=[];let sharp=0, count=0;
    for(let y=0;y<height;y+=4){for(let x=0;x<width;x+=4){const i=(y*width+x)*4;const lum=(data[i]*.299+data[i+1]*.587+data[i+2]*.114)/255;pixels.push(lum);if(x+4<width){const j=(y*width+x+4)*4;const lum2=(data[j]*.299+data[j+1]*.587+data[j+2]*.114)/255;sharp+=Math.abs(lum-lum2);count++}}}
    let motion=1;if(state.focus.prevPixels&&state.focus.prevPixels.length===pixels.length){let sum=0;for(let i=0;i<pixels.length;i++)sum+=Math.abs(pixels[i]-state.focus.prevPixels[i]);motion=sum/pixels.length}state.focus.prevPixels=pixels;return{motion,sharpness:count?sharp/count:0,hash:computeDHash(els.focus)}
  }

  async function requestAnalysis(manual){
    if(!state.cameraStarted){if(manual)showToast('Abra a câmera primeiro.');return}if(!state.detector){if(manual)showToast('Detector ainda está carregando.');return}if(state.analyzing||state.verifying)return;
    state.analyzing=true;state.focus.lastAnalysisAt=Date.now();setPhase('analyzing');setStatus('Analisando o foco…');const token=++state.analysisToken;const started=performance.now();recordHeavy();
    try{
      const roi=focusBox(profile().detectRatio);drawVideoBoxToCanvas(roi,els.detect);const local=await state.detector.detect(els.detect,10,state.minScore);if(token!==state.analysisToken)return;
      state.lastPredictions=local.filter(p=>JAPANESE_DB[p.class]).map(p=>mapPredictionFromCanvas(p,roi,els.detect));
      const target=chooseTarget(state.lastPredictions);
      if(target){await acceptDetectorTarget(target,token)}else{await deepAnalyzeFocus(token,manual)}
      renderBoxes();
    }catch(e){console.error(e);setStatus('Falha temporária na análise');if(manual)showToast('A análise falhou; tente novamente.')}finally{const ms=Math.max(1,performance.now()-started);state.telemetry.lastHeavyMs=ms;state.telemetry.avgHeavyMs=state.telemetry.avgHeavyMs?state.telemetry.avgHeavyMs*.78+ms*.22:ms;state.analyzing=false;if(state.selectedKey)setPhase('tracking');else setPhase('observing');updateTelemetry()}
  }

  async function acceptDetectorTarget(prediction,token){
    state.rawDetectorKey=prediction.class;state.selectedPrediction=prediction;const hash=computeCurrentFocusHash();state.currentCropHash=hash;const remembered=findCorrection(hash,prediction.class);if(remembered){selectObject(remembered.key,{...prediction,class:remembered.key,_memory:true},{kind:'memory',reason:'Lembrança visual local aplicada.',detectorScore:prediction.score});return}
    const high=window.MiraRecognitionPolicy?.isHighConfusion?.(prediction.class);const needsVerify=state.deepVisionEnabled&&(high||prediction.score<.78);
    if(!needsVerify){selectObject(prediction.class,prediction,{kind:'stable',reason:'Objeto focal reconhecido com boa consistência.',detectorScore:prediction.score});return}
    state.verifying=true;setStatus('Conferindo o objeto…');
    try{
      const verifier=await ensureVerifier();if(token!==state.analysisToken)return;if(!verifier){selectObject(prediction.class,prediction,{kind:prediction.score>=.86&&!high?'stable':'tentative',reason:'Verificador indisponível; confirme se necessário.',detectorScore:prediction.score});return}
      const snapshot=cropFromBbox(prediction.class==='person'?focusBox(.28):prediction.bbox,224);recordHeavy();const classes=await verifier.classify(snapshot,6);if(token!==state.analysisToken)return;const mapped=bestMapped(classes);const same=mapped?.key===prediction.class;const strongAlt=mapped&&mapped.key!==prediction.class&&mapped.probability>=.16;
      if(same&&mapped.probability>=.08)selectObject(prediction.class,prediction,{kind:'stable',reason:'Detector e verificador são compatíveis.',detectorScore:prediction.score,verifierScore:mapped.probability,verifierLabel:mapped.className});
      else if(strongAlt&&(high||prediction.score<.82))selectObject(mapped.key,{...prediction,class:mapped.key,_deep:true},{kind:'tentative',reason:`O verificador sugere “${JAPANESE_DB[mapped.key].pt}”. Confirme antes de memorizar.`,detectorScore:prediction.score,verifierScore:mapped.probability,verifierLabel:mapped.className});
      else selectObject(prediction.class,prediction,{kind:(prediction.score>=.88&&!high)?'stable':'tentative',reason:high?'Esta categoria costuma confundir objetos pequenos. Confirme ou corrija.':'A leitura ainda é incerta.',detectorScore:prediction.score,verifierScore:mapped?.probability||classes[0]?.probability||null,verifierLabel:mapped?.className||classes[0]?.className||''});
    }finally{state.verifying=false}
  }

  async function deepAnalyzeFocus(token,manual){
    if(!state.deepVisionEnabled){showEmptyState('Ainda não reconheci','Toque em “Vocabulário manual” para escolher a palavra.');return}
    const verifier=await ensureVerifier();if(token!==state.analysisToken||!verifier){showEmptyState('Ainda não reconheci','A visão detalhada não ficou disponível. Use o vocabulário manual.');return}
    const box=focusBox(profile().deepRatio);const snapshot=cropFromBbox(box,224);state.currentCropHash=computeDHash(snapshot);const mem=findCorrection(state.currentCropHash,'__focus__');if(mem){selectObject(mem.key,{class:mem.key,score:1,bbox:box,_memory:true},{kind:'memory',reason:'Lembrança visual local aplicada.'});return}
    recordHeavy();const classes=await verifier.classify(snapshot,10);if(token!==state.analysisToken)return;const mapped=bestMapped(classes);if(mapped&&((mapped.rank<=2&&mapped.probability>=.075)||mapped.probability>=.16)){const stable=mapped.probability>=.20||mapped.rank===0&&mapped.probability>=.11;selectObject(mapped.key,{class:mapped.key,score:mapped.probability,bbox:box,_deep:true},{kind:stable?'deep':'tentative',reason:stable?'A região focal foi identificada pela visão detalhada.':'Tenho uma hipótese para a região focal; confirme se estiver correta.',verifierScore:mapped.probability,verifierLabel:mapped.className});return}
    showEmptyState('Não tenho certeza','Aproxime-se, toque no objeto ou use o vocabulário manual.');setStatus('Objeto fora das classes reconhecíveis');if(manual)showToast('Sem confiança suficiente. Use Vocabulário/Correção para ensinar este objeto.')
  }

  function bestMapped(classes){return classes.map((r,rank)=>({...r,rank,key:mapVerifierLabel(r.className)})).filter(r=>r.key&&JAPANESE_DB[r.key]).sort((a,b)=>b.probability-a.probability)[0]||null}
  function mapVerifierLabel(label){for(const [rx,key] of VERIFIER_RULES)if(rx.test(label))return key;return null}

  function selectObject(key,prediction,recognition){
    if(!JAPANESE_DB[key])return;const changed=state.selectedKey!==key;state.selectedKey=key;state.selectedPrediction=prediction||state.selectedPrediction;state.recognition={detectorScore:null,verifierScore:null,verifierLabel:'',...recognition};state.focus.trackingHash=(state.cameraStarted&&els.video.videoWidth)?computeCurrentFocusHash():null;state.focus.moving=0;setPhase('tracking');hideEmpty();els.lessonCard.classList.remove('hidden');if(changed){registerEncounter(key);state.actionIndex=0;state.revealPhase=0;clearTimeout(state.revealTimer);state.revealTimer=setTimeout(()=>{state.revealPhase=1;renderLesson()},850)}renderLesson();setStatus(state.recognition.kind==='tentative'?'Talvez seja · confirme':'Foco reconhecido · rastreamento leve')
  }

  function clearSelection(){state.selectedKey=null;state.selectedPrediction=null;state.rawDetectorKey=null;state.recognition={kind:'idle',reason:'',detectorScore:null,verifierScore:null,verifierLabel:''};state.focus.trackingHash=null;clearTimeout(state.revealTimer);els.lessonCard.classList.add('hidden');renderBoxes()}
  function resetObservation(status='Mire em algo'){clearSelection();state.focus.phase='observing';state.focus.stable=0;state.focus.moving=0;state.focus.prevPixels=null;state.focus.lastHash=null;state.analysisToken++;setPhase('observing');showEmptyState('Mire em algo','Quando a região estabilizar, eu analiso uma vez e paro.');setStatus(status)}
  function setPhase(phase){state.focus.phase=phase;els.holdRing.className=`hold-ring ${phase}`}

  function currentItem(){return state.selectedKey?JAPANESE_DB[state.selectedKey]:null}
  function currentProgress(){return state.selectedKey?(state.progress[state.selectedKey]||{seen:0,mastery:0,lastSeen:0}):{seen:0,mastery:0}}
  function currentSceneSentence(){
    if(!state.selectedPrediction||!window.MiraRecognitionPolicy?.inferSceneRelation)return null;const rel=window.MiraRecognitionPolicy.inferSceneRelation(state.selectedPrediction,state.lastPredictions.filter(p=>p!==state.selectedPrediction));if(!rel)return null;const a=currentItem(),b=JAPANESE_DB[rel.other.class];if(!a||!b)return null;
    const forms={on:['上','ue','em cima de'],above:['上','ue','acima de'],below:['下','shita','embaixo de'],inside:['中','naka','dentro de'],left:['左','hidari','à esquerda de'],right:['右','migi','à direita de']};const f=forms[rel.relation];if(!f)return null;const exist=a.animate?{jp:'います',romaji:'imasu'}:{jp:'あります',romaji:'arimasu'};return{jp:`${a.jp}は${b.jp}の${f[0]}に${exist.jp}。`,romaji:`${cap(a.romaji)} wa ${b.romaji} no ${f[1]} ni ${exist.romaji}.`,pt:`${cap(a.pt)} está ${f[2]} ${b.pt}.`,kind:'scene'}
  }
  function currentSentence(){const item=currentItem();if(!item)return null;const p=currentProgress();const scene=currentSceneSentence();return MiraLearning.chooseMoment({key:state.selectedKey,item,mode:state.mode==='immersion'?'daily':state.mode,level:p.mastery,actionIndex:state.actionIndex,demo:state.demonstrative,scene})}

  function renderLesson(){
    const item=currentItem();if(!item)return;const p=currentProgress();const help=MiraLearning.helpLevel(p,state.immersionSetting);const sentence=currentSentence();const quiz=state.mode==='quiz'&&!state.quizRevealed;
    els.jpWord.textContent=quiz?'何？':item.jp;els.kana.textContent=quiz?'なに':item.kana;els.romaji.textContent=quiz?'nani':item.romaji;els.translationInline.textContent=help===1&&!quiz?item.pt:'';
    els.kana.classList.toggle('hidden',state.mode==='immersion'&&p.mastery>=3);els.romaji.classList.toggle('hidden',help>=3||state.mode==='immersion');els.translationInline.classList.toggle('hidden',help>=2||state.mode==='immersion'||quiz);
    const shownSentence=quiz?{jp:'これは何ですか？',romaji:'Kore wa nan desu ka?',pt:'O que é isto?'}:sentence;els.sentenceJp.textContent=shownSentence?.jp||'';els.sentenceRomaji.textContent=shownSentence?.romaji||'';els.sentencePt.textContent=quiz?`Resposta: ${item.jp} (${item.pt})`:shownSentence?.pt||'';els.sentenceRomaji.classList.toggle('hidden',help>=3||state.mode==='immersion');els.sentenceCompact.classList.toggle('concealed',state.revealPhase===0&&state.mode!=='quiz');
    renderRecognitionState();renderBreakdown(shownSentence,item);renderProgress();renderScene();els.freeze.textContent=state.frozen?'▶ Destravar':'⌾ Travar';els.tentativePanel.classList.toggle('hidden',state.recognition.kind!=='tentative');els.tentativeReason.textContent=state.recognition.reason||'Confirme ou corrija.'
  }
  function renderRecognitionState(){const r=state.recognition;const labels={stable:'Reconhecido',deep:'Visão detalhada',memory:'Lembrança local',tentative:'Talvez seja'};let t=labels[r.kind]||'Reconhecido';if(state.diagnostics){const bits=[];if(Number.isFinite(r.detectorScore))bits.push(`D ${Math.round(r.detectorScore*100)}%`);if(Number.isFinite(r.verifierScore))bits.push(`V ${Math.round(r.verifierScore*100)}%`);if(bits.length)t+=` · ${bits.join(' / ')}`}els.recognitionState.textContent=t;els.recognitionState.classList.toggle('tentative',r.kind==='tentative')}
  function renderBreakdown(sentence,item){els.breakdownTokens.replaceChildren();if(!sentence)return;const tokens=MiraLearning.tokenize(sentence,item);tokens.forEach(t=>{const b=document.createElement('button');b.type='button';b.className='token-chip';b.innerHTML='<strong></strong><small></small>';b.querySelector('strong').textContent=t.text;b.querySelector('small').textContent=t.reading||t.meaning;b.addEventListener('click',()=>{els.breakdownTokens.querySelectorAll('.token-chip').forEach(x=>x.classList.remove('active'));b.classList.add('active');els.tokenExplain.textContent=`${t.meaning}${t.role?` — ${t.role}`:''}`});els.breakdownTokens.appendChild(b)});els.patternBox.textContent=`Padrão: ${MiraLearning.patternFor(tokens)}`}
  function renderProgress(){const p=currentProgress();els.progressHint.textContent=`Esta palavra: ${p.seen} encontro(s) · domínio ${p.mastery}/5. ${p.mastery<2?'Ainda mantenho mais ajuda.':p.mastery<4?'Português começa a desaparecer.':'Japonês em primeiro plano.'}`}
  function renderScene(){const s=currentSceneSentence();els.sceneLine.classList.toggle('hidden',!s);if(s)els.sceneLine.textContent=`🧭 Contexto: ${s.jp} · ${s.pt}`}

  function registerEncounter(key){const now=Date.now();const p=state.progress[key]||{seen:0,mastery:0,lastSeen:0};if(now-p.lastSeen>45000)p.seen++;p.lastSeen=now;state.progress[key]=p;saveProgress()}
  function adjustMastery(delta){if(!state.selectedKey)return;const p=currentProgress();p.mastery=clamp((p.mastery||0)+delta,0,5);p.lastSeen=Date.now();state.progress[state.selectedKey]=p;saveProgress();state.quizRevealed=true;renderLesson();showToast(delta>0?`Domínio de ${currentItem().jp}: ${p.mastery}/5`:'Ajuda aumentada para esta palavra.')}
  function saveProgress(){localStorage.setItem('mn-v04-progress',JSON.stringify(state.progress))}

  function showIntent(intent){const item=currentItem();if(!item)return;const s=MiraLearning.intentSentence(intent,item,state.demonstrative);els.intentAnswer.classList.remove('hidden');els.intentAnswer.innerHTML='<strong></strong><span class="r"></span><span class="p"></span>';els.intentAnswer.querySelector('strong').textContent=s.jp;els.intentAnswer.querySelector('.r').textContent=s.romaji;els.intentAnswer.querySelector('.p').textContent=s.pt;speak(s.jp)}
  function togglePanel(panel){panel.classList.toggle('hidden')}
  function toggleDetails(){state.detailsOpen=!state.detailsOpen;state.quizRevealed=state.quizRevealed||state.mode==='quiz';els.lessonCard.classList.toggle('expanded',state.detailsOpen);els.expandLesson.setAttribute('aria-expanded',String(state.detailsOpen));els.lessonDetails.setAttribute('aria-hidden',String(!state.detailsOpen));if(state.detailsOpen){state.revealPhase=1;renderLesson()}}
  function setFrozen(v){state.frozen=v;renderLesson();showToast(v?'Objeto travado; análise automática pausada.':'Rastreamento retomado.')}

  function confirmSelection(){if(!state.selectedKey)return;const saved=rememberCorrection(state.selectedKey);state.recognition.kind='stable';state.recognition.reason=saved?'Confirmado e lembrado localmente.':'Confirmado por você.';adjustMastery(1);renderLesson()}
  function openCorrection(){if(!state.selectedKey&&!state.cameraStarted)return;state.frozen=true;els.correctionSearch.value='';renderVocabulary(els.correctionList,'',applyCorrection);safeShowModal(els.correctionDialog);setTimeout(()=>els.correctionSearch.focus(),80)}
  function applyCorrection(key){const item=JAPANESE_DB[key];if(!item)return;const box=state.selectedPrediction?.bbox||focusBox(profile().deepRatio);state.rawDetectorKey=state.rawDetectorKey||'__focus__';selectObject(key,{class:key,score:1,bbox:box,_manual:true},{kind:'stable',reason:'Corrigido por você.'});rememberCorrection(key);safeClose(els.correctionDialog);state.frozen=false;adjustMastery(1);showToast(`Aprendido: ${item.jp}`)}
  function rememberCorrection(key){const hash=state.currentCropHash||computeCurrentFocusHash();if(!hash)return false;const raw=state.rawDetectorKey||'__focus__';state.corrections=state.corrections.filter(c=>!(c.hash===hash&&c.raw===raw));state.corrections.unshift({hash,raw,key,at:Date.now()});state.corrections=state.corrections.slice(0,80);localStorage.setItem('mn-corrections',JSON.stringify(state.corrections));updateMemoryControls();return true}
  function findCorrection(hash,raw){if(!hash)return null;return state.corrections.map(c=>({...c,d:hammingHex(hash,c.hash)})).filter(c=>(c.raw===raw||c.raw==='__focus__'||raw==='__focus__')&&c.d<=8).sort((a,b)=>a.d-b.d)[0]||null}

  function selectManual(key){const item=JAPANESE_DB[key];if(!item)return;state.rawDetectorKey='__manual__';state.currentCropHash=null;selectObject(key,{class:key,score:1,bbox:focusBox(.32),_manual:true},{kind:'stable',reason:'Escolhido no vocabulário.'});safeClose(els.vocabDialog);state.frozen=true;showToast(`${item.jp} · modo manual travado`)}
  function renderVocabulary(container,query,onChoose){const q=normalize(query);const entries=Object.entries(JAPANESE_DB).filter(([k,i])=>!q||[k,i.jp,i.kana,i.romaji,i.pt,...(i.aliases||[])].some(v=>normalize(v).includes(q))).sort((a,b)=>a[1].pt.localeCompare(b[1].pt,'pt-BR'));container.replaceChildren();entries.forEach(([k,i])=>{const b=document.createElement('button');b.type='button';b.className='vocab-item';b.innerHTML='<span><span class="jp"></span><span class="sub"></span></span><span class="pt"></span>';b.querySelector('.jp').textContent=i.jp;b.querySelector('.sub').textContent=`${i.kana} · ${i.romaji}`;b.querySelector('.pt').textContent=i.pt;b.addEventListener('click',()=>onChoose(k));container.appendChild(b)})}

  function handleStageTap(e){if(!state.cameraStarted)return;if(e.target.closest('button,section.lesson-card,header,.study-pill,.load-chip'))return;const r=els.stage.getBoundingClientRect();state.focus.nx=clamp((e.clientX-r.left)/r.width,.08,.92);state.focus.ny=clamp((e.clientY-r.top)/r.height,.16,.78);positionCrosshair();resetObservation('Ponto de foco alterado');showToast('Foco movido. Mantenha o objeto estável.')}
  function positionCrosshair(){els.crosshairWrap.style.left=`${state.focus.nx*100}%`;els.crosshairWrap.style.top=`${state.focus.ny*100}%`}
  function focusPointInVideo(){const m=videoCoverMetrics();let sx=state.focus.nx*m.cw,sy=state.focus.ny*m.ch;if(state.facingMode==='user')sx=m.cw-sx;return{x:(sx-m.ox)/m.scale,y:(sy-m.oy)/m.scale}}
  function focusBox(ratio){const p=focusPointInVideo(),vw=els.video.videoWidth||1,vh=els.video.videoHeight||1;return window.MiraRecognitionPolicy?.makeCrosshairBox?.(vw,vh,p,ratio)||[Math.max(0,p.x-100),Math.max(0,p.y-100),200,200]}
  function drawVideoBoxToCanvas(box,canvas){const [x,y,w,h]=box;const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.clearRect(0,0,canvas.width,canvas.height);ctx.drawImage(els.video,x,y,w,h,0,0,canvas.width,canvas.height)}
  function cropFromBbox(box,size=224){const c=document.createElement('canvas');c.width=size;c.height=size;const [x,y,w,h]=box;c.getContext('2d',{willReadFrequently:true}).drawImage(els.video,x,y,w,h,0,0,size,size);return c}
  function computeCurrentFocusHash(){drawVideoBoxToCanvas(focusBox(profile().deepRatio),els.focus);return computeDHash(els.focus)}
  function mapPredictionFromCanvas(p,roi,canvas){const [rx,ry,rw,rh]=roi;return{...p,bbox:[rx+p.bbox[0]*rw/canvas.width,ry+p.bbox[1]*rh/canvas.height,p.bbox[2]*rw/canvas.width,p.bbox[3]*rh/canvas.height]}}
  function chooseTarget(preds){if(!preds.length)return null;const p=focusPointInVideo();const inside=preds.filter(x=>pointInBox(p.x,p.y,x.bbox));if(inside.length)return inside.sort((a,b)=>scoreTarget(b,p)-scoreTarget(a,p))[0];const max=Math.min(els.video.videoWidth,els.video.videoHeight)*.12;return preds.map(x=>({x,d:distanceToBox(p.x,p.y,x.bbox)})).filter(v=>v.d<max).sort((a,b)=>a.d-b.d||b.x.score-a.x.score)[0]?.x||null}
  function scoreTarget(p,f){const [x,y,w,h]=p.bbox,cx=x+w/2,cy=y+h/2,diag=Math.hypot(els.video.videoWidth||1,els.video.videoHeight||1);return p.score-Math.hypot(cx-f.x,cy-f.y)/diag*.22+Math.min(.07,w*h/Math.max(1,els.video.videoWidth*els.video.videoHeight)*.16)}
  function renderBoxes(){els.boxes.replaceChildren();if(!state.showBoxes&&!state.selectedPrediction)return;const m=videoCoverMetrics();const list=state.showBoxes?state.lastPredictions:(state.selectedPrediction?[state.selectedPrediction]:[]);list.forEach(p=>{if(!p?.bbox||!JAPANESE_DB[p.class])return;const [x,y,w,h]=p.bbox,b=document.createElement('div');b.className='detection-box'+(p===state.selectedPrediction||p.class===state.selectedKey?' selected':'');b.style.left=`${m.ox+x*m.scale}px`;b.style.top=`${m.oy+y*m.scale}px`;b.style.width=`${w*m.scale}px`;b.style.height=`${h*m.scale}px`;const s=document.createElement('span');s.textContent=state.diagnostics?`${JAPANESE_DB[p.class].jp} ${Math.round((p.score||0)*100)}%`:JAPANESE_DB[p.class].jp;b.appendChild(s);els.boxes.appendChild(b)})}
  function videoCoverMetrics(){const cw=els.stage.clientWidth,ch=els.stage.clientHeight,vw=els.video.videoWidth||1,vh=els.video.videoHeight||1,scale=Math.max(cw/vw,ch/vh);return{cw,ch,vw,vh,scale,ox:(cw-vw*scale)/2,oy:(ch-vh*scale)/2}}
  function pointInBox(x,y,b){return x>=b[0]&&x<=b[0]+b[2]&&y>=b[1]&&y<=b[1]+b[3]}
  function distanceToBox(x,y,b){const dx=Math.max(b[0]-x,0,x-(b[0]+b[2])),dy=Math.max(b[1]-y,0,y-(b[1]+b[3]));return Math.hypot(dx,dy)}

  function computeDHash(canvas){const tmp=document.createElement('canvas');tmp.width=9;tmp.height=8;const ctx=tmp.getContext('2d',{willReadFrequently:true});ctx.drawImage(canvas,0,0,9,8);const d=ctx.getImageData(0,0,9,8).data;let bits='',hex='';for(let y=0;y<8;y++)for(let x=0;x<8;x++){const i=(y*9+x)*4,j=(y*9+x+1)*4;const a=d[i]+d[i+1]+d[i+2],b=d[j]+d[j+1]+d[j+2];bits+=a>b?'1':'0'}for(let i=0;i<bits.length;i+=4)hex+=parseInt(bits.slice(i,i+4),2).toString(16);return hex}
  function hammingHex(a,b){if(!a||!b||a.length!==b.length)return 99;let n=0;for(let i=0;i<a.length;i++){let x=parseInt(a[i],16)^parseInt(b[i],16);while(x){n+=x&1;x>>=1}}return n}

  function setMode(mode){state.mode=MODE_META[mode]?mode:'daily';localStorage.setItem('mn-v04-mode',state.mode);state.quizRevealed=false;updateStudyButton();renderLesson()}
  function updateStudyButton(){const m=MODE_META[state.mode]||MODE_META.daily;els.studyModeIcon.textContent=m.icon;els.studyModeLabel.textContent=m.label;document.querySelectorAll('.mode-btn[data-mode]').forEach(b=>b.classList.toggle('active',b.dataset.mode===state.mode))}
  function updateDemoButtons(){els.demoControl.querySelectorAll('[data-demo]').forEach(b=>b.classList.toggle('active',b.dataset.demo===state.demonstrative))}
  function restoreControls(){if(!['eco','balanced','accuracy'].includes(state.performanceMode))state.performanceMode='balanced';if(!['auto','1','2','3'].includes(state.immersionSetting))state.immersionSetting='auto';els.performanceMode.value=state.performanceMode;els.immersion.value=state.immersionSetting;els.confidence.value=String(clamp(state.minScore,.35,.80));state.minScore=Number(els.confidence.value);els.confidenceValue.value=`${Math.round(state.minScore*100)}%`;els.deepVision.checked=state.deepVisionEnabled;els.showBoxes.checked=state.showBoxes;els.diagnostics.checked=state.diagnostics}
  function updateMemoryControls(){els.correctionCount.textContent=String(state.corrections.length);els.clearCorrections.disabled=!state.corrections.length}

  function recordHeavy(){const now=Date.now();state.telemetry.heavyTotal++;state.telemetry.heavyTimes.push(now);state.telemetry.heavyTimes=state.telemetry.heavyTimes.filter(t=>now-t<60000)}
  function updateTelemetry(){const now=Date.now();state.telemetry.heavyTimes=state.telemetry.heavyTimes.filter(t=>now-t<60000);const perMin=state.telemetry.heavyTimes.length;const load=perMin<=5?'baixa':perMin<=12?'moderada':'alta';els.loadText.textContent=load;els.loadChip.classList.toggle('hidden',!state.diagnostics);els.telemetryBox.innerHTML=`<strong>Telemetria local</strong><br>Estado: ${state.focus.phase} · inferências pesadas/min: ${perMin} · média: ${Math.round(state.telemetry.avgHeavyMs||0)} ms · amostras leves: ${state.telemetry.focusSamples}.<br><small>“Carga” é uma estimativa pela frequência de inferência; não mede a temperatura física do aparelho.</small>`}

  function showEmptyState(title,subtitle){els.emptyHint.querySelector('strong').textContent=title;els.emptyHint.querySelector('span').textContent=subtitle;els.emptyHint.classList.remove('hidden')}
  function hideEmpty(){els.emptyHint.classList.add('hidden')}
  function setStatus(t){els.status.textContent=t}
  function speak(t){if(!('speechSynthesis'in window)){showToast('Síntese de voz indisponível.');return}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang='ja-JP';u.rate=.86;const v=speechSynthesis.getVoices().find(v=>/^ja(-|_)/i.test(v.lang));if(v)u.voice=v;speechSynthesis.speak(u)}
  function showToast(msg,ms=2400){clearTimeout(state.toastTimer);els.toast.textContent=msg;els.toast.classList.add('show');state.toastTimer=setTimeout(()=>els.toast.classList.remove('show'),ms)}
  function safeShowModal(d){if(d&&!d.open&&typeof d.showModal==='function')d.showModal()}
  function safeClose(d){if(d?.open&&typeof d.close==='function')d.close()}
  function normalize(v){return String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim()}
  function finiteOr(v,f){const n=Number(v);return Number.isFinite(n)?n:f}
  function readJson(k,f){try{return JSON.parse(localStorage.getItem(k))??f}catch(_){return f}}
  function clamp(v,a,b){return Math.min(b,Math.max(a,v))}
  function cap(s){return s?String(s).charAt(0).toUpperCase()+String(s).slice(1):''}

  window.MiraDebug = { state, profile, selectObject, currentSentence, renderLesson, resetObservation, requestAnalysis, sampleFocus, computeDHash, hammingHex };
})();
