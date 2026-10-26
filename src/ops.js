import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, extname } from "node:path";
import { rpc } from "./client.js";

const IMAGE_TYPES = new Set([".png", ".jpg", ".jpeg", ".gif"]);

export function runCode(code, timeoutMs) {
  return rpc("run", { code }, timeoutMs);
}

/**
 * Exports a node as PNG. `maxDimension` caps the longer edge so big frames
 * don't produce huge images. Returns { base64, width, height, name, nodeId }.
 */
export async function exportPng({ nodeId, scale = 1, maxDimension = 1600, savePath } = {}) {
  let result;
  try {
    result = await rpc("export", { nodeId, scale, maxDimension }, 60000);
  } catch (err) {
    // Figma desktop stops rendering while its window is minimized or fully
    // covered, and exportAsync waits for a render.
    if (/Timed out/.test(err.message)) {
      err.message += ". Exports only finish while the Figma window is visible on screen (not minimized or fully covered).";
    }
    throw err;
  }
  if (savePath) {
    mkdirSync(dirname(savePath), { recursive: true });
    writeFileSync(savePath, Buffer.from(result.base64, "base64"));
  }
  return result;
}

/** Uploads a local image into the file. Returns { hash, nodeId? }. */
export function uploadImage({ path, nodeId, scaleMode = "FILL" }) {
  if (!IMAGE_TYPES.has(extname(path).toLowerCase())) {
    throw new Error(`Unsupported image type: ${path} (use PNG, JPG or GIF)`);
  }
  const base64 = readFileSync(path).toString("base64");
  return rpc("createImage", { base64, nodeId, scaleMode }, 120000);
}
