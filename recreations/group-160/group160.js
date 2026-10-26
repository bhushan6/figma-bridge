// Group 160 (27:2649) recreated as editable layers: the end of the agreement (clauses 20–21)
// with the AI suggestion card over it. 1525 x 1346, built in node units, measured from a 2x export.
// Run with ./run.sh group160.js — replaces "Group 160 – Recreated" each time.
const NAME = "Group 160 – Recreated";
const REF_ID = "27:2649";
const INK = "#1F2937";
const DOC_INK = "#111111";
const BODY = "#4B5563";
const MUTED = "#6B7280";
const LABEL = "#9CA3AF";
const BORDER = "#E5E7EB";
const ORANGE = "#FE9900";
const GREEN = "#008236";
const GREEN_BG = "#E4F3EA";
const PEACH = "#FAEEDB";
const BLUE = "#1E50AB";
const PANEL = "#F8F8FA";
const RISK_BG = "#F5F5F5";

const ref = await figma.getNodeByIdAsync(REF_ID);
for (const stray of figma.currentPage.findChildren((n) => n.name === NAME)) stray.remove();

const root = frame(NAME, { x: ref.x + ref.width + 120, y: ref.y });
root.resize(1525, 1346);
root.fills = solid("#FFFFFF");
root.cornerRadius = 23;
root.clipsContent = true;

// Fixed-height horizontal row that centres its content vertically.
function row(name, h, props = {}) {
  const r = autoLayout("HORIZONTAL", { name, counterAxisAlignItems: "CENTER", ...props });
  r.counterAxisSizingMode = "FIXED";
  r.resize(r.width, h);
  return r;
}
function vdivider(h = 40) {
  return rect("Divider", 1, h, BORDER);
}
async function ic(name, size, color, sw) {
  const i = await icon(name, size, color);
  i.name = name;
  if (sw) for (const v of i.findAll((n) => "strokeWeight" in n && n.strokes && n.strokes.length)) v.strokeWeight = sw;
  return i;
}

// ---------- Document (behind the card) ----------
const doc = frame("Document", { x: 0, y: 0 });
doc.resize(1525, 553);
root.appendChild(doc);
const DOC_R = 1337;

function heading(num, title, cy, titleWidth) {
  const t = text(`${num} ${title}`, { font: "doc", size: 30, color: INK, name: `Heading ${num}` });
  t.setRangeFontName(0, num.length, F.docBold);
  fit(t, titleWidth);
  return textAt(doc, t, { right: 1342, cy });
}
heading("20.", "التنازل", 66, 149);
const probe = fit(text("لا يجوز لأي طرف التنازل عن هذه الاتفاقية أو عن أي حق أو التزام ناشئ عنها، كلياً أو جزئياً، دون موافقة الطرف الآخر الكتابية", { font: "doc", size: 18 }), 1083);
const DOC_SIZE = probe.fontSize;
probe.remove();
const docLine = (chars, cy, name) => textAt(doc, text(chars, { font: "doc", size: DOC_SIZE, color: DOC_INK, name }), { right: DOC_R, cy });

for (const [i, l] of [
  "لا يجوز لأي طرف التنازل عن هذه الاتفاقية أو عن أي حق أو التزام ناشئ عنها، كلياً أو جزئياً، دون موافقة الطرف الآخر الكتابية",
  "المسبقة، ويستثنى من ذلك التنازل إلى شركة تابعة للطرف أو إلى خلفه النظامي في اندماج أو استحواذ على معظم أصوله، بشرط إشعار",
  "الطرف الآخر كتابة قبل خمسة عشر يوماً تقويمياً من نفاذ التنازل وتولي المتنازل إليه جميع الالتزامات الواردة في هذه الاتفاقية.",
].entries()) docLine(l, [145, 189.5, 234.5][i], `Clause 20 · line ${i + 1}`);

hline(doc, 237, 1296, 321, "#EEF0F3");
heading("21.", "التعديل والعقد الكامل", 394, 315);

// Clause 21 is the text the AI is commenting on: highlighted line by line.
const HL = [
  ["تمثل هذه الاتفاقية وملحقاها كامل الاتفاق بين الطرفين بشأن موضوعها، وتحل محل أي تفاهم أو مراسلة أو عرض سابق متعلق به. ولا", 216, 1337, 461],
  ["يكون أي تعديل أو إضافة أو تنازل عن حق نافذاً إلا إذا كان مكتوباً وموقعاً من ممثلين مفوضين للطرفين.", 465, 1342, 507],
];
for (const [i, [chars, x0, x1, y0]] of HL.entries()) {
  place(doc, rect(`Highlight ${i + 1}`, x1 - x0, 28.5, PEACH), x0, y0);
  docLine(chars, y0 + 14, `Clause 21 · line ${i + 1}`);
}

// Strip under the card's lower edge.
place(root, rect("Backdrop", 1525, 92, "#F5F5F5"), 0, 1254);

// ---------- AI suggestion card ----------
const card = autoLayout("VERTICAL", { name: "AI suggestion" });
card.primaryAxisSizingMode = card.counterAxisSizingMode = "FIXED";
card.resize(1457, 780);
card.fills = solid("#FFFFFF");
card.cornerRadius = 29;
stroke(card, "#FFFFFF", 7);
card.paddingLeft = card.paddingRight = card.paddingTop = card.paddingBottom = 7;
card.strokesIncludedInLayout = false;
shadow(card, { y: -6, blur: 24, opacity: 0.05 });
place(root, card, 40, 553);

// Header: close (left), source line (right), issue-type chip below.
const header = frame("Header");
header.resize(1443, 167);
add(card, header, { fillH: true });
const H = (y) => y - 560; // root y -> header y
const HX = (x) => x - 47;
const close = await ic("x", 38, MUTED, 2);
close.name = "Close";
place(header, close, HX(78) - 19, H(594) - 19);

const source = row("Source", 38, { itemSpacing: 4 });
source.appendChild(fit(text("بواسطة من قانونية AI", { size: 22, color: BODY, name: "Label" }), 210));
const spark = await icon("logo-spark", 38);
spark.name = "Spark";
source.appendChild(spark);
place(header, source, HX(1472) - source.width, H(594) - 19);

const chip = row("Issue type", 62, { paddingLeft: 26, paddingRight: 25, itemSpacing: 16, cornerRadius: 10 });
chip.fills = solid("#FFFFFF");
stroke(chip, "#F1F2F4", 1);
shadow(chip, { y: 2, blur: 8, opacity: 0.08 });
chip.appendChild(fit(text("غموض", { size: 22, color: INK, name: "Label" }), 73));
chip.appendChild(rect("Accent", 4, 30, ORANGE, 2));
place(header, chip, HX(1472) - chip.width, H(647));

// Body: suggested text, risk note, actions.
const body = autoLayout("VERTICAL", { name: "Body", paddingTop: 29, paddingLeft: 33, paddingRight: 33, counterAxisAlignItems: "MAX" });
body.fills = solid(PANEL);
body.cornerRadius = 24;
add(card, body, { fillH: true, grow: 1 });

const label = row("Label", 24, {});
label.appendChild(fit(text("النص المقترح", { size: 17, color: LABEL, name: "Label" }), 109));
add(body, label);

// Suggested paragraph: plain + inserted (green) runs, one row per line. Runs are listed right to left.
const sugg = add(body, autoLayout("VERTICAL", { name: "Suggested text", itemSpacing: 2.5, counterAxisAlignItems: "MAX" }), { fillH: true });
const probe2 = fit(text("تعارض أحكامها مع أي ملحق، تسود أحكام هذه الاتفاقية، ثم اتفاقية مستوى الخدمة، ثم بيان العمل، ما لم ينص التعديل أو الملحق صراحة على", { size: 22 }), 1352);
const SUGG_SIZE = probe2.fontSize;
probe2.remove();
function run(chars, inserted) {
  if (!inserted) return text(chars, { size: SUGG_SIZE, color: INK, name: "Text" });
  const r = row("Inserted", 38, { paddingLeft: 9, paddingRight: 9, cornerRadius: 6 });
  r.fills = solid(GREEN_BG);
  r.appendChild(text(chars, { size: SUGG_SIZE, color: GREEN, name: "Text" }));
  return r;
}
for (const [i, runs] of [
  [["تمثل هذه الاتفاقية وملحقاها كامل الاتفاق بين الطرفين بشأن موضوعها، وتحل محل أي تفاهم أو مراسلة أو عرض سابق متعلق به.", false], ["وفي حال", true]],
  [["تعارض أحكامها مع أي ملحق، تسود أحكام هذه الاتفاقية، ثم اتفاقية مستوى الخدمة، ثم بيان العمل، ما لم ينص التعديل أو الملحق صراحة على", true]],
  [["أولوية مختلفة في موضوع محدد.", true], ["ولا يكون أي تعديل أو إضافة أو تنازل عن حق نافذاً إلا إذا كان مكتوباً وموقعاً من ممثلين مفوضين للطرفين.", false]],
].entries()) {
  const line = row(`Line ${i + 1}`, 38, { itemSpacing: 6 });
  for (const [chars, ins] of [...runs].reverse()) line.appendChild(run(chars, ins));
  add(sugg, line);
}

// Risk note.
const risk = add(body, autoLayout("VERTICAL", { name: "Risk", paddingTop: 17, paddingBottom: 23, paddingRight: 22, paddingLeft: 22, itemSpacing: 15, counterAxisAlignItems: "MAX", cornerRadius: 16 }), { fillH: true });
risk.fills = solid(RISK_BG);
const riskHead = row("Title", 30, { itemSpacing: 17 });
riskHead.appendChild(fit(text("مخاطر تعاقدية", { size: 22, color: INK, name: "Title" }), 144));
riskHead.appendChild(rect("Accent", 4, 30, ORANGE, 2));
add(risk, riskHead);
const riskText = add(risk, autoLayout("VERTICAL", { name: "Text", itemSpacing: 6, counterAxisAlignItems: "MAX", paddingRight: 2 }));
const probe3 = fit(text("تتكون العلاقة من الاتفاقية وبيان العمل واتفاقية مستوى الخدمة، لكن النص لا يحدد أي وثيقة تسود عند التعارض. وقد يؤدي ذلك إلى", { size: 20 }), 1256);
const RISK_SIZE = probe3.fontSize;
probe3.remove();
for (const l of [
  "تتكون العلاقة من الاتفاقية وبيان العمل واتفاقية مستوى الخدمة، لكن النص لا يحدد أي وثيقة تسود عند التعارض. وقد يؤدي ذلك إلى",
  "اختلاف جوهري في تفسير نطاق الخدمات أو الأسعار أو مستويات الأداء أو المعالجات عند الإخلال.",
]) {
  const r = row("Line", 36, {});
  r.appendChild(text(l, { size: RISK_SIZE, color: BODY, name: "Text" }));
  add(riskText, r);
}

// Actions: feedback on the left, pager and accept / reject on the right.
const actions = add(body, row("Actions", 64, { primaryAxisAlignItems: "SPACE_BETWEEN" }), { fillH: true });
actions.primaryAxisSizingMode = "FIXED";
const feedback = row("Feedback", 64, { itemSpacing: 37 });
const report = row("Report", 64, { itemSpacing: 18 });
report.appendChild(fit(text("الإبلاغ عن مشكلة", { size: 20, color: LABEL, name: "Label" }), 168));
report.appendChild(await ic("triangle-alert", 35, MUTED, 2));
feedback.appendChild(report);
feedback.appendChild(vdivider());
for (const n of ["thumbs-down", "thumbs-up", "copy"]) feedback.appendChild(await ic(n, n === "copy" ? 37 : 35, MUTED, 2));
actions.appendChild(feedback);

const decide = row("Decision", 64, { itemSpacing: 0 });
const pager = row("Pager", 64, { itemSpacing: 14 });
pager.appendChild(await ic("chevron-down", 30, MUTED, 2));
const count = fit(text("3/1", { size: 22, color: MUTED, name: "Count" }), 32);
count.setRangeFontName(2, 3, F.appRegular);
count.setRangeFills(2, 3, solid(INK));
pager.appendChild(count);
pager.appendChild(await ic("chevron-up", 30, MUTED, 2));
decide.appendChild(pager);
gap(decide, 56);
decide.appendChild(vdivider());
gap(decide, 25);
async function button(name, label, iconName, primary) {
  const b = row(name, 64, { primaryAxisAlignItems: "CENTER", itemSpacing: 8, cornerRadius: 10 });
  b.primaryAxisSizingMode = "FIXED";
  b.resize(161, 64);
  b.fills = solid(primary ? BLUE : "#FFFFFF");
  if (!primary) stroke(b, BORDER, 1.5);
  b.appendChild(fit(text(label, { size: 22, color: primary ? "#FFFFFF" : INK, weight: "Medium", name: "Label" }), primary ? 52 : 50));
  b.appendChild(await ic(iconName, 32, primary ? "#FFFFFF" : INK, 2));
  return b;
}
decide.appendChild(await button("Reject", "رفض", "x", false));
gap(decide, 28);
decide.appendChild(await button("Accept", "قبول", "check", true));
actions.appendChild(decide);

// Per-gap spacing (auto layout has one itemSpacing): pad with fixed spacers between sections.
body.itemSpacing = 0;
const spacer = (h, before) => {
  const s = frame("Gap");
  s.resize(10, h);
  body.insertChild(body.children.indexOf(before), s);
};
spacer(21, sugg);
spacer(52, risk);
spacer(46, actions);

figma.viewport.scrollAndZoomIntoView([ref, root]);
return { id: root.id, DOC_SIZE, SUGG_SIZE, RISK_SIZE };
