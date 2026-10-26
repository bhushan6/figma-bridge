# crop.py <img> <x0> <y0> <x1> <y1> <out> [--k K] [--grid STEP]
# Coordinates are in CSS px = raw px / K (K defaults to 2). Draws a light grid
# every STEP css px with labels so positions can be read off the crop.
import sys
from PIL import Image, ImageDraw
args = sys.argv[1:]
k = 2.0; step = 0; ox = 0.0; oy = 0.0
if "--k" in args: i = args.index("--k"); k = float(args[i+1]); del args[i:i+2]
if "--ox" in args: i = args.index("--ox"); ox = float(args[i+1]); del args[i:i+2]
if "--oy" in args: i = args.index("--oy"); oy = float(args[i+1]); del args[i:i+2]
if "--grid" in args: i = args.index("--grid"); step = int(args[i+1]); del args[i:i+2]
src, x0, y0, x1, y1, out = args[0], *map(float, args[1:5]), args[5]
im = Image.open(src).convert("RGB")
box = (int(round((x0 + ox) * k)), int(round((y0 + oy) * k)), int(round((x1 + ox) * k)), int(round((y1 + oy) * k)))
c = im.crop(box)
scale = max(1, int(1400 / max(c.size)))
c = c.resize((c.size[0] * scale, c.size[1] * scale), Image.NEAREST if scale > 2 else Image.LANCZOS)
if step:
    d = ImageDraw.Draw(c)
    px = k * scale
    gx = (int(x0) // step + 1) * step
    while gx < x1:
        X = (gx - x0) * px; d.line([(X, 0), (X, c.size[1])], fill=(255, 0, 255), width=1); d.text((X + 2, 2), str(gx), fill=(255, 0, 255)); gx += step
    gy = (int(y0) // step + 1) * step
    while gy < y1:
        Y = (gy - y0) * px; d.line([(0, Y), (c.size[0], Y)], fill=(0, 160, 255), width=1); d.text((2, Y + 2), str(gy), fill=(0, 160, 255)); gy += step
c.save(out)
print(out, c.size)
