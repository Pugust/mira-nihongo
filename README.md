# Mira Nihongo — V0

Aplicação web mobile para estudar japonês apontando a câmera para objetos reais.

## O que a V0 faz

- abre a câmera traseira/frontal do celular;
- roda COCO-SSD com TensorFlow.js no navegador;
- usa uma mira central para escolher o objeto que está sendo observado;
- estabiliza a detecção antes de trocar a lição;
- cobre as 80 categorias do COCO-SSD com japonês, kana, rōmaji e português;
- modos Explorar, Ações, Localização e Quiz;
- alterna これ / それ / あれ manualmente para não ensinar distância/interlocutor de forma errada;
- áudio japonês via Web Speech API quando há voz japonesa no dispositivo;
- três níveis de imersão: completo, sem português, sem português/rōmaji;
- caixas detectadas tocáveis e vocabulário manual caso a câmera não reconheça o objeto;
- PWA instalável; arquivos locais ficam em cache após a primeira visita.

## Publicar no GitHub Pages

1. Crie um repositório no GitHub.
2. Envie **todo o conteúdo desta pasta** para a raiz do repositório.
3. Abra `Settings` → `Pages`.
4. Em `Build and deployment`, escolha `Deploy from a branch`.
5. Escolha a branch `main` e a pasta `/ (root)`.
6. Salve e abra o endereço HTTPS fornecido pelo GitHub Pages.
7. No celular, toque em **Abrir câmera** e permita acesso à câmera.

> A câmera exige HTTPS (ou localhost). Por isso abrir `index.html` diretamente como arquivo não é a forma recomendada de testar no celular.

## Internet e privacidade

A inferência das imagens acontece no próprio navegador. O código do app não envia quadros da câmera para um servidor. Na primeira execução, as bibliotecas e o modelo TensorFlow.js precisam ser baixados da internet. O Service Worker armazena apenas os arquivos locais do app; disponibilidade totalmente offline do modelo não é garantida nesta V0.

## Bibliotecas externas fixadas

- `@tensorflow/tfjs` 4.22.0
- `@tensorflow-models/coco-ssd` 2.2.3

## Limite conhecido da V0

COCO-SSD reconhece 80 classes genéricas. Um objeto específico pode ser classificado em uma categoria ampla ou não ser detectado. Use **Vocabulário** como fallback. Uma versão futura pode trocar o detector por um modelo visual de vocabulário aberto.

## QA

Veja `QA_REPORT.md` para os ciclos de reanálise, correções e critérios usados até atingir 10/10 no escopo de código da V0.
