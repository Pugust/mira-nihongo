'use strict';
const KUROMOJI_JS='https://cdn.jsdelivr.net/npm/kuromoji@0.1.2/build/kuromoji.js';
const KUROMOJI_DICT='https://cdn.jsdelivr.net/npm/kuromoji@0.1.2/dict/';
let tokenizer=null,loading=null;
function status(s,extra={}){self.postMessage({type:'status',status:s,...extra})}
function ensureKuromoji(){
  if(tokenizer)return Promise.resolve(tokenizer);
  if(loading)return loading;
  loading=new Promise((resolve,reject)=>{
    try{
      status('loading-script');
      if(!self.kuromoji)importScripts(KUROMOJI_JS);
      if(!self.kuromoji?.builder)throw new Error('Kuromoji não ficou disponível');
      status('loading-dictionary');
      self.kuromoji.builder({dicPath:KUROMOJI_DICT}).build((err,t)=>{
        if(err){loading=null;reject(err);return}
        tokenizer=t;loading=null;status('ready');resolve(t);
      });
    }catch(err){loading=null;reject(err)}
  });
  return loading;
}
function compactToken(t){return{surface:String(t?.surface_form||''),reading:String(t?.reading||''),wordType:String(t?.word_type||'')}}
self.onmessage=async e=>{
  const m=e.data||{};
  if(m.type==='dispose'){tokenizer=null;loading=null;close();return}
  if(m.type!=='analyze')return;
  try{
    const tk=await ensureKuromoji();
    const texts=(m.texts||[]).map(x=>String(x||''));
    const results=[];
    for(let i=0;i<texts.length;i++){
      const text=texts[i];
      const tokens=tk.tokenize(text).map(compactToken);
      results.push({text,tokens});
      status('analyzing',{progress:texts.length?(i+1)/texts.length:1});
    }
    self.postMessage({type:'result',id:m.id,results});
  }catch(err){self.postMessage({type:'error',id:m.id,error:String(err?.message||err)});status('error')}
};
