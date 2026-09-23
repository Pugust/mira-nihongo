# Architecture — Pre-Alpha 2.1

## Regra principal
Performance não pode ser obtida desativando percepção já validada; percepção não pode ser obtida executando todos os modelos continuamente.

## Fast Path
A câmera mostra o preview independentemente da taxa de IA. Stable Focus usa amostras baratas e agenda análise visual em frequência própria. `requestVideoFrameCallback` é usado quando o navegador oferece suporte.

## Heavy Budget
`BudgetRouter` mantém uma tarefa pesada ativa por vez. Uma segunda tarefa pode ser descartada ou ocupar uma única vaga pendente. Mudanças de cena/mode/câmera incrementam epoch e invalidam resultados antigos. AbortSignal é fornecido quando o runtime subjacente coopera, mas o router não assume que abortar JS interrompe imediatamente WebGL/WASM: `busy` só é liberado no `finally` real.

## Specialist Arbitration
Hand/Face/Pose não são autoridades globais contínuas. Eles entram quando a semântica/ação pede confirmação. O alvo espacial faz parte da decisão para evitar que um especialista encontrado em outra região substitua o objeto focal.

## Deep Path
No quadro congelado:
- Explorar: detector de cena + structure-first; especialista direcionado se houver alvo humano relevante.
- Toque: hierarquia orienta o que procurar; landmarks humanos precedem classificador genérico; segmentação entra para superfície/estrutura/ambiente/unknown; MobileNet é fallback.
- Ler: OCR é carregado apenas quando solicitado.

## World Model 2.0
Entidade canônica:
`id, conceptId, semanticType, bbox/region, confidence, status, source, parentId, children, evidence, relations, trackingId, text, attributes, userConfirmed, userCorrected`.

A relação parent/child cria `PART_OF` e `HAS`. OCR pode anexar `text` e evidência à entidade abaixo da região textual.

## Unknown
Unknown é uma saída correta. Evidência negativa, margens, classes de alta confusão, política animal, temporal consistency e structure-first existem para evitar ensinar um conceito errado com confiança falsa.

## Device Adaptation
Auto usa características expostas pelo navegador mais latências reais observadas para escolher Lite/Standard/Advanced. O usuário pode fixar um nível. Isso altera orçamento/frequência/número de regiões, não inventa recursos inexistentes no aparelho.
