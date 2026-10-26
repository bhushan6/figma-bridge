// Adds icons to the library by name (skips ones that exist).
const NEW = __ICONS__;
const lib = await libFrame();
const iconsFrame = lib.findChild((n) => n.name === "Icons");
const added = [];
for (const [name, paths] of Object.entries(NEW)) {
  if (iconsFrame.findChild((n) => n.name === "icon/" + name)) continue;
  const node = figma.createNodeFromSvg(`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#1F2533" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`);
  const comp = figma.createComponent();
  comp.name = "icon/" + name;
  comp.resize(24, 24);
  comp.fills = [];
  for (const child of [...node.children]) { comp.appendChild(child); child.constraints = { horizontal: "SCALE", vertical: "SCALE" }; }
  node.remove();
  iconsFrame.appendChild(comp);
  added.push(name);
}
return JSON.stringify(added);
