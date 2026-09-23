'use strict';
(function(root){
  let handDetector=null, handLoading=null, segmenter=null, segmenterLoading=null, poseDetector=null, poseLoading=null, faceDetector=null, faceLoading=null;
  const LIBS={
    hands:'https://cdn.jsdelivr.net/npm/@tensorflow-models/hand-pose-detection@2.0.1/dist/hand-pose-detection.min.js',
    segment:'https://cdn.jsdelivr.net/npm/@tensorflow-models/deeplab@0.2.2/dist/deeplab.min.js',
    pose:'https://cdn.jsdelivr.net/npm/@tensorflow-models/pose-detection@2.1.3/dist/pose-detection.min.js',
    face:'https://cdn.jsdelivr.net/npm/@tensorflow-models/face-landmarks-detection@1.0.6/dist/face-landmarks-detection.min.js'
  };
  const scriptLoads=new Map();
  function loadScript(url){if(typeof document==='undefined')return Promise.reject(new Error('DOM indisponível'));if(scriptLoads.has(url))return scriptLoads.get(url);const p=new Promise((resolve,reject)=>{const e=document.createElement('script');e.src=url;e.async=true;e.onload=resolve;e.onerror=()=>reject(new Error('Falha ao carregar '+url));document.head.appendChild(e)});scriptLoads.set(url,p);return p}
  const SEGMENT_MAP={
    floor:'floor',flooring:'floor',wall:'wall',door:'door',sky:'sky',road:'street',street:'street',
    earth:'ground',ground:'ground',grass:'ground',sidewalk:'sidewalk',building:'building',house:'building',
    tree:'tree',plant:'vegetation',person:'person',car:'car'
  };
  const FINGERS={
    thumb:{conceptId:'thumb',names:['thumb_cmc','thumb_mcp','thumb_ip','thumb_tip']},
    index:{conceptId:'index_finger',names:['index_finger_mcp','index_finger_pip','index_finger_dip','index_finger_tip']},
    middle:{conceptId:'middle_finger',names:['middle_finger_mcp','middle_finger_pip','middle_finger_dip','middle_finger_tip']},
    ring:{conceptId:'ring_finger',names:['ring_finger_mcp','ring_finger_pip','ring_finger_dip','ring_finger_tip']},
    pinky:{conceptId:'pinky_finger',names:['pinky_finger_mcp','pinky_finger_pip','pinky_finger_dip','pinky_finger_tip']}
  };
  function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
  function boxOf(points,w,h,pad=10){if(!points.length)return null;let xs=points.map(p=>p.x),ys=points.map(p=>p.y),x=Math.min(...xs)-pad,y=Math.min(...ys)-pad,r=Math.max(...xs)+pad,b=Math.max(...ys)+pad;x=clamp(x,0,w);y=clamp(y,0,h);r=clamp(r,0,w);b=clamp(b,0,h);return[x,y,Math.max(1,r-x),Math.max(1,b-y)]}
  async function ensureHands(){
    if(handDetector)return handDetector;if(handLoading)return handLoading;
    handLoading=(async()=>{if(!root.handPoseDetection)await loadScript(LIBS.hands);if(!root.handPoseDetection)throw new Error('Hand Pose Detection indisponível');const m=root.handPoseDetection.SupportedModels.MediaPipeHands;handDetector=await root.handPoseDetection.createDetector(m,{runtime:'tfjs',modelType:'full',maxHands:2});return handDetector})().catch(e=>{handLoading=null;throw e});return handLoading;
  }
  async function ensureSegmenter(){
    if(segmenter)return segmenter;if(segmenterLoading)return segmenterLoading;
    segmenterLoading=(async()=>{if(!root.deeplab)await loadScript(LIBS.segment);if(!root.deeplab)throw new Error('DeepLab indisponível');segmenter=await root.deeplab.load({base:'ade20k',quantizationBytes:1});return segmenter})().catch(e=>{segmenterLoading=null;throw e});return segmenterLoading;
  }
  function handEntities(hand,width,height){
    const pts=hand.keypoints||[], byName=new Map(pts.map(p=>[p.name,p]));if(pts.length<15)return[];
    const score=Number(hand.score)||.8, allBox=boxOf(pts,width,height,12), out=[];
    if(allBox)out.push({conceptId:'hand',semanticType:'part',bbox:allBox,confidence:score,source:'hand-landmarks'});
    const palmNames=['wrist','thumb_cmc','index_finger_mcp','middle_finger_mcp','ring_finger_mcp','pinky_finger_mcp'];
    const palm=boxOf(palmNames.map(n=>byName.get(n)).filter(Boolean),width,height,14);if(palm)out.push({conceptId:'palm',semanticType:'subpart',bbox:palm,confidence:score*.98,source:'hand-landmarks'});
    for(const f of Object.values(FINGERS)){const fp=f.names.map(n=>byName.get(n)).filter(Boolean),b=boxOf(fp,width,height,12);if(b)out.push({conceptId:f.conceptId,semanticType:'subpart',bbox:b,confidence:score*.97,source:'hand-landmarks'})}
    const wrist=byName.get('wrist'),idx=byName.get('index_finger_mcp'),pinky=byName.get('pinky_finger_mcp');if(wrist&&idx&&pinky){const scale=Math.hypot(idx.x-pinky.x,idx.y-pinky.y);out.push({conceptId:'wrist',semanticType:'subpart',bbox:[clamp(wrist.x-scale*.45,0,width),clamp(wrist.y-scale*.35,0,height),Math.min(scale*.9,width),Math.min(scale*.7,height)],confidence:score*.9,source:'hand-landmarks'})}
    return out;
  }
  async function analyzeHands(image){const d=await ensureHands(),hands=await d.estimateHands(image,{flipHorizontal:false});return(hands||[]).flatMap(h=>handEntities(h,image.width||image.videoWidth||1,image.height||image.videoHeight||1))}
  async function ensurePose(){if(poseDetector)return poseDetector;if(poseLoading)return poseLoading;poseLoading=(async()=>{if(!root.poseDetection)await loadScript(LIBS.pose);if(!root.poseDetection)throw new Error('Pose Detection indisponível');poseDetector=await root.poseDetection.createDetector(root.poseDetection.SupportedModels.MoveNet,{modelType:root.poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING});return poseDetector})().catch(e=>{poseLoading=null;throw e});return poseLoading}
  function poseEntities(pose,w,h){const pts=pose.keypoints||[],m=new Map(pts.filter(p=>(p.score||0)>.25).map(p=>[p.name,p])),out=[],score=Number(pose.score)||.75;const get=(...n)=>n.map(x=>m.get(x)).filter(Boolean);const push=(id,ps,pad=18)=>{const b=boxOf(ps,w,h,pad);if(b)out.push({conceptId:id,semanticType:'part',bbox:b,confidence:score,source:'body-pose'})};push('head',get('nose','left_eye','right_eye','left_ear','right_ear'),28);push('torso',get('left_shoulder','right_shoulder','left_hip','right_hip'),24);push('left_arm',get('left_shoulder','left_elbow','left_wrist'),22);push('right_arm',get('right_shoulder','right_elbow','right_wrist'),22);push('left_leg',get('left_hip','left_knee','left_ankle'),24);push('right_leg',get('right_hip','right_knee','right_ankle'),24);push('left_elbow',get('left_elbow'),18);push('right_elbow',get('right_elbow'),18);push('left_knee',get('left_knee'),20);push('right_knee',get('right_knee'),20);push('left_foot',get('left_ankle'),24);push('right_foot',get('right_ankle'),24);return out}
  async function analyzePose(image){const d=await ensurePose(),poses=await d.estimatePoses(image,{maxPoses:1,flipHorizontal:false});return(poses||[]).flatMap(p=>poseEntities(p,image.width||1,image.height||1))}
  async function ensureFace(){if(faceDetector)return faceDetector;if(faceLoading)return faceLoading;faceLoading=(async()=>{if(!root.faceLandmarksDetection)await loadScript(LIBS.face);if(!root.faceLandmarksDetection)throw new Error('Face Landmarks indisponível');faceDetector=await root.faceLandmarksDetection.createDetector(root.faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh,{runtime:'tfjs',refineLandmarks:true,maxFaces:2});return faceDetector})().catch(e=>{faceLoading=null;throw e});return faceLoading}
  function faceEntities(face,w,h){const p=face.keypoints||[],out=[],score=Number(face.score)||.85;const at=ids=>ids.map(i=>p[i]).filter(Boolean);const push=(id,ids,pad=6)=>{const b=boxOf(at(ids),w,h,pad);if(b)out.push({conceptId:id,semanticType:'subpart',bbox:b,confidence:score,source:'face-landmarks'})};const fb=boxOf(p,w,h,5);if(fb)out.push({conceptId:'face',semanticType:'part',bbox:fb,confidence:score,source:'face-landmarks'});push('right_eye',[33,133,159,145],8);push('left_eye',[362,263,386,374],8);push('right_eyebrow',[70,63,105,66,107],7);push('left_eyebrow',[336,296,334,293,300],7);push('nose',[1,2,98,327],8);push('mouth',[61,291,13,14],8);push('right_ear',[234],18);push('left_ear',[454],18);return out}
  async function analyzeFaces(image){const d=await ensureFace(),faces=await d.estimateFaces(image,{flipHorizontal:false});return(faces||[]).flatMap(f=>faceEntities(f,image.width||1,image.height||1))}
  function nearestLabel(rgb,legend){let best=null,dist=1e9;for(const[name,c]of Object.entries(legend||{})){const d=(rgb[0]-c[0])**2+(rgb[1]-c[1])**2+(rgb[2]-c[2])**2;if(d<dist){dist=d;best=name}}return dist<20?best:null}
  async function segment(image){const s=await ensureSegmenter();return s.segment(image)}
  function labelAt(result,x,y,sourceWidth,sourceHeight){if(!result?.segmentationMap)return null;const px=clamp(Math.floor(x/Math.max(1,sourceWidth)*result.width),0,result.width-1),py=clamp(Math.floor(y/Math.max(1,sourceHeight)*result.height),0,result.height-1);const i=(py*result.width+px)*4,rgb=[result.segmentationMap[i],result.segmentationMap[i+1],result.segmentationMap[i+2]];const raw=nearestLabel(rgb,result.legend);if(!raw)return null;const normalized=String(raw).toLowerCase().replace(/[^a-z ]/g,'').trim();return{raw,conceptId:SEGMENT_MAP[normalized]||SEGMENT_MAP[normalized.split(' ')[0]]||null}}
  function regionBox(result,labelName,sourceWidth,sourceHeight){const color=result.legend?.[labelName];if(!color)return null;let minX=result.width,minY=result.height,maxX=-1,maxY=-1,hits=0;const d=result.segmentationMap;for(let y=0;y<result.height;y+=2)for(let x=0;x<result.width;x+=2){const i=(y*result.width+x)*4;if(Math.abs(d[i]-color[0])<3&&Math.abs(d[i+1]-color[1])<3&&Math.abs(d[i+2]-color[2])<3){minX=Math.min(minX,x);minY=Math.min(minY,y);maxX=Math.max(maxX,x);maxY=Math.max(maxY,y);hits++}}if(hits<8)return null;return[minX/result.width*sourceWidth,minY/result.height*sourceHeight,(maxX-minX+1)/result.width*sourceWidth,(maxY-minY+1)/result.height*sourceHeight]}
  async function classifyRegion(image,x,y){const r=await segment(image),hit=labelAt(r,x,y,image.width||1,image.height||1);if(!hit?.conceptId)return null;return{...hit,bbox:regionBox(r,hit.raw,image.width||1,image.height||1),confidence:.88,source:'semantic-segmentation'}}
  root.MiraSpecialistVisionV1={ensureHands,ensurePose,ensureFace,ensureSegmenter,analyzeHands,analyzePose,analyzeFaces,segment,labelAt,regionBox,classifyRegion,handEntities,poseEntities,faceEntities,SEGMENT_MAP};
  if(typeof module!=='undefined')module.exports=root.MiraSpecialistVisionV1;
})(typeof window!=='undefined'?window:globalThis);
