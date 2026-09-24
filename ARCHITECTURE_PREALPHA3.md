# Architecture — Mira Nihongo V1.0 Pre-Alpha 3

## 1. Goal

Add semantic AI and visual-language AI to the consolidated 2.1 runtime without regressing camera responsiveness or making a remote API part of the core.

## 2. Invariants

- Perception Router is the single heavy-work authority.
- One heavy task at a time.
- Unknown remains valid.
- AI evidence is evidence, not truth.
- Context/AI cannot create an entity without sufficient visual/textual evidence.
- Models are lazy and absent from critical startup.
- User confirmation remains authoritative for memory/corrections.
- Auto Freeze default remains ON if no preference exists.

## 3. Semantic AI

`semantic-ai-v1.js` owns candidate generation, score policy and Evidence Fusion adapter.

`semantic-ai-worker-v1.js` owns model loading and inference:

```text
Frozen crop
  ↓
CLIP zero-shot image classification
  ↓
ranked candidate scores
  ↓
semantic decision
  ↓
Evidence Fusion
  ↓
World Model / tentative or stable UI
```

A divergent AI answer is intentionally tentative. A stable result is allowed only when the semantic score and margin pass conservative thresholds.

## 4. Language AI

`language-ai-v1.js`:
- language detection (browser API if present, heuristic fallback);
- Browser Translator direct to Japanese when present;
- worker fallback otherwise.

`language-ai-worker-v1.js`:
- PT -> EN through ROMANCE-en;
- EN -> JA through en-jap;
- q8/WASM;
- models disposed after use.

## 5. Japanese Reading

`japanese-reading-v1.js` remains deterministic for known vocabulary/common phrases and adds asynchronous reading fallback.

`japanese-reading-worker-v1.js` loads Kuromoji only when translated Japanese still contains unresolved kanji. Token readings are returned to the main module and converted to hiragana/rōmaji.

This stage is scheduled after translation, through the same Budget Router.

## 6. OCR / Lens-style overlay

`ocr-engine-v1.js` now returns:
- text;
- confidence;
- words + boxes;
- lines + boxes.

If Tesseract does not expose safe line objects, line boxes are reconstructed from word geometry.

Translations are index-aligned with OCR lines and rendered as non-interactive overlays containing Japanese and rōmaji.

## 7. Lifecycle

Startup:

```text
HTML/CSS → UI → camera intent → fast perception
```

Not loaded at startup:
- CLIP;
- Marian translation models;
- Kuromoji dictionary;
- OCR runtime/languages;
- specialist deep models unless requested by the frozen-scene route.

## 8. Privacy

Camera/crop data stays inside browser memory/worker messaging. External network access is for runtime/model/dictionary assets, not for uploading the photograph to a Mira backend.

## 9. Known limits

- CLIP is candidate-based zero-shot verification, not open-ended VLM captioning.
- Browser support for WebGPU/Translator varies; fallbacks exist but require physical testing.
- External model caches are browser-managed; first-use offline behavior cannot be guaranteed before assets are downloaded.
- Kuromoji reading quality depends on dictionary tokenization and may not represent every proper name/creative spelling perfectly.
