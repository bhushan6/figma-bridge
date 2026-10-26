#!/bin/bash
# cmpnode.sh <recreatedId> <refPng> <out.png>  — side-by-side, recreated resized to the reference size.
SP="$(cd "$(dirname "$0")" && pwd)"
node /c/Users/BHUSHAN/Documents/code/personal/figma-bridge/src/cli.js export "$1" "$SP/out/_n.png" --scale 2 --max 4000 >/dev/null || exit 1
python - "$SP/out/_n.png" "$2" "$3" <<'PY'
import sys
from PIL import Image
a = Image.open(sys.argv[2]).convert("RGB"); b = Image.open(sys.argv[1]).convert("RGB").resize(a.size, Image.LANCZOS)
horiz = a.width <= a.height
im = Image.new("RGB", (a.width * 2 + 10, a.height) if horiz else (a.width, a.height * 2 + 10), (255, 0, 255))
im.paste(a, (0, 0)); im.paste(b, (a.width + 10, 0) if horiz else (0, a.height + 10))
m = max(im.size)
if m > 2400: im = im.resize((int(im.width * 2400 / m), int(im.height * 2400 / m)), Image.LANCZOS)
im.save(sys.argv[3]); print(sys.argv[3], im.size)
PY
