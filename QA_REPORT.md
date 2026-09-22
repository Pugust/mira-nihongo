# Mira Nihongo V0.1 — Relatório de reavaliação

## O que significa 10/10 nesta versão

A nota 10/10 significa que o **escopo definido para a V0.1** foi implementado, reavaliado e passou pelos testes de código disponíveis: interface compacta, estabilidade temporal, segunda checagem visual, incerteza explícita, correção manual, memória visual local, imersão progressiva, controles de memória, PWA e atualização por GitHub Pages.

Não significa que um modelo de visão passa a reconhecer qualquer objeto do mundo, nem substitui o teste físico. COCO-SSD e MobileNet continuam sendo modelos de classes fechadas. A validação final de câmera, desempenho e precisão com objetos reais depende do Android e da rede do aparelho.

## Ciclos de desenvolvimento e reavaliação

### Etapa 1 — Experiência de câmera: 9,6/10 → corrigida

Problemas observados no teste físico da V0:

- cartão ocupava uma parte excessiva da câmera;
- dock permanente de cinco modos reduzia ainda mais a área visual;
- caixas de detecção chamavam mais atenção do que o objeto;
- a última lição podia permanecer na tela mesmo após a mira sair do objeto.

Correções:

- painel de lição recolhido na base;
- detalhes sob expansão manual;
- modos movidos para uma folha inferior aberta por um pequeno botão;
- caixas gerais desligadas por padrão; o alvo continua destacável;
- mira reposicionada para preservar espaço;
- três perdas consecutivas do alvo limpam a lição antiga.

Resultado simulado em viewport 412×915:

- barra superior: 56 px;
- cartão em estado estável/memória: ~180 px (aprox. 20% da altura);
- cartão em estado incerto, com confirmação: máximo de 278 px (aprox. 30%);
- área entre barra superior e cartão permanece livre para a câmera e a mira.

### Etapa 2 — Confiabilidade da leitura: 9,7/10 → corrigida

Implementado:

- histórico de 5 leituras;
- mínimo de 3 votos consistentes antes de estabilizar uma classe;
- seleção pelo ponto central da mira;
- segunda checagem visual sobre o recorte do alvo com MobileNet;
- `Talvez seja` quando a confiança é moderada ou os modelos discordam;
- percentuais ocultos por padrão e disponíveis apenas no diagnóstico.

Reavaliação encontrou uma lacuna: a memória de correções precisava ficar sob controle explícito do usuário.

Correções:

- botão para apagar todas as correções visuais;
- contador de correções persistidas;
- botão separado para redefinir o progresso da imersão.

### Etapa 3 — Correção e memória: 9,9/10 → corrigida

Implementado:

- `Corrigir` e `Aprender isto` abrem vocabulário pesquisável;
- vocabulário ampliado com objetos que não existem entre as 80 classes do COCO-SSD, incluindo `カッターナイフ`, `箱`, `段ボール箱`, `鍵`, `ドア`, ferramentas e outros itens cotidianos;
- o recorte atual gera um dHash de 64 bits;
- a correção salva `hash + classe bruta + palavra corrigida` em `localStorage`;
- uma futura imagem suficientemente parecida, com a mesma classe bruta, pode reutilizar a correção;
- limiar de Hamming conservador para reduzir associações acidentais;
- máximo de 40 correções locais.

Fluxo de integração simulado validado:

1. detector principal retorna `skateboard` com 71%;
2. segunda checagem retorna `letter opener` com 74%;
3. interface mostra `カッターナイフ` como **Talvez seja**;
4. correção manual para `段ボール箱` é salva;
5. nova execução com a mesma assinatura visual retorna `段ボール箱` como **Lembrança local**;
6. limpeza de correções retorna o contador a zero.

Nenhum erro JavaScript foi registrado nesse fluxo simulado.

### Etapa 4 — Didática e imersão: 9,9/10 → corrigida

Mantido/corrigido:

- これ・それ・あれ continuam escolhidos conscientemente pelo aluno;
- pessoa usa `この人／その人／あの人`, não os demonstrativos de objeto de forma mecânica;
- seres animados usam `います`; objetos usam `あります`;
- português saiu do cartão principal e fica nos detalhes;
- modo progressivo usa interações intencionais, não frames da câmera, para medir familiaridade;
- nível 1: japonês + kana + rōmaji + português;
- nível 2: japonês + kana + rōmaji;
- nível 3: japonês + kana;
- ouvir, confirmar e revelar quiz aumentam familiaridade; mera detecção repetitiva não aumenta.

### Etapa 5 — Atualização/PWA: 9,9/10 → corrigida

A reavaliação detectou que cache-first seria inconveniente para um projeto que será atualizado frequentemente via GitHub Pages.

Correção:

- Service Worker alterado para **network-first** em recursos locais;
- quando há rede, HTML/JS/CSS novos são priorizados;
- quando não há rede, a última versão cacheada continua como fallback;
- cache versionado como `mira-nihongo-v0-1-r2`;
- caches antigos são removidos na ativação.

## QA estático final

**45/45 verificações passaram.**

Incluem:

- sintaxe válida em `app.js`, `japanese-data.js` e `sw.js`;
- `manifest.webmanifest` válido;
- `display: standalone` e caminhos relativos;
- todos os IDs usados pelo JavaScript existem no HTML;
- nenhum ID HTML duplicado;
- 80/80 classes esperadas do COCO-SSD presentes;
- vocabulário manual adicional presente;
- versões de TFJS, COCO-SSD e MobileNet fixadas;
- consenso temporal implementado;
- segunda checagem implementada;
- dHash e distância de Hamming implementados;
- controles de limpeza de memória presentes;
- progressão automática de imersão presente;
- caixas desligadas por padrão;
- diagnóstico opt-in;
- tratamento especial de pessoas e localização animada;
- cartão compacto e dock antigo removido;
- todos os assets locais essenciais incluídos no Service Worker.

## Teste de integração em navegador

Foi executado Chromium headless com viewport mobile 412×915 e modelos/câmera simulados localmente, porque o ambiente de empacotamento não possui acesso de rede às CDNs dos modelos.

Resultados principais:

- segunda checagem `skateboard → letter opener → カッターナイフ`: passou;
- estado `Talvez seja`: passou;
- diálogo de correção: passou;
- busca por `papelão`: 1 resultado pertinente;
- persistência da correção: passou;
- reaplicação em nova execução como `Lembrança local`: passou;
- limpeza de correções: passou;
- erros JavaScript no fluxo: 0.

## Resultado

**10/10 para o escopo de código da V0.1.**

A etapa ainda não declarada 10/10 é a **validação física da V0.1 em Android com os modelos reais**, pois ela exige o aparelho, a câmera, a conexão e objetos reais. Essa distinção será mantida nas próximas versões.
