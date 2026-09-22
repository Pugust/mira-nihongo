# Mira Nihongo — V0.2

Aplicação web mobile para estudar japonês apontando a câmera para objetos reais. A V0.2 é focada em **reduzir falsos reconhecimentos e reconhecer objetos que não existem entre as 80 classes do detector inicial**, sem abandonar o funcionamento direto no navegador.

## O que mudou na V0.2

Os testes físicos da V0.1 mostraram cinco casos importantes:

- estilete interpretado como `skateboard`;
- mão interpretada como `person`;
- sapato/perna interpretados como `person`;
- caixa de papelão interpretada como `suitcase`;
- ventilador sem detecção.

A V0.2 transforma esses casos em regressões explícitas da arquitetura.

### Reconhecimento em três camadas

1. **COCO-SSD** continua sendo o detector rápido. Ele encontra objetos e caixas entre 80 classes comuns.
2. **MobileNet** faz uma checagem rápida do recorte. Agora inclui mapeamentos adicionais para itens como ventilador, caixa de papelão, estilete e calçados quando a classe do ImageNet é suficientemente específica.
3. **Visão ampla — MobileCLIP** é usada nas classes que já demonstraram confusão ou quando o detector comum não encontra nada na mira. Ela compara o recorte com um vocabulário visual aberto e controlado pelo Mira Nihongo.

O fluxo continua conservador: uma leitura não vira automaticamente “verdade” quando os modelos discordam.

## Visão ampla

A Visão ampla usa `Xenova/mobileclip_s0` por Transformers.js e roda a inferência no próprio navegador.

- é ativada por padrão, mas **carregada sob demanda**;
- o download não começa só porque a câmera foi aberta;
- o primeiro uso baixa aproximadamente **57 MB de pesos quantizados + pequenos arquivos de configuração/tokenização**;
- quando o cache do navegador está disponível, o download não precisa ser repetido em cada uso;
- falhas de rede entram em espera de 60 segundos para evitar tentativas repetidas em loop;
- o botão **Analisar mira** permite forçar uma nova tentativa;
- se a Visão ampla falhar, detector rápido, correção manual e vocabulário continuam utilizáveis.

## Política contra falsos positivos

Classes que se confundiram nos testes reais, como `person`, `skateboard`, `suitcase` e `oven`, recebem tratamento especial.

Quando a checagem ampla não está disponível, uma dessas classes **não é declarada estável apenas porque o detector principal apresentou confiança alta**. O app prefere mostrar `Talvez seja` e pedir confirmação/correção.

Para `person`, a segunda checagem e a Visão ampla recebem um recorte central da mira. Assim, apontar especificamente para uma mão ou um sapato não obriga o sistema a aceitar a caixa grande de “pessoa” como intenção do usuário.

## Quando o detector não encontra nada

A V0.2 pode analisar diretamente uma região ao redor da mira. Isso permite tentar reconhecer itens como:

- 扇風機 — ventilador;
- 手 — mão;
- 靴 — sapato;
- カッターナイフ — estilete;
- 段ボール箱 — caixa de papelão;
- ferramentas, objetos de mesa, portas, janelas, cabos e outros itens do vocabulário aberto.

A análise automática é espaçada para não manter o processador ocupado continuamente. O usuário também pode tocar em **Analisar mira**.

Se uma leitura da Visão ampla deixa de se confirmar, a V0.2 remove a palavra antiga em vez de continuar ensinando um objeto que pode já ter saído da mira.

## Modo Cena

A V0.2 adiciona **🧭 Cena**. Quando há mais de um objeto detectável, o app tenta ensinar relações visuais como:

- 上 — em cima/acima;
- 下 — embaixo/abaixo;
- 中 — dentro;
- 左 — à esquerda;
- 右 — à direita.

Exemplo:

`ボトルはテーブルの上にあります。`

`Botoru wa tēburu no ue ni arimasu.`

“Uma garrafa está sobre/acima da mesa.”

As relações são deliberadamente conservadoras. `中` só é inferido quando o outro objeto é semanticamente compatível com um recipiente; apoio/contato usa classes compatíveis com superfícies; relações laterais exigem proximidade suficiente. Quando a geometria não é segura, o app volta à frase de localização simples em vez de inventar uma relação.

## Aprendizagem e japonês

Mantidos da V0.1:

- これ・それ・あれ escolhidos conscientemente pelo aluno;
- pessoas usam この人・その人・あの人;
- seres animados usam います e objetos usam あります;
- Explorar, Ações, Localização, Quiz e agora Cena;
- áudio japonês pelo sistema do aparelho;
- imersão progressiva;
- correção manual pesquisável;
- memória visual local por hash perceptual;
- controles para apagar correções e progresso.

## Publicar/atualizar no GitHub Pages

Copie os arquivos desta pasta para a raiz do mesmo repositório e faça commit/push na branch `main`. O GitHub Pages pode continuar configurado como:

- branch: `main`
- pasta: `/ (root)`

Todos os caminhos são relativos, compatíveis com:

`https://SEU_USUARIO.github.io/mira-nihongo/`

A câmera exige HTTPS ou localhost.

## Privacidade

O código do Mira Nihongo não envia quadros da câmera para um backend próprio. COCO-SSD, MobileNet e MobileCLIP executam inferência no navegador. Bibliotecas e pesos dos modelos são obtidos de serviços externos quando necessários.

Correções e progresso são armazenados localmente no navegador (`localStorage`).

## Limitações honestas

“Vocabulário aberto” não significa reconhecimento perfeito de qualquer coisa do mundo. MobileCLIP compara a imagem com os candidatos que o app oferece; iluminação, enquadramento, escala e objetos visualmente parecidos ainda podem causar erros.

Por isso a V0.2 mantém estados de incerteza, correção manual e memória local. A nota 10/10 do pacote refere-se ao **escopo de código e aos testes reproduzíveis disponíveis no ambiente de desenvolvimento**. A validação física da V0.2 só acontece depois de testá-la novamente no seu Android com a câmera e os modelos reais.

Veja `QA_REPORT.md` para os ciclos de reavaliação.
