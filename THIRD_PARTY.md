# Third-party runtime dependencies

Mira Nihongo mantém o primeiro render sem carregar bibliotecas ML pesadas. Elas são buscadas apenas quando o fluxo correspondente precisa delas.

## Visão
Carregadas via jsDelivr:
- TensorFlow.js 4.22.0 — Apache-2.0
- TensorFlow.js COCO-SSD 2.2.3 — Apache-2.0
- TensorFlow.js MobileNet 2.1.1 — Apache-2.0
- TensorFlow.js DeepLab 0.2.2 — Apache-2.0
- TensorFlow.js Hand Pose Detection 2.0.1 — Apache-2.0
- TensorFlow.js Pose Detection 2.1.3 — Apache-2.0
- TensorFlow.js Face Landmarks Detection 1.0.6 — Apache-2.0

Os assets/modelos associados são buscados pelos respectivos runtimes quando necessários.

## OCR
- Tesseract.js 5 — Apache-2.0
- traineddata `jpn`, `eng` e `por` — carregados sob demanda a partir do repositório público configurado no OCR engine.

O OCR não usa API paga nem envia a fotografia para um backend próprio do Mira. O runtime/modelos externos ainda dependem de rede na primeira utilização quando não estiverem presentes no cache HTTP do navegador.
