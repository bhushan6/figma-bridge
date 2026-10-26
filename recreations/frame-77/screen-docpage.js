// Group 1:20 — the agreement's first page (817 x 1175, built directly in node units).
const NAME = "Document page – Agreement";
const root = await figma.getNodeByIdAsync(ROOT_ID);
const old = root.findChild((n) => n.name === NAME);
if (old) old.remove();

const g = frame(NAME, { clipsContent: false });
g.resize(817, 1175);
g.fills = [];
// The page itself is a component so editors can show it at their zoom level.
const page = makeComponent("Document/Agreement page", 813, 1159, "#FFFFFF");
page.clipsContent = true;
page.topLeftRadius = page.topRightRadius = 8;
stroke(page, "#ECEEF1", 1);
const OX = 3.5, OY = 1;
const R = 710 - OX;

const probe = fit(text("أبرمت هذه الاتفاقية في مدينة", { font: "doc", size: 13 }), 127.5);
const BODY = probe.fontSize;
probe.remove();
const INKD = "#111111";
function docText(chars, { color = INKD, size = BODY, lineHeight } = {}) {
  return text(chars, { font: "doc", size, color, lineHeight });
}
function chip(label, width) {
  const c = autoLayout("HORIZONTAL", { name: "Field: " + label, paddingLeft: 7, paddingRight: 7, primaryAxisAlignItems: "CENTER", counterAxisAlignItems: "CENTER", cornerRadius: 4 });
  c.fills = solid("#F3F4F6");
  c.counterAxisSizingMode = "FIXED";
  c.resize(c.width, 19);
  c.appendChild(docText(label, { color: "#4B5563" }));
  if (width) {
    c.primaryAxisSizingMode = "FIXED";
    c.resize(width, 19);
  }
  return c;
}
function line(cy, segments, gap = 3) {
  const row = autoLayout("HORIZONTAL", { name: "Line", itemSpacing: gap, counterAxisAlignItems: "CENTER" });
  for (const seg of [...segments].reverse()) row.appendChild(seg);
  page.appendChild(row);
  row.x = R - row.width;
  row.y = cy - OY - row.height / 2;
  return row;
}
function para(chars, cy, lh = 24.5) {
  const t = docText(chars, { lineHeight: lh });
  return textAt(page, t, { right: R, cy: cy - OY });
}
function divider(y) {
  return hline(page, 133 - OX, 685 - OX, y - OY, "#EEF0F3");
}

textAt(page, fit(text("اتفاقية تقديم خدمات الحوسبة السحابية", { font: "doc", size: 22, color: INKD, name: "Title" }), 374.6), { right: R, cy: 120.6 - OY });
await iconAt(page, "plus", 12, "#9CA3AF", 740 - OX, 118 - OY);
await iconAt(page, "grip-vertical", 13, "#9CA3AF", 763.5 - OX, 118 - OY);
para("بسم الله الرحمن الرحيم", 178);
para("الحمد لله رب العالمين، والصلاة والسلام على أشرف الأنبياء والمرسلين، أما بعد:", 217.3);
line(257.9, [docText("أبرمت هذه الاتفاقية في مدينة"), chip("مدينة إبرام الاتفاقية", 197.5), docText("بالمملكة العربية السعودية، في يوم")]);
line(281.4, [chip("تاريخ إبرام الاتفاقية (هجري)"), docText("الموافق"), chip("تاريخ إبرام الاتفاقية (ميلادي)"), docText("، بين كل من:")]);
const h1 = textAt(page, fit(text("1. أطراف الاتفاقية", { font: "doc", size: 18, color: INKD, name: "Heading 1" }), 123), { right: R, cy: 335 - OY });
const HSIZE = h1.fontSize;

function parties(startY, label, who, of, tail) {
  const step = 24.2;
  line(startY, [docText(label), chip(`الاسم النظامي ${of}`, 200), docText("،"), chip(`الشكل النظامي ${of}`, 200), docText("، سجل تجاري رقم")]);
  line(startY + step, [chip(`رقم السجل التجاري ${of}`, 200), docText("، وعنوانه المسجل"), chip(`العنوان المسجل ${of}`, 200), docText("، وبريده الإلكتروني")]);
  line(startY + step * 2, [chip(`البريد الإلكتروني ${of}`, 200), docText("، ويمثله في التوقيع"), chip(`اسم ممثل ${who}`, 200), docText("بصفته")]);
  line(startY + step * 3, [chip(`صفة ممثل ${who}`, 200), docText("بموجب"), chip(`مستند تفويض ممثل ${who}`, 200), docText(tail[0])]);
  line(startY + step * 4, [docText(tail[1])]);
}
parties(376.9, "أولاً:", "العميل", "للعميل", ["، ويشار إليه في هذه الاتفاقية", "بـ«العميل»."]);
parties(512.8, "ثانياً:", "مقدم الخدمة", "لمقدم الخدمة", ["، ويشار إليه في هذه الاتفاقية بـ«مقدم", "الخدمة»."]);

para("ويشار إلى العميل ومقدم الخدمة مجتمعين بـ«الطرفين»، وإلى كل منهما منفرداً بـ«الطرف». ويقر كل طرف بأنه بكامل الأهلية الشرعية\nوالنظامية للتعاقد والتصرف، وأن ممثله مخول نظاماً بإلزامه بهذه الاتفاقية.", 669);
divider(726);
textAt(page, text("2. التمهيد", { font: "doc", size: HSIZE, color: INKD, name: "Heading 2" }), { right: R, cy: 764.5 - OY });
para("حيث إن العميل يرغب في الحصول على خدمات الحوسبة السحابية المبينة في هذه الاتفاقية وملحق بيان العمل، وحيث إن مقدم الخدمة\nيقدم خدمات الحوسبة السحابية في المملكة العربية السعودية ويلتزم بالمتطلبات النظامية المنطبقة عليها، فقد اتفق الطرفان، وهما بكامل\nأهليتهما، على ما يأتي. ويعد هذا التمهيد وملحقا هذه الاتفاقية جزءاً لا يتجزأ منها.", 830.4);
divider(899);
textAt(page, text("3. التعريفات", { font: "doc", size: HSIZE, color: INKD, name: "Heading 3" }), { right: R, cy: 936.5 - OY });
para("لأغراض هذه الاتفاقية، تكون للمصطلحات الآتية المعاني المبينة أمام كل منها ما لم يقتض السياق معنى آخر:", 979);
textAt(page, docText("الخدمات: خدمات الحوسبة السحابية التي يوفرها مقدم الخدمة للعميل وفق البند الرابع وملحق بيان العمل، وتشمل فقط الخدمات"), { right: 684 - OX, cy: 1018.9 - OY });
const bullet = figma.createEllipse(); bullet.name = "Bullet"; bullet.resize(4.5, 4.5); bullet.fills = solid(INKD);
place(page, bullet, 698.5 - OX - 2.25, 1018.9 - OY - 2.25);

const pageComp = await replaceComponent("Document/Agreement page", async () => page);
place(g, pageComp.createInstance(), 3.5, 1);
root.appendChild(g);
g.x = 2404;
g.y = 211;
g.effects = (await figma.getNodeByIdAsync("1:20")).effects;
return JSON.stringify({ id: g.id, body: BODY, heading: HSIZE });
