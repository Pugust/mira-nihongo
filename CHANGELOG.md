# Changelog — Mira Nihongo V0.3

## V0.3

- Removida a terceira camada MobileCLIP/Transformers.js da V0.2.
- Mantidos apenas COCO-SSD Lite + MobileNet V2 sob demanda.
- Adicionados perfis Econômico, Equilibrado e Precisão.
- Câmera padrão reduzida para 640×480 / 18 fps.
- Detector passa a reduzir seu ritmo quando a leitura já está estável.
- Intervalo adapta-se à latência observada no aparelho.
- Número máximo de caixas COCO reduzido para 10.
- Classificador detalhado deixou de ser pré-carregado na abertura da câmera.
- Backoff progressivo quando a visão detalhada não consegue reconhecer um alvo.
- `frisbee` entrou na lista de classes de alta confusão.
- Adicionado reconhecimento/correção específica para `bottlecap` → `キャップ`.
- Regressões físicas preservadas para estilete, caixa de papelão, sapato e ventilador.
- `person` amplo passa a poder sugerir `手` como hipótese, mas nunca como certeza automática.
- Banco ampliado de 108 para **202 entradas**.
- Busca do vocabulário passou a considerar aliases.
- Relações de cena preservadas e estendidas para novos recipientes/superfícies.
- Service Worker atualizado para cache `mira-nihongo-v0-3-r1`.
