'use strict';

(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.MiraRecognitionPolicy = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  // Curated open-vocabulary labels. The English prompt is optimized for vision
  // models, while the key points to our controlled Japanese vocabulary.
  const OPEN_VOCAB = [
    ['utility knife / box cutter', 'utility_knife'],
    ['cardboard shipping box', 'cardboard_box'],
    ['plain storage box', 'box'],
    ['electric desk fan', 'fan'],
    ['human hand / open palm', 'hand'],
    ['shoe / work boot / sneaker', 'shoe'],
    ['human person', 'person'],
    ['skateboard', 'skateboard'],
    ['suitcase / travel luggage', 'suitcase'],
    ['backpack', 'backpack'],
    ['handbag', 'handbag'],
    ['scissors', 'scissors'],
    ['kitchen knife', 'knife'],
    ['pen', 'pen'],
    ['pencil', 'pencil'],
    ['screwdriver', 'screwdriver'],
    ['hammer', 'hammer'],
    ['pliers', 'pliers'],
    ['adhesive tape roll', 'tape'],
    ['ruler', 'ruler'],
    ['keys', 'key'],
    ['door', 'door'],
    ['window', 'window'],
    ['wall', 'wall'],
    ['floor', 'floor'],
    ['ceiling', 'ceiling'],
    ['metal shelf / storage rack', 'shelf'],
    ['drawer', 'drawer'],
    ['work table / desk', 'dining table'],
    ['park bench / bench seat', 'bench'],
    ['chair', 'chair'],
    ['sofa', 'couch'],
    ['cell phone / smartphone', 'cell phone'],
    ['laptop computer', 'laptop'],
    ['computer keyboard', 'keyboard'],
    ['computer mouse', 'mouse'],
    ['remote control', 'remote'],
    ['charging cable', 'cable'],
    ['phone charger', 'charger'],
    ['lamp / light fixture', 'lamp'],
    ['eyeglasses', 'glasses'],
    ['book', 'book'],
    ['bottle', 'bottle'],
    ['drinking cup / mug', 'cup'],
    ['bowl', 'bowl'],
    ['fork', 'fork'],
    ['spoon', 'spoon'],
    ['refrigerator', 'refrigerator'],
    ['microwave oven', 'microwave'],
    ['kitchen oven', 'oven'],
    ['toaster', 'toaster'],
    ['sink', 'sink'],
    ['television / monitor', 'tv'],
    ['clock', 'clock'],
    ['flower vase', 'vase'],
    ['potted plant', 'potted plant'],
    ['toothbrush', 'toothbrush'],
    ['hair dryer', 'hair drier'],
    ['bicycle', 'bicycle'],
    ['motorcycle', 'motorcycle'],
    ['car', 'car'],
    ['bus', 'bus'],
    ['truck', 'truck'],
    ['train', 'train'],
    ['boat', 'boat'],
    ['airplane', 'airplane'],
    ['cat', 'cat'],
    ['dog', 'dog'],
    ['banana', 'banana'],
    ['apple', 'apple'],
    ['orange fruit', 'orange']
  ].map(([label, key]) => ({ label, key }));

  // Real errors observed on the physical V0/V0.1 test are explicitly encoded
  // here so these broad detector classes always receive extra scrutiny.
  const CONFUSION_GROUPS = {
    skateboard: ['skateboard', 'utility_knife', 'shoe', 'remote', 'knife', 'scissors'],
    person: ['person', 'hand', 'shoe'],
    suitcase: ['suitcase', 'cardboard_box', 'box', 'backpack', 'handbag'],
    oven: ['oven', 'cardboard_box', 'box', 'microwave', 'refrigerator'],
    bench: ['bench', 'shelf', 'dining table', 'chair'],
    'dining table': ['dining table', 'shelf', 'cardboard_box', 'box'],
    bottle: ['bottle', 'cup'],
    cup: ['cup', 'bottle'],
    knife: ['knife', 'utility_knife', 'scissors'],
    scissors: ['scissors', 'utility_knife', 'knife']
  };

  const ALWAYS_DEEP = new Set(Object.keys(CONFUSION_GROUPS));
  const CONTAINER_CLASSES = new Set(['suitcase', 'backpack', 'handbag', 'box', 'cardboard_box', 'bowl', 'cup']);
  const SUPPORT_CLASSES = new Set(['dining table', 'bench', 'chair', 'couch', 'shelf']);

  function descriptorForKey(key) {
    return OPEN_VOCAB.find(x => x.key === key) || null;
  }

  function candidateDescriptors(rawClass, max = 38) {
    const chosen = [];
    const seen = new Set();
    const addKey = key => {
      const d = descriptorForKey(key);
      if (d && !seen.has(d.label)) {
        seen.add(d.label);
        chosen.push(d);
      }
    };

    if (rawClass) {
      addKey(rawClass);
      const confusion = CONFUSION_GROUPS[rawClass] || [];
      for (const key of confusion) addKey(key);
      // For known confusion families, a short candidate list is both faster and
      // more discriminative than comparing against dozens of unrelated labels.
      if (confusion.length) return chosen.slice(0, max);
    } else {
      // Put the physical regression cases first. This also keeps useful classes
      // in the candidate set when we cap it for performance on mobile.
      [
        'utility_knife', 'cardboard_box', 'box', 'fan', 'hand', 'shoe', 'person',
        'shelf', 'dining table', 'chair', 'cell phone', 'bottle', 'cup', 'key',
        'door', 'window', 'floor', 'wall', 'pen', 'pencil', 'scissors', 'knife',
        'screwdriver', 'hammer', 'pliers', 'tape', 'ruler', 'cable', 'charger',
        'lamp', 'glasses', 'book'
      ].forEach(addKey);
    }

    for (const d of OPEN_VOCAB) {
      if (chosen.length >= max) break;
      if (!seen.has(d.label)) {
        seen.add(d.label);
        chosen.push(d);
      }
    }
    return chosen.slice(0, max);
  }

  function isHighConfusion(rawClass) {
    return Boolean(rawClass && ALWAYS_DEEP.has(rawClass));
  }

  function shouldRunDeep(rawClass, detectorScore, verifierConflict = false) {
    if (!rawClass) return true;
    if (ALWAYS_DEEP.has(rawClass)) return true;
    if (!descriptorForKey(rawClass)) return false;
    if (verifierConflict) return true;
    return !Number.isFinite(detectorScore) || detectorScore < 0.78;
  }

  function normalizeDeepResults(results, descriptors) {
    const map = new Map(descriptors.map(d => [d.label, d.key]));
    return (results || [])
      .map(r => ({ label: r.label, score: Number(r.score) || 0, key: map.get(r.label) || null }))
      .filter(r => r.key)
      .sort((a, b) => b.score - a.score);
  }

  // Zero-shot scores are relative to the candidate labels, not calibrated
  // probabilities. Decisions therefore use both top score and top-vs-second margin.
  function decideDeepRecognition(results, rawClass, detectorScore) {
    const ranked = (results || []).filter(r => r && r.key).sort((a, b) => b.score - a.score);
    const top = ranked[0] || null;
    const second = ranked[1] || { score: 0 };
    if (!top) return { accept: false, stable: false, reason: 'no-result', top: null, second: null, margin: 0 };

    const margin = Math.max(0, top.score - (second.score || 0));
    const same = Boolean(rawClass && top.key === rawClass);
    const isNoDetector = !rawClass;
    const specialPersonPart = rawClass === 'person' && (top.key === 'hand' || top.key === 'shoe');
    const confusion = Boolean(rawClass && ALWAYS_DEEP.has(rawClass));

    let accept = false;
    let stable = false;

    if (isNoDetector) {
      accept = (top.score >= 0.18 && margin >= 0.035) || (top.score >= 0.28 && margin >= 0.018);
      stable = accept && top.score >= 0.24 && margin >= 0.04;
    } else if (same) {
      accept = top.score >= 0.10;
      stable = top.score >= 0.16 || (Number(detectorScore) >= 0.82 && top.score >= 0.11);
    } else if (specialPersonPart) {
      accept = top.score >= 0.15 && margin >= 0.025;
      stable = top.score >= 0.21 && margin >= 0.035;
    } else if (confusion || Number(detectorScore) < 0.82) {
      accept = top.score >= 0.18 && margin >= 0.03;
      stable = top.score >= 0.24 && margin >= 0.045;
    } else {
      accept = top.score >= 0.27 && margin >= 0.05;
      stable = top.score >= 0.34 && margin >= 0.065;
    }

    return {
      accept,
      stable,
      top,
      second,
      margin,
      same,
      reason: accept ? (same ? 'deep-confirms' : 'deep-override') : 'deep-uncertain'
    };
  }

  function intersectionArea(a, b) {
    const ax2 = a[0] + a[2];
    const ay2 = a[1] + a[3];
    const bx2 = b[0] + b[2];
    const by2 = b[1] + b[3];
    const w = Math.max(0, Math.min(ax2, bx2) - Math.max(a[0], b[0]));
    const h = Math.max(0, Math.min(ay2, by2) - Math.max(a[1], b[1]));
    return w * h;
  }

  function horizontalOverlapRatio(a, b) {
    const left = Math.max(a[0], b[0]);
    const right = Math.min(a[0] + a[2], b[0] + b[2]);
    return Math.max(0, right - left) / Math.max(1, Math.min(a[2], b[2]));
  }

  // Scene relations are deliberately conservative: a geometry-only camera view
  // cannot prove physical containment or contact. We only emit relations that pass
  // semantic and spatial gates; otherwise the app falls back instead of guessing.
  function inferSceneRelation(target, others) {
    if (!target?.bbox || !Array.isArray(others)) return null;
    const a = target.bbox;
    const acx = a[0] + a[2] / 2;
    const acy = a[1] + a[3] / 2;
    const candidates = [];

    for (const other of others) {
      if (!other?.bbox || other === target) continue;
      const b = other.bbox;
      const bcx = b[0] + b[2] / 2;
      const bcy = b[1] + b[3] / 2;
      const areaA = Math.max(1, a[2] * a[3]);
      const inter = intersectionArea(a, b);
      const insideRatio = inter / areaA;
      const overlapX = horizontalOverlapRatio(a, b);
      const targetBottom = a[1] + a[3];
      const supportTop = b[1];
      const gapBottomToTop = Math.abs(targetBottom - supportTop);
      const nearContact = gapBottomToTop <= Math.max(18, Math.min(a[3], b[3]) * 0.22);
      const dx = acx - bcx;
      const dy = acy - bcy;
      const norm = Math.max(1, Math.hypot(b[2], b[3]));
      const className = other.class || '';

      let relation = null;
      let score = 0;

      if (CONTAINER_CLASSES.has(className) && insideRatio >= 0.86 && a[2] <= b[2] * 0.88 && a[3] <= b[3] * 0.88) {
        relation = 'inside';
        score = 1.25 + insideRatio;
      } else if (SUPPORT_CLASSES.has(className) && overlapX >= 0.38 && acy < bcy) {
        relation = nearContact ? 'on' : 'above';
        score = 1 + overlapX - Math.abs(dy) / norm * 0.08;
      } else if (overlapX >= 0.36 && acy < bcy && Math.abs(dy) / norm <= 1.35) {
        relation = 'above';
        score = 0.88 + overlapX - Math.abs(dy) / norm * 0.08;
      } else if (overlapX >= 0.34 && acy > bcy && Math.abs(dy) / norm <= 1.35) {
        relation = 'below';
        score = 0.82 + overlapX - Math.abs(dy) / norm * 0.08;
      } else if (Math.abs(dx) > Math.abs(dy) * 1.2 && Math.abs(dx) / norm <= 1.6) {
        relation = dx < 0 ? 'left' : 'right';
        score = 0.58 - Math.abs(dx) / norm * 0.06;
      }

      if (!relation) continue;
      const minScore = relation === 'inside' ? 2.08
        : relation === 'on' ? 1.18
          : (relation === 'above' || relation === 'below') ? 1.05
            : 0.48;
      if (score >= minScore) candidates.push({ relation, other, score });
    }

    return candidates.sort((x, y) => y.score - x.score)[0] || null;
  }

  function makeCrosshairBox(videoWidth, videoHeight, point, ratio = 0.38) {
    const side = Math.max(96, Math.min(videoWidth, videoHeight) * ratio);
    const w = Math.min(side, videoWidth);
    const h = Math.min(side, videoHeight);
    const x = Math.max(0, Math.min(videoWidth - w, point.x - w / 2));
    const y = Math.max(0, Math.min(videoHeight - h, point.y - h / 2));
    return [x, y, w, h];
  }

  return {
    OPEN_VOCAB,
    CONFUSION_GROUPS,
    candidateDescriptors,
    isHighConfusion,
    shouldRunDeep,
    normalizeDeepResults,
    decideDeepRecognition,
    inferSceneRelation,
    makeCrosshairBox
  };
});
