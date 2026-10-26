// A decluttered copy of the inbox for the product video: the selected (CLM) and hovered
// rows stay as they are; every other email becomes a short, read, unlabelled row.
const INK = "#202124";
const GREY = "#5F6368";
const SOFT = "#80868B";
const NAME = "Email inbox – Decluttered";
const root = await figma.getNodeByIdAsync(ROOT_ID);
const source = root.findChild((n) => n.name === "Email inbox – Signature request");

const oldCopy = figma.currentPage.findChild((n) => n.name === NAME);
if (oldCopy) oldCopy.remove();
const oldCaption = figma.currentPage.findChild((n) => n.name === NAME + " caption");
if (oldCaption) oldCaption.remove();

const s = source.clone();
figma.currentPage.appendChild(s);
s.name = NAME;
s.x = root.x + source.x;
s.y = root.y + root.height + 300;

// Remove the cluttered rows and their label chips; keep the hovered row and the CLM email.
const isHover = (n) => n.type === "INSTANCE" && n.fills.length && n.fills[0].type === "SOLID" && Math.abs(n.fills[0].color.r - 0.949) < 0.01;
for (const n of [...s.children]) {
  if (n.type === "INSTANCE" && n.name === "Inbox/Email row" && !isHover(n)) n.remove();
  else if (n.name === "Email row (labelled)") n.remove();
  else if (n.name.startsWith("Label: ")) n.remove();
}

const ROWS = [
  ["فريق المبيعات", "ملخص اجتماع الأسبوع", "أهم النقاط والمهام المتفق عليها", "10:41 ص"],
  ["نورة القحطاني", "عرض السعر المحدّث", "مرفق العرض بعد التعديلات الأخيرة", "9:15 ص"],
  ["الموارد البشرية", "تحديث سياسة الإجازات", "يرجى الاطلاع على السياسة الجديدة", "8:02 ص"],
  ["سارة العتيبي", "موعد مراجعة العقد", "هل يناسبك يوم الأحد القادم؟", "7:30 ص"],
  ["فيصل الدوسري", "فاتورة شهر يوليو", "تجد الفاتورة مرفقة مع هذه الرسالة", "23 يوليو"],
  null, // CLM signature request (kept)
  ["خالد المطيري", "تأكيد الحجز", "تم تأكيد حجز قاعة الاجتماعات", "22 يوليو"],
  ["ريم الشمري", "ملاحظات على المسودة", "أضفت تعليقاتي على البند الثالث", "22 يوليو"],
  null, // hovered row (kept)
  ["عبدالله الحربي", "جدول المشروع", "النسخة الأخيرة من الجدول الزمني", "21 يوليو"],
  ["لينا الزهراني", "دعوة: ورشة عمل", "ورشة تعريفية بالأنظمة الجديدة", "20 يوليو"],
  ["محمد الغامدي", "طلب صلاحيات", "أحتاج صلاحية الوصول إلى المجلد المشترك", "20 يوليو"],
  ["هيفاء السبيعي", "تقرير الربع الثاني", "التقرير جاهز للمراجعة", "19 يوليو"],
  ["تركي العنزي", "شكراً لك", "شكراً على سرعة التجاوب", "18 يوليو"],
  ["منى الشهري", "اجتماع العميل", "تم نقل الاجتماع إلى الساعة الثانية", "18 يوليو"],
  ["بندر القرني", "مستندات التوظيف", "مرفق المستندات المطلوبة", "17 يوليو"],
  ["أمل الحارثي", "النشرة الشهرية", "أبرز أخبار الفريق لهذا الشهر", "16 يوليو"],
  ["ياسر البقمي", "متابعة الطلب", "هل من جديد بخصوص الطلب؟", "15 يوليو"],
  ["دانة الرشيد", "تهنئة", "ألف مبروك على الإنجاز", "15 يوليو"],
];
const CY = [209.5, 252.3, 295.2, 340.4, 384.8, 428.5, 476.1, 519, 564.2, 608.6, 650.7, 694.3, 737.2, 778.4, 818.9, 860.2, 900.6, 938.7, 977.6];
const rowComp = await component("Inbox/Email row");
const ROW_H = rowComp.height;
const hover = s.children.find(isHover);
for (let i = 0; i < ROWS.length; i++) {
  if (!ROWS[i]) continue;
  const [sender, subject, snippet, date] = ROWS[i];
  const r = rowComp.createInstance();
  const props = {};
  for (const key of Object.keys(r.componentProperties)) {
    if (key.startsWith("Sender")) props[key] = sender;
    if (key.startsWith("Subject")) props[key] = subject;
    if (key.startsWith("Snippet")) props[key] = snippet;
    if (key.startsWith("Date")) props[key] = date;
  }
  r.setProperties(props);
  // Read state: regular weights and softer greys so the signature request stands out.
  for (const name of ["Sender", "Subject", "Date"]) {
    const t = r.findOne((n) => n.name === name);
    t.fontName = F.notoRegular;
  }
  r.findOne((n) => n.name === "Sender").fills = solid(INK);
  r.findOne((n) => n.name === "Subject").fills = solid(INK);
  r.findOne((n) => n.name === "Snippet").fills = solid(SOFT);
  r.findOne((n) => n.name === "Date").fills = solid(GREY);
  s.appendChild(r);
  r.x = 69;
  r.y = CY[i] - ROW_H / 2;
}
// Keep the hovered row and its action icons above the new rows.
if (hover) s.appendChild(hover);
for (const n of s.children.filter((c) => c.type === "INSTANCE" && ["icon/archive", "icon/trash", "icon/mail", "icon/clock", "icon/more-vertical"].includes(c.name) && Math.abs(c.y + c.height / 2 - 564.2) < 2)) s.appendChild(n);
const clm = s.findChild((n) => n.name === "Signature request email");
if (clm) s.appendChild(clm);

const caption = text("Decluttered version (for the product video)", { font: "inter", size: 40, weight: "Medium", color: "#6B7280", align: "LEFT", name: NAME + " caption" });
figma.currentPage.appendChild(caption);
caption.x = s.x;
caption.y = s.y - 70;
return JSON.stringify({ id: s.id, x: s.x, y: s.y });
