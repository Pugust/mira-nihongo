# QA V0.9.2
A investigação mostrou que a chamada para Auto Freeze existia e era executada após `selectObject`. O ponto frágil estava em `captureFreezeFrame()`: o frame da câmera era desenhado no canvas com offsets de destino negativos derivados do `object-fit: cover`.

A correção recorta a origem da câmera e preenche o canvas de destino, evitando coordenadas de destino negativas.

Reavaliação:
- Static QA 122/122
- Freeze geometry 11/11
- Vision 9/9
- Interaction 13/13
- Adaptive 30/30
- World Context 8/8
- Runtime 34/34
Total: 227/227.

10/10 no escopo automatizável do hotfix. A confirmação visual do congelamento em Android permanece obrigatoriamente física.
