// Sidebar (RTL) recreated from the "sidebar-screenshot" node (12:2582) at 1x UI scale.
// Measured from the screenshot at 5 px per UI px. Run with ./run.sh sidebar.js
const INK = "#1B2939";
const MUTED = "#475567";
const ICON = "#75757A";
const LIGHT = "#96A1AF";
const BLUE = "#0051B1";
const DIVIDER = "#F3F4F6";
const NAME = "Sidebar – Recreated";
const REF_ID = "12:2582";

const T = (chars, w, opts = {}) => fit(text(chars, { size: 16, color: INK, ...opts }), w);
const row = (name, props = {}) => {
  const r = autoLayout("HORIZONTAL", { name, counterAxisAlignItems: "CENTER", ...props });
  r.counterAxisSizingMode = "FIXED";
  return r;
};
const section = (name, props = {}) => autoLayout("VERTICAL", { name, ...props });
const divider = (parent) => {
  const d = rect("Divider", 10, 1, DIVIDER);
  parent.appendChild(d);
  d.layoutSizingHorizontal = "FILL";
  return d;
};

// ---------- Nav item component (State=Default / Active) ----------
const navSet = await replaceComponent("Sidebar/Nav item", async () => {
  async function build(state) {
    const c = figma.createComponent();
    c.name = "State=" + state;
    c.layoutMode = "HORIZONTAL";
    c.primaryAxisAlignItems = "MAX";
    c.counterAxisAlignItems = "CENTER";
    c.primaryAxisSizingMode = "FIXED";
    c.counterAxisSizingMode = "FIXED";
    c.resize(255, 51);
    c.paddingRight = 13.5;
    c.paddingLeft = 12;
    c.itemSpacing = 14.5;
    c.cornerRadius = 10;
    c.fills = state === "Active" ? solid(DIVIDER) : [];
    const key = c.addComponentProperty("Label", "TEXT", "الرئيسية");
    const t = T("الرئيسية", 59.4, { name: "Label" });
    c.appendChild(t);
    t.componentPropertyReferences = { characters: key };
    const i = await icon("home", 24, ICON);
    i.name = "Icon";
    for (const v of i.findAll((n) => "strokeWeight" in n && n.strokes.length)) v.strokeWeight = 1.5;
    c.appendChild(i);
    const swap = c.addComponentProperty("Icon", "INSTANCE_SWAP", (await component("icon/home")).id);
    i.componentPropertyReferences = { mainComponent: swap };
    return c;
  }
  const set = figma.combineAsVariants([await build("Default"), await build("Active")], figma.currentPage);
  set.name = "Sidebar/Nav item";
  set.layoutMode = "VERTICAL";
  set.itemSpacing = 16;
  set.paddingTop = set.paddingBottom = set.paddingLeft = set.paddingRight = 16;
  set.primaryAxisSizingMode = "AUTO";
  set.counterAxisSizingMode = "AUTO";
  return set;
});
const NAV_FONT = navSet.children[0].findOne((n) => n.type === "TEXT").fontSize;

// ---------- Sidebar ----------
const stray = figma.currentPage.findChild((n) => n.name === NAME);
if (stray) stray.remove();
const sb = section(NAME);
sb.primaryAxisSizingMode = "FIXED";
sb.counterAxisSizingMode = "FIXED";
sb.resize(301, 1156);
sb.fills = solid("#FFFFFF");
sb.strokes = solid(DIVIDER);
sb.strokeAlign = "INSIDE";
sb.strokeTopWeight = sb.strokeRightWeight = sb.strokeBottomWeight = 0;
sb.strokeLeftWeight = 1;
sb.clipsContent = true;

// Main: create button + nav
const main = add(sb, section("Main", { paddingTop: 32, paddingBottom: 13, paddingLeft: 27, paddingRight: 19, itemSpacing: 39 }), { fillH: true });
const create = row("Create button", { primaryAxisAlignItems: "CENTER", itemSpacing: 9, cornerRadius: 10 });
create.fills = solid(BLUE);
create.resize(255, 51);
shadow(create, { y: 6, blur: 24, opacity: 0.1 });
create.appendChild(T("إنشاء", 38, { color: "#FFFFFF", weight: "Medium" }));
create.appendChild(await icon("plus", 24, "#FFFFFF"));
add(main, create, { fillH: true });
const nav = add(main, section("Nav", { itemSpacing: 13 }), { fillH: true });
for (const [label, iconName, active] of [["الرئيسية", "home", true], ["عقودي", "files-stack", false], ["القوالب", "template", false]]) {
  const v = navSet.children.find((c) => c.name === "State=" + (active ? "Active" : "Default"));
  const inst = v.createInstance();
  inst.name = label;
  const props = inst.componentProperties;
  const k = (p) => Object.keys(props).find((x) => x.startsWith(p + "#"));
  inst.setProperties({ [k("Label")]: label, [k("Icon")]: (await component("icon/" + iconName)).id });
  // The swapped icon keeps the default stroke colour from the main component only if it is the same icon.
  for (const v2 of inst.findOne((n) => n.type === "INSTANCE").findAll((n) => n.type === "VECTOR" || n.type === "ELLIPSE" || n.type === "RECTANGLE" || n.type === "LINE")) {
    if (v2.strokes.length) { v2.strokes = solid(ICON); v2.strokeWeight = 1.5; }
    if (v2.fills.length && v2.fills[0].type === "SOLID") v2.fills = solid(ICON);
  }
  add(nav, inst, { fillH: true });
}
divider(sb);

// Collections: favourites / folders / projects (collapsible, empty)
const coll = add(sb, section("Collections", { paddingTop: 10, paddingLeft: 27.5, paddingRight: 19, itemSpacing: 21 }), { fillH: true, grow: 1 });
for (const [label, w, plus] of [["المفضلة", 65, false], ["المجلدات", 74, true], ["المشاريع", 66, true]]) {
  const r = add(coll, row(label, {}), { fillH: true });
  r.resize(r.width, 40);
  if (plus) { const p = await icon("plus", 18, MUTED); p.name = "Add"; r.appendChild(p); }
  const lab = add(r, row("Label", { primaryAxisAlignItems: "MAX", itemSpacing: 7.5 }), { grow: 1 });
  lab.resize(lab.width, 40);
  lab.appendChild(text(label, { size: 18, color: MUTED }));
  const ch = await icon("chevron-down", 20, MUTED);
  ch.name = "Chevron";
  lab.appendChild(ch);
}
divider(sb);

// Products
const prod = add(sb, section("Products", { paddingTop: 14.5, paddingBottom: 17.5, paddingLeft: 20, paddingRight: 12 }), { fillH: true });
const head = add(prod, row("Header", { primaryAxisAlignItems: "MAX", itemSpacing: 11, paddingRight: 1 }), { fillH: true });
head.resize(head.width, 40);
head.appendChild(text("منتجات قانونية", { size: 18, color: INK }));
const grid = await icon("grid", 20, MUTED);
grid.name = "Icon";
// Solid dots, as in the app.
for (const e of grid.findAll((n) => n.type === "ELLIPSE" || n.type === "VECTOR")) { e.fills = solid(MUTED); e.strokeWeight = 1; }
head.appendChild(grid);
const items = add(prod, section("Items", { itemSpacing: 17.5 }), { fillH: true });
prod.itemSpacing = 26.5;
const PRODUCTS = [["قانونية AI", 60, "logo-spark", "chevron"], ["محرك البحث القانوني", 132, "qanoniah-mark", "chevron"], ["قانونية CLM", 78, "qanoniah-mark", "current"]];
for (let i = 0; i < PRODUCTS.length; i++) {
  const [label, w, iconName, trail] = PRODUCTS[i];
  const r = add(items, row(label, { primaryAxisAlignItems: "SPACE_BETWEEN" }), { fillH: true });
  r.resize(r.width, 40);
  if (trail === "chevron") {
    const ch = await icon("chevron-left", 20, LIGHT);
    ch.name = "Open";
    r.appendChild(ch);
  } else {
    const pill = row("Current badge", { paddingLeft: 12, paddingRight: 12, primaryAxisAlignItems: "CENTER", cornerRadius: 15 });
    pill.fills = solid("#E8FEF5");
    pill.resize(61, 29);
    pill.primaryAxisSizingMode = "AUTO";
    pill.appendChild(T("الحالي", 35, { size: 13, color: "#009C62", weight: "SemiBold" }));
    r.appendChild(pill);
  }
  const lab = add(r, row("Label", { itemSpacing: 9 }));
  lab.primaryAxisSizingMode = "AUTO";
  lab.resize(lab.width, 40);
  lab.appendChild(text(label, { size: 14.5, color: INK }));
  const ic = await icon(iconName, 24, null);
  ic.name = "Logo";
  lab.appendChild(ic);
}
divider(sb);

// Footer: support + account
const foot = add(sb, section("Footer", { paddingTop: 19, paddingBottom: 14.5, paddingLeft: 30, paddingRight: 19.5, itemSpacing: 34 }), { fillH: true });
const sup = add(foot, row("Support", { primaryAxisAlignItems: "MAX", itemSpacing: 12, paddingRight: 0 }), { fillH: true });
sup.resize(sup.width, 40);
sup.appendChild(text("الدعم الفني", { size: 18, color: INK }));
const si = await icon("support-chat", 26, MUTED);
si.name = "Icon";
sup.appendChild(si);
const acct = add(foot, row("Account", { primaryAxisAlignItems: "SPACE_BETWEEN" }), { fillH: true });
acct.resize(acct.width, 38);
const gear = await icon("settings", 26, BLUE);
gear.name = "Settings";
acct.appendChild(gear);
const who = add(acct, row("User", { itemSpacing: 14.5 }));
who.primaryAxisSizingMode = "AUTO";
who.resize(who.width, 38);
const names = add(who, section("Name", { counterAxisAlignItems: "MAX", itemSpacing: 2 }));
// Latin account details render in Quicksand in the app.
const QS = { medium: { family: "Quicksand", style: "Medium" }, regular: { family: "Quicksand", style: "Regular" } };
await Promise.all(Object.values(QS).map((f) => figma.loadFontAsync(f)));
const latin = (chars, w, font, color) => { const t = text(chars, { color, align: "RIGHT" }); t.fontName = font; return fit(t, w); };
names.appendChild(latin("...sh Kanawade", 134, QS.regular, INK));
names.appendChild(latin("...ade3@gmail.com", 141, QS.regular, LIGHT));
const av = row("Avatar", { primaryAxisAlignItems: "CENTER", cornerRadius: 19 });
av.resize(38, 38);
av.primaryAxisSizingMode = "FIXED";
av.fills = solid("#F9FAFB");
stroke(av, DIVIDER, 1);
const ui = await icon("user", 22, MUTED);
ui.name = "Icon";
av.appendChild(ui);
who.appendChild(av);

const ref = await figma.getNodeByIdAsync(REF_ID);
figma.currentPage.appendChild(sb);
sb.x = ref.x + ref.width + 120;
sb.y = ref.y;
const sizes = sb.findAll((n) => n.type === "TEXT").map((t) => t.characters + ":" + t.fontSize);
return { id: sb.id, navSet: navSet.id, NAV_FONT, sizes };
