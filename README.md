# Mira Nihongo V0.6 — Interaction & Flow

Aplicação web/PWA mobile-first para aprender japonês olhando para objetos do cotidiano.

A V0.6 mantém o motor de visão da V0.5 e concentra a atualização em **uso com uma mão, clareza, gestos descobríveis e menor atrito durante o dia**.

## Fluxo principal

1. Mire no objeto.
2. O Focus-First identifica e, por padrão, congela o quadro.
3. O cartão aparece compacto, priorizando japonês + frase.
4. Arraste a alça para cima ou toque nela para abrir mais conteúdo.
5. Deslize a frase horizontalmente para variar o exemplo, ou use `⋯ Mais → Outra frase`.
6. Use Breakdown, produção ativa, progresso ou correção sem reativar a IA.
7. Toque no único botão **Continuar** para voltar à câmera.

## Novidades da V0.6

- **Bottom sheet real com 3 posições:** compacto, médio e completo.
- Arrastar e tocar são equivalentes; nenhuma função essencial depende de gesto oculto.
- Swipe horizontal na frase com fallback visível em `⋯ Mais`.
- Um único controle dinâmico para **Congelar / Continuar**; duplicidades removidas.
- Em leituras incertas, o botão principal não compete com `É isso / Corrigir`.
- Cabeçalho e seletor de modo mais discretos; versão movida para Configurações → Sobre.
- Mira menor e anotações que desaparecem depois do congelamento; toque na imagem congelada as revela temporariamente.
- `Quero dizer algo` virou carrossel horizontal, reduzindo altura do cartão.
- Ações secundárias agrupadas em `⋯ Mais`.
- Tutorial rápido contextual em 4 passos, executado sobre a interface real e refazível nas configurações.
- Dicas de primeira utilização para Breakdown e `Já sei`.
- Feedback háptico opcional.
- Tamanho de texto Compacto / Médio / Grande.
- Suporte a `prefers-reduced-motion` e foco visual para navegação acessível.
- A posição do cartão é apenas da sessão; todo objeto novo volta ao estado compacto.
- Stable Focus, Auto Freeze, Broad Recognition, 383 entradas, memória, histórico e aprendizagem por palavra da V0.5 foram preservados.

## Privacidade

Os quadros são processados no navegador. O app não contém código para enviar fotos da câmera para um servidor. Os modelos TensorFlow.js são obtidos das CDNs declaradas no `index.html` e executados localmente no navegador.

## GitHub Pages

Publique o conteúdo deste diretório na raiz da branch usada pelo Pages. O Service Worker usa o cache `mira-nihongo-v0-6-r1` e inclui o novo `interaction-engine.js`.

## Limites de validação

A V0.6 recebeu validação automatizada de código, fluxo e regras de interação. Isso **não substitui teste físico** de ergonomia, gestos, temperatura, câmera e reconhecimento no Android real. A nota 10/10 do relatório é somente para o escopo de código/UX simulável.
