# Mira Nihongo V1.0 Pre-Alpha 1 RC6 — QA

Scope: Adaptive Multi-Scale Scene Analysis, progressive startup and Camera Pipeline 2.0.

Automated/static target: 10/10 within testable scope. Physical Android validation remains separate: actual startup seconds, negotiated preview FPS, optical zoom/torch support and real-world cabinet accuracy depend on browser/device.

## Critical re-evaluation cycle
1. Initial RC6 implementation passed most tests, but legacy RC5 assertions still required old cache/model-loading behavior.
2. Tests were updated to preserve the intended invariant (models remain available) while enforcing the new lazy-loading startup contract.
3. Second review found the initial software-zoom fallback could make preview framing diverge from recognition/freeze coordinates. It was removed: zoom now uses real camera-track zoom only when exposed; otherwise it is disabled instead of faking behavior.
4. Final startup review moved TF.js, COCO-SSD and MobileNet out of parser-blocking HTML as well. The app shell becomes interactive before ML downloads; detector loading proceeds asynchronously.

Final automated result: 15/15 JS suites passed + static QA 134/134 + syntax checks passed. Rating within automatable code/UX scope: **10/10**.

Not claimed as physically validated: real startup latency, negotiated camera FPS, zoom/torch availability and real-scene multi-scale recognition must be checked on the Android device.
