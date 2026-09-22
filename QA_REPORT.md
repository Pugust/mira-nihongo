# Mira Nihongo V0.7 — Relatório de reavaliação

## Regra de validação
A versão só recebe 10/10 **no escopo de código e comportamento simulável** após ciclos de implementação → crítica → correção → reteste. Câmera, temperatura, ergonomia e valor pedagógico ao longo de dias de uso continuam exigindo validação física separada no aparelho real.

## Ciclo 1 — modelo de aprendizagem
**Nota inicial: 9,6/10.**

Problemas encontrados:
- o progresso da V0.6 era basicamente `seen + mastery`, insuficiente para decidir o que ensinar depois;
- adicionar revisão sem cuidado poderia transformar o Mira numa lista de deveres;
- a migração precisava preservar progresso já existente.

Correções:
- novo `adaptive-learning.js` com perfil por palavra;
- encontros, sucessos, pedidos de revisão, intervalo, `dueAt` e exposições de conteúdo;
- migração do progresso V0.4/V0.5/V0.6 para o formato V0.7;
- revisão definida como **oportunista**: só aparece quando o objeto reaparece naturalmente;
- nenhuma streak, meta diária obrigatória ou fila de tarefas foi adicionada.

## Ciclo 2 — progressão e gramática contextual
**Reavaliação: 9,8/10.**

Problemas encontrados:
- domínio da palavra sozinho ainda podia repetir frases parecidas;
- a gramática aprendida não era considerada na escolha do próximo conteúdo.

Correções:
- cada frase recebe habilidades associadas por padrão, partícula e verbo;
- padrões de identificação, ação, localização e cena passam a ter progresso próprio;
- `は・が・を・に・で・の` podem ser acompanhadas conforme aparecem;
- seleção adaptativa pondera novidade da frase, domínio da palavra e estruturas menos consolidadas;
- `Já sei` reforça palavra + estruturas da frase atual;
- `Quero revisar` reduz domínio e antecipa ajuda futura.

## Ciclo 3 — revisão rápida e painel
**Reavaliação: 9,9/10.**

Problemas encontrados:
- uma revisão obrigatória iria interromper demais o uso cotidiano;
- um painel de progresso poderia sugerir cobrança ou tarefas pendentes.

Correções:
- revisão rápida revela automaticamente em cerca de 1,8 s e também oferece `Mostrar agora`;
- revisão pode ser desligada nas configurações;
- painel `Meu aprendizado` é descritivo e local;
- resumo de palavras vistas, aprendendo, familiares, dominadas e estruturas vistas;
- revisões aparecem como oportunidades, não como uma fila obrigatória.

## Ciclo 4 — estabilidade da lição
**Reavaliação crítica antes do fechamento: 9,9/10.**

Problema encontrado:
- registrar uma exposição alterava a pontuação adaptativa; em uma nova renderização da UI, isso poderia fazer a frase atual trocar sem uma ação do usuário.

Correção:
- cada encontro agora recebe um `lessonPlan` estável;
- re-render, Freeze e mudanças visuais preservam a mesma frase;
- a frase só é recalculada quando o usuário pede outra, muda o modo/demonstrativo, dá feedback de domínio ou ocorre um novo encontro.

## Ciclo 5 — regressão e fechamento
**Resultado: 10/10 no escopo definido.**

Validações finais:
- progresso antigo migra sem perder `seen`, `mastery` e `lastSeen`;
- revisão respeita `dueAt` e o toggle do usuário;
- feedback positivo/negativo atualiza intervalo e domínio;
- gramática é registrada e reforçada sem depender de backend;
- conteúdo novo prioriza identificação, depois avança para ações e relações menos vistas;
- a frase permanece estável durante o encontro;
- Stable Focus, Broad Recognition, Freeze e Interaction & Flow continuam passando suas regressões;
- cache PWA atualizado para `mira-nihongo-v0-7-r1` com `adaptive-learning.js`.

## Suíte automatizada

### Validação estática
**103/103** verificações aprovadas.

Inclui sintaxe JS, IDs, recursos locais, manifesto, Service Worker, ordem dos módulos, invariantes de UX, privacidade e banco de **383 entradas**.

### Motor de visão
**9/9** cenários de regressão aprovados.

Preserva estilete/switch/celular, mão/pessoa, sapato/pessoa, tampinha/frisbee, parte–todo e Sticky Lock.

### Motor de interação
**13/13** asserções aprovadas.

Preserva snaps do bottom sheet, drag e swipe da V0.6.

### Motor adaptativo
**30/30** asserções aprovadas.

Cobre migração, agenda de revisão, feedback, habilidades gramaticais, exposição, escolha adaptativa, recall e resumo do aprendizado.

### Runtime DOM sem câmera
**34/34** asserções aprovadas.

Cobre inicialização, V0.5/V0.6 regressões, reconhecimento, Freeze, tutorial, revisão rápida, revelação, estabilidade da frase e painel de aprendizado.

**Total automatizado contabilizado: 189/189 verificações/asserções/cenários aprovados.**

Uma tentativa adicional de validação visual por Chromium headless foi bloqueada pelo ambiente de execução (`ERR_BLOCKED_BY_ADMINISTRATOR`). Ela **não é contabilizada como aprovação** e não foi substituída por uma alegação de teste visual inexistente.

## Nota final
**10/10 — código + comportamento simulável dentro do escopo da V0.7.**

Ainda requer teste físico no celular para validar:
- se a revisão de ~1,8 s é natural ou lenta demais no cotidiano;
- se a progressão escolhida parece realmente útil após vários reencontros;
- se `Já sei / Quero revisar` produz um ritmo agradável durante alguns dias;
- clareza do painel `Meu aprendizado` na tela real;
- manutenção da ergonomia, temperatura e precisão visual já testadas nas versões anteriores.
