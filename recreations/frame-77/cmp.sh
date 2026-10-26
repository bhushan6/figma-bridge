#!/bin/bash
# cmp.sh <nodeId> <ref.png> <x0> <y0> <x1> <y1> <out.png> [layout: v|h]
# Exports the node at 2x and stacks it with the reference crop (CSS coords, raw/2).
SP="$(cd "$(dirname "$0")" && pwd)"
node /c/Users/BHUSHAN/Documents/code/personal/figma-bridge/src/cli.js export "$1" "$SP/out/_node.png" --scale 2 --max 6000 >/dev/null || exit 1
python - "$SP/out/_node.png" "$2" "$3" "$4" "$5" "$6" "$7" "${8:-v}" <<'PY'
import sys
from PIL import Image
node, ref, x0, y0, x1, y1, out, lay = sys.argv[1], sys.argv[2], *map(float, sys.argv[3:7]), sys.argv[7], sys.argv[8]
a = Image.open(ref).convert("RGB").crop(tuple(int(v * 2) for v in (x0, y0, x1, y1)))
b = Image.open(node).convert("RGB")
if lay == "v":
    im = Image.new("RGB", (max(a.width, b.width), a.height + b.height + 12), (255, 0, 255)); im.paste(a, (0, 0)); im.paste(b, (0, a.height + 12))
else:
    im = Image.new("RGB", (a.width + b.width + 12, max(a.height, b.height)), (255, 0, 255)); im.paste(a, (0, 0)); im.paste(b, (a.width + 12, 0))
m = max(im.size)
if m > 2000: im = im.resize((int(im.width * 2000 / m), int(im.height * 2000 / m)), Image.LANCZOS)
im.save(out); print(out, im.size)
PY
