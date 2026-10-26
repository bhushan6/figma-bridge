// SimpleDocs "Home" screen recreated from the screenshot node 41:2675 (1299x770, app window 1280x766 at 8,2.5).
// Coordinates are measured in screenshot CSS px minus the window origin. Run with ./run.sh home.js
const REF_ID = "41:2675";
const NAME = "SimpleDocs Home – Recreated";

// ---------- helpers ----------
const hex = (h) => ({ r: parseInt(h.slice(1, 3), 16) / 255, g: parseInt(h.slice(3, 5), 16) / 255, b: parseInt(h.slice(5, 7), 16) / 255 });
const solid = (h, opacity) => [opacity === undefined ? { type: "SOLID", color: hex(h) } : { type: "SOLID", color: hex(h), opacity }];
const shadow = (node, list) => {
  node.effects = list.map(({ x = 0, y = 1, blur = 3, spread = 0, color = "#101828", opacity = 0.08 }) => ({
    type: "DROP_SHADOW", color: { ...hex(color), a: opacity }, offset: { x, y }, radius: blur, spread, visible: true, blendMode: "NORMAL",
  }));
  return node;
};
const border = (node, color, weight = 1) => { node.strokes = solid(color); node.strokeWeight = weight; node.strokeAlign = "INSIDE"; return node; };

const SANS = "Figtree";
const SERIF = "Source Serif 4";
const fonts = [[SANS, "Light"], [SANS, "Regular"], [SANS, "Medium"], [SANS, "SemiBold"], [SANS, "Bold"], [SERIF, "SemiBold Italic"]];
await Promise.all(fonts.map(([family, style]) => figma.loadFontAsync({ family, style })));

function text(chars, { size = 14, weight = "Regular", color = "#2C2B30", family = SANS, ls = 0, name } = {}) {
  const t = figma.createText();
  t.fontName = { family, style: weight };
  t.fontSize = size;
  t.characters = chars;
  t.fills = solid(color);
  if (ls) t.letterSpacing = { unit: "PIXELS", value: ls };
  t.name = name || chars;
  return t;
}
// Scale a text's font size so its width matches a measured width.
function fit(t, w) {
  t.fontSize = Math.round(t.fontSize * (w / t.width) * 4) / 4;
  return t;
}
function frame(name, props = {}) {
  const f = figma.createFrame();
  f.name = name;
  f.fills = [];
  f.clipsContent = false;
  Object.assign(f, props);
  return f;
}
function autoLayout(name, direction, props = {}) {
  const f = frame(name);
  f.layoutMode = direction;
  f.primaryAxisSizingMode = "AUTO";
  f.counterAxisSizingMode = "AUTO";
  if (direction === "HORIZONTAL") f.counterAxisAlignItems = "CENTER";
  Object.assign(f, props);
  return f;
}
function place(parent, node, x, y) {
  parent.appendChild(node);
  node.x = x;
  node.y = y;
  return node;
}
// Left edge at x, vertical centre at cy.
function placeMid(parent, node, x, cy) {
  return place(parent, node, x, cy - node.height / 2);
}
function add(parent, node, { fillH = false, grow = 0 } = {}) {
  parent.appendChild(node);
  if (fillH) node.layoutSizingHorizontal = "FILL";
  if (grow) node.layoutGrow = grow;
  return node;
}
function icon(name, size, body, { w = size, h = size, view = "0 0 24 24", fill = "none" } = {}) {
  const n = figma.createNodeFromSvg(`<svg width="${w}" height="${h}" viewBox="${view}" fill="${fill}" xmlns="http://www.w3.org/2000/svg">${body}</svg>`);
  n.name = "Icon/" + name;
  n.fills = [];
  return n;
}
const strokeIcon = (name, size, d, color, sw = 2) =>
  icon(name, size, `<path d="${d}" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`);
const fillIcon = (name, size, d, color) => icon(name, size, `<path d="${d}" fill="${color}" fill-rule="evenodd"/>`);

// ---------- palette ----------
const SIDEBAR = "#2E2D3B";
const NAV_ICON = "#716F7C";
const YELLOW = "#FEDF0E";
const BG = "#F9F9F9";
const INK = "#1A1922";
const BODY = "#2C2B30";
const MUTED = "#89878A";
const FAINT = "#A2A1A6";
const LINE = "#ECECEC";

// ---------- root ----------
const ref = await figma.getNodeByIdAsync(REF_ID);
for (const old of figma.currentPage.findChildren((n) => n.name === NAME)) old.remove();
const root = frame(NAME, { clipsContent: true, cornerRadius: 16 });
root.resize(1280, 766);
root.x = ref.x + ref.width + 80;
root.y = ref.y + 2.5;
// Warm glow behind the greeting, fading into the flat grey page.
root.fills = [
  ...solid(BG),
  {
    type: "GRADIENT_RADIAL",
    gradientTransform: [[1.43, 0, 0], [0, 0.83, 0.33]],
    gradientStops: [
      { position: 0, color: { ...hex("#FCF5DC"), a: 0.95 } },
      { position: 0.45, color: { ...hex("#FBF7EA"), a: 0.6 } },
      { position: 1, color: { ...hex("#F9F9F9"), a: 0 } },
    ],
  },
];

// ---------- sidebar ----------
const sb = place(root, frame("Sidebar", { fills: solid(SIDEBAR) }), 0, 0);
sb.resize(227, 766);
sb.constraints = { horizontal: "MIN", vertical: "STRETCH" };

const logo = place(sb, autoLayout("Logo", "HORIZONTAL", { itemSpacing: 8 }), 38, 18);
logo.appendChild(icon("simpledocs-mark", 20,
  `<g stroke="${YELLOW}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">` +
  `<path d="M6 1.6h11.4a1.8 1.8 0 0 1 1.8 1.8v20.4a1.8 1.8 0 0 1-1.8 1.8H1.6"/>` +
  `<path d="M8.6 8.2h6.4"/><path d="M6.8 13.6h8.2"/><path d="M4.6 19h10.4"/></g>`,
  { w: 21, h: 27.2, view: "0 0 21 27.2" }));
const word = text("SimpleDocs", { size: 20, color: "#FFFFFF", name: "Wordmark" });
word.setRangeFontName(0, 6, { family: SANS, style: "Light" });
word.setRangeFontName(6, 10, { family: SANS, style: "SemiBold" });
logo.appendChild(fit(word, 95));

const collapse = autoLayout("Collapse button", "HORIZONTAL", { primaryAxisAlignItems: "CENTER", cornerRadius: 10, fills: solid("#55545F") });
collapse.primaryAxisSizingMode = collapse.counterAxisSizingMode = "FIXED";
collapse.resize(20, 20);
collapse.appendChild(strokeIcon("chevron-left", 12, "M15 5l-7 7 7 7", YELLOW, 3.4));
placeMid(sb, collapse, 191, 30.5);

const NAV_ICONS = {
  Home: icon("home", 20, `<path d="M4 1.5h12a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3H8.6L5 18.2v-3.7H4a3 3 0 0 1-3-3v-7a3 3 0 0 1 3-3z" fill="#FED916"/>`, { view: "0 0 20 20" }),
  Insights: icon("insights", 20, `<g fill="${NAV_ICON}"><rect x="1.5" y="10" width="4" height="8" rx="0.8"/><rect x="8" y="6" width="4" height="12" rx="0.8"/><rect x="14.5" y="1.5" width="4" height="16.5" rx="0.8"/></g>`, { view: "0 0 20 20" }),
  Requests: fillIcon("requests", 20, "M5 2h8.5v5.5H19V21a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zM15 2l4 4h-4z", NAV_ICON),
  Workflows: fillIcon("workflows", 20, "M3 3.5l9.5 2.2 7.2 7.2-6.8 6.8-7.2-7.2zM9.3 9.3a1.6 1.6 0 1 0 0.01 0z", NAV_ICON),
  Playbooks: fillIcon("playbooks", 20, "M5.5 2h13a1.5 1.5 0 0 1 1.5 1.5V16H4V3.5A1.5 1.5 0 0 1 5.5 2zM4 18h16v2.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 20.5z", NAV_ICON),
  Repository: fillIcon("repository", 20, "M10 4H3.5A1.5 1.5 0 0 0 2 5.5v13A1.5 1.5 0 0 0 3.5 20h17a1.5 1.5 0 0 0 1.5-1.5V8a1.5 1.5 0 0 0-1.5-1.5H12z", NAV_ICON),
  Settings: icon("settings", 20, `<path fill="${NAV_ICON}" d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.48.48 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.49.49 0 0 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61zM12 15.6a3.6 3.6 0 1 1 0-7.2 3.6 3.6 0 0 1 0 7.2z"/>`),
  Notifications: fillIcon("notifications", 20, "M12 23a2.4 2.4 0 0 0 2.4-2.4H9.6A2.4 2.4 0 0 0 12 23zm7-6.5v-5.3c0-3.3-1.8-6-4.9-6.7v-.7a2.1 2.1 0 0 0-4.2 0v.7C6.8 5.2 5 7.9 5 11.2v5.3L2.8 18.7v1h18.4v-1z", NAV_ICON),
};

// Label size measured from "Notifications" (96px wide).
const probe = fit(text("Notifications", { size: 17, weight: "Bold" }), 96);
const NAV_SIZE = probe.fontSize;
probe.remove();
const nav = place(sb, autoLayout("Nav", "VERTICAL"), 28, 63.4);
for (const label of Object.keys(NAV_ICONS)) {
  const item = autoLayout("Nav item/" + label, "HORIZONTAL", { itemSpacing: 17 });
  item.primaryAxisSizingMode = item.counterAxisSizingMode = "FIXED";
  item.resize(172, 46.3);
  item.appendChild(NAV_ICONS[label]);
  add(item, text(label, { size: NAV_SIZE, weight: "Bold", color: "#FAFAFC" }), { grow: 1 });
  if (label === "Settings") item.appendChild(strokeIcon("chevron-down", 16, "M5 9l7 7 7-7", "#FAFAFC", 2.6));
  if (label === "Notifications") {
    const badge = autoLayout("Badge", "HORIZONTAL", { primaryAxisAlignItems: "CENTER", cornerRadius: 10, fills: solid("#62626C") });
    badge.primaryAxisSizingMode = badge.counterAxisSizingMode = "FIXED";
    badge.resize(20, 20);
    badge.appendChild(text("9+", { size: 11, weight: "Bold", color: "#FFE802" }));
    item.appendChild(badge);
  }
  add(nav, item);
}

// ---------- greeting ----------
const main = place(root, frame("Main"), 227, 0);
main.resize(1053, 766);
const M = (x) => x - 227; // window x -> main x

placeMid(main, fit(text("MONDAY, 12 OCT", { size: 11, weight: "SemiBold", color: "#87818D", ls: 2.2, name: "Date" }), 114), M(378), 83.5);

const greet = place(main, autoLayout("Greeting", "HORIZONTAL", { itemSpacing: 10, counterAxisAlignItems: "BASELINE" }), M(376), 101);
greet.appendChild(fit(text("Good afternoon,", { size: 52, weight: "SemiBold", color: INK }), 355));
greet.appendChild(fit(text("Preston.", { size: 52, family: SERIF, weight: "SemiBold Italic", color: "#5E4C0C" }), 163));

placeMid(main, fit(text("Ask anything about your contracts.", { size: 14.5, weight: "Medium", color: "#3A3940", name: "Subtitle" }), 228), M(378), 178.5);

// ---------- prompt card ----------
const card = place(main, autoLayout("Prompt card", "VERTICAL", {
  primaryAxisAlignItems: "SPACE_BETWEEN", paddingTop: 14, paddingBottom: 13, paddingLeft: 15, paddingRight: 19,
  cornerRadius: 14, fills: solid("#FFFFFF"),
}), M(380), 230);
card.primaryAxisSizingMode = card.counterAxisSizingMode = "FIXED";
card.resize(775, 103);
border(card, "#F0F0F2");
shadow(card, [{ y: 1, blur: 3, opacity: 0.04 }, { y: 8, blur: 24, opacity: 0.05 }]);
add(card, fit(text("Ask about your contracts, obligations, or risk exposure…", { size: 16, color: "#8E8D93", name: "Placeholder" }), 417), { fillH: false });

const toolbar = add(card, autoLayout("Toolbar", "HORIZONTAL", { primaryAxisAlignItems: "SPACE_BETWEEN" }), { fillH: true });
const left = add(toolbar, autoLayout("Tools", "HORIZONTAL", { itemSpacing: 6 }));
function pill(label, iconNode, labelWidth) {
  const p = autoLayout(label + " button", "HORIZONTAL", { itemSpacing: 6, paddingLeft: 10, paddingRight: 10, cornerRadius: 8, fills: solid("#F1F1F3") });
  p.counterAxisSizingMode = "FIXED";
  p.resize(p.width, 27);
  p.appendChild(iconNode);
  p.appendChild(fit(text(label, { size: 14, weight: "SemiBold", color: "#2A2833" }), labelWidth));
  p.appendChild(strokeIcon("chevron-down", 10, "M6 9l6 6 6-6", "#55535C", 2.4));
  return p;
}
left.appendChild(pill("Actions", fillIcon("bolt", 15, "M13.5 1.5L4 13.5h7l-1.5 9 9.5-12.5h-7z", "#1B1A21"), 45));
left.appendChild(pill("Prompt Library", fillIcon("library", 15, "M8 5V3.5A1.5 1.5 0 0 1 9.5 2h5A1.5 1.5 0 0 1 16 3.5V5h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zm2 0h4V4h-4zM2 11h20v1.5H2z", "#1B1A21"), 90));

const right = add(toolbar, autoLayout("Send", "HORIZONTAL", { itemSpacing: 8 }));
const kbd = autoLayout("Enter key", "HORIZONTAL", { primaryAxisAlignItems: "CENTER", cornerRadius: 4, fills: solid("#FFFFFF") });
kbd.primaryAxisSizingMode = kbd.counterAxisSizingMode = "FIXED";
kbd.resize(19, 20);
border(kbd, "#E2E2E5");
shadow(kbd, [{ y: 1, blur: 0, opacity: 0.06 }]);
kbd.appendChild(strokeIcon("enter", 11, "M19 6v5a2 2 0 0 1-2 2H6M9 9.5L5.5 13 9 16.5", "#605F64", 2.6));
right.appendChild(kbd);
right.appendChild(fit(text("to send", { size: 13, color: "#929196" }), 41));
const sendBtn = autoLayout("Send button", "HORIZONTAL", { primaryAxisAlignItems: "CENTER", cornerRadius: 13, fills: solid("#F4F4F5") });
sendBtn.primaryAxisSizingMode = sendBtn.counterAxisSizingMode = "FIXED";
sendBtn.resize(26, 26);
sendBtn.appendChild(strokeIcon("arrow-up", 14, "M12 19V5M6 11l6-6 6 6", "#828283", 2.2));
right.appendChild(sendBtn);
toolbar.counterAxisSizingMode = "FIXED";
toolbar.resize(toolbar.width, 27);

// ---------- suggestion chips ----------
const DOTS = { red: "#FF2A10", yellow: "#FFD301", blue: "#1A6EF5", green: "#10C24A" };
function chip(label, dot, width) {
  const c = autoLayout("Chip/" + label, "HORIZONTAL", { itemSpacing: 9, paddingLeft: 11, paddingRight: 11, cornerRadius: 17, fills: solid("#FFFFFF") });
  c.counterAxisSizingMode = "FIXED";
  c.resize(c.width, 33);
  border(c, "#EEEEF0");
  shadow(c, [{ y: 1, blur: 2, opacity: 0.03 }]);
  const d = figma.createEllipse();
  d.name = "Dot";
  d.resize(6.5, 6.5);
  d.fills = solid(DOTS[dot]);
  c.appendChild(d);
  c.appendChild(fit(text(label, { size: 13.5, weight: "Medium", color: "#3E3D43" }), width));
  return c;
}
const chipsWrap = place(main, frame("Suggestions", { clipsContent: true }), M(380), 346.5);
chipsWrap.resize(671, 33);
const chips = place(chipsWrap, autoLayout("Chips", "HORIZONTAL", { itemSpacing: 9.5 }), 0, 0);
chips.appendChild(chip("Expiring in 90 days", "red", 106));
chips.appendChild(chip("Auto-renewing in 60 days", "yellow", 145));
chips.appendChild(chip("Force majeure clauses", "blue", 132));
chips.appendChild(chip("Notice periods", "green", 81));
const next = autoLayout("Scroll right", "HORIZONTAL", { primaryAxisAlignItems: "CENTER", cornerRadius: 12.5, fills: solid("#FFFFFF") });
next.primaryAxisSizingMode = next.counterAxisSizingMode = "FIXED";
next.resize(25, 25);
border(next, "#E6E6E9");
next.appendChild(strokeIcon("chevron-right", 12, "M9 5l7 7-7 7", "#0D0C17", 3.6));
placeMid(chipsWrap, next, 646, 16.5);

const viewChip = autoLayout("View all button", "HORIZONTAL", { itemSpacing: 8, paddingLeft: 13, paddingRight: 12, cornerRadius: 17, fills: solid("#FFFFFF") });
viewChip.counterAxisSizingMode = "FIXED";
viewChip.resize(viewChip.width, 33);
border(viewChip, "#E3E3E6");
viewChip.appendChild(fillIcon("folder", 16, "M9.5 4H3.5A1.5 1.5 0 0 0 2 5.5v13A1.5 1.5 0 0 0 3.5 20h17a1.5 1.5 0 0 0 1.5-1.5V8a1.5 1.5 0 0 0-1.5-1.5H12zM2 9h20v1.5H2z", "#1A1823"));
viewChip.appendChild(fit(text("View all", { size: 13.5, weight: "Medium", color: "#1A1823" }), 43));
viewChip.appendChild(strokeIcon("chevron-down", 10, "M6 9l6 6 6-6", "#55535C", 2.4));
place(main, viewChip, M(1060), 346.5);

// ---------- recent chats ----------
function sectionHeader(name, label, count, linkLabel, linkWidth, y) {
  const h = place(main, autoLayout(name, "HORIZONTAL", { primaryAxisAlignItems: "SPACE_BETWEEN" }), M(378), 0);
  h.primaryAxisSizingMode = "FIXED";
  h.resize(782, h.height);
  const l = add(h, autoLayout("Title", "HORIZONTAL", { itemSpacing: 12 }));
  l.appendChild(text(label, { size: 11, weight: "SemiBold", color: MUTED, ls: 2.6 }));
  if (count) l.appendChild(text(count, { size: 11, weight: "SemiBold", color: "#5C5B60" }));
  const link = add(h, autoLayout("Link", "HORIZONTAL", { itemSpacing: 7 }));
  link.appendChild(fit(text(linkLabel, { size: 12.5, weight: "Medium", color: "#2D2D2F" }), linkWidth));
  link.appendChild(strokeIcon("chevron-right", 9, "M9 5l7 7-7 7", "#55535C", 2.6));
  h.y = y - h.height / 2;
  return h;
}
fit(sectionHeader("Recent chats header", "PICK UP WHERE YOU LEFT OFF", null, "View all chats", 75.5, 421.5).findOne((n) => n.name === "PICK UP WHERE YOU LEFT OFF"), 221.5);

const list = place(main, autoLayout("Recent chats", "VERTICAL"), M(378), 439.4);
list.primaryAxisSizingMode = "AUTO";
const CHATS = [
  ["Which contracts are expiring in the next 90 days?", "5 Oct", 322],
  ["Show me the last ten agreements with choice of law either…", "5 Oct", 391],
  ["Which contracts are auto-renewing in the next 60 days?", "22 Sep", 365],
  ["Show me agreements with force majeure clauses.", "22 Sep", 324],
  ["Which contracts have notice periods longer than 60 days?", "16 Sep", 384],
];
CHATS.forEach(([q, d, w], i) => {
  const r = autoLayout("Chat row", "HORIZONTAL", { primaryAxisAlignItems: "SPACE_BETWEEN", paddingRight: 4 });
  r.primaryAxisSizingMode = r.counterAxisSizingMode = "FIXED";
  r.resize(782, 43.5);
  if (i < CHATS.length - 1) {
    r.strokes = solid(LINE);
    r.strokeAlign = "INSIDE";
    r.strokeTopWeight = r.strokeLeftWeight = r.strokeRightWeight = 0;
    r.strokeBottomWeight = 1;
  }
  r.appendChild(fit(text(q, { size: 14.5, weight: "Medium", color: "#38373D", name: "Question" }), w));
  r.appendChild(text(d, { size: 13, color: FAINT, name: "Date" }));
  add(list, r);
});

sectionHeader("Saved views header", "SAVED VIEWS", "5", "View all", 43, 701.5);
placeMid(main, fit(text("NDAs View", { size: 14.5, weight: "Medium", color: "#38373D" }), 77), M(378), 741.2);
const savedLine = place(main, figma.createRectangle(), M(378), 762);
savedLine.name = "Divider";
savedLine.resize(782, 1);
savedLine.fills = solid(LINE);

return { root: root.id, x: root.x, y: root.y };
