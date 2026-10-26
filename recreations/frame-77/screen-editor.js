// Screen 1:15 — editor with document and AI panel (analysis summary). CSS px, 1508 x 767.
const INK = "#1F2533";
const MUTED = "#6B7280";
const BLUE = "#2C4FA5";
const SURFACE = "#F8F8FA";
const NAME = "Editor – Analysis summary";
const root = await figma.getNodeByIdAsync(ROOT_ID);
const old = root.findChild((n) => n.name === NAME);
if (old) old.remove();

const s = frame(NAME, { clipsContent: true });
s.resize(1508, 767);
s.fills = solid("#FFFFFF");

// Canvas behind the document.
place(s, rect("Canvas", 961, 646, "#F9FAFB"), 199, 121);
place(s, rect("Canvas scrollbar", 6, 482, "#DADADA", 3), 1158, 285);

// ---------- Document page ----------
const page = frame("Document page", { clipsContent: false });
page.resize(879, 700);
page.fills = solid("#FFFFFF");
page.cornerRadius = 6;
stroke(page, "#ECEEF1", 1);
shadow(page, { y: 1, blur: 4, opacity: 0.05 });
place(s, page, 238, 134);
const X0 = 238, Y0 = 134; // page origin, so positions below can use screen coords
const R = 1011 - X0;

// Body text size calibrated on one measured line.
const probe = fit(text("أبرمت هذه الاتفاقية في مدينة", { font: "doc", size: 13 }), 141);
const BODY = probe.fontSize;
probe.remove();

function docText(chars, { bold = false, color = "#111111", size = BODY } = {}) {
  return text(chars, { font: "doc", weight: bold ? "Bold" : "Regular", size, color });
}
function chip(label, width) {
  const c = autoLayout("HORIZONTAL", { name: "Field: " + label, paddingLeft: 8, paddingRight: 8, primaryAxisAlignItems: "CENTER", counterAxisAlignItems: "CENTER", cornerRadius: 4 });
  c.fills = solid("#F3F4F6");
  c.counterAxisSizingMode = "FIXED";
  c.resize(c.width, 22);
  c.appendChild(docText(label, { color: "#4B5563" }));
  if (width) {
    c.primaryAxisSizingMode = "FIXED";
    c.resize(width, 22);
  }
  return c;
}
// A line of segments in reading order (right to left), right-aligned at x = R.
function line(cy, segments, gap = 3) {
  const row = autoLayout("HORIZONTAL", { name: "Line", itemSpacing: gap, counterAxisAlignItems: "CENTER" });
  for (const seg of [...segments].reverse()) row.appendChild(seg);
  page.appendChild(row);
  row.x = R - row.width;
  row.y = cy - Y0 - row.height / 2;
  return row;
}

const title = fit(text("اتفاقية تقديم خدمات الحوسبة السحابية", { font: "doc", size: 24, color: "#111111", name: "Title" }), 414);
textAt(page, title, { right: R, cy: 258 - Y0 });
await iconAt(page, "grip-vertical", 13, "#9CA3AF", 1041 - X0, 255 - Y0);
await iconAt(page, "plus", 13, "#9CA3AF", 1065 - X0, 255 - Y0);
textAt(page, fit(docText("بسم الله الرحمن الرحيم"), 110), { right: R, cy: 323 - Y0 });
textAt(page, fit(docText("الحمد لله رب العالمين، والصلاة والسلام على أشرف الأنبياء والمرسلين، أما بعد:"), 391.5), { right: R, cy: 367 - Y0 });

line(411, [docText("أبرمت هذه الاتفاقية في مدينة"), chip("مدينة إبرام الاتفاقية", 210), docText("بالمملكة العربية السعودية، في يوم")]);
line(441, [chip("تاريخ إبرام الاتفاقية (هجري)"), docText("الموافق"), chip("تاريخ إبرام الاتفاقية (ميلادي)"), docText("، بين كل من:")]);
textAt(page, fit(text("1. أطراف الاتفاقية", { font: "doc", size: 20, color: "#111111", name: "Heading 1" }), 135), { right: R, cy: 497 - Y0 });

// who: the party's name; of: the same name with the attached lam ("للعميل", "لمقدم الخدمة").
function parties(startY, label, who, of) {
  const step = 26.6;
  line(startY, [docText(label), chip(`الاسم النظامي ${of}`, 221), docText("،"), chip(`الشكل النظامي ${of}`, 221), docText("، سجل تجاري رقم")]);
  line(startY + step, [chip(`رقم السجل التجاري ${of}`, 221), docText("، وعنوانه المسجل"), chip(`العنوان المسجل ${of}`, 221), docText("، وبريده الإلكتروني")]);
  line(startY + step * 2, [chip(`البريد الإلكتروني ${of}`, 221), docText("، ويمثله في التوقيع"), chip(`اسم ممثل ${who}`, 221), docText("بصفته")]);
  line(startY + step * 3, [chip(`صفة ممثل ${who}`, 221), docText("بموجب"), chip(`مستند تفويض ممثل ${who}`, 221), docText("، ويشار إليه في هذه الاتفاقية")]);
  line(startY + step * 4, [docText(`بـ«${who}».`)]);
}
parties(545, "أولاً:", "العميل", "للعميل");
parties(695, "ثانياً:", "مقدم الخدمة", "لمقدم الخدمة");

// ---------- Chrome ----------
place(s, (await component("Editor/Top bar")).createInstance(), 0, 0);
place(s, (await component("Editor/Toolbar")).createInstance(), 0, 60);
const side = (await component("Editor/Sections")).createInstance();
place(s, side, 0, 121);
place(s, (await component("Editor/Tool rail")).createInstance(), 1100, 293);

// ---------- AI panel: analysis summary ----------
const panel = frame("AI Panel – Analysis summary", { clipsContent: true });
panel.resize(350, 646);
panel.fills = solid("#FFFFFF");
place(s, panel, 1158, 121);
const PX = 1158, PY = 121;
const header = (await component("AI Panel/Header")).children.find((v) => v.name === "Tab=Analysis").createInstance();
place(panel, header, 0, 0);

const box = rect("Analysis box", 311, 430, SURFACE);
stroke(box, "#EEEFF2", 1);
place(panel, box, 1172 - PX, 280 - PY);
textAt(panel, fit(text("يقوم تحليل المستند بمراجعة محتوى المستند لاكتشاف\nالأخطاء المحتملة، والتحقق من الامتثال، واقتراح التحسينات،\nوضمان الدقة.", { size: 12.5, color: INK, lineHeight: 20, name: "Description" }), 282), { right: 1470 - PX, cy: 324 - PY });

const cats = [
  ["مخاطر قانونية", "#D92D20"], ["غموض", "#F79009"], ["تفاوض", "#7A5AF8"], ["تحسينات الصياغة", "#FACC15"], ["التزامات المستند", "#2E90FA"],
];
for (let i = 0; i < cats.length; i++) {
  const [label, color] = cats[i];
  const row = (await component("AI Panel/Category row")).createInstance();
  const key = Object.keys(row.componentProperties).find((k) => k.startsWith("Label"));
  row.setProperties({ [key]: label });
  row.findOne((n) => n.name === "Accent").fills = solid(color);
  const cy = 391 + i * 48.75;
  place(panel, row, 1184 - PX, cy - 24 - PY);
  if (i < cats.length - 1) hline(panel, 1185 - PX, 1470 - PX, cy + 24.5 - PY, "#ECEEF1");
}
textAt(panel, fit(text("تغيّر المستند منذ آخر تحليل", { size: 12.5, color: INK, name: "Changed title" }), 131.5), { right: 1470 - PX, cy: 645 - PY });
textAt(panel, fit(text("آخر تحليل بتاريخ 28 سبتمبر 2026. أعد التحليل لتحديث\nالتقرير.", { size: 12, color: "#9CA3AF", lineHeight: 21, name: "Changed note" }), 258.5), { right: 1470 - PX, cy: 686.5 - PY });

const btn = autoLayout("HORIZONTAL", { name: "Analyze document", itemSpacing: 7, primaryAxisAlignItems: "CENTER", counterAxisAlignItems: "CENTER", cornerRadius: 8 });
btn.fills = solid(BLUE);
btn.primaryAxisSizingMode = "FIXED";
btn.counterAxisSizingMode = "FIXED";
btn.resize(311, 32);
btn.appendChild(fit(text("تحليل المستند", { size: 12.5, color: "#FFFFFF" }), 70));
btn.appendChild(await icon("sparkles", 15, "#FFFFFF"));
place(panel, btn, 1172 - PX, 725 - PY);

root.appendChild(s);
s.rescale(2108 / 1508);
s.x = 7;
s.y = 1628;
await copyStyle(s, "1:15");
return JSON.stringify({ id: s.id, w: s.width, h: s.height, body: BODY });
