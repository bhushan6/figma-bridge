# cmp.py <nodeId> — export the recreation at 5x and write side-by-side slices out/cmp*.png
import sys, subprocess
from PIL import Image
subprocess.run(["node","../../src/cli.js","export",sys.argv[1],"out/rec.png","--scale","5","--max","6000"],check=True,stdout=subprocess.DEVNULL)
ref=Image.open('out/ref.png').convert('RGB').crop((65,0,1572,5782)); rec=Image.open('out/rec.png').convert('RGB').crop((0,0,1507,5782))
for i,(y0,y1) in enumerate([(100,1500),(1550,2450),(3750,5000),(4950,5782)]):
  h=y1-y0; im=Image.new('RGB',(ref.width*2+20,h),(255,0,255))
  im.paste(ref.crop((0,y0,ref.width,y1)),(0,0)); im.paste(rec.crop((0,y0,ref.width,y1)),(ref.width+20,0))
  im.resize((im.width//2,im.height//2)).save(f'out/cmp{i}.png')
