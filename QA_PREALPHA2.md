# QA — Mira Nihongo V1.0 Pre-Alpha 2

## Regra de nota 10
Ciclo aplicado: implementar → reavaliar criticamente → corrigir → repetir → empacotar.

## Regressões acumuladas
- Auto Freeze default ON sem sobrescrever escolha explícita OFF.
- Freeze/Continue e retorno à câmera preservados.
- RC7: nenhuma cascata de análise profunda ao congelar; multi-scale continua sob demanda.
- Mão ≠ pessoa: Hand landmarks podem corrigir o detector genérico.
- Rosto ≠ mão: Face landmarks podem corrigir o rótulo anterior.
- Tênis ≠ notebook: guardas da RC7 preservadas.
- Piso/parede/ambiente: segmentação permanece disponível em Explorar, sem ser executada continuamente.
- Hierarquia mão/dedos, anatomia, World Model e drill-down preservados.
- Controles de câmera e cache da PWA preservados.

## Pre-Alpha 2
- Perception Budget Router: PASS.
- Temporal Tracker: PASS.
- Specialist Arbitration unit tests: PASS.
- Modos Mirar / Explorar / Ler presentes: PASS.
- OCR é lazy/on-demand e não bloqueia startup: PASS estático.
- Service Worker inclui os novos módulos: PASS.
- 383 entradas de vocabulário: PASS.
- Static QA: 140/140 PASS.
- Todas as suítes JavaScript: PASS.
- Syntax check JS: PASS.

## Limites da validação
Não é possível declarar aqui FPS real, latência real, disponibilidade de câmera/torch/zoom, qualidade real de OCR, download do traineddata ou precisão física dos modelos no Xiaomi 14T. Esses pontos exigem validação no aparelho. O OCR desta versão não usa API paga; tradução/enriquecimento offline está limitado ao vocabulário local conhecido pelo Mira.
