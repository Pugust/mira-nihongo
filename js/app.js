'use strict';

(() => {
  const els = {
    stage: document.getElementById('cameraStage'), video: document.getElementById('camera'), freezeCanvas: document.getElementById('freezeCanvas'), focus: document.getElementById('focusCanvas'), detect: document.getElementById('detectCanvas'), crop: document.getElementById('cropCanvas'), boxes: document.getElementById('boxesLayer'),
    status: document.getElementById('statusText'), start: document.getElementById('startBtn'), flip: document.getElementById('flipCameraBtn'), settings: document.getElementById('settingsBtn'), settingsDialog: document.getElementById('settingsDialog'),
    study: document.getElementById('studyBtn'), studyDialog: document.getElementById('studyDialog'), studyModeIcon: document.getElementById('studyModeIcon'), studyModeLabel: document.getElementById('studyModeLabel'),
    crosshairWrap: document.getElementById('crosshairWrap'), holdRing: document.getElementById('holdRing'), emptyHint: document.getElementById('emptyHint'), scan: document.getElementById('scanBtn'), unknownCorrect: document.getElementById('unknownCorrectBtn'), loadChip: document.getElementById('loadChip'), loadText: document.getElementById('loadText'), freezeBanner: document.getElementById('freezeBanner'),
    lessonCard: document.getElementById('lessonCard'), expandLesson: document.getElementById('expandLessonBtn'), lessonDetails: document.getElementById('lessonDetails'), recognitionState: document.getElementById('recognitionState'),
    jpWord: document.getElementById('jpWord'), kana: document.getElementById('kanaText'), romaji: document.getElementById('romajiText'), translationInline: document.getElementById('translationInline'), readingRow: document.getElementById('readingRow'), sentenceCompact: document.getElementById('sentenceCompact'), sentenceJp: document.getElementById('sentenceJp'), sentenceRomaji: document.getElementById('sentenceRomaji'), sentencePt: document.getElementById('sentencePt'), primaryFlowAction: document.getElementById('primaryFlowAction'),
    tentativePanel: document.getElementById('tentativePanel'), tentativeReason: document.getElementById('tentativeReason'), candidateStrip: document.getElementById('candidateStrip'), confirm: document.getElementById('confirmBtn'), correct: document.getElementById('correctBtn'),
    breakdownToggle: document.getElementById('breakdownToggle'), breakdownPanel: document.getElementById('breakdownPanel'), breakdownTokens: document.getElementById('breakdownTokens'), tokenExplain: document.getElementById('tokenExplain'), patternBox: document.getElementById('patternBox'),
    sayToggle: document.getElementById('saySomethingToggle'), sayPanel: document.getElementById('saySomethingPanel'), intentGrid: document.getElementById('intentGrid'), intentAnswer: document.getElementById('intentAnswer'), sceneLine: document.getElementById('sceneLine'),
    speakWord: document.getElementById('speakWordBtn'), speakSentence: document.getElementById('speakSentenceBtn'), know: document.getElementById('knowBtn'), review: document.getElementById('reviewBtn'), nextAction: document.getElementById('nextActionBtn'), learnThis: document.getElementById('learnThisBtn'), progressHint: document.getElementById('progressHint'), moreActions: document.getElementById('moreActionsBtn'), secondaryActions: document.getElementById('secondaryActions'),
    immersion: document.getElementById('immersionLevel'), performanceMode: document.getElementById('performanceMode'), confidence: document.getElementById('confidenceRange'), confidenceValue: document.getElementById('confidenceValue'), deepVision: document.getElementById('deepVisionToggle'), autoFreeze: document.getElementById('autoFreezeToggle'), stickyStrength: document.getElementById('stickyStrength'), showBoxes: document.getElementById('showBoxesToggle'), diagnostics: document.getElementById('diagnosticsToggle'), telemetryBox: document.getElementById('telemetryBox'), demoControl: document.getElementById('demonstrativeControl'), fontSize: document.getElementById('fontSize'), haptics: document.getElementById('hapticsToggle'),
    clearCorrections: document.getElementById('clearCorrectionsBtn'), correctionCount: document.getElementById('correctionCount'), resetProgress: document.getElementById('resetProgressBtn'), replayTutorial: document.getElementById('replayTutorialBtn'),
    vocabBtn: document.getElementById('vocabBtn'), vocabDialog: document.getElementById('vocabDialog'), vocabSearch: document.getElementById('vocabSearch'), vocabList: document.getElementById('vocabList'), correctionDialog: document.getElementById('correctionDialog'), correctionSearch: document.getElementById('correctionSearch'), correctionList: document.getElementById('correctionList'), correctionCandidates: document.getElementById('correctionCandidates'), correctionCandidateList: document.getElementById('correctionCandidateList'), cancelCorrection: document.getElementById('cancelCorrectionBtn'), historyBtn: document.getElementById('historyBtn'), historyDialog: document.getElementById('historyDialog'), historyList: document.getElementById('historyList'),
    tutorialCoach: document.getElementById('tutorialCoach'), tutorialTitle: document.getElementById('tutorialTitle'), tutorialText: document.getElementById('tutorialText'), tutorialNext: document.getElementById('tutorialNextBtn'), tutorialSkip: document.getElementById('tutorialSkipBtn'), toast: document.getElementById('toast')
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
    [/light switch|switch/i, 'switch'],
    [/can opener/i, 'can_opener'],
    [/bottle opener/i, 'bottle_opener'],
    [/corkscrew/i, 'corkscrew'],
    [/measuring cup/i, 'measuring_cup'],
    [/whisk/i, 'whisk'],
    [/vacuum|vacuum cleaner/i, 'vacuum'],
    [/washing machine/i, 'washing_machine'],
    [/dishwasher/i, 'dishwasher'],
    [/flatiron|iron/i, 'iron'],
    [/sewing machine/i, 'sewing_machine'],
    [/space heater/i, 'space_heater'],
    [/flashlight|torch/i, 'flashlight'],
    [/forklift/i, 'forklift'],
    [/chain/i, 'chain'],
    [/car wheel|wheel/i, 'wheel'],
    [/tire|tyre/i, 'tire'],
    [/padlock|combination lock/i, 'lock'],
    [/hard disc|hard disk/i, 'usb_drive'],
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
    mode:localStorage.getItem('mn-v06-mode')||localStorage.getItem('mn-v05-mode')||localStorage.getItem('mn-v04-mode')||'daily', demonstrative:localStorage.getItem('mn-demo')||'kore', immersionSetting:localStorage.getItem('mn-immersion')||'auto',
    performanceMode:localStorage.getItem('mn-performance')||'balanced', minScore:finiteOr(localStorage.getItem('mn-score'),.50), deepVisionEnabled:localStorage.getItem('mn-deep-vision')!=='0', autoFreezeEnabled:localStorage.getItem('mn-v05-autofreeze')!=='0', stickyStrength:localStorage.getItem('mn-v05-sticky')||'strong', showBoxes:localStorage.getItem('mn-boxes')==='1', diagnostics:localStorage.getItem('mn-diagnostics')==='1', fontSize:localStorage.getItem('mn-v06-font')||'medium', hapticsEnabled:localStorage.getItem('mn-v06-haptics')!=='0',
    selectedKey:null, selectedPrediction:null, rawDetectorKey:null, lastPredictions:[], candidates:[], recognition:{kind:'idle',reason:'',detectorScore:null,verifierScore:null,verifierLabel:'',family:null},
    frozen:false, freezeReason:'', detailsOpen:false, sheetSnap:'compact', sheetDrag:null, sentenceSwipe:null, actionIndex:0, quizRevealed:false, currentCropHash:null, corrections:readJson('mn-corrections',[]), progress:readJson('mn-v05-progress',readJson('mn-v04-progress',{})), history:readJson('mn-v05-history',[]),
    focus:{nx:.5,ny:.45,phase:'observing',stable:0,moving:0,prevPixels:null,lastHash:null,trackingHash:null,loopTimer:null,lastAnalysisAt:0,lastMotion:1,lastSharpness:0},
    revealPhase:0, revealTimer:null, analysisToken:0,
    telemetry:{startedAt:Date.now(),focusSamples:0,heavyTotal:0,heavyTimes:[],avgHeavyMs:0,lastHeavyMs:0,frozenMs:0,frozenSince:0,uiActions:0}, tutorial:{active:false,step:0,pending:!localStorage.getItem('mn-v06-tutorial')}, annotationTimer:null, toastTimer:null
  };

  init();

  function init(){
    restoreControls(); bindEvents(); renderVocabulary(els.vocabList,'',selectManual); renderVocabulary(els.correctionList,'',applyCorrection); updateDemoButtons(); updateStudyButton(); updateMemoryControls(); updateTelemetry();
    applyUiPreferences();
    if('serviceWorker' in navigator) window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
    loadDetector();
    setInterval(updateTelemetry,1200);
  }

  function bindEvents(){
    els.start.addEventListener('click',startCamera); els.flip.addEventListener('click',flipCamera); els.settings.addEventListener('click',()=>safeShowModal(els.settingsDialog)); els.study.addEventListener('click',()=>safeShowModal(els.studyDialog)); els.scan.addEventListener('click',()=>requestAnalysis(true)); els.unknownCorrect.addEventListener('click',openCorrection);
    els.stage.addEventListener('pointerup',handleStageTap);
    bindSheetGestures(); bindSentenceSwipe();
    els.expandLesson.addEventListener('click',()=>{if(state.sheetDrag?.moved)return;setSheetSnap(window.MiraInteraction.nextSnap(state.sheetSnap,state.sheetSnap==='full'?-1:1),true)}); els.breakdownToggle.addEventListener('click',()=>{togglePanel(els.breakdownPanel);firstTip('breakdown','Toque em um bloco da frase para entender sua função.')}); els.sayToggle.addEventListener('click',()=>togglePanel(els.sayPanel));
    els.intentGrid.addEventListener('click',e=>{const b=e.target.closest('[data-intent]');if(b)showIntent(b.dataset.intent)});
    els.speakWord.addEventListener('click',()=>{const i=currentItem();if(i)speak(i.jp)}); els.speakSentence.addEventListener('click',()=>{const s=currentSentence();if(s)speak(s.jp)});
    els.know.addEventListener('click',()=>{adjustMastery(1);firstTip('know','O Mira vai reduzir as ajudas desta palavra conforme ela ficar familiar.')}); els.review.addEventListener('click',()=>adjustMastery(-1)); els.nextAction.addEventListener('click',()=>changeSentence(1)); els.primaryFlowAction.addEventListener('click',()=>state.frozen?resumeLive():setFrozen(true,'manual')); els.moreActions.addEventListener('click',toggleSecondaryActions);
    els.confirm.addEventListener('click',confirmSelection); els.correct.addEventListener('click',openCorrection); els.learnThis.addEventListener('click',openCorrection); els.cancelCorrection.addEventListener('click',()=>{});
    els.vocabBtn.addEventListener('click',()=>{safeClose(els.studyDialog);setTimeout(()=>safeShowModal(els.vocabDialog),0)}); els.historyBtn.addEventListener('click',()=>{safeClose(els.studyDialog);renderHistory();setTimeout(()=>safeShowModal(els.historyDialog),0)}); els.vocabSearch.addEventListener('input',()=>renderVocabulary(els.vocabList,els.vocabSearch.value,selectManual)); els.correctionSearch.addEventListener('input',()=>renderVocabulary(els.correctionList,els.correctionSearch.value,applyCorrection));
    document.querySelectorAll('.mode-btn[data-mode]').forEach(b=>b.addEventListener('click',()=>{setMode(b.dataset.mode);safeClose(els.studyDialog)}));
    els.demoControl.querySelectorAll('[data-demo]').forEach(b=>b.addEventListener('click',()=>{state.demonstrative=b.dataset.demo;localStorage.setItem('mn-demo',state.demonstrative);updateDemoButtons();renderLesson()}));
    els.performanceMode.addEventListener('change',async()=>{state.performanceMode=els.performanceMode.value;localStorage.setItem('mn-performance',state.performanceMode);if(state.cameraStarted){await openCamera(state.facingMode);resetObservation('Perfil atualizado')}showToast(`Perfil ${profile().label}.`)});
    els.immersion.addEventListener('change',()=>{state.immersionSetting=els.immersion.value;localStorage.setItem('mn-immersion',state.immersionSetting);renderLesson()});
    els.confidence.addEventListener('input',()=>{state.minScore=Number(els.confidence.value);els.confidenceValue.value=`${Math.round(state.minScore*100)}%`;localStorage.setItem('mn-score',String(state.minScore))});
    els.deepVision.addEventListener('change',()=>{state.deepVisionEnabled=els.deepVision.checked;localStorage.setItem('mn-deep-vision',state.deepVisionEnabled?'1':'0')});
    els.autoFreeze.addEventListener('change',()=>{state.autoFreezeEnabled=els.autoFreeze.checked;localStorage.setItem('mn-v05-autofreeze',state.autoFreezeEnabled?'1':'0')});
    els.stickyStrength.addEventListener('change',()=>{state.stickyStrength=els.stickyStrength.value;localStorage.setItem('mn-v05-sticky',state.stickyStrength)});
    els.showBoxes.addEventListener('change',()=>{state.showBoxes=els.showBoxes.checked;localStorage.setItem('mn-boxes',state.showBoxes?'1':'0');renderBoxes()});
    els.diagnostics.addEventListener('change',()=>{state.diagnostics=els.diagnostics.checked;localStorage.setItem('mn-diagnostics',state.diagnostics?'1':'0');updateTelemetry();renderRecognitionState()});
    els.fontSize.addEventListener('change',()=>{state.fontSize=els.fontSize.value;localStorage.setItem('mn-v06-font',state.fontSize);applyUiPreferences()});
    els.haptics.addEventListener('change',()=>{state.hapticsEnabled=els.haptics.checked;localStorage.setItem('mn-v06-haptics',state.hapticsEnabled?'1':'0')});
    els.clearCorrections.addEventListener('click',()=>{state.corrections=[];localStorage.removeItem('mn-corrections');updateMemoryControls();showToast('Correções visuais apagadas.')});
    els.resetProgress.addEventListener('click',()=>{state.progress={};localStorage.removeItem('mn-v05-progress');localStorage.removeItem('mn-v04-progress');renderLesson();showToast('Progresso por palavra redefinido.')});
    els.replayTutorial.addEventListener('click',()=>{safeClose(els.settingsDialog);startTutorial(true)});
    els.tutorialNext.addEventListener('click',()=>advanceTutorial()); els.tutorialSkip.addEventListener('click',finishTutorial);
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
    try{await openCamera(state.facingMode);state.cameraStarted=true;els.start.classList.add('hidden');resetObservation('Mire em algo');startFocusLoop();if(state.tutorial.pending)startTutorial(false)}catch(e){console.error(e);els.start.disabled=false;setStatus(e?.name==='NotAllowedError'?'Permissão da câmera negada':'Não foi possível abrir a câmera');showToast('Verifique a permissão da câmera.',4200)}
  }

  async function openCamera(mode){
    if(state.frozen)setFrozen(false,'camera');els.stage.classList.remove('frozen');els.freezeCanvas.classList.add('hidden');els.freezeBanner.classList.add('hidden');
    stopStreamOnly();const p=profile();state.stream=await navigator.mediaDevices.getUserMedia({audio:false,video:{facingMode:{ideal:mode},width:{ideal:p.width},height:{ideal:p.height},frameRate:{ideal:p.fps,max:p.maxFps}}});els.video.srcObject=state.stream;await els.video.play();await waitForVideo();const track=state.stream.getVideoTracks()[0];state.facingMode=track?.getSettings?.().facingMode||mode;els.stage.classList.toggle('camera-user',state.facingMode==='user');await tryEnableContinuousAutofocus(track);positionCrosshair()
  }
  async function flipCamera(){if(!state.cameraStarted)return;if(state.frozen)resumeLive();state.facingMode=state.facingMode==='environment'?'user':'environment';try{await openCamera(state.facingMode);resetObservation('Câmera trocada')}catch(e){showToast('Não consegui trocar de câmera.')}}
  async function tryEnableContinuousAutofocus(track){try{const caps=track?.getCapabilities?.();if(caps?.focusMode?.includes?.('continuous'))await track.applyConstraints({advanced:[{focusMode:'continuous'}]})}catch(_){/* recurso opcional do navegador/câmera */}}
  function waitForVideo(){if(els.video.videoWidth)return Promise.resolve();return new Promise(r=>{const done=()=>r();els.video.addEventListener('loadedmetadata',done,{once:true});setTimeout(done,1500)})}
  function stopStreamOnly(){if(state.stream){state.stream.getTracks().forEach(t=>t.stop());state.stream=null}}
  function stopCamera(){clearTimeout(state.focus.loopTimer);clearTimeout(state.revealTimer);if(state.telemetry.frozenSince){state.telemetry.frozenMs+=Date.now()-state.telemetry.frozenSince;state.telemetry.frozenSince=0}stopStreamOnly()}

  function profile(){const ps={eco:{label:'Econômico',width:480,height:360,fps:15,maxFps:18,sampleMs:320,required:2,motion:.040,change:.115,detectRatio:.54,deepRatio:.30},balanced:{label:'Equilibrado',width:640,height:480,fps:18,maxFps:22,sampleMs:230,required:2,motion:.035,change:.105,detectRatio:.62,deepRatio:.28},accuracy:{label:'Precisão',width:960,height:540,fps:22,maxFps:25,sampleMs:170,required:3,motion:.030,change:.095,detectRatio:.68,deepRatio:.25}};return ps[state.performanceMode]||ps.balanced}

  function startFocusLoop(){
    clearTimeout(state.focus.loopTimer);
    const tick=()=>{focusTick().finally(()=>{if(state.cameraStarted&&!state.frozen)state.focus.loopTimer=setTimeout(tick,profile().sampleMs);else state.focus.loopTimer=null})};
    tick();
  }

  async function focusTick(){
    if(!state.cameraStarted||document.hidden||els.video.readyState<2||!els.video.videoWidth)return;
    // Frozen means frozen: no canvas readback, no hash and no model inference.
    if(state.frozen){setPhase('frozen');return}
    const sample=sampleFocus();state.telemetry.focusSamples++;state.focus.lastMotion=sample.motion;state.focus.lastSharpness=sample.sharpness;
    if(state.focus.phase==='tracking'){
      const d=state.focus.trackingHash?hammingHex(sample.hash,state.focus.trackingHash):0;
      const verdict=window.MiraVisionEngine?.trackingChanged?.({motion:sample.motion,distance:d,strength:state.stickyStrength,streak:state.focus.moving})||{next:(sample.motion>profile().change||d>22)?state.focus.moving+1:Math.max(0,state.focus.moving-1),release:state.focus.moving>=3};
      state.focus.moving=verdict.next;
      if(verdict.release)resetObservation('O objeto saiu do foco · procurando novamente');
      return;
    }
    const stable=sample.motion<profile().motion&&sample.sharpness>.025;
    state.focus.stable=stable?state.focus.stable+1:0;
    setPhase(state.focus.stable?'focusing':'observing');
    if(state.focus.stable>=profile().required&&!state.analyzing&&!state.verifying&&Date.now()-state.focus.lastAnalysisAt>450)requestAnalysis(false);
  }

  function sampleFocus(){
    const box=focusBox(profile().deepRatio);drawVideoBoxToCanvas(box,els.focus);const ctx=els.focus.getContext('2d',{willReadFrequently:true});const {data,width,height}=ctx.getImageData(0,0,els.focus.width,els.focus.height);const pixels=[];let sharp=0,count=0;
    for(let y=0;y<height;y+=4){for(let x=0;x<width;x+=4){const i=(y*width+x)*4;const lum=(data[i]*.299+data[i+1]*.587+data[i+2]*.114)/255;pixels.push(lum);if(x+4<width){const j=(y*width+x+4)*4;const lum2=(data[j]*.299+data[j+1]*.587+data[j+2]*.114)/255;sharp+=Math.abs(lum-lum2);count++}}}
    let motion=1;if(state.focus.prevPixels&&state.focus.prevPixels.length===pixels.length){let sum=0;for(let i=0;i<pixels.length;i++)sum+=Math.abs(pixels[i]-state.focus.prevPixels[i]);motion=sum/pixels.length}state.focus.prevPixels=pixels;
    return{motion,sharpness:count?sharp/count:0,hash:computeDHash(els.focus)};
  }

  async function requestAnalysis(manual){
    if(state.frozen){if(manual)showToast('A imagem está congelada. Toque em Continuar para procurar outro objeto.');return}
    if(!state.cameraStarted){if(manual)showToast('Abra a câmera primeiro.');return}if(!state.detector){if(manual)showToast('Detector ainda está carregando.');return}if(state.analyzing||state.verifying)return;
    state.analyzing=true;state.focus.lastAnalysisAt=Date.now();setPhase('analyzing');setStatus('Analisando o foco…');const token=++state.analysisToken;const started=performance.now();recordHeavy();
    try{
      const roi=focusBox(profile().detectRatio);drawVideoBoxToCanvas(roi,els.detect);const local=await state.detector.detect(els.detect,12,state.minScore);if(token!==state.analysisToken)return;
      state.lastPredictions=local.filter(p=>JAPANESE_DB[p.class]).map(p=>mapPredictionFromCanvas(p,roi,els.detect));
      const target=chooseTarget(state.lastPredictions);
      if(target){
        const part=window.MiraVisionEngine?.inferPartCandidate?.({target,focusPoint:focusPointInVideo(),focusBox:focusBox(profile().deepRatio)})||null;
        await acceptDetectorTarget(target,token,part);
      }else await deepAnalyzeFocus(token,manual);
      renderBoxes();
    }catch(e){console.error(e);setStatus('Falha temporária na análise');if(manual)showToast('A análise falhou; tente novamente.')}finally{
      const ms=Math.max(1,performance.now()-started);state.telemetry.lastHeavyMs=ms;state.telemetry.avgHeavyMs=state.telemetry.avgHeavyMs?state.telemetry.avgHeavyMs*.78+ms*.22:ms;state.analyzing=false;if(state.frozen)setPhase('frozen');else if(state.selectedKey)setPhase('tracking');else setPhase('observing');updateTelemetry();
    }
  }

  async function acceptDetectorTarget(prediction,token,part=null){
    state.rawDetectorKey=prediction.class;state.selectedPrediction=prediction;const hash=computeCurrentFocusHash();state.currentCropHash=hash;
    const remembered=findCorrection(hash,prediction.class);if(remembered){state.candidates=[{key:remembered.key,score:1,sources:['memory']}];selectObject(remembered.key,{...prediction,class:remembered.key,_memory:true},{kind:'memory',reason:'Lembrança visual local aplicada.',detectorScore:prediction.score});return}

    const high=window.MiraRecognitionPolicy?.isHighConfusion?.(prediction.class)||window.MiraVisionEngine?.HIGH_RISK?.has?.(prediction.class);
    let mapped=[];let skinRatio=0;let verifierLabel='';
    const preliminary=rankVision(prediction,[],prediction.bbox,part,0);
    const preliminaryDecision=window.MiraVisionEngine?.decide?.(preliminary)||{kind:'tentative',top:preliminary[0]};
    const needsVerify=state.deepVisionEnabled&&(high||prediction.score<.84||preliminaryDecision.kind!=='stable'||prediction.class==='person');

    if(needsVerify){
      state.verifying=true;setStatus('Conferindo forma e categoria…');
      try{
        const verifier=await ensureVerifier();if(token!==state.analysisToken)return;
        if(verifier){
          const sourceBox=prediction.class==='person'?focusBox(.30):prediction.bbox;const snapshot=cropFromBbox(sourceBox,224);skinRatio=estimateSkinRatio(snapshot);recordHeavy();const classes=await verifier.classify(snapshot,10);if(token!==state.analysisToken)return;mapped=mappedCandidates(classes);verifierLabel=mapped[0]?.className||classes[0]?.className||'';
        }
      }finally{state.verifying=false}
    }

    const ranked=rankVision(prediction,mapped,prediction.bbox,part,skinRatio);state.candidates=ranked;
    const decision=window.MiraVisionEngine?.decide?.(ranked)||{kind:ranked.length?'tentative':'unknown',top:ranked[0]};
    if(decision.kind==='unknown'||!decision.top){showUnknownDecision(ranked,'Os sinais não concordaram o suficiente para ensinar uma palavra como certa.');return}
    const top=decision.top;const outPrediction={...prediction,class:top.key,bbox:(part&&top.key===part.key)?focusBox(.18):prediction.bbox,_broad:true};
    const reason=part&&top.key===part.key?part.reason
      :decision.kind==='stable'?(top.key===prediction.class?'Forma, detector e contexto são coerentes.':'A verificação em camadas favoreceu outra identificação.')
      :`Hipótese: ${JAPANESE_DB[top.key]?.pt||top.key}. Escolha um candidato ou corrija.`;
    selectObject(top.key,outPrediction,{kind:decision.kind,reason,detectorScore:prediction.score,verifierScore:top.verifierScore||mapped[0]?.probability||null,verifierLabel,family:window.MiraVisionEngine?.familyOf?.(top.key)||null});
  }

  async function deepAnalyzeFocus(token,manual){
    if(!state.deepVisionEnabled){showEmptyState('Ainda não reconheci','Use o vocabulário manual para ensinar este objeto.');return}
    const verifier=await ensureVerifier();if(token!==state.analysisToken||!verifier){showEmptyState('Ainda não reconheci','A visão detalhada não ficou disponível. Use o vocabulário manual.');return}
    const box=focusBox(profile().deepRatio);const snapshot=cropFromBbox(box,224);state.currentCropHash=computeDHash(snapshot);const mem=findCorrection(state.currentCropHash,'__focus__');
    if(mem){state.candidates=[{key:mem.key,score:1,sources:['memory']}];selectObject(mem.key,{class:mem.key,score:1,bbox:box,_memory:true},{kind:'memory',reason:'Lembrança visual local aplicada.'});return}
    recordHeavy();const classes=await verifier.classify(snapshot,12);if(token!==state.analysisToken)return;
    const mapped=mappedCandidates(classes);const skinRatio=estimateSkinRatio(snapshot);const fg=estimateForegroundBox(snapshot);const shapeBox=mapCanvasBoxToVideo(fg,box,snapshot.width,snapshot.height);
    // A leading ImageNet label is treated only as a hint. Geometry and other
    // mapped alternatives still have to agree before a stable answer appears.
    const hint=mapped[0]?{key:mapped[0].key,score:clamp(mapped[0].probability*2.6,.12,.72)}:null;
    const ranked=rankVision(hint,mapped,shapeBox,null,skinRatio);state.candidates=ranked;
    const decision=window.MiraVisionEngine?.decide?.(ranked)||{kind:ranked.length?'tentative':'unknown',top:ranked[0]};
    if(decision.kind==='unknown'||!decision.top){showUnknownDecision(ranked,'Não encontrei evidência suficiente. Aproximar-se ou corrigir é melhor do que ensinar um nome errado.');if(manual)showToast('Sem confiança suficiente; prefiro não adivinhar.');return}
    const top=decision.top;const reason=decision.kind==='stable'?'A análise focal combinou classe e forma com boa margem.':`Talvez seja ${JAPANESE_DB[top.key]?.pt||top.key}; confirme antes de memorizar.`;
    selectObject(top.key,{class:top.key,score:top.score,bbox:shapeBox,_deep:true},{kind:decision.kind==='stable'?'deep':'tentative',reason,verifierScore:top.verifierScore||mapped[0]?.probability||null,verifierLabel:mapped[0]?.className||'',family:window.MiraVisionEngine?.familyOf?.(top.key)||null});
  }

  function rankVision(detectorPrediction,mapped,bbox,part,skinRatio){
    const detector=detectorPrediction?.key?detectorPrediction:(detectorPrediction?.class?{key:detectorPrediction.class,score:detectorPrediction.score}:null);
    const ranked=window.MiraVisionEngine?.rankCandidates?.({detector,verifier:mapped||[],bbox,frameWidth:els.video.videoWidth||1,frameHeight:els.video.videoHeight||1,part,skinRatio})||[];
    return ranked.filter(c=>JAPANESE_DB[c.key]);
  }
  function mappedCandidates(classes){
    const best=new Map();(classes||[]).forEach((r,rank)=>{const key=mapVerifierLabel(r.className);if(!key||!JAPANESE_DB[key])return;const old=best.get(key);if(!old||r.probability>old.probability)best.set(key,{...r,rank,key})});return[...best.values()].sort((a,b)=>b.probability-a.probability).slice(0,8);
  }
  function bestMapped(classes){return mappedCandidates(classes)[0]||null}
  function mapVerifierLabel(label){for(const [rx,key] of VERIFIER_RULES)if(rx.test(label))return key;return null}

  function estimateSkinRatio(canvas){
    try{const ctx=canvas.getContext('2d',{willReadFrequently:true});const d=ctx.getImageData(0,0,canvas.width,canvas.height).data;let skin=0,total=0;for(let i=0;i<d.length;i+=4*6){const r=d[i],g=d[i+1],b=d[i+2];const mx=Math.max(r,g,b),mn=Math.min(r,g,b);const rgb=r>80&&g>30&&b>15&&(mx-mn)>15&&r>g&&r>b&&Math.abs(r-g)>10;const cb=128-.168736*r-.331264*g+.5*b,cr=128+.5*r-.418688*g-.081312*b;const ycc=cb>75&&cb<135&&cr>130&&cr<180;if(rgb&&ycc)skin++;total++}return total?skin/total:0}catch(_){return 0}
  }
  function estimateForegroundBox(canvas){
    try{const ctx=canvas.getContext('2d',{willReadFrequently:true}),w=canvas.width,h=canvas.height,d=ctx.getImageData(0,0,w,h).data;let br=0,bg=0,bb=0,n=0;const sample=(x,y)=>{const i=(y*w+x)*4;br+=d[i];bg+=d[i+1];bb+=d[i+2];n++};for(let x=0;x<w;x+=8){sample(x,2);sample(x,h-3)}for(let y=8;y<h-8;y+=8){sample(2,y);sample(w-3,y)}br/=n;bg/=n;bb/=n;let minX=w,minY=h,maxX=0,maxY=0,hits=0;for(let y=0;y<h;y+=3)for(let x=0;x<w;x+=3){const i=(y*w+x)*4;const dr=d[i]-br,dg=d[i+1]-bg,db=d[i+2]-bb;const dist=Math.sqrt(dr*dr+dg*dg+db*db)/441.7;if(dist>.16){minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);hits++}}if(hits<80||maxX<=minX||maxY<=minY)return[0,0,w,h];const pad=8;return[Math.max(0,minX-pad),Math.max(0,minY-pad),Math.min(w,maxX-minX+pad*2),Math.min(h,maxY-minY+pad*2)]}catch(_){return[0,0,canvas.width,canvas.height]}
  }
  function mapCanvasBoxToVideo(local,parent,cw,ch){const [px,py,pw,ph]=parent,[x,y,w,h]=local;return[px+x*pw/cw,py+y*ph/ch,w*pw/cw,h*ph/ch]}
  function showUnknownDecision(ranked,extra){
    state.candidates=ranked||[];clearSelection(false);const family=window.MiraVisionEngine?.familyConsensus?.(ranked||[]);const familyText=family?` Parece ser ${family.label.pt}, mas não há evidência para uma palavra específica.`:'';showEmptyState('Não tenho certeza',`${extra}${familyText}`);setStatus(family?`Categoria provável: ${family.label.pt}`:'Sem evidência suficiente · prefiro não adivinhar');
  }

  function selectObject(key,prediction,recognition){
    if(!JAPANESE_DB[key])return;const changed=state.selectedKey!==key;state.selectedKey=key;state.selectedPrediction=prediction||state.selectedPrediction;state.recognition={detectorScore:null,verifierScore:null,verifierLabel:'',family:null,...recognition};state.focus.trackingHash=(state.cameraStarted&&els.video.videoWidth)?computeCurrentFocusHash():null;state.focus.moving=0;setPhase('tracking');hideEmpty();els.lessonCard.classList.remove('hidden');if(changed){registerEncounter(key);registerHistory(key);state.actionIndex=0;state.revealPhase=0;setSheetSnap('compact',false);clearTimeout(state.revealTimer);state.revealTimer=setTimeout(()=>{state.revealPhase=1;renderLesson()},650)}renderLesson();setStatus(state.recognition.kind==='tentative'?'Provavelmente · confirme':'Reconhecido');haptic(14);if(state.autoFreezeEnabled&&state.cameraStarted&&!state.frozen)setFrozen(true,'recognition');if(state.tutorial.active&&state.tutorial.step===0)showTutorialStep(1);
  }

  function clearSelection(clearCandidates=true){state.selectedKey=null;state.selectedPrediction=null;state.rawDetectorKey=null;state.recognition={kind:'idle',reason:'',detectorScore:null,verifierScore:null,verifierLabel:'',family:null};if(clearCandidates)state.candidates=[];state.focus.trackingHash=null;clearTimeout(state.revealTimer);els.lessonCard.classList.add('hidden');renderBoxes()}
  function resetObservation(status='Mire em algo'){clearSelection();state.focus.phase='observing';state.focus.stable=0;state.focus.moving=0;state.focus.prevPixels=null;state.focus.lastHash=null;state.analysisToken++;setPhase('observing');showEmptyState('Mire em algo','Quando a região estabilizar, eu analiso uma vez e paro.');setStatus(status)}
  function setPhase(phase){state.focus.phase=phase;els.holdRing.className=`hold-ring ${phase}`}

  function currentItem(){return state.selectedKey?JAPANESE_DB[state.selectedKey]:null}
  function currentProgress(){return state.selectedKey?(state.progress[state.selectedKey]||{seen:0,mastery:0,lastSeen:0}):{seen:0,mastery:0}}
  function currentSceneSentence(){
    if(!state.selectedPrediction||!window.MiraRecognitionPolicy?.inferSceneRelation)return null;const rel=window.MiraRecognitionPolicy.inferSceneRelation(state.selectedPrediction,state.lastPredictions.filter(p=>p!==state.selectedPrediction));if(!rel)return null;const a=currentItem(),b=JAPANESE_DB[rel.other.class];if(!a||!b)return null;
    const forms={on:['上','ue','em cima de'],above:['上','ue','acima de'],below:['下','shita','embaixo de'],inside:['中','naka','dentro de'],left:['左','hidari','à esquerda de'],right:['右','migi','à direita de']};const f=forms[rel.relation];if(!f)return null;const exist=a.animate?{jp:'います',romaji:'imasu'}:{jp:'あります',romaji:'arimasu'};return{jp:`${a.jp}は${b.jp}の${f[0]}に${exist.jp}。`,romaji:`${cap(a.romaji)} wa ${b.romaji} no ${f[1]} ni ${exist.romaji}.`,pt:`${cap(a.pt)} está ${f[2]} ${b.pt}.`,kind:'scene'}
  }
  function currentSentence(){const item=currentItem();if(!item)return null;const p=currentProgress();const scene=currentSceneSentence();const mode=state.mode==='immersion'?'daily':state.mode;if(state.actionIndex>0&&!['location','scene','quiz'].includes(mode)){const actions=MiraLearning.actionPool(state.selectedKey,item);return {...actions[(state.actionIndex-1)%actions.length],kind:'action'}}return MiraLearning.chooseMoment({key:state.selectedKey,item,mode,level:p.mastery,actionIndex:state.actionIndex,demo:state.demonstrative,scene})}

  function renderLesson(){
    const item=currentItem();if(!item)return;const p=currentProgress();const help=MiraLearning.helpLevel(p,state.immersionSetting);const sentence=currentSentence();const quiz=state.mode==='quiz'&&!state.quizRevealed;
    els.jpWord.textContent=quiz?'何？':item.jp;els.kana.textContent=quiz?'なに':item.kana;els.romaji.textContent=quiz?'nani':item.romaji;els.translationInline.textContent=help===1&&!quiz?item.pt:'';
    els.kana.classList.toggle('hidden',state.mode==='immersion'&&p.mastery>=3);els.romaji.classList.toggle('hidden',help>=3||state.mode==='immersion');els.translationInline.classList.toggle('hidden',help>=2||state.mode==='immersion'||quiz);
    const shownSentence=quiz?{jp:'これは何ですか？',romaji:'Kore wa nan desu ka?',pt:'O que é isto?'}:sentence;els.sentenceJp.textContent=shownSentence?.jp||'';els.sentenceRomaji.textContent=shownSentence?.romaji||'';els.sentencePt.textContent=quiz?`Resposta: ${item.jp} (${item.pt})`:shownSentence?.pt||'';els.sentenceRomaji.classList.toggle('hidden',help>=3||state.mode==='immersion');els.sentenceCompact.classList.toggle('concealed',state.revealPhase===0&&state.mode!=='quiz');
    renderRecognitionState();renderBreakdown(shownSentence,item);renderProgress();renderScene();renderCandidateStrip();renderPrimaryFlowAction();els.tentativePanel.classList.toggle('hidden',state.recognition.kind!=='tentative');els.tentativeReason.textContent=state.recognition.reason||'Confirme ou corrija.'
  }
  function renderRecognitionState(){const r=state.recognition;const labels={stable:'Reconhecido',deep:'Visão detalhada',memory:'Lembrança local',tentative:'Talvez seja'};let t=labels[r.kind]||'Reconhecido';if(state.diagnostics){const bits=[];if(Number.isFinite(r.detectorScore))bits.push(`D ${Math.round(r.detectorScore*100)}%`);if(Number.isFinite(r.verifierScore))bits.push(`V ${Math.round(r.verifierScore*100)}%`);if(bits.length)t+=` · ${bits.join(' / ')}`}els.recognitionState.textContent=t;els.recognitionState.classList.toggle('tentative',r.kind==='tentative');els.lessonCard.classList.toggle('has-tentative',r.kind==='tentative')}
  function renderBreakdown(sentence,item){els.breakdownTokens.replaceChildren();if(!sentence)return;const tokens=MiraLearning.tokenize(sentence,item);tokens.forEach(t=>{const b=document.createElement('button');b.type='button';b.className='token-chip';b.innerHTML='<strong></strong><small></small>';b.querySelector('strong').textContent=t.text;b.querySelector('small').textContent=t.reading||t.meaning;b.addEventListener('click',()=>{els.breakdownTokens.querySelectorAll('.token-chip').forEach(x=>x.classList.remove('active'));b.classList.add('active');els.tokenExplain.textContent=`${t.meaning}${t.role?` — ${t.role}`:''}`});els.breakdownTokens.appendChild(b)});els.patternBox.textContent=`Padrão: ${MiraLearning.patternFor(tokens)}`}
  function renderProgress(){const p=currentProgress();els.progressHint.textContent=`Esta palavra: ${p.seen} encontro(s) · domínio ${p.mastery}/5. ${p.mastery<2?'Ainda mantenho mais ajuda.':p.mastery<4?'Português começa a desaparecer.':'Japonês em primeiro plano.'}`}
  function renderScene(){const s=currentSceneSentence();els.sceneLine.classList.toggle('hidden',!s);if(s)els.sceneLine.textContent=`🧭 Contexto: ${s.jp} · ${s.pt}`}

  function registerEncounter(key){const now=Date.now();const p=state.progress[key]||{seen:0,mastery:0,lastSeen:0};if(now-p.lastSeen>45000)p.seen++;p.lastSeen=now;state.progress[key]=p;saveProgress()}
  function adjustMastery(delta){if(!state.selectedKey)return;const p=currentProgress();p.mastery=clamp((p.mastery||0)+delta,0,5);p.lastSeen=Date.now();state.progress[state.selectedKey]=p;saveProgress();state.quizRevealed=true;renderLesson();showToast(delta>0?`Domínio de ${currentItem().jp}: ${p.mastery}/5`:'Ajuda aumentada para esta palavra.')}
  function saveProgress(){localStorage.setItem('mn-v05-progress',JSON.stringify(state.progress))}

  function showIntent(intent){const item=currentItem();if(!item)return;const s=MiraLearning.intentSentence(intent,item,state.demonstrative);els.intentAnswer.classList.remove('hidden');els.intentAnswer.innerHTML='<strong></strong><span class="r"></span><span class="p"></span>';els.intentAnswer.querySelector('strong').textContent=s.jp;els.intentAnswer.querySelector('.r').textContent=s.romaji;els.intentAnswer.querySelector('.p').textContent=s.pt;speak(s.jp)}
  function togglePanel(panel){panel.classList.toggle('hidden')}

  function setSheetSnap(snap,user=false){
    if(!window.MiraInteraction||!window.MiraInteraction.ORDER.includes(snap))snap='compact';
    state.sheetSnap=snap;state.detailsOpen=snap!=='compact';state.telemetry.uiActions+=user?1:0;
    els.lessonCard.classList.remove('snap-compact','snap-medium','snap-full','expanded','dragging');
    els.lessonCard.classList.add(`snap-${snap}`);if(state.detailsOpen)els.lessonCard.classList.add('expanded');
    els.lessonCard.style.maxHeight='';els.lessonDetails.setAttribute('aria-hidden',String(!state.detailsOpen));els.expandLesson.setAttribute('aria-expanded',String(state.detailsOpen));
    if(snap==='compact'){els.lessonCard.scrollTop=0;els.secondaryActions.classList.add('hidden');els.moreActions.setAttribute('aria-expanded','false')}
    if(user&&state.tutorial.active&&state.tutorial.step===1&&snap!=='compact')showTutorialStep(2);
  }
  function bindSheetGestures(){
    const handle=els.expandLesson;
    handle.addEventListener('pointerdown',e=>{if(els.lessonCard.classList.contains('hidden'))return;const now=performance.now?.()||Date.now();state.sheetDrag={startY:e.clientY,lastY:e.clientY,startAt:now,lastAt:now,startSnap:state.sheetSnap,moved:false};els.lessonCard.classList.add('dragging');try{handle.setPointerCapture?.(e.pointerId)}catch(_){}});
    handle.addEventListener('pointermove',e=>{const d=state.sheetDrag;if(!d)return;const now=performance.now?.()||Date.now(),dy=e.clientY-d.startY;if(Math.abs(dy)>6)d.moved=true;d.lastY=e.clientY;d.lastAt=now;const vh=els.stage.clientHeight||window.innerHeight||800;const start=window.MiraInteraction.snapHeight(d.startSnap,vh),min=window.MiraInteraction.snapHeight('compact',vh),max=window.MiraInteraction.snapHeight('full',vh);els.lessonCard.style.maxHeight=`${clamp(start-dy,min,max)}px`;if(d.moved)e.preventDefault?.()});
    const end=e=>{const d=state.sheetDrag;if(!d)return;const now=performance.now?.()||Date.now(),dy=(e.clientY??d.lastY)-d.startY,dt=Math.max(16,now-d.startAt),velocity=dy/dt,vh=els.stage.clientHeight||window.innerHeight||800;const target=d.moved?window.MiraInteraction.resolveSnap({current:d.startSnap,deltaY:dy,velocityY:velocity,viewport:vh}):d.startSnap;const moved=d.moved;setSheetSnap(target,moved);state.sheetDrag={moved};setTimeout(()=>{if(state.sheetDrag?.moved===moved)state.sheetDrag=null},0)};
    handle.addEventListener('pointerup',end);handle.addEventListener('pointercancel',end);
  }
  function bindSentenceSwipe(){
    els.sentenceCompact.addEventListener('pointerdown',e=>{state.sentenceSwipe={x:e.clientX,y:e.clientY,t:performance.now?.()||Date.now()};try{els.sentenceCompact.setPointerCapture?.(e.pointerId)}catch(_){}});
    els.sentenceCompact.addEventListener('pointerup',e=>{const a=state.sentenceSwipe;if(!a)return;const gesture=window.MiraInteraction.classifySwipe({dx:e.clientX-a.x,dy:e.clientY-a.y,dt:(performance.now?.()||Date.now())-a.t});state.sentenceSwipe=null;if(gesture){changeSentence(gesture==='next'?1:-1);haptic(8);if(state.tutorial.active&&state.tutorial.step===2)showTutorialStep(3)}});
  }
  function changeSentence(delta){state.actionIndex=Math.max(0,state.actionIndex+delta);state.quizRevealed=false;renderLesson();state.telemetry.uiActions++;}
  function renderPrimaryFlowAction(){
    const visible=!!state.selectedKey&&state.recognition.kind!=='tentative';els.primaryFlowAction.classList.toggle('hidden',!visible);if(!visible)return;
    els.primaryFlowAction.textContent=state.frozen?'▶ Continuar':'❄ Congelar';els.primaryFlowAction.setAttribute('aria-label',state.frozen?'Continuar câmera':'Congelar imagem');
  }
  function toggleSecondaryActions(){const open=els.secondaryActions.classList.toggle('hidden')===false;els.moreActions.setAttribute('aria-expanded',String(open));if(open&&state.sheetSnap==='compact')setSheetSnap('medium',true)}
  function toggleFrozenAnnotations(){if(!state.frozen)return;const hidden=els.stage.classList.toggle('annotations-hidden');clearTimeout(state.annotationTimer);if(!hidden)state.annotationTimer=setTimeout(()=>els.stage.classList.add('annotations-hidden'),1800)}
  function haptic(pattern){if(!state.hapticsEnabled||typeof navigator.vibrate!=='function')return;try{navigator.vibrate(pattern)}catch(_){}}
  function applyUiPreferences(){if(!['small','medium','large'].includes(state.fontSize))state.fontSize='medium';if(document.documentElement?.dataset)document.documentElement.dataset.fontSize=state.fontSize}
  function firstTip(key,msg){const k=`mn-v06-tip-${key}`;if(localStorage.getItem(k))return;localStorage.setItem(k,'1');showToast(msg,3600)}
  function startTutorial(force=false){state.tutorial.active=true;state.tutorial.pending=false;state.tutorial.step=0;if(force)localStorage.removeItem('mn-v06-tutorial');showTutorialStep(0)}
  function showTutorialStep(step){
    state.tutorial.active=true;state.tutorial.step=clamp(step,0,3);const steps=[
      ['1/4 · Mire','Mire em um objeto. Quando houver uma leitura, o Mira congela a imagem para você estudar sem pressa.'],
      ['2/4 · Puxe','↑ Arraste a barra do cartão para cima. Ela encaixa em três alturas; um toque também funciona.'],
      ['3/4 · Deslize','← Deslize a frase para os lados para ver outra frase. O botão em ⋯ continua disponível.'],
      ['4/4 · Corrija','Se o Mira errar, abra ⋯ Mais → Corrigir objeto. A imagem continua congelada enquanto você procura.']
    ];const [title,text]=steps[state.tutorial.step];els.tutorialTitle.textContent=title;els.tutorialText.textContent=text;els.tutorialNext.textContent=state.tutorial.step===3?'Concluir':'Próxima';els.tutorialCoach.classList.remove('hidden')
  }
  function advanceTutorial(){if(!state.tutorial.active)return;if(state.tutorial.step>=3){finishTutorial();return}showTutorialStep(state.tutorial.step+1)}
  function finishTutorial(){state.tutorial.active=false;state.tutorial.pending=false;els.tutorialCoach.classList.add('hidden');localStorage.setItem('mn-v06-tutorial','done')}
  function toggleDetails(){setSheetSnap(state.sheetSnap==='compact'?'medium':'compact',true)}
  function captureFreezeFrame(){
    if(!state.cameraStarted||!els.video.videoWidth)return false;
    const cw=Math.max(1,Math.round(els.stage.clientWidth)),ch=Math.max(1,Math.round(els.stage.clientHeight));
    const scale=Math.min(2,window.devicePixelRatio||1);els.freezeCanvas.width=Math.round(cw*scale);els.freezeCanvas.height=Math.round(ch*scale);
    const ctx=els.freezeCanvas.getContext('2d');ctx.setTransform(scale,0,0,scale,0,0);ctx.clearRect(0,0,cw,ch);
    const m=videoCoverMetrics();ctx.drawImage(els.video,m.ox,m.oy,m.vw*m.scale,m.vh*m.scale);return true;
  }
  function setFrozen(v,reason='manual'){
    if(v===state.frozen){renderLesson();return}
    if(v){
      if(!captureFreezeFrame()&&state.cameraStarted)return;
      state.frozen=true;state.freezeReason=reason;state.telemetry.frozenSince=Date.now();state.analysisToken++;clearTimeout(state.focus.loopTimer);state.focus.loopTimer=null;els.stage.classList.add('frozen');els.stage.classList.remove('annotations-hidden');els.freezeCanvas.classList.remove('hidden');els.freezeBanner.classList.remove('hidden');setPhase('frozen');setStatus('Congelado');haptic([10,35,10]);clearTimeout(state.annotationTimer);state.annotationTimer=setTimeout(()=>els.stage.classList.add('annotations-hidden'),700);
      try{els.video.pause()}catch(_){/* opcional */}
      if(reason==='manual')showToast('Imagem congelada.');
    }else{
      if(state.telemetry.frozenSince)state.telemetry.frozenMs+=Date.now()-state.telemetry.frozenSince;state.telemetry.frozenSince=0;state.frozen=false;state.freezeReason='';clearTimeout(state.annotationTimer);els.stage.classList.remove('frozen','annotations-hidden');els.freezeCanvas.classList.add('hidden');els.freezeBanner.classList.add('hidden');try{const p=els.video.play();if(p?.catch)p.catch(()=>{})}catch(_){/* ignore */}
      setPhase(state.selectedKey?'tracking':'observing');if(state.cameraStarted)startFocusLoop();
    }
    renderLesson();updateTelemetry();
  }
  function resumeLive(){
    if(state.frozen)setFrozen(false,'resume');setSheetSnap('compact',false);resetObservation('Mire no próximo objeto');
  }

  function confirmSelection(){if(!state.selectedKey)return;const saved=rememberCorrection(state.selectedKey);state.recognition.kind='stable';state.recognition.reason=saved?'Confirmado e lembrado localmente.':'Confirmado por você.';adjustMastery(1);renderLesson()}
  function openCorrection(){
    if(!state.selectedKey&&!state.cameraStarted)return;if(!state.frozen)setFrozen(true,'correction');els.correctionSearch.value='';renderCorrectionCandidates();renderVocabulary(els.correctionList,'',applyCorrection);safeShowModal(els.correctionDialog);setTimeout(()=>els.correctionSearch.focus(),80);
  }
  function applyCorrection(key){
    const item=JAPANESE_DB[key];if(!item)return;const box=state.selectedPrediction?.bbox||focusBox(profile().deepRatio);state.rawDetectorKey=state.rawDetectorKey||'__focus__';selectObject(key,{class:key,score:1,bbox:box,_manual:true},{kind:'stable',reason:'Corrigido por você.'});rememberCorrection(key);safeClose(els.correctionDialog);if(!state.frozen)setFrozen(true,'correction');adjustMastery(1);showToast(`Aprendido: ${item.jp}. A imagem continua congelada.`)
  }
  function renderCandidateStrip(){
    const list=(state.candidates||[]).filter(c=>c.key&&JAPANESE_DB[c.key]).slice(0,3);els.candidateStrip.replaceChildren();els.candidateStrip.classList.toggle('hidden',list.length<2||state.recognition.kind!=='tentative');
    for(const c of list){const b=document.createElement('button');b.type='button';b.innerHTML='<strong></strong><small></small>';b.querySelector('strong').textContent=JAPANESE_DB[c.key].jp;b.querySelector('small').textContent=JAPANESE_DB[c.key].pt;b.addEventListener('click',()=>chooseCandidate(c.key));els.candidateStrip.appendChild(b)}
  }
  function renderCorrectionCandidates(){
    const list=(state.candidates||[]).filter(c=>c.key&&JAPANESE_DB[c.key]).slice(0,4);els.correctionCandidateList.replaceChildren();els.correctionCandidates.classList.toggle('hidden',!list.length);
    for(const c of list){const b=document.createElement('button');b.type='button';b.innerHTML='<strong></strong><small></small>';b.querySelector('strong').textContent=JAPANESE_DB[c.key].jp;b.querySelector('small').textContent=JAPANESE_DB[c.key].pt;b.addEventListener('click',()=>applyCorrection(c.key));els.correctionCandidateList.appendChild(b)}
  }
  function chooseCandidate(key){
    if(!JAPANESE_DB[key])return;const box=state.selectedPrediction?.bbox||focusBox(profile().deepRatio);state.rawDetectorKey=state.rawDetectorKey||'__focus__';selectObject(key,{class:key,score:1,bbox:box,_candidate:true},{kind:'stable',reason:'Escolhido por você entre os candidatos.'});rememberCorrection(key);adjustMastery(1);showToast(`Confirmado: ${JAPANESE_DB[key].jp}`)
  }
  function registerHistory(key){
    const now=Date.now();state.history=state.history.filter(x=>x.key!==key);state.history.unshift({key,at:now});state.history=state.history.slice(0,10);localStorage.setItem('mn-v05-history',JSON.stringify(state.history));
  }
  function renderHistory(){
    els.historyList.replaceChildren();const valid=(state.history||[]).filter(x=>JAPANESE_DB[x.key]);if(!valid.length){const d=document.createElement('div');d.className='history-empty';d.textContent='Nenhum objeto visto ainda.';els.historyList.appendChild(d);return}
    for(const h of valid){const i=JAPANESE_DB[h.key],b=document.createElement('button');b.type='button';b.className='vocab-item';b.innerHTML='<span><span class="jp"></span><span class="sub"></span><span class="history-time"></span></span><span class="pt"></span>';b.querySelector('.jp').textContent=i.jp;b.querySelector('.sub').textContent=`${i.kana} · ${i.romaji}`;b.querySelector('.pt').textContent=i.pt;b.querySelector('.history-time').textContent=timeAgo(h.at);b.addEventListener('click',()=>{safeClose(els.historyDialog);state.rawDetectorKey='__history__';state.candidates=[{key:h.key,score:1}];selectObject(h.key,{class:h.key,score:1,bbox:focusBox(.32),_history:true},{kind:'stable',reason:'Reaberto do histórico.'});if(state.cameraStarted&&!state.frozen)setFrozen(true,'history')});els.historyList.appendChild(b)}
  }
  function timeAgo(ts){const m=Math.max(0,Math.round((Date.now()-ts)/60000));if(m<1)return'agora';if(m<60)return`há ${m} min`;const h=Math.round(m/60);return h<24?`há ${h} h`:`há ${Math.round(h/24)} d`}

  function rememberCorrection(key){const hash=state.currentCropHash||computeCurrentFocusHash();if(!hash)return false;const raw=state.rawDetectorKey||'__focus__';state.corrections=state.corrections.filter(c=>!(c.hash===hash&&c.raw===raw));state.corrections.unshift({hash,raw,key,at:Date.now()});state.corrections=state.corrections.slice(0,80);localStorage.setItem('mn-corrections',JSON.stringify(state.corrections));updateMemoryControls();return true}
  function findCorrection(hash,raw){if(!hash)return null;return state.corrections.map(c=>({...c,d:hammingHex(hash,c.hash)})).filter(c=>(c.raw===raw||c.raw==='__focus__'||raw==='__focus__')&&c.d<=8).sort((a,b)=>a.d-b.d)[0]||null}

  function selectManual(key){const item=JAPANESE_DB[key];if(!item)return;state.rawDetectorKey='__manual__';state.currentCropHash=null;state.candidates=[{key,score:1}];selectObject(key,{class:key,score:1,bbox:focusBox(.32),_manual:true},{kind:'stable',reason:'Escolhido no vocabulário.'});safeClose(els.vocabDialog);if(state.cameraStarted&&!state.frozen)setFrozen(true,'manual');showToast(`${item.jp} · imagem preservada`)}
  function renderVocabulary(container,query,onChoose){const q=normalize(query);const entries=Object.entries(JAPANESE_DB).filter(([k,i])=>!q||[k,i.jp,i.kana,i.romaji,i.pt,...(i.aliases||[])].some(v=>normalize(v).includes(q))).sort((a,b)=>a[1].pt.localeCompare(b[1].pt,'pt-BR'));container.replaceChildren();entries.forEach(([k,i])=>{const b=document.createElement('button');b.type='button';b.className='vocab-item';b.innerHTML='<span><span class="jp"></span><span class="sub"></span></span><span class="pt"></span>';b.querySelector('.jp').textContent=i.jp;b.querySelector('.sub').textContent=`${i.kana} · ${i.romaji}`;b.querySelector('.pt').textContent=i.pt;b.addEventListener('click',()=>onChoose(k));container.appendChild(b)})}

  function handleStageTap(e){if(!state.cameraStarted)return;if(e.target.closest('button,section.lesson-card,header,.study-pill,.load-chip,.freeze-banner'))return;if(state.frozen){toggleFrozenAnnotations();return}const r=els.stage.getBoundingClientRect();state.focus.nx=clamp((e.clientX-r.left)/r.width,.08,.92);state.focus.ny=clamp((e.clientY-r.top)/r.height,.16,.78);positionCrosshair();resetObservation('Ponto de foco alterado');showToast('Foco movido. Mantenha o objeto estável.')}
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

  function setMode(mode){state.mode=MODE_META[mode]?mode:'daily';localStorage.setItem('mn-v06-mode',state.mode);state.quizRevealed=false;updateStudyButton();renderLesson()}
  function updateStudyButton(){const m=MODE_META[state.mode]||MODE_META.daily;els.studyModeIcon.textContent=m.icon;els.studyModeLabel.textContent=m.label;document.querySelectorAll('.mode-btn[data-mode]').forEach(b=>b.classList.toggle('active',b.dataset.mode===state.mode))}
  function updateDemoButtons(){els.demoControl.querySelectorAll('[data-demo]').forEach(b=>b.classList.toggle('active',b.dataset.demo===state.demonstrative))}
  function restoreControls(){if(!['eco','balanced','accuracy'].includes(state.performanceMode))state.performanceMode='balanced';if(!['auto','1','2','3'].includes(state.immersionSetting))state.immersionSetting='auto';if(!['normal','strong'].includes(state.stickyStrength))state.stickyStrength='strong';els.performanceMode.value=state.performanceMode;els.immersion.value=state.immersionSetting;els.confidence.value=String(clamp(state.minScore,.35,.80));state.minScore=Number(els.confidence.value);els.confidenceValue.value=`${Math.round(state.minScore*100)}%`;els.deepVision.checked=state.deepVisionEnabled;els.autoFreeze.checked=state.autoFreezeEnabled;els.stickyStrength.value=state.stickyStrength;els.showBoxes.checked=state.showBoxes;els.diagnostics.checked=state.diagnostics;els.fontSize.value=state.fontSize;els.haptics.checked=state.hapticsEnabled;applyUiPreferences()}
  function updateMemoryControls(){els.correctionCount.textContent=String(state.corrections.length);els.clearCorrections.disabled=!state.corrections.length}

  function recordHeavy(){const now=Date.now();state.telemetry.heavyTotal++;state.telemetry.heavyTimes.push(now);state.telemetry.heavyTimes=state.telemetry.heavyTimes.filter(t=>now-t<60000)}
  function updateTelemetry(){const now=Date.now();state.telemetry.heavyTimes=state.telemetry.heavyTimes.filter(t=>now-t<60000);const perMin=state.telemetry.heavyTimes.length;const load=state.frozen?'pausada':perMin<=5?'baixa':perMin<=12?'moderada':'alta';const frozenMs=state.telemetry.frozenMs+(state.telemetry.frozenSince?now-state.telemetry.frozenSince:0);const activeMs=Math.max(1,now-state.telemetry.startedAt);const frozenPct=Math.round(clamp(frozenMs/activeMs,0,1)*100);els.loadText.textContent=load;els.loadChip.classList.toggle('hidden',!state.diagnostics);els.telemetryBox.innerHTML=`<strong>Telemetria local</strong><br>Estado: ${state.focus.phase} · inferências pesadas/min: ${perMin} · média: ${Math.round(state.telemetry.avgHeavyMs||0)} ms · tempo com IA pausada: ${frozenPct}%.<br><small>“Carga” é uma estimativa pela frequência de inferência; não mede a temperatura física do aparelho.</small>`}

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

  window.MiraDebug = { state, profile, selectObject, currentSentence, renderLesson, resetObservation, requestAnalysis, sampleFocus, computeDHash, hammingHex, setFrozen, resumeLive, renderHistory, mappedCandidates, estimateSkinRatio, estimateForegroundBox, setSheetSnap, changeSentence, startTutorial, advanceTutorial };
})();
