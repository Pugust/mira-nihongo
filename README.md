# Mira Nihongo V0.9.2 — Freeze Hotfix
Reconstruído sobre a V0.8 enviada pelo usuário. Corrige a captura visual do Freeze.

## Causa
`captureFreezeFrame()` calculava `object-fit: cover` e passava offsets negativos como destino ao `drawImage`, junto com dimensões já escaladas. Em telas portrait, isso podia gerar um frame congelado incorreto/fora do canvas, fazendo o vídeo parecer continuar ou o congelamento não ser visualmente preservado.

## Correção
O novo `freeze-engine.js` calcula um recorte na imagem de origem (`sx/sy/sw/sh`) e desenha exatamente no canvas visível (`0,0,cw,ch`). Há testes para câmeras 4:3, 16:9, portrait e landscape.
