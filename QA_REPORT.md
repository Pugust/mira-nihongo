# Mira Nihongo V0.3 — Relatório de reavaliação

## Regra permanente de qualidade

Cada atualização segue o ciclo:

**implementar → testar → reavaliar criticamente → corrigir → testar novamente**

até atingir **10/10 dentro do escopo de código da versão**.

Essa nota não substitui teste físico. Precisão real da câmera, aquecimento, bateria e velocidade no Android são validados separadamente.

---

## Ponto de partida — teste físico da V0.2

Os testes no celular mostraram os gargalos que orientaram esta versão:

1. tampinha de garrafa → `frisbee`;
2. mão → `person`;
3. sapato/perna → `person`;
4. caixa de papelão → classe incompatível em alguns enquadramentos;
5. ventilador sem detecção;
6. Visão ampla/MobileCLIP falhando ao carregar;
7. vocabulário manual ainda pequeno;
8. processamento pesado e aquecimento perceptível do aparelho.

A V0.3 foi desenhada especificamente para reduzir esses problemas, em vez de apenas acrescentar mais uma camada de IA.

---

## Ciclo 1 — Arquitetura e carga térmica: 8,7/10 → 10/10 no escopo de código

### Problema

A V0.2 podia manter COCO-SSD, MobileNet e uma terceira pilha Transformers/MobileCLIP no fluxo. Para um PWA usado continuamente com a câmera aberta, isso aumentava download, memória e inferência sem resolver de forma garantida os falsos positivos observados fisicamente.

### Correções

- removida da produção a terceira camada MobileCLIP/Transformers.js;
- mantidos apenas **COCO-SSD Lite + MobileNet V2 alpha 0.50**;
- MobileNet deixou de ser pré-carregado ao abrir a câmera;
- classificador detalhado carrega somente quando uma leitura realmente precisa dele;
- COCO limitado a no máximo 10 caixas por análise;
- resolução/fps controlados por perfil;
- detector reduz automaticamente o ritmo quando o alvo já está estável;
- intervalo passa a considerar a latência observada no aparelho;
- falhas consecutivas da visão detalhada aumentam o intervalo antes da próxima tentativa;
- inferência é pausada quando a página deixa de estar visível.

### Perfis implementados

- **Econômico:** 480×360, alvo 15 fps, detector ~950 ms;
- **Equilibrado:** 640×480, alvo 18 fps, detector ~650 ms;
- **Precisão:** 960×540, alvo 24 fps, detector ~450 ms.

### QA de agendamento simulado

Em aproximadamente 5,7 s de leitura estável:

- Econômico: 5 chamadas do detector;
- Equilibrado: 6 chamadas;
- Precisão: 7 chamadas;
- classificador detalhado: 1 chamada em cada perfil.

Em alvo desconhecido durante ~10,5 s no modo Equilibrado:

- detector: 15 chamadas;
- visão detalhada: 2 chamadas graças ao backoff;
- erros JavaScript: 0.

Isso valida a lógica de redução de trabalho. **Não mede temperatura real do telefone.**

Resultado do ciclo: **10/10 para arquitetura/agendamento de código**.

---

## Ciclo 2 — Falsos positivos físicos: 8,9/10 → 10/10 no escopo da política

A V0.3 ganhou regras de confirmação específicas para as regressões reais:

- `frisbee` → candidato `bottle_cap` / `キャップ`;
- `skateboard` → candidato `utility_knife` / `カッターナイフ`;
- `suitcase`/`oven` → candidato `cardboard_box` / `段ボール箱`;
- `person` → possibilidade de `shoe` / `靴` quando o classificador detalhado sustenta a leitura;
- ausência de caixa COCO → análise da região central para `fan` / `扇風機` e outros candidatos;
- `person` amplo próximo à mira pode sugerir `hand` / `手`, mas permanece **tentativo**, nunca certeza automática somente pela geometria.

Também foram adicionados grupos de alta confusão para evitar que uma confiança alta do detector básico seja apresentada como certeza linguística quando a classe é conhecida por errar em objetos menores.

### Testes unitários da política

**7/7 passaram:**

- `frisbee` é alta confusão;
- `person` é alta confusão;
- `car` não é tratado como alta confusão sem motivo;
- garrafa sobre mesa → `上`;
- garrafa dentro de caixa compatível → `中`;
- mesa não é tratada automaticamente como recipiente;
- caixa da mira permanece dentro dos limites da imagem.

Resultado do ciclo: **10/10 no escopo de decisão/regras**.

---

## Ciclo 3 — Integração completa das regressões: 9,5/10 → 10/10

Foi executado Chromium headless em viewport **412×915**, com câmera e saídas dos modelos simuladas de forma controlada. O objetivo é validar o encadeamento detector → verificador → política → interface, e não fingir que o mock mede acurácia real dos modelos.

**7/7 cenários passaram, com 0 erros JavaScript:**

1. tampinha → `キャップ` — Reconhecimento estável;
2. estilete → `カッターナイフ` — Reconhecimento estável;
3. mão → `手` — `Talvez seja`, preservando incerteza;
4. sapato → `靴` — Reconhecimento estável;
5. caixa de papelão → `段ボール箱` — Reconhecimento estável;
6. ventilador sem caixa COCO → `扇風機` via visão detalhada;
7. Cena → `ボトルはテーブルの上にあります。`.

O cartão de lição estável ficou em aproximadamente **180 px** numa tela simulada de 412×915.

Resultado: **10/10 no escopo de integração da V0.3**.

---

## Ciclo 4 — Vocabulário: 9,0/10 → 10/10 no escopo da versão

O banco passou de **108 para 202 entradas**.

Além das 80 classes base do detector, foram adicionados objetos cotidianos relevantes para casa, cozinha, ferramentas, escritório, eletrônicos, roupas e pequenos itens, incluindo tampinha, tampa, prato, copo, caneca, pote, lata, frigideira, chaleira, lixeira, balde, toalha, espelho, interruptor, tomada, lâmpada, ar-condicionado, chave inglesa, furadeira, serrote, parafuso, porca, arruela, trena, grampeador, borracha, calculadora, impressora, fones, power bank, pendrive, tripé, roteador, roupas e carteira.

A busca manual agora também considera **aliases**, permitindo encontrar uma entrada por nomes alternativos em português.

Importante: ter a palavra no banco não significa que o detector básico reconheça visualmente aquela classe. O banco ampliado também sustenta `Corrigir`, `Aprender isto`, memória local e busca manual.

Resultado: **10/10 no escopo de vocabulário definido para a V0.3**.

---

## QA estático final

**193/193 verificações passaram.**

Incluem:

- sintaxe JavaScript válida;
- IDs usados pelo JS presentes no HTML e sem duplicatas;
- manifesto PWA válido;
- versão visual V0.3;
- perfis Econômico/Equilibrado/Precisão presentes;
- nenhuma dependência de produção em MobileCLIP/Transformers/open-vocab-loader;
- dependências de visão fixadas por versão;
- limites de câmera e detector presentes;
- desaceleração após estabilização;
- adaptação por latência;
- backoff do classificador detalhado;
- carregamento sob demanda do verificador;
- regressões tampinha/estilete/sapato/caixa/mão/ventilador presentes;
- busca por aliases ativa;
- 202 entradas no banco;
- 80/80 classes do detector base com vocabulário japonês;
- modo Cena e filtros semânticos preservados;
- Service Worker atualizado para `mira-nihongo-v0-3-r1`.

---

## O que ainda exige validação física

O ambiente de QA não substitui o Xiaomi/Android real. Portanto, ainda precisam ser medidos no aparelho:

- temperatura após 5, 10 e 20 minutos;
- consumo de bateria;
- fps perceptivo e fluidez;
- tempo do primeiro carregamento do MobileNet;
- acurácia real da tampinha, estilete, mão, sapato, caixa e ventilador;
- comportamento em iluminação ruim, fundo complexo e objetos parcialmente visíveis;
- diferenças entre Econômico, Equilibrado e Precisão.

Esses itens **não são declarados 10/10 antes do teste físico**.

---

## Resultado final da V0.3

**10/10 para o escopo de código da V0.3.**

Base objetiva:

- **193/193** verificações estáticas;
- **7/7** testes unitários da política;
- **7/7** cenários completos de integração;
- **0** erros JavaScript nos cenários de navegador;
- backoff e perfis de desempenho validados com contagem de chamadas simulada;
- vocabulário expandido para **202 entradas**.

Próximo passo: publicar no mesmo GitHub Pages e repetir os casos físicos, especialmente tampinha, mão, sapato, ventilador, caixa e estilete, comparando também aquecimento nos três perfis.
