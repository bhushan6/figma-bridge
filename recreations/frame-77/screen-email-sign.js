// 1:5 — signature-request email; 1:4 — signing landing page; 1:6 — loose text label.
const NAVY = "#1E3A9E";
const INK = "#1F2533";
const GREY = "#4B5563";
const MUTED = "#6B7280";
const LINE = "#E3E7EE";
const root = await figma.getNodeByIdAsync(ROOT_ID);
const N = (chars, size, opts = {}) => text(chars, { font: "noto", size, color: INK, ...opts });

// ---------- Brand logo ----------
const logo = await replaceComponent("Brand/Qanoniah logo", async () => {
  const c = makeComponent("Brand/Qanoniah logo", 164, 60, null);
  const mark = svg(
    `<svg width="56" height="60" viewBox="0 0 56 60" xmlns="http://www.w3.org/2000/svg">` +
    `<circle cx="28" cy="27" r="22" stroke="${NAVY}" stroke-width="7" fill="none"/>` +
    `<circle cx="31" cy="24" r="9" fill="${NAVY}"/><circle cx="31" cy="24" r="4" fill="#FFFFFF"/>` +
    `<path d="M11 52 C22 58 38 58 50 49" stroke="${NAVY}" stroke-width="5.5" stroke-linecap="round" fill="none"/></svg>`,
    "Mark"
  );
  place(c, mark, 108, 0);
  const ar = fit(text("قانونية", { font: "noto", weight: "Bold", size: 38, color: NAVY, name: "Wordmark" }), 104);
  textAt(c, ar, { right: 104, cy: 20 });
  const en = fit(text("Qanoniah", { font: "inter", weight: "SemiBold", size: 22, color: NAVY, align: "LEFT", name: "Latin wordmark" }), 100);
  textAt(c, en, { left: 2, cy: 47 });
  return c;
});

// ---------- 1:5 Email (node units = raw px x 0.6954) ----------
{
  const NAME = "Email – Signature request";
  const old = root.findChild((n) => n.name === NAME);
  if (old) old.remove();
  const k = 0.6954;
  const s = frame(NAME, { clipsContent: true });
  s.resize(906, 1174);
  s.fills = solid("#F6F8FB");

  const card = frame("Card", { clipsContent: true });
  card.resize(852, 1141);
  card.fills = solid("#F7F9FC");
  card.cornerRadius = 12;
  stroke(card, LINE, 1.5);
  place(s, card, 26, 17);
  const X = 26, Y = 17;
  place(card, rect("Top section", 852, 508, "#FFFFFF"), 0, 0);
  place(card, rect("Accent", 852, 6, NAVY), 0, 0);
  place(card, rect("Divider", 852, 2.5, "#DDE3EC"), 0, 525 - Y);

  const lg = logo.createInstance();
  card.appendChild(lg);
  lg.rescale(198 / 164);
  lg.x = 352 - X;
  lg.y = 90 - Y;

  const C = (t, cx, cy) => textAt(card, t, { cx: cx - X, cy: cy - Y });
  const Rt = (t, right, cy) => textAt(card, t, { right: right - X, cy: cy - Y });
  C(N("طلب توقيع على مستند", 19, { weight: "Bold", align: "CENTER" }), 451, 221);
  Rt(N("مرحباً احمد بن عبدالعزيز", 15.5), 803, 280);
  const sent = N('أرسل إليك Omar Mohammed مستند "قرارات مجلس الإدارة"', 15.5, { name: "Sent by" });
  const nameStart = sent.characters.indexOf("Omar");
  sent.setRangeFills(nameStart, nameStart + "Omar Mohammed".length, solid("#1D4ED8"));
  const docStart = sent.characters.indexOf('"');
  sent.setRangeFills(docStart + 1, sent.characters.length - 1, solid("#1D4ED8"));
  Rt(sent, 803, 327);
  Rt(N("يتطلب مراجعتك وتوقيعك الإلكتروني", 15.5), 803, 352);
  Rt(N("يرجى التفضل بالاطلاع على المستند وإكمال الإجراءات اللازمة", 15.5), 803, 400);
  const btn = autoLayout("HORIZONTAL", { name: "Review and sign", primaryAxisAlignItems: "CENTER", counterAxisAlignItems: "CENTER", cornerRadius: 10 });
  btn.fills = solid(NAVY);
  btn.primaryAxisSizingMode = "FIXED";
  btn.counterAxisSizingMode = "FIXED";
  btn.resize(210, 48);
  btn.appendChild(N("مراجعة وتوقيع المستند", 14.5, { weight: "Bold", color: "#FFFFFF" }));
  place(card, btn, 346 - X, 444 - Y);

  Rt(N("حماية الخصوصية", 15, { weight: "Bold" }), 834, 595);
  Rt(N("يحتوي هذا البريد الإلكتروني على رابط آمن ومخصص لك. للحفاظ على سرية معلوماتك، يرجى عدم مشاركة أو إعادة توجيه هذا البريد لأي شخص آخر", 12), 834, 665);
  hline(card, 68 - X, 834 - X, 703 - Y, "#E5E9F0");
  const mini = await icon("qanoniah", 22);
  place(card, mini, 818 - X - 11, 738 - Y - 11);
  Rt(N("نبذة عن قانونية", 15, { weight: "Bold" }), 834, 780);
  const about = N("أنجز توقيع مستنداتك إلكترونياً في ثوانٍ معدودة. قانونية هي منصة سعودية معتمدة تقدم لك حلاً موثوقاً وملزماً قانونياً لإدارة معاملاتك الرقمية بكل أمان؛ سواء\nكنت في المكتب، أو في المنزل، أو أثناء التنقل.", 12, { lineHeight: 34, name: "About" });
  const brand = about.characters.indexOf("قانونية هي");
  about.setRangeFills(brand, brand + "قانونية".length, solid("#1D4ED8"));
  Rt(about, 834, 849);
  hline(card, 68 - X, 834 - X, 904 - Y, "#E5E9F0");
  Rt(N("تحتاج إلى مساعدة؟", 15, { weight: "Bold" }), 834, 962);
  Rt(N("للاستفسار حول تفاصيل المستند أو تعديله، يرجى التواصل مع المُرسل مباشرة.", 12), 814, 1000);
  const help = N("لمشاكل التوقيع أو الدعم الفني، نحن هنا لخدمتك: support@qanoniah.com", 12, { name: "Support" });
  const mail = help.characters.indexOf("support");
  help.setRangeFills(mail, help.characters.length, solid("#1D4ED8"));
  help.setRangeFontName(mail, help.characters.length, F.notoBold);
  Rt(help, 814, 1032);
  for (const cy of [1000, 1032]) {
    const dot = figma.createEllipse(); dot.name = "Bullet"; dot.resize(4.5, 4.5); dot.fills = solid(INK);
    place(card, dot, 826 - X - 2.25, cy - Y - 2.25);
  }
  hline(card, 68 - X, 834 - X, 1071 - Y, "#E5E9F0");
  Rt(N("جميع الحقوق محفوظة لمنصة قانونية ©", 11.5), 654, 1109);
  Rt(N("سياسة الخصوصية", 11.5, { weight: "Bold", color: "#1D4ED8" }), 443, 1109);
  vline(card, 342 - X, 1099 - Y, 1119 - Y, "#D1D5DB");
  Rt(N("سياسة الاستخدام", 11.5, { weight: "Bold", color: "#1D4ED8" }), 333, 1109);

  root.appendChild(s);
  s.rescale(k);
  s.x = 2658;
  s.y = 7071;
  await copyStyle(s, "1:5");
}

// ---------- 1:4 Signing landing page (node units) ----------
{
  const NAME = "Signing – Welcome";
  const old = root.findChild((n) => n.name === NAME);
  if (old) old.remove();
  const s = frame(NAME, { clipsContent: true });
  s.resize(1514, 782);
  s.fills = [{ type: "GRADIENT_LINEAR", gradientTransform: [[1, 0, 0], [0, 1, 0]], gradientStops: [
    { position: 0, color: { ...hex("#F3F4F6"), a: 1 } }, { position: 0.55, color: { ...hex("#FAFAFB"), a: 1 } }, { position: 1, color: { ...hex("#FFFFFF"), a: 1 } }] }];
  const d = (x) => (x - 60) * 0.8062; // displayed x -> node
  const e = (y) => (y - 55) * 0.8062;  // displayed y -> node

  // Document preview
  const doc = frame("Document preview", { clipsContent: true });
  doc.resize(d(725) - d(62), e(1010) - e(82));
  doc.fills = solid("#FFFFFF");
  doc.cornerRadius = 24;
  shadow(doc, { y: 8, blur: 30, opacity: 0.06 });
  place(s, doc, d(62), e(82));
  const DX = d(62), DY = e(82);
  textAt(doc, N("المستند", 30), { right: d(692) - DX, cy: e(165) - DY });
  const bars = [
    [426, 231, "#EEF2FA"], [97, 260], [345, 290], [345, 326], [345, 355], [345, 384], [278, 420], [338, 450], [97, 479],
    [97, 533], [468, 563, "#E8F5E9"], [187, 592], [322, 621], [135, 650], [247, 679],
    [187, 762], [322, 792], [135, 821], [135, 851], [247, 880], [93, 909], [172, 938], [172, 968],
  ];
  for (const [x1, cy, color] of bars) {
    const b = rect("Line placeholder", d(693) - d(x1), 13, color || "#F2F3F5", 4);
    place(doc, b, d(x1) - DX, e(cy) - DY - 6.5);
  }
  for (const cy of [821, 851]) place(doc, rect("Highlight", d(360) - d(135), 13, "#FFF1E6", 4), d(135) - DX, e(cy) - DY - 6.5);
  hline(doc, d(93) - DX, d(693) - DX, e(507) - DY, "#EEF0F3");
  hline(doc, d(93) - DX, d(693) - DX, e(706) - DY, "#EEF0F3");

  // Floating name field
  const nameCard = frame("Name field");
  nameCard.resize(d(345) - d(62), e(403) - e(268));
  nameCard.fills = solid("#FFFFFF");
  nameCard.cornerRadius = 14;
  shadow(nameCard, { y: 6, blur: 24, opacity: 0.08 });
  place(s, nameCard, d(62), e(268));
  const NX = d(62), NY = e(268);
  textAt(nameCard, N("الاسم", 15), { right: d(322) - NX, cy: e(302) - NY });
  const input = rect("Input", d(322) - d(40), e(381) - e(332), "#FFFFFF", 8);
  stroke(input, "#E5E7EB", 1);
  place(nameCard, input, d(40) - NX, e(332) - NY);
  place(nameCard, rect("Value placeholder", d(272) - d(62), 18, "#EEF0F3", 4), 0, e(356) - NY - 9);
  await iconAt(nameCard, "user", 20, INK, d(295) - NX, e(356) - NY);

  // Signature dialog
  const dlg = frame("Draw signature");
  dlg.resize(d(818) - d(358), e(945) - e(653));
  dlg.fills = solid("#FFFFFF");
  dlg.cornerRadius = 6;
  shadow(dlg, { y: 6, blur: 24, opacity: 0.1 });
  place(s, dlg, d(358), e(653));
  const GX = d(358), GY = e(653);
  textAt(dlg, N("رسم التوقيع", 15), { right: d(796) - GX, cy: e(688) - GY });
  await iconAt(dlg, "x", 15, MUTED, d(395) - GX, e(689) - GY);
  textAt(dlg, N("موجب توقيعي الإلكتروني على هذا المستند، أقر بأن هذا التوقيع يعادل للتواقيع المكتوبة بخط اليد", 7, { color: MUTED }), { right: d(748) - GX, cy: e(720) - GY });
  place(dlg, rect("Tabs", d(792) - d(660), 26, "#F5F6F8", 6), d(660) - GX, e(755) - GY - 13);
  const tab = rect("Active", d(790) - d(748), 23, "#FFFFFF", 5);
  shadow(tab, { y: 1, blur: 2, opacity: 0.12 });
  place(dlg, tab, d(748) - GX, e(755) - GY - 11.5);
  textAt(dlg, N("ارسم", 8.5, { color: "#1D4ED8", align: "CENTER" }), { cx: d(769) - GX, cy: e(755) - GY });
  textAt(dlg, N("اكتب", 8.5, { color: MUTED, align: "CENTER" }), { cx: d(726) - GX, cy: e(755) - GY });
  textAt(dlg, N("صورة", 8.5, { color: MUTED, align: "CENTER" }), { cx: d(683) - GX, cy: e(755) - GY });
  const pad = rect("Signature pad", d(796) - d(380), e(916) - e(795), "#FFFFFF", 4);
  stroke(pad, "#E5E7EB", 1);
  place(dlg, pad, d(380) - GX, e(795) - GY);
  const sig = svg(
    `<svg width="80" height="48" viewBox="0 0 80 48" xmlns="http://www.w3.org/2000/svg"><path d="M2 46 C3 38 3 30 6 28 C8 34 7 42 9 43 C13 36 18 30 26 31 C30 32 31 38 36 37 C42 36 44 22 47 14 C48 26 44 40 46 44 C50 36 54 28 60 24 C64 20 72 10 76 4 M54 32 C62 28 70 30 78 26" stroke="#111111" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    "Signature"
  );
  place(dlg, sig, d(585) - GX - 40, e(855) - GY - 24);

  // Welcome copy
  const lg = logo.createInstance();
  s.appendChild(lg);
  lg.rescale((d(1775) - d(1572)) / 164);
  lg.x = d(1572);
  lg.y = e(220);
  textAt(s, N("شركة عدالة تقنية المعلومات", 23, { color: MUTED }), { right: d(1773), cy: e(368) });
  textAt(s, N("قرارات مجلس الإدارة", 25, { weight: "Medium" }), { right: d(1773), cy: e(416) });
  textAt(s, N("مرحبًا بك، تمت دعوتك للاطلاع على هذا المستند واستكمال الإجراء\nالمطلوب منك. اضغط على «ابدأ الآن» لعرض المستند ومتابعة\nالخطوات.", 17, { color: GREY, lineHeight: 25.8 }), { right: d(1773), cy: e(540) });
  const start = autoLayout("HORIZONTAL", { name: "Start now", primaryAxisAlignItems: "CENTER", counterAxisAlignItems: "CENTER", cornerRadius: 8 });
  start.fills = solid(NAVY);
  start.primaryAxisSizingMode = "FIXED";
  start.counterAxisSizingMode = "FIXED";
  start.resize(d(1773) - d(1322), e(680) - e(622));
  start.appendChild(N("ابدأ الآن", 15, { color: "#FFFFFF" }));
  place(s, start, d(1322), e(622));
  hline(s, d(1180), d(1773), e(823), "#E5E7EB");
  const help = N("تواجه مشكلة؟ تواصل معنا", 15, { color: MUTED, name: "Help" });
  const at = help.characters.indexOf("تواصل");
  help.setRangeFills(at, help.characters.length, solid("#1D4ED8"));
  textAt(s, help, { right: d(1773), cy: e(858) });
  vline(s, 1512.5, e(90), e(990), "#E5E7EB");

  root.appendChild(s);
  s.x = 4016;
  s.y = 7139;
  await copyStyle(s, "1:4");
}

// ---------- 1:6 loose label: an actual text layer in the original, so clone it ----------
{
  const old = root.findChild((n) => n.name === "الطرف الأول");
  if (old) old.remove();
  const label = (await figma.getNodeByIdAsync("1:6")).clone();
  root.appendChild(label);
  label.x = 1679;
  label.y = 3433;
}
return "ok";
