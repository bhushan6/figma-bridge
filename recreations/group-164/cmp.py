# cmp.py <nodeId> <ref.png> <out-prefix> [--split N] — export a recreation at 2x and stack it under the
# reference, cut into N horizontal slices (out/<prefix>0.png ...), plus a 50% blend for alignment checks.
import sys, subprocess
from PIL import Image
args = sys.argv[1:]
split = 1
if "--split" in args: i = args.index("--split"); split = int(args[i + 1]); del args[i:i + 2]
node, refp, pre = args
subprocess.run(["node", "../../src/cli.js", "export", node, f"out/{pre}-rec.png", "--scale", "2", "--max", "4000"], check=True, stdout=subprocess.DEVNULL)
ref = Image.open(refp).convert("RGB"); rec = Image.open(f"out/{pre}-rec.png").convert("RGB").resize(ref.size)
Image.blend(ref, rec, 0.5).save(f"out/{pre}-blend.png")
step = ref.height // split
for i in range(split):
    y0, y1 = i * step, min(ref.height, (i + 1) * step + 20)
    h = y1 - y0; im = Image.new("RGB", (ref.width, h * 2 + 12), (255, 0, 255))
    im.paste(ref.crop((0, y0, ref.width, y1)), (0, 0)); im.paste(rec.crop((0, y0, ref.width, y1)), (0, h + 12))
    s = min(1, 1600 / im.width); im.resize((int(im.width * s), int(im.height * s))).save(f"out/{pre}{i}.png")
