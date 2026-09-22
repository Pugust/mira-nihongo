# Mira Nihongo V0.4 — Focus & Immersion

## Reconhecimento / desempenho
- Nova arquitetura **Focus-First**: amostragem leve de movimento/nitidez na região da mira antes de inferência pesada.
- COCO-SSD recebe um **recorte focal**, não a cena inteira como fluxo principal.
- Após reconhecer, entra em **rastreamento leve**; nova inferência ocorre apenas quando a região muda, quando o usuário move o foco ou pede análise.
- Tentativa de ativar autofocus contínuo quando navegador/câmera expõem `focusMode`.
- Toque na câmera move o ponto de foco visual.
- MobileNet V2 é carregado sob demanda e usado em classes confusas ou quando COCO não resolve.
- Telemetria local: inferências pesadas/minuto, tempo médio e estado do pipeline. Não é um termômetro físico.

## Pedagogia
- **Cartão Vivo**: nome aparece primeiro; a frase surge depois de uma curta permanência no objeto.
- **Progresso individual por palavra** (0–5), substituindo a lógica de imersão puramente global.
- `✓ Já sei` reduz ajuda daquela palavra; `↺ Quero revisar` aumenta ajuda.
- Progressão: identificação → ação → segunda ação → localização/contexto → variações.
- **Breakdown** tocável por blocos, com leitura, significado, função e padrão reutilizável.
- **Quero dizer algo**: identificar, usar, pegar, colocar, perguntar onde está e descrever.
- Cena mantém relações conservadoras `上・下・中・左・右` quando há evidência visual suficiente.
- Pessoas/seres vivos usam `います`; objetos usam `あります`.
- Tratamento especial para `人`, evitando usar `これ/それ/あれ` como se uma pessoa fosse um objeto.

## Vocabulário
- Base ampliada para **290 entradas** cotidianas.
- Busca aceita português, japonês, kana, rōmaji e aliases.

## Interface
- Câmera permanece como área principal.
- Modo **Cotidiano** e **Imersão** priorizam baixa interrupção.
- Breakdown e produção ativa ficam recolhidos até o usuário pedir.
