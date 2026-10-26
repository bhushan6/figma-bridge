// Panel A: the "Client representative signature" dialog (Group 162, 37:2671), 800 x 629, measured
// from a 2x export. The drawn signature and the cursor were already vectors; they are cloned in.
// Run with ./run.sh panel-sign.js — replaces "Sign dialog" inside "Group 164 – Recreated".
const INK = "#1F2937";
const BODY = "#4A5565";
const MUTED = "#697282";
const LINE = "#F3F4F6";
const SURFACE = "#F9FAFB";
const BLUE = "#1E50AB";
const ICON = "#364153";

const group = await figma.getNodeByIdAsync("37:2671");
const p = panel("Sign dialog", group, 800, 629);
p.clipsContent = false;

const d = frame("Dialog");
d.resize(800, 614);
d.fills = solid("#FFFFFF");
stroke(d, LINE, 1);
p.appendChild(d);
await copyStyle(d, "37:2673");

// Header: title and subtitle on the right, close on the left.
place(d, rect("Header", 800, 71, SURFACE), 0, 0);
label(d, "توقيع ممثل العميل", 106, { size: 16, weight: "Medium", color: INK, name: "Title" }, { right: 775, cy: 23 });
label(d, "بموجب توقيعي الإلكتروني على هذا المستند، أقر بأن هذا التوقيع يعادل التواقيع المكتوبة بخط اليد", 451.5, { size: 14, color: BODY, name: "Subtitle" }, { right: 774.5, cy: 46 });
place(d, await ic("x", 20, INK, 1.75), 17, 17);

// Signature type tabs, "Draw" selected.
const tabs = row("Tabs", 40, { paddingLeft: 4, paddingRight: 4, cornerRadius: 10 });
tabs.fills = solid(SURFACE);
const TABS = [["ارسم", 24], ["صورة", 27], ["اكتب", 22], ["المحفوظة", 48.5]];
for (const [i, [name, w]] of TABS.entries()) {
  const t = row(`Tab · ${name}`, 32, { primaryAxisAlignItems: "CENTER", cornerRadius: 8 });
  t.primaryAxisSizingMode = "FIXED";
  t.resize(i === 0 ? 77 : 78, 32);
  if (i === 0) {
    t.fills = solid("#FFFFFF");
    t.effects = [
      { type: "DROP_SHADOW", color: { r: 0.06, g: 0.09, b: 0.16, a: 0.1 }, offset: { x: 0, y: 1 }, radius: 3, spread: 0, visible: true, blendMode: "NORMAL" },
      { type: "DROP_SHADOW", color: { r: 0.06, g: 0.09, b: 0.16, a: 0.06 }, offset: { x: 0, y: 1 }, radius: 2, spread: 0, visible: true, blendMode: "NORMAL" },
    ];
  }
  t.appendChild(fit(text(name, { size: 14, color: i === 0 ? BLUE : BODY, name: "Label" }), w));
  tabs.appendChild(t);
}
place(d, tabs, 455, 95);

// Drawing canvas: pen colour and size on the left, undo / redo on the right, hint below.
const c = frame("Canvas", { x: 25, y: 161 });
c.resize(750, 228);
c.fills = solid("#FFFFFF");
c.cornerRadius = 8;
stroke(c, LINE, 1);
d.appendChild(c);
const CX = (x) => x - 25;
const CY = (y) => y - 161;
function circle(name, size, fill, cx, cy, parent = c) {
  const e = figma.createEllipse();
  e.name = name;
  e.resize(size, size);
  e.fills = fill ? solid(fill) : [];
  return place(parent, e, cx - size / 2, cy - size / 2);
}
function pillBox(name, x, y, w, h) {
  const f = frame(name, { x, y });
  f.resize(w, h);
  f.fills = solid("#FFFFFF");
  f.cornerRadius = w / 2;
  stroke(f, "#E5E7EB", 1);
  f.effects = [{ type: "DROP_SHADOW", color: { r: 0.06, g: 0.09, b: 0.16, a: 0.05 }, offset: { x: 0, y: 1 }, radius: 2, spread: 0, visible: true, blendMode: "NORMAL" }];
  c.appendChild(f);
  return f;
}
const color = circle("Pen colour", 26, "#000000", CX(48), CY(182));
stroke(color, "#D1D5DB", 1, "OUTSIDE");
const sizes = pillBox("Pen size", CX(32), CY(199), 32, 80);
circle("Selected", 20, "#E4E7EB", 16, 39, sizes);
circle("Small", 5, "#000000", 16, 15, sizes);
circle("Medium", 9.5, "#000000", 16, 39, sizes);
circle("Large", 11, "#000000", 16, 63, sizes);
const eraser = pillBox("Eraser", CX(32.5), CY(281), 31, 31);
place(eraser, svg(`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="${ICON}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/><path d="M22 21H7"/><path d="m5 11 9 9"/></svg>`, "Eraser icon"), 6.5, 6.5);
const history = pillBox("History", CX(732), CY(169), 36, 64);
place(history, await ic("undo", 18, "#B8BCC3", 1.75), 9, 8.5);
place(history, await ic("redo", 18, ICON, 1.75), 9, 36.5);
label(c, "أبدا برسم التوقيع الخاص بك هنا", 150.5, { size: 14, color: MUTED, name: "Hint" }, { cx: CX(400.25), cy: CY(341) });

const sig = (await figma.getNodeByIdAsync("37:2680")).clone();
sig.name = "Signature";
place(c, sig, CX(238), CY(187));

// Consent: legal text and two checkboxes.
const consent = frame("Consent", { x: 25, y: 407 });
consent.resize(750, 121);
consent.fills = solid(SURFACE);
consent.cornerRadius = 8;
d.appendChild(consent);
const KX = (x) => x - 25;
const KY = (y) => y - 407;
label(consent, "بقيامك بتوقيع هذا المستند إلكترونيًا، فإنك توافق على أن توقيعك ومبادرتك بالأحرف الأولى تعتبر بمثابة توقيع بخط اليد، وتُعد أصلية في جميع المستندات،", 701.5, { size: 14, color: MUTED, name: "Terms · line 1" }, { right: KX(758.5), cy: KY(424) });
label(consent, "بما في ذلك العقود القانونية الملزمة. كما أنك توافق على شروط الاستخدام وسياسة الخصوصية.", 440, { size: 14, color: MUTED, name: "Terms · line 2" }, { right: KX(758.5), cy: KY(440) });
place(consent, rect("Divider", 718, 1, "#E4E7EB"), KX(41), KY(461));

function checkbox(name, chars, w, checked, y) {
  const r = row(name, 18, { itemSpacing: 8.5 });
  r.appendChild(fit(text(chars, { size: 14, color: MUTED, name: "Label" }), w));
  const box = frame("Box");
  box.resize(16, 16);
  box.cornerRadius = 4;
  if (checked) {
    box.fills = solid(BLUE);
    place(box, svg(`<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="m3.5 8.2 3 3 6-6.2" stroke="#FFFFFF" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`, "Check"), 0, 0);
  } else {
    box.fills = solid("#FFFFFF", 0.6);
    stroke(box, "#E4E7EB", 1);
  }
  r.appendChild(box);
  return place(consent, r, KX(759) - r.width, KY(y) - 9);
}
checkbox("Save signature", "حفظ التوقيع لاستخدامه مرة أخرى", 163.5, true, 482);
checkbox("Fill all fields", "ملء جميع حقول التوقيع تلقائيا", 146.5, false, 510.5);

// Footer: sign (left) and cancel (right).
place(d, rect("Divider", 800, 1, LINE), 0, 552);
function button(name, chars, w, primary, x) {
  const b = row(name, 32, { primaryAxisAlignItems: "CENTER", cornerRadius: 6 });
  b.primaryAxisSizingMode = "FIXED";
  b.resize(80, 32);
  b.fills = solid(primary ? BLUE : "#FFFFFF");
  if (!primary) stroke(b, "#E4E7EB", 1);
  b.appendChild(fit(text(chars, { size: 14, weight: "Medium", color: primary ? "#FFFFFF" : INK, name: "Label" }), w));
  return place(d, b, x, 567);
}
button("Cancel", "إلغاء", 24, false, 695);
button("Sign", "وقع", 21, true, 25);

const cursor = (await figma.getNodeByIdAsync("37:2676")).clone();
cursor.name = "Cursor";
place(p, cursor, 72, 595);

figma.viewport.scrollAndZoomIntoView([p]);
return { id: p.id };
