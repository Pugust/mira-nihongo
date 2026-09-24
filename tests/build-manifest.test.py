#!/usr/bin/env python3
from pathlib import Path
import hashlib, re, sys

root = Path(__file__).resolve().parents[1]
manifest = root / 'BUILD_MANIFEST_PREALPHA3.txt'
if not manifest.exists():
    raise SystemExit('BUILD_MANIFEST_PREALPHA3.txt missing')

line_re = re.compile(r'^(.*?)\t(\d+) bytes\tSHA256 ([0-9a-f]{64})$')
entries = {}
for line in manifest.read_text(encoding='utf-8').splitlines():
    m = line_re.match(line)
    if m:
        rel, size, digest = m.groups()
        entries[rel] = (int(size), digest)

actual = sorted(
    p.relative_to(root).as_posix()
    for p in root.rglob('*')
    if p.is_file() and p.name != 'BUILD_MANIFEST_PREALPHA3.txt'
)

missing = [p for p in actual if p not in entries]
extra = [p for p in entries if p not in actual]
errors = []
if missing:
    errors.append('manifest missing: ' + ', '.join(missing))
if extra:
    errors.append('manifest extra: ' + ', '.join(extra))
for rel in actual:
    if rel not in entries:
        continue
    p = root / rel
    size = p.stat().st_size
    digest = hashlib.sha256(p.read_bytes()).hexdigest()
    expected_size, expected_digest = entries[rel]
    if size != expected_size:
        errors.append(f'size mismatch: {rel}: {size} != {expected_size}')
    if digest != expected_digest:
        errors.append(f'hash mismatch: {rel}')

if errors:
    print('BUILD MANIFEST FAILED')
    for e in errors:
        print('-', e)
    raise SystemExit(1)
print(f'build-manifest: OK ({len(actual)} files verified, manifest self-excluded)')
