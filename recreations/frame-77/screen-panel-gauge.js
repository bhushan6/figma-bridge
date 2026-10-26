// Screens 1:14 (Low) and 1:11 (High): AI panel showing the compliance gauge.
const BLUE = "#2C4FA5";
const INK = "#1F2533";
const MUTED = "#6B7280";
const SURFACE = "#F8F8FA";
const root = await figma.getNodeByIdAsync(ROOT_ID);

async function buildPanel(status, name) {
  const p = frame(name, { clipsContent: true });
  p.resize(341, 630);
  p.fills = solid("#FFFFFF");

  const header = (await component("AI Panel/Header")).children.find((v) => v.name === "Tab=Analysis").createInstance();
  place(p, header, 0, 0);

  const gauge = (await component("AI Panel/Gauge card")).children.find((v) => v.name === "Status=" + status).createInstance();
  place(p, gauge, 14, 173);

  const last = autoLayout("HORIZONTAL", { name: "Last analysis", itemSpacing: 8, paddingRight: 11, primaryAxisAlignItems: "MAX", counterAxisAlignItems: "CENTER", cornerRadius: 10 });
  last.fills = solid(SURFACE);
  last.primaryAxisSizingMode = "FIXED";
  last.counterAxisSizingMode = "FIXED";
  last.resize(311, 36);
  last.appendChild(fit(text("آخر تحليل تم بتاريخ: 3 أكتوبر 2026", { size: 12.5, color: INK }), 160));
  last.appendChild(await icon("triangle-alert", 15, "#EAB308"));
  place(p, last, 14, 353);

  const btn = autoLayout("HORIZONTAL", { name: "Refresh analysis", itemSpacing: 6, primaryAxisAlignItems: "CENTER", counterAxisAlignItems: "CENTER", cornerRadius: 8 });
  btn.fills = solid(BLUE);
  btn.primaryAxisSizingMode = "FIXED";
  btn.counterAxisSizingMode = "FIXED";
  btn.resize(311, 31);
  btn.appendChild(fit(text("تحديث تحليل المستند", { size: 12.5, color: "#FFFFFF" }), 107));
  btn.appendChild(await icon("sparkles", 15, "#FFFFFF"));
  place(p, btn, 14, 400);

  textAt(p, fit(text("نتائج تحليل المستند", { size: 12.5, color: INK, name: "Results title" }), 95), { right: 309, cy: 465 });
  await iconAt(p, "info", 11, INK, 205, 465);

  const rows = [
    { label: "مخاطر قانونية", count: "3", color: "#D92D20", open: false, y: 484 },
    { label: "التزامات المستند", count: "42", color: "#2E90FA", open: true, y: 550 },
  ];
  for (const r of rows) {
    const row = (await component("AI Panel/Result row")).createInstance();
    const props = {};
    for (const key of Object.keys(row.componentProperties)) {
      if (key.startsWith("Label")) props[key] = r.label;
      if (key.startsWith("Count")) props[key] = r.count;
      if (key.startsWith("Show open icon")) props[key] = r.open;
    }
    row.setProperties(props);
    row.findOne((n) => n.name === "Accent").fills = solid(r.color);
    place(p, row, 14, r.y);
  }
  place(p, rect("Edge", 1, 630, "#EEF0F3"), 340, 0);
  return p;
}

const created = {};
for (const [status, name, x, y, w] of [
  ["Low", "AI Panel – Compliance Low", 2327, 1826, 486],
  ["High", "AI Panel – Compliance High", 3594, 1910, 486],
]) {
  const old = root.findChild((n) => n.name === name);
  if (old) old.remove();
  const p = await buildPanel(status, name);
  root.appendChild(p);
  p.rescale(w / 341);
  p.x = x;
  p.y = y;
  await copyStyle(p, status === "Low" ? "1:14" : "1:11");
  created[status] = p.id;
}
// The standalone High card is now part of the High panel.
const loose = await figma.getNodeByIdAsync("2:20");
if (loose) loose.remove();
return JSON.stringify(created);
