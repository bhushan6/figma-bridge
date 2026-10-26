// Group 76 (1:24): editor at 80% zoom with the AI chat panel. Screen is CSS 1500 x 760, shown at 1.7133x.
const INK = "#1F2533";
const MUTED = "#6B7280";
const LIGHT = "#9CA3AF";
const NAME = "Editor – Chat (80%)";
const root = await figma.getNodeByIdAsync(ROOT_ID);
const old = root.findChild((n) => n.name === NAME);
if (old) old.remove();

const group = frame(NAME, { clipsContent: false });
group.resize(2570, 1302);

const s = frame("Screen", { clipsContent: true });
s.resize(1500, 760);
s.fills = solid("#FFFFFF");

// Canvas and the page at 80%.
place(s, rect("Canvas", 951, 640, "#F9FAFB"), 199, 120);
const page = (await component("Document/Agreement page")).createInstance();
s.appendChild(page);
page.rescale(0.794);
page.x = 912.5 - (710 - 3.5) * 0.794;
page.y = 193 - (120.6 - 1) * 0.794;

// Chrome.
const top = (await component("Editor/Top bar")).createInstance();
place(s, top, 0, 0);
top.resize(1500, 60);
const edited = top.findOne((n) => n.name === "Last edited");
for (const seg of edited.getStyledTextSegments(["fontName"])) await figma.loadFontAsync(seg.fontName);
edited.characters = "آخر تعديل October 3";
edited.setRangeFontSize(0, 9, 10.5);
edited.setRangeFills(0, 9, solid(LIGHT));
edited.setRangeFontSize(9, edited.characters.length, 11.5);
edited.setRangeFills(9, edited.characters.length, solid(MUTED));
const bar = (await component("Editor/Toolbar")).createInstance();
place(s, bar, 0, 60);
bar.resize(1500, 60);
const zoom = bar.findOne((n) => n.name === "Zoom");
await figma.loadFontAsync(zoom.fontName);
zoom.characters = "80%";
const side = (await component("Editor/Sections")).createInstance();
place(s, side, 0, 120);
side.resize(199, 640);
place(s, (await component("Editor/Tool rail")).createInstance(), 1098, 291);

// ---------- AI panel: chat, empty state ----------
const panel = frame("AI Panel – Chat", { clipsContent: true });
panel.resize(350, 640);
panel.fills = solid("#FFFFFF");
place(s, panel, 1150, 120);
const PX = 1150, PY = 120;
const header = (await component("AI Panel/Header")).children.find((v) => v.name === "Tab=Chat").createInstance();
place(panel, header, 1153 - PX, 117 - PY);

const empty = autoLayout("VERTICAL", { name: "Empty state", itemSpacing: 8, counterAxisAlignItems: "CENTER" });
empty.appendChild(await icon("logo-spark", 26));
const hello = fit(text("أهلاً Sandesh، كيف أستطيع مساعدتك اليوم؟", { size: 14, weight: "Medium", color: INK, align: "CENTER", name: "Greeting" }), 254);
empty.appendChild(hello);
empty.appendChild(fit(text("اكتب ما تحتاج إليه، صياغة عقد أو استفسار قانوني، وسأتولى تنفيذه\nوفق الأنظمة السعودية المعتمدة", { size: 12, color: LIGHT, align: "CENTER", lineHeight: 20, name: "Hint" }), 309));
place(panel, empty, 1322 - PX - empty.width / 2, 410 - PY);

const input = frame("Message input", { clipsContent: true });
input.resize(340, 130);
input.fills = solid("#FFFFFF");
input.cornerRadius = 18;
stroke(input, "#F0F1F3", 1);
shadow(input, { y: -2, blur: 12, opacity: 0.06 });
place(panel, input, 1152 - PX, 652 - PY);
textAt(input, fit(text("اكتب طلبك وسنفهمه تلقائياً...", { size: 13, color: MUTED, name: "Placeholder" }), 162), { right: 320, cy: 25 });
const send = figma.createEllipse(); send.name = "Send"; send.resize(22, 22); send.fills = solid("#F3F4F6");
place(input, send, 22, 81);
const arrow = svg(`<svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="${LIGHT}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>`, "icon/arrow-up");
place(input, arrow, 27, 86);

group.appendChild(s);
s.rescale(2570 / 1500);
s.x = 0;
s.y = 0;
await copyStyle(s, "1:25");
// The original group covers the screenshot's scrollbar with a white strip.
place(group, rect("Rectangle 111", 11.99, 109.64, "#FFFFFF"), 2557.74, 0);

root.appendChild(group);
group.x = 0;
group.y = 4894;
return JSON.stringify({ id: group.id, screen: s.id });
