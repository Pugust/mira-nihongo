# V1.0 Pre-Alpha 3 — Semantic AI

- Auditoria de recuperação após a geração interrompida: o workspace estava íntegro; o ZIP final foi reconstruído e passou a ter verificação de integridade por manifesto SHA-256.
- Camada de IA semântica real, local no navegador, usando Transformers.js + CLIP zero-shot sob demanda.
- WebGPU é tentado para Semantic AI; WASM é fallback.
- `✦ Conferir com IA` aparece em hipóteses tentativas e nas ações adicionais; após o primeiro uso bem-sucedido, tentativas podem ser escaladas automaticamente.
- Evidence Fusion preservada: resultado divergente da IA continua tentativo e exige confirmação; a IA não grava memória diretamente.
- Regressões explícitas: `guitar != toilet` e `flip_flop != surfboard`, além das regressões permanentes anteriores.
- Ontologia runtime adiciona `guitar`, `flip_flop`, `sandal` e `slipper` sem alterar as 383 entradas-base.
- Modo **Ler** passa a traduzir PT/EN → japonês sem API paga: Browser Translator quando disponível; fallback Transformers.js com `opus-mt-ROMANCE-en` e `opus-mt-en-jap`.
- OCR passa a reconstruir linhas/bounding boxes e não apenas palavras soltas.
- Leitura japonesa agora usa banco local primeiro e Kuromoji lazy em Web Worker para resolver kanji restantes; rōmaji é gerado a partir da leitura.
- Tradução japonesa + rōmaji ganham overlay ancorado ao texto congelado, além do painel de leitura.
- Semantic AI, Language AI e Japanese Reading passam pelo mesmo Perception Budget Router, sem inferências pesadas concorrentes.
- Workers/modelos são carregados somente por intenção e descartados/encerrados quando possível.
- Startup continua sem baixar CLIP, tradução ou Kuromoji.
- Service Worker atualizado para `mira-nihongo-v1-prealpha3-r2` e inclui os novos módulos/workers locais.
- Auto Freeze permanece ON por padrão e preserva OFF explícito.
- Vocabulário congelado preservado em 383 entradas.

# V1.0 Pre-Alpha 2.1 — Perception Consolidation

- Auditoria da Pre-Alpha 2 contra RC7/RC6/RC5 e preservação das mecânicas históricas.
- Scheduler legado da RC7 deixa de ser carregado no runtime; há um único orçamento de percepção.
- `BudgetRouter` refeito para nunca liberar o orçamento pesado antes da tarefa cancelada realmente terminar; fila limitada a uma pendência com prioridade/supersessão.
- Live analysis, scene analysis, point analysis, arbitragem humana e OCR passam pelo mesmo orçamento de percepção.
- Arbitragem Hand/Face agora usa proximidade/IoU do alvo, reduzindo mão→pessoa e rosto distante→mão.
- Especialistas de cena são direcionados pelo conceito e pelo perfil; segmentação deixa de fazer parte da cascata automática.
- Multi-scale em grandes regiões passa a promover somente classes estruturais.
- Drill-down humano consulta landmarks antes do MobileNet genérico.
- World Model 2.0: `trackingId`, `text`, evidências e relações automáticas `PART_OF/HAS`.
- OCR refeito com carregamento lazy, jpn+eng+por, extração compatível com estruturas diferentes do Tesseract e cancelamento lógico por sessão.
- OCR anexa texto/evidência à entidade do World Model sob a região lida.
- Vision Runtime: Auto/Lite/Standard/Advanced com override persistente e adaptação por latência observada.
- Performance Observatory: FPS de câmera/UI, tempo/fila do router, módulos carregados, OCR e backend.
- Loop visual usa `requestVideoFrameCallback()` quando disponível.
- Câmera reinicializa estado de torch/capabilities em cada track.
- Correção de ontologia: `fingernail=爪` separado de `nail=釘`; `bottle_cap` canônico; hierarquias de cabinet/wardrobe/backpack ampliadas.
- Service Worker atualizado para `mira-nihongo-v1-prealpha2-1-r1` e inclui `world-model-v2.js`.
- Base de vocabulário preservada em 383 entradas; conceitos novos da ontologia continuam instalados somente em runtime.
- Auto Freeze continua ON por padrão e OFF explícito continua persistente.

# RC7 — Performance Architecture

- Startup lazy, análise progressiva, cancelamento de trabalho obsoleto, Camera Tools reorganizado e regressão shoe/laptop.

# V1.0 Pre-Alpha 1 RC2

- Corrige hit-testing de caixas sobrepostas: a menor entidade visual ganha o primeiro toque.
- Segundo toque na entidade selecionada faz drill-down dentro dela, com parentId preservado.
- Caixas visuais deixam de interceptar eventos; o Scene Graph decide o alvo geometricamente.
- Drill-down exige confiança absoluta + margem sobre o segundo candidato; Unknown é preferido em regiões ambíguas.
- Predições de cena de animais e classes de alta confusão passam por limiares conservadores.
- Novo cache PWA RC2.

# V1.0 Pre-Alpha 1 RC1
- Visual World Model e Scene Graph.
- Recognition Fusion V1 com evidência negativa e estabilidade temporal.
- Rejeição mais conservadora de falsos positivos.
- Cena congelada passa a conter múltiplas entidades selecionáveis.
- Modo Explorar cena e breadcrumb.
- Toque em região não marcada executa análise localizada (Visual Drill-Down).
- Ontologia inicial de ambientes, estruturas, superfícies, coletivos, materiais, partes e subpartes.
- Auto Freeze permanece ON por padrão quando não há preferência salva; OFF explícito continua preservado.
- Cache PWA versionado para Pre-Alpha 1 RC1.

## V1.0 Pre-Alpha 1 RC3 — Specialist Vision
- Adiciona segmentação semântica DeepLab/ADE20K sob demanda para superfícies/estruturas (piso, parede, porta, rua, céu etc.).
- Adiciona Hand Pose Detection com 21 landmarks e regiões selecionáveis para palma, punho, polegar, indicador, médio, anelar e mínimo.
- Specialist Router executa análise profunda somente após Scene Freeze / exploração, evitando custo contínuo na câmera ao vivo.
- A segmentação pode corrigir falsos positivos grosseiros do classificador quando uma superfície/estrutura contradiz a hipótese selecionada.
- Drill-down consulta primeiro especialistas e só cai no MobileNet genérico com limiares muito mais conservadores.
- Cache atualizado para `mira-nihongo-v1-prealpha1-rc3-r1`.

## V1.0 Pre-Alpha 1 RC4 — Exploration UX & Navigation
- Exploração congelada agora é um estado de interação próprio.
- Revisões oportunistas e perguntas-surpresa ficam suspensas durante exploração.
- Seleção de entidades não registra exposição adaptativa silenciosamente.
- Breadcrumb hierárquico passou a ser clicável.
- Overlays mostram somente entidade atual + filhos imediatos (ou irmãos quando em folha), reduzindo poluição visual.
- Labels priorizam português; entidade selecionada mostra português + japonês.
- Card compacto de exploração mostra o conceito sem competir com a cena; detalhes continuam acessíveis ao expandir.
- Ação primária em exploração mudou de “Continuar” para “Retomar câmera”.
- Mantida integralmente a visão especializada da RC3.

## V1.0 Pre-Alpha 1 RC5 — Universal Hierarchical Vision
- Isolamento explícito dos estados Recognition/Exploration e bloqueio transacional de revisão durante exploração.
- Specialist Router ampliado: mão + pose corporal + landmarks faciais + segmentação semântica.
- Anatomia hierárquica: pessoa → cabeça/rosto/olhos/nariz/boca; braços/pernas; mão → dedos.
- Visual Hierarchy genérica para objetos e seres: carro, bicicleta, árvore/planta, edifício/casa, computador e objetos compostos.
- Drill-down passa a usar o conceito-pai para rejeitar partes semanticamente incompatíveis.
- Cache RC5.

## V1.0 Pre-Alpha 1 RC6 — Adaptive Multi-Scale + Fast Startup + Camera Pipeline 2.0
- Specialist vision libraries (hands, pose, face, semantic segmentation) now lazy-load only when deep frozen-scene analysis needs them, removing four blocking CDN downloads from first interaction.
- Camera preview requests 24–30 FPS by default; Accuracy may negotiate up to 60 FPS while inference remains independently throttled.
- Camera tools: zoom with hardware capability when available, safe digital fallback, and torch when exposed by the browser/device.
- Frozen-scene deep analysis now samples six spatial scales and requires repeated evidence before accepting large structural hypotheses.
- Added cabinet ImageNet aliases and multi-scale structural support to improve large/distant furniture recognition without weakening animal false-positive rejection.

## V1.0 Pre-Alpha 2 — Perception Engine
- Nova camada de percepção com Router de orçamento: uma inferência pesada por vez, descarte de trabalho obsoleto e telemetria por tarefa.
- Specialist Arbitration para regiões humanas: Face/Hand landmarks passam a ter autoridade sobre rótulos genéricos, sem reativar todos os especialistas continuamente.
- Tracking temporal independente para reduzir troca semântica por um único frame divergente.
- Três experiências de percepção: Mirar, Explorar e Ler.
- OCR experimental e estritamente sob demanda; primeira execução baixa o runtime/modelos de idioma. Texto conhecido pelo vocabulário local é enriquecido com japonês sem API paga.
- World Model, drill-down, segmentação, anatomia, Auto Freeze, aprendizado adaptativo e mecânicas anteriores preservados.
- Vision Runtime adaptativo expõe perfil Lite/Standard/Advanced com base no ambiente e medições locais.
- Startup continua sem carregar modelos de visão antes da intenção de abrir a câmera.
- Auto Freeze continua ON por padrão quando não existe preferência salva e preserva OFF quando escolhido explicitamente.
