'use strict';

(() => {
  const els = {
    stage: document.getElementById('cameraStage'),
    video: document.getElementById('camera'),
    boxes: document.getElementById('boxesLayer'),
    status: document.getElementById('statusText'),
    start: document.getElementById('startBtn'),
    flip: document.getElementById('flipCameraBtn'),
    settings: document.getElementById('settingsBtn'),
    settingsDialog: document.getElementById('settingsDialog'),
    vocabDialog: document.getElementById('vocabDialog'),
    onboarding: document.getElementById('onboardingDialog'),
    onboardingContinue: document.getElementById('onboardingContinue'),
    holdRing: document.getElementById('holdRing'),
    emptyHint: document.getElementById('emptyHint'),
    lessonCard: document.getElementById('lessonCard'),
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
    showBoxes: document.getElementById('showBoxesToggle'),
    demoControl: document.getElementById('demonstrativeControl'),
    vocabBtn: document.getElementById('vocabBtn'),
    vocabSearch: document.getElementById('vocabSearch'),
    vocabList: document.getElementById('vocabList'),
    toast: document.getElementById('toast')
  };

  const state = {
    model: null,
    modelError: null,
    stream: null,
    cameraStarted: false,
    facingMode: 'environment',
    detecting: false,
    mode: 'explore',
    demonstrative: localStorage.getItem('mn-demo') || 'kore',
    immersion: Number(localStorage.getItem('mn-immersion') || 1),
    minScore: Number(localStorage.getItem('mn-score') || 0.50),
    showBoxes: localStorage.getItem('mn-boxes') !== '0',
    selectedPrediction: null,
    selectedKey: null,
    frozen: false,
    actionIndex: 0,
    quizRevealed: false,
    candidateSignature: null,
    candidateSince: 0,
    stableMs: 700,
    lastPredictions: [],
    detectionTimer: null,
    toastTimer: null
  };

  init();

  function init() {
    restoreControls();
    bindEvents();
    renderVocabList();
    updateDemoButtons();
    updateImmersionVisibility();

    if (!localStorage.getItem('mn-onboarded')) {
      requestAnimationFrame(() => {
        if (typeof els.onboarding.showModal === 'function') els.onboarding.showModal();
      });
    }

    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch(() => {});
      });
    }

    loadModel();
  }

  function bindEvents() {
    els.start.addEventListener('click', startCamera);
    els.flip.addEventListener('click', flipCamera);
    els.settings.addEventListener('click', () => els.settingsDialog.showModal());
    els.vocabBtn.addEventListener('click', () => els.vocabDialog.showModal());
    els.onboardingContinue.addEventListener('click', () => localStorage.setItem('mn-onboarded', '1'));

    document.querySelectorAll('.mode-btn[data-mode]').forEach(btn => {
      btn.addEventListener('click', () => setMode(btn.dataset.mode));
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
      state.immersion = Number(els.immersion.value);
      localStorage.setItem('mn-immersion', String(state.immersion));
      updateImmersionVisibility();
      renderLesson();
    });

    els.confidence.addEventListener('input', () => {
      state.minScore = Number(els.confidence.value);
      els.confidenceValue.value = `${Math.round(state.minScore * 100)}%`;
      localStorage.setItem('mn-score', String(state.minScore));
    });

    els.showBoxes.addEventListener('change', () => {
      state.showBoxes = els.showBoxes.checked;
      localStorage.setItem('mn-boxes', state.showBoxes ? '1' : '0');
      renderBoxes(state.lastPredictions, state.selectedPrediction);
    });

    els.speakWord.addEventListener('click', () => {
      const item = currentItem();
      if (item) speak(item.jp);
    });

    els.speakSentence.addEventListener('click', () => {
      const phrase = state.mode === 'quiz' && !state.quizRevealed ? currentQuizQuestion() : currentSentence();
      if (phrase) speak(phrase.jp);
    });

    els.nextAction.addEventListener('click', () => {
      const item = currentItem();
      if (!item) return;
      const actions = item.actions?.length ? item.actions : [fallbackAction(item)];
      state.actionIndex = (state.actionIndex + 1) % actions.length;
      state.quizRevealed = false;
      renderLesson();
    });

    els.freeze.addEventListener('click', () => {
      if (!state.selectedKey) return;
      state.frozen = !state.frozen;
      els.freeze.classList.toggle('active', state.frozen);
      els.freeze.textContent = state.frozen ? '✓ Travado' : '⌾ Travar';
      showToast(state.frozen ? 'Objeto travado.' : 'Detecção liberada.');
    });

    els.reveal.addEventListener('click', () => {
      state.quizRevealed = true;
      renderLesson();
    });

    els.vocabSearch.addEventListener('input', renderVocabList);

    window.addEventListener('resize', () => renderBoxes(state.lastPredictions, state.selectedPrediction));
    window.addEventListener('pagehide', stopCamera);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && window.speechSynthesis) window.speechSynthesis.cancel();
    });
  }

  async function loadModel() {
    setStatus('Carregando IA de objetos…');
    try {
      if (!window.tf || !window.cocoSsd) throw new Error('Bibliotecas de IA indisponíveis.');
      try {
        await tf.setBackend('webgl');
      } catch (_) {
        await tf.setBackend('cpu');
      }
      await tf.ready();
      state.model = await cocoSsd.load({ base: 'lite_mobilenet_v2' });
      setStatus(state.cameraStarted ? 'IA pronta · mire em um objeto' : 'IA pronta · abra a câmera');
      if (state.cameraStarted) scheduleDetection(50);
    } catch (error) {
      state.modelError = error;
      setStatus('IA visual indisponível · use Vocabulário');
      showToast('Não consegui carregar a IA visual. O modo manual continua funcionando.', 4500);
      console.error(error);
    }
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
      setStatus(state.model ? 'IA pronta · mire em um objeto' : 'Câmera pronta · carregando IA…');
      if (state.model) scheduleDetection(80);
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
    state.frozen = false;
    els.freeze.classList.remove('active');
    els.freeze.textContent = '⌾ Travar';
    setStatus('Trocando câmera…');
    try {
      await openCamera(state.facingMode);
      setStatus(state.model ? 'IA pronta · mire em um objeto' : 'Câmera pronta');
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
      setTimeout(done, 1500);
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

  function scheduleDetection(delay = 500) {
    clearTimeout(state.detectionTimer);
    state.detectionTimer = setTimeout(detectFrame, delay);
  }

  async function detectFrame() {
    if (!state.model || !state.cameraStarted || state.detecting || document.hidden) {
      scheduleDetection(650);
      return;
    }
    if (els.video.readyState < 2 || !els.video.videoWidth) {
      scheduleDetection(350);
      return;
    }

    state.detecting = true;
    try {
      const predictions = await state.model.detect(els.video, 20, state.minScore);
      state.lastPredictions = predictions.filter(p => JAPANESE_DB[p.class]);
      const target = chooseTarget(state.lastPredictions);

      if (!state.frozen) updateStableTarget(target);
      renderBoxes(state.lastPredictions, target);
    } catch (error) {
      console.error(error);
      setStatus('Falha temporária na detecção');
    } finally {
      state.detecting = false;
      scheduleDetection(520);
    }
  }

  function chooseTarget(predictions) {
    if (!predictions.length) return null;
    const { x, y } = crosshairPointInVideo();

    const containing = predictions.filter(p => pointInBox(x, y, p.bbox));
    if (containing.length) {
      return containing.sort((a, b) => scoreTarget(b, x, y) - scoreTarget(a, x, y))[0];
    }

    const maxDistance = Math.min(els.video.videoWidth, els.video.videoHeight) * 0.13;
    const near = predictions
      .map(p => ({ p, d: distanceToBox(x, y, p.bbox) }))
      .filter(v => v.d <= maxDistance)
      .sort((a, b) => a.d - b.d || b.p.score - a.p.score);
    return near[0]?.p || null;
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
    const bx = Math.max(bbox[0], Math.min(x, bbox[0] + bbox[2]));
    const by = Math.max(bbox[1], Math.min(y, bbox[1] + bbox[3]));
    return Math.hypot(x - bx, y - by);
  }

  function scoreTarget(prediction, x, y) {
    const [bx, by, bw, bh] = prediction.bbox;
    const centerDist = Math.hypot(x - (bx + bw / 2), y - (by + bh / 2));
    const diag = Math.hypot(els.video.videoWidth || 1, els.video.videoHeight || 1);
    const centered = 1 - Math.min(1, centerDist / (diag * 0.35));
    return prediction.score * 0.7 + centered * 0.3;
  }

  function updateStableTarget(target) {
    if (!target) {
      state.candidateSignature = null;
      state.candidateSince = 0;
      els.holdRing.className = 'hold-ring';
      if (!state.selectedKey) showEmptyState('Aponte a mira para um objeto', 'Segure por um instante para estabilizar a detecção.');
      return;
    }

    const signature = target.class;
    if (state.candidateSignature !== signature) {
      state.candidateSignature = signature;
      state.candidateSince = performance.now();
      els.holdRing.className = 'hold-ring loading';
      setStatus(`Vendo ${JAPANESE_DB[target.class].jp}… mantenha a mira`);
      return;
    }

    const elapsed = performance.now() - state.candidateSince;
    if (elapsed >= state.stableMs) {
      els.holdRing.className = 'hold-ring locked';
      if (state.selectedKey !== target.class) {
        selectObject(target.class, target, false);
      } else {
        state.selectedPrediction = target;
      }
      setStatus(`${JAPANESE_DB[target.class].jp} · ${Math.round(target.score * 100)}%`);
    }
  }

  function selectObject(key, prediction = null, manual = false) {
    if (!JAPANESE_DB[key]) return;
    state.selectedKey = key;
    state.selectedPrediction = prediction;
    state.actionIndex = 0;
    state.quizRevealed = false;
    els.emptyHint.classList.add('hidden');
    els.lessonCard.classList.remove('hidden');
    renderLesson();
    if (manual) {
      els.vocabDialog.close();
      setStatus(`Modo manual · ${JAPANESE_DB[key].jp}`);
      showToast('Selecionado manualmente.');
    }
  }

  function showEmptyState(title, subtitle) {
    els.emptyHint.querySelector('strong').textContent = title;
    els.emptyHint.querySelector('span').textContent = subtitle;
    els.emptyHint.classList.remove('hidden');
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

    if (state.mode === 'quiz') {
      if (state.selectedKey === 'person') {
        return {
          jp: '人が見えます。',
          romaji: 'Hito ga miemasu.',
          pt: 'Vejo uma pessoa.'
        };
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

    els.jpWord.textContent = item.jp;
    els.kana.textContent = item.kana;
    els.romaji.textContent = item.romaji;
    els.translation.textContent = item.pt;

    const inQuiz = state.mode === 'quiz';
    els.quizPanel.classList.toggle('hidden', !inQuiz);
    els.sentenceJp.parentElement.classList.toggle('hidden', inQuiz && !state.quizRevealed);
    els.translation.classList.toggle('hidden', inQuiz && !state.quizRevealed || state.immersion >= 2);
    els.jpWord.classList.toggle('hidden', inQuiz && !state.quizRevealed);
    els.kana.classList.toggle('hidden', inQuiz && !state.quizRevealed);
    els.romaji.classList.toggle('hidden', inQuiz && !state.quizRevealed || state.immersion >= 3);
    els.speakWord.classList.toggle('hidden', inQuiz && !state.quizRevealed);

    if (inQuiz) {
      const question = currentQuizQuestion();
      els.quizQuestion.textContent = question.jp;
      els.reveal.textContent = state.quizRevealed ? 'Resposta revelada' : 'Revelar resposta';
      els.reveal.disabled = state.quizRevealed;
    }

    els.sentenceJp.textContent = sentence.jp;
    els.sentenceRomaji.textContent = sentence.romaji;
    els.sentencePt.textContent = sentence.pt;
    els.sentenceRomaji.classList.toggle('hidden', state.immersion >= 3);
    els.sentencePt.classList.toggle('hidden', state.immersion >= 2);

    const actionCount = item.actions?.length || 1;
    els.nextAction.classList.toggle('hidden', state.mode !== 'actions' || actionCount <= 1);
    updateImmersionVisibility();
  }

  function updateImmersionVisibility() {
    const inQuizHidden = state.mode === 'quiz' && !state.quizRevealed;
    if (!inQuizHidden) {
      els.translation.classList.toggle('hidden', state.immersion >= 2);
      els.romaji.classList.toggle('hidden', state.immersion >= 3);
    }
    els.sentenceRomaji.classList.toggle('hidden', state.immersion >= 3);
    els.sentencePt.classList.toggle('hidden', state.immersion >= 2);
  }

  function setMode(mode) {
    state.mode = mode;
    state.actionIndex = 0;
    state.quizRevealed = false;
    document.querySelectorAll('.mode-btn[data-mode]').forEach(btn => btn.classList.toggle('active', btn.dataset.mode === mode));
    renderLesson();

    const labels = {
      explore: 'Identificação: これは…',
      actions: 'Ações naturais com o objeto',
      location: 'Localização: ここ・そこ・あそこ',
      quiz: 'Quiz: responda antes de revelar'
    };
    showToast(labels[mode]);
  }

  function renderBoxes(predictions, target) {
    els.boxes.replaceChildren();
    if (!state.showBoxes || !state.cameraStarted || !els.video.videoWidth) return;
    const m = videoCoverMetrics();

    predictions.forEach((p, index) => {
      const [x, y, w, h] = p.bbox;
      const box = document.createElement('button');
      box.type = 'button';
      box.className = 'detection-box';
      if (target && p === target) box.classList.add('selected');
      box.style.left = `${m.ox + x * m.scale}px`;
      box.style.top = `${m.oy + y * m.scale}px`;
      box.style.width = `${w * m.scale}px`;
      box.style.height = `${h * m.scale}px`;

      const label = document.createElement('span');
      const item = JAPANESE_DB[p.class];
      label.textContent = `${item.jp} · ${Math.round(p.score * 100)}%`;
      box.appendChild(label);
      box.dataset.index = String(index);
      box.setAttribute('aria-label', `Selecionar ${item.pt}, ${Math.round(p.score * 100)}%`);
      box.addEventListener('click', () => selectObject(p.class, p, true));
      els.boxes.appendChild(box);
    });
  }

  function renderVocabList() {
    const query = normalize(els.vocabSearch.value || '');
    const entries = Object.entries(JAPANESE_DB)
      .filter(([key, item]) => {
        if (!query) return true;
        return [key, item.jp, item.kana, item.romaji, item.pt].some(v => normalize(v).includes(query));
      })
      .sort((a, b) => a[1].pt.localeCompare(b[1].pt, 'pt-BR'));

    els.vocabList.replaceChildren();
    entries.forEach(([key, item]) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'vocab-item';
      btn.innerHTML = `<span class="main"><span class="jp"></span><span class="sub"></span></span><span class="pt"></span>`;
      btn.querySelector('.jp').textContent = item.jp;
      btn.querySelector('.sub').textContent = `${item.kana} · ${item.romaji}`;
      btn.querySelector('.pt').textContent = item.pt;
      btn.addEventListener('click', () => selectObject(key, null, true));
      els.vocabList.appendChild(btn);
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

  function restoreControls() {
    els.immersion.value = String(state.immersion);
    els.confidence.value = String(state.minScore);
    els.confidenceValue.value = `${Math.round(state.minScore * 100)}%`;
    els.showBoxes.checked = state.showBoxes;
  }

  function updateDemoButtons() {
    els.demoControl.querySelectorAll('[data-demo]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.demo === state.demonstrative);
    });
  }

  function setStatus(text) {
    els.status.textContent = text;
  }

  function showToast(message, ms = 2200) {
    clearTimeout(state.toastTimer);
    els.toast.textContent = message;
    els.toast.classList.add('show');
    state.toastTimer = setTimeout(() => els.toast.classList.remove('show'), ms);
  }
})();
