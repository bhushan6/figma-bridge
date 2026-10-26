// Group 87 (1:35): RTL email inbox with the CLM signature-request email (node units, 1587 x 991).
const INK = "#202124";
const GREY = "#5F6368";
const LIGHT = "#80868B";
const LINE = "#ECEDEF";
const NAME = "Email inbox – Signature request";
const root = await figma.getNodeByIdAsync(ROOT_ID);
const AR = (chars, size, opts = {}) => text(chars, { font: "noto", size, color: INK, ...opts });

// ---------- Email row component ----------
const ROW_H = 42.8;
const rowComp = await replaceComponent("Inbox/Email row", async () => {
  const c = makeComponent("Inbox/Email row", 1217, ROW_H, "#FFFFFF");
  c.strokes = solid(LINE);
  c.strokeTopWeight = 0; c.strokeLeftWeight = 0; c.strokeRightWeight = 0; c.strokeBottomWeight = 1;
  c.strokeAlign = "INSIDE";
  const X = 69; // row origin in group coordinates
  const senderKey = c.addComponentProperty("Sender", "TEXT", "ليزلي ألكسندر");
  const subjectKey = c.addComponentProperty("Subject", "TEXT", "مرحباً");
  const snippetKey = c.addComponentProperty("Snippet", "TEXT", "هذا نص تجريبي لعنوان الرسالة وبعض المحتوى التعريفي...");
  const dateKey = c.addComponentProperty("Date", "TEXT", "10:41 م");
  const box = rect("Checkbox", 14, 14, null, 2);
  stroke(box, "#9AA0A6", 1.6);
  place(c, box, 1261 - X - 7, ROW_H / 2 - 7);
  await iconAt(c, "star", 17, "#BDC1C6", 1214 - X, ROW_H / 2);
  const sender = textAt(c, AR("ليزلي ألكسندر", 16, { weight: "Bold", name: "Sender" }), { right: 1172 - X, cy: ROW_H / 2 });
  sender.componentPropertyReferences = { characters: senderKey };

  const line = autoLayout("HORIZONTAL", { name: "Subject line", itemSpacing: 6, counterAxisAlignItems: "CENTER", primaryAxisAlignItems: "MAX" });
  line.primaryAxisSizingMode = "FIXED";
  line.resize(640, 20);
  const snippet = AR("هذا نص تجريبي لعنوان الرسالة وبعض المحتوى التعريفي...", 15, { color: GREY, name: "Snippet" });
  line.appendChild(snippet);
  line.appendChild(AR("-", 15, { color: GREY, name: "Dash" }));
  const subject = AR("مرحباً", 15, { weight: "Bold", name: "Subject" });
  line.appendChild(subject);
  place(c, line, 946 - X - 640, ROW_H / 2 - 10);
  snippet.componentPropertyReferences = { characters: snippetKey };
  subject.componentPropertyReferences = { characters: subjectKey };

  const date = textAt(c, AR("10:41 م", 15, { weight: "Bold", align: "LEFT", name: "Date" }), { left: 96.8 - X, cy: ROW_H / 2 });
  date.componentPropertyReferences = { characters: dateKey };
  return c;
});

// ---------- Screen ----------
const old = root.findChild((n) => n.name === NAME);
if (old) old.remove();
const s = frame(NAME, { clipsContent: true });
s.resize(1587, 991);
s.fills = solid("#FFFFFF");

// Top bar
await iconAt(s, "menu", 24, GREY, 1546, 34);
const mLogo = svg(
  `<svg width="40" height="30" viewBox="0 0 40 30" xmlns="http://www.w3.org/2000/svg">` +
  `<path d="M3 9 L3 30 L10 30 L10 14 Z" fill="#4285F4"/><path d="M30 14 L30 30 L37 30 L37 9 Z" fill="#34A853"/>` +
  `<path d="M3 4 L20 17 L37 4 L37 11 L20 24 L3 11 Z" fill="#EA4335"/><path d="M30 9.3 L37 4 L37 11 L30 16.3 Z" fill="#FBBC04"/><path d="M3 4 L10 9.3 L10 16.3 L3 11 Z" fill="#C5221F"/></svg>`,
  "Mail logo"
);
place(s, mLogo, 1472, 19);
textAt(s, text("Gmail", { font: "inter", size: 25, color: GREY, align: "LEFT", name: "Product name" }), { left: 1398, cy: 34 });
const search = frame("Search");
search.resize(796, 49);
search.fills = solid("#EAF1FB");
search.cornerRadius = 8;
place(s, search, 512, 9.5);
await iconAt(search, "search", 22, GREY, 1279 - 512, 25);
textAt(search, AR("البحث في البريد", 17, { color: GREY }), { right: 1249 - 512, cy: 26 });
const caret = svg(`<svg width="10" height="6" viewBox="0 0 10 6" xmlns="http://www.w3.org/2000/svg"><path d="M0 0 L10 0 L5 6 Z" fill="${GREY}"/></svg>`, "Search options");
place(search, caret, 535 - 512 - 5, 22);
await iconAt(s, "help-circle", 24, GREY, 200.8, 34);
await iconAt(s, "settings", 24, GREY, 151.6, 34);
await iconAt(s, "grid", 20, GREY, 102.4, 34);
const ring = figma.createEllipse(); ring.name = "Account ring"; ring.resize(38, 38);
ring.fills = [{ type: "GRADIENT_ANGULAR", gradientTransform: [[1, 0, 0], [0, 1, 0]], gradientStops: [
  { position: 0, color: { ...hex("#EA4335"), a: 1 } }, { position: 0.25, color: { ...hex("#FBBC04"), a: 1 } },
  { position: 0.5, color: { ...hex("#34A853"), a: 1 } }, { position: 0.75, color: { ...hex("#4285F4"), a: 1 } }, { position: 1, color: { ...hex("#EA4335"), a: 1 } }] }];
place(s, ring, 45.2 - 19, 34 - 19);
const avatar = figma.createEllipse(); avatar.name = "Account avatar"; avatar.resize(32, 32); avatar.fills = solid("#DADCE0"); stroke(avatar, "#FFFFFF", 1.5, "OUTSIDE");
place(s, avatar, 45.2 - 16, 34 - 16);
await iconAt(s, "user", 18, GREY, 45.2, 34);

// Google apps strip
vline(s, 69, 68, 991, LINE);
const apps = [
  ["Calendar", "#4285F4", 104, `<rect x="2" y="2" width="20" height="20" rx="3" fill="#FFFFFF" stroke="#4285F4" stroke-width="2"/><path d="M2 7h20" stroke="#4285F4" stroke-width="3"/><path d="M8.5 11.5h3l-1.8 2.2a1.6 1.6 0 1 1-1.2 2.6" stroke="#1A73E8" stroke-width="1.5" fill="none"/><path d="M14 12l1.5-0.8V18" stroke="#1A73E8" stroke-width="1.5" fill="none"/>`],
  ["Keep", "#FBBC04", 165.8, `<rect x="3" y="2" width="18" height="20" rx="2.5" fill="#FBBC04"/><circle cx="12" cy="11" r="3.5" fill="#FFFFFF"/><rect x="10.5" y="14.5" width="3" height="2.5" fill="#FFFFFF"/>`],
  ["Tasks", "#4285F4", 225.4, `<circle cx="12" cy="12" r="10" fill="#4285F4"/><path d="m8 12.5 3 3 5.5-6" stroke="#FFFFFF" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`],
  ["Contacts", "#4285F4", 284, `<circle cx="12" cy="12" r="10" fill="#1A73E8"/><circle cx="12" cy="9.5" r="3.3" fill="#FFFFFF"/><path d="M6.5 17.5c1.2-2.4 3.2-3.5 5.5-3.5s4.3 1.1 5.5 3.5" fill="#FFFFFF"/>`],
];
for (const [name, , cy, inner] of apps) {
  const n = svg(`<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`, name);
  place(s, n, 36.5 - 12, cy - 12);
}
hline(s, 24, 50, 338, LINE);
await iconAt(s, "plus", 22, GREY, 36.5, 384);
await iconAt(s, "chevron-right", 18, GREY, 36.5, 952);
hline(s, 69, 1288, 68, LINE);

// Navigation (right)
const compose = autoLayout("HORIZONTAL", { name: "Compose", itemSpacing: 12, paddingLeft: 30, paddingRight: 18, counterAxisAlignItems: "CENTER", primaryAxisAlignItems: "MAX", cornerRadius: 26 });
compose.fills = solid("#FFFFFF");
compose.primaryAxisSizingMode = "FIXED";
compose.counterAxisSizingMode = "FIXED";
compose.resize(140.4, 52.3);
shadow(compose, { y: 1, blur: 4, opacity: 0.25, color: "#3C4043" });
compose.appendChild(AR("إنشاء", 16, { color: "#3C4043" }));
compose.appendChild(svg(`<svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg"><path d="M13 3v8" stroke="#EA4335" stroke-width="3.4" stroke-linecap="round"/><path d="M13 15v8" stroke="#34A853" stroke-width="3.4" stroke-linecap="round"/><path d="M15 13h8" stroke="#FBBC04" stroke-width="3.4" stroke-linecap="round"/><path d="M3 13h8" stroke="#4285F4" stroke-width="3.4" stroke-linecap="round"/></svg>`, "Compose plus"));
place(s, compose, 1434.6, 88.9);
const active = rect("Active", 280, 40, "#FCE8E6", 0);
active.topLeftRadius = active.bottomLeftRadius = 20;
place(s, active, 1307.6, 160);
const NAV = [
  ["البريد الوارد", "inbox", 180, "3", true],
  ["المميزة بنجمة", "star", 221.4], ["المؤجلة", "clock", 263.4], ["المرسلة", "send", 305.5],
  ["المسودات", "file", 346.8, "1", false, true], ["الرسائل غير المرغوب فيها", "info", 388.8, "3"],
  ["المهملات", "trash", 430.9], ["التصنيفات", "tag", 476.9, null, false, true], ["المزيد", "chevron-down", 519.7],
];
for (const [label, iconName, cy, count, isActive, bold] of NAV) {
  const color = isActive ? "#D93025" : "#3C4043";
  await iconAt(s, iconName, 21, isActive ? "#D93025" : GREY, 1543, cy);
  textAt(s, AR(label, 16, { color, weight: isActive || bold ? "Bold" : "Regular" }), { right: 1509, cy });
  if (count) textAt(s, AR(count, 14, { color: isActive ? "#D93025" : "#3C4043", weight: isActive ? "Bold" : "Regular", align: "CENTER" }), { cx: 1331.5, cy });
}
hline(s, 1288, 1587, 700.7, LINE);
textAt(s, AR("الاجتماعات", 17, { weight: "Bold" }), { right: 1553.7, cy: 728.4 });
const video = svg(`<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="6" width="14" height="12" rx="2" fill="${GREY}"/><path d="M16 10.5 22 7v10l-6-3.5z" fill="${GREY}"/></svg>`, "icon/video");
place(s, video, 1541.8 - 12, 773.7 - 12);
textAt(s, AR("مكالمة جديدة", 16, { color: "#3C4043" }), { right: 1509, cy: 773.7 });
const kb = svg(`<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="5" width="20" height="14" rx="2" fill="${GREY}"/><g fill="#FFFFFF"><rect x="5" y="8" width="2" height="2"/><rect x="9" y="8" width="2" height="2"/><rect x="13" y="8" width="2" height="2"/><rect x="17" y="8" width="2" height="2"/><rect x="5" y="12" width="2" height="2"/><rect x="9" y="12" width="2" height="2"/><rect x="13" y="12" width="2" height="2"/><rect x="17" y="12" width="2" height="2"/><rect x="8" y="15.5" width="8" height="1.6"/></g></svg>`, "icon/keyboard");
place(s, kb, 1541.8 - 12, 818 - 12);
textAt(s, AR("الانضمام إلى اجتماع", 16, { color: "#3C4043" }), { right: 1509, cy: 818 });
hline(s, 1288, 1587, 846.7, LINE);
textAt(s, AR("محادثات Hangouts", 17, { weight: "Bold" }), { right: 1553.7, cy: 874.4 });
const signin = autoLayout("HORIZONTAL", { name: "Sign in", primaryAxisAlignItems: "CENTER", counterAxisAlignItems: "CENTER", cornerRadius: 4 });
signin.fills = solid("#1A73E8");
signin.primaryAxisSizingMode = "FIXED";
signin.counterAxisSizingMode = "FIXED";
signin.resize(238, 45.2);
signin.appendChild(AR("تسجيل الدخول", 16, { color: "#FFFFFF" }));
place(s, signin, 1318.8, 905.4);
vline(s, 1288, 68, 991, LINE);

// List toolbar
const sel = rect("Select all", 16, 16, null, 2);
stroke(sel, GREY, 1.8);
place(s, sel, 1261 - 8, 97 - 8);
place(s, svg(`<svg width="8" height="5" viewBox="0 0 8 5" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h8L4 5z" fill="${GREY}"/></svg>`, "Select menu"), 1228, 95);
await iconAt(s, "refresh", 20, GREY, 1188, 97);
await iconAt(s, "more-vertical", 20, GREY, 1133, 97);
textAt(s, AR("1–50 من 2,619", 15, { color: GREY }), { right: 280, cy: 97.6 });
await iconAt(s, "chevron-right", 18, GREY, 142.8, 97.6);
await iconAt(s, "chevron-left", 18, GREY, 105.5, 97.6);
hline(s, 69, 1288, 119, LINE);

// Category tabs
await iconAt(s, "users", 22, "#D93025", 1253.7, 154.7);
textAt(s, AR("البريد الرئيسي", 17, { color: "#D93025", weight: "Bold" }), { right: 1219.6, cy: 154.7 });
place(s, rect("Active category", 265.8, 3.5, "#D93025", 2), 1011.7, 183);
async function categoryTab(iconName, iconX, title, badge, badgeColor, sub, right) {
  await iconAt(s, iconName, 22, GREY, iconX, 153);
  const row = autoLayout("HORIZONTAL", { name: title, itemSpacing: 8, counterAxisAlignItems: "CENTER" });
  const b = autoLayout("HORIZONTAL", { name: "New", paddingLeft: 6, paddingRight: 6, cornerRadius: 3, counterAxisAlignItems: "CENTER" });
  b.fills = solid(badgeColor);
  b.appendChild(AR(badge, 12.5, { color: "#FFFFFF", weight: "Medium" }));
  row.appendChild(b);
  row.appendChild(AR(title, 16, { weight: "Bold" }));
  place(s, row, right - row.width, 146 - row.height / 2);
  textAt(s, AR(sub, 13, { color: GREY }), { right, cy: 166.6 });
}
await categoryTab("tag", 969, "العروض الترويجية", "6 جديدة", "#188038", "التخفيضات والعروض", 942);
await categoryTab("users", 615, "الاجتماعية", "1 جديدة", "#1A73E8", "رسائل من LinkedIn و غيرها", 589.6);
hline(s, 69, 1288, 186.5, LINE);

// Rows
const FILLER = "هذا نص تجريبي لعنوان الرسالة وبعض المحتوى التعريفي";
const ROWS = [
  ["ليزلي ألكسندر", "مرحباً", FILLER + " الذي يظهر هنا في صندوق الوارد...", "10:41 م", { bold: true }],
  ["ثريزا ويب", "بناء النماذج الأولية بدون تعليمات برمجية", "هذا نص تجريبي لعنوان الرسالة وبعض المحتوى...", "12:01 م", { bold: true, star: true, chip: ["العروض الترويجية", "#A8DAE3", "#0B5563"] }],
  ["ألبرت فلوريس", "بناء النماذج الأولية بدون تعليمات برمجية", "هذا نص تجريبي لعنوان الرسالة وبعض المحتوى...", "11:59 ص", { bold: true }],
  ["جاكوب جونز", "لا تفعـل هذا", FILLER + " ....", "10:30 ص", { bold: true }],
  ["جاي هوكيئز", "نتائج اختبار المستخدمين", FILLER + "...", "5:49 ص", { bold: true, chip: ["التحديثات", "#E8453C", "#FFFFFF"] }],
  null, // the CLM signature request
  ["رالف إدواردز", "مرحباً بك للبدء", FILLER + " الذي يظهر هنا...", "25 أبريل"],
  ["داريل ستيوارد", "لقد فاتتك رسائل", "هذا نص تجريبي لعنوان المحتوى التعريفي...", "25 أبريل", { star: true }],
  ["دارلين روبرتسون", "مرحباً بك في قائمة البريد", FILLER, "", { hover: true }],
  ["ثريزا ويب", "خطط لليلة اليوم", FILLER + " ...", "25 أبريل"],
  ["ديفون لين", "لا تفعل في هذا", FILLER + " ...", "24 أبريل"],
  ["جاكوب جونز", "حسابك معنا", FILLER + " الذي يظهر هنا...", "23 أبريل"],
  ["ألبرت فلوريس", "نريد ملاحظاتك", FILLER + "...", "23 أبريل"],
  ["فلويد مايلز", "عيد ميلاد سعيد", FILLER + "...", "23 أبريل"],
  ["مارفن ماكيني", "بعض الملاحظات", FILLER + " ...", "18 أبريل"],
  ["إيستر هوارد", "(لا يوجد موضوع)", FILLER + " ...", "18 أبريل"],
  ["بيسي كوبر", "خطط لليلة اليوم", FILLER + "...", "18 أبريل"],
  ["ديان راسل", "كتاب الخطوط", FILLER + " ...", "6:17 م"],
  ["إيستر هوارد", "(لا يوجد موضوع)", FILLER + " ...", "18 أبريل"],
];
const CY = [209.5, 252.3, 295.2, 340.4, 384.8, 428.5, 476.1, 519, 564.2, 608.6, 650.7, 694.3, 737.2, 778.4, 818.9, 860.2, 900.6, 938.7, 977.6];
for (let i = 0; i < ROWS.length; i++) {
  const cy = CY[i];
  if (!ROWS[i]) continue;
  const [sender, subject, snippet, date, o = {}] = ROWS[i];
  const r = rowComp.createInstance();
  const props = {};
  for (const key of Object.keys(r.componentProperties)) {
    if (key.startsWith("Sender")) props[key] = sender;
    if (key.startsWith("Subject")) props[key] = subject;
    if (key.startsWith("Snippet")) props[key] = snippet;
    if (key.startsWith("Date")) props[key] = date;
  }
  r.setProperties(props);
  if (!o.bold) {
    const d = r.findOne((n) => n.name === "Date");
    d.fontName = F.notoRegular;
    d.fills = solid("#3C4043");
  }
  if (o.star) r.findOne((n) => n.type === "INSTANCE" && n.name === "icon/star").findAll((n) => n.type === "VECTOR").forEach((v) => { v.fills = solid("#F4B400"); v.strokes = solid("#F4B400"); });
  if (o.hover) r.fills = solid("#F2F2F2");
  place(s, r, 69, cy - ROW_H / 2);
  if (o.chip) {
    const [label, bg, fg] = o.chip;
    const chip = autoLayout("HORIZONTAL", { name: "Label: " + label, paddingLeft: 9, paddingRight: 9, paddingTop: 3, paddingBottom: 3, cornerRadius: 4, counterAxisAlignItems: "CENTER" });
    chip.fills = solid(bg);
    chip.appendChild(AR(label, 14, { color: fg, weight: "Medium" }));
    place(s, chip, 1009 - chip.width, cy - chip.height / 2);
    // Instances can't resize their children, so detach this row to make room for the label.
    const detached = r.detachInstance();
    detached.name = "Email row (labelled)";
    const line = detached.findOne((n) => n.name === "Subject line");
    line.resize(640 - (946 - (1009 - chip.width - 14)), 20);
  }
  if (o.hover) {
    for (const [iconName, x] of [["archive", 250.7], ["trash", 211], ["mail", 170.6], ["clock", 127.8], ["more-vertical", 92]]) await iconAt(s, iconName, 20, GREY, x, cy);
  }
}

// The CLM signature-request email (the small inserted strip in the original).
const clm = frame("Signature request email", { clipsContent: true });
clm.resize(1216.5, 40);
clm.fills = solid("#E8F0FE");
place(s, clm, 69, 409);
place(clm, rect("Focus", 3, 40, "#1A73E8"), 1213.5, 0);
const strip = frame("Row content");
strip.resize(1196, 30);
place(clm, strip, 84 - 69, 6);
const SZ = 9.5;
const sbox = rect("Checkbox", 9, 9, null, 1.5); stroke(sbox, "#9AA0A6", 1.2); place(strip, sbox, 1166, 10.5);
await iconAt(strip, "star", 11, "#BDC1C6", 1145, 15);
place(strip, svg(`<svg width="12" height="9" viewBox="0 0 12 9" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h8l4 4.5L8 9H0l3-4.5z" fill="#1A73E8"/></svg>`, "Important"), 1117, 10.5);
const from = autoLayout("HORIZONTAL", { name: "From", itemSpacing: 2, counterAxisAlignItems: "CENTER" });
from.appendChild(text("noreplay", { font: "inter", size: SZ, color: INK }));
const clmTag = autoLayout("HORIZONTAL", { name: "CLM", paddingLeft: 1.5, paddingRight: 1.5 });
clmTag.fills = solid("#FDE68A");
clmTag.appendChild(text("CLM", { font: "inter", size: SZ, color: INK, weight: "Medium" }));
from.appendChild(clmTag);
place(strip, from, 1103 - from.width, 15 - from.height / 2);
const inboxChip = autoLayout("HORIZONTAL", { name: "Label: Inbox", paddingLeft: 4, paddingRight: 4, paddingTop: 1, paddingBottom: 1, cornerRadius: 2 });
inboxChip.fills = solid("#DADCE0");
inboxChip.appendChild(AR("البريد الوارد", 7, { color: "#3C4043" }));
place(strip, inboxChip, 975 - inboxChip.width, 15 - inboxChip.height / 2);
const subj = AR("طلب توقيع - اتفاقية سرية المعلومات (خالد الشهري)", SZ, { weight: "Bold", name: "Subject" });
textAt(strip, subj, { right: 928, cy: 15 });
const snip = AR("- خالد الشهري. طلب توقيع على مستند. مرحباً خالد الشهري. أرسل إليك خالد الشهري مستند \"اتفاقية سرية المعلومات\". يتطلب مراجعتك وتوقيعك الإلكتروني", SZ, { color: GREY, name: "Snippet" });
textAt(strip, snip, { right: 928 - subj.width - 4, cy: 15 });
textAt(strip, AR("23 يوليو", SZ, { align: "LEFT", name: "Date" }), { left: 15, cy: 15 });
place(strip, rect("Underline", 76, 1.2, "#EA4335"), 835, 22.5);

root.appendChild(s);
s.x = 343;
s.y = 7034;
await copyStyle(s, "1:36");
return JSON.stringify({ id: s.id });
