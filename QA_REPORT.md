# QA V0.9.1
A comparação dos ZIPs enviados mostrou que `js/app.js`, Vision, World Context, Adaptive Learning, Interaction, Learning, Recognition Policy e Japanese Data da V0.9 eram idênticos aos da V0.8. O Auto Freeze, inclusive, continuava no código.

Para eliminar regressão de integração/cache, a V0.9.1 foi reconstruída sobre a V0.8 e os oito módulos centrais foram preservados byte-a-byte.

Testes:
- Static QA 121/121
- Vision 9/9
- Interaction 13/13
- Adaptive Learning 30/30
- World Context 8/8
- Reliability 14/14
- Runtime 34/34

Total: 229/229.

Nota: 10/10 no escopo automatizável do hotfix. A confirmação de que o Auto Freeze voltou no aparelho é validação física obrigatória e ainda não foi feita.
