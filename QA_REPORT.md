# QA — Mira Nihongo V0.9

## Regra de nota 10
10/10 significa **código + UX/comportamento simulável dentro do escopo da V0.9**. Não substitui validação física no Android.

## Reavaliação 1 — 9,7/10
Diagnóstico, backup, importação, limpeza local, offline e PWA estavam implementados. A auditoria encontrou um contador inconsistente no novo teste e oportunidade de tornar o diagnóstico de armazenamento mais útil.

**Correções:** contador corrigido; `navigator.storage.estimate()` usado quando disponível, com fallback seguro.

## Reavaliação 2 — 9,9/10
Todas as regressões V0.5–V0.8 permaneceram aprovadas. Faltavam documentação final e empacotamento reproduzível.

**Correções:** README, changelog, relatório QA, versão/cache e pacote final alinhados.

## Reavaliação final — 10/10 no escopo
- backup só exporta chaves `mn-*`;
- importação valida formato/schema e rejeita chaves externas;
- rollback protege o estado anterior se a gravação falhar;
- apagar dados não remove armazenamento alheio ao Mira;
- offline não bloqueia a interface;
- caches antigos removidos somente quando pertencem ao Mira;
- nenhum novo modelo pesado/loop de visão foi adicionado;
- 383 entradas de vocabulário preservadas;
- V0.6 Interaction, V0.7 Adaptive Learning e V0.8 World Context preservados.

## Suíte final
- Static QA: **135/135**
- Vision: **9/9**
- Interaction: **13/13**
- Adaptive Learning: **30/30**
- World Context: **8/8**
- Reliability: **14/14**
- Runtime integrado: **34/34**

**Total: 243/243 verificações/asserções/cenários aprovados.**

## Ainda exige aparelho real
Tempo real de abertura; câmera/permissões; temperatura e bateria em 5/15/30 min; atualização do Service Worker em instalação existente; comportamento offline após os recursos necessários terem sido previamente carregados; importação/exportação pelo seletor de arquivos Android; safe areas e gestos do navegador.
