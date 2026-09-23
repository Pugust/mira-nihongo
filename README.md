# Mira Nihongo V0.9 — Reliability & Polish

Versão de estabilização pré-V1.0. A V0.9 preserva visão, Interaction & Flow, Adaptive Learning e World & Context, concentrando-se em confiabilidade.

## Novidades
- painel **Saúde do Mira** com câmera, modelos, motores, armazenamento, PWA e cache;
- diagnóstico avançado local;
- indicador offline discreto;
- backup JSON versionado do progresso e preferências `mn-*`;
- importação validada com rejeição de schemas futuros/arquivos estranhos e rollback em falha;
- limpeza explícita dos dados do Mira sem tocar em dados de outros apps do mesmo domínio;
- Service Worker V0.9 com limpeza seletiva de caches antigos do Mira e fallback de navegação offline;
- reforço de `prefers-reduced-motion`, telas estreitas e alvos de toque já existentes;
- captura local de erros/rejeições da sessão para diagnóstico, sem upload.

## Privacidade
Nenhuma imagem, diagnóstico ou backup é enviado pelo código do Mira. O backup é gerado localmente.

## Limite desta validação
A nota 10/10 desta entrega cobre código e comportamento automatizável. Temperatura, consumo de bateria, câmera real, gestos do Android e conforto continuam exigindo teste físico.
