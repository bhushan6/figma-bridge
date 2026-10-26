// Feedback icons for the AI suggestion footer (lucide thumbs, 24px grid). Replaces existing ones of the same name.
const NEW = {
  "thumbs-up": `<path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"/>`,
  "thumbs-down": `<path d="M17 14V2"/><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z"/>`,
};
const lib = await libFrame();
const iconsFrame = lib.findChild((n) => n.name === "Icons");
const made = [];
for (const [name, paths] of Object.entries(NEW)) {
  const old = iconsFrame.findChild((n) => n.name === "icon/" + name);
  const comp = figma.createComponent();
  comp.name = "icon/" + name;
  comp.resize(24, 24);
  comp.fills = [];
  const node = figma.createNodeFromSvg(`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#1F2533" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`);
  for (const child of [...node.children]) { comp.appendChild(child); child.constraints = { horizontal: "SCALE", vertical: "SCALE" }; }
  node.remove();
  if (old) {
    for (const c of [...old.children]) c.remove();
    for (const c of [...comp.children]) old.appendChild(c);
    comp.remove();
    made.push(old.id);
  } else {
    iconsFrame.appendChild(comp);
    made.push(comp.id);
  }
}
return made;
