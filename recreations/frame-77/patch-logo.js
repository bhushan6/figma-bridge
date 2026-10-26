const logo = await component("icon/logo-spark");
for (const c of [...logo.children]) c.remove();
const k = 5 * 0.2;
const star = `M13 7 C${13 + k} ${12 - k} ${13 + k} ${12 - k} 18 12 C${13 + k} ${12 + k} ${13 + k} ${12 + k} 13 17 C${13 - k} ${12 + k} ${13 - k} ${12 + k} 8 12 C${13 - k} ${12 - k} ${13 - k} ${12 - k} 13 7 Z`;
const node = figma.createNodeFromSvg(
  `<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">` +
  `<defs><linearGradient id="g" x1="3" y1="12" x2="22" y2="12" gradientUnits="userSpaceOnUse">` +
  `<stop stop-color="#0A0A8C"/><stop offset="0.35" stop-color="#1530F0"/><stop offset="0.68" stop-color="#7B6CF2"/><stop offset="1" stop-color="#F2C7EE"/></linearGradient></defs>` +
  `<path d="M2.5 11.5 C4 6 8.5 3 13 3 A9 9 0 0 1 13.8 21 L12.3 22.6 C11.8 17.5 8.8 13 2.5 11.5 Z" fill="url(#g)"/>` +
  `<path d="${star}" fill="#FFFFFF"/></svg>`
);
for (const child of [...node.children]) {
  logo.appendChild(child);
  child.constraints = { horizontal: "SCALE", vertical: "SCALE" };
}
logo.children[0].name = "Blob";
logo.children[1].name = "Spark";
node.remove();
return logo.children.length;
