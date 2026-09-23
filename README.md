# Mira Nihongo V1.0 Pre-Alpha 1 RC2 — Visual World Model

Base: V0.9.2 Freeze Hotfix. Esta RC introduz Recognition Fusion, rejeição conservadora de falsos positivos, Scene Graph interativo, múltiplas entidades por cena congelada, seleção visual e drill-down por toque. A ontologia visual passa a separar objeto, parte, subparte, superfície, estrutura, ambiente, coletivo, região espacial e material.

## Validação
A nota de QA cobre código, arquitetura e comportamento simulável. Reconhecimento real, enquadramento e desempenho precisam de validação física no Android antes de promover a RC a Pre-Alpha 1 final.


RC2 corrige seleção de entidades sobrepostas e torna o drill-down conservador em regiões sem objeto, evitando acumular palpites arbitrários sobre chão/parede.

### RC3 — Specialist Vision
A RC3 adiciona visão especializada sob demanda. No quadro congelado, DeepLab/ADE20K fornece segmentação semântica de regiões e Hand Pose Detection fornece 21 landmarks por mão. Os landmarks são convertidos em entidades do Scene Graph para palma, punho e os cinco dedos. Esses modelos são carregados pela rede na primeira utilização; se estiverem indisponíveis, o Mira mantém o fluxo anterior e informa desconhecido em vez de depender deles como requisito para abrir o app.

### RC4 — Exploration UX & Navigation
A exploração de uma cena congelada agora é tratada como uma sessão contínua. Revisões adaptativas ficam pausadas enquanto o usuário navega no Scene Graph. O overlay mostra apenas o nível hierárquico relevante, o breadcrumb permite voltar a ancestrais e o card compacto prioriza o conceito selecionado sem interromper a imagem com exercícios inesperados.
