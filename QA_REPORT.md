# Mira Nihongo V0.5 — Relatório de reavaliação

## Regra de validação
A versão só recebe 10/10 **no escopo de código** depois de ciclos de implementação → crítica → correção → reteste. Validação física no Android permanece separada.

## Ciclo 1 — estabilidade pós-reconhecimento
**Nota inicial: 9,5/10.**

Problema encontrado: o tracking da V0.4 ainda descartava a leitura com movimentos pequenos e a correção exigia segurar o celular imóvel.

Correções:
- Auto Freeze por padrão;
- captura do frame visível;
- pausa completa do loop de amostragem enquanto congelado;
- correção mantém a imagem e a lição congeladas;
- botão `Continuar` explícito;
- Sticky Lock exige até 5 amostras de mudança no perfil forte antes de liberar um objeto quando Auto Freeze está desativado.

## Ciclo 2 — reconhecimento amplo
**Reavaliação: 9,8/10.**

Problema encontrado: simplesmente congelar um resultado não evita uma identificação semanticamente absurda.

Correções:
- motor separado `vision-engine.js`;
- fusão de detector, MobileNet, geometria, escala, família semântica e contexto;
- classes de alto risco têm limiar/margem mais severos;
- top candidatos são preservados para decisão do usuário;
- `unknown` é uma saída válida;
- partes seguras podem superar a classe do objeto inteiro.

## Ciclo 3 — regressões dos testes físicos
**Reavaliação: 9,9/10.**

Foram criados testes puros para os erros observados no aparelho:
- objeto alongado detectado como `switch` → `utility_knife` passa a ser o candidato principal, ainda pedindo confirmação;
- objeto alongado detectado como `cell phone` → `utility_knife` passa a ser o candidato principal;
- `person` + forte evidência de pele → `hand` passa à frente e permanece tentativo;
- `person` + candidato visual de calçado → `shoe` passa à frente;
- `frisbee` muito pequeno → `bottle_cap` passa à frente e permanece tentativo;
- foco no topo de `bottle` → `bottle_cap` pode ser aceito por relação parte–todo;
- Sticky Lock forte só libera após mudança persistente.

Resultado do teste puro: **9/9**.

## Validação estática
- Sintaxe de todos os JS: OK.
- IDs HTML referenciados pelo JS: OK.
- Recursos locais: OK.
- Manifesto: OK.
- Cache PWA inclui `vision-engine.js`: OK.
- Nenhuma API de upload (`fetch`, XHR, FormData ou sendBeacon) presente em `app.js`.
- Vocabulário: **383 entradas**.

Resultado: **57/57** verificações estáticas.

## Smoke runtime sem câmera
Um harness DOM em Node inicializou o app, abriu uma leitura tentativa, renderizou candidatos, registrou histórico, congelou e retomou sem exceções.

Resultado: **8/8**.

**Total automatizado da V0.5: 74/74 verificações aprovadas** (57 estáticas + 9 do motor de visão + 8 de runtime).

A automação com Chromium local foi bloqueada pela política de navegação do ambiente de execução, então ela não é contabilizada como aprovação. Isso não foi substituído por uma alegação fictícia de teste de navegador.

## Nota final do escopo de código
**10/10** após as correções acima.

A nota não cobre ainda:
- precisão real dos modelos no Xiaomi/Android;
- temperatura após uso prolongado;
- disponibilidade/qualidade do autofocus do navegador;
- comportamento da câmera com diferentes iluminações;
- comparação física dos mesmos objetos usados nos testes V0.1–V0.4.

Esses itens só podem ser validados no próximo teste físico.
