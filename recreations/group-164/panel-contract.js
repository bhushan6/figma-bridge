// Panel B: contract page with clauses 24–25 and the signatures block (Group 163, 37:2668),
// 1114 x 898, measured from a 2x export. Body in Noto Sans Arabic; the signatures block in Arial,
// as in the screenshot. Signature 1 reuses the dialog's vector; signature 2 is handwriting, kept as
// a cut-out image (out/sig2.png, uploaded separately by contract.sh).
// Run with ./contract.sh — replaces "Contract page" inside "Group 164 – Recreated".
const HEAD = "#0F172A";
const TEXT = "#151B2C";
const LABEL = "#0A0A0A";
const GREY = "#4B5563";
const DIVIDER = "#EBEEF3";
const GREEN = "#41DB6D";
const AMBER = "#F9BE40";
const RLM = "‏";

const group = await figma.getNodeByIdAsync("37:2668");
const p = panel("Contract page", group, 1114, 898);
p.fills = solid("#FFFFFF");
await copyStyle(p, "37:2669");

const noto = { regular: { family: "Noto Sans Arabic", style: "Regular" }, bold: { family: "Noto Sans Arabic", style: "Bold" } };
const arial = { regular: { family: "Arial", style: "Regular" }, bold: { family: "Arial", style: "Bold" } };
const mono = { family: "IBM Plex Mono", style: "Regular" };
for (const f of [noto.regular, noto.bold, arial.regular, arial.bold, mono]) await figma.loadFontAsync(f);

function t(chars, fontName, size, color, name) {
  const n = figma.createText();
  n.fontName = fontName;
  n.fontSize = size;
  n.characters = chars;
  n.fills = solid(color);
  n.textAlignHorizontal = "RIGHT";
  n.name = name || chars.slice(0, 40);
  return n;
}
// One size for a whole paragraph, taken from its widest line.
function sizeFor(chars, fontName, w) {
  const probe = fit(t(chars, fontName, 20, TEXT), w);
  const s = probe.fontSize;
  probe.remove();
  return s;
}

// ---------- Clauses ----------
place(p, rect("Divider", 942.5, 2, DIVIDER), 121.5, 28.5);

// Clause number and title as separate texts: the gap between them differs per heading.
function heading(num, title, titleRight, titleW, numW, cy) {
  const tt = fit(t(title, noto.bold, 28, HEAD, `Heading ${num}`), titleW);
  textAt(p, fit(t(`${RLM}${num}.`, noto.bold, tt.fontSize, HEAD, `Heading ${num} · number`), numW), { right: 1063, cy });
  return textAt(p, tt, { right: titleRight, cy });
}
heading(24, "تسوية النزاعات", 1004.5, 177.5, 46, 90.5);

const P1 = [
  "يسعى الطرفان إلى تسوية أي نزاع ينشأ عن هذه الاتفاقية أو يتعلق بها بالتفاوض المباشر بين ممثليهما المفوضين خلال ثلاثين (30) يوماً",
  "من تاريخ قيام أحدهما بإشعار الطرف الآخر كتابياً بالنزاع. فإذا لم يتم تسوية النزاع خلال تلك المدة، تختص المحكمة التجارية في",
  "المملكة العربية السعودية بالفصل في النزاع:",
];
const BODY = sizeFor(P1[0], noto.regular, 1014);
for (const [i, l] of P1.entries()) textAt(p, t(RLM + l, noto.regular, BODY, TEXT, `Clause 24 · line ${i + 1}`), { right: 1064, cy: 152 + 44 * i });

const note = row("Notes", 36, { primaryAxisAlignItems: "CENTER", cornerRadius: 6 });
note.primaryAxisSizingMode = "FIXED";
note.resize(423, 36);
note.fills = solid("#ECF9F0");
note.appendChild(fit(t("لا توجد ملاحظات", noto.regular, BODY, TEXT, "Label"), 125));
place(p, note, 642, 253.5);

place(p, rect("Divider", 943, 2, DIVIDER), 121, 321);
heading(25, "التوقيعات والنسخ", 1009, 196, 45, 389.5);
const P2 = [
  "حررت هذه الاتفاقية من نسختين أصليتين متطابقتين، تسلم كل طرف نسخة للعمل بموجبها، ويقر الطرفان بتوقيع بيان العمل واتفاقية",
  "مستوى الخدمة المرفقين باتفاقية الخدمة.",
];
for (const [i, l] of P2.entries()) textAt(p, t(RLM + l, noto.regular, BODY, TEXT, `Clause 25 · line ${i + 1}`), { right: 1064, cy: 452.5 + 44 * i });

// ---------- Signatures ----------
const sigs = frame("Signatures", { x: 0, y: 530 });
sigs.resize(1114, 340);
p.appendChild(sigs);
const S = (y) => y - 530; // panel y -> block y
textAt(sigs, fit(t("التوقيعات:", arial.bold, 22, LABEL, "Title"), 88), { right: 1055.5, cy: S(563) });

function bracket(name, d, color, x, y) {
  return svgAt(sigs, `<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="${d}" stroke="${color}" stroke-width="2"/></svg>`, name, x, y);
}
async function party(n, chars, labelW, color, code, dx, dy, dyLabel = dy) {
  const g = [];
  const dot = figma.createEllipse();
  dot.name = "Bullet";
  dot.resize(6.5, 6.5);
  dot.fills = solid(LABEL);
  g.push(place(sigs, dot, 1036, S(645.25 + dyLabel)));
  g.push(textAt(sigs, fit(t(chars, arial.bold, 18, LABEL, "Label"), labelW), { right: 1020, cy: S(646.5 + dyLabel) }));
  g.push(textAt(sigs, fit(t("تم التوقيع بواسطة", arial.regular, 10, GREY, "Signed by"), 72), { right: 821.5 + dx, cy: S(616.5 + dy) }));
  g.push(bracket("Corner", "M0 1H16V17", color, 824.5 + dx, S(613.5 + dy)));
  g.push(bracket("Corner", "M1 0V16H17", color, 642 + dx, S(663.5 + dy)));
  const c = t(code, mono, 10, GREY, "Code");
  c.letterSpacing = { unit: "PERCENT", value: 4 };
  g.push(textAt(sigs, fit(c, 77), { right: 832.5 + dx, cy: S(671 + dy) }));
  const grp = figma.group(g, sigs);
  grp.name = `Party ${n}`;
  return grp;
}
const p1 = await party(1, "توقيع الطرف الأول:", 138, GREEN, "ITU8-89XT-U8YD", 0, 0);
const sig1 = (await figma.getNodeByIdAsync("37:2680")).clone();
sig1.name = "Signature";
sig1.rescale(67.5 / sig1.width);
sig1.strokeWeight = 1.3;
p1.appendChild(sig1);
sig1.x = 707.5;
sig1.y = S(636);

const p2 = await party(2, "توقيع الطرف الثاني:", 142, AMBER, "L9KX-DW4T-RDNS", 7.5, 159.5, 156.5);
const sig2 = rect("Signature", 132, 38, null);
p2.appendChild(sig2);
sig2.x = 686.5;
sig2.y = S(785);

figma.viewport.scrollAndZoomIntoView([p]);
return { id: p.id, sig2: sig2.id, BODY };
