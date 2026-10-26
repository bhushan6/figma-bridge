// Sidebar-specific icons traced from the screenshot (24px grid), plus the Qanoniah mark
// cut from Brand/Qanoniah logo. Replaces existing ones of the same name.
const NEW = {
  // Two stacked notes with folded corners ("عقودي").
  "files-stack": `<path d="M7.2 6.5V4a3 3 0 0 1 3-3h6.2l6.4 6.4V14.6a3 3 0 0 1-3 3h-1.4"/><path d="M16.4 1v3.4a2.6 2.6 0 0 0 2.6 2.6h3.8"/><path d="M11 6.5H4a3 3 0 0 0-3 3V20a3 3 0 0 0 3 3h10.8a3 3 0 0 0 3-3v-6.4Z"/><path d="M11 6.5v3.9a2.6 2.6 0 0 0 2.6 2.6h4.2"/>`,
  // Document with folded corner and a layout grid ("القوالب").
  template: `<path d="M11.7 1.4H7a3 3 0 0 0-3 3v14.7a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V9.2Z"/><path d="M11.7 1.4v5.2a2.6 2.6 0 0 0 2.6 2.6H20"/><path d="M4 14.1h16"/><path d="M9.7 14.1v8"/>`,
  // Monitor with a chat bubble ("الدعم الفني").
  "support-chat": `<path d="M8.7 3.3H4.3a3 3 0 0 0-3 3V15a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-2.4"/><path d="M11.7 0.8h8.6a3 3 0 0 1 3 3v5.5a3 3 0 0 1-3 3h-5l-2 2.5-1.6-2.5a3 3 0 0 1-3-3V3.8a3 3 0 0 1 3-3Z"/><path d="M11.3 18v4.2"/><path d="M7 22.2h8.5"/><circle cx="13.3" cy="6.9" r="0.85" fill="#1F2533" stroke="none"/><circle cx="16.3" cy="6.9" r="0.85" fill="#1F2533" stroke="none"/><circle cx="19.3" cy="6.9" r="0.85" fill="#1F2533" stroke="none"/>`,
};
const lib = await libFrame();
const iconsFrame = lib.findChild((n) => n.name === "Icons");
const made = [];
async function put(name, build) {
  const old = iconsFrame.findChild((n) => n.name === "icon/" + name);
  const comp = figma.createComponent();
  comp.name = "icon/" + name;
  comp.resize(24, 24);
  comp.fills = [];
  await build(comp);
  if (old) {
    // Keep existing instances pointing at a live component: swap contents in place instead.
    for (const c of [...old.children]) c.remove();
    for (const c of [...comp.children]) old.appendChild(c);
    comp.remove();
    made.push(old.id);
  } else {
    iconsFrame.appendChild(comp);
    made.push(comp.id);
  }
}
for (const [name, paths] of Object.entries(NEW)) {
  await put(name, async (comp) => {
    const node = figma.createNodeFromSvg(`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#1F2533" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`);
    for (const child of [...node.children]) { comp.appendChild(child); child.constraints = { horizontal: "SCALE", vertical: "SCALE" }; }
    node.remove();
  });
}
// Qanoniah mark, scaled from the brand logo's Mark frame into a 24px box (keeps its own colours).
const mark = lib.findOne((n) => n.name === "Brand/Qanoniah logo").findOne((n) => n.name === "Mark");
await put("qanoniah-mark", async (comp) => {
  const copy = mark.clone();
  const k = 22 / Math.max(copy.width, copy.height);
  copy.rescale(k);
  comp.appendChild(copy);
  copy.x = (24 - copy.width) / 2;
  copy.y = (24 - copy.height) / 2;
  copy.constraints = { horizontal: "SCALE", vertical: "SCALE" };
  copy.name = "Mark";
});
return made;
