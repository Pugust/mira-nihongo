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
for v in ['./index.html','./css/app.css','./js/vision-engine.js','./js/app.js','./js/japanese-data.js','./js/learning-engine.js','./js/adaptive-learning.js','./js/recognition-policy.js','./js/interaction-engine.js']:
    ok(v in sw,f'sw missing {v}')

# version markers and V0.7 adaptive-learning hooks
for needle in ['Mira Nihongo V0.7','freezeCanvas','freezeBanner','autoFreezeToggle','stickyStrength','candidateStrip','historyDialog','primaryFlowAction','moreActionsBtn','tutorialCoach','fontSize','hapticsToggle','reviewPrompt','learningObjective','learningBtn','learningDialog','adaptiveReviewToggle']:
    ok(needle in html,f'html missing {needle}')
for needle in ['setFrozen(true','resumeLive','rankVision','familyConsensus','renderCandidateStrip','renderCorrectionCandidates','registerHistory','estimateSkinRatio','estimateForegroundBox','setSheetSnap','bindSheetGestures','bindSentenceSwipe','startTutorial','toggleFrozenAnnotations','renderLearningDashboard','recordLearningExposure','revealReviewNow','mn-v07-learning']:
    ok(needle in app,f'app missing {needle}')

# V0.6 UX invariants preserved + V0.7 adaptive invariants
css=(root/'css/app.css').read_text()
ok('resumeBtn' not in html,'duplicate top Continue control must be removed')
ok('freezeBtn' not in html,'duplicate freeze/continue control must be removed')
for needle_css in ['.lesson-card.snap-compact','.lesson-card.snap-medium','.lesson-card.snap-full','.tutorial-coach','.intent-rail','prefers-reduced-motion','touch-action:none']:
    ok(needle_css in css,f'css missing UX hook {needle_css}')
ok('mn-v06-sheet' not in app,'sheet position must remain session-only')
ok(html.index('js/adaptive-learning.js') < html.index('js/app.js'),'adaptive learning must load before app')
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
ok(data['n']>=380,f'vocab too small: {data["n"]}')
for k in ['utility_knife','hand','shoe','bottle_cap','fan','blade','shoelace','fan_blade','can_opener','vacuum','toolbox']:
    ok(k in data['keys'],f'missing vocab key {k}')

if errors:
    print(f'FAILED {len(errors)}/{checks}')
    for e in errors: print('-',e)
    sys.exit(1)
print(f'static-qa: {checks}/{checks} passed; vocab={data["n"]}')
