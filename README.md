# Mira Nihongo V0.3

Mira Nihongo é uma PWA mobile para aprender japonês apontando a câmera para objetos reais.

## O que mudou na V0.3

A V0.2 mostrou dois gargalos em teste físico: falsos positivos em objetos pequenos/específicos e custo térmico alto. A V0.3 simplifica a arquitetura para **dois níveis de visão**, reduz a resolução/frequência de análise e amplia o vocabulário.

### Reconhecimento

1. **COCO-SSD Lite** localiza rapidamente objetos comuns.
2. **MobileNet V2 leve** só entra quando a leitura está ambígua, pertence a uma classe conhecida por confundir ou quando a mira não encontrou uma classe COCO.

A antiga terceira camada MobileCLIP foi removida. Isso elimina o download de aproximadamente 57 MB usado pela V0.2 e evita manter um terceiro modelo de visão no fluxo.

Casos físicos tratados explicitamente:

- tampinha confundida com `frisbee` → checagem para `キャップ`;
- estilete confundido com `skateboard` → checagem para `カッターナイフ`;
- caixa de papelão confundida com `suitcase`/`oven` → checagem para `段ボール箱`;
- sapato/perna confundido com `person` → checagem para `靴`;
- ventilador fora das classes COCO → análise direta da região da mira;
- mão confundida com `person` → nunca é promovida silenciosamente a certeza; em caixa corporal larga a V0.3 sugere `手` como leitura **tentativa**.

## Controle de desempenho

Em **Configurações → Desempenho** existem três perfis:

- **Econômico:** câmera alvo 480×360, 15 fps, detector em ritmo menor;
- **Equilibrado (padrão):** 640×480, 18 fps;
- **Precisão:** 960×540, 24 fps e análises mais frequentes.

Além disso, a V0.3:

- reduz automaticamente a frequência quando uma palavra já está estável;
- adapta o intervalo ao tempo real gasto pelo detector;
- limita COCO-SSD a 10 caixas por quadro;
- não pré-carrega o classificador detalhado ao abrir a câmera;
- aumenta progressivamente o intervalo da visão detalhada quando ela tenta objetos desconhecidos sem sucesso;
- pausa inferência quando a página está oculta.

Essas mudanças reduzem a carga esperada, mas **temperatura e bateria só podem ser validadas no aparelho real**.

## Vocabulário

O banco passou para **202 entradas**. Ele inclui as 80 classes COCO e dezenas de objetos cotidianos adicionais, como:

`tampinha`, `tampa`, `prato`, `caneca`, `panela`, `frigideira`, `chaleira`, `lixeira`, `balde`, `toalha`, `espelho`, `travesseiro`, `interruptor`, `tomada`, `lâmpada`, `ar-condicionado`, `mesa/escrivaninha`, `chave inglesa`, `furadeira`, `serrote`, `parafuso`, `porca`, `arruela`, `trena`, `grampeador`, `borracha`, `calculadora`, `impressora`, `headphone`, `power bank`, `pendrive`, `tripé`, `roteador`, `camisa`, `calça`, `meia`, `chapéu`, `relógio de pulso`, `carteira` e outros.

Nem toda palavra do banco é automaticamente reconhecível pela câmera. O vocabulário amplo também serve para **Corrigir**, **Aprender isto** e busca manual. A busca aceita aliases em português para alguns itens.

## Modos de estudo

- **Explorar:** nome e frase básica;
- **Ações:** verbos úteis;
- **Local:** ここ・そこ・あそこ;
- **Quiz:** tenta lembrar antes de revelar;
- **Cena:** relações conservadoras como 上・下・中・左・右.

A imersão progressiva continua removendo português/rōmaji conforme a palavra se torna familiar.

## Publicação no GitHub Pages

Os arquivos de produção ficam diretamente na raiz do pacote. Publique a branch `main` usando `/ (root)`.

O site precisa de HTTPS para acesso normal à câmera; GitHub Pages já fornece HTTPS.

## Privacidade

Quadros da câmera são analisados no navegador. O código não contém backend próprio para upload das fotos. Bibliotecas e pesos dos modelos TensorFlow.js são obtidos de CDNs externas e executados localmente no navegador.

## Limites atuais

Reconhecimento visual continua probabilístico. Objetos muito pequenos, parciais, transparentes, refletivos, muito próximos ou visualmente parecidos podem exigir `Corrigir`/`Aprender isto`. A memória visual local continua disponível para reaproveitar correções no mesmo aparelho.

Consulte `QA_REPORT.md` para a separação entre **10/10 do escopo de código** e validação física no Android.
