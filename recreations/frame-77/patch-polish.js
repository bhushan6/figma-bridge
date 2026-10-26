const sec = await component("Editor/Sections");
if (!sec.findChild((n) => n.name === "Header divider")) {
  const d = hline(sec, 0, 199, 58, "#EEF0F3");
  d.name = "Header divider";
  d.constraints = { horizontal: "STRETCH", vertical: "MIN" };
}
const tall = await component("Editor/Tool rail (tall)");
await copyStyle(tall, "1:19");
return "ok";
