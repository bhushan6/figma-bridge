// Builds the Components frame and a lucide-style icon set as components.
const rootNode = await figma.getNodeByIdAsync(ROOT_ID);
let lib = figma.currentPage.findChild((n) => n.name === "Components");
if (!lib) {
  lib = frame("Components", { x: rootNode.x + rootNode.width + 400, y: rootNode.y });
  lib.fills = solid("#FFFFFF");
  lib.layoutMode = "VERTICAL";
  lib.primaryAxisSizingMode = "AUTO";
  lib.counterAxisSizingMode = "AUTO";
  lib.itemSpacing = 48;
  lib.paddingLeft = lib.paddingRight = lib.paddingTop = lib.paddingBottom = 48;
}
let iconsFrame = lib.findChild((n) => n.name === "Icons");
if (iconsFrame) iconsFrame.remove();
iconsFrame = autoLayout("HORIZONTAL", { name: "Icons", itemSpacing: 16, layoutWrap: "WRAP", counterAxisSpacing: 16 });
lib.appendChild(iconsFrame);
iconsFrame.primaryAxisSizingMode = "FIXED";
iconsFrame.resize(640, 100);
iconsFrame.counterAxisSizingMode = "AUTO";

const S = (paths) =>
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#1F2533" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
const star4 = (cx, cy, r) => {
  const k = r * 0.18;
  return `M${cx} ${cy - r} C${cx + k} ${cy - k} ${cx + k} ${cy - k} ${cx + r} ${cy} C${cx + k} ${cy + k} ${cx + k} ${cy + k} ${cx} ${cy + r} C${cx - k} ${cy + k} ${cx - k} ${cy + k} ${cx - r} ${cy} C${cx - k} ${cy - k} ${cx - k} ${cy - k} ${cx} ${cy - r} Z`;
};

const ICONS = {
  "chevron-right": `<path d="m9 18 6-6-6-6"/>`,
  "chevron-left": `<path d="m15 18-6-6 6-6"/>`,
  "chevron-down": `<path d="m6 9 6 6 6-6"/>`,
  "chevron-up": `<path d="m18 15-6-6-6 6"/>`,
  download: `<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>`,
  "file-plus": `<path d="M12 21H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8l5 5v4"/><path d="M14 3v5h5"/><path d="M8 11h4"/><path d="M8 15h3"/><circle cx="17.5" cy="17.5" r="4"/><path d="M17.5 15.5v4"/><path d="M15.5 17.5h4"/>`,
  "cloud-sync": `<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/><path d="M9.5 13.5a2.5 2.5 0 0 1 4.3-1.7"/><path d="M14.5 13.5a2.5 2.5 0 0 1-4.3 1.7"/>`,
  "more-vertical": `<circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>`,
  undo: `<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>`,
  redo: `<path d="m15 14 5-5-5-5"/><path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13"/>`,
  bold: `<path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8"/>`,
  italic: `<path d="M19 4h-9"/><path d="M14 20H5"/><path d="M15 4 9 20"/>`,
  underline: `<path d="M6 4v6a6 6 0 0 0 12 0V4"/><path d="M4 20h16"/>`,
  strikethrough: `<path d="M16 4H9a3 3 0 0 0-2.83 4"/><path d="M14 12a4 4 0 0 1 0 8H6"/><path d="M4 12h16"/>`,
  "text-color": `<path d="m6 16 6-12 6 12"/><path d="M8 12h8"/><path d="M4 20h16"/>`,
  "align-right": `<path d="M21 6H3"/><path d="M21 12H9"/><path d="M21 18H7"/>`,
  "line-height": `<path d="m3 7 3-3 3 3"/><path d="m3 17 3 3 3-3"/><path d="M6 4v16"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/>`,
  "pilcrow-left": `<path d="M14 3v11"/><path d="M14 9h-3a3 3 0 0 1 0-6h9"/><path d="M18 3v11"/><path d="M22 18H2l4-4"/><path d="m2 18 4 4"/>`,
  "pilcrow-right": `<path d="M10 3v11"/><path d="M10 9H7a3 3 0 0 1 0-6h9"/><path d="M14 3v11"/><path d="M2 18h20l-4-4"/><path d="m22 18-4 4"/>`,
  "indent-ltr": `<path d="M3 6h12"/><path d="M3 12h10"/><path d="M3 18h12"/><path d="m18 8 3 4-3 4"/>`,
  "indent-rtl": `<path d="M9 6h12"/><path d="M11 12h10"/><path d="M9 18h12"/><path d="m6 8-3 4 3 4"/>`,
  list: `<path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/><path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/>`,
  "list-ordered": `<path d="M10 6h11"/><path d="M10 12h11"/><path d="M10 18h11"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/>`,
  "image-plus": `<path d="M16 5h6"/><path d="M19 2v6"/><path d="M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/><circle cx="9" cy="9" r="2"/>`,
  table: `<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/>`,
  fullscreen: `<path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="m9 9 6 6"/><path d="m15 9-6 6"/>`,
  plus: `<path d="M5 12h14"/><path d="M12 5v14"/>`,
  minus: `<path d="M5 12h14"/>`,
  x: `<path d="M18 6 6 18"/><path d="m6 6 12 12"/>`,
  check: `<path d="M20 6 9 17l-5-5"/>`,
  globe: `<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>`,
  "globe-sign": `<circle cx="12" cy="12" r="9"/><path d="M12 3a13 13 0 0 0 0 18"/><path d="M3 12h9"/><path d="m14 15 2.5 2.5L21 13"/>`,
  user: `<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>`,
  "user-plus": `<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6"/><path d="M22 11h-6"/>`,
  users: `<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>`,
  history: `<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l3 2"/>`,
  "chat-smile": `<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/><path d="M8.5 13.5a4 4 0 0 0 7 0"/><path d="M9 9.5h.01"/><path d="M15 9.5h.01"/>`,
  "chat-spark": `<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/><path d="${star4(12, 11.5, 4)}" fill="#1F2533" stroke="none"/>`,
  "analysis": `<path d="M20.5 12a8.5 8.5 0 1 1-2.5-6"/><path d="M18.5 2.5V6.5h-4"/><path d="M8.5 11h7"/><path d="M8.5 14.5h4.5"/><path d="m17.5 17.5 3 3"/>`,
  "list-checks": `<rect width="18" height="18" x="3" y="3" rx="4"/><path d="m7 9 1.2 1.2L10.5 8"/><path d="m7 15 1.2 1.2 2.3-2.2"/><path d="M13 9h4"/><path d="M13 15h4"/>`,
  "triangle-alert": `<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>`,
  info: `<circle cx="12" cy="12" r="10"/><path d="M12 7.5v5.5"/><path d="M12 16.5h.01"/>`,
  sparkles: `<path d="${star4(10.5, 10.5, 8)}"/><path d="${star4(18.5, 18.5, 3)}"/>`,
  "open-in": `<path d="M3 11V6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3h-5"/><rect width="8" height="8" x="3" y="13" rx="2"/><path d="m12 12 5-5"/><path d="M12.5 7H17v4.5"/>`,
  "circle-check": `<circle cx="12" cy="12" r="10"/><path d="m8.5 12.5 2.3 2.3 4.7-5"/>`,
  "circle-dashed": `<path d="M10.1 2.18a9.93 9.93 0 0 1 3.8 0"/><path d="M17.6 3.71a9.95 9.95 0 0 1 2.69 2.7"/><path d="M21.82 10.1a9.93 9.93 0 0 1 0 3.8"/><path d="M20.29 17.6a9.95 9.95 0 0 1-2.7 2.69"/><path d="M13.9 21.82a9.94 9.94 0 0 1-3.8 0"/><path d="M6.4 20.29a9.95 9.95 0 0 1-2.69-2.7"/><path d="M2.18 13.9a9.93 9.93 0 0 1 0-3.8"/><path d="M3.71 6.4a9.95 9.95 0 0 1 2.7-2.69"/>`,
  "edit-square": `<rect width="18" height="18" x="3" y="3" rx="4"/><path d="m14.5 8 1.5 1.5-5.5 5.5-2.2.7.7-2.2Z"/>`,
  "grip-vertical": `<circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/>`,
  search: `<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>`,
  filter: `<path d="M22 3H2l8 9.46V19l4 2v-8.54Z"/>`,
  calendar: `<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/>`,
  file: `<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/>`,
  "file-text": `<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>`,
  home: `<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .7-1.5l7-6a2 2 0 0 1 2.6 0l7 6a2 2 0 0 1 .7 1.5v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>`,
  settings: `<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>`,
  bell: `<path d="M10.27 21a2 2 0 0 0 3.46 0"/><path d="M3.26 15.33A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.67C19.41 13.96 18 12.5 18 8A6 6 0 0 0 6 8c0 4.5-1.41 5.96-2.74 7.33"/>`,
  logout: `<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>`,
  folder: `<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>`,
  mail: `<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>`,
  star: `<path d="M11.5 2.3a.53.53 0 0 1 .95 0l2.31 4.68a2.1 2.1 0 0 0 1.6 1.16l5.16.76a.53.53 0 0 1 .3.9l-3.74 3.64a2.1 2.1 0 0 0-.6 1.87l.88 5.14a.53.53 0 0 1-.77.56l-4.62-2.43a2.1 2.1 0 0 0-1.97 0L6.4 21a.53.53 0 0 1-.77-.56l.88-5.14a2.1 2.1 0 0 0-.6-1.87L2.17 9.79a.53.53 0 0 1 .3-.9l5.16-.76a2.1 2.1 0 0 0 1.6-1.16z"/>`,
  menu: `<path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/>`,
  "pen-sign": `<path d="M12 20h9"/><path d="M16.38 3.62a1 1 0 0 1 3 3L7.37 18.64a2 2 0 0 1-.85.5l-2.87.84a.5.5 0 0 1-.62-.62l.84-2.87a2 2 0 0 1 .5-.85z"/>`,
  eye: `<path d="M2.06 12.35a1 1 0 0 1 0-.7 10.75 10.75 0 0 1 19.88 0 1 1 0 0 1 0 .7 10.75 10.75 0 0 1-19.88 0"/><circle cx="12" cy="12" r="3"/>`,
  trash: `<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>`,
  copy: `<rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>`,
  send: `<path d="M14.54 21.69a.5.5 0 0 0 .94-.03l6.5-19a.5.5 0 0 0-.64-.64l-19 6.5a.5.5 0 0 0-.03.94l7.93 3.18a2 2 0 0 1 1.11 1.11z"/><path d="m21.85 2.15-10.94 10.94"/>`,
  paperclip: `<path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/>`,
  refresh: `<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>`,
  archive: `<rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/>`,
  tag: `<path d="M12.59 2.59A2 2 0 0 0 11.17 2H4a2 2 0 0 0-2 2v7.17a2 2 0 0 0 .59 1.41l8.7 8.71a2.43 2.43 0 0 0 3.42 0l6.58-6.58a2.43 2.43 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="#1F2533"/>`,
  clock: `<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>`,
  "help-circle": `<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>`,
  grid: `<circle cx="5" cy="5" r="1.5"/><circle cx="12" cy="5" r="1.5"/><circle cx="19" cy="5" r="1.5"/><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/><circle cx="5" cy="19" r="1.5"/><circle cx="12" cy="19" r="1.5"/><circle cx="19" cy="19" r="1.5"/>`,
  sliders: `<path d="M21 4h-7"/><path d="M10 4H3"/><path d="M21 12h-9"/><path d="M8 12H3"/><path d="M21 20h-5"/><path d="M12 20H3"/><path d="M14 2v4"/><path d="M8 10v4"/><path d="M16 18v4"/>`,
  "arrow-up-down": `<path d="m21 16-4 4-4-4"/><path d="M17 20V4"/><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/>`,
  "external-link": `<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>`,
  "dot": `<circle cx="12" cy="12" r="5" fill="#1F2533" stroke="none"/>`,
};

const LOGO =
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">` +
  `<defs><linearGradient id="g" x1="3" y1="4" x2="20" y2="21" gradientUnits="userSpaceOnUse"><stop stop-color="#1F3FD8"/><stop offset="1" stop-color="#B067F5"/></linearGradient></defs>` +
  `<circle cx="16" cy="9" r="7" fill="#D8CCFB"/>` +
  `<path d="${star4(11, 13, 10)}" fill="url(#g)"/></svg>`;

const created = [];
for (const [name, paths] of Object.entries(ICONS)) {
  const node = figma.createNodeFromSvg(S(paths));
  const comp = figma.createComponent();
  comp.name = "icon/" + name;
  comp.resize(24, 24);
  comp.fills = [];
  for (const child of [...node.children]) {
    comp.appendChild(child);
    child.constraints = { horizontal: "SCALE", vertical: "SCALE" };
  }
  node.remove();
  iconsFrame.appendChild(comp);
  created.push(comp.id);
}
{
  const node = figma.createNodeFromSvg(LOGO);
  const comp = figma.createComponent();
  comp.name = "icon/logo-spark";
  comp.resize(24, 24);
  comp.fills = [];
  for (const child of [...node.children]) {
    comp.appendChild(child);
    child.constraints = { horizontal: "SCALE", vertical: "SCALE" };
  }
  node.remove();
  iconsFrame.appendChild(comp);
  created.push(comp.id);
}
return JSON.stringify({ libId: lib.id, iconsFrameId: iconsFrame.id, count: created.length });
