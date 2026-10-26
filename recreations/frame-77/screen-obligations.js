// Screens 1:9 / 1:8 / 1:7 — "View obligations" modal with filter tabs and table (node units, 1130 x 700).
const INK = "#1F2533";
const MUTED = "#6B7280";
const LIGHT = "#9CA3AF";
const BLUE = "#2C4FA5";
const LINE = "#EEF0F3";
const root = await figma.getNodeByIdAsync(ROOT_ID);

// Column layout, left to right (x, width).
const COLS = [
  ["Notes", 15.8, 291], ["Source", 306.8, 278], ["Type", 584.8, 119.2], ["Description", 704, 290.4], ["Party", 994.4, 119.8],
];
const PAD = 16.5;

// Calibrate sizes from measured widths.
function calibrate(chars, width, opts = {}) {
  const t = fit(text(chars, { size: 13, ...opts }), width);
  const size = t.fontSize;
  t.remove();
  return size;
}
const BODY = calibrate("يجب على مقدم الخدمة تقديم الخدمات السحابية", 236.7);
const PARTY = calibrate("Second Party", 74.6);
const HEAD = calibrate("الطرف الملتزم", 77.4);

// ---------- Tab component ----------
async function buildTab(active) {
  const c = figma.createComponent();
  c.name = "Active=" + (active ? "Yes" : "No");
  c.layoutMode = "HORIZONTAL";
  c.primaryAxisSizingMode = "AUTO";
  c.counterAxisSizingMode = "FIXED";
  c.resize(80, 34.4);
  c.primaryAxisSizingMode = "AUTO";
  c.counterAxisAlignItems = "CENTER";
  c.itemSpacing = 4;
  c.paddingLeft = c.paddingRight = 12;
  c.cornerRadius = 7;
  c.fills = active ? solid("#FFFFFF") : [];
  if (active) shadow(c, { y: 1, blur: 3, opacity: 0.1 });
  const labelKey = c.addComponentProperty("Label", "TEXT", "الكل");
  const countKey = c.addComponentProperty("Count", "TEXT", "42");
  const badge = autoLayout("HORIZONTAL", { name: "Count", paddingLeft: 7, paddingRight: 7, primaryAxisAlignItems: "CENTER", counterAxisAlignItems: "CENTER", cornerRadius: 10.5 });
  stroke(badge, "#E5E7EB", 1);
  badge.counterAxisSizingMode = "FIXED";
  badge.resize(badge.width, 21);
  const count = text("42", { size: 10.5, color: MUTED, align: "CENTER", name: "Count value" });
  badge.appendChild(count);
  c.appendChild(badge);
  count.componentPropertyReferences = { characters: countKey };
  const label = text("الكل", { size: PARTY * 1.02, weight: active ? "Medium" : "Regular", color: active ? BLUE : MUTED, name: "Label" });
  c.appendChild(label);
  label.componentPropertyReferences = { characters: labelKey };
  return c;
}
const tabSet = await replaceComponent("Obligations/Tab", async () => {
  const set = figma.combineAsVariants([await buildTab(true), await buildTab(false)], figma.currentPage);
  set.name = "Obligations/Tab";
  set.layoutMode = "HORIZONTAL";
  set.itemSpacing = 16;
  set.primaryAxisSizingMode = "AUTO";
  set.counterAxisSizingMode = "AUTO";
  return set;
});

// ---------- Row component ----------
const rowComp = await replaceComponent("Obligations/Row", async () => {
  const c = figma.createComponent();
  c.name = "Obligations/Row";
  c.layoutMode = "HORIZONTAL";
  c.primaryAxisSizingMode = "FIXED";
  c.counterAxisSizingMode = "AUTO";
  c.resize(1098.4, 100);
  c.itemSpacing = 0;
  c.fills = solid("#FFFFFF");
  c.strokes = solid(LINE);
  c.strokeTopWeight = 0; c.strokeLeftWeight = 0; c.strokeRightWeight = 0; c.strokeBottomWeight = 1;
  c.strokeAlign = "INSIDE";
  const defaults = {
    Notes: ["لا يوجد ملاحظات إضافية", LIGHT],
    Source: ["Scope and Permitted Use", "#374151"],
    Type: ["التزام أحادي على\nطرف واحد", "#374151"],
    Description: ["يجب على مقدم الخدمة تقديم الخدمات السحابية المحددة في كل أمر خدمة مقبول وفقاً للعقد ومستويات الخدمة.", INK],
    Party: ["Second Party", "#374151"],
  };
  for (let i = 0; i < COLS.length; i++) {
    const [name, , w] = COLS[i];
    const cell = autoLayout("VERTICAL", { name, paddingLeft: PAD, paddingRight: PAD, paddingTop: 15.4, paddingBottom: 15.4, primaryAxisAlignItems: "CENTER", counterAxisAlignItems: "MAX" });
    cell.counterAxisSizingMode = "FIXED";
    cell.resize(w, 50);
    if (i > 0) {
      cell.strokes = solid(LINE);
      cell.strokeTopWeight = 0; cell.strokeRightWeight = 0; cell.strokeBottomWeight = 0; cell.strokeLeftWeight = 1;
      cell.strokeAlign = "INSIDE";
    }
    c.appendChild(cell);
    cell.layoutSizingVertical = "FILL";
    const key = c.addComponentProperty(name, "TEXT", defaults[name][0]);
    const t = text(defaults[name][0], { size: name === "Party" ? PARTY : BODY, color: defaults[name][1], lineHeight: 17, name: name + " text" });
    t.textAutoResize = "HEIGHT";
    t.resize(w - PAD * 2, t.height);
    cell.appendChild(t);
    t.layoutSizingHorizontal = "FILL";
    t.componentPropertyReferences = { characters: key };
  }
  return c;
});

const SECOND = [
  ["يجب على مقدم الخدمة تقديم الخدمات السحابية المحددة في كل أمر خدمة مقبول وفقاً للعقد ومستويات الخدمة. ويجب على العميل استخدام الخدمات فقط لأغراضه التجارية الداخلية المشروعة والاستخدامات المسموح بها.", "Scope and Permitted Use", "يتضمن البند التزاماً مقابلاً على العميل، لكنه ليس التزاماً متبادلاً من النوع نفسه."],
  ["يجب على مقدم الخدمة ألا يخفض بصورة جوهرية وظائف الخدمات السحابية أو أمنها أو مستويات خدمتها خلال مدة أمر الخدمة المقبول دون موافقة خطية مسبقة من العميل، إلا إذا أوجب القانون أو توجيه صادر عن جهة مختصة ذلك.", "Scope and Permitted Use", null],
  ["يجب على مقدم الخدمة الاحتفاظ طوال مدة العقد بجميع التسجيلات والموافقات والتراخيص والشهادات والقدرات الفنية اللازمة لتقديم الخدمات السحابية، وتقديم ما يثبت فئة تسجيله عند الطلب.", "Provider Regulatory Status and Representations", null],
  ["يجب على مقدم الخدمة الامتثال للوائح والأنظمة ومتطلبات الأمن السيبراني والتوجيهات الملزمة، وإخطار العميل خلال يوم عمل واحد من علمه بأي تعليق أو إلغاء أو انتهاء أو تعديل جوهري في تسجيله أو ترخيصه قد يؤثر في الخدمات.", "Provider Regulatory Status and Representations", null],
  ["يجب على مقدم الخدمة تقديم الخدمات السحابية وفقاً للعقد وأوامر الخدمة المقبولة ومستويات الخدمة وبالمهارة والعناية المهنية المتوقعة من مقدم خدمة سحابية كفء.", "Provider Obligations", null],
].map((r) => ["Second Party", ...r]);
const FIRST = [
  ["يجب على العميل تعيين مدير خدمة مخول، وتوفير المعلومات وسبل الوصول اللازمة بصورة معقولة، وإدارة بيانات اعتماد مستخدميه المصرح لهم، ودفع الرسوم غير المتنازع عليها وفقاً للعقد.", "Client Obligations", null],
  ["يجب على العميل ألا يستخدم الخدمات لتحميل أو معالجة أو تخزين أو نقل أو إتاحة محتوى مخالف للقانون أو منتهك لحقوق الملكية الفكرية للغير، وأن يتحمل مسؤولية قانونية بيانات العميل ودقتها وسنده في استخدامها، مع استثناء الأضرار الناتجة عن إخلال مقدم الخدمة.", "Client Obligations", null],
  ["يجب على العميل دفع الرسوم المحددة في كل أمر خدمة مقبول، وسداد كل فاتورة غير متنازع عليها خلال مدة السداد المحددة بعد استلام فاتورة ضريبية صحيحة.", "Fees, Invoicing, and Payment", null],
  ["يجوز للعميل، بعد إخطار خطي مسبق، تدقيق امتثال مقدم الخدمة للعقد مرة كل اثني عشر شهراً أو بعد وقوع حادث أمني، على ألا يتدخل التدقيق بصورة غير معقولة في عمليات مقدم الخدمة.", "Cybersecurity, Incident Management, and Audit", "هذا حق للعميل وليس التزاماً إيجابياً مستمراً، لكنه أدرج لارتباطه بواجب مقدم الخدمة في المعالجة عند اكتشاف عدم الامتثال."],
  ["يجب على العميل الدفاع عن مقدم الخدمة وتعويضه عن الخسائر والأضرار والمسؤوليات والتكاليف والرسوم القانونية المعقولة الناشئة عن مطالبة من الغير بأن بيانات العميل أو مواده تنتهك حقوق الملكية الفكرية أو تخالف القانون، باستثناء ما سببه إخلال مقدم الخدمة.", "Indemnification", null],
].map((r) => ["First Party", ...r]);

async function buildScreen(name, activeTab, rows, refId, x, y) {
  const old = root.findChild((n) => n.name === name);
  if (old) old.remove();
  const s = frame(name, { clipsContent: true });
  s.resize(1130, 700);
  s.fills = solid("#FFFFFF");

  place(s, rect("Header", 1130, 45.8, "#F5F6F8"), 0, 0);
  textAt(s, fit(text("عرض الإلتزامات", { size: 14, color: INK, name: "Title" }), 86), { right: 1105.7, cy: 21.5 });
  await iconAt(s, "x", 14, INK, 31.6, 21.5);

  const tabs = autoLayout("HORIZONTAL", { name: "Filter tabs", paddingLeft: 3, paddingRight: 3, paddingTop: 2.5, paddingBottom: 2.5, cornerRadius: 9, counterAxisAlignItems: "CENTER" });
  tabs.fills = solid("#F8F8FA");
  for (const [label, count] of [["التزامات مشتركة", "11"], ["First Party", "6"], ["Second Party", "25"], ["الكل", "42"]]) {
    const inst = tabSet.children.find((v) => v.name === "Active=" + (label === activeTab ? "Yes" : "No")).createInstance();
    const props = {};
    for (const key of Object.keys(inst.componentProperties)) {
      if (key.startsWith("Label")) props[key] = label;
      if (key.startsWith("Count")) props[key] = count;
    }
    inst.setProperties(props);
    tabs.appendChild(inst);
  }
  place(s, tabs, 1111 - tabs.width, 69);

  const dl = autoLayout("HORIZONTAL", { name: "Download", itemSpacing: 5, paddingLeft: 9, paddingRight: 9, primaryAxisAlignItems: "CENTER", counterAxisAlignItems: "CENTER", cornerRadius: 6 });
  dl.fills = solid("#EEF0F3");
  dl.primaryAxisSizingMode = "FIXED";
  dl.counterAxisSizingMode = "FIXED";
  dl.resize(63.3, 23.1);
  dl.appendChild(fit(text("تحميل", { size: 12, color: INK }), 26));
  dl.appendChild(await icon("download", 12, INK));
  place(s, dl, 100.6, 76.3);
  const share = autoLayout("HORIZONTAL", { name: "Share", itemSpacing: 5, counterAxisAlignItems: "CENTER" });
  share.appendChild(fit(text("مشاركة", { size: 12, color: INK }), 36));
  share.appendChild(await icon("forward", 13, INK));
  place(s, share, 21.5, 86.4 - share.height / 2);

  const table = autoLayout("VERTICAL", { name: "Table" });
  table.counterAxisSizingMode = "FIXED";
  table.resize(1098.4, 40);
  const head = autoLayout("HORIZONTAL", { name: "Header row" });
  head.fills = solid("#F5F6F8");
  head.topLeftRadius = head.topRightRadius = 12;
  head.primaryAxisSizingMode = "FIXED";
  head.counterAxisSizingMode = "FIXED";
  head.resize(1098.4, 39.5);
  const heads = { Notes: "ملاحظات إضافية", Source: "مصدر الالتزام في العقد (مع الإشارة للصفحة)", Type: "نوع الالتزام", Description: "وصف موجز الالتزام", Party: "الطرف الملتزم" };
  for (let i = 0; i < COLS.length; i++) {
    const [name, , w] = COLS[i];
    const cell = autoLayout("HORIZONTAL", { name, paddingLeft: PAD, paddingRight: PAD, itemSpacing: 5, primaryAxisAlignItems: "MAX", counterAxisAlignItems: "CENTER" });
    cell.primaryAxisSizingMode = "FIXED";
    cell.resize(w, 39.5);
    if (i > 0) {
      cell.strokes = solid(LINE);
      cell.strokeTopWeight = 0; cell.strokeRightWeight = 0; cell.strokeBottomWeight = 0; cell.strokeLeftWeight = 1;
      cell.strokeAlign = "INSIDE";
    }
    if (name === "Description") cell.appendChild(await icon("info", 11, MUTED));
    cell.appendChild(text(heads[name], { size: HEAD, color: MUTED }));
    head.appendChild(cell);
    cell.layoutSizingVertical = "FILL";
  }
  table.appendChild(head);
  for (const [party, desc, source, notes] of rows) {
    const r = rowComp.createInstance();
    const props = {};
    for (const key of Object.keys(r.componentProperties)) {
      if (key.startsWith("Party")) props[key] = party;
      if (key.startsWith("Description")) props[key] = desc;
      if (key.startsWith("Source")) props[key] = source;
      if (key.startsWith("Notes")) props[key] = notes || "لا يوجد ملاحظات إضافية";
    }
    r.setProperties(props);
    if (notes) r.findOne((n) => n.name === "Notes text").fills = solid(INK);
    table.appendChild(r);
  }
  place(s, table, 15.8, 130);

  root.appendChild(s);
  s.x = x;
  s.y = y;
  await copyStyle(s, refId);
  return s.id;
}

const ids = {
  all: await buildScreen("Obligations – All", "الكل", SECOND, "1:9", 7, 3487),
  first: await buildScreen("Obligations – First Party", "First Party", FIRST, "1:8", 1194, 3487),
  second: await buildScreen("Obligations – Second Party", "Second Party", SECOND, "1:7", 2415, 3487),
};
return JSON.stringify({ ids, BODY, PARTY, HEAD });
