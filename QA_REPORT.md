# Mira Nihongo V1.0 Pre-Alpha 1 RC3 — QA

## Resultado automatizado
- Testes JS: todos aprovados.
- Static QA: 130/130.
- Vocabulário legado: 383 entradas preservadas; conceitos especializados são instalados pela ontologia visual em runtime.
- Sintaxe verificada para app.js, specialist-vision-v1.js e visual-ontology-v1.js.

## Regressões físicas que motivaram RC3
A RC2 foi reprovada em Android real: piso ainda podia virar mão/prato; porta podia virar mão; mão real podia ser absorvida por pessoa; não havia informação anatômica para selecionar dedos.

## Mudança estrutural
RC3 deixa de tentar resolver esses casos somente por threshold. Introduz semantic segmentation e hand landmarks como especialistas sob demanda. O fallback genérico foi endurecido para evitar que ImageNet seja obrigado a nomear regiões sem objeto.

## Escopo da nota
10/10 em código, arquitetura e comportamento automatizável/simulável dentro da RC3. A disponibilidade real dos modelos CDN, desempenho, segmentação e landmarks no Android/PWA exigem validação física. RC3 permanece Release Candidate até esse teste.

## Teste físico prioritário
1. Piso: deve resultar em piso/chão ou desconhecido; nunca mão/prato/ovelha.
2. Porta: porta/estrutura ou desconhecido; nunca mão.
3. Mão aberta: explorar cena deve produzir mão + palma + cinco dedos quando o especialista carregar.
4. Tocar indicador/polegar/médio/anelar/mínimo deve selecionar a entidade específica.
5. Tocar região ambígua sem evidência deve preferir “Ainda não reconheci esta região”.
