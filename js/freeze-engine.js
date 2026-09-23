'use strict';
((g)=>{
  function coverCrop(vw,vh,cw,ch){
    if(!(vw>0&&vh>0&&cw>0&&ch>0))return null;
    const scale=Math.max(cw/vw,ch/vh),sw=Math.min(vw,cw/scale),sh=Math.min(vh,ch/scale);
    return{sx:Math.max(0,(vw-sw)/2),sy:Math.max(0,(vh-sh)/2),sw,sh,dw:cw,dh:ch};
  }
  g.MiraFreeze={coverCrop};
})(typeof window!=='undefined'?window:globalThis);
