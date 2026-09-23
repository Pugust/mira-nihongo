# Mira Nihongo V0.8 — Relatório de reavaliação

## Regra
10/10 vale para código e comportamento simulável no escopo V0.8. Precisão da câmera, temperatura, ergonomia e utilidade cotidiana continuam exigindo teste físico.

## Ciclo 1 — 9,5/10
Contexto passou a reutilizar detecções e quadro congelado. Relações, partes e exploração de foto foram introduzidas. Estados como ligado/desligado e cheio/vazio não podiam ser tratados como fatos: foram alterados para exigir confirmação explícita.

## Ciclo 2 — 9,8/10
Nenhum novo modelo contínuo foi adicionado. Foi detectado que `world-context.js` ainda não estava no cache PWA; corrigido com `mira-nihongo-v0-8-r1`.

## Ciclo 3 — 9,9/10
Regressões de relações, partes, estados e comparação passaram. O gerador foi corrigido para usar `います` com seres animados e `あります` com objetos.

## Ciclo 4 — 10/10
Relações usam limiar conservador; “nenhuma relação segura” é saída válida; estados não são inferidos automaticamente; exploração exige Freeze; V0.7 foi preservada; sintaxe e ZIP validados.

## Suíte final
- Estática: 119/119
- Visão: 9/9
- Interação: 13/13
- Adaptive Learning: 30/30
- World Context: 8/8
- Runtime DOM: 34/34

**Total: 213/213.**

## Nota final
**10/10 — código + comportamento simulável da V0.8.**
