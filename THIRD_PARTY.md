# Dependências externas — Mira Nihongo V0.3

A versão usa bibliotecas carregadas por CDN:

- TensorFlow.js `4.22.0`
- `@tensorflow-models/coco-ssd` `2.2.3`
- `@tensorflow-models/mobilenet` `2.1.1`

COCO-SSD é usado como detector principal com base `lite_mobilenet_v2`.
MobileNet V2 (`version: 2`, `alpha: 0.50`) é usado como classificador detalhado sob demanda.

A V0.3 não usa Transformers.js nem MobileCLIP.

As licenças e avisos de cada dependência/modelo continuam sendo regidos pelos respectivos projetos upstream.
