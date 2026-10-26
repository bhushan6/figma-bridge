# cmp.py x0 y0 x1 y1 out  (window coords) -> ref crop above node crop
import sys
from PIL import Image
x0, y0, x1, y1 = map(float, sys.argv[1:5]); out = sys.argv[5]
ref = Image.open("ref.png").convert("RGB"); node = Image.open("out/node.png").convert("RGB")
a = ref.crop(tuple(int(v * 2) for v in (x0 + 8, y0 + 2.5, x1 + 8, y1 + 2.5)))
b = node.crop(tuple(int(v * 2) for v in (x0, y0, x1, y1)))
im = Image.new("RGB", (a.width, a.height * 2 + 6), (255, 0, 255)); im.paste(a, (0, 0)); im.paste(b, (0, a.height + 6))
m = max(im.size)
if m > 1800: im = im.resize((int(im.width * 1800 / m), int(im.height * 1800 / m)), Image.LANCZOS)
im.save(out); print(out, im.size)
