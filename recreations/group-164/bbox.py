# bbox.py <img> x0 y0 x1 y1 [--k K] [--t T] [--rows] [--cols] [--bg #RRGGBB]
# Coordinates in node units (raw px / K, K defaults to 2). Background is the colour at (x0, y0)
# unless --bg is given. Prints the bounding box of pixels that differ from it by more than T,
# the darkest such colour, and with --rows / --cols the runs of rows / columns containing ink.
import sys
from PIL import Image
args = sys.argv[1:]
def opt(name, default, cast=float):
    if name in args:
        i = args.index(name); v = cast(args[i + 1]); del args[i:i + 2]; return v
    return default
def flag(name):
    if name in args: args.remove(name); return True
    return False
k = opt("--k", 2.0); t = opt("--t", 40.0); bg = opt("--bg", None, str)
rows = flag("--rows"); cols = flag("--cols")
im = Image.open(args[0]).convert("RGB")
x0, y0, x1, y1 = [int(round(float(v) * k)) for v in args[1:5]]
px = im.load()
if bg: bgc = tuple(int(bg[i:i + 2], 16) for i in (1, 3, 5))
else: bgc = px[x0, y0]
def ink(c): return sum(abs(a - b) for a, b in zip(c, bgc)) > t
xs, ys, dark, dsum = [], [], None, 999
rowhit = [False] * (y1 - y0); colhit = [False] * (x1 - x0)
for y in range(y0, y1):
    for x in range(x0, x1):
        c = px[x, y]
        if ink(c):
            xs.append(x); ys.append(y); rowhit[y - y0] = True; colhit[x - x0] = True
            if sum(c) < dsum: dsum = sum(c); dark = c
f = lambda v: round(v / k, 1)
print("bg #%02X%02X%02X" % bgc)
if not xs: print("no ink"); sys.exit()
print("bbox", f(min(xs)), f(min(ys)), f(max(xs) + 1), f(max(ys) + 1), "w", f(max(xs) + 1 - min(xs)), "h", f(max(ys) + 1 - min(ys)), "darkest #%02X%02X%02X" % dark)
def runs(hits, off):
    out, start = [], None
    for i, h in enumerate(hits + [False]):
        if h and start is None: start = i
        if not h and start is not None: out.append((f(start + off), f(i + off))); start = None
    return out
if rows: print("rows", runs(rowhit, y0))
if cols: print("cols", runs(colhit, x0))
