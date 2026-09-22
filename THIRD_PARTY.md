# Bibliotecas e modelos externos

A aplicação carrega bibliotecas com versões fixadas:

- TensorFlow.js `4.22.0` — via jsDelivr;
- COCO-SSD `2.2.3` — via jsDelivr;
- MobileNet `2.1.1` — via jsDelivr;
- `@huggingface/transformers` `3.8.1` — via jsDelivr, carregado apenas quando a Visão ampla é necessária.

A Visão ampla utiliza o modelo externo:

- `Xenova/mobileclip_s0` — MobileCLIP convertido para ONNX/Transformers.js e hospedado no Hugging Face Hub.

A configuração do Mira Nihongo solicita `dtype: q8`. Os dois pesos quantizados principais do modelo têm aproximadamente 42,8 MB (texto) e 11,8 MB (visão); o tokenizer acrescenta aproximadamente 2,2 MB, além de pequenos arquivos de configuração.

O modelo não é redistribuído dentro deste ZIP. Sua licença e arquivos permanecem no repositório do provedor:

https://huggingface.co/Xenova/mobileclip_s0

A inferência de câmera é executada no navegador. O código do Mira Nihongo não contém upload de quadros da câmera para um backend próprio. Bibliotecas, pesos e configurações necessários são baixados de serviços externos.
