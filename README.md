# Mira Nihongo V0.4 — Focus & Immersion

Aplicação web mobile-first para aprender japonês apontando a câmera para aquilo com que você interage no dia a dia.

## Ideia central
A V0.4 muda o ciclo de visão para **mirou → estabilizou → analisou → rastreou**. Um observador leve mede mudança e nitidez na região da mira. A inferência pesada só entra quando precisa e para depois do reconhecimento. Isso foi projetado para reduzir processamento contínuo e tornar a resposta mais rápida ao trocar de objeto.

> Importante: no navegador não há uma API universal que entregue a distância física real do foco da lente. O Mira estima o “objeto em foco” por região da mira, estabilidade, nitidez e geometria visual. Quando o dispositivo expõe autofocus contínuo, o app tenta ativá-lo.

## Aprendizagem
- **Cotidiano:** nome + frase útil com revelação gradual.
- **Imersão:** reduz rōmaji/português para palavras já dominadas.
- **Breakdown:** separa blocos da frase e explica partículas/verbos.
- **Quero dizer algo:** transforma o objeto em produção ativa de japonês.
- **Progresso por palavra:** cada item tem seu próprio nível de domínio.
- **Cena:** tenta aproveitar relações reais entre objetos sem apresentar relações fracas como fatos.

## Publicação no GitHub Pages
O `index.html` já está na raiz. Substitua os arquivos do repositório existente, faça commit e push. O Service Worker usa estratégia network-first para os arquivos locais, facilitando atualizações frequentes pelo GitHub Pages.

## Dependências online
A aplicação baixa TensorFlow.js, COCO-SSD e MobileNet das CDNs declaradas no `index.html`. O app não inclui código para enviar quadros da câmera para um backend próprio.

## Limites honestos
- COCO-SSD e MobileNet não reconhecem qualquer objeto existente; o vocabulário manual/correção cobre objetos fora das classes dos modelos.
- A redução de aquecimento é uma meta arquitetural. Temperatura, bateria e velocidade reais só podem ser validadas no aparelho físico.
- Relações 3D são inferidas de geometria 2D e por isso são deliberadamente conservadoras.
