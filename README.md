# Mira Nihongo V0.5 — Stable Focus + Broad Recognition

Aplicação web/PWA mobile-first para aprender japonês olhando para objetos do cotidiano.

A V0.5 parte da V0.4 e muda a prioridade para **estabilidade depois do reconhecimento** e **rejeição de identificações absurdas**.

## Fluxo principal

1. Mire em um objeto.
2. O Focus-First espera a região estabilizar.
3. A identificação combina detector, verificador, forma, escala, família semântica e contexto.
4. Quando existe uma leitura útil, o quadro é congelado por padrão.
5. Toda inferência automática é pausada enquanto você estuda, ouve, abre o breakdown ou corrige.
6. Toque em **Continuar** para retornar à câmera e procurar o próximo objeto.

## Novidades da V0.5

- **Auto Freeze** após uma leitura, inclusive quando ela ainda precisa de confirmação.
- Frame congelado real sobre a câmera; a lição permanece mesmo movimentando o celular.
- O loop de foco não lê pixels nem roda IA enquanto congelado.
- **Sticky Lock** quando o Auto Freeze estiver desligado: exige vários frames realmente diferentes antes de abandonar uma leitura.
- Reconhecimento em camadas com candidatos e famílias semânticas.
- Regras de geometria/escala para evitar confusões conhecidas.
- Top candidatos visíveis em leituras incertas e no painel de correção.
- Saída “não tenho certeza” quando os sinais não justificam uma palavra específica.
- Heurísticas específicas para os testes físicos: estilete, mão, sapato, tampinha e categorias historicamente confusas.
- Parte–todo para casos seguros, incluindo tampinha no topo de uma garrafa.
- Histórico local dos últimos 10 objetos.
- Vocabulário ampliado para **383 entradas**, com ferramentas, oficina/estoque, casa, cozinha, eletrônicos, corpo e partes de objetos.
- Cartão Vivo, breakdown, produção ativa, cena e progresso individual por palavra continuam presentes.

## Privacidade

Os quadros são processados no navegador. O código do app não envia fotos da câmera para um servidor. Os modelos TensorFlow.js são obtidos das CDNs declaradas no `index.html` e executados localmente no navegador.

## GitHub Pages

Publique o conteúdo deste diretório na raiz da branch usada pelo Pages. O `index.html` já está na raiz e o Service Worker usa cache versionado da V0.5.

## Limites importantes

A V0.5 reduz falsos positivos e prefere incerteza a uma palavra errada, mas visão computacional no navegador não garante identificação correta de qualquer objeto. Precisão, aquecimento, autofocus e velocidade reais precisam ser validados no aparelho físico.
