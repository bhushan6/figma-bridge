// Screen 1:10 — editor's History panel (versions tab). CSS 329.5 x 768, shown at 1.5235x.
const INK = "#1F2533";
const MUTED = "#6B7280";
const LIGHT = "#9CA3AF";
const BLUE = "#2C4FA5";
const NAME = "History – Versions";
const root = await figma.getNodeByIdAsync(ROOT_ID);

// ---------- Version card component ----------
const card = await replaceComponent("History/Version card", async () => {
  const c = makeComponent("History/Version card", 295, 74, "#F8F9FB");
  c.cornerRadius = 10;
  const titleKey = c.addComponentProperty("Title", "TEXT", "22. الإصدار الثاني والعشرون");
  const nameKey = c.addComponentProperty("Author", "TEXT", "Sandesh Kanawade");
  const dateKey = c.addComponentProperty("Date", "TEXT", "28 سبتمبر 2026");
  const timeKey = c.addComponentProperty("Time", "TEXT", "08:33 م");
  const currentKey = c.addComponentProperty("Current version", "BOOLEAN", false);

  const title = textAt(c, fit(text("22. الإصدار الثاني والعشرون", { size: 13, color: INK, name: "Title" }), 129), { right: 281.3, cy: 13.4 });
  title.componentPropertyReferences = { characters: titleKey };

  const badge = autoLayout("HORIZONTAL", { name: "Current badge", itemSpacing: 4, counterAxisAlignItems: "CENTER" });
  badge.appendChild(fit(text("الإصدار الحالي", { size: 11, color: "#16A34A", name: "Badge label" }), 55));
  const dot = figma.createEllipse(); dot.name = "Dot"; dot.resize(6, 6); dot.fills = solid("#16A34A");
  badge.appendChild(dot);
  place(c, badge, 14.8, 13.4 - badge.height / 2);
  badge.componentPropertyReferences = { visible: currentKey };

  const av = figma.createEllipse(); av.name = "Avatar"; av.resize(23.6, 23.6); av.fills = solid("#FFFFFF"); stroke(av, "#EEF0F3", 1);
  place(c, av, 269.8 - 11.8, 48.6 - 11.8);
  await iconAt(c, "user", 13, MUTED, 269.8, 48.6);
  const author = textAt(c, fit(text("Sandesh Kanawade", { size: 13, color: MUTED, name: "Author" }), 113.2), { right: 249.4, cy: 48.6 });
  author.componentPropertyReferences = { characters: nameKey };
  const date = textAt(c, fit(text("28 سبتمبر 2026", { size: 11.5, color: "#374151", name: "Date", align: "LEFT" }), 65.3), { left: 14.8, cy: 40.4 });
  date.componentPropertyReferences = { characters: dateKey };
  const time = textAt(c, fit(text("08:33 م", { size: 11, color: LIGHT, name: "Time", align: "LEFT" }), 32.8), { left: 14.8, cy: 55.2 });
  time.componentPropertyReferences = { characters: timeKey };
  return c;
});

// ---------- Screen ----------
const old = root.findChild((n) => n.name === NAME);
if (old) old.remove();
const s = frame(NAME, { clipsContent: true });
s.resize(329.5, 768);
s.fills = solid("#FFFFFF");

const tbar = (await component("Editor/Top bar")).createInstance();
place(s, tbar, -1167.5, 5.4);
tbar.findOne((n) => n.name === "Document title").visible = false;
textAt(s, fit(text("اتفاقية تقديم خدمات الـ..", { size: 13, color: "#374151", name: "Document title" }), 117.3), { right: 261.6, cy: 34.4 });
const tools = (await component("Editor/Toolbar")).createInstance();
place(s, tools, -1168.2, 66.4);
const style = tools.findOne((n) => n.name === "Text style value");
await figma.loadFontAsync(style.fontName);
style.characters = "نص عادي";
hline(s, 0, 329.5, 3.5, "#E5E7EB");
place(s, rect("Canvas edge", 4, 650, "#F0F1F3"), 0, 126);

textAt(s, fit(text("السجل", { size: 15, color: INK, name: "Title" }), 39.4), { right: 312, cy: 160.3 });
textAt(s, fit(text("مراجعة الأنشطة على المستندات وحالات الإصدارات", { size: 12.5, color: MUTED, name: "Subtitle" }), 242), { right: 312, cy: 189.7 });

place(s, rect("Tabs", 296, 39.5, "#F8F8FA", 10), 17, 228);
const pill = rect("Active tab", 144.5, 31, "#FFFFFF", 8);
shadow(pill, { y: 1, blur: 3, opacity: 0.12 });
place(s, pill, 20.3, 232.4);
textAt(s, fit(text("الإصدارات", { size: 13, color: BLUE, align: "CENTER", name: "Versions tab" }), 48), { cx: 92.5, cy: 246 });
textAt(s, fit(text("الأنشطة", { size: 13, color: INK, align: "CENTER", name: "Activity tab" }), 37.7), { cx: 237, cy: 246 });

const versions = [
  ["22. الإصدار الثاني والعشرون", "08:33 م", true],
  ["21. الإصدار الحادي والعشرون", "08:33 م", false],
  ["20. الإصدار العشرون", "08:33 م", false],
  ["19. الإصدار التاسع عشر", "01:18 ص", false],
  ["18. الإصدار الثامن عشر", "01:18 ص", false],
  ["17. الإصدار السابع عشر", "01:18 ص", false],
];
for (let i = 0; i < versions.length; i++) {
  const [title, time, current] = versions[i];
  const inst = card.createInstance();
  const props = {};
  for (const key of Object.keys(inst.componentProperties)) {
    if (key.startsWith("Title")) props[key] = title;
    if (key.startsWith("Time")) props[key] = time;
    if (key.startsWith("Current version")) props[key] = current;
  }
  inst.setProperties(props);
  place(s, inst, 16.4, 296 + 86.6 * i);
}

root.appendChild(s);
s.rescale(1.5235);
s.x = 4216;
s.y = 1805;
await copyStyle(s, "1:10");
return JSON.stringify({ id: s.id, w: s.width, h: s.height });
