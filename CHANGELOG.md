# Changelog

## V0.2

- Adicionada **Visão ampla** com Transformers.js + MobileCLIP quantizado.
- Reconhecimento passa a ter três camadas: COCO-SSD → MobileNet → MobileCLIP quando necessário.
- Visão ampla pode analisar diretamente a mira quando COCO-SSD não detecta nenhum objeto.
- Botão **Analisar mira** para forçar análise da região central.
- Download do modelo amplo passou a ser **lazy/on-demand**, evitando ~57 MB no simples ato de abrir a câmera.
- Backoff de 60 s após falha de carregamento, com repetição manual disponível.
- Casos físicos V0.1 viraram famílias explícitas de confusão: `skateboard`, `person`, `suitcase`, `oven` e outras.
- Detector de alta confiança deixa de ser aceito sozinho como certeza em famílias de confusão quando verificadores não confirmam.
- `person` usa recorte da mira nas checagens para distinguir melhor mão e calçado do corpo inteiro.
- MobileNet ganhou regras para ventilador e calçados.
- Adicionados ao vocabulário visual: 扇風機, 手, 靴 e integração ampliada de カッターナイフ/段ボール箱.
- Resultado da Visão ampla deixa de permanecer indefinidamente quando novas leituras ficam inconclusivas.
- Novo modo **🧭 Cena** com 上・下・中・左・右.
- Inferência de relações recebeu filtros semânticos para recipiente/superfície e limiares conservadores.
- Service Worker atualizado para cache V0.2 e continua network-first para facilitar atualizações pelo GitHub Pages.

## V0.1

- HUD de câmera compacta.
- Consenso temporal em várias detecções.
- Segunda checagem MobileNet.
- Incerteza explícita.
- Correção manual e memória visual local.
- Imersão progressiva.
- Controles de memória/progresso.
