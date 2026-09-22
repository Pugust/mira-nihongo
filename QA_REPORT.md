# Mira Nihongo V0.4 — Relatório de reavaliação

## Escopo
A V0.4 foi tratada como uma atualização estrutural com quatro metas separadas:

1. **Reconhecimento:** priorizar o objeto na região da mira e reduzir falsos positivos apresentados como certeza.
2. **Desempenho:** eliminar inferência visual pesada contínua enquanto um objeto permanece estável.
3. **Experiência de câmera:** tornar o fluxo semelhante a foco de câmera: mirar, estabilizar, identificar e acompanhar.
4. **Pedagogia:** transformar cada objeto em uma sequência contextual de nome → frase → ação → estrutura → produção ativa.

A nota 10/10 abaixo se refere ao **escopo de código e testes automatizáveis**. Temperatura física, consumo real de bateria, latência de câmera/modelos e qualidade de reconhecimento no aparelho continuam exigindo validação física no Android.

---

## Ciclo 1 — arquitetura Focus-First
**Nota inicial: 9,4/10**

A primeira proposta ainda poderia ser interpretada como apenas reduzir a frequência do detector. Isso não atendia totalmente à ideia de identificar primeiro a região em foco e só depois classificar.

### Correções
- criado observador visual leve da região da mira;
- amostragem usa canvas de 72×72, movimento e contraste/nitidez aproximada;
- detector pesado só é chamado depois de estabilidade suficiente;
- COCO-SSD recebe um **recorte focal** em vez do vídeo inteiro no fluxo principal;
- depois do reconhecimento, o estado muda para `tracking` e o detector deixa de rodar continuamente;
- nova inferência acontece após mudança visual relevante, toque em outro ponto ou análise manual;
- tentativa opcional de `focusMode: continuous` quando a câmera/navegador oferecem essa capacidade;
- toque no vídeo reposiciona o ponto de foco do Mira.

**Reavaliação: 10/10 para a arquitetura definida.**

---

## Ciclo 2 — pedagogia cotidiana
**Nota inicial: 9,7/10**

O conteúdo estava completo, mas precisava provar que não viraria um painel cheio de controles e que o nível individual de uma palavra realmente mudaria aquilo que o usuário vê.

### Correções / validações
- criado **Cartão Vivo**: palavra primeiro, frase depois de permanência curta;
- breakdown fica recolhido e só abre sob demanda;
- “Quero dizer algo” fica recolhido e oferece seis intenções contextuais;
- progresso é salvo por palavra em vez de depender apenas de um nível global;
- `✓ Já sei` aumenta domínio e reduz ajuda daquela palavra;
- `↺ Quero revisar` reduz domínio e devolve ajuda;
- progressão pedagógica: identificação → ação 1 → ação 2 → localização/contexto → variações;
- modos Cotidiano, Ações, Local, Cena, Quiz e Imersão passam pelo mesmo motor pedagógico;
- breakdown identifica partículas como `を` e `に` e apresenta um padrão reutilizável.

**Reavaliação: 10/10 para o motor pedagógico da V0.4.**

---

## Ciclo 3 — revisão linguística
**Nota inicial: 9,9/10**

A revisão encontrou dois problemas que impediam nota máxima:

- localização de seres vivos não deve usar `あります`;
- `人` precisava continuar recebendo tratamento especial para evitar ensinar pessoas como objetos demonstrados por `これ/それ/あれ`.

### Correções
- seres vivos usam `います` nas estruturas de existência/localização;
- coisas usam `あります`;
- `人` usa `この人 / その人 / あの人` na identificação;
- breakdown foi atualizado para reconhecer demonstrativos e interrogativos adicionais.

**Reavaliação: 10/10 para as estruturas linguísticas cobertas.**

---

## Ciclo 4 — regressões, vocabulário e robustez

### Testes automatizados
Foram executadas **169 verificações automatizadas**, com resultado:

**169/169 PASS**

Cobertura incluída:
- arquivos obrigatórios e referências de assets;
- todos os IDs DOM usados pelo JavaScript;
- sintaxe de `app.js`, `japanese-data.js`, `recognition-policy.js`, `learning-engine.js` e `sw.js`;
- JSON do manifesto;
- cache PWA V0.4;
- marcadores estruturais do pipeline Focus-First;
- ausência do scheduler contínuo de detecção usado nas versões anteriores;
- toque para mover foco;
- carregamento sob demanda do verificador;
- canvas leve de foco;
- telemetria local e aviso de que ela não mede temperatura física;
- controles pedagógicos da V0.4;
- armazenamento de progresso por palavra;
- base de vocabulário com **290 entradas**;
- campos obrigatórios em todas as entradas e ações;
- palavras de regressão: tampinha, estilete, ventilador, mão, sapato e caixa;
- frases e breakdown para níveis de domínio 0–5;
- seis intenções de produção ativa;
- progressão automática de ajuda por palavra;
- classes de alta confusão (`frisbee`, `skateboard`, `person`, `suitcase`, `oven`, `bottle`, `knife`);
- relações de cena `on` e `inside`.

### Smoke test do aplicativo
O `app.js` também foi inicializado em um DOM simulado com TensorFlow/COCO/MobileNet mockados. Foram validados:
- inicialização do aplicativo;
- seleção de `ボトル`;
- renderização de frase;
- renderização nos seis modos;
- renderização em níveis de domínio 0–5.

Resultado: **PASS**.

---

## Regressões derivadas dos testes físicos anteriores

Os erros observados anteriormente não podem ser “garantidos como resolvidos” sem repetir as fotos no aparelho, mas a V0.4 os trata de forma explícita:

- **tampinha → frisbee:** `frisbee` permanece classe de alta confusão e exige verificação/confirmação; `キャップ` existe no vocabulário e no mapeamento do verificador.
- **estilete → skateboard:** `skateboard` é alta confusão e o verificador contém mapeamento para `カッターナイフ` quando o classificador reconhece classes compatíveis.
- **mão / sapato → pessoa:** `person` exige verificação e a análise focal reduz a chance de a caixa corporal ampla dominar a mira.
- **caixa → mala/forno:** `suitcase` e `oven` permanecem classes de alta confusão; caixa/papelão fazem parte do vocabulário e das alternativas.
- **ventilador sem reconhecimento:** `扇風機` permanece disponível para MobileNet e correção manual, mas ainda depende do que os modelos conseguem distinguir na imagem real.

---

## Desempenho
A V0.4 foi desenhada para executar muito menos inferência pesada que a V0.3:

- amostragem contínua: canvas 72×72;
- inferência COCO: somente quando a região estabiliza/muda;
- MobileNet: somente quando necessário;
- estado `tracking`: nenhuma classificação contínua;
- perfis Econômico, Equilibrado e Precisão alteram resolução, FPS e frequência da amostragem leve;
- telemetria mostra inferências pesadas por minuto e tempo médio.

Isso valida a **estratégia de redução de carga**, não a temperatura final do aparelho. O teste térmico de 10 minutos no telefone continua sendo critério físico obrigatório.

---

# Resultado final

**V0.4: 10/10 no escopo de código definido.**

O que ainda precisa ser validado fisicamente:
- tempo real de `mirar → reconhecer` no aparelho;
- aquecimento após ~10 minutos no modo Equilibrado;
- comportamento do autofocus exposto pelo navegador do aparelho;
- regressões reais com tampinha, estilete, mão, sapato, caixa e ventilador;
- legibilidade do Cartão Vivo durante uso cotidiano;
- qualidade das relações de Cena com câmera real.

Esses itens não são contabilizados como “já aprovados” apenas porque o código passou nos testes.
