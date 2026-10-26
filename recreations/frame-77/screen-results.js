// Screen 1:13 — AI panel with the expanded list of findings (cropped editor, CSS 350 x 765).
const INK = "#1F2533";
const MUTED = "#6B7280";
const LIGHT = "#9CA3AF";
const SURFACE = "#F8F8FA";
const NAME = "AI Panel – Findings list";
const root = await figma.getNodeByIdAsync(ROOT_ID);

// ---------- Issue header component (number, title, status, chevron) ----------
async function buildIssueHeader(expanded) {
  const c = makeComponent("Expanded=" + (expanded ? "Yes" : "No"), 311, 52, null);
  const numKey = c.addComponentProperty("Number", "TEXT", "1");
  const titleKey = c.addComponentProperty("Title", "TEXT", "غياب أولوية الوثائق");
  const badge = autoLayout("HORIZONTAL", { name: "Number", primaryAxisAlignItems: "CENTER", counterAxisAlignItems: "CENTER", cornerRadius: 5 });
  badge.fills = solid("#F1F2F4");
  badge.primaryAxisSizingMode = "FIXED";
  badge.counterAxisSizingMode = "FIXED";
  badge.resize(18, 20);
  const num = text("1", { size: 13, color: INK, align: "CENTER", name: "Number value" });
  badge.appendChild(num);
  place(c, badge, 276, 16);
  num.componentPropertyReferences = { characters: numKey };
  const title = textAt(c, fit(text("غياب أولوية الوثائق", { size: 13, color: INK, name: "Title" }), 88.5), { right: 268, cy: 26 });
  title.componentPropertyReferences = { characters: titleKey };
  await iconAt(c, "circle-check", 17, LIGHT, 51, 26);
  await iconAt(c, expanded ? "chevron-up" : "chevron-down", 11, MUTED, 25, 26);
  return c;
}
const issueSet = await replaceComponent("AI Panel/Issue header", async () => {
  const set = figma.combineAsVariants([await buildIssueHeader(true), await buildIssueHeader(false)], figma.currentPage);
  set.name = "AI Panel/Issue header";
  set.layoutMode = "VERTICAL";
  set.itemSpacing = 16;
  set.primaryAxisSizingMode = "AUTO";
  set.counterAxisSizingMode = "AUTO";
  return set;
});
function issueHeader(number, title, expanded) {
  const inst = issueSet.children.find((v) => v.name === "Expanded=" + (expanded ? "Yes" : "No")).createInstance();
  const props = {};
  for (const key of Object.keys(inst.componentProperties)) {
    if (key.startsWith("Number")) props[key] = number;
    if (key.startsWith("Title")) props[key] = title;
  }
  inst.setProperties(props);
  return inst;
}

// ---------- Screen ----------
const old = root.findChild((n) => n.name === NAME);
if (old) old.remove();
const s = frame(NAME, { clipsContent: true });
s.resize(350.3, 764.6);
s.fills = solid("#FFFFFF");
s.topLeftRadius = s.topRightRadius = s.bottomRightRadius = 10;

const tbar = (await component("Editor/Top bar")).createInstance();
place(s, tbar, -1144, -1);
// This screenshot truncates the title earlier, leaving a wider gap before the chevron.
tbar.findOne((n) => n.name === "Document title").visible = false;
textAt(s, fit(text("اتفاقية تقديم خدمات الـ..", { size: 13, color: "#374151", name: "Document title" }), 118.5), { right: 285, cy: 30 });
place(s, (await component("Editor/Toolbar")).createInstance(), -1144, 59);
place(s, rect("Canvas edge", 12, 650, "#F4F5F7"), 0, 120);

const header = (await component("AI Panel/Header")).children.find((v) => v.name === "Tab=Analysis").createInstance();
place(s, header, 13, 124);

const X = 27, W = 311;
place(s, rect("Category body", W, 30, SURFACE), X, 274);
const list = rect("Findings card", W, 430, "#FFFFFF", 8);
stroke(list, "#EEF0F3", 1);
place(s, list, X, 292);

function para(chars, cy, { size = 12, color = MUTED, right = 321, width } = {}) {
  const t = text(chars, { size, color, lineHeight: 20.5 });
  if (width) fit(t, width);
  return textAt(s, t, { right, cy });
}

// 1 — expanded, with a suggested edit.
place(s, issueHeader("1", "غياب أولوية الوثائق", true), X, 292);
para("تتكون العلاقة من الاتفاقية وبيان العمل واتفاقية مستوى\nالخدمة، لكن النص لا يحدد أي وثيقة تسود عند التعارض....", 362, { width: 278 });
await iconAt(s, "edit-square", 14, "#D97706", 311, 410);
textAt(s, fit(text("تعديل", { size: 13, color: INK, name: "Edit label" }), 28), { right: 290, cy: 409 });
await iconAt(s, "circle-check", 17, LIGHT, 50, 432);
para("تمثل هذه الاتفاقية وملحقاتها كامل الاتفاق بين الطر...", 443, { right: 313, width: 245 });
hline(s, X, X + W, 486, "#EEF0F3");

// 2 — collapsed, not linked to a clause.
place(s, issueHeader("2", "أثر القبول الضمني", false), X, 485);
para("اعتبار تقرير مستوى الخدمة مقبولاً بعد عشرة أيام عمل\nدون اعتراض قد يفهم على أنه إسقاط نهائي لحقوق العميل...", 555.5, { width: 278 });
await iconAt(s, "circle-dashed", 14, "#D1D5DB", 311, 597);
textAt(s, fit(text("غير مرتبط ببند محدد في المستند", { size: 11, color: LIGHT, name: "Not linked" }), 128), { right: 300, cy: 597 });
hline(s, X, X + W, 627, "#EEF0F3");

// 3 — collapsed.
place(s, issueHeader("3", "غموض التكاليف غير القابلة للاسترداد", false), X, 622);
para("يلزم الطرف المنهي، عند الاقتضاء، بسداد تكاليف غير قابلة\nللاسترداد من دون تعريف لهذه التكاليف أو بيان سقفها أو...", 691.5, { width: 278 });

// Next category, scrolled into view at the bottom.
const next = (await component("AI Panel/Result row")).createInstance();
const props = {};
for (const key of Object.keys(next.componentProperties)) {
  if (key.startsWith("Label")) props[key] = "تفاوض";
  if (key.startsWith("Count")) props[key] = "2";
}
next.setProperties(props);
next.findOne((n) => n.name === "Accent").fills = solid("#7A5AF8");
place(s, next, X, 740);

root.appendChild(s);
s.rescale(509 / 350.3);
s.x = 2949;
s.y = 1805;
await copyStyle(s, "1:13");
return JSON.stringify({ id: s.id });
