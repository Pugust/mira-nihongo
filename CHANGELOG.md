# Mira Nihongo V0.7 — Adaptive Learning

## Motor adaptativo
- Novo módulo local `js/adaptive-learning.js`.
- Perfil por palavra agora registra encontros, domínio, sucessos, pedidos de revisão, intervalo, próxima oportunidade de revisão e conteúdos já vistos.
- Progresso antigo é migrado automaticamente para o formato V0.7.
- Seleção de próxima frase considera domínio da palavra, quantidade de exposições e fraqueza das estruturas gramaticais relacionadas.
- A frase escolhida fica fixa durante aquele encontro para impedir trocas inesperadas em re-renderizações.

## Revisão oportunista
- Palavras familiares podem gerar uma pergunta curta quando reaparecem depois do intervalo de revisão.
- A revisão não cria tarefas nem bloqueia o uso: a resposta aparece automaticamente após ~1,8 s ou por `Mostrar agora`.
- `Já sei` aumenta domínio e espaça o próximo reencontro pedagógico.
- `Quero revisar` reduz domínio e faz o Mira fornecer ajuda novamente mais cedo.
- Revisão oportunista pode ser desligada nas configurações.

## Gramática contextual
- Padrões de identificação, ação, localização e cena passam a ser rastreados.
- Partículas como `は・が・を・に・で・の` entram no perfil gramatical conforme aparecem.
- Verbos finais das frases também podem ser registrados como habilidades contextuais.
- Feedback `Já sei / Quero revisar` reforça ou reduz o domínio das estruturas presentes na frase atual.

## Interface pedagógica
- Novo indicador de objetivo da lição atual.
- `Meu aprendizado` mostra palavras vistas, em aprendizado, familiares, dominadas e revisões oportunas.
- Estruturas mais encontradas aparecem com progresso local.
- Sem streak, ranking, meta diária obrigatória ou fila punitiva.

## Compatibilidade
- Stable Focus, Auto Freeze, Broad Recognition, bottom sheet, gestos, Breakdown, produção ativa, histórico, correções e 383 entradas da V0.6 foram preservados.
- Cache PWA atualizado para `mira-nihongo-v0-7-r1`.
