# Mira Nihongo V0.6 — Relatório de reavaliação

## Regra de validação
A versão só recebe 10/10 **no escopo de código e UX simulável** após ciclos de implementação → crítica → correção → reteste. Câmera, ergonomia real, temperatura e sensação dos gestos no Android continuam exigindo validação física separada.

## Ciclo 1 — hierarquia e bottom sheet
**Nota inicial: 9,6/10.**

Problemas encontrados:
- o cartão ainda se comportava como painel binário aberto/fechado;
- havia dois controles de retomada da câmera;
- a interface congelada mantinha marcações demais sobre o objeto.

Correções:
- bottom sheet com snaps Compacto / Médio / Completo;
- drag vertical com feedback contínuo e snap ao soltar;
- toque na alça como fallback equivalente;
- único botão dinâmico `Congelar / Continuar`;
- mira e caixas desaparecem após 700 ms no frame congelado e reaparecem temporariamente ao tocar na imagem;
- cabeçalho e seletor de modo reduzidos.

## Ciclo 2 — descobribilidade e uso com uma mão
**Reavaliação: 9,8/10.**

Problema encontrado: gestos úteis poderiam virar funções escondidas.

Correções:
- swipe de frase sempre possui fallback `⋯ Mais → Outra frase`;
- histórico permanece em botão explícito, sem gesto de borda que conflita com Android;
- drag do cartão continua possível por toque;
- tutorial contextual de 4 etapas sobre a interface real;
- tutorial pode avançar pela interação real ou pelo botão `Próxima`;
- feedback háptico opcional;
- tamanho de texto configurável;
- suporte a `prefers-reduced-motion` e `:focus-visible`.

## Ciclo 3 — hierarquia em leituras incertas
**Reavaliação: 9,9/10.**

Problema encontrado: um cartão compacto podia ficar apertado quando candidatos e confirmação eram necessários, e `Continuar` podia competir com `É isso / Corrigir`.

Correções:
- cartão compacto ganha altura adaptativa em estado tentativo;
- botão principal fica oculto enquanto a leitura exige confirmação;
- candidatos aparecem somente em incerteza;
- novo objeto sempre volta ao estado compacto;
- ações secundárias ficam agrupadas em `⋯ Mais`;
- `Quero dizer algo` passou para rail horizontal.

## Ciclo 4 — regressão e limpeza
**Resultado: 10/10 no escopo definido.**

Validações:
- nenhuma regressão nas regras de visão da V0.5;
- nenhuma referência HTML quebrada;
- controles duplicados antigos removidos;
- posição do cartão é somente da sessão e não entra em `localStorage`;
- novo `interaction-engine.js` carregado antes do app e incluído no Service Worker;
- estilos antigos do onboarding removidos;
- cache PWA atualizado para `mira-nihongo-v0-6-r1`.

## Suíte automatizada

### Validação estática
**81/81** verificações aprovadas.

Inclui sintaxe JS, IDs, recursos locais, manifesto, cache PWA, invariantes de UX, privacidade e banco de **383 entradas**.

### Motor de visão
**9/9** cenários de regressão aprovados.

Preserva os testes físicos transformados em regras: estilete/switch/celular, mão/pessoa, sapato/pessoa, tampinha/frisbee, parte–todo e Sticky Lock.

### Motor de interação
**13/13** asserções aprovadas.

Cobre snaps, limites do bottom sheet, velocidade/direção de drag e reconhecimento de swipe horizontal sem confundir movimento vertical.

### Runtime DOM sem câmera
**24/24** asserções aprovadas.

Cobre inicialização, reconhecimento tentativo/estável, candidatos, congelamento, botão principal, estados do bottom sheet, troca de frase, retomada, tutorial e integração do gesto de arrastar.

**Total automatizado contabilizado: 127/127 verificações/asserções/cenários aprovados.**

Uma tentativa adicional de screenshot via Chromium headless no ambiente de execução não concluiu dentro do limite do processo. Ela **não é contabilizada como aprovação** e não foi substituída por uma alegação de teste visual inexistente.

## Nota final
**10/10 — código + UX simulável dentro do escopo da V0.6.**

Ainda requer teste físico no celular para validar:
- conforto real do drag com polegar;
- altura percebida dos três snaps em diferentes telas;
- ausência de conflitos com gestos do navegador/Android;
- haptics no hardware real;
- legibilidade dos três tamanhos de texto;
- velocidade/temperatura da câmera e IA;
- precisão visual dos objetos reais.
