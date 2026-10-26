const root = await figma.getNodeByIdAsync(ROOT_ID);
const map = { "Editor – Analysis summary": "1:15", "AI Panel – Findings list": "1:13", "AI Panel – Compliance Low": "1:14", "AI Panel – Compliance High": "1:11" };
const done = [];
for (const [name, ref] of Object.entries(map)) {
  const n = root.findChild((c) => c.name === name);
  if (n) { await copyStyle(n, ref); done.push(name); }
}
const tall = await component("Editor/Tool rail (tall)");
await copyStyle(tall, "1:19");
return JSON.stringify(done);
