# boxcol.py img name:x0,y0,x1,y1 ... -> most common colour and the pixel furthest from it (CSS coords, k=2)
import sys
from collections import Counter
from PIL import Image
im = Image.open(sys.argv[1]).convert("RGB")
for a in sys.argv[2:]:
    name, b = a.split(":")
    x0, y0, x1, y1 = [int(float(v) * 2) for v in b.split(",")]
    px = list(im.crop((x0, y0, x1, y1)).getdata())
    bg = Counter(px).most_common(1)[0][0]
    fg = max(px, key=lambda p: sum((p[i] - bg[i]) ** 2 for i in range(3)))
    h = lambda p: "#%02X%02X%02X" % p
    print(f"{name:12} bg {h(bg)} fg {h(fg)}")
