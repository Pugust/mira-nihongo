'use strict';
(function(root){
  const SCRIPT='https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
  let loading=null,worker=null,workerLanguages=null,status='idle',lastError=null;
  function loadScript(){if(root.Tesseract)return Promise.resolve();if(loading)return loading;if(typeof document==='undefined')return Promise.reject(new Error('DOM indisponível'));loading=new Promise((res,rej)=>{const s=document.createElement('script');s.src=SCRIPT;s.async=true;s.crossOrigin='anonymous';s.onload=()=>res();s.onerror=()=>{loading=null;rej(new Error('OCR indisponível'))};document.head.appendChild(s)});return loading}
  function languageKey(langs){return [...new Set((langs||[]).filter(Boolean))].join('+')||'jpn+eng'}
  async function ensure(languages=['jpn','eng','por']){
    await loadScript();const key=languageKey(languages);if(worker&&workerLanguages===key)return worker;
    if(worker){try{await worker.terminate()}catch(_){ }worker=null}
    status='loading';lastError=null;
    try{worker=await root.Tesseract.createWorker(key,1,{langPath:'https://tessdata.projectnaptha.com/4.0.0'});workerLanguages=key;status='ready';return worker}catch(e){status='error';lastError=e;worker=null;throw e}
  }
  function flattenWords(data){
    if(Array.isArray(data?.words))return data.words;
    const out=[];for(const block of data?.blocks||[])for(const par of block.paragraphs||[])for(const line of par.lines||[])for(const word of line.words||[])out.push(word);return out;
  }
  function scaledSource(image,scale=1){
    scale=Number(scale)||1;if(scale>=.99||typeof document==='undefined')return image;
    const w=image.width||image.videoWidth||1,h=image.height||image.videoHeight||1,c=document.createElement('canvas');c.width=Math.max(1,Math.round(w*scale));c.height=Math.max(1,Math.round(h*scale));c.getContext('2d').drawImage(image,0,0,c.width,c.height);return c;
  }
  async function recognize(image,{scale=1,languages=['jpn','eng','por'],signal}={}){
    if(signal?.aborted)throw new DOMException('Aborted','AbortError');const w=await ensure(languages);if(signal?.aborted)throw new DOMException('Aborted','AbortError');status='recognizing';
    try{const source=scaledSource(image,scale),r=await w.recognize(source),data=r?.data||{};if(signal?.aborted)throw new DOMException('Aborted','AbortError');const inv=source===image?1:1/scale;const words=flattenWords(data).filter(x=>(x.text||'').trim()&&(Number(x.confidence)||0)>=35).map(x=>{const b=x.bbox||x.boundingBox;return{text:x.text.trim(),confidence:Number(x.confidence)||0,bbox:b?{x0:b.x0*inv,y0:b.y0*inv,x1:b.x1*inv,y1:b.y1*inv}:null}});status='ready';return{text:(data.text||'').trim(),confidence:Number(data.confidence)||0,words}}
    catch(e){status=e?.name==='AbortError'?'ready':'error';lastError=e;throw e}
  }
  async function dispose(){status='idle';workerLanguages=null;if(worker){try{await worker.terminate()}finally{worker=null}}}
  function snapshot(){return{status,loaded:!!worker,languages:workerLanguages,error:lastError?String(lastError.message||lastError):null}}
  root.MiraOCRV1={recognize,dispose,snapshot};if(typeof module!=='undefined')module.exports=root.MiraOCRV1;
})(typeof window!=='undefined'?window:globalThis);
