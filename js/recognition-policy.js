'use strict';

(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.MiraRecognitionPolicy = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  // Classes that repeatedly produced misleading high-confidence results in
  // physical tests. They always require the lightweight detail verifier.
  const CONFUSION_GROUPS = {
    frisbee: ['frisbee', 'bottle_cap', 'plate', 'lid'],
    skateboard: ['skateboard', 'utility_knife', 'shoe', 'remote', 'knife', 'scissors'],
    person: ['person', 'hand', 'shoe'],
    suitcase: ['suitcase', 'cardboard_box', 'box', 'backpack', 'handbag'],
    oven: ['oven', 'cardboard_box', 'box', 'microwave', 'refrigerator'],
    bench: ['bench', 'shelf', 'dining table', 'chair'],
    'dining table': ['dining table', 'shelf', 'cardboard_box', 'box'],
    bottle: ['bottle', 'cup', 'bottle_cap'],
    cup: ['cup', 'bottle', 'mug'],
    knife: ['knife', 'utility_knife', 'scissors'],
    scissors: ['scissors', 'utility_knife', 'knife']
  };

  const ALWAYS_VERIFY = new Set(Object.keys(CONFUSION_GROUPS));
  const CONTAINER_CLASSES = new Set(['suitcase', 'backpack', 'handbag', 'box', 'cardboard_box', 'bowl', 'cup', 'food_container', 'lunchbox', 'jar']);
  const SUPPORT_CLASSES = new Set(['dining table', 'desk', 'bench', 'chair', 'couch', 'shelf']);

  function isHighConfusion(rawClass) {
    return Boolean(rawClass && ALWAYS_VERIFY.has(rawClass));
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

  // Relations are intentionally conservative. Two-dimensional geometry cannot
  // prove contact or containment, so weak candidates are discarded instead of
  // being taught as facts.
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
    CONFUSION_GROUPS,
    isHighConfusion,
    inferSceneRelation,
    makeCrosshairBox
  };
});
