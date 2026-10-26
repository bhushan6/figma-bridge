# cmp.py <nodeId> — export the recreation at 2x and write side-by-side slices out/cmp*.png
import sys, subprocess
from PIL import Image
subprocess.run(["node","../../src/cli.js","export",sys.argv[1],"out/rec.png","--scale","2","--max","4000"],check=True,stdout=subprocess.DEVNULL)
ref=Image.open('out/ref2.png').convert('RGB'); rec=Image.open('out/rec.png').convert('RGB')
for i,(y0,y1) in enumerate([(0,1100),(1080,1900),(1880,2692)]):
  h=y1-y0; im=Image.new('RGB',(ref.width,h*2+16),(255,0,255))
  im.paste(ref.crop((0,y0,ref.width,y1)),(0,0)); im.paste(rec.crop((0,y0,ref.width,y1)),(0,h+16))
  im.resize((im.width*2//5,im.height*2//5)).save(f'out/cmp{i}.png')
