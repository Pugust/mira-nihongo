# Mira Nihongo V0.6 — Interaction & Flow

## Interface
- Cabeçalho compacto; número da versão movido para `Sobre`.
- Seletor de modo visualmente reduzido.
- Mira reduzida para liberar mais área do objeto.
- Japonês e frase permanecem como elementos de maior peso visual.
- Anotações da câmera somem gradualmente quando o frame é congelado e podem ser reveladas temporariamente com toque.

## Bottom sheet
- Três snaps: compacto, médio e completo.
- Drag vertical com feedback contínuo e snap ao soltar.
- Toque na alça continua funcionando como fallback.
- Novo objeto sempre retorna ao cartão compacto.
- Conteúdo completo passa a rolar verticalmente somente quando necessário.

## Gestos e fluxo
- Swipe horizontal na frase para avançar/voltar exemplos.
- `Outra frase` permanece em `⋯ Mais` como fallback explícito.
- Um único botão dinâmico `Congelar / Continuar`.
- Removidos os controles duplicados `Continuar` e `Continuar câmera`.
- Leituras tentativas priorizam `É isso / Corrigir` e escondem a ação principal até confirmação.
- Histórico continua acessível por botão, sem conflito com o gesto de voltar do Android.

## Aprendizagem
- `Quero dizer algo` agora usa carrossel horizontal.
- Ações secundárias agrupadas em `⋯ Mais`.
- Dicas contextuais de primeira utilização para Breakdown e progressão por palavra.
- Tutorial interativo em 4 etapas: mirar → puxar cartão → deslizar frase → corrigir.
- Tutorial pode ser refeito em Configurações.

## Acessibilidade e sensação
- Feedback háptico opcional para reconhecimento/congelamento/navegação.
- Tamanho de texto configurável.
- Áreas de toque principais mantidas amplas.
- `:focus-visible` para navegação por teclado/dispositivos assistivos.
- `prefers-reduced-motion` respeitado.

## PWA
- Cache atualizado para `mira-nihongo-v0-6-r1`.
- Novo `interaction-engine.js` incluído no precache.
