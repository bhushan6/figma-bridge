// Shared helpers, prepended to each build script.
const hex = (h) => ({ r: parseInt(h.slice(1, 3), 16) / 255, g: parseInt(h.slice(3, 5), 16) / 255, b: parseInt(h.slice(5, 7), 16) / 255 });
const solid = (h, opacity) => [opacity === undefined ? { type: "SOLID", color: hex(h) } : { type: "SOLID", color: hex(h), opacity }];
const stroke = (node, h, weight = 1, align = "INSIDE") => {
  node.strokes = solid(h);
  node.strokeWeight = weight;
  node.strokeAlign = align;
  return node;
};
const shadow = (node, { y = 1, blur = 3, opacity = 0.08, spread = 0, color = "#101828" } = {}) => {
  node.effects = [{ type: "DROP_SHADOW", color: { ...hex(color), a: opacity }, offset: { x: 0, y }, radius: blur, spread, visible: true, blendMode: "NORMAL" }];
  return node;
};

// app: the product UI (Readex Pro); doc: document body (Arial); noto: gauge card; serif: logo "AI".
const FAMILIES = { app: "Readex Pro", doc: "Arial", noto: "Noto Sans Arabic", serif: "Georgia", inter: "Inter" };
const WEIGHTS = {
  Light: ["Light", "Regular"],
  Regular: ["Regular"],
  Medium: ["Medium", "Regular"],
  SemiBold: ["SemiBold", "Semi Bold", "Bold"],
  Bold: ["Bold"],
};
const F = {};
async function loadFonts() {
  const avail = await figma.listAvailableFontsAsync();
  const has = (family, style) => avail.some((f) => f.fontName.family === family && f.fontName.style === style);
  for (const [key, family] of Object.entries(FAMILIES)) {
    for (const [w, styles] of Object.entries(WEIGHTS)) {
      const style = styles.find((s) => has(family, s));
      if (style) F[key + w] = { family, style };
    }
  }
  await Promise.all(Object.values(F).map((f) => figma.loadFontAsync(f)));
}
await loadFonts();

function frame(name, props = {}) {
  const f = figma.createFrame();
  f.name = name;
  f.fills = [];
  f.clipsContent = false;
  Object.assign(f, props);
  return f;
}

function autoLayout(direction, props = {}) {
  const f = figma.createFrame();
  f.layoutMode = direction;
  f.primaryAxisSizingMode = "AUTO";
  f.counterAxisSizingMode = "AUTO";
  f.fills = [];
  f.clipsContent = false;
  Object.assign(f, props);
  return f;
}

function text(chars, { size = 14, weight = "Regular", color = "#1F2533", lineHeight, align = "RIGHT", font = "app", name, width } = {}) {
  const t = figma.createText();
  // The app renders Readex Pro a step lighter than its nominal weight.
  const w = font === "app" ? { Regular: "Light", Medium: "Regular", SemiBold: "Medium", Bold: "SemiBold" }[weight] || weight : weight;
  t.fontName = F[font + w] || F[font + "Regular"];
  t.fontSize = size;
  if (lineHeight) t.lineHeight = { unit: "PIXELS", value: lineHeight };
  t.textAlignHorizontal = align;
  t.characters = chars;
  t.fills = solid(color);
  t.name = name || chars.replace(/\n/g, " ").slice(0, 40);
  if (width) {
    t.textAutoResize = "HEIGHT";
    t.resize(width, t.height);
  }
  return t;
}

function svg(markup, name) {
  const n = figma.createNodeFromSvg(markup);
  n.name = name;
  n.fills = [];
  return n;
}

function rect(name, w, h, fill, radius = 0) {
  const r = figma.createRectangle();
  r.name = name;
  r.resize(w, h);
  r.fills = fill ? solid(fill) : [];
  r.cornerRadius = radius;
  return r;
}

// Place a child at x/y inside a parent without auto layout.
function place(parent, node, x, y) {
  parent.appendChild(node);
  node.x = x;
  node.y = y;
  return node;
}

// Add a child to an auto-layout parent, optionally stretching it.
function add(parent, node, { fillH = false, fillV = false, grow = 0 } = {}) {
  parent.appendChild(node);
  if (fillH) node.layoutSizingHorizontal = "FILL";
  if (fillV) node.layoutSizingVertical = "FILL";
  if (grow) node.layoutGrow = grow;
  return node;
}

const LIB_ID = "__LIB__";
const ROOT_ID = "__ROOT__";
let _components = null;
async function component(name) {
  if (!_components) {
    const lib = await figma.getNodeByIdAsync(LIB_ID);
    _components = new Map();
    for (const n of lib.findAllWithCriteria({ types: ["COMPONENT", "COMPONENT_SET"] })) _components.set(n.name, n);
  }
  const c = _components.get(name);
  if (!c) throw new Error("No component named " + name);
  return c;
}

// Icon instance at the given size, recolored.
async function icon(name, size = 20, color) {
  const inst = (await component("icon/" + name)).createInstance();
  inst.resize(size, size);
  // Keep strokes proportional to the icon size (1.75 at 24px).
  for (const v of inst.findAll((n) => "strokeWeight" in n && n.strokes && n.strokes.length)) v.strokeWeight = Math.max(0.9, (1.75 * size) / 24);
  if (color) {
    for (const v of inst.findAll((n) => n.type === "VECTOR" || n.type === "ELLIPSE" || n.type === "RECTANGLE" || n.type === "LINE")) {
      if (v.strokes.length) v.strokes = solid(color);
      if (v.fills.length && v.fills[0].type === "SOLID") v.fills = solid(color);
    }
  }
  return inst;
}

// Scale a text node's font so its width matches a measured width.
function fit(t, targetWidth) {
  const k = targetWidth / t.width;
  if (typeof t.fontSize === "number") {
    t.fontSize = Math.round(t.fontSize * k * 4) / 4;
  } else {
    for (const seg of t.getStyledTextSegments(["fontSize"])) {
      t.setRangeFontSize(seg.start, seg.end, Math.round(seg.fontSize * k * 4) / 4);
    }
  }
  return t;
}

// Icon centered on (cx, cy) inside a non-auto-layout parent.
async function iconAt(parent, name, size, color, cx, cy) {
  const i = await icon(name, size, color);
  parent.appendChild(i);
  i.x = cx - size / 2;
  i.y = cy - size / 2;
  return i;
}

// Text positioned by its right edge (RTL) or left edge, vertically centered on cy.
function textAt(parent, t, { right, left, cx, cy }) {
  parent.appendChild(t);
  if (right !== undefined) { t.x = right - t.width; t.constraints = { horizontal: "MAX", vertical: "MIN" }; }
  else if (left !== undefined) t.x = left;
  else if (cx !== undefined) t.x = cx - t.width / 2;
  t.y = cy - t.height / 2;
  return t;
}

function vline(parent, x, y1, y2, color = "#E5E7EB") {
  const r = rect("Divider", 1, y2 - y1, color);
  return place(parent, r, x, y1);
}
function hline(parent, x1, x2, y, color = "#EEF0F3") {
  const r = rect("Divider", x2 - x1, 1, color);
  return place(parent, r, x1, y);
}

async function libFrame() {
  return figma.getNodeByIdAsync(LIB_ID);
}
function makeComponent(name, w, h, fill) {
  const c = figma.createComponent();
  c.name = name;
  c.resize(w, h);
  c.fills = fill ? solid(fill) : [];
  c.clipsContent = false;
  return c;
}
async function replaceComponent(name, build) {
  const lib = await libFrame();
  // Clear leftovers from a failed earlier run, build the new one, then swap it in.
  for (const stray of figma.currentPage.findChildren((n) => n.name === name)) stray.remove();
  const c = await build();
  const old = lib.findChild((n) => n.name === name);
  if (old) {
    lib.insertChild(lib.children.indexOf(old), c);
    old.remove();
  } else {
    lib.appendChild(c);
  }
  if (_components) _components.set(name, c);
  return c;
}

// Copy corner radius, strokes and effects from an original screenshot node
// (call after the recreation has been scaled to the node's size).
async function copyStyle(target, refId) {
  const ref = await figma.getNodeByIdAsync(refId);
  if (typeof ref.cornerRadius === "number") target.cornerRadius = ref.cornerRadius;
  target.effects = ref.effects;
  if (ref.strokes && ref.strokes.length) {
    target.strokes = ref.strokes;
    target.strokeWeight = ref.strokeWeight;
    target.strokeAlign = ref.strokeAlign;
  }
  target.clipsContent = true;
  return target;
}

// Fixed-width spacer inside an auto-layout row.
function gap(parent, w) {
  const g = frame("Gap");
  g.resize(w, 1);
  parent.appendChild(g);
  return g;
}
