// Editor chrome components, in CSS px of the app (1508 wide).
const BLUE = "#2C4FA5";
const INK = "#1F2533";
const TEXT2 = "#374151";
const MUTED = "#6B7280";
const out = {};

// ---------- Top bar ----------
out.topbar = (await replaceComponent("Editor/Top bar", async () => {
  const c = makeComponent("Editor/Top bar", 1508, 60, "#FFFFFF");
  hline(c, 0, 1508, 59);

  // Left cluster reflows when the date or language label changes.
  const left = autoLayout("HORIZONTAL", { name: "Left cluster", itemSpacing: 0, counterAxisAlignItems: "CENTER" });
  const btn = autoLayout("HORIZONTAL", { name: "Sign button", itemSpacing: 8, paddingLeft: 16, paddingRight: 14, counterAxisAlignItems: "CENTER", primaryAxisAlignItems: "CENTER", cornerRadius: 6 });
  btn.fills = solid(BLUE);
  btn.primaryAxisSizingMode = "FIXED";
  btn.counterAxisSizingMode = "FIXED";
  btn.resize(124, 32);
  btn.appendChild(fit(text("توقيع المستند", { size: 13, color: "#FFFFFF" }), 67.5));
  btn.appendChild(await icon("globe-sign", 16, "#FFFFFF"));
  left.appendChild(btn);
  gap(left, 28);

  const avatars = frame("Collaborators");
  avatars.resize(42, 24);
  const av1 = figma.createEllipse(); av1.name = "Avatar"; av1.resize(24, 24); av1.fills = solid("#F3F4F6"); place(avatars, av1, 0, 0);
  await iconAt(avatars, "user", 13, "#4B5563", 12, 12);
  const av2 = figma.createEllipse(); av2.name = "Add collaborator"; av2.resize(24, 24); av2.fills = solid("#FFFFFF"); stroke(av2, "#E5E7EB", 1); place(avatars, av2, 18, 0);
  await iconAt(avatars, "plus", 14, BLUE, 30, 12);
  left.appendChild(avatars);
  gap(left, 14);

  const edited = text("آخر تعديل September 28", { size: 12, color: MUTED, name: "Last edited", align: "LEFT" });
  edited.setRangeFontSize(0, 9, 11);
  edited.setRangeFills(0, 9, solid("#9CA3AF"));
  fit(edited, 109);
  left.appendChild(edited);
  gap(left, 14);
  left.appendChild(rect("Divider", 1, 26, "#E5E7EB"));
  gap(left, 15.5);
  const lang = autoLayout("HORIZONTAL", { name: "Language", itemSpacing: 4, counterAxisAlignItems: "CENTER" });
  lang.appendChild(await icon("globe", 16, BLUE));
  lang.appendChild(fit(text("English", { size: 13, color: TEXT2, align: "LEFT", name: "Language label" }), 39.5));
  left.appendChild(lang);
  place(c, left, 14, 14);

  await iconAt(c, "more-vertical", 17, "#4B5563", 1080, 29);
  await iconAt(c, "cloud-sync", 17, "#4B5563", 1116, 29);
  await iconAt(c, "file-plus", 17, "#4B5563", 1153, 29);
  await iconAt(c, "download", 17, "#4B5563", 1186, 29);

  const pill = autoLayout("HORIZONTAL", { name: "Status: Draft", itemSpacing: 8, paddingLeft: 10, paddingRight: 9, counterAxisAlignItems: "CENTER", cornerRadius: 12 });
  pill.fills = solid("#F3F4F6");
  pill.counterAxisSizingMode = "FIXED";
  pill.resize(pill.width, 24);
  pill.appendChild(fit(text("مسودة", { size: 13, weight: "Medium", color: INK }), 36.5));
  const dot = figma.createEllipse(); dot.name = "Dot"; dot.resize(8, 8); dot.fills = solid("#6B6B78");
  pill.appendChild(dot);
  place(c, pill, 1286 - pill.width, 17);
  pill.constraints = { horizontal: "MAX", vertical: "MIN" };

  textAt(c, fit(text("اتفاقية تقديم خدمات الـ..", { size: 13, color: TEXT2, name: "Document title" }), 118.5), { right: 1444, cy: 29 });
  await iconAt(c, "chevron-right", 16, "#4B5563", 1463, 29);
  for (const n of c.children) {
    if (n.name === "Divider" && n.width > 1000) n.constraints = { horizontal: "STRETCH", vertical: "MIN" };
    else if (n.x > 1000) n.constraints = { horizontal: "MAX", vertical: "MIN" };
  }
  return c;
})).id;

// ---------- Toolbar ----------
out.toolbar = (await replaceComponent("Editor/Toolbar", async () => {
  const c = makeComponent("Editor/Toolbar", 1508, 60, "#FFFFFF");
  hline(c, 0, 1508, 59);

  const badge = rect("Badge bg", 51, 31, "#F1F4FB", 6);
  place(c, badge, 27, 14);
  textAt(c, fit(text("28", { size: 13, color: BLUE, align: "CENTER", name: "Count" }), 12.5), { cx: 42, cy: 30 });
  await iconAt(c, "list-checks", 16, BLUE, 62, 30);
  await iconAt(c, "plus", 16, TEXT2, 105, 30);
  await iconAt(c, "chevron-down", 10, MUTED, 134, 30);
  textAt(c, fit(text("111%", { size: 13, color: TEXT2, align: "CENTER", name: "Zoom" }), 24.5), { cx: 157, cy: 30 });
  await iconAt(c, "minus", 16, TEXT2, 193, 30);

  const tools = [
    ["fullscreen", 362], ["table", 411], ["image-plus", 446], ["list-ordered", 496], ["list", 531],
    ["indent-ltr", 581], ["indent-rtl", 616], ["pilcrow-right", 666], ["pilcrow-left", 702], ["line-height", 738],
    ["align-right", 803], ["text-color", 851], ["strikethrough", 901], ["underline", 935], ["italic", 973], ["bold", 1009],
  ];
  place(c, rect("Active tool", 26, 24, "#E9EBEF", 6), 689, 18);
  for (const [name, x] of tools) await iconAt(c, name, 17, INK, x, 30);
  await iconAt(c, "chevron-down", 10, "#9CA3AF", 784, 30);
  for (const x of [387, 472, 556, 641, 763, 875, 1382]) vline(c, x, 18, 42);

  async function dropdown(name, x1, x2, label, w) {
    const box = rect(name, x2 - x1, 34, "#FFFFFF", 6);
    stroke(box, "#ECEEF1", 1);
    place(c, box, x1, 13);
    await iconAt(c, "chevron-down", 13, MUTED, x1 + 16, 30);
    textAt(c, fit(text(label, { size: 13, color: TEXT2, name: name + " value" }), w), { right: x2 - 16, cy: 30 });
  }
  await dropdown("Font size", 1034, 1104, "32", 12.5);
  await dropdown("Font family", 1117, 1234, "Arial", 25.5);
  await dropdown("Text style", 1248, 1364, "عنوان 1", 35);
  await iconAt(c, "undo", 17, INK, 1402, 30);
  await iconAt(c, "redo", 17, INK, 1438, 30);
  // Zoom controls stay left, formatting tools stay centred, dropdowns and history stay right.
  for (const n of c.children) {
    if (n.name === "Divider" && n.width > 1000) n.constraints = { horizontal: "STRETCH", vertical: "MIN" };
    else if (n.x >= 1020) n.constraints = { horizontal: "MAX", vertical: "MIN" };
    else if (n.x >= 250) n.constraints = { horizontal: "CENTER", vertical: "MIN" };
    else n.constraints = { horizontal: "MIN", vertical: "MIN" };
  }
  return c;
})).id;

// ---------- Sections sidebar ----------
out.sections = (await replaceComponent("Editor/Sections", async () => {
  const c = makeComponent("Editor/Sections", 199, 646, "#FFFFFF");
  c.clipsContent = true;
  const border = rect("Border", 1, 646, "#EEF0F3");
  place(c, border, 198, 0);
  border.constraints = { horizontal: "MAX", vertical: "STRETCH" };
  const bar = rect("Scrollbar", 5, 418, "#DADADA", 3);
  place(c, bar, 0, 57);
  textAt(c, fit(text("الأقسام", { size: 13, color: INK, name: "Title" }), 37), { right: 182, cy: 27 });
  await iconAt(c, "x", 13, MUTED, 19, 26);
  textAt(c, fit(text("اتفاقية تقديم خدمات الحوسبة ...", { size: 12.5, color: INK, name: "Document" }), 155.5), { right: 181, cy: 83 });
  const items = [
    "أطراف الاتفاقية", "التمهيد", "التعريفات", "موضوع الاتفاقية ونطاقها", "التزامات مقدم الخدمة", "التزامات العميل",
    "مستويات الخدمة والقبول", "الأتعاب والفوترة والسداد", "الإقرارات والضمانات", "السرية", "معالجة البيانات الشخصية ...",
    "الملكية الفكرية", "التعويض عن مطالبات الغير", "تحديد المسؤولية", "القوة القاهرة", "مدة الاتفاقية وتجديدها",
    "الفسخ والإنهاء وآثاره", "التدقيق والامتثال", "الإشعارات", "تسوية النزاعات",
  ];
  items.forEach((label, i) => textAt(c, text(label, { size: 11, color: "#4B5563" }), { right: 156, cy: 112 + 29 * i }));
  return c;
})).id;

// ---------- Tool rail ----------
out.rail = (await replaceComponent("Editor/Tool rail", async () => {
  const c = makeComponent("Editor/Tool rail", 40, 185, "#FFFFFF");
  c.cornerRadius = 12;
  stroke(c, "#F0F1F3", 1);
  shadow(c, { y: 2, blur: 10, opacity: 0.08 });
  place(c, rect("Active", 32, 30, "#F4F5FB", 6), 4, 78);
  await iconAt(c, "users", 15, INK, 20, 17);
  await iconAt(c, "align-right", 15, INK, 20, 55);
  await iconAt(c, "logo-spark", 17, null, 20, 93);
  await iconAt(c, "history", 15, INK, 20, 130);
  await iconAt(c, "chat-smile", 15, INK, 20, 168);
  return c;
})).id;

return JSON.stringify(out);
