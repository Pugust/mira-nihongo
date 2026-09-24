# Mira Nihongo V1.0 Pre-Alpha 3 — Semantic AI

Mira Nihongo é uma PWA mobile-first para aprender japonês explorando o mundo real pela câmera.

> **Visão do produto:** apontar para o mundo, tocar em qualquer parte dele e explorar como aquilo é expresso em japonês.

Esta build continua **Pre-Alpha**. A Pre-Alpha 2.1 consolidou performance e percepção especializada; a Pre-Alpha 3 adiciona uma camada de IA semântica real no navegador sem transformar a IA no controlador do aplicativo.

## Modos

- **◎ Mirar** — caminho rápido: detector, Stable Focus, verificação e tracking.
- **◇ Explorar** — Scene Freeze, World Model, partes, especialistas e análise direcionada por toque.
- **文 Ler** — OCR local + tradução para japonês + leitura/kana/rōmaji + overlay visual estilo Lens.

## Arquitetura

```text
Camera / Frozen Scene
        ↓
Perception Router
 ├─ Fast detector / verifier
 ├─ Hand / Face / Pose specialists
 ├─ Segmentation / Structure First
 ├─ OCR
 ├─ Semantic AI (CLIP zero-shot)
 ├─ Language AI (PT/EN → JA)
 └─ Japanese Reading (dictionary → Kuromoji fallback)
        ↓
Evidence Fusion / rejection / temporal consistency
        ↓
World Model 2.0
        ↓
Interactive Scene
        ↓
Japanese + Adaptive Learning
```

## Semantic AI

A IA semântica é **escalonamento**, não caminho padrão.

1. O pipeline tradicional propõe uma hipótese.
2. Se a hipótese for tentativo/conflitante, o usuário pode tocar em **✦ Conferir com IA**.
3. No primeiro uso, o navegador baixa o modelo CLIP compatível com Transformers.js.
4. O recorte da região congelada é avaliado por zero-shot image classification contra candidatos semânticos.
5. O resultado entra na Evidence Fusion; a IA não grava memória nem transforma automaticamente uma sugestão divergente em fato.
6. Depois do primeiro uso bem-sucedido, hipóteses tentativas podem ser verificadas automaticamente, mantendo o mesmo orçamento de inferência.

Casos de regressão adicionados explicitamente:
- violão/guitarra ≠ banheiro/vaso sanitário;
- chinelo/sandália de dedo ≠ prancha de surfe;
- preservação de mão ≠ pessoa, rosto ≠ mão, tênis ≠ notebook e texturas ≠ objetos arbitrários.

### Modelo inicial

- `Xenova/clip-vit-base-patch32`
- Transformers.js 3.8.1
- WebGPU tentado primeiro; fallback WASM.
- worker dedicado, lazy-load e descarte após ociosidade.

A Pre-Alpha 3 **não é um VLM universal**. O CLIP é usado como verificador/classificador zero-shot entre candidatos conhecidos pelo Mira. Uma VLM maior pode ser testada futuramente somente se medições reais no aparelho justificarem o custo.

## Ler — OCR + tradução + rōmaji

Fluxo:

```text
Imagem congelada
   ↓
Tesseract OCR (jpn + eng + por)
   ↓
linhas + caixas
   ↓
detecção de idioma
   ↓
PT/EN → japonês
   ↓
leitura japonesa
   ↓
kana + rōmaji
   ↓
overlay ancorado à região de texto + painel educacional
```

### Tradução

O Mira tenta primeiro a API de tradução integrada ao navegador quando disponível. Se não houver suporte, usa Transformers.js local:

- Português → Inglês: `Xenova/opus-mt-ROMANCE-en`
- Inglês → Japonês: `Xenova/opus-mt-en-jap`

Para texto já em japonês, não há tradução desnecessária.

### Leitura e rōmaji

A leitura usa três níveis:

1. entrada exata do banco japonês do Mira;
2. mapa local de expressões comuns;
3. para kanji ainda não resolvidos, **Kuromoji** é carregado em Web Worker sob demanda, extrai a leitura morfológica e o Mira converte para hiragana + rōmaji.

O objetivo é que um texto português reconhecido possa aparecer como:

```text
EMPURRE A PORTA
ドアを押してください
 doa o oshite kudasai
```

O OCR reconstrói linhas com bounding boxes e as traduções são desenhadas sobre a imagem congelada em overlays não interativos, mantendo também o painel de resultados.

## Performance

A regra central da 2.1 permanece:

- um trabalho pesado por vez;
- no máximo uma pendência no Budget Router;
- trabalho obsoleto é invalidado por epoch/session;
- Semantic AI, tradução e leitura japonesa são lazy/on-demand;
- câmera e UI não aguardam download de modelo no startup;
- CLIP é descarregado depois de ociosidade;
- modelos de tradução são liberados depois de cada etapa;
- Kuromoji só é carregado quando uma tradução contém kanji sem leitura local completa.

## Privacidade e custo

- Sem API paga obrigatória.
- A fotografia/crop é processada no navegador/worker; o Mira não envia a imagem para backend próprio.
- Rede é usada para baixar bibliotecas, modelos e dicionários na primeira utilização.
- Depois do download, a disponibilidade offline depende dos caches do navegador dos assets externos.
- Os arquivos centrais da PWA continuam no Service Worker local.

## Compatibilidade preservada

A base `japanese-data.js` permanece com **383 entradas**, preservando progresso/migrações. A ontologia visual instala conceitos adicionais em runtime, incluindo `guitar` e `flip_flop`, sem alterar a contagem congelada.

Continuam preservados:
- Auto Freeze ON por padrão e OFF explícito persistente;
- Stable Focus / Sticky Lock;
- memória de correções e histórico;
- lesson sheet / gestures;
- aprendizado adaptativo / review;
- World Model / Scene Graph;
- anatomia e dedos;
- câmera/zoom/torch quando suportados;
- backup, offline/degraded, acessibilidade e diagnostics.

## Regra de nota 10

Processo obrigatório:

**implementar → testar → reavaliar criticamente → corrigir → repetir → empacotar somente após 10/10 no escopo automatizável.**

O 10/10 **não inclui validação física**. Precisão real do CLIP, qualidade da tradução, downloads, WebGPU, FPS, memória, aquecimento, câmera e comportamento final no Xiaomi 14T só podem ser confirmados no aparelho.
