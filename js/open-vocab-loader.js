'use strict';

(() => {
  let classifier = null;
  let loadingPromise = null;
  let lastError = null;

  const api = {
    get ready() { return Boolean(classifier); },
    get loading() { return Boolean(loadingPromise && !classifier); },
    get error() { return lastError; },

    async load(onProgress) {
      if (classifier) return classifier;
      if (loadingPromise) return loadingPromise;

      loadingPromise = (async () => {
        try {
          const { pipeline, env } = await import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1');
          env.allowLocalModels = false;
          env.useBrowserCache = true;
          classifier = await pipeline(
            'zero-shot-image-classification',
            'Xenova/mobileclip_s0',
            {
              dtype: 'q8',
              progress_callback: data => {
                if (typeof onProgress === 'function') onProgress(data || {});
              }
            }
          );
          lastError = null;
          return classifier;
        } catch (error) {
          lastError = error;
          classifier = null;
          throw error;
        } finally {
          loadingPromise = null;
        }
      })();

      return loadingPromise;
    },

    async classify(image, labels, onProgress) {
      const pipe = await api.load(onProgress);
      return pipe(image, labels, { hypothesis_template: 'This is a photo of {}' });
    }
  };

  window.MiraOpenVocab = api;
})();
