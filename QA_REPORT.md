# Mira Nihongo V1.0 Pre-Alpha 3 — Final QA Summary

## Escopo

Relatório-resumo da build atual. Os arquivos `QA_RC5.md`, `QA_RC6.md`, `QA_RC7.md`, `QA_PREALPHA2.md` e `QA_PREALPHA2_1.md` permanecem no pacote como histórico de regressões; este arquivo representa o estado mais recente.

## Estado recuperado após interrupção

A conversa do ChatGPT entrou em estado de infinite thinking durante a geração. A auditoria posterior confirmou que o **workspace final de código estava íntegro**, mas o primeiro ZIP gerado estava incompleto: faltavam `js/japanese-reading-worker-v1.js` e `tests/ocr-engine-v1.test.js`.

O arquivo incompleto não deve ser usado. O pacote final foi reconstruído a partir do workspace auditado e recebe um manifesto SHA-256 verificável.

## Validação automatizada final do workspace

- **25/25 arquivos de teste JavaScript:** PASS.
- **Static QA:** 242/242 PASS.
- **Vocabulário-base:** 383 entradas preservadas.
- **Syntax check:** 26 arquivos JavaScript/Service Worker PASS.
- **Manifest integrity test:** PASS.
- Regressões históricas RC4–Pre-Alpha 2.1 continuam verdes.
- Regressões novas: `guitar != toilet` e `flip_flop != surfboard` codificadas.
- Auto Freeze: ausência de preferência => ON; OFF explícito => persistente.
- Service Worker referencia somente arquivos locais existentes.
- Nenhum caminho de upload da imagem da câmera para backend próprio foi introduzido.

## Pre-Alpha 3 validada por código

- Semantic AI lazy/on-demand via Transformers.js + CLIP zero-shot.
- Worker dedicado para IA visual.
- OCR multilíngue `jpn + eng + por`.
- Tradução PT/EN -> japonês, com Browser Translator quando disponível e fallback Transformers.js local.
- Leitura/kana/rōmaji com banco local e fallback Kuromoji em worker.
- Tradução visual ancorada por bounding boxes reconstruídas do OCR.
- Todo trabalho pesado novo passa pelo Budget Router consolidado.
- World Model 2.0, especialistas de mão/rosto/pose, tracking e aprendizagem adaptativa preservados.

## Dependências públicas verificadas na revisão

A arquitetura foi conferida contra a documentação/model cards atuais de Transformers.js e Hugging Face para:

- `zero-shot-image-classification` com `Xenova/clip-vit-base-patch32`;
- pipeline `translation` com `Xenova/opus-mt-ROMANCE-en`;
- pipeline `translation` com `Xenova/opus-mt-en-jap`.

A API `Translator`/`LanguageDetector` do navegador é tratada como oportunista/experimental; quando indisponível ou falha, a rota Transformers.js permanece como fallback.

## Fora do escopo automatizável

Ainda exige Xiaomi 14T / GitHub Pages real:

- primeiro download dos modelos;
- WebGPU real e fallback WASM;
- latência e consumo de RAM;
- temperatura/aquecimento;
- qualidade real de CLIP em violão/chinelo e objetos novos;
- qualidade de tradução PT -> JA;
- posicionamento do overlay Lens na câmera real;
- cache/offline de assets externos após primeiro uso;
- FPS e retorno à câmera após Semantic AI/OCR/tradução.

## Nota

**10/10 no escopo automatizável.** O ZIP final reconstruído foi extraído em uma pasta limpa; lista de arquivos e SHA-256 coincidiram integralmente com a fonte, e toda a bateria foi executada novamente com sucesso. A validação física permanece explicitamente pendente.
