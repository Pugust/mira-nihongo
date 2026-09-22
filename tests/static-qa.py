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
for v in ['./index.html','./css/app.css','./js/vision-engine.js','./js/app.js','./js/japanese-data.js','./js/learning-engine.js','./js/recognition-policy.js']:
    ok(v in sw,f'sw missing {v}')

# version markers and v0.5 feature hooks
for needle in ['Mira Nihongo <em>0.5</em>','freezeCanvas','freezeBanner','autoFreezeToggle','stickyStrength','candidateStrip','historyDialog']:
    ok(needle in html,f'html missing {needle}')
for needle in ['setFrozen(true','resumeLive','rankVision','familyConsensus','renderCandidateStrip','renderCorrectionCandidates','registerHistory','estimateSkinRatio','estimateForegroundBox']:
    ok(needle in app,f'app missing {needle}')

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
