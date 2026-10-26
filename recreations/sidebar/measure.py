from PIL import Image
im=Image.open('ref.png').convert('RGB'); W,H=im.size; px=im.load()
print('left', px[10,100], px[66,100], px[72,100], px[10,3000],px[66,3000])
def nw(c,t=30): return abs(c[0]-255)+abs(c[1]-255)+abs(c[2]-255)>t
x0=80
bands=[];s=None
for y in range(H):
  row=any(nw(px[x,y]) for x in range(x0,W,2))
  if row and s is None: s=y
  if not row and s is not None: bands.append((s,y)); s=None
if s is not None: bands.append((s,H))
for a,b in bands:
  xs=[x for x in range(x0,W) if any(nw(px[x,y]) for y in range(a,b,max(1,(b-a)//12)))]
  print((a,b), b-a, 'x', min(xs), max(xs), 'mid', px[(min(xs)+max(xs))//2,(a+b)//2])
