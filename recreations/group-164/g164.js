// Group 164 (39:2667) recreated as editable layers. Shared prelude for the panel scripts:
// finds or creates "Group 164 – Recreated" below the original and gives each panel a slot.
const REF_ID = "39:2667";
const ROOT_NAME = "Group 164 – Recreated";
const ref = await figma.getNodeByIdAsync(REF_ID);
let root = figma.currentPage.findChild((n) => n.name === ROOT_NAME);
if (!root) {
  root = frame(ROOT_NAME, { x: ref.x, y: ref.y + ref.height + 200 });
  root.resize(ref.width, ref.height);
}

// Replace the named panel inside the root, at the original's position relative to Group 164.
function panel(name, refNode, w, h) {
  for (const old of root.findChildren((n) => n.name === name)) old.remove();
  const p = frame(name);
  p.resize(w, h);
  p.clipsContent = true;
  root.appendChild(p);
  p.x = refNode.absoluteTransform[0][2] - ref.absoluteTransform[0][2];
  p.y = refNode.absoluteTransform[1][2] - ref.absoluteTransform[1][2];
  return p;
}

// Icon with an explicit stroke weight.
async function ic(name, size, color, sw) {
  const i = await icon(name, size, color);
  i.name = name;
  if (sw) for (const v of i.findAll((n) => "strokeWeight" in n && n.strokes && n.strokes.length)) v.strokeWeight = sw;
  return i;
}

// Fixed-height horizontal auto-layout row that centres its content vertically.
function row(name, h, props = {}) {
  const r = autoLayout("HORIZONTAL", { name, counterAxisAlignItems: "CENTER", ...props });
  r.counterAxisSizingMode = "FIXED";
  r.resize(r.width, h);
  return r;
}

// Text whose ink width matches a measured width, right-aligned at `right`, centred on cy.
function label(parent, chars, w, opts, at) {
  return textAt(parent, fit(text(chars, opts), w), at);
}

// Inline SVG icon placed with its top-left at x, y.
function svgAt(parent, markup, name, x, y) {
  const n = figma.createNodeFromSvg(markup);
  n.name = name;
  return place(parent, n, x, y);
}
