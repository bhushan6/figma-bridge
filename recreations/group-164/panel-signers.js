// Panel C: the "Signers" dialog (screenshot 37:2667), 792 x 424, measured from a 2x export.
// Run with ./run.sh panel-signers.js — replaces "Signers" inside "Group 164 – Recreated".
const INK = "#1E2939";
const BODY = "#4A5565";
const MUTED = "#6A7282";
const LINE = "#F3F4F6";
const SURFACE = "#F9FAFB";

const shot = await figma.getNodeByIdAsync("37:2667");
const p = panel("Signers", shot, 792, 424);
p.fills = solid("#FFFFFF");
stroke(p, LINE, 1);
await copyStyle(p, shot.id);

// Header.
place(p, rect("Header", 792, 83, SURFACE), 0, 0);
label(p, "موقعين", 63, { size: 22, weight: "Medium", color: INK, name: "Title" }, { right: 752, cy: 42 });

// Close button, shown with its focus ring.
const close = frame("Close", { x: 38, y: 21 });
close.resize(28.5, 41.5);
close.fills = solid("#FFFFFF");
close.cornerRadius = 7;
stroke(close, "#8FA8D5", 3);
p.appendChild(close);
place(close, await ic("x", 29, "#99A1AF", 1.5), -0.25, 2.5);

// Contract status.
label(p, "حالة العقد", 74.5, { weight: "Medium", size: 16, color: MUTED, name: "Status label" }, { right: 752.5, cy: 119 });
const pill = row("Status", 38.5, { paddingLeft: 13, paddingRight: 13, itemSpacing: 12, cornerRadius: 19.25 });
pill.fills = solid(SURFACE);
pill.appendChild(fit(text("مكتمل", { weight: "Medium", size: 20, color: "#008236", name: "Label" }), 47));
const dot = figma.createEllipse();
dot.name = "Dot";
dot.resize(13, 13);
dot.fills = solid("#00A63E");
pill.appendChild(dot);
place(p, pill, 746 - pill.width, 144.5);

// Signer row: number, avatar, name and email, role badge; signed state on the left; green accent on the right.
const r = frame("Signer", { x: 27, y: 211 });
r.resize(738.5, 97);
r.fills = solid(SURFACE);
r.topLeftRadius = r.bottomLeftRadius = 12;
r.clipsContent = true;
p.appendChild(r);
place(r, rect("Accent", 4, 97, "#4ADE80"), 734.5, 0);
const R = (x) => x - 27; // panel x -> row x
const Y = (y) => y - 211;

textAt(r, text("1", { size: 20, color: BODY, name: "Index" }), { cx: R(735.5), cy: Y(258.5) });

const avatar = figma.createEllipse();
avatar.name = "Avatar";
avatar.resize(48, 48);
avatar.fills = solid("#FFFFFF", 0);
stroke(avatar, "#E9EBEE", 1.5);
place(r, avatar, R(672), Y(235.5));
svgAt(r, `<svg width="29" height="30" viewBox="0 0 29 30" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="${BODY}" stroke-width="1.7" stroke-linecap="round"><circle cx="14.5" cy="7" r="5.75"/><path d="M2.5 29c0-6.5 5.4-11 12-11s12 4.5 12 11"/></svg>`, "User", R(686), Y(245));

label(r, "خالد الشهري", 91.5, { size: 20, weight: "Medium", color: INK, name: "Name" }, { right: R(659), cy: Y(247) });
label(r, "(أنا)", 27, { weight: "Medium", size: 18, color: MUTED, name: "You" }, { right: R(557), cy: Y(246) });
label(r, "ksh@qanoniah.com", 139, { weight: "Medium", size: 18, color: MUTED, name: "Email", align: "LEFT" }, { right: R(659), cy: Y(278.5) });

const badge = row("Role", 33.5, { paddingLeft: 9.5, paddingRight: 9.5, itemSpacing: 7, cornerRadius: 16.75 });
badge.fills = solid(LINE);
badge.appendChild(fit(text("موقع", { weight: "Medium", size: 16, color: BODY, name: "Label" }), 30.5));
badge.appendChild(svg(`<svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.6 0.6c.6.5.6 1.4 0 2L8.2 8.4 5.4 9.2l.9-2.7L12.8.5c.5-.5 1.3-.5 1.8.1Z" fill="${BODY}"/><path d="M5 8.6 3.4 10.2" stroke="${BODY}" stroke-width="1.6" stroke-linecap="round"/><path d="M.8 11c1.2-.9 2.2-1.1 3 0 .8 1 1.6 1 2.4.2.8-.8 1.6-.9 2.4-.2.7.6 1.5.6 2.4 0" stroke="${BODY}" stroke-width="1.6" stroke-linecap="round"/></svg>`, "Signature"));
place(r, badge, R(519) - badge.width, Y(230));

const signed = row("Signed", 24, { itemSpacing: 9.5 });
signed.appendChild(fit(text("تم التوقيع", { weight: "Medium", size: 18, color: MUTED, name: "Label" }), 71.5));
signed.appendChild(svg(`<svg width="22.5" height="22.5" viewBox="0 0 22.5 22.5" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="11.25" cy="11.25" r="11.25" fill="#1F50AB"/><path d="m7.2 11.6 2.7 2.6 5.4-5.4" stroke="#FFFFFF" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`, "Check"));
place(r, signed, R(49.5), Y(259.5) - 12);

// Footer.
place(p, rect("Divider", 792, 1.5, LINE), 0, 333);
const btn = row("Close button", 51, { primaryAxisAlignItems: "CENTER", cornerRadius: 10 });
btn.primaryAxisSizingMode = "FIXED";
btn.resize(127, 51);
btn.fills = solid("#FFFFFF");
stroke(btn, "#E5E7EB", 1.5);
btn.appendChild(fit(text("إغلاق", { size: 20, weight: "Medium", color: "#1F2937", name: "Label" }), 44));
place(p, btn, 27, 353.5);

figma.viewport.scrollAndZoomIntoView([p]);
return { id: p.id, root: root.id };
