# Mira Nihongo — V0.1

Aplicação web mobile para estudar japonês apontando a câmera para objetos reais. A V0.1 transforma a prova de conceito da V0 em uma experiência de câmera mais limpa, cautelosa com erros e corrigível pelo usuário.

## O que mudou na V0.1

- interface de câmera compacta: a lição fica em um painel recolhido e os modos de estudo ficam em uma folha inferior;
- caixas de detecção ficam ocultas por padrão; apenas o alvo da mira é destacado;
- estabilidade temporal: uma única detecção não vira imediatamente uma “verdade”;
- segunda checagem visual com MobileNet sobre o recorte do objeto selecionado;
- estados humanos de confiança: `Checando visão`, `Talvez seja`, `Reconhecimento estável`, `Confirmado por você` e `Lembrança local`;
- correção manual com vocabulário ampliado, incluindo estilete, caixa, papelão, chave, porta, prateleira, ferramentas etc.;
- memória visual local por hash perceptual: uma correção pode ser reaplicada quando uma imagem parecida voltar a aparecer com a mesma classe bruta;
- controles para apagar correções visuais e redefinir o progresso de imersão;
- imersão progressiva: interações intencionais retiram português primeiro e rōmaji depois;
- o português fica nos detalhes do cartão, em vez de ocupar a câmera;
- perda da mira por várias leituras limpa a lição antiga para evitar ensinar o objeto anterior fora de contexto;
- diagnóstico percentual é opcional e desligado por padrão.

## Como o reconhecimento funciona

1. **COCO-SSD** procura objetos e entrega caixas e classes gerais.
2. A mira central escolhe o objeto relevante.
3. O app exige consenso em várias leituras recentes antes de estabilizar a seleção.
4. O recorte do alvo é analisado por **MobileNet/ImageNet** como segunda opinião.
5. Quando as evidências não são suficientes ou os modelos discordam, o app mostra **Talvez seja** em vez de apresentar a palavra como certeza.
6. O usuário pode confirmar ou corrigir. Correções podem ser lembradas localmente por semelhança visual.

A segunda camada não transforma o sistema em reconhecimento de vocabulário aberto. MobileNet também possui um conjunto fechado de categorias; ele é usado como verificador complementar, não como fonte infalível.

## Japonês e aprendizagem

A aplicação mantém a distinção de これ・それ・あれ sob controle do aluno, já que a câmera não conhece com segurança a posição do interlocutor. Pessoas recebem tratamento próprio (`この人／その人／あの人`) em vez de serem tratadas mecanicamente como objetos.

No modo progressivo:

- nível 1: japonês + kana + rōmaji + português;
- nível 2: japonês + kana + rōmaji;
- nível 3: japonês + kana.

O progresso aumenta por ações intencionais, como ouvir, confirmar e revelar respostas no quiz, não apenas porque a câmera passou repetidamente pelo mesmo objeto.

## Publicar/atualizar no GitHub Pages

Envie o conteúdo desta pasta para a **raiz** do repositório e mantenha o GitHub Pages configurado em `main` + `/ (root)`. Todos os caminhos são relativos e compatíveis com um endereço como:

`https://SEU_USUARIO.github.io/mira-nihongo/`

A câmera exige HTTPS (ou localhost).

## Internet, desempenho e privacidade

A análise dos quadros acontece no navegador. O app não contém código para enviar fotos da câmera a um servidor. As bibliotecas e pesos dos modelos são baixados de serviços externos na primeira utilização e podem precisar de internet novamente se o cache do navegador for limpo.

A segunda checagem é carregada de forma tardia para não bloquear a abertura da câmera. Em aparelhos mais lentos, ela pode demorar mais ou ficar indisponível; nesse caso o app mantém o detector principal e a correção manual.

## Bibliotecas externas fixadas

- `@tensorflow/tfjs` 4.22.0
- `@tensorflow-models/coco-ssd` 2.2.3
- `@tensorflow-models/mobilenet` 2.1.1

## Validação

Veja `QA_REPORT.md`. A nota 10/10 refere-se ao escopo de código e aos testes automatizados/estáticos possíveis neste pacote. **A validação física da V0.1 só se completa no seu Android**, principalmente para desempenho dos dois modelos, câmera e comportamento com objetos reais.
