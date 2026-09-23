const fs=require('fs'),assert=require('assert');const app=fs.readFileSync('js/app.js','utf8'),html=fs.readFileSync('index.html','utf8'),sw=fs.readFileSync('sw.js','utf8');
for(const x of ['perception-engine-v2.js','ocr-engine-v1.js','data-perception="aim"','data-perception="explore"','data-perception="read"','readNowBtn','visionProfileText'])assert(html.includes(x),x);
for(const x of ['arbitrateFrozenHuman','chooseHuman','runOCR','perceptionRouter','temporalTracker','setPerceptionMode'])assert(app.includes(x),x);
for(const x of ['perception-engine-v2.js','ocr-engine-v1.js','world-model-v2.js','mira-nihongo-v1-prealpha2-1-r1'])assert(sw.includes(x),x);
assert(app.includes("localStorage.getItem('mn-v05-autofreeze')!=='0'"));
console.log('prealpha2 perception static ok');
