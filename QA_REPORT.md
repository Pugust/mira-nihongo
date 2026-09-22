# Mira Nihongo V0.2 — Relatório de reavaliação

## Regra de qualidade do projeto

Cada atualização passa por ciclos de:

**implementar → testar → reavaliar criticamente → corrigir → testar novamente**

até atingir **10/10 dentro do escopo definido para o código da versão**.

A nota não substitui teste físico. “10/10 de código” e “10/10 em câmera real” são estados diferentes e continuarão sendo reportados separadamente.

---

## Ponto de partida: teste físico da V0.1

As fotos reais enviadas após a V0.1 revelaram cinco regressões concretas:

1. estilete → `skateboard`;
2. mão → `person`;
3. caixa de papelão → `suitcase`;
4. sapato/perna → `person`;
5. ventilador → nenhuma detecção.

Esses casos passaram a orientar diretamente a política da V0.2.

---

## Ciclo 1 — Cobertura visual: 8,8/10 → corrigido

Problema: COCO-SSD possui apenas 80 classes e não pode reconhecer diretamente muitos objetos cotidianos.

Implementado:

- terceira camada de visão usando `Xenova/mobileclip_s0` com Transformers.js;
- classificação zero-shot contra candidatos controlados pelo Mira Nihongo;
- análise da região da mira mesmo quando COCO-SSD não retorna caixa alguma;
- vocabulário visual explícito para estilete, caixa/papelão, ventilador, mão e calçado;
- botão manual `Analisar mira`.

Reavaliação: **9,4/10**. Ainda havia risco de custo de rede/desempenho desnecessário ao carregar o modelo amplo sempre que a câmera abrisse.

Correção:

- modelo amplo passou a carregar **sob demanda**;
- primeiro uso informa aproximadamente 57 MB de download quantizado + arquivos pequenos;
- falha de rede recebe backoff de 60 s;
- análise manual pode forçar nova tentativa.

Resultado do ciclo: **10/10 no escopo de arquitetura de fallback**.

---

## Ciclo 2 — Falsos positivos conhecidos: 9,1/10 → corrigido

Problema: confiança alta do detector não significa que a classe seja correta. Os testes físicos mostraram classes sistematicamente amplas/erradas.

Implementado:

- famílias explícitas de confusão para `skateboard`, `person`, `suitcase`, `oven`, `bench`, `dining table`, `bottle`, `cup`, `knife` e `scissors`;
- listas curtas de candidatos para essas famílias, reduzindo comparação com rótulos irrelevantes;
- `person` usa recorte localizado na mira para MobileNet/MobileCLIP;
- MobileNet ganhou mapeamentos rápidos para `electric fan` e classes de calçado;
- categorias de alta confusão deixam de virar “Reconhecimento estável” apenas pela confiança do detector caso a checagem ampla falhe.

Testes unitários da política:

- skateboard → utility knife: passou;
- person → hand: passou;
- person → shoe: passou;
- suitcase → cardboard box: passou;
- nenhuma detecção → fan: passou;
- resultado zero-shot ambíguo: corretamente rejeitado;
- shortlist de `person`: passou.

Resultado: **9/9 testes de política passaram**.

Reavaliação: **10/10 no escopo de política de decisão**.

---

## Ciclo 3 — Palavra antiga após mover a câmera: 9,5/10 → corrigido

Problema: um reconhecimento feito diretamente pela mira não possui uma caixa COCO para dizer que o objeto desapareceu. Sem proteção adicional, uma palavra antiga poderia permanecer enquanto a câmera já estivesse apontando para outra coisa.

Correções:

- hash perceptual do recorte da mira é comparado entre análises;
- mudança visual grande coloca a leitura em estado de rechecagem;
- duas leituras amplas inconclusivas removem a seleção antiga;
- memória local continua disponível sem converter leitura incerta em certeza.

Teste de navegador simulado:

- primeira análise reconhece 扇風機;
- análises posteriores ficam ambíguas;
- cartão antigo é removido após a política de perda de confirmação;
- erros JavaScript: 0.

Resultado: **10/10 no escopo de estado/staleness**.

---

## Ciclo 4 — Relações de cena: 8,9/10 → corrigido

Primeira implementação geométrica poderia interpretar um objeto projetado dentro da caixa delimitadora de uma mesa como “dentro da mesa”. Isso seria linguisticamente ruim mesmo que a geometria 2D estivesse correta.

Correções:

- `中` só é inferido para classes semanticamente compatíveis com recipientes;
- `上`/apoio usa classes compatíveis com superfícies e sobreposição suficiente;
- esquerda/direita exigem proximidade e dominância horizontal;
- relações fracas são descartadas em vez de mostradas como fato;
- ausência de relação segura faz o modo Cena voltar à localização simples.

Testes de política:

- garrafa sobre mesa → 上: passou;
- garrafa dentro de mala → 中: passou;
- caixa delimitadora de mesa não é automaticamente tratada como recipiente: passou.

Resultado: **10/10 no escopo heurístico da V0.2**.

---

## QA estático final

**74/74 verificações passaram.**

Entre elas:

- sintaxe válida em todos os JavaScript;
- IDs do JavaScript existentes no HTML e nenhum ID duplicado;
- manifesto PWA válido;
- versões das dependências fixadas;
- Transformers.js `3.8.1`, MobileCLIP e `q8` presentes;
- carregamento amplo lazy e backoff presentes;
- 80/80 classes COCO possuem entrada japonesa;
- 108 entradas totais no banco atual;
- estilete, papelão, ventilador, mão e calçado presentes;
- estados de alta confusão presentes;
- regras rápidas de ventilador/calçado presentes;
- Cena e filtros semânticos presentes;
- memória/correção/imersão preservadas;
- Service Worker V0.2 network-first com todos os assets locais essenciais.

---

## QA de execução em navegador

Foi usado Chromium headless em viewport **412×915** com câmera, COCO-SSD, MobileNet e MobileCLIP simulados. Isso testa integração e política sem fingir que substitui a inferência real dos modelos.

### Regressões principais

**6/6 cenários passaram, com 0 erros JavaScript:**

- estilete → `カッターナイフ` / Visão ampla;
- mão → `手` / Visão ampla;
- calçado → `靴` / Visão ampla;
- caixa de papelão → `段ボール箱` / Visão ampla;
- sem caixa COCO → `扇風機` / Visão ampla;
- Cena: `ボトルはテーブルの上にあります。`.

O cartão estável ficou em aproximadamente **180 px** numa tela de 412×915, abaixo de 20% da altura útil simulada.

### Testes defensivos

**2/2 passaram, com 0 erros JavaScript:**

- `person` com Visão ampla inconclusiva permaneceu em `Talvez seja` em vez de ser promovido a certeza;
- reconhecimento amplo antigo foi ocultado após leituras posteriores inconclusivas.

---

## O que não foi validado neste ambiente

O ambiente de empacotamento não consegue baixar os pesos externos do Hugging Face/CDNs. Portanto, os testes de execução usaram saídas controladas dos modelos para validar toda a cadeia de decisão e UI.

Ainda precisa ser testado fisicamente no Android:

- download real inicial do MobileCLIP;
- tempo de inferência no aparelho;
- reconhecimento real dos cinco objetos das fotos;
- comportamento térmico/bateria;
- cache do modelo após fechar/reabrir;
- desempenho em Wi‑Fi e dados móveis.

Esses pontos **não são chamados de 10/10 ainda**.

---

## Resultado

**10/10 para o escopo de código da V0.2.**

Base objetiva:

- 74/74 verificações estáticas;
- 9/9 testes unitários da política;
- 6/6 cenários principais de integração;
- 2/2 cenários defensivos;
- 0 erros JavaScript nos cenários de integração.

Próxima validação: publicar a V0.2 no mesmo GitHub Pages e repetir os cinco casos físicos no celular.
