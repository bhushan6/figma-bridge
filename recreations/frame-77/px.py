# px.py <img> x,y [x,y ...] [--k K]  -> hex color at CSS coords
import sys
from PIL import Image
args = sys.argv[1:]; k = 2.0
if "--k" in args: i = args.index("--k"); k = float(args[i+1]); del args[i:i+2]
im = Image.open(args[0]).convert("RGB")
for p in args[1:]:
    x, y = map(float, p.split(","))
    r, g, b = im.getpixel((int(x * k), int(y * k)))
    print(p, "#%02X%02X%02X" % (r, g, b))
