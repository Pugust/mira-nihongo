# Mira Nihongo V1.0 Pre-Alpha 2.1 — Perception Consolidation

Mira Nihongo é uma PWA mobile-first para aprender japonês a partir do mundo real. A visão de produto continua sendo:

> Apontar para o mundo, tocar em qualquer parte dele e explorar como aquilo é expresso em japonês.

Esta build ainda é **Pre-Alpha**. Ela consolida a arquitetura criada na Pre-Alpha 2 antes de ampliar novamente o escopo visual.

## Modos de percepção

- **◎ Mirar** — reconhecimento rápido, com Stable Focus, detector e verificação somente quando necessária.
- **◇ Explorar** — congela a cena, cria um World Model e permite selecionar entidades/partes ou tocar em uma região para análise aprofundada.
- **文 Ler** — OCR local sob demanda sobre a imagem congelada. O OCR pode anexar texto às entidades do World Model e reutilizar o vocabulário japonês conhecido pelo Mira.

## Arquitetura 2.1

```text
Camera / frozen snapshot
        ↓
Frame Scheduler
        ↓
Perception Budget Router
 ├─ detector + verifier
 ├─ hand / face / pose specialists
 ├─ semantic segmentation
 ├─ structure-first multi-scale
 └─ OCR
        ↓
Evidence / rejection / temporal consistency
        ↓
World Model 2.0
        ↓
Interactive Scene
        ↓
Japanese + Adaptive Learning
```

### O que foi consolidado

- O scheduler legado da RC7 não é mais carregado; existe uma única autoridade de orçamento.
- Um único **Budget Router** serializa tarefas pesadas e mantém no máximo uma tarefa pendente. Cancelar uma cena invalida o resultado antigo, mas não libera falsamente o orçamento enquanto a inferência anterior ainda está fisicamente executando.
- Trabalho assíncrono usa epoch/session guards para não escrever em uma cena/interface que já mudou.
- **Specialist Arbitration** é espacial: uma mão próxima ao alvo pode corrigir `person`, e um rosto confirmado pode rejeitar um falso `hand`, sem deixar um rosto distante roubar o alvo focal.
- Exploração automática não dispara continuamente detector + mãos + rosto + pose + segmentação. Especialistas são escolhidos pelo conceito e pelo perfil; segmentação fica principalmente para toque/região apropriada.
- Multi-scale de grande região aceita apenas hipóteses estruturais, preservando `unknown` em texturas ambíguas.
- **World Model 2.0** adiciona evidence, trackingId, text e relações hierárquicas `PART_OF/HAS`.
- **OCR** continua lazy/on-demand; não participa do caminho crítico do startup.
- **Vision Runtime** possui Automático, Lite, Standard e Advanced. O Automático adapta orçamento usando capacidades do ambiente e tempos de inferência observados; o usuário pode sobrescrever manualmente.
- **Vision Diagnostics** observa FPS da câmera/UI, tempo do router, fila, tarefas descartadas, status dos especialistas/OCR e backend TF quando disponível.
- O loop visual usa `requestVideoFrameCallback()` quando suportado e mantém a taxa da IA separada do preview.

## Regressões tratadas como permanentes

- mão ≠ pessoa;
- rosto ≠ mão;
- tênis ≠ notebook;
- piso/parede/textura ≠ animal ou objeto arbitrário;
- estrutura grande (como armário) não deve depender de um palpite de textura;
- dedos continuam exploráveis;
- retorno à câmera invalida trabalho antigo;
- controles de câmera são reconsultados por track;
- startup não baixa modelos de visão antes da intenção de abrir a câmera;
- surprise review não pode ser substituído por callback atrasado;
- Auto Freeze é ON quando não existe preferência e preserva OFF explícito.

## Vocabulário e ontologia

O arquivo base `japanese-data.js` continua com **383 entradas**, preservando compatibilidade de progresso/migração. A ontologia visual pode instalar conceitos adicionais em runtime sem alterar a base congelada. Nesta versão foi corrigida a colisão semântica entre:

- `nail` = **釘** (prego), já existente no vocabulário;
- `fingernail` = **爪** (unha), conceito visual separado.

Também foi corrigida a hierarquia `bottle → bottle_cap` e ampliada a busca hierárquica de armário/guarda-roupa/mochila.

## Offline e privacidade

- O fluxo central continua sem API paga.
- Imagens da câmera não são enviadas pelo `app.js` para servidor próprio.
- Modelos externos/línguas de OCR podem ser baixados na primeira utilização e depois dependem do cache HTTP do navegador.
- O Service Worker mantém os arquivos locais da aplicação disponíveis offline após instalação adequada do cache.

## Validação

A regra do projeto é: **implementar → testar → reavaliar criticamente → corrigir → repetir até 10/10 no escopo automatizável → empacotar**.

O QA automatizado cobre código, invariantes arquiteturais, regressões simuláveis, sintaxe, vocabulário e integridade do pacote. Ele **não prova** FPS real, qualidade de OCR, precisão visual, disponibilidade de zoom/lanterna, aquecimento ou comportamento final no Xiaomi 14T. Esses pontos precisam de teste físico antes de promover a build.
