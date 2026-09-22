'use strict';
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.MiraInteraction=api;
})(typeof window!=='undefined'?window:globalThis,function(){
  const ORDER=['compact','medium','full'];
  const RATIOS={compact:.28,medium:.50,full:.82};
  function clamp(v,a,b){return Math.min(b,Math.max(a,v))}
  function indexOf(s){const i=ORDER.indexOf(s);return i<0?0:i}
  function nextSnap(current,direction){
    const i=indexOf(current);return ORDER[clamp(i+(direction>0?1:-1),0,ORDER.length-1)];
  }
  function snapHeight(name,viewport){return Math.round((RATIOS[name]||RATIOS.compact)*viewport)}
  function resolveSnap({current='compact',deltaY=0,velocityY=0,viewport=800}){
    const i=indexOf(current),distance=Math.abs(deltaY),fast=Math.abs(velocityY)>.55,threshold=Math.max(44,viewport*.075);
    if(distance<threshold&&!fast)return current;
    if(deltaY<0||velocityY<-.55)return ORDER[Math.min(ORDER.length-1,i+1)];
    if(deltaY>0||velocityY>.55)return ORDER[Math.max(0,i-1)];
    return current;
  }
  function classifySwipe({dx=0,dy=0,dt=300,min=48}){
    if(dt>900||Math.abs(dx)<min||Math.abs(dx)<Math.abs(dy)*1.35)return null;
    return dx<0?'next':'previous';
  }
  return{ORDER,RATIOS,nextSnap,snapHeight,resolveSnap,classifySwipe};
});
