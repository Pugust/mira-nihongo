from pathlib import Path
import re, json, subprocess, sys
from bs4 import BeautifulSoup
root=Path(__file__).resolve().parents[1]
errors=[]; checks=0

def ok(cond,msg):
    global checks
    checks+=1
    if not cond: errors.append(msg)

# syntax
for f in sorted((root/'js').glob('*.js'))+[root/'sw.js']:
    r=subprocess.run(['node','--check',str(f)],capture_output=True,text=True)
    ok(r.returncode==0,f'JS syntax: {f.name}: {r.stderr.strip()}')

html=(root/'index.html').read_text()
soup=BeautifulSoup(html,'html.parser')
ids=[x['id'] for x in soup.find_all(id=True)]
ok(len(ids)==len(set(ids)),'duplicate HTML ids')
app=(root/'js/app.js').read_text()
refs=set(re.findall(r"getElementById\('([^']+)'\)",app))
ok(not (refs-set(ids)),f'missing HTML ids: {sorted(refs-set(ids))}')

# local resources
for tag,attr in [('script','src'),('link','href')]:
    for node in soup.find_all(tag):
        v=node.get(attr)
        if not v or v.startswith(('http://','https://','#')): continue
        if v.startswith('manifest'): pass
        target=root/v
        ok(target.exists(),f'missing local resource {v}')

manifest=json.loads((root/'manifest.webmanifest').read_text())
ok(manifest['name']=='Mira Nihongo','manifest name')
ok(manifest['start_url']=='./','manifest start url')

# service worker cache includes core files
sw=(root/'sw.js').read_text()
for v in ['./index.html','./css/app.css','./js/vision-engine.js','./js/app.js','./js/japanese-data.js','./js/learning-engine.js','./js/adaptive-learning.js','./js/recognition-policy.js','./js/interaction-engine.js','./js/world-context.js','./js/freeze-engine.js','./js/recognition-fusion-v1.js','./js/perception-engine-v2.js','./js/ocr-engine-v1.js','./js/world-model-v2.js','./js/specialist-vision-v1.js','./js/multiscale-scene-v1.js','./js/visual-hierarchy-v1.js']:
    ok(v in sw,f'sw missing {v}')
cache_match=re.search(r"const LOCAL=\[(.*?)\];",sw,re.S)
cache_files=re.findall(r"'([^']+)'",cache_match.group(1)) if cache_match else []
ok(bool(cache_match),'service worker LOCAL list parse')
ok(len(cache_files)==len(set(cache_files)),'service worker LOCAL contains duplicates')
for v in cache_files:
    if v=='./': continue
    ok((root/v.removeprefix('./')).exists(),f'service worker references missing file {v}')

# version markers and V0.8 world-context hooks
for needle in ['Mira Nihongo V1.0 Pre-Alpha 2.1','visionRuntimeProfile','data-perception="aim"','data-perception="explore"','data-perception="read"','freezeCanvas','freezeBanner','autoFreezeToggle','stickyStrength','candidateStrip','historyDialog','primaryFlowAction','moreActionsBtn','tutorialCoach','fontSize','hapticsToggle','reviewPrompt','learningObjective','learningBtn','learningDialog','adaptiveReviewToggle','worldContextToggle','worldContextPanel','photoStudyBtn']:
    ok(needle in html,f'html missing {needle}')
for needle in ['setFrozen(true','resumeLive','rankVision','familyConsensus','renderCandidateStrip','renderCorrectionCandidates','registerHistory','estimateSkinRatio','estimateForegroundBox','setSheetSnap','bindSheetGestures','bindSentenceSwipe','startTutorial','toggleFrozenAnnotations','renderLearningDashboard','recordLearningExposure','revealReviewNow','mn-v07-learning','renderWorldContext','exploreFrozenPhoto','mn-v08-world']:
    ok(needle in app,f'app missing {needle}')

# V0.6 UX invariants preserved + V0.7 adaptive invariants
css=(root/'css/app.css').read_text()
ok('resumeBtn' not in html,'duplicate top Continue control must be removed')
ok('freezeBtn' not in html,'duplicate freeze/continue control must be removed')
for needle_css in ['.lesson-card.snap-compact','.lesson-card.snap-medium','.lesson-card.snap-full','.tutorial-coach','.intent-rail','prefers-reduced-motion','touch-action:none']:
    ok(needle_css in css,f'css missing UX hook {needle_css}')
ok('mn-v06-sheet' not in app,'sheet position must remain session-only')
ok(html.index('js/adaptive-learning.js') < html.index('js/app.js'),'adaptive learning must load before app')
ok(html.index('js/world-context.js') < html.index('js/app.js'),'world context must load before app')
world=(root/'js/world-context.js').read_text()
for needle in ['bestRelation','relationSentence','stateOptions','partsFor','confirmedStateSentence','compare']:
    ok(needle in world,f'world context missing {needle}')
ok(html.index('js/interaction-engine.js') < html.index('js/app.js'),'interaction engine must load before app')
adaptive=(root/'js/adaptive-learning.js').read_text()
for needle in ['normalizeStore','migrateLegacy','applyOutcome','chooseCandidate','shouldRecall','recordExposure','reinforceSkills','summary']:
    ok(needle in adaptive,f'adaptive engine missing {needle}')
ok('sem streaks' in html.lower(),'dashboard explicitly avoids streak pressure')

# privacy: no upload/fetch of image blob/form data in app
for bad in ['fetch(', 'XMLHttpRequest', 'FormData(', 'navigator.sendBeacon']:
    ok(bad not in app,f'unexpected network API in app.js: {bad}')

# DB count and required regressions
js="const {JAPANESE_DB}=require('%s');console.log(JSON.stringify({n:Object.keys(JAPANESE_DB).length,keys:Object.keys(JAPANESE_DB)}));" % str(root/'js/japanese-data.js').replace('\\','\\\\')
r=subprocess.run(['node','-e',js],capture_output=True,text=True,check=True)
data=json.loads(r.stdout)
ok(data['n']==383,f'base vocab count changed unexpectedly: {data["n"]}')
for k in ['utility_knife','hand','shoe','bottle_cap','fan','blade','shoelace','fan_blade','can_opener','vacuum','toolbox']:
    ok(k in data['keys'],f'missing vocab key {k}')

# Pre-Alpha 2.1 consolidation invariants
ok('mira-nihongo-v1-prealpha2-1-r1' in sw,'service worker cache version 2.1')
for needle in ["perceptionRouter.run('live-analysis'","perceptionRouter.run('scene-analysis'","perceptionRouter.run('point-analysis'","perceptionRouter.run('human-arbitration'","perceptionRouter.run('ocr'",'requestVideoFrameCallback','startPerformanceObservers','stopPerformanceObservers','mn-vision-profile']:
    ok(needle in app,f'2.1 app invariant missing {needle}')
world2=(root/'js/world-model-v2.js').read_text()
for needle in ['schemaVersion:2','trackingId','text:cleanText','PART_OF','HAS']:
    ok(needle in world2,f'world model v2 missing {needle}')
hierarchy=(root/'js/visual-hierarchy-v1.js').read_text()
ok("bottle:['bottle_cap','label']" in hierarchy,'bottle cap hierarchy must use canonical bottle_cap')
ok("finger:['fingernail']" in hierarchy,'fingernail hierarchy missing')
ok("finger:['nail']" not in hierarchy,'semantic collision nail/fingernail returned')

if errors:
    print(f'FAILED {len(errors)}/{checks}')
    for e in errors: print('-',e)
    sys.exit(1)
print(f'static-qa: {checks}/{checks} passed; vocab={data["n"]}')
