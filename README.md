# Mira Nihongo V0.7 — Adaptive Learning

Aplicação web/PWA mobile-first para aprender japonês olhando para objetos do cotidiano.

A V0.7 preserva o fluxo, Freeze e reconhecimento da V0.6 e adiciona um **motor de aprendizagem adaptativa local**. O objetivo não é criar deveres: o Mira usa cada reencontro com um objeto para escolher algo útil que ainda merece exposição.

## Fluxo principal

1. Mire no objeto e deixe o Focus-First reconhecê-lo.
2. O quadro pode congelar, como na V0.6.
3. O Mira consulta o progresso **daquela palavra** e das estruturas já vistas.
4. Palavras novas priorizam nome/identificação; depois entram ações, localização, contexto e estruturas menos praticadas.
5. Se uma palavra familiar reaparece no momento de revisão, surge uma **revisão rápida opcional** antes da resposta.
6. `✓ Já sei` aumenta o domínio e espaça a próxima oportunidade; `↺ Quero revisar` devolve ajuda e antecipa o reencontro pedagógico.
7. `🧠 Meu aprendizado` mostra o que já apareceu e quais estruturas estão sendo praticadas, sem streaks, metas obrigatórias ou lista de tarefas.

## Novidades da V0.7

- Novo `adaptive-learning.js`, separado do motor visual e da interface.
- Migração automática do progresso V0.4/V0.5/V0.6 para o formato V0.7.
- Perfil por palavra com encontros, domínio, acertos, pedidos de revisão, próxima oportunidade e exposições de conteúdo.
- Perfil gramatical local para padrões, partículas e verbos vistos nas frases.
- Seleção adaptativa de conteúdo por novidade, repetição anterior e estruturas menos dominadas.
- Progressão natural: identificação → ações → localização/cena → variações menos vistas.
- Revisão oportunista que só aparece quando o objeto volta à câmera; não cria uma fila obrigatória.
- Resposta da revisão revela automaticamente após ~1,8 s ou imediatamente pelo botão `Mostrar agora`.
- Frase adaptativa permanece estável durante o encontro e não troca apenas porque a UI redesenhou.
- Painel `Meu aprendizado` com resumo de palavras e estruturas.
- Ajuda em português/rōmaji continua desaparecendo por palavra conforme o domínio já existente.
- Todo o aprendizado permanece em `localStorage`; nenhuma conta ou backend foi adicionado.

## Privacidade

Os quadros são processados no navegador. O app não contém código para enviar fotos da câmera para um servidor. Os modelos TensorFlow.js são obtidos das CDNs declaradas em `index.html` e executados localmente no navegador.

O histórico de aprendizado, correções e preferências ficam no armazenamento local do navegador.

## GitHub Pages

Publique o conteúdo deste diretório na raiz da branch usada pelo Pages. O Service Worker usa o cache `mira-nihongo-v0-7-r1` e inclui `adaptive-learning.js` no precache.

## Limites de validação

A V0.7 recebeu validação automatizada de código, regressões da visão, interação e motor adaptativo. Isso **não substitui teste físico** de câmera, temperatura, ergonomia e utilidade pedagógica ao longo de dias de uso. A nota 10/10 do relatório vale para o escopo de código e comportamento simulável.
