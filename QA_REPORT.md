# Mira Nihongo V1.0 Pre-Alpha 1 RC4 — QA

## Escopo
RC4 trata exclusivamente a experiência de exploração e navegação sobre a Specialist Vision validada como avanço na RC3. O feedback físico mostrou que perguntas de revisão podiam interromper a exploração, o card mudava de estado de forma inesperada e a sobreposição simultânea de pessoa/mão/palma/dedos/punho tornava a interface visualmente ruidosa.

## Correções validadas por código/testes
- `sceneExplore` é um estado explícito do fluxo pedagógico.
- Recall/revisão oportunista é bloqueado durante exploração.
- Exploração não registra exposição adaptativa automaticamente.
- Frase de exploração é determinística e não muda por revisão/adaptação incidental.
- Breadcrumb é reconstruído a partir do Scene Graph e cada nível é navegável.
- Overlay hierárquico limita a visualização à entidade selecionada e seu nível relevante.
- Labels de overlay priorizam português; japonês fica associado à seleção.
- Card compacto usa estado “Explorando” e não exibe a sentença até expansão.
- Ação de saída é “Retomar câmera”.
- Specialist Vision, landmarks de mão, segmentação e regressões anteriores permanecem preservados.

## Execução final
- Todas as suítes `tests/*.test.js`: PASS.
- `static-qa.py`: 130/130 PASS.
- Vocabulário carregado: 383 entradas.
- Teste dedicado RC4 Exploration UX: PASS.
- Service Worker: `mira-nihongo-v1-prealpha1-rc4-r1`.

## Reavaliação crítica
Primeira passagem: 9,4/10 no escopo simulável — a navegação estava correta, mas o card compacto ainda competia visualmente com a cena e mantinha rótulo de reconhecimento comum. Correção aplicada: estado visual “Explorando” e sentença ocultada no snap compacto. Segunda passagem: 10/10 no escopo de código + arquitetura + UX/comportamento automatizável/simulável da RC4.

## Limite da nota
A nota não valida ergonomia, transições percebidas, precisão de toque, segmentação ou landmarks no aparelho físico. Esses itens exigem nova validação Android e podem reprovar a RC4 fisicamente.
