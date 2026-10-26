from PIL import Image
im=Image.open('ref.png').convert('RGB'); W,H=im.size; px=im.load()
def nw(c,t=60): return abs(c[0]-255)+abs(c[1]-255)+abs(c[2]-255)>t
def bands(x0,x1,y0=0,y1=H,bg=None):
  out=[];s=None
  for y in range(y0,y1):
    row=any((nw(px[x,y]) if bg is None else sum(abs(a-b) for a,b in zip(px[x,y],bg))>40) for x in range(x0,x1))
    if row and s is None: s=y
    if not row and s is not None: out.append((s,y)); s=None
  return out
def hb(y0,y1,x0=80,x1=W):
  xs=[x for x in range(x0,x1) if any(nw(px[x,y]) for y in range(y0,y1,2))]
  return (min(xs),max(xs)) if xs else None
S=5;OX=70
f=lambda v:round(v/S,1)
print('icon col right (1250-1520):')
for a,b in bands(1250,1520,0,5750):
  xr=hb(a,b,1250,1520); print(f(a),f(b),'cy',f((a+b)/2),'x',f(xr[0]-OX),f(xr[1]-OX),'size',f(b-a))
print('left col (150-500):')
for a,b in bands(150,500,1600,5750):
  xr=hb(a,b,150,500); print(f(a),f(b),'cy',f((a+b)/2),'x',f(xr[0]-OX),f(xr[1]-OX))
print('text col (500-1240):')
for a,b in bands(500,1240,600,5750):
  xr=hb(a,b,500,1245); print(f(a),f(b),'cy',f((a+b)/2),'x',f(xr[0]-OX),f(xr[1]-OX))
# darkest colors
from collections import Counter
def dark(x0,y0,x1,y1):
  best=min((px[x,y] for x in range(x0,x1) for y in range(y0,y1)), key=sum); return '#%02X%02X%02X'%best
print('home text',dark(900,680,1220,780),'home icon',dark(1290,680,1400,790),'fav text',dark(1000,1690,1340,1770),'chev',dark(1395,1720,1460,1760))
print('prod text',dark(780,3900,1360,4000),'grid',dark(1420,3910,1510,3990),'AI text',dark(1040,4230,1340,4330),'chev-left',dark(195,4250,240,4320))
print('pill',px[200,4860],'pill text',dark(230,4800,410,4910),'support',dark(850,5190,1280,5300),'support icon',dark(1350,5185,1470,5300))
print('name',dark(540,5500,1215,5580),'email',dark(500,5640,1215,5710),'avatar bg',px[1300,5612],'avatar border',px[1287,5612],'user icon',dark(1340,5560,1420,5660),'gear',dark(220,5560,340,5670))
print('create',px[400,200],'home bg',px[300,700],'divider',px[800,1575],px[800,3773],px[800,5048],'strip',px[20,3000],'border',px[66,3000],px[68,3000])
