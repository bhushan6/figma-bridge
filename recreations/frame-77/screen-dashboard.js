// Group 90 (1:27): "My contracts" dashboard, built in the group's own units (2398 x 1211).
const INK = "#1F2533";
const TEXT2 = "#374151";
const MUTED = "#6B7280";
const LIGHT = "#9CA3AF";
const BLUE = "#2350AE";
const LINE = "#F0F1F3";
const NAME = "Contracts dashboard";
const root = await figma.getNodeByIdAsync(ROOT_ID);

// ---------- Status component (dots + label) ----------
async function buildStatus(name, dots, label) {
  const c = figma.createComponent();
  c.name = "Status=" + name;
  c.layoutMode = "VERTICAL";
  c.primaryAxisSizingMode = "AUTO";
  c.counterAxisSizingMode = "AUTO";
  c.counterAxisAlignItems = "MAX";
  c.itemSpacing = 6;
  c.fills = [];
  const row = autoLayout("HORIZONTAL", { name: "Steps", itemSpacing: 4.5 });
  for (const d of dots) {
    const e = figma.createEllipse();
    e.resize(15, 15);
    if (d === "fill") { e.name = "Done"; e.fills = solid(BLUE); }
    else if (d === "ring") { e.name = "Current"; e.fills = solid("#FFFFFF"); stroke(e, BLUE, 3.5); }
    else if (d === "red") { e.name = "Rejected"; e.fills = solid("#FFFFFF"); stroke(e, "#DC2626", 3.5); }
    else { e.name = "Pending"; e.fills = solid("#E5E7EB"); }
    row.appendChild(e);
  }
  c.appendChild(row);
  const key = c.addComponentProperty("Label", "TEXT", label);
  const t = text(label, { size: 14, color: MUTED, name: "Label" });
  c.appendChild(t);
  t.componentPropertyReferences = { characters: key };
  return c;
}
const statusSet = await replaceComponent("Contracts/Status", async () => {
  const set = figma.combineAsVariants([
    await buildStatus("Completed", ["fill", "fill", "fill"], "مكتمل"),
    await buildStatus("Rejected", ["light", "red", "fill"], "تم الرفض"),
    await buildStatus("Awaiting signature", ["light", "ring", "fill"], "في انتظار توقيع : Omar mohammed"),
    await buildStatus("Draft", ["light", "light", "ring"], "مسودة"),
  ], figma.currentPage);
  set.name = "Contracts/Status";
  set.layoutMode = "HORIZONTAL";
  set.itemSpacing = 24;
  set.primaryAxisSizingMode = "AUTO";
  set.counterAxisSizingMode = "AUTO";
  return set;
});

// ---------- Secondary button ----------
const button = await replaceComponent("Button/Secondary", async () => {
  const c = figma.createComponent();
  c.name = "Button/Secondary";
  c.layoutMode = "HORIZONTAL";
  c.primaryAxisAlignItems = "CENTER";
  c.counterAxisAlignItems = "CENTER";
  c.resize(138, 44);
  c.cornerRadius = 10;
  c.fills = solid("#FFFFFF");
  stroke(c, "#E5E7EB", 1.2);
  const key = c.addComponentProperty("Label", "TEXT", "عرض");
  const t = text("عرض", { size: 15, weight: "Medium", color: INK, name: "Label" });
  c.appendChild(t);
  t.componentPropertyReferences = { characters: key };
  return c;
});

// ---------- Screen ----------
const old = root.findChild((n) => n.name === NAME);
if (old) old.remove();
const s = frame(NAME, { clipsContent: true });
s.resize(2398, 1211);
s.fills = solid("#FFFFFF");
const T = (chars, w, opts = {}) => fit(text(chars, { size: 16, color: TEXT2, ...opts }), w);

// Top strip
await iconAt(s, "globe", 22, BLUE, 58, 32);
textAt(s, T("English", 63, { color: TEXT2, align: "LEFT" }), { left: 77.5, cy: 30 });
await iconAt(s, "panel-right", 22, MUTED, 2061, 32);
hline(s, 0, 2100, 70, LINE);

// Sidebar
vline(s, 2100, 0, 1211, LINE);
await iconAt(s, "qanoniah", 30, null, 2362, 38);
textAt(s, T("قانونية", 66, { weight: "Bold", color: "#1E3A8A", size: 24 }), { right: 2346, cy: 30 });
textAt(s, T("Qanoniah", 66, { weight: "SemiBold", color: "#1E3A8A", size: 13, align: "LEFT" }), { left: 2281, cy: 54 });
const create = autoLayout("HORIZONTAL", { name: "Create", itemSpacing: 10, primaryAxisAlignItems: "CENTER", counterAxisAlignItems: "CENTER", cornerRadius: 9 });
create.fills = solid(BLUE);
create.primaryAxisSizingMode = "FIXED";
create.counterAxisSizingMode = "FIXED";
create.resize(252, 49);
shadow(create, { y: 4, blur: 12, opacity: 0.12 });
create.appendChild(T("إنشاء", 40, { color: "#FFFFFF" }));
create.appendChild(await icon("plus", 20, "#FFFFFF"));
place(s, create, 2125, 98);
for (const [label, iconName, cy, w] of [["الرئيسية", "home", 211, 60], ["عقودي", "files", 274, 55], ["القوالب", "file", 337, 56]]) {
  await iconAt(s, iconName, 22, MUTED, 2352, cy);
  textAt(s, T(label, w), { right: 2327, cy });
}
hline(s, 2100, 2398, 380, LINE);
for (const [label, cy, w, plus] of [["المفضلة", 410, 62, false], ["المجلدات", 464, 72, true], ["المشاريع", 528, 64, true]]) {
  await iconAt(s, "chevron-down", 16, MUTED, 2368, cy);
  textAt(s, T(label, w, { color: MUTED }), { right: 2349, cy });
  if (plus) await iconAt(s, "plus", 16, MUTED, 2132, cy - 3);
}
hline(s, 2100, 2398, 813, LINE);
await iconAt(s, "grid", 18, MUTED, 2375, 845);
textAt(s, T("منتجات قانونية", 114, { color: MUTED }), { right: 2355, cy: 845 });
await iconAt(s, "logo-spark", 22, null, 2373, 912);
textAt(s, T("قانونية AI", 58, { size: 14 }), { right: 2351, cy: 912 });
await iconAt(s, "chevron-left", 16, LIGHT, 2130, 913);
await iconAt(s, "qanoniah", 20, null, 2373, 970);
textAt(s, T("محرك البحث القانوني", 130, { size: 14 }), { right: 2351, cy: 970 });
await iconAt(s, "chevron-left", 16, LIGHT, 2130, 970);
await iconAt(s, "qanoniah", 20, null, 2373, 1026);
textAt(s, T("قانونية CLM", 76, { size: 14 }), { right: 2351, cy: 1026 });
const current = autoLayout("HORIZONTAL", { name: "Current", paddingLeft: 13, paddingRight: 13, primaryAxisAlignItems: "CENTER", counterAxisAlignItems: "CENTER", cornerRadius: 14 });
current.fills = solid("#E7F6EC");
current.counterAxisSizingMode = "FIXED";
current.resize(60, 29);
current.appendChild(T("الحالي", 33, { size: 13, color: "#16A34A" }));
place(s, current, 2120, 1013);
hline(s, 2100, 2398, 1065, LINE);
await iconAt(s, "monitor-chat", 22, MUTED, 2366, 1104);
textAt(s, text("الدعم الفني", { size: 17, color: TEXT2 }), { right: 2318, cy: 1104 });
const av = figma.createEllipse(); av.name = "Avatar"; av.resize(36, 36); av.fills = solid("#F3F4F6");
place(s, av, 2342, 1158);
await iconAt(s, "user", 18, MUTED, 2360, 1176);
textAt(s, T("حسن", 46, { color: LIGHT, size: 18 }), { right: 2297, cy: 1150 });
textAt(s, T("...galya@gmail.com", 88.6, { color: LIGHT, size: 11, align: "LEFT" }), { left: 2185, cy: 1186 });
await iconAt(s, "settings", 22, BLUE, 2140, 1177);

// Page header
await iconAt(s, "files", 30, MUTED, 2030, 124);
textAt(s, T("عقودي", 72, { size: 24, weight: "Medium", color: INK }), { right: 1996, cy: 124 });
const upload = autoLayout("HORIZONTAL", { name: "Upload multiple", itemSpacing: 10, primaryAxisAlignItems: "CENTER", counterAxisAlignItems: "CENTER", cornerRadius: 7 });
upload.fills = solid("#FFFFFF");
stroke(upload, "#E5E7EB", 1.2);
upload.primaryAxisSizingMode = "FIXED";
upload.counterAxisSizingMode = "FIXED";
upload.resize(246, 48);
upload.appendChild(T("رفع مستندات متعددة", 165, { color: INK }));
upload.appendChild(await icon("plus", 18, INK));
place(s, upload, 1652, 101.5);
const search = frame("Search");
search.resize(279, 55);
search.fills = solid("#FFFFFF");
search.cornerRadius = 9;
stroke(search, "#E5E7EB", 1.2);
place(s, search, 180, 98);
await iconAt(search, "search", 22, MUTED, 254, 27);
textAt(search, T("بحث", 42.5, { color: LIGHT, size: 18 }), { right: 227, cy: 26 });
await iconAt(s, "inbox", 24, MUTED, 141, 125);
const filter = rect("Filter", 51, 50, BLUE, 7);
place(s, filter, 52, 100);
await iconAt(s, "filter", 22, "#FFFFFF", 78, 125);
const badge = figma.createEllipse(); badge.name = "Filter count"; badge.resize(30, 30); badge.fills = solid("#FFFFFF"); stroke(badge, "#E5E7EB", 1);
place(s, badge, 88, 83);
textAt(s, T("1", 8, { size: 16, color: INK, align: "CENTER" }), { cx: 103, cy: 97 });

// View tabs
place(s, rect("Tab track", 2047, 5, LINE, 2.5), 26, 230);
place(s, rect("Active tab", 101, 5, BLUE, 2.5), 1946, 229.5);
await iconAt(s, "table", 22, BLUE, 2022, 200);
textAt(s, T("قائمة", 42, { color: BLUE, weight: "Medium" }), { right: 2001, cy: 199 });
await iconAt(s, "columns", 22, MUTED, 1870, 199);
textAt(s, T("كروت", 42, { color: MUTED }), { right: 1846, cy: 199 });

// Table (the original composite leaves a gap between the title column and the rest)
const HEAD_Y = 264, HEAD_H = 58, ROW0 = 360.6, STEP = 82.3;
place(s, rect("Header", 1223, HEAD_H, "#F8F9FB", 0), 25, HEAD_Y);
place(s, rect("Header", 378, HEAD_H, "#F8F9FB", 0), 1694, HEAD_Y);
const colLines = [280, 531, 697, 894, 1189];
for (const x of colLines) vline(s, x, HEAD_Y, 1211, LINE);
const heads = [["اخر نشاط", 497, 68], ["تاريخ الانشاء", 665, 88], ["المشاركين", 861, 76], ["الحالة", 1156, 44], ["عنوان المستند", 2038, 105]];
for (const [label, right, w] of heads) textAt(s, T(label, w, { color: MUTED, size: 17 }), { right, cy: 293 });

const STATUS_LABELS = { Completed: "مكتمل", Rejected: "تم الرفض", "Awaiting signature": "في انتظار توقيع : Omar mohammed", Draft: "مسودة" };
const ROWS = [
  ["اتفاقية سرية المعلومات", "Completed", null, 1, "2 أغسطس 2026", "منذ 7 أيام", "تحميل"],
  ["تكليف الموظف حامد الخالدي", "Rejected", null, 1, "2 أغسطس 2026", "منذ 7 أيام", "عرض"],
  ["قرارات مجلس الإدارة", "Awaiting signature", null, 2, "2 أغسطس 2026", "منذ 7 أيام", "عرض"],
  ["اتفاقية سرية المعلومات", "Completed", null, 1, "2 أغسطس 2026", "منذ 7 أيام", "تحميل"],
  ["اتفاقية سرية المعلومات", "Completed", null, 1, "23 يوليو 2026", "منذ 17 يومًا", "تحميل"],
  ["عقد إيجار عقار", "Draft", null, 0, "23 يوليو 2026", "منذ 17 يومًا", "عرض"],
  ["اتفاقية عدم إفصاح", "Draft", null, 0, "21 يوليو 2026", null, "عرض"],
  ["اتفاقية سرية المعلومات", "Draft", null, 1, "20 يوليو 2026", null, "عرض"],
  ["عقد مع المستشارين والخبراء لأداء خدمة معينة", "Draft", null, 0, "15 يوليو 2026", null, "عرض"],
  ["اتفاقية سرية المعلومات", "Draft", null, 1, "15 يوليو 2026", null, "عرض"],
  ["اتفاقية سرية المعلومات", "Draft", null, 0, "15 يوليو 2026", null, "عرض"],
];
const titleSize = fit(text("اتفاقية سرية المعلومات", { size: 16, weight: "Medium" }), 148);
const TITLE = titleSize.fontSize; titleSize.remove();
const dateProbe = fit(text("2 أغسطس 2026", { size: 16 }), 112);
const BODY = dateProbe.fontSize; dateProbe.remove();

async function personChip(cx, cy) {
  const e = figma.createEllipse(); e.name = "Person"; e.resize(32, 32); e.fills = solid("#F5F6F8");
  place(s, e, cx - 16, cy - 16);
  await iconAt(s, "user", 15, MUTED, cx, cy);
}
for (let i = 0; i < ROWS.length; i++) {
  const [title, status, , people, created, activity, action] = ROWS[i];
  const cy = ROW0 + STEP * i;
  if (i > 0) {
    hline(s, 25, 1248, cy - STEP / 2, LINE);
    hline(s, 1694, 2072, cy - STEP / 2, LINE);
  }
  textAt(s, text(title, { size: TITLE, weight: "Medium", color: INK }), { right: 2049, cy });
  const st = statusSet.children.find((v) => v.name === "Status=" + status).createInstance();
  // Variants share one text property, so set each label explicitly.
  const labelKey = Object.keys(st.componentProperties).find((k) => k.startsWith("Label"));
  st.setProperties({ [labelKey]: STATUS_LABELS[status] });
  place(s, st, 1166 - st.width, cy - 15.6 - 7.5);
  if (people === 0) textAt(s, text("-", { size: BODY, color: MUTED }), { cx: 870, cy });
  if (people >= 1) await personChip(862, cy);
  if (people === 2) await personChip(838, cy);
  textAt(s, text(created, { size: BODY, color: INK }), { right: 677, cy });
  if (activity) {
    await personChip(490, cy);
    textAt(s, text(activity, { size: BODY * 0.95, color: INK }), { right: 458, cy });
  } else {
    textAt(s, text("-", { size: BODY, color: LIGHT }), { cx: 498, cy });
  }
  const b = button.createInstance();
  const key = Object.keys(b.componentProperties).find((k) => k.startsWith("Label"));
  b.setProperties({ [key]: action });
  place(s, b, 118, cy - 22);
  await iconAt(s, "more-vertical", 22, TEXT2, 69, cy);
}

root.appendChild(s);
s.x = 3204;
s.y = 4894;
await copyStyle(s, "1:28");
s.effects = (await figma.getNodeByIdAsync("1:27")).effects;
return JSON.stringify({ id: s.id, TITLE, BODY });
