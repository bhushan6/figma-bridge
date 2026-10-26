// AI panel components (CSS px; panel content is 311 wide).
const BLUE = "#2C4FA5";
const INK = "#1F2533";
const MUTED = "#6B7280";
const PURPLE = "#9B27F5";
const SURFACE = "#F8F8FA";
const out = {};

// ---------- Header: logo, subtitle, tabs ----------
async function buildHeader(active) {
  const c = makeComponent("Tab=" + active, 341, 152, "#FFFFFF");
  await iconAt(c, "logo-spark", 21, null, 317, 30);
  const logo = text("قانونية AI", { size: 12, weight: "Bold", color: "#1E2A6E", name: "Logo" });
  logo.setRangeFontName(8, 10, F.serifBold);
  fit(logo, 36);
  textAt(c, logo, { right: 309, cy: 38 });
  textAt(c, fit(text("مساعد ذكي يساعدك على العمل على العقود واتخاذ قرارات قانونية\nدقيقة", { size: 12.5, color: MUTED, lineHeight: 20, name: "Subtitle" }), 304), { right: 325, cy: 71 });

  const tabs = rect("Tabs", 311, 44, SURFACE, 10);
  place(c, tabs, 14, 105);
  const pill = rect("Active tab", 151, 36, "#FFFFFF", 8);
  shadow(pill, { y: 1, blur: 3, opacity: 0.12 });
  place(c, pill, active === "Analysis" ? 170 : 18, 109);

  const analysisColor = active === "Analysis" ? PURPLE : "#4B5563";
  const chatColor = active === "Chat" ? PURPLE : "#4B5563";
  await iconAt(c, "analysis", 15, analysisColor, 262, 127);
  textAt(c, text("تحليل", { size: 12.5, color: analysisColor, name: "Analysis tab" }), { right: 249, cy: 127 });
  await iconAt(c, "chat-spark", 15, chatColor, 113, 126);
  textAt(c, text("دردشة", { size: 12.5, color: chatColor, name: "Chat tab" }), { right: 100, cy: 126 });
  return c;
}
out.header = (await replaceComponent("AI Panel/Header", async () => {
  const a = await buildHeader("Analysis");
  const b = await buildHeader("Chat");
  const set = figma.combineAsVariants([a, b], figma.currentPage);
  set.name = "AI Panel/Header";
  set.layoutMode = "VERTICAL";
  set.itemSpacing = 24;
  set.primaryAxisSizingMode = "AUTO";
  set.counterAxisSizingMode = "AUTO";
  return set;
})).id;

// ---------- Gauge card ----------
function arcPath(cx, cy, r, from, to) {
  const pt = (deg) => {
    const a = (deg * Math.PI) / 180;
    return [(cx + r * Math.cos(a)).toFixed(2), (cy - r * Math.sin(a)).toFixed(2)];
  };
  const [x1, y1] = pt(from);
  const [x2, y2] = pt(to);
  return `M${x1} ${y1} A${r} ${r} 0 0 1 ${x2} ${y2}`;
}
function needle(hub, tip, base, end) {
  const len = Math.hypot(tip[0] - hub[0], tip[1] - hub[1]);
  const px = -(tip[1] - hub[1]) / len, py = (tip[0] - hub[0]) / len;
  const pts = [
    [hub[0] + px * base, hub[1] + py * base],
    [tip[0] + px * end, tip[1] + py * end],
    [tip[0] - px * end, tip[1] - py * end],
    [hub[0] - px * base, hub[1] - py * base],
  ].map((p) => p.map((v) => v.toFixed(2)).join(" "));
  return `M${pts.join(" L")} Z`;
}

async function buildLow() {
  const c = makeComponent("Status=Low", 311, 156, SURFACE);
  stroke(c, "#EEEFF2", 1);
  // Gauge drawn in card coordinates.
  const cx = 65, cy = 98, r = 47.5, sw = 9, cap = 5.4;
  const hub = [66, 95.75], tip = [90.5, 84];
  const gauge = svg(
    `<svg width="311" height="156" viewBox="0 0 311 156" xmlns="http://www.w3.org/2000/svg">` +
      `<path d="${arcPath(cx, cy, r, 180 - cap, 125 + cap)}" stroke="#4CC25A" stroke-width="${sw}" stroke-linecap="round" fill="none"/>` +
      `<path d="${arcPath(cx, cy, r, 121 - cap, 60 + cap)}" stroke="#F2A20C" stroke-width="${sw}" stroke-linecap="round" fill="none"/>` +
      `<path d="${arcPath(cx, cy, r, 56 - cap, 0 + cap)}" stroke="#E5484D" stroke-width="${sw}" stroke-linecap="round" fill="none"/>` +
      `<path d="${needle(hub, tip, 2.6, 1.3)}" fill="#4B5263"/>` +
      `<circle cx="${tip[0]}" cy="${tip[1]}" r="1.3" fill="#4B5263"/>` +
      `<circle cx="${hub[0]}" cy="${hub[1]}" r="8" fill="#4B5263"/>` +
      `<circle cx="${hub[0]}" cy="${hub[1]}" r="2.5" fill="#FFFFFF"/></svg>`,
    "Gauge"
  );
  ["Segment / Low", "Segment / Medium", "Segment / High", "Needle", "Needle tip", "Hub", "Hub center"].forEach((n, i) => gauge.children[i] && (gauge.children[i].name = n));
  place(c, gauge, 0, 0);
  textAt(c, fit(text("مؤشر الامتثال القانوني", { size: 11.5, color: INK, name: "Title" }), 101), { right: 297, cy: 24 });
  await iconAt(c, "info", 11, INK, 186, 25);
  textAt(c, fit(text("منخفض", { size: 16, color: "#DC2626", name: "Status" }), 61), { right: 297, cy: 55 });
  textAt(c, fit(text("مخالفات جوهرية للأنظمة تؤثر\nعلى نفاذ العقد. يلزم معالجتها قبل\nالإرسال.", { size: 11.5, color: MUTED, lineHeight: 20, name: "Description" }), 158), { right: 297, cy: 109 });
  return c;
}

out.gauge = (await replaceComponent("AI Panel/Gauge card", async () => {
  const low = await buildLow();
  // High: the card approved earlier (scaled to the panel width when the set was first built).
  const prevSet = (await libFrame()).findChild((n) => n.name === "AI Panel/Gauge card");
  const high = prevSet.children.find((v) => v.name === "Status=High").clone();
  figma.currentPage.appendChild(high);
  const set = figma.combineAsVariants([low, high], figma.currentPage);
  set.name = "AI Panel/Gauge card";
  set.layoutMode = "HORIZONTAL";
  set.itemSpacing = 24;
  set.primaryAxisSizingMode = "AUTO";
  set.counterAxisSizingMode = "AUTO";
  return set;
})).id;

// ---------- Result row (collapsible category with count) ----------
out.result = (await replaceComponent("AI Panel/Result row", async () => {
  const c = makeComponent("AI Panel/Result row", 311, 57, SURFACE);
  c.cornerRadius = 10;
  stroke(c, "#F0F1F3", 1);
  const labelKey = c.addComponentProperty("Label", "TEXT", "مخاطر قانونية");
  const countKey = c.addComponentProperty("Count", "TEXT", "3");
  const openKey = c.addComponentProperty("Show open icon", "BOOLEAN", false);

  const bar = rect("Accent", 2.5, 19, "#D92D20", 1.25);
  place(c, bar, 296, 19);
  const label = textAt(c, fit(text("مخاطر قانونية", { size: 12.5, color: INK, name: "Label" }), 67), { right: 282, cy: 28 });
  label.componentPropertyReferences = { characters: labelKey };

  const badge = autoLayout("HORIZONTAL", { name: "Count", paddingLeft: 6, paddingRight: 6, primaryAxisAlignItems: "CENTER", counterAxisAlignItems: "CENTER", cornerRadius: 5 });
  badge.fills = solid("#FFFFFF");
  stroke(badge, "#E5E7EB", 1);
  badge.counterAxisSizingMode = "FIXED";
  badge.resize(21, 21);
  badge.primaryAxisSizingMode = "AUTO";
  const count = text("3", { size: 12.5, color: MUTED, align: "CENTER", name: "Count value" });
  badge.appendChild(count);
  place(c, badge, 37, 18);
  count.componentPropertyReferences = { characters: countKey };

  const open = await iconAt(c, "open-in", 14, BLUE, 76, 28.5);
  open.componentPropertyReferences = { visible: openKey };
  await iconAt(c, "chevron-down", 11, MUTED, 21, 28.5);
  return c;
})).id;

// ---------- Category row (summary list: label + accent bar) ----------
out.category = (await replaceComponent("AI Panel/Category row", async () => {
  const c = makeComponent("AI Panel/Category row", 285, 48, null);
  const labelKey = c.addComponentProperty("Label", "TEXT", "مخاطر قانونية");
  const bar = rect("Accent", 2, 18, "#D92D20", 1);
  place(c, bar, 283, 15);
  const label = textAt(c, fit(text("مخاطر قانونية", { size: 12.5, color: INK, name: "Label" }), 66.5), { right: 268, cy: 24 });
  label.componentPropertyReferences = { characters: labelKey };
  return c;
})).id;

return JSON.stringify(out);
