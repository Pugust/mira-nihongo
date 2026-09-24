# QA — Mira Nihongo V1.0 Pre-Alpha 3 — Semantic AI

## Scope

This report distinguishes automated/code validation from physical Android validation.

## Automated validation

Validated locally in the build workspace:

- **25/25 JavaScript test files pass**;
- **static QA: 242/242 pass**;
- **26 JavaScript/Service Worker files pass syntax check**;
- **build-manifest integrity test passes**;
- legacy V0.5–2.1 regression suites remain green;
- Semantic AI policy tests pass;
- guitar/toilet and flip-flop/surfboard candidate regressions are encoded;
- Portuguese/English/Japanese language routing tests pass;
- Japanese reading deterministic tests pass;
- tokenized Kuromoji-style reading -> kana/rōmaji conversion tests pass;
- OCR word -> line reconstruction tests pass;
- World Model / hierarchy / specialist / temporal / budget router tests pass;
- static QA passes with vocabulary fixed at 383;
- syntax check passes for all local JS and Service Worker;
- Service Worker references only existing local package files;
- Auto Freeze default-ON invariant remains encoded;
- no camera-image upload path was added to `app.js`.

## What automated QA cannot prove

Requires Xiaomi 14T / deployed GitHub Pages:

- that WebGPU is exposed by the browser in this exact environment;
- real CLIP inference latency and classification quality;
- actual correction of guitar/toilet and flip-flop/surfboard photographs;
- first-download size/time and browser cache retention;
- Browser Translator availability;
- Marian translation quality for real Portuguese OCR;
- Kuromoji CDN/dictionary loading and real proper-name readings;
- Lens overlay positioning under device-specific viewport/camera crop;
- RAM/thermal behavior after repeated Semantic AI + OCR + translation;
- FPS after returning to camera;
- offline behavior after external models have actually been cached.

## Physical test order

1. Launch / startup time.
2. Camera fluidity before any AI model is downloaded.
3. Re-test hand / face / shoe / cabinet / floor / wall.
4. Show the same guitar image that previously became toilet; tap **Conferir com IA**.
5. Show the same flip-flop scene that previously became surfboard; tap **Conferir com IA**.
6. Observe first Semantic AI download, then repeat to compare cached execution.
7. Enter **Ler**, show Portuguese text, run OCR, then **Traduzir IA**.
8. Verify Japanese, kana/rōmaji and overlay positioning.
9. Test a Japanese sentence containing kanji not in the 383-word database to force reading fallback.
10. Return to camera and check FPS/lag.
11. Restart PWA and verify camera controls + saved preferences.
12. Test Auto Freeze with clean storage (ON) and explicit manual OFF persistence.

## Recovery / corruption check after interrupted ChatGPT run

A recovery audit was performed after the conversation UI became stuck in an infinite-thinking state. The working source tree was intact, but the first generated ZIP was **incomplete**: it omitted `js/japanese-reading-worker-v1.js` and `tests/ocr-engine-v1.test.js` even though both existed in the finalized workspace and the Service Worker/tests referenced the reading worker. That incomplete archive was discarded and rebuilt from the audited source tree.

The rebuilt final package was clean-extracted and **passed** all of these checks:

- ZIP structural integrity (`unzip -t`);
- exact source ↔ extracted file-list equality;
- exact SHA-256 equality for every extracted file;
- `BUILD_MANIFEST_PREALPHA3.txt` size/hash verification;
- all JavaScript tests;
- Python static QA;
- syntax check for every JavaScript file and the Service Worker.

## Release judgment

Automated scope: **10/10**. The rebuilt final ZIP was re-extracted and the complete validation suite passed again.

Physical validation: **pending**.
