# Mira Nihongo V0 — Relatório de reanálise

## Critério de nota 10 desta V0

A nota 10 significa que o pacote atende integralmente ao escopo definido para a primeira versão estática: câmera web, detecção por mira, conteúdo japonês consistente, modos de estudo, fallback manual, áudio quando suportado, persistência de preferências, PWA básica, tratamento de falhas e arquivos prontos para GitHub Pages.

Ela **não significa validação física em todos os celulares**. Câmera, voz japonesa e desempenho de TensorFlow.js variam por navegador e aparelho; o teste final em Android real continua sendo a validação de dispositivo.

## Ciclos

### Etapa 1 — Arquitetura: 9,3/10 → corrigida

Pontos bons: fluxo câmera → detector → vocabulário → frase já estava definido.

Lacunas encontradas:
- faltava fallback quando a mira não reconhecesse bem;
- faltava progressão de imersão para retirar português/rōmaji.

Correções:
- vocabulário manual pesquisável com as 80 categorias;
- caixas detectadas tocáveis;
- três níveis persistentes de imersão.

### Etapa 2 — Implementação central: 9,6/10 → corrigida

Entregue:
- câmera traseira/frontal;
- mira central;
- estabilização antes de mudar a lição;
- seleção do objeto sob a mira;
- 80/80 categorias do COCO-SSD com japonês, kana, rōmaji e português;
- modos Explorar, Ações, Localização e Quiz;
- fala japonesa via Web Speech API;
- trava manual do objeto.

Lacunas encontradas:
- robustez de rede ainda dependia do carregamento da IA;
- faltava deixar explícito o comportamento degradado.

Correções:
- versões das bibliotecas fixadas;
- falha de IA não bloqueia o app: modo manual permanece operacional;
- documentação deixa claro que o modelo precisa de rede na primeira execução.

### Etapa 3 — Linguística e didática: 9,8/10 → corrigida

Problema crítico encontrado:
- aplicar これ／それ／あれ mecanicamente à classe `person` ensinaria um padrão inadequado para pessoas.

Correções:
- pessoas usam この人／その人／あの人 no modo de identificação;
- localização usa います para seres animados e あります para objetos;
- quiz de pessoa usa 何が見えますか？;
- quiz comum revela uma resposta, não repete a pergunta;
- これ／それ／あれ continua sendo uma escolha consciente do aluno, porque a câmera não conhece a posição do interlocutor.

### Etapa 4 — Integração e PWA: 9,9/10 → corrigida

Correções finais:
- manifesto PWA válido;
- ícones 192 e 512 px;
- Service Worker limitado a arquivos locais, sem devolver HTML no lugar de JS/imagens em falhas;
- paths relativos compatíveis com GitHub Pages em subdiretório;
- tratamento de permissão de câmera, câmera ausente e IA indisponível.

### Etapa 5 — QA estático: 10/10 no escopo da V0

Verificações executadas:
- `app.js`, `japanese-data.js` e `sw.js`: sintaxe JavaScript válida;
- `manifest.webmanifest`: JSON válido;
- 80 classes esperadas: 80 presentes, 0 ausentes, 0 extras;
- todas as 80 classes possuem `jp`, `kana`, `romaji` e `pt`;
- geração de identificação, localização e ação verificada para 80/80 classes;
- 37 referências `getElementById` verificadas contra o HTML: 0 IDs ausentes;
- quatro modos de estudo presentes;
- bibliotecas externas fixadas em versão.

## Resultado

**10/10 para o escopo de código da V0.**

Próxima validação recomendada: publicar no GitHub Pages e testar fisicamente em Android, principalmente câmera traseira, desempenho da inferência, voz `ja-JP` instalada e comportamento após bloquear/desbloquear a tela.
