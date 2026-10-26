// Frame "39" (1920 x 1080): editor toolbar, sections column and tool rail on an empty canvas.
const INK = "#1F2533";
const BLUE = "#2C4FA5";
const TEXT2 = "#374151";
const NAME = "39";
const root = await figma.getNodeByIdAsync(ROOT_ID);

// Tall rail as it appears in this frame (in frame units).
const tallRail = await replaceComponent("Editor/Tool rail (tall)", async () => {
  const c = makeComponent("Editor/Tool rail (tall)", 75, 372, "#FFFFFF");
  c.cornerRadius = 18;
  stroke(c, "#F0F1F3", 1);
  shadow(c, { y: 4, blur: 16, opacity: 0.08 });
  place(c, rect("Active", 63, 62, "#F4F5FB", 10), 5, 154);
  const ys = [40, 112.5, 185, 257.5, 329.5];
  const names = ["users", "align-right", "logo-spark", "history", "chat-smile"];
  for (let i = 0; i < 5; i++) await iconAt(c, names[i], names[i] === "logo-spark" ? 32 : 28, names[i] === "logo-spark" ? null : INK, 36.5, ys[i]);
  await copyStyle(c, "1:19");
  return c;
});

const old = root.findChild((n) => n.name === NAME);
if (old) old.remove();
const f = frame(NAME, { clipsContent: true });
f.resize(1920, 1080);
f.fills = solid("#FEFEFC");

// Toolbar at 1.263x.
const tb = (await component("Editor/Toolbar")).createInstance();
f.appendChild(tb);
tb.rescale(1.263);
tb.x = -4.2;
tb.y = 6.1;

// Sections column at 1.5x, with its own copy of the zoom controls.
const col = frame("Sections column", { clipsContent: true });
col.resize(304, 1080);
col.fills = solid("#FFFFFF");
place(f, col, -6, 0);
const zoom = frame("Zoom controls");
zoom.resize(210, 60);
place(zoom, rect("Badge bg", 51, 31, "#F1F4FB", 6), 27, 14);
textAt(zoom, fit(text("28", { size: 13, color: BLUE, align: "CENTER", name: "Count" }), 12.5), { cx: 42, cy: 30 });
await iconAt(zoom, "list-checks", 16, BLUE, 62, 30);
await iconAt(zoom, "plus", 16, TEXT2, 105, 30);
await iconAt(zoom, "chevron-down", 10, "#6B7280", 134, 30);
textAt(zoom, fit(text("111%", { size: 13, color: TEXT2, align: "CENTER", name: "Zoom" }), 24.5), { cx: 157, cy: 30 });
await iconAt(zoom, "minus", 16, TEXT2, 193, 30);
col.appendChild(zoom);
zoom.rescale(1.5);
zoom.x = -9.5 + 6;
zoom.y = 52 - 45;
const sec = (await component("Editor/Sections")).createInstance();
col.appendChild(sec);
sec.resize(199, 653);
sec.rescale(1.5);
sec.x = -7 + 6;
sec.y = 100.5;

const rail = tallRail.createInstance();
place(f, rail, 1725, 355);

root.appendChild(f);
f.x = 101;
f.y = 0;
return JSON.stringify({ id: f.id });
