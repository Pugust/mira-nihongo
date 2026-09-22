# Mira Nihongo V0.5 — Stable Focus + Broad Recognition

## Estabilidade
- Auto Freeze após identificação.
- Frame congelado preserva a cena durante estudo/correção.
- Inferência e amostragem de foco pausadas enquanto congelado.
- Botão global **Continuar** para retomar a câmera.
- Sticky Lock com tolerância a pequenos movimentos quando Auto Freeze está desligado.
- Correção não destrava mais a câmera automaticamente.

## Reconhecimento
- Novo `vision-engine.js` com votação de detector + MobileNet + geometria + escala + família + contexto.
- Top candidatos em leituras incertas.
- Famílias semânticas para evitar saltos absurdos entre categorias.
- Saída `unknown` quando não há evidência suficiente.
- Regressões dedicadas para estilete↔switch/celular, mão↔pessoa, sapato↔pessoa e tampinha↔frisbee.
- Inferência parte–todo para tampinha de garrafa e infraestrutura para outras partes.
- Classes de alto risco exigem margem maior antes de virarem resultado estável.

## Aprendizagem
- Correção ocorre sobre imagem congelada.
- Sugestões rápidas no diálogo de correção.
- Histórico dos últimos 10 objetos.
- Vocabulário expandido de 290 para 383 entradas.
- Mantidos Cartão Vivo, breakdown, produção ativa, contexto de cena e progresso por palavra.

## PWA
- Cache atualizado para `mira-nihongo-v0-5-r1`.
- `vision-engine.js` incluído no precache local.
