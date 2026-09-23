# V1.0 Pre-Alpha 1 RC2

- Corrige hit-testing de caixas sobrepostas: a menor entidade visual ganha o primeiro toque.
- Segundo toque na entidade selecionada faz drill-down dentro dela, com parentId preservado.
- Caixas visuais deixam de interceptar eventos; o Scene Graph decide o alvo geometricamente.
- Drill-down exige confiança absoluta + margem sobre o segundo candidato; Unknown é preferido em regiões ambíguas.
- Predições de cena de animais e classes de alta confusão passam por limiares conservadores.
- Novo cache PWA RC2.

# V1.0 Pre-Alpha 1 RC1
- Visual World Model e Scene Graph.
- Recognition Fusion V1 com evidência negativa e estabilidade temporal.
- Rejeição mais conservadora de falsos positivos.
- Cena congelada passa a conter múltiplas entidades selecionáveis.
- Modo Explorar cena e breadcrumb.
- Toque em região não marcada executa análise localizada (Visual Drill-Down).
- Ontologia inicial de ambientes, estruturas, superfícies, coletivos, materiais, partes e subpartes.
- Auto Freeze permanece ON por padrão quando não há preferência salva; OFF explícito continua preservado.
- Cache PWA versionado para Pre-Alpha 1 RC1.

## V1.0 Pre-Alpha 1 RC3 — Specialist Vision
- Adiciona segmentação semântica DeepLab/ADE20K sob demanda para superfícies/estruturas (piso, parede, porta, rua, céu etc.).
- Adiciona Hand Pose Detection com 21 landmarks e regiões selecionáveis para palma, punho, polegar, indicador, médio, anelar e mínimo.
- Specialist Router executa análise profunda somente após Scene Freeze / exploração, evitando custo contínuo na câmera ao vivo.
- A segmentação pode corrigir falsos positivos grosseiros do classificador quando uma superfície/estrutura contradiz a hipótese selecionada.
- Drill-down consulta primeiro especialistas e só cai no MobileNet genérico com limiares muito mais conservadores.
- Cache atualizado para `mira-nihongo-v1-prealpha1-rc3-r1`.
