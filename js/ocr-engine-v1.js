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
  function flattenLines(data){
    if(Array.isArray(data?.lines))return data.lines;
    const out=[];for(const block of data?.blocks||[])for(const par of block.paragraphs||[])for(const line of par.lines||[])out.push(line);return out;
  }
  function mapBox(b,inv){return b?{x0:Number(b.x0||0)*inv,y0:Number(b.y0||0)*inv,x1:Number(b.x1||0)*inv,y1:Number(b.y1||0)*inv}:null}
  function groupWordsToLines(words){
    const input=(words||[]).filter(w=>w?.bbox&&String(w.text||'').trim()).slice().sort((a,b)=>((a.bbox.y0+a.bbox.y1)/2)-((b.bbox.y0+b.bbox.y1)/2)||a.bbox.x0-b.bbox.x0),groups=[];
    for(const w of input){const cy=(w.bbox.y0+w.bbox.y1)/2,h=Math.max(1,w.bbox.y1-w.bbox.y0);let g=groups.find(x=>Math.abs(cy-x.cy)<=Math.max(8,(x.h+h)*.45));if(!g){g={items:[],cy,h};groups.push(g)}g.items.push(w);const n=g.items.length;g.cy=((g.cy*(n-1))+cy)/n;g.h=Math.max(g.h,h)}
    return groups.map(g=>{const items=g.items.sort((a,b)=>a.bbox.x0-b.bbox.x0),x0=Math.min(...items.map(x=>x.bbox.x0)),y0=Math.min(...items.map(x=>x.bbox.y0)),x1=Math.max(...items.map(x=>x.bbox.x1)),y1=Math.max(...items.map(x=>x.bbox.y1)),confidence=items.reduce((a,x)=>a+(Number(x.confidence)||0),0)/Math.max(1,items.length);return{text:items.map(x=>x.text).join(' ').replace(/\s+([,.;:!?])/g,'$1').trim(),confidence,bbox:{x0,y0,x1,y1}}}).filter(x=>x.text)
  }
  function scaledSource(image,scale=1){
    scale=Number(scale)||1;if(scale>=.99||typeof document==='undefined')return image;
    const w=image.width||image.videoWidth||1,h=image.height||image.videoHeight||1,c=document.createElement('canvas');c.width=Math.max(1,Math.round(w*scale));c.height=Math.max(1,Math.round(h*scale));c.getContext('2d').drawImage(image,0,0,c.width,c.height);return c;
  }
  async function recognize(image,{scale=1,languages=['jpn','eng','por'],signal}={}){
    if(signal?.aborted)throw new DOMException('Aborted','AbortError');const w=await ensure(languages);if(signal?.aborted)throw new DOMException('Aborted','AbortError');status='recognizing';
    try{const source=scaledSource(image,scale),r=await w.recognize(source),data=r?.data||{};if(signal?.aborted)throw new DOMException('Aborted','AbortError');const inv=source===image?1:1/scale;const words=flattenWords(data).filter(x=>(x.text||'').trim()&&(Number(x.confidence)||0)>=35).map(x=>{const b=x.bbox||x.boundingBox;return{text:x.text.trim(),confidence:Number(x.confidence)||0,bbox:mapBox(b,inv)}});let lines=flattenLines(data).filter(x=>(x.text||'').trim()&&(Number(x.confidence)||0)>=30).map(x=>{const b=x.bbox||x.boundingBox;return{text:String(x.text||'').trim(),confidence:Number(x.confidence)||0,bbox:mapBox(b,inv)}}).filter(x=>x.text&&x.bbox);if(!lines.length)lines=groupWordsToLines(words);status='ready';return{text:(data.text||'').trim(),confidence:Number(data.confidence)||0,words,lines}}
    catch(e){status=e?.name==='AbortError'?'ready':'error';lastError=e;throw e}
  }
  async function dispose(){status='idle';workerLanguages=null;if(worker){try{await worker.terminate()}finally{worker=null}}}
  function snapshot(){return{status,loaded:!!worker,languages:workerLanguages,error:lastError?String(lastError.message||lastError):null}}
  root.MiraOCRV1={recognize,dispose,snapshot,groupWordsToLines};if(typeof module!=='undefined')module.exports=root.MiraOCRV1;
})(typeof window!=='undefined'?window:globalThis);
