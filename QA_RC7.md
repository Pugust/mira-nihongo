# Mira Nihongo V1.0 Pre-Alpha 1 RC7 — QA

## Objetivo
Revisão arquitetural de performance após validação física da RC6 no Xiaomi 14T.

## Mudanças
- startup sob demanda: nenhum download/modelo de ML no caminho crítico inicial;
- detector começa após intenção de abrir a câmera;
- congelar não dispara mais automaticamente detector + multi-scale + mãos + pose + face + segmentação + classificador de cena;
- `Explorar cena` passa a ser a intenção explícita para análise profunda;
- multi-scale limitado a até 3 regiões e somente quando a primeira etapa não encontrou evidência estável;
- retomada invalida trabalho antigo imediatamente;
- painel de câmera reposicionado no canto superior e restaurado a partir das capacidades da track a cada abertura;
- zoom/lanterna são mostrados conforme `getCapabilities()`;
- regressão adicionada para falso positivo tênis → notebook;
- cache RC7 independente.

## Escopo da nota 10
Nota 10 significa testes automatizados/estáticos e coerência arquitetural no escopo simulável. FPS, latência, disponibilidade real de zoom/lanterna e precisão no Xiaomi 14T exigem validação física.

## Reavaliação crítica
Primeira passagem falhou porque um teste legado ainda exigia o cache RC6. O teste foi atualizado para RC7 e toda a suíte foi repetida. Uma segunda revisão encontrou que a rejeição `shoe → laptop` cobria a análise focal, mas não a rota do detector; o guard foi adicionado também nessa rota e a suíte completa foi repetida.

## Resultado final automatizado
- 16 suítes JavaScript: aprovadas
- static-qa: 136/136
- vocabulário: 383 entradas
- syntax check de todos os JS: aprovado
- validação física: pendente no Xiaomi 14T
