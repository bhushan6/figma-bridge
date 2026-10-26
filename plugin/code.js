// Claude Bridge — main thread. The UI iframe owns the WebSocket; this side
// receives RPCs from it, runs them against the Plugin API, and posts results back.

figma.showUI(__html__, { width: 300, height: 190, themeColors: true });

var AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

// Nodes are class instances (RectangleNode, FrameNode, ...); plain objects the
// script returns have Object.prototype, even if they happen to have id/type keys.
function isSceneNode(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) !== Object.prototype &&
    typeof value.id === "string" &&
    typeof value.type === "string"
  );
}

// Figma nodes expose their properties as getters, so JSON.stringify would turn
// them into {}. Summarize nodes and make everything else JSON-safe.
function toJsonSafe(value) {
  if (value === undefined) return null;
  var text = JSON.stringify(value, function (key, v) {
    if (isSceneNode(v)) return { id: v.id, name: v.name, type: v.type };
    if (v instanceof Uint8Array) return { type: "Uint8Array", length: v.length };
    if (typeof v === "symbol") return String(v);
    if (typeof v === "function") return undefined;
    return v;
  });
  return text === undefined ? null : JSON.parse(text);
}

async function run(params) {
  var fn = new AsyncFunction("figma", params.code);
  return toJsonSafe(await fn(figma));
}

async function exportNode(params) {
  var node = params.nodeId ? await figma.getNodeByIdAsync(params.nodeId) : figma.currentPage.selection[0];
  if (!node) throw new Error(params.nodeId ? "No node with id " + params.nodeId : "Nothing is selected");
  if (!("exportAsync" in node)) throw new Error("Node " + node.id + " (" + node.type + ") cannot be exported");

  var scale = params.scale || 1;
  var longest = Math.max(node.width, node.height) * scale;
  if (params.maxDimension && longest > params.maxDimension) scale = (scale * params.maxDimension) / longest;

  var bytes = await node.exportAsync({ format: "PNG", constraint: { type: "SCALE", value: scale } });
  return {
    nodeId: node.id,
    name: node.name,
    width: Math.round(node.width * scale),
    height: Math.round(node.height * scale),
    base64: figma.base64Encode(bytes),
  };
}

async function createImage(params) {
  var image = figma.createImage(figma.base64Decode(params.base64));
  var result = { hash: image.hash };
  if (params.nodeId) {
    var node = await figma.getNodeByIdAsync(params.nodeId);
    if (!node || !("fills" in node)) throw new Error("Node " + params.nodeId + " cannot take an image fill");
    node.fills = [{ type: "IMAGE", imageHash: image.hash, scaleMode: params.scaleMode || "FILL" }];
    result.nodeId = node.id;
  }
  return result;
}

var handlers = { run: run, export: exportNode, createImage: createImage };

figma.ui.onmessage = async function (msg) {
  if (msg.type === "get-token") {
    var token = await figma.clientStorage.getAsync("bridgeToken");
    figma.ui.postMessage({ type: "token", token: token || "", fileName: figma.root.name });
    return;
  }
  if (msg.type === "set-token") {
    await figma.clientStorage.setAsync("bridgeToken", msg.token);
    return;
  }
  if (msg.type !== "rpc") return;

  var handler = handlers[msg.method];
  try {
    if (!handler) throw new Error("Unknown method: " + msg.method);
    var result = await handler(msg.params || {});
    figma.ui.postMessage({ type: "rpc-result", id: msg.id, ok: true, result: result });
  } catch (err) {
    var message = err && err.message ? err.message : String(err);
    if (err && err.stack) message += "\n" + err.stack;
    figma.ui.postMessage({ type: "rpc-result", id: msg.id, ok: false, error: message });
  }
};
