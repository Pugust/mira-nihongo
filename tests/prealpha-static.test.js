const fs=require('fs'),assert=require('assert');const app=fs.readFileSync('js/app.js','utf8'),html=fs.readFileSync('index.html','utf8'),sw=fs.readFileSync('sw.js','utf8');
for(const token of ['analyzeFrozenScene','analyzeFrozenPoint','selectSceneEntity','MiraRecognitionFusionV1','animalFamily'])assert(app.includes(token),token);
for(const token of ['exploreSceneBtn','sceneBreadcrumb','world-model-v1.js','recognition-fusion-v1.js','visual-ontology-v1.js'])assert(html.includes(token),token);
for(const token of ['world-model-v1.js','recognition-fusion-v1.js','visual-ontology-v1.js','mira-nihongo-v1-prealpha1-rc5-r1'])assert(sw.includes(token),token);
assert(app.includes("localStorage.getItem('mn-v05-autofreeze')!=='0'"));console.log('prealpha-static ok');

for(const token of ['scenePredictionAllowed','entity.id!==state.scene?.selectedId','analyzeFrozenPoint(sx,sy,entity?.id','minMargin'])assert(app.includes(token),token);
const css=fs.readFileSync('css/app.css','utf8');assert(css.includes('.camera-stage.frozen .boxes-layer{pointer-events:none}'));console.log('rc3-overlap-and-unknown guards ok');
