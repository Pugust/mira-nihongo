# Mira Nihongo V0.9.1 — Reliability Hotfix

Hotfix reconstruído diretamente sobre a V0.8 enviada pelo usuário.

A auditoria mostrou que os arquivos centrais de visão da V0.9 anterior eram idênticos à V0.8; portanto, a perda percebida de comportamento não veio de remoção deliberada do Auto Freeze no `app.js`. Para eliminar interferência de integração/cache, a V0.9.1 parte novamente da V0.8 e adiciona Reliability de forma isolada.

- `app.js`, Vision, World Context, Adaptive Learning, Interaction, Learning, Recognition Policy e Japanese Data permanecem byte-a-byte iguais à V0.8.
- Reliability carrega depois do app principal.
- Service Worker volta à estratégia funcional da V0.8, com cache novo V0.9.1 e apenas o novo módulo adicionado.
- Auto Freeze permanece com a mesma lógica e mesma chave de preferência da V0.8.
