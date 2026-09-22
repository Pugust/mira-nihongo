'use strict';

(() => {
  const els = {
    stage: document.getElementById('cameraStage'),
    video: document.getElementById('camera'),
    crop: document.getElementById('cropCanvas'),
    boxes: document.getElementById('boxesLayer'),
    status: document.getElementById('statusText'),
    start: document.getElementById('startBtn'),
    flip: document.getElementById('flipCameraBtn'),
    settings: document.getElementById('settingsBtn'),
    settingsDialog: document.getElementById('settingsDialog'),
    study: document.getElementById('studyBtn'),
    studyDialog: document.getElementById('studyDialog'),
    studyModeIcon: document.getElementById('studyModeIcon'),
    studyModeLabel: document.getElementById('studyModeLabel'),
    vocabDialog: document.getElementById('vocabDialog'),
    correctionDialog: document.getElementById('correctionDialog'),
    correctionSuggestion: document.getElementById('correctionSuggestion'),
    correctionSearch: document.getElementById('correctionSearch'),
    correctionList: document.getElementById('correctionList'),
    cancelCorrection: document.getElementById('cancelCorrectionBtn'),
    onboarding: document.getElementById('onboardingDialog'),
    onboardingContinue: document.getElementById('onboardingContinue'),
    holdRing: document.getElementById('holdRing'),
    emptyHint: document.getElementById('emptyHint'),
    scan: document.getElementById('scanBtn'),
    lessonCard: document.getElementById('lessonCard'),
    expandLesson: document.getElementById('expandLessonBtn'),
    lessonDetails: document.getElementById('lessonDetails'),
    recognitionState: document.getElementById('recognitionState'),
    tentativePanel: document.getElementById('tentativePanel'),
    tentativeReason: document.getElementById('tentativeReason'),
    confirm: document.getElementById('confirmBtn'),
    correct: document.getElementById('correctBtn'),
    learnThis: document.getElementById('learnThisBtn'),
    progressHint: document.getElementById('progressHint'),
    jpWord: document.getElementById('jpWord'),
    kana: document.getElementById('kanaText'),
    romaji: document.getElementById('romajiText'),
    translation: document.getElementById('translationText'),
    sentenceJp: document.getElementById('sentenceJp'),
    sentenceRomaji: document.getElementById('sentenceRomaji'),
    sentencePt: document.getElementById('sentencePt'),
    quizPanel: document.getElementById('quizPanel'),
    quizQuestion: document.getElementById('quizQuestion'),
    reveal: document.getElementById('revealBtn'),
    speakWord: document.getElementById('speakWordBtn'),
    speakSentence: document.getElementById('speakSentenceBtn'),
    nextAction: document.getElementById('nextActionBtn'),
    freeze: document.getElementById('freezeBtn'),
    immersion: document.getElementById('immersionLevel'),
    confidence: document.getElementById('confidenceRange'),
    confidenceValue: document.getElementById('confidenceValue'),
    deepVision: document.getElementById('deepVisionToggle'),
    deepVisionStatus: document.getElementById('deepVisionStatus'),
    showBoxes: document.getElementById('showBoxesToggle'),
    diagnostics: document.getElementById('diagnosticsToggle'),
    clearCorrections: document.getElementById('clearCorrectionsBtn'),
    correctionCount: document.getElementById('correctionCount'),
    resetProgress: document.getElementById('resetProgressBtn'),
    demoControl: document.getElementById('demonstrativeControl'),
    vocabBtn: document.getElementById('vocabBtn'),
    vocabSearch: document.getElementById('vocabSearch'),
    vocabList: document.getElementById('vocabList'),
    toast: document.getElementById('toast')
  };

  const MODE_META = {
    explore: { icon: '👁', label: 'Explorar' },
    actions: { icon: '⚡', label: 'Ações' },
    location: { icon: '📍', label: 'Local' },
    quiz: { icon: '🎯', label: 'Quiz' },
    scene: { icon: '🧭', label: 'Cena' }
  };

  // MobileNet uses ImageNet labels. This map only accepts labels whose meaning is
  // sufficiently close to a vocabulary entry. Unknown labels are deliberately ignored.
  const VERIFIER_RULES = [
    [/letter opener|paper knife/i, 'utility_knife'],
    [/electric fan|blower/i, 'fan'],
    [/running shoe|sneaker|loafer|clog|cowboy boot|rubber boot/i, 'shoe'],
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
    detector: null,
    detectorError: null,
    verifier: null,
    verifierLoading: false,
    verifierError: null,
    stream: null,
    cameraStarted: false,
    facingMode: 'environment',
    detecting: false,
    verifying: false,
    mode: 'explore',
    demonstrative: localStorage.getItem('mn-demo') || 'kore',
    immersionSetting: localStorage.getItem('mn-immersion') || 'auto',
    minScore: finiteOr(localStorage.getItem('mn-score'), 0.50),
    showBoxes: localStorage.getItem('mn-boxes') === '1',
    diagnostics: localStorage.getItem('mn-diagnostics') === '1',
    deepVisionEnabled: localStorage.getItem('mn-deep-vision') !== '0',
    deepVisionLoading: false,
    deepVisionReady: false,
    deepVisionError: null,
    deepVisionRetryAt: 0,
    deepVisionProgress: null,
    deepProbeRunning: false,
    lastDeepProbeAt: 0,
    deepProbeInterval: 2600,
    deepMissCount: 0,
    lastCrosshairHash: null,
    deepAlternative: null,
    selectedPrediction: null,
    selectedKey: null,
    rawDetectorKey: null,
    frozen: false,
    preCorrectionFrozen: false,
    actionIndex: 0,
    quizRevealed: false,
    history: [],
    historySize: 5,
    requiredVotes: 3,
    missCount: 0,
    lastPredictions: [],
    detectionTimer: null,
    verificationToken: 0,
    lastVerifiedSignature: '',
    currentCropHash: null,
    verifierAlternative: null,
    recognition: { kind: 'idle', reason: '', detectorScore: null, verifierScore: null, verifierLabel: '', deepScore: null, deepLabel: '' },
    familiarity: readJson('mn-familiarity', {}),
    corrections: readJson('mn-corrections', []),
    detailsOpen: false,
    toastTimer: null
  };

  init();

  function init() {
    restoreControls();
    bindEvents();
    renderVocabList();
    renderCorrectionList();
    updateDemoButtons();
    updateStudyButton();
    updateMemoryControls();
    updateDeepVisionStatus();

    if (!localStorage.getItem('mn-onboarded-v02')) {
      requestAnimationFrame(() => safeShowModal(els.onboarding));
    }

    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch(() => {});
      });
    }

    loadDetector();
  }

  function bindEvents() {
    els.start.addEventListener('click', startCamera);
    els.scan.addEventListener('click', () => runCrosshairDeepScan(true));
    els.flip.addEventListener('click', flipCamera);
    els.settings.addEventListener('click', () => safeShowModal(els.settingsDialog));
    els.study.addEventListener('click', () => safeShowModal(els.studyDialog));
    els.expandLesson.addEventListener('click', toggleLessonDetails);
    els.vocabBtn.addEventListener('click', () => {
      safeClose(els.studyDialog);
      setTimeout(() => safeShowModal(els.vocabDialog), 0);
    });
    els.onboardingContinue.addEventListener('click', () => localStorage.setItem('mn-onboarded-v02', '1'));

    document.querySelectorAll('.mode-btn[data-mode]').forEach(btn => {
      btn.addEventListener('click', () => {
        setMode(btn.dataset.mode);
        safeClose(els.studyDialog);
      });
    });

    els.demoControl.querySelectorAll('[data-demo]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.demonstrative = btn.dataset.demo;
        localStorage.setItem('mn-demo', state.demonstrative);
        updateDemoButtons();
        state.quizRevealed = false;
        renderLesson();
      });
    });

    els.immersion.addEventListener('change', () => {
      state.immersionSetting = els.immersion.value;
      localStorage.setItem('mn-immersion', state.immersionSetting);
      renderLesson();
    });

    els.confidence.addEventListener('input', () => {
      state.minScore = Number(els.confidence.value);
      els.confidenceValue.value = `${Math.round(state.minScore * 100)}%`;
      localStorage.setItem('mn-score', String(state.minScore));
      state.history.length = 0;
    });

    els.deepVision.addEventListener('change', () => {
      state.deepVisionEnabled = els.deepVision.checked;
      localStorage.setItem('mn-deep-vision', state.deepVisionEnabled ? '1' : '0');
      state.deepVisionError = null;
      state.deepVisionRetryAt = 0;
      updateDeepVisionStatus();
      if (state.deepVisionEnabled && state.cameraStarted) showToast('Visão ampla será carregada quando uma leitura precisar dela.');
    });

    els.showBoxes.addEventListener('change', () => {
      state.showBoxes = els.showBoxes.checked;
      localStorage.setItem('mn-boxes', state.showBoxes ? '1' : '0');
      renderBoxes(state.lastPredictions, state.selectedPrediction);
    });

    els.diagnostics.addEventListener('change', () => {
      state.diagnostics = els.diagnostics.checked;
      localStorage.setItem('mn-diagnostics', state.diagnostics ? '1' : '0');
      renderRecognitionState();
      renderBoxes(state.lastPredictions, state.selectedPrediction);
    });

    els.speakWord.addEventListener('click', () => {
      const item = currentItem();
      if (!item) return;
      speak(item.jp);
      markFamiliar(state.selectedKey, 1);
    });

    els.speakSentence.addEventListener('click', () => {
      const phrase = state.mode === 'quiz' && !state.quizRevealed ? currentQuizQuestion() : currentSentence();
      if (!phrase) return;
      speak(phrase.jp);
      markFamiliar(state.selectedKey, 1);
    });

    els.nextAction.addEventListener('click', () => {
      const item = currentItem();
      if (!item) return;
      const actions = item.actions?.length ? item.actions : [fallbackAction(item)];
      state.actionIndex = (state.actionIndex + 1) % actions.length;
      state.quizRevealed = false;
      renderLesson();
    });

    els.freeze.addEventListener('click', () => setFrozen(!state.frozen));

    els.reveal.addEventListener('click', () => {
      if (state.quizRevealed) return;
      state.quizRevealed = true;
      markFamiliar(state.selectedKey, 2);
      renderLesson();
    });

    els.confirm.addEventListener('click', () => {
      const shouldRemember = Boolean(state.currentCropHash && state.rawDetectorKey && state.selectedKey && state.rawDetectorKey !== state.selectedKey);
      const remembered = shouldRemember ? rememberCorrection(state.selectedKey) : false;
      state.recognition = {
        ...state.recognition,
        kind: 'confirmed',
        reason: remembered ? 'Confirmado por você e salvo como lembrança visual local.' : 'Confirmado por você.'
      };
      markFamiliar(state.selectedKey, 2);
      renderLesson();
      showToast(remembered ? 'Confirmado e lembrado neste aparelho.' : 'Confirmado para esta seleção.');
    });

    els.correct.addEventListener('click', openCorrection);
    els.learnThis.addEventListener('click', openCorrection);
    els.cancelCorrection.addEventListener('click', () => setTimeout(restoreFreezeAfterCorrection, 0));
    els.correctionDialog.addEventListener('close', restoreFreezeAfterCorrection);

    els.clearCorrections.addEventListener('click', () => {
      state.corrections = [];
      localStorage.removeItem('mn-corrections');
      updateMemoryControls();
      showToast('Correções visuais apagadas.');
    });

    els.resetProgress.addEventListener('click', () => {
      state.familiarity = {};
      localStorage.removeItem('mn-familiarity');
      renderLesson();
      showToast('Progresso de imersão redefinido.');
    });

    els.vocabSearch.addEventListener('input', renderVocabList);
    els.correctionSearch.addEventListener('input', renderCorrectionList);

    window.addEventListener('resize', () => renderBoxes(state.lastPredictions, state.selectedPrediction));
    window.addEventListener('pagehide', stopCamera);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && window.speechSynthesis) window.speechSynthesis.cancel();
    });
  }

  async function loadDetector() {
    setStatus('Carregando detector…');
    try {
      if (!window.tf || !window.cocoSsd) throw new Error('Bibliotecas de IA indisponíveis.');
      try {
        await tf.setBackend('webgl');
      } catch (_) {
        await tf.setBackend('cpu');
      }
      await tf.ready();
      state.detector = await cocoSsd.load({ base: 'lite_mobilenet_v2' });
      setStatus(state.cameraStarted ? 'Mire em um objeto' : 'IA pronta · abra a câmera');
      if (state.cameraStarted) scheduleDetection(80);
    } catch (error) {
      state.detectorError = error;
      setStatus('IA visual indisponível · use Vocabulário');
      showToast('A IA visual não carregou. O vocabulário manual continua funcionando.', 4500);
      console.error(error);
    }
  }

  async function ensureVerifier() {
    if (state.verifier || state.verifierLoading || state.verifierError) return state.verifier;
    if (!window.mobilenet) {
      state.verifierError = new Error('MobileNet indisponível.');
      return null;
    }
    state.verifierLoading = true;
    try {
      state.verifier = await mobilenet.load({ version: 2, alpha: 0.50 });
      return state.verifier;
    } catch (error) {
      state.verifierError = error;
      console.warn('Segunda checagem indisponível:', error);
      return null;
    } finally {
      state.verifierLoading = false;
    }
  }

  async function ensureDeepVision(forceRetry = false) {
    if (!state.deepVisionEnabled) return null;
    if (!forceRetry && state.deepVisionError && Date.now() < state.deepVisionRetryAt) {
      updateDeepVisionStatus();
      return null;
    }
    if (window.MiraOpenVocab?.ready) {
      state.deepVisionReady = true;
      state.deepVisionLoading = false;
      state.deepVisionError = null;
      state.deepVisionRetryAt = 0;
      updateDeepVisionStatus();
      return window.MiraOpenVocab;
    }
    if (state.deepVisionLoading) {
      try {
        await window.MiraOpenVocab?.load?.(handleDeepVisionProgress);
        state.deepVisionReady = Boolean(window.MiraOpenVocab?.ready);
        return window.MiraOpenVocab;
      } catch (_) {
        return null;
      }
    }
    if (!window.MiraOpenVocab?.load) {
      state.deepVisionError = new Error('Carregador da Visão ampla indisponível.');
      updateDeepVisionStatus();
      return null;
    }

    state.deepVisionLoading = true;
    state.deepVisionError = null;
    updateDeepVisionStatus();
    try {
      await window.MiraOpenVocab.load(handleDeepVisionProgress);
      state.deepVisionReady = true;
      state.deepVisionRetryAt = 0;
      state.deepVisionProgress = 100;
      updateDeepVisionStatus();
      return window.MiraOpenVocab;
    } catch (error) {
      state.deepVisionError = error;
      state.deepVisionRetryAt = Date.now() + 60000;
      state.deepVisionReady = false;
      console.warn('Visão ampla indisponível:', error);
      updateDeepVisionStatus();
      return null;
    } finally {
      state.deepVisionLoading = false;
      updateDeepVisionStatus();
    }
  }

  function handleDeepVisionProgress(data) {
    if (!data) return;
    const progress = Number(data.progress);
    if (Number.isFinite(progress)) state.deepVisionProgress = Math.max(0, Math.min(100, progress));
    updateDeepVisionStatus();
    if (state.cameraStarted && state.deepVisionLoading && Number.isFinite(progress)) {
      setStatus(`Preparando Visão ampla · ${Math.round(progress)}%`);
    }
  }

  function updateDeepVisionStatus() {
    if (!els.deepVisionStatus) return;
    if (!state.deepVisionEnabled) {
      els.deepVisionStatus.textContent = 'Visão ampla: desligada';
      return;
    }
    if (state.deepVisionReady || window.MiraOpenVocab?.ready) {
      els.deepVisionStatus.textContent = 'Visão ampla: pronta · modelo em cache quando suportado pelo navegador';
      return;
    }
    if (state.deepVisionLoading) {
      const suffix = Number.isFinite(state.deepVisionProgress) ? ` · ${Math.round(state.deepVisionProgress)}%` : '';
      els.deepVisionStatus.textContent = `Visão ampla: preparando${suffix}`;
      return;
    }
    if (state.deepVisionError) {
      const wait = Math.max(0, Math.ceil((state.deepVisionRetryAt - Date.now()) / 1000));
      els.deepVisionStatus.textContent = wait > 0
        ? `Visão ampla: falhou ao carregar · nova tentativa automática em até ${wait}s; “Analisar mira” força uma tentativa`
        : 'Visão ampla: falhou ao carregar · “Analisar mira” tenta novamente; detector e correção manual continuam ativos';
      return;
    }
    els.deepVisionStatus.textContent = state.cameraStarted
      ? 'Visão ampla: pronta para carregar quando necessária'
      : 'Visão ampla: aguardando câmera';
  }

  async function startCamera() {
    if (!navigator.mediaDevices?.getUserMedia) {
      showToast('Este navegador não liberou acesso à câmera. Abra o site por HTTPS.', 5000);
      return;
    }

    els.start.disabled = true;
    setStatus('Pedindo acesso à câmera…');

    try {
      await openCamera(state.facingMode);
      state.cameraStarted = true;
      els.start.classList.add('hidden');
      setStatus(state.detector ? 'Mire em um objeto' : 'Câmera pronta · carregando IA…');
      if (state.detector) scheduleDetection(80);
      // Load only the lightweight verifier while idle. The open-vocabulary
      // model is intentionally lazy: it is downloaded only when a difficult or
      // previously unseen object actually requires it.
      const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 1200));
      idle(() => ensureVerifier());
    } catch (error) {
      console.error(error);
      let message = 'Não foi possível abrir a câmera.';
      if (error?.name === 'NotAllowedError') message = 'Permissão da câmera negada. Libere-a nas permissões do site.';
      if (error?.name === 'NotFoundError') message = 'Nenhuma câmera compatível foi encontrada.';
      setStatus(message);
      showToast(message, 5000);
      els.start.disabled = false;
    }
  }

  async function openCamera(mode) {
    stopStreamOnly();
    const constraints = {
      audio: false,
      video: {
        facingMode: { ideal: mode },
        width: { ideal: 1280 },
        height: { ideal: 720 },
        frameRate: { ideal: 24, max: 30 }
      }
    };
    state.stream = await navigator.mediaDevices.getUserMedia(constraints);
    els.video.srcObject = state.stream;
    await els.video.play();
    await waitForVideoDimensions();

    const actual = state.stream.getVideoTracks()[0]?.getSettings?.().facingMode;
    state.facingMode = actual || mode;
    els.stage.classList.toggle('camera-user', state.facingMode === 'user');
  }

  async function flipCamera() {
    if (!state.cameraStarted) return;
    state.facingMode = state.facingMode === 'environment' ? 'user' : 'environment';
    setFrozen(false);
    clearSelection('Trocando câmera…');
    try {
      await openCamera(state.facingMode);
      setStatus(state.detector ? 'Mire em um objeto' : 'Câmera pronta');
    } catch (error) {
      showToast('Não consegui trocar de câmera.');
      console.error(error);
    }
  }

  function waitForVideoDimensions() {
    if (els.video.videoWidth && els.video.videoHeight) return Promise.resolve();
    return new Promise(resolve => {
      const done = () => {
        els.video.removeEventListener('loadedmetadata', done);
        resolve();
      };
      els.video.addEventListener('loadedmetadata', done, { once: true });
      setTimeout(done, 1600);
    });
  }

  function stopStreamOnly() {
    if (state.stream) {
      state.stream.getTracks().forEach(track => track.stop());
      state.stream = null;
    }
  }

  function stopCamera() {
    clearTimeout(state.detectionTimer);
    stopStreamOnly();
  }

  function scheduleDetection(delay = 430) {
    clearTimeout(state.detectionTimer);
    state.detectionTimer = setTimeout(detectFrame, delay);
  }

  async function detectFrame() {
    if (!state.detector || !state.cameraStarted || state.detecting || document.hidden) {
      scheduleDetection(650);
      return;
    }
    if (els.video.readyState < 2 || !els.video.videoWidth) {
      scheduleDetection(350);
      return;
    }

    state.detecting = true;
    try {
      const predictions = await state.detector.detect(els.video, 20, state.minScore);
      state.lastPredictions = predictions.filter(p => JAPANESE_DB[p.class]);
      const target = chooseTarget(state.lastPredictions);

      if (!state.frozen) {
        updateTemporalTarget(target);
        if (!target) maybeAutoDeepProbe();
      }
      renderBoxes(state.lastPredictions, state.selectedPrediction || target);
    } catch (error) {
      console.error(error);
      setStatus('Falha temporária na detecção');
    } finally {
      state.detecting = false;
      scheduleDetection(430);
    }
  }

  function chooseTarget(predictions) {
    if (!predictions.length) return null;
    const { x, y } = crosshairPointInVideo();
    const containing = predictions.filter(p => pointInBox(x, y, p.bbox));

    if (containing.length) {
      return containing.sort((a, b) => scoreTarget(b, x, y) - scoreTarget(a, x, y))[0];
    }

    const maxDistance = Math.min(els.video.videoWidth, els.video.videoHeight) * 0.10;
    const near = predictions
      .map(p => ({ p, d: distanceToBox(x, y, p.bbox) }))
      .filter(v => v.d <= maxDistance)
      .sort((a, b) => a.d - b.d || b.p.score - a.p.score);
    return near[0]?.p || null;
  }

  function updateTemporalTarget(target) {
    state.history.push(target ? { class: target.class, score: target.score, prediction: target } : null);
    if (state.history.length > state.historySize) state.history.shift();

    if (!target) {
      // A seleção da Visão ampla não depende das 80 caixas do COCO. Mantemos a
      // palavra visível e a reavaliamos por recortes periódicos em vez de apagá-la.
      if (state.rawDetectorKey === '__crosshair__' && state.selectedKey) {
        state.missCount = 0;
        els.holdRing.className = state.recognition.kind === 'tentative' ? 'hold-ring verifying' : 'hold-ring locked';
        setStatus(state.deepProbeRunning ? 'Visão ampla analisando…' : 'Visão ampla acompanhando a mira…');
        return;
      }

      state.missCount += 1;
      els.holdRing.className = 'hold-ring';
      setStatus('Procurando objeto na mira…');
      if (state.missCount >= 3 && state.selectedKey) {
        clearSelection('Procurando objeto na mira…');
      } else if (!state.selectedKey) {
        showEmptyState('Aponte para algo', state.deepVisionEnabled
          ? 'O detector não encontrou uma classe comum. A Visão ampla tentará a região central.'
          : 'Mantenha a mira no objeto por um instante.');
      }
      return;
    }

    state.missCount = 0;
    const recent = state.history.filter(Boolean);
    if (recent.length < state.requiredVotes) {
      els.holdRing.className = 'hold-ring loading';
      setStatus('Estabilizando leitura…');
      return;
    }

    const votes = new Map();
    for (const entry of recent) {
      const value = votes.get(entry.class) || { count: 0, sum: 0, best: entry.prediction };
      value.count += 1;
      value.sum += entry.score;
      if (entry.score > value.best.score) value.best = entry.prediction;
      votes.set(entry.class, value);
    }

    const winner = [...votes.entries()]
      .map(([key, value]) => ({ key, ...value, avg: value.sum / value.count }))
      .sort((a, b) => b.count - a.count || b.avg - a.avg)[0];

    if (!winner || winner.count < state.requiredVotes) {
      els.holdRing.className = 'hold-ring loading';
      setStatus('Comparando leituras…');
      return;
    }

    const selected = winner.best;
    const signature = `${winner.key}:${quantizedBoxSignature(selected.bbox)}`;
    const changed = state.rawDetectorKey !== winner.key || state.lastVerifiedSignature !== signature;

    state.selectedPrediction = selected;
    state.rawDetectorKey = winner.key;
    els.holdRing.className = 'hold-ring verifying';

    if (changed) {
      selectObject(winner.key, selected, {
        source: 'detector',
        recognition: {
          kind: 'checking',
          reason: 'Segunda checagem visual em andamento.',
          detectorScore: winner.avg,
          verifierScore: null,
          verifierLabel: ''
        }
      });
      state.lastVerifiedSignature = signature;
      verifyStableTarget(selected, winner.avg, signature);
    } else if (!state.verifying) {
      els.holdRing.className = state.recognition.kind === 'tentative' ? 'hold-ring verifying' : 'hold-ring locked';
    }
  }

  async function verifyStableTarget(prediction, detectorScore, signature) {
    const token = ++state.verificationToken;
    state.verifying = true;
    state.verifierAlternative = null;
    state.deepAlternative = null;
    setStatus('Checando o objeto…');

    try {
      drawCrop(prediction);
      const snapshot = cloneCanvas(els.crop);
      let memorySnapshot = snapshot;
      if (prediction.class === 'person' && window.MiraRecognitionPolicy?.makeCrosshairBox) {
        const point = crosshairPointInVideo();
        const focusBox = window.MiraRecognitionPolicy.makeCrosshairBox(els.video.videoWidth, els.video.videoHeight, point, 0.34);
        memorySnapshot = cropFromBbox(focusBox, 256);
      }
      state.currentCropHash = computeDHash(memorySnapshot);

      const remembered = findRememberedCorrection(state.currentCropHash, prediction.class);
      if (remembered && token === state.verificationToken) {
        const memoryPrediction = { ...prediction, class: remembered.key, _deep: true };
        selectObject(remembered.key, memoryPrediction, {
          source: 'memory',
          rawDetectorKey: prediction.class,
          recognition: {
            kind: 'memory',
            reason: 'Reconhecido por uma correção que você salvou neste aparelho.',
            detectorScore,
            verifierScore: null,
            verifierLabel: '',
            deepScore: null,
            deepLabel: ''
          }
        });
        els.holdRing.className = 'hold-ring locked';
        renderBoxes(state.lastPredictions, memoryPrediction);
        setStatus('Lembrança local aplicada');
        return;
      }

      const verifier = await ensureVerifier();
      if (token !== state.verificationToken || signature !== state.lastVerifiedSignature) return;

      let classes = [];
      let mapped = null;
      let top = null;
      const policy = window.MiraRecognitionPolicy;
      if (verifier) {
        // COCO can label an entire visible limb as "person". For that broad class,
        // the quick verifier receives the user's crosshair crop rather than the
        // whole person box, which gives shoes and other local details a fair chance.
        let quickSnapshot = snapshot;
        if (prediction.class === 'person' && policy?.makeCrosshairBox) {
          const point = crosshairPointInVideo();
          const focusBox = policy.makeCrosshairBox(els.video.videoWidth, els.video.videoHeight, point, 0.34);
          quickSnapshot = cropFromBbox(focusBox, 256);
        }
        classes = await verifier.classify(quickSnapshot, 5);
        if (token !== state.verificationToken || signature !== state.lastVerifiedSignature) return;
        mapped = classes
          .map(result => ({ ...result, key: mapVerifierLabel(result.className) }))
          .filter(result => result.key && JAPANESE_DB[result.key])
          .sort((a, b) => b.probability - a.probability)[0] || null;
        top = classes[0] || null;
      }

      const verifierConflict = Boolean(mapped && mapped.key !== prediction.class && mapped.probability >= 0.14);
      const deepHandled = await tryDeepVerifyPrediction({
        prediction,
        detectorScore,
        signature,
        token,
        snapshot,
        mapped,
        verifierConflict
      });
      if (token !== state.verificationToken || signature !== state.lastVerifiedSignature) return;
      if (deepHandled) return;

      const highConfusion = Boolean(policy?.isHighConfusion?.(prediction.class));

      if (!verifier) {
        const strong = detectorScore >= 0.82 && !highConfusion;
        state.recognition = {
          kind: strong ? 'stable' : 'tentative',
          reason: strong
            ? 'Detector principal está consistente; verificadores adicionais não ficaram disponíveis.'
            : highConfusion
              ? 'Esta categoria já apresentou confusões em testes reais e a checagem adicional não ficou disponível. Confirme ou corrija.'
              : 'Confiança moderada e verificadores adicionais indisponíveis. Confirme antes de memorizar.',
          detectorScore,
          verifierScore: null,
          verifierLabel: '',
          deepScore: null,
          deepLabel: ''
        };
        renderLesson();
        els.holdRing.className = strong ? 'hold-ring locked' : 'hold-ring verifying';
        setStatus(strong ? 'Reconhecimento estável' : 'Leitura incerta · confirme ou corrija');
        return;
      }

      const same = mapped?.key === prediction.class;
      const strongAlternative = mapped && mapped.key !== prediction.class && mapped.probability >= 0.30;
      const moderateAlternative = mapped && mapped.key !== prediction.class && mapped.probability >= 0.16;

      if (same) {
        state.recognition = {
          kind: 'stable',
          reason: 'Detector e verificador rápido são compatíveis.',
          detectorScore,
          verifierScore: mapped.probability,
          verifierLabel: mapped.className,
          deepScore: null,
          deepLabel: ''
        };
        els.holdRing.className = 'hold-ring locked';
        setStatus('Reconhecimento estável');
      } else if (strongAlternative && (detectorScore < 0.82 || highConfusion)) {
        state.verifierAlternative = mapped;
        selectObject(mapped.key, { ...prediction, class: mapped.key }, {
          source: 'verifier',
          rawDetectorKey: prediction.class,
          recognition: {
            kind: 'tentative',
            reason: `O verificador rápido sugere “${JAPANESE_DB[mapped.key].pt}”. Confirme antes de memorizar.`,
            detectorScore,
            verifierScore: mapped.probability,
            verifierLabel: mapped.className,
            deepScore: null,
            deepLabel: ''
          }
        });
        els.holdRing.className = 'hold-ring verifying';
        setStatus('Talvez seja · confirme ou corrija');
      } else if (moderateAlternative || detectorScore < 0.72 || highConfusion) {
        state.verifierAlternative = moderateAlternative ? mapped : null;
        state.recognition = {
          kind: 'tentative',
          reason: moderateAlternative
            ? `Os modelos rápidos discordaram. Outra possibilidade: ${JAPANESE_DB[mapped.key].pt}.`
            : highConfusion
              ? 'Esta categoria é propensa a confusão e não recebeu confirmação suficiente. Confirme ou corrija.'
              : 'A leitura ainda não está segura o suficiente para ensinar como certeza.',
          detectorScore,
          verifierScore: mapped?.probability ?? top?.probability ?? null,
          verifierLabel: mapped?.className || top?.className || '',
          deepScore: null,
          deepLabel: ''
        };
        renderLesson();
        els.holdRing.className = 'hold-ring verifying';
        setStatus('Leitura incerta · confirme ou corrija');
      } else {
        state.recognition = {
          kind: 'stable',
          reason: 'O detector ficou estável e o verificador rápido não encontrou conflito forte.',
          detectorScore,
          verifierScore: mapped?.probability ?? top?.probability ?? null,
          verifierLabel: mapped?.className || top?.className || '',
          deepScore: null,
          deepLabel: ''
        };
        els.holdRing.className = 'hold-ring locked';
        setStatus('Reconhecimento estável');
      }
      renderLesson();
    } catch (error) {
      console.warn('Falha na cadeia de verificação:', error);
      if (token !== state.verificationToken) return;
      const highConfusion = Boolean(window.MiraRecognitionPolicy?.isHighConfusion?.(prediction.class));
      const safeStrong = detectorScore >= 0.82 && !highConfusion;
      state.recognition = {
        kind: safeStrong ? 'stable' : 'tentative',
        reason: safeStrong
          ? 'Detector principal está consistente; a checagem adicional falhou nesta leitura.'
          : highConfusion
            ? 'A checagem adicional falhou numa categoria propensa a confusão. Confirme ou corrija.'
            : 'A checagem adicional falhou; confirme ou corrija antes de memorizar.',
        detectorScore,
        verifierScore: null,
        verifierLabel: '',
        deepScore: null,
        deepLabel: ''
      };
      renderLesson();
      els.holdRing.className = state.recognition.kind === 'stable' ? 'hold-ring locked' : 'hold-ring verifying';
    } finally {
      if (token === state.verificationToken) state.verifying = false;
    }
  }

  async function tryDeepVerifyPrediction({ prediction, detectorScore, signature, token, snapshot, mapped, verifierConflict }) {
    const policy = window.MiraRecognitionPolicy;
    if (!state.deepVisionEnabled || !policy?.shouldRunDeep?.(prediction.class, detectorScore, verifierConflict)) return false;

    setStatus(state.deepVisionReady ? 'Visão ampla analisando…' : 'Preparando Visão ampla…');
    const api = await ensureDeepVision();
    if (token !== state.verificationToken || signature !== state.lastVerifiedSignature) return true;
    if (!api?.ready) return false;

    try {
      const descriptors = policy.candidateDescriptors(prediction.class, 38);
      // COCO's person box can cover most of the body while the user is explicitly
      // aiming at a hand or shoe. For that broad class, classify the crosshair crop
      // instead of the whole person box so the user's intent wins.
      let deepSnapshot = snapshot;
      if (prediction.class === 'person') {
        const point = crosshairPointInVideo();
        const focusBox = policy.makeCrosshairBox(els.video.videoWidth, els.video.videoHeight, point, 0.34);
        deepSnapshot = cropFromBbox(focusBox, 256);
      }
      const output = await api.classify(deepSnapshot, descriptors.map(d => d.label), handleDeepVisionProgress);
      if (token !== state.verificationToken || signature !== state.lastVerifiedSignature) return true;

      const ranked = policy.normalizeDeepResults(output, descriptors);
      const decision = policy.decideDeepRecognition(ranked, prediction.class, detectorScore);
      state.deepAlternative = decision.top || null;
      if (!decision.accept || !decision.top || !JAPANESE_DB[decision.top.key]) return false;

      const key = decision.top.key;
      const focusPart = prediction.class === 'person' && (key === 'hand' || key === 'shoe');
      const deepPrediction = focusPart
        ? makeSyntheticPrediction(key, decision.top.score)
        : { ...prediction, class: key, score: Math.max(prediction.score || 0, decision.top.score), _deep: true };

      const rawPt = JAPANESE_DB[prediction.class]?.pt || prediction.class;
      const targetPt = JAPANESE_DB[key].pt;
      const reason = decision.same
        ? `A Visão ampla confirmou “${targetPt}”.`
        : `A Visão ampla focou a região da mira e prefere “${targetPt}” a “${rawPt}”.`;

      state.verifierAlternative = mapped && mapped.key !== key ? mapped : null;
      selectObject(key, deepPrediction, {
        source: 'deep',
        rawDetectorKey: prediction.class,
        recognition: {
          kind: decision.stable ? 'deep' : 'tentative',
          reason,
          detectorScore,
          verifierScore: mapped?.probability ?? null,
          verifierLabel: mapped?.className || '',
          deepScore: decision.top.score,
          deepLabel: decision.top.label
        }
      });
      els.holdRing.className = decision.stable ? 'hold-ring locked' : 'hold-ring verifying';
      renderBoxes(state.lastPredictions, deepPrediction);
      setStatus(decision.stable ? 'Visão ampla · reconhecimento estável' : 'Visão ampla · confirme ou corrija');
      return true;
    } catch (error) {
      console.warn('Falha na Visão ampla para o alvo:', error);
      return false;
    }
  }

  function maybeAutoDeepProbe() {
    if (!state.deepVisionEnabled || state.deepProbeRunning || state.verifying || state.frozen || !state.cameraStarted) return;
    const now = Date.now();
    if (now - state.lastDeepProbeAt < state.deepProbeInterval) return;
    state.lastDeepProbeAt = now;
    runCrosshairDeepScan(false);
  }

  async function runCrosshairDeepScan(manual = false) {
    if (!state.cameraStarted || !els.video.videoWidth) {
      if (manual) showToast('Abra a câmera primeiro.');
      return;
    }
    if (!state.deepVisionEnabled) {
      if (manual) showToast('Ative “Visão ampla” nas configurações.');
      return;
    }
    if (state.deepProbeRunning) return;

    state.deepProbeRunning = true;
    els.scan.disabled = true;
    const token = ++state.verificationToken;
    try {
      const policy = window.MiraRecognitionPolicy;
      if (!policy) throw new Error('Política de reconhecimento indisponível.');
      const point = crosshairPointInVideo();
      const bbox = policy.makeCrosshairBox(els.video.videoWidth, els.video.videoHeight, point, 0.38);
      const snapshot = cropFromBbox(bbox, 256);
      const hash = computeDHash(snapshot);
      const movedFar = Boolean(
        state.rawDetectorKey === '__crosshair__' &&
        state.lastCrosshairHash &&
        hammingHex(hash, state.lastCrosshairHash) > 18
      );
      state.lastCrosshairHash = hash;
      state.currentCropHash = hash;
      if (movedFar && state.selectedKey) {
        // Do not keep teaching the previous object while the user has clearly
        // moved the camera to a visually different region.
        state.deepMissCount = 1;
        state.recognition = {
          ...state.recognition,
          kind: 'checking',
          reason: 'A mira mudou bastante; reavaliando antes de manter a palavra anterior.'
        };
        renderLesson();
      }
      setStatus(state.deepVisionReady ? 'Visão ampla analisando a mira…' : 'Preparando Visão ampla…');

      const remembered = findRememberedCorrection(hash, '__crosshair__');
      if (remembered && token === state.verificationToken) {
        const prediction = { class: remembered.key, score: 1, bbox, _deep: true };
        selectObject(remembered.key, prediction, {
          rawDetectorKey: '__crosshair__',
          recognition: {
            kind: 'memory',
            reason: 'A região lembra uma correção visual salva neste aparelho.',
            detectorScore: null,
            verifierScore: null,
            verifierLabel: '',
            deepScore: null,
            deepLabel: ''
          }
        });
        state.deepMissCount = 0;
        renderBoxes(state.lastPredictions, prediction);
        els.holdRing.className = 'hold-ring locked';
        setStatus('Lembrança local aplicada');
        return;
      }

      const api = await ensureDeepVision(manual);
      if (token !== state.verificationToken || !api?.ready) return;
      const descriptors = policy.candidateDescriptors(null, 40);
      const output = await api.classify(snapshot, descriptors.map(d => d.label), handleDeepVisionProgress);
      if (token !== state.verificationToken) return;
      const ranked = policy.normalizeDeepResults(output, descriptors);
      const decision = policy.decideDeepRecognition(ranked, null, null);
      state.deepAlternative = decision.top || null;

      if (!decision.accept || !decision.top || !JAPANESE_DB[decision.top.key]) {
        state.deepMissCount += 1;
        if (manual) showToast('Ainda não tenho confiança suficiente. Aproxime a mira ou use Corrigir.');
        if (state.rawDetectorKey === '__crosshair__' && state.selectedKey && (movedFar || state.deepMissCount >= 2)) {
          clearSelection('Visão ampla · leitura inconclusiva');
          showEmptyState('Ainda não tenho certeza', 'A palavra anterior foi removida porque a mira mudou ou a nova leitura não se confirmou.');
        } else if (!state.selectedKey) {
          showEmptyState('Ainda não tenho certeza', 'Aproxime-se do objeto, mantenha a mira ou use o vocabulário manual.');
        }
        setStatus('Visão ampla · leitura inconclusiva');
        return;
      }

      state.deepMissCount = 0;
      const key = decision.top.key;
      const prediction = { class: key, score: decision.top.score, bbox, _deep: true };
      selectObject(key, prediction, {
        rawDetectorKey: '__crosshair__',
        recognition: {
          kind: decision.stable ? 'deep' : 'tentative',
          reason: decision.stable
            ? 'Objeto identificado pela Visão ampla diretamente na região da mira.'
            : 'A Visão ampla encontrou uma possibilidade, mas ainda vale confirmar.',
          detectorScore: null,
          verifierScore: null,
          verifierLabel: '',
          deepScore: decision.top.score,
          deepLabel: decision.top.label
        }
      });
      renderBoxes(state.lastPredictions, prediction);
      els.holdRing.className = decision.stable ? 'hold-ring locked' : 'hold-ring verifying';
      setStatus(decision.stable ? 'Visão ampla · reconhecimento estável' : 'Visão ampla · confirme ou corrija');
    } catch (error) {
      console.warn('Falha ao analisar a mira com Visão ampla:', error);
      if (manual) showToast('A Visão ampla não ficou disponível. Você ainda pode usar Corrigir/Vocabulário.', 4000);
      setStatus('Visão ampla indisponível · detector comum ativo');
    } finally {
      state.deepProbeRunning = false;
      els.scan.disabled = false;
    }
  }

  function cloneCanvas(source) {
    const canvas = document.createElement('canvas');
    canvas.width = source.width;
    canvas.height = source.height;
    canvas.getContext('2d', { willReadFrequently: true }).drawImage(source, 0, 0);
    return canvas;
  }

  function cropFromBbox(bbox, size = 256) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const [x, y, w, h] = bbox;
    const sx = clamp(x, 0, els.video.videoWidth - 1);
    const sy = clamp(y, 0, els.video.videoHeight - 1);
    const sw = clamp(w, 1, els.video.videoWidth - sx);
    const sh = clamp(h, 1, els.video.videoHeight - sy);
    ctx.drawImage(els.video, sx, sy, sw, sh, 0, 0, size, size);
    return canvas;
  }

  function makeSyntheticPrediction(key, score) {
    const policy = window.MiraRecognitionPolicy;
    const point = crosshairPointInVideo();
    const bbox = policy?.makeCrosshairBox
      ? policy.makeCrosshairBox(els.video.videoWidth, els.video.videoHeight, point, 0.34)
      : [Math.max(0, point.x - 120), Math.max(0, point.y - 120), 240, 240];
    return { class: key, score: score || 0, bbox, _deep: true };
  }

  function drawCrop(prediction) {
    const ctx = els.crop.getContext('2d', { willReadFrequently: true });
    const [x, y, w, h] = prediction.bbox;
    const pad = Math.max(w, h) * 0.10;
    const sx = clamp(x - pad, 0, els.video.videoWidth);
    const sy = clamp(y - pad, 0, els.video.videoHeight);
    const sw = clamp(w + pad * 2, 1, els.video.videoWidth - sx);
    const sh = clamp(h + pad * 2, 1, els.video.videoHeight - sy);
    ctx.clearRect(0, 0, els.crop.width, els.crop.height);
    ctx.drawImage(els.video, sx, sy, sw, sh, 0, 0, els.crop.width, els.crop.height);
  }

  function computeDHash(sourceCanvas) {
    const tiny = document.createElement('canvas');
    tiny.width = 9;
    tiny.height = 8;
    const ctx = tiny.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(sourceCanvas, 0, 0, 9, 8);
    const data = ctx.getImageData(0, 0, 9, 8).data;
    let bits = '';
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const i1 = (y * 9 + x) * 4;
        const i2 = (y * 9 + x + 1) * 4;
        const g1 = data[i1] * 0.299 + data[i1 + 1] * 0.587 + data[i1 + 2] * 0.114;
        const g2 = data[i2] * 0.299 + data[i2 + 1] * 0.587 + data[i2 + 2] * 0.114;
        bits += g1 > g2 ? '1' : '0';
      }
    }
    let hex = '';
    for (let i = 0; i < 64; i += 4) hex += parseInt(bits.slice(i, i + 4), 2).toString(16);
    return hex.padStart(16, '0');
  }

  function findRememberedCorrection(hash, rawClass) {
    if (!hash || !rawClass) return null;
    let best = null;
    for (const entry of state.corrections) {
      if (!entry || entry.rawClass !== rawClass || !JAPANESE_DB[entry.key] || !entry.hash) continue;
      const distance = hammingHex(hash, entry.hash);
      if (distance <= 7 && (!best || distance < best.distance)) best = { ...entry, distance };
    }
    return best;
  }

  function rememberCorrection(key) {
    if (!state.currentCropHash || !state.rawDetectorKey || !key) return false;
    state.corrections = state.corrections
      .filter(entry => !(entry.rawClass === state.rawDetectorKey && entry.hash === state.currentCropHash))
      .slice(-39);
    state.corrections.push({
      hash: state.currentCropHash,
      rawClass: state.rawDetectorKey,
      key,
      at: Date.now()
    });
    localStorage.setItem('mn-corrections', JSON.stringify(state.corrections));
    updateMemoryControls();
    return true;
  }

  function hammingHex(a, b) {
    if (!a || !b || a.length !== b.length) return Infinity;
    const bitCount = [0, 1, 1, 2, 1, 2, 2, 3, 1, 2, 2, 3, 2, 3, 3, 4];
    let distance = 0;
    for (let i = 0; i < a.length; i++) {
      const x = parseInt(a[i], 16) ^ parseInt(b[i], 16);
      distance += bitCount[x];
    }
    return distance;
  }

  function mapVerifierLabel(label) {
    for (const [pattern, key] of VERIFIER_RULES) {
      if (pattern.test(label)) return key;
    }
    return null;
  }

  function selectObject(key, prediction = null, options = {}) {
    if (!JAPANESE_DB[key]) return;
    const previousKey = state.selectedKey;
    state.selectedKey = key;
    state.selectedPrediction = prediction;
    if (options.rawDetectorKey) state.rawDetectorKey = options.rawDetectorKey;
    if (options.recognition) state.recognition = options.recognition;
    if (previousKey !== key) {
      state.actionIndex = 0;
      state.quizRevealed = false;
    }
    els.emptyHint.classList.add('hidden');
    els.lessonCard.classList.remove('hidden');
    renderLesson();
  }

  function clearSelection(status = '') {
    state.verificationToken += 1;
    state.history.length = 0;
    state.missCount = 0;
    state.selectedPrediction = null;
    state.selectedKey = null;
    state.rawDetectorKey = null;
    state.currentCropHash = null;
    state.verifierAlternative = null;
    state.deepAlternative = null;
    state.deepMissCount = 0;
    state.lastCrosshairHash = null;
    state.lastVerifiedSignature = '';
    state.recognition = { kind: 'idle', reason: '', detectorScore: null, verifierScore: null, verifierLabel: '', deepScore: null, deepLabel: '' };
    els.lessonCard.classList.add('hidden');
    els.holdRing.className = 'hold-ring';
    showEmptyState('Aponte para algo', state.deepVisionEnabled
      ? 'Mantenha a mira no objeto. A Visão ampla entra quando as 80 classes comuns não bastam.'
      : 'Mantenha a mira no objeto por um instante.');
    if (status) setStatus(status);
  }

  function currentItem() {
    return state.selectedKey ? JAPANESE_DB[state.selectedKey] : null;
  }

  function currentSentence() {
    const item = currentItem();
    if (!item) return null;
    const demo = DEMONSTRATIVES[state.demonstrative];

    if (state.mode === 'actions') {
      const actions = item.actions?.length ? item.actions : [fallbackAction(item)];
      return actions[state.actionIndex % actions.length];
    }

    if (state.mode === 'location') {
      const verb = item.animate ? 'います' : 'あります';
      const verbRomaji = item.animate ? 'imasu' : 'arimasu';
      return {
        jp: `${demo.place}に${item.jp}が${verb}。`,
        romaji: `${capitalize(demo.placeRomaji)} ni ${item.romaji} ga ${verbRomaji}.`,
        pt: `${capitalize(item.pt)} está ${demo.placePt}.`
      };
    }

    if (state.mode === 'scene') {
      const relation = currentSceneRelation();
      if (relation) return relation;
      const verb = item.animate ? 'います' : 'あります';
      const verbRomaji = item.animate ? 'imasu' : 'arimasu';
      return {
        jp: `${demo.place}に${item.jp}が${verb}。`,
        romaji: `${capitalize(demo.placeRomaji)} ni ${item.romaji} ga ${verbRomaji}.`,
        pt: `Ainda não encontrei uma relação segura com outro objeto; ${item.pt} está ${demo.placePt}.`
      };
    }

    if (state.mode === 'quiz') {
      if (state.selectedKey === 'person') {
        return { jp: '人が見えます。', romaji: 'Hito ga miemasu.', pt: 'Vejo uma pessoa.' };
      }
      return {
        jp: `${item.jp}です。`,
        romaji: `${capitalize(item.romaji)} desu.`,
        pt: `Resposta: ${item.pt}.`
      };
    }

    if (state.selectedKey === 'person') {
      const personDemo = {
        kore: { jp: 'この人', romaji: 'kono hito', pt: 'esta pessoa' },
        sore: { jp: 'その人', romaji: 'sono hito', pt: 'essa pessoa' },
        are: { jp: 'あの人', romaji: 'ano hito', pt: 'aquela pessoa' }
      }[state.demonstrative];
      return {
        jp: `${personDemo.jp}がいます。`,
        romaji: `${capitalize(personDemo.romaji)} ga imasu.`,
        pt: `${capitalize(personDemo.pt)} está aqui/ali.`
      };
    }

    return {
      jp: `${demo.thing}は${item.jp}です。`,
      romaji: `${capitalize(demo.romaji)} wa ${item.romaji} desu.`,
      pt: `${capitalize(demo.pt)}: ${item.pt}.`
    };
  }

  function currentSceneRelation() {
    const item = currentItem();
    const target = state.selectedPrediction;
    const policy = window.MiraRecognitionPolicy;
    if (!item || !target?.bbox || !policy?.inferSceneRelation) return null;

    const others = state.lastPredictions.filter(p => {
      if (!p?.bbox || !JAPANESE_DB[p.class]) return false;
      if (target._deep && state.rawDetectorKey && p.class === state.rawDetectorKey) return false;
      return bboxIoU(p.bbox, target.bbox) < 0.72;
    });
    const found = policy.inferSceneRelation(target, others);
    if (!found || !JAPANESE_DB[found.other.class]) return null;

    const other = JAPANESE_DB[found.other.class];
    const relationMap = {
      on: { jp: '上', romaji: 'ue', pt: 'em cima de' },
      above: { jp: '上', romaji: 'ue', pt: 'acima de' },
      below: { jp: '下', romaji: 'shita', pt: 'abaixo de' },
      inside: { jp: '中', romaji: 'naka', pt: 'dentro de' },
      left: { jp: '左', romaji: 'hidari', pt: 'à esquerda de' },
      right: { jp: '右', romaji: 'migi', pt: 'à direita de' }
    };
    const rel = relationMap[found.relation];
    if (!rel) return null;
    const verb = item.animate ? 'います' : 'あります';
    const verbRomaji = item.animate ? 'imasu' : 'arimasu';
    return {
      jp: `${item.jp}は${other.jp}の${rel.jp}に${verb}。`,
      romaji: `${capitalize(item.romaji)} wa ${other.romaji} no ${rel.romaji} ni ${verbRomaji}.`,
      pt: `${capitalize(item.pt)} está ${rel.pt} ${other.pt}.`
    };
  }

  function currentQuizQuestion() {
    const item = currentItem();
    if (!item) return null;
    if (state.selectedKey === 'person') {
      return { jp: '何が見えますか？', romaji: 'Nani ga miemasu ka?', pt: 'O que você vê?' };
    }
    const demo = DEMONSTRATIVES[state.demonstrative];
    return {
      jp: `${demo.thing}は何ですか？`,
      romaji: `${capitalize(demo.romaji)} wa nan desu ka?`,
      pt: `O que é ${demo.pt}?`
    };
  }

  function renderLesson() {
    const item = currentItem();
    if (!item) return;
    const sentence = currentSentence();
    const immersion = effectiveImmersionLevel(state.selectedKey);

    els.jpWord.textContent = item.jp;
    els.kana.textContent = item.kana;
    els.romaji.textContent = item.romaji;
    els.translation.textContent = item.pt;

    const inQuiz = state.mode === 'quiz';
    els.quizPanel.classList.toggle('hidden', !inQuiz);
    els.jpWord.classList.toggle('hidden', inQuiz && !state.quizRevealed);
    els.kana.classList.toggle('hidden', inQuiz && !state.quizRevealed);
    els.romaji.classList.toggle('hidden', (inQuiz && !state.quizRevealed) || immersion >= 3);
    els.speakWord.classList.toggle('hidden', inQuiz && !state.quizRevealed);
    els.sentenceJp.parentElement.classList.toggle('hidden', inQuiz && !state.quizRevealed);

    if (inQuiz) {
      const question = currentQuizQuestion();
      els.quizQuestion.textContent = question.jp;
      els.reveal.textContent = state.quizRevealed ? 'Resposta revelada' : 'Revelar resposta';
      els.reveal.disabled = state.quizRevealed;
    }

    els.sentenceJp.textContent = sentence.jp;
    els.sentenceRomaji.textContent = sentence.romaji;
    els.sentencePt.textContent = sentence.pt;

    els.translation.classList.toggle('hidden', (inQuiz && !state.quizRevealed) || immersion >= 2);
    els.sentenceRomaji.classList.toggle('hidden', immersion >= 3);
    els.sentencePt.classList.toggle('hidden', immersion >= 2);

    const actionCount = item.actions?.length || 1;
    els.nextAction.classList.toggle('hidden', state.mode !== 'actions' || actionCount <= 1);

    renderRecognitionState();
    renderProgress();
  }

  function renderRecognitionState() {
    if (!state.selectedKey) return;
    const r = state.recognition;
    let label = 'Reconhecimento estável';
    if (r.kind === 'checking') label = 'Checando visão…';
    if (r.kind === 'tentative') label = 'Talvez seja';
    if (r.kind === 'manual') label = 'Escolhido por você';
    if (r.kind === 'memory') label = 'Lembrança local';
    if (r.kind === 'confirmed') label = 'Confirmado por você';
    if (r.kind === 'verifier') label = 'Segunda checagem';
    if (r.kind === 'deep') label = 'Visão ampla';

    if (state.diagnostics) {
      const detector = Number.isFinite(r.detectorScore) ? ` · det. ${Math.round(r.detectorScore * 100)}%` : '';
      const verifier = Number.isFinite(r.verifierScore) ? ` · 2ª ${Math.round(r.verifierScore * 100)}%` : '';
      const deep = Number.isFinite(r.deepScore) ? ` · ampla ${Math.round(r.deepScore * 100)}%` : '';
      label += `${detector}${verifier}${deep}`;
    }

    els.recognitionState.textContent = label;
    els.recognitionState.classList.toggle('tentative', r.kind === 'tentative' || r.kind === 'checking');
    els.recognitionState.classList.toggle('deep', r.kind === 'deep');

    const uncertain = r.kind === 'tentative' || r.kind === 'checking';
    els.tentativePanel.classList.toggle('hidden', !uncertain);
    els.tentativeReason.textContent = r.reason || 'A leitura ainda não está segura.';
    els.confirm.disabled = r.kind === 'checking';

    if (state.diagnostics && r.kind !== 'checking') {
      const extra = [];
      if (r.verifierLabel) extra.push(`rápida: ${r.verifierLabel}`);
      if (r.deepLabel) extra.push(`ampla: ${r.deepLabel}`);
      if (extra.length) els.tentativeReason.textContent = `${r.reason} · ${extra.join(' · ')}`;
    }
  }

  function renderProgress() {
    const score = state.familiarity[state.selectedKey] || 0;
    const level = effectiveImmersionLevel(state.selectedKey);
    if (state.immersionSetting === 'auto') {
      let next = 'nível máximo';
      if (level === 1) next = `${Math.max(0, 3 - score)} interações para ocultar português`;
      if (level === 2) next = `${Math.max(0, 8 - score)} interações para ocultar rōmaji`;
      els.progressHint.textContent = `Imersão progressiva · nível ${level}/3 · ${score} interações intencionais · ${next}.`;
    } else {
      els.progressHint.textContent = `Imersão fixa · nível ${level}/3.`;
    }
  }

  function effectiveImmersionLevel(key) {
    if (state.immersionSetting !== 'auto') {
      const level = Number(state.immersionSetting);
      return [1, 2, 3].includes(level) ? level : 1;
    }
    const score = state.familiarity[key] || 0;
    if (score >= 8) return 3;
    if (score >= 3) return 2;
    return 1;
  }

  function markFamiliar(key, amount) {
    if (!key) return;
    state.familiarity[key] = Math.min(50, (state.familiarity[key] || 0) + amount);
    localStorage.setItem('mn-familiarity', JSON.stringify(state.familiarity));
    renderLesson();
  }

  function setMode(mode) {
    if (!MODE_META[mode]) return;
    state.mode = mode;
    state.actionIndex = 0;
    state.quizRevealed = false;
    document.querySelectorAll('.mode-btn[data-mode]').forEach(btn => btn.classList.toggle('active', btn.dataset.mode === mode));
    updateStudyButton();
    renderLesson();
  }

  function updateStudyButton() {
    const meta = MODE_META[state.mode];
    els.studyModeIcon.textContent = meta.icon;
    els.studyModeLabel.textContent = meta.label;
  }

  function toggleLessonDetails() {
    state.detailsOpen = !state.detailsOpen;
    els.lessonCard.classList.toggle('expanded', state.detailsOpen);
    els.expandLesson.setAttribute('aria-expanded', String(state.detailsOpen));
    els.lessonDetails.setAttribute('aria-hidden', String(!state.detailsOpen));
  }

  function setFrozen(value) {
    state.frozen = Boolean(value);
    els.freeze.classList.toggle('active', state.frozen);
    els.freeze.textContent = state.frozen ? '✓ Travado' : '⌾ Travar';
    if (state.frozen) showToast('Objeto travado.');
  }

  function openCorrection() {
    if (!state.selectedKey) return;
    state.preCorrectionFrozen = state.frozen;
    setFrozen(true);
    els.correctionSearch.value = '';
    renderCorrectionSuggestion();
    renderCorrectionList();
    safeShowModal(els.correctionDialog);
  }

  function restoreFreezeAfterCorrection() {
    setFrozen(state.preCorrectionFrozen);
  }

  function renderCorrectionSuggestion() {
    els.correctionSuggestion.replaceChildren();
    const alt = state.deepAlternative || state.verifierAlternative;
    if (!alt || !JAPANESE_DB[alt.key] || alt.key === state.selectedKey) {
      els.correctionSuggestion.classList.add('hidden');
      return;
    }
    const item = JAPANESE_DB[alt.key];
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'suggestion-btn';
    btn.textContent = `${state.deepAlternative === alt ? 'Visão ampla' : 'Segunda checagem'}: ${item.jp} · ${item.romaji} · ${item.pt}`;
    btn.addEventListener('click', () => applyCorrection(alt.key));
    els.correctionSuggestion.appendChild(btn);
    els.correctionSuggestion.classList.remove('hidden');
  }

  function applyCorrection(key) {
    if (!JAPANESE_DB[key]) return;
    const remembered = rememberCorrection(key);
    state.verifierAlternative = null;
    selectObject(key, state.selectedPrediction, {
      rawDetectorKey: state.rawDetectorKey,
      recognition: {
        kind: 'manual',
        reason: remembered
          ? 'Correção salva localmente para uma imagem visualmente parecida.'
          : 'Escolhido manualmente por você.',
        detectorScore: state.recognition.detectorScore,
        verifierScore: null,
        verifierLabel: '',
        deepScore: null,
        deepLabel: ''
      }
    });
    markFamiliar(key, 2);
    safeClose(els.correctionDialog);
    showToast(remembered ? 'Corrigido e lembrado neste aparelho.' : 'Corrigido para esta seleção.');
  }

  function renderBoxes(predictions, target) {
    els.boxes.replaceChildren();
    if (!state.cameraStarted || !els.video.videoWidth) return;
    const m = videoCoverMetrics();
    let targetRendered = false;

    predictions.forEach((p, index) => {
      const isTarget = target && samePredictionIdentity(p, target);
      if (!state.showBoxes && !isTarget) return;
      appendDetectionBox(p, index, isTarget, m, false);
      if (isTarget) targetRendered = true;
    });

    // Deep vision may identify a smaller object inside a broad COCO box (e.g.
    // hand/shoe inside "person") or may work without any COCO box at all.
    if (target?.bbox && JAPANESE_DB[target.class] && !targetRendered) {
      appendDetectionBox(target, -1, true, m, Boolean(target._deep));
    }
  }

  function appendDetectionBox(p, index, isTarget, m, synthetic) {
    const item = JAPANESE_DB[p.class];
    if (!item) return;
    const [x, y, w, h] = p.bbox;
    const box = document.createElement('button');
    box.type = 'button';
    box.className = 'detection-box';
    if (isTarget) box.classList.add('selected');
    if (synthetic) box.classList.add('deep-selected');
    if (!state.showBoxes) box.classList.add('subtle');
    box.style.left = `${m.ox + x * m.scale}px`;
    box.style.top = `${m.oy + y * m.scale}px`;
    box.style.width = `${w * m.scale}px`;
    box.style.height = `${h * m.scale}px`;

    const label = document.createElement('span');
    label.textContent = state.diagnostics && Number.isFinite(p.score)
      ? `${item.jp} · ${Math.round(p.score * 100)}%`
      : item.jp;
    box.appendChild(label);
    box.setAttribute('aria-label', `Selecionar ${item.pt}`);

    if (index >= 0 && !synthetic) {
      box.dataset.index = String(index);
      box.addEventListener('click', () => {
        state.history.length = 0;
        state.rawDetectorKey = p.class;
        state.selectedPrediction = p;
        selectObject(p.class, p, {
          recognition: {
            kind: 'tentative',
            reason: 'Selecionado por toque. Vou conferir a região antes de tratar como certeza.',
            detectorScore: p.score,
            verifierScore: null,
            verifierLabel: '',
            deepScore: null,
            deepLabel: ''
          }
        });
        const sig = `${p.class}:${quantizedBoxSignature(p.bbox)}`;
        state.lastVerifiedSignature = sig;
        verifyStableTarget(p, p.score, sig);
      });
    } else {
      box.tabIndex = -1;
      box.setAttribute('aria-hidden', 'true');
    }
    els.boxes.appendChild(box);
  }

  function renderVocabList() {
    renderVocabularyInto(els.vocabList, els.vocabSearch.value || '', (key) => {
      state.verificationToken += 1;
      state.verifierAlternative = null;
      state.currentCropHash = null;
      state.rawDetectorKey = null;
      selectObject(key, null, {
        recognition: { kind: 'manual', reason: 'Escolhido no vocabulário.', detectorScore: null, verifierScore: null, verifierLabel: '', deepScore: null, deepLabel: '' }
      });
      safeClose(els.vocabDialog);
      setFrozen(true);
      setStatus(`Vocabulário manual · ${JAPANESE_DB[key].jp}`);
      markFamiliar(key, 1);
    });
  }

  function renderCorrectionList() {
    renderVocabularyInto(els.correctionList, els.correctionSearch.value || '', applyCorrection);
  }

  function renderVocabularyInto(container, rawQuery, onChoose) {
    const query = normalize(rawQuery);
    const entries = Object.entries(JAPANESE_DB)
      .filter(([key, item]) => {
        if (!query) return true;
        return [key, item.jp, item.kana, item.romaji, item.pt].some(v => normalize(v).includes(query));
      })
      .sort((a, b) => a[1].pt.localeCompare(b[1].pt, 'pt-BR'));

    container.replaceChildren();
    entries.forEach(([key, item]) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'vocab-item';
      btn.innerHTML = '<span class="main"><span class="jp"></span><span class="sub"></span></span><span class="pt"></span>';
      btn.querySelector('.jp').textContent = item.jp;
      btn.querySelector('.sub').textContent = `${item.kana} · ${item.romaji}`;
      btn.querySelector('.pt').textContent = item.pt;
      btn.addEventListener('click', () => onChoose(key));
      container.appendChild(btn);
    });
  }

  function crosshairPointInVideo() {
    const metrics = videoCoverMetrics();
    const stageRect = els.stage.getBoundingClientRect();
    const targetEl = document.querySelector('.crosshair-wrap');
    const targetRect = targetEl.getBoundingClientRect();
    let cx = targetRect.left + targetRect.width / 2 - stageRect.left;
    const cy = targetRect.top + targetRect.height / 2 - stageRect.top;

    if (state.facingMode === 'user') cx = metrics.cw - cx;

    return {
      x: (cx - metrics.ox) / metrics.scale,
      y: (cy - metrics.oy) / metrics.scale
    };
  }

  function videoCoverMetrics() {
    const cw = els.stage.clientWidth;
    const ch = els.stage.clientHeight;
    const vw = els.video.videoWidth || 1;
    const vh = els.video.videoHeight || 1;
    const scale = Math.max(cw / vw, ch / vh);
    const rw = vw * scale;
    const rh = vh * scale;
    return { cw, ch, vw, vh, scale, ox: (cw - rw) / 2, oy: (ch - rh) / 2 };
  }

  function pointInBox(x, y, bbox) {
    return x >= bbox[0] && x <= bbox[0] + bbox[2] && y >= bbox[1] && y <= bbox[1] + bbox[3];
  }

  function distanceToBox(x, y, bbox) {
    const dx = Math.max(bbox[0] - x, 0, x - (bbox[0] + bbox[2]));
    const dy = Math.max(bbox[1] - y, 0, y - (bbox[1] + bbox[3]));
    return Math.hypot(dx, dy);
  }

  function scoreTarget(prediction, x, y) {
    const [bx, by, bw, bh] = prediction.bbox;
    const cx = bx + bw / 2;
    const cy = by + bh / 2;
    const diagonal = Math.hypot(els.video.videoWidth || 1, els.video.videoHeight || 1);
    const centerPenalty = Math.hypot(cx - x, cy - y) / Math.max(1, diagonal);
    const areaBonus = Math.min(0.08, (bw * bh) / Math.max(1, els.video.videoWidth * els.video.videoHeight) * 0.18);
    return prediction.score + areaBonus - centerPenalty * 0.18;
  }

  function quantizedBoxSignature(bbox) {
    const vw = els.video.videoWidth || 1;
    const vh = els.video.videoHeight || 1;
    const cx = bbox[0] + bbox[2] / 2;
    const cy = bbox[1] + bbox[3] / 2;
    const qx = Math.round((cx / vw) * 8);
    const qy = Math.round((cy / vh) * 8);
    const qw = Math.round((bbox[2] / vw) * 8);
    const qh = Math.round((bbox[3] / vh) * 8);
    return `${qx},${qy},${qw},${qh}`;
  }

  function samePredictionIdentity(a, b) {
    if (!a || !b || a.class !== b.class) return false;
    const acx = a.bbox[0] + a.bbox[2] / 2;
    const acy = a.bbox[1] + a.bbox[3] / 2;
    const bcx = b.bbox[0] + b.bbox[2] / 2;
    const bcy = b.bbox[1] + b.bbox[3] / 2;
    const scale = Math.max(40, Math.min(a.bbox[2] + a.bbox[3], b.bbox[2] + b.bbox[3]) / 4);
    return Math.hypot(acx - bcx, acy - bcy) <= scale;
  }

  function bboxIoU(a, b) {
    if (!a || !b) return 0;
    const x1 = Math.max(a[0], b[0]);
    const y1 = Math.max(a[1], b[1]);
    const x2 = Math.min(a[0] + a[2], b[0] + b[2]);
    const y2 = Math.min(a[1] + a[3], b[1] + b[3]);
    const inter = Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
    const union = Math.max(1, a[2] * a[3] + b[2] * b[3] - inter);
    return inter / union;
  }

  function showEmptyState(title, subtitle) {
    els.emptyHint.querySelector('strong').textContent = title;
    els.emptyHint.querySelector('span').textContent = subtitle;
    els.emptyHint.classList.remove('hidden');
  }

  function restoreControls() {
    const immersionValues = ['auto', '1', '2', '3'];
    if (!immersionValues.includes(state.immersionSetting)) state.immersionSetting = 'auto';
    els.immersion.value = state.immersionSetting;
    els.confidence.value = String(clamp(state.minScore, 0.35, 0.80));
    state.minScore = Number(els.confidence.value);
    els.confidenceValue.value = `${Math.round(state.minScore * 100)}%`;
    els.deepVision.checked = state.deepVisionEnabled;
    els.showBoxes.checked = state.showBoxes;
    els.diagnostics.checked = state.diagnostics;
  }

  function updateMemoryControls() {
    if (els.correctionCount) els.correctionCount.textContent = String(state.corrections.length);
    if (els.clearCorrections) els.clearCorrections.disabled = state.corrections.length === 0;
  }

  function updateDemoButtons() {
    els.demoControl.querySelectorAll('[data-demo]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.demo === state.demonstrative);
    });
  }

  function normalize(value) {
    return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  }

  function speak(text) {
    if (!('speechSynthesis' in window)) {
      showToast('Síntese de voz não disponível neste navegador.');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.88;
    const voices = window.speechSynthesis.getVoices();
    const jaVoice = voices.find(v => /^ja(-|_)/i.test(v.lang));
    if (jaVoice) utterance.voice = jaVoice;
    window.speechSynthesis.speak(utterance);
  }

  function setStatus(text) {
    els.status.textContent = text;
  }

  function showToast(message, ms = 2400) {
    clearTimeout(state.toastTimer);
    els.toast.textContent = message;
    els.toast.classList.add('show');
    state.toastTimer = setTimeout(() => els.toast.classList.remove('show'), ms);
  }

  function safeShowModal(dialog) {
    if (!dialog?.open && typeof dialog?.showModal === 'function') dialog.showModal();
  }

  function safeClose(dialog) {
    if (dialog?.open && typeof dialog?.close === 'function') dialog.close();
  }

  function finiteOr(value, fallback) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function readJson(key, fallback) {
    try {
      const parsed = JSON.parse(localStorage.getItem(key));
      return parsed ?? fallback;
    } catch (_) {
      return fallback;
    }
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }
})();
