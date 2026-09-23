# QA — Mira Nihongo V1.0 Pre-Alpha 1 RC1

## Resultado
**10/10 no escopo de código, arquitetura e comportamento simulável.** A validação física de câmera, enquadramento, precisão real e desempenho em Android permanece obrigatória antes da promoção para Pre-Alpha 1 final.

## Ciclo crítico aplicado
1. Implementação inicial do Visual World Model, Recognition Fusion e exploração congelada.
2. Reavaliação: detectado risco de o falso positivo `floor → sheep` ainda sobreviver com score alto e detector único.
3. Correção: animais passam a exigir verificação detalhada; divergência explícita de família rejeita a hipótese. Recognition Fusion ganhou evidência negativa e acordo temporal conservador.
4. Reavaliação: uma única amostra temporal não podia ser tratada como consenso total.
5. Correção: amostra única agora é neutra (0,5), e divergência entre múltiplas observações impede promoção indevida.
6. Reexecução integral da suíte.

## Cobertura automatizada
- Adaptive Learning: 30/30
- Freeze Engine: 11/11
- Interaction Engine: 13/13
- Runtime Stub: 34/34
- Vision Engine: 9/9
- World Context: 8/8
- Static QA legado/adaptado: 128/128
- Novos testes: Recognition Fusion, World Model, Visual Ontology e integração estática da Pre-Alpha: aprovados
- `node --check js/app.js`: aprovado

## O que está validado por código
- Scene Graph com entidades hierárquicas, hit-test e relações.
- Múltiplas entidades clicáveis na cena congelada.
- Modo Explorar cena.
- Drill-down por toque em região não marcada.
- Ontologia extensível: objeto, parte, subparte, superfície, estrutura, ambiente, coletivo, região espacial e material.
- Recognition Fusion com evidência negativa e acordo temporal.
- tratamento conservador de falsos positivos de animais.
- Auto Freeze ON quando não existe preferência salva e preservação de OFF explícito.
- cache PWA atualizado e módulos novos incluídos.

## Limites desta RC
A arquitetura suporta superfícies/regiões e ambientes, mas esta RC ainda não inclui um modelo dedicado de segmentação semântica. Portanto, chão/parede/céu não terão máscaras precisas em toda cena. Ambientes usam classificação conservadora inicial; partes pequenas dependem do drill-down localizado. Esses limites são intencionais para a Pre-Alpha 1 e não são apresentados como reconhecimento universal.

## RC2 — feedback físico Android

Falhas reproduzidas a partir das capturas do usuário:
- múltiplos palpites arbitrários acumulavam-se sobre uma superfície sem objeto (ovelha, borracha, caneta, interruptor);
- caixas DOM sobrepostas podiam interceptar o toque e selecionar a entidade maior (`person`) em vez da menor (`hand`);
- tocar novamente numa entidade já selecionada não entrava em drill-down.

Correções RC2:
- hit-test centralizado no Scene Graph e prioridade geométrica para a menor entidade;
- overlays visuais sem captura de ponteiro;
- segundo toque dentro da entidade selecionada inicia análise filha;
- drill-down rejeita classificação sem confiança e margem mínimas;
- animais e classes de alta confusão têm aceitação de cena mais conservadora;
- cache PWA atualizado para `mira-nihongo-v1-prealpha1-rc2-r1`.

Validação automatizada após correções: todas as suítes Node passaram e `static-qa.py` passou 128/128. Validação física da RC2 ainda necessária.
