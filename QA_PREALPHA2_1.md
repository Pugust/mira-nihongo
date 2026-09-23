# QA — Mira Nihongo V1.0 Pre-Alpha 2.1

## Escopo da nota 10
A nota 10 desta build se limita a código, arquitetura verificável, testes automatizados, invariantes estáticos e comportamento simulável. **Não representa validação física no Xiaomi 14T.**

## Auditoria crítica inicial da Pre-Alpha 2
A revisão encontrou problemas que os testes anteriores não capturavam:

1. `BudgetRouter.cancel()` liberava `busy` cedo demais, podendo permitir sobreposição real de duas inferências pesadas quando o backend não interrompesse imediatamente.
2. A análise de cena ainda podia encadear muitos especialistas automaticamente, repetindo parte do risco de performance da RC6.
3. Arbitragem humana não era suficientemente espacial; um rosto em outra área podia influenciar um alvo de mão.
4. O tracker temporal novo existia, mas parte do ciclo antigo não era reinicializada de forma uniforme.
5. Device profile não possuía override completo nem observabilidade suficiente.
6. World Model não tinha todos os campos do schema-alvo (`trackingId`, `text`) nem relações parent/child explícitas.
7. A hierarquia usava `nail` para unha apesar de `nail` significar prego no vocabulário base; `bottle` também apontava para chave não canônica de tampa.
8. Drill-down podia carregar o classificador genérico antes de tentar a ferramenta especializada apropriada.
9. README/QA históricos não descreviam corretamente o estado real da Pre-Alpha 2.

## Correções da consolidação

- Scheduler legado removido do runtime para evitar duas autoridades de orçamento.
- Router pesado serializado com cancelamento seguro e uma única pendência priorizada.
- Todos os caminhos pesados principais passam pelo router.
- Specialist Arbitration espacial e direcionada.
- Scene specialists sem segmentação automática; segmentação sob demanda no drill-down adequado.
- Structure-first estrito para grandes regiões.
- World Model 2.0 com evidência/text/tracking/relações.
- OCR lazy com anexação de evidência textual.
- Vision Runtime manual/automático e telemetria local.
- Performance observers independentes do loop de inferência.
- Correções de ontologia/hierarquia sem alterar as 383 entradas da base.
- Cache PWA versionado e novo módulo incluído.

## Regressões automatizadas

Cobertas explicitamente por testes/invariantes:
- Auto Freeze default ON + persistência de OFF explícito.
- hand/person e face/hand: arbitragem especializada e alvo espacial.
- shoe/laptop: guardas históricas preservadas e temporal hold testado.
- floor/wall/texture: multi-scale grande só promove estrutura; segmentação não roda continuamente.
- cabinet/large structure: structure-first e hierarquia presentes.
- fingers/fingernail: landmarks/hierarquia preservados e colisão `nail` corrigida.
- stale async work: epoch + router cancellation.
- heavy inference overlap: teste assíncrono garante máximo de uma tarefa ativa.
- bounded pending queue: teste garante no máximo uma pendência e supersessão por prioridade.
- startup: bibliotecas ML continuam fora do HTML crítico e modelos carregam por intenção.
- camera controls: capabilities/torch são reinicializados por track.
- surprise review: guards de `uiEpoch/uiMode` históricos preservados.
- PWA/cache: novos módulos no Service Worker.
- vocabulário base: exatamente 383 entradas.

## O que ainda exige teste físico

- FPS real de preview/UI no Xiaomi 14T.
- latência real de detector/landmarks/segmentation/OCR.
- qualidade da arbitragem em mão/rosto reais.
- precisão de tênis, armário, piso, parede e reflexos.
- download/funcionamento dos modelos CDN e traineddata do OCR.
- zoom, torch e autofocus conforme WebView/Chrome e câmera selecionada.
- resume após análise pesada e comportamento térmico/memória.
- layout dos novos modos/diagnósticos em diferentes orientações e safe areas.

Esses itens não devem ser chamados de aprovados até teste no aparelho.

## Resultado automatizado final

- 20 suítes JavaScript: **PASS**.
- Static QA: **195/195 PASS**.
- Syntax check: todos os arquivos `js/*.js` + `sw.js`: **PASS**.
- Vocabulário canônico de base: **383/383 preservado**.
- Ontologia instalada em runtime no QA: 428 conceitos, preservando `nail=釘` e adicionando `fingernail=爪` / `pull_tab=引き手`.
- Comparação de inventário com a Pre-Alpha 2: **nenhum arquivo da base removido**.
- Scheduler legado: arquivo histórico preservado, mas **não carregado no runtime**; Perception Budget Router é a única autoridade ativa.

### Reavaliação final — regra de nota 10

Depois da primeira implementação, a revisão crítica encontrou pontos abaixo do esperado (cancelamento do router, dupla autoridade de scheduler, corrida do estado de análise de cena, observabilidade incompleta, relações do World Model, colisão semântica `nail/fingernail` e documentação obsoleta). Eles foram corrigidos e as suítes foram repetidas. Dentro do escopo automatizável definido para esta build, não restou falha conhecida reproduzível: **10/10 automatizável**. A nota não abrange câmera/modelos reais no aparelho.
