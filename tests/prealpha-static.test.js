const fs=require('fs'),assert=require('assert');const app=fs.readFileSync('js/app.js','utf8'),html=fs.readFileSync('index.html','utf8'),sw=fs.readFileSync('sw.js','utf8');
for(const token of ['analyzeFrozenScene','analyzeFrozenPoint','selectSceneEntity','MiraRecognitionFusionV1','animalFamily'])assert(app.includes(token),token);
for(const token of ['exploreSceneBtn','sceneBreadcrumb','world-model-v1.js','recognition-fusion-v1.js','visual-ontology-v1.js'])assert(html.includes(token),token);
for(const token of ['world-model-v1.js','recognition-fusion-v1.js','visual-ontology-v1.js','mira-nihongo-v1-prealpha1-rc1-r1'])assert(sw.includes(token),token);
assert(app.includes("localStorage.getItem('mn-v05-autofreeze')!=='0'"));console.log('prealpha-static ok');
