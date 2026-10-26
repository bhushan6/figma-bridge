#!/usr/bin/env node
// MCP server (stdio) exposing the bridge to Claude Code. If no bridge is
// running yet, it hosts one in-process so the plugin has something to connect to.
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { startBridge } from "./bridge.js";
import { isBridgeUp, rpc } from "./client.js";
import { loadToken } from "./config.js";
import { exportPng, runCode, uploadImage } from "./ops.js";

async function ensureBridge() {
  if (await isBridgeUp()) return;
  try {
    await startBridge({ token: loadToken() });
  } catch (err) {
    // Another process won the race to bind the port; use that one.
    if (err.code !== "EADDRINUSE") throw err;
  }
}

function text(value) {
  return { content: [{ type: "text", text: typeof value === "string" ? value : JSON.stringify(value, null, 2) }] };
}

function failure(err) {
  return { isError: true, content: [{ type: "text", text: err.message }] };
}

const server = new McpServer({ name: "figma-bridge", version: "0.1.0" });

server.registerTool(
  "figma_status",
  {
    title: "Figma bridge status",
    description: "Reports whether the Claude Bridge Figma plugin is connected, and to which file.",
    inputSchema: {},
  },
  async () => {
    try {
      return text(await rpc("status"));
    } catch (err) {
      return failure(err);
    }
  }
);

server.registerTool(
  "figma_run_code",
  {
    title: "Run Figma Plugin API code",
    description:
      "Runs JavaScript in the open Figma file through the Claude Bridge plugin, with full Plugin API access via the `figma` global. " +
      "The code is the body of an async function: use top-level await and `return` a JSON-serializable value. " +
      "Returned Figma nodes are summarized as {id, name, type}. Colors are 0-1. Load fonts before editing text. " +
      "Use `await figma.setCurrentPageAsync(page)` to switch pages. figma.createImage works here.",
    inputSchema: {
      code: z.string().describe("Body of an async function with access to `figma`"),
      timeout_ms: z.number().int().positive().optional().describe("Defaults to 60000"),
    },
  },
  async ({ code, timeout_ms }) => {
    try {
      const result = await runCode(code, timeout_ms);
      return text(result === undefined ? "(no return value)" : result);
    } catch (err) {
      return failure(err);
    }
  }
);

server.registerTool(
  "figma_export_png",
  {
    title: "Export a Figma node as PNG",
    description:
      "Renders a node (or the current selection when node_id is omitted) to PNG and returns the image. " +
      "max_dimension caps the longer edge in pixels. save_to optionally writes the PNG to a local path.",
    inputSchema: {
      node_id: z.string().optional(),
      scale: z.number().positive().max(4).optional(),
      max_dimension: z.number().int().positive().max(8192).optional(),
      save_to: z.string().optional(),
    },
  },
  async ({ node_id, scale, max_dimension, save_to }) => {
    try {
      const result = await exportPng({ nodeId: node_id, scale, maxDimension: max_dimension, savePath: save_to });
      const meta = { nodeId: result.nodeId, name: result.name, width: result.width, height: result.height, savedTo: save_to };
      return {
        content: [
          { type: "image", data: result.base64, mimeType: "image/png" },
          { type: "text", text: JSON.stringify(meta) },
        ],
      };
    } catch (err) {
      return failure(err);
    }
  }
);

server.registerTool(
  "figma_upload_image",
  {
    title: "Upload a local image into Figma",
    description:
      "Reads a local PNG/JPG/GIF and creates a Figma image from it. Returns its imageHash; if node_id is given, " +
      "the image is also set as that node's fill.",
    inputSchema: {
      path: z.string(),
      node_id: z.string().optional(),
      scale_mode: z.enum(["FILL", "FIT", "TILE", "CROP"]).optional(),
    },
  },
  async ({ path, node_id, scale_mode }) => {
    try {
      return text(await uploadImage({ path, nodeId: node_id, scaleMode: scale_mode }));
    } catch (err) {
      return failure(err);
    }
  }
);

await ensureBridge();
await server.connect(new StdioServerTransport());
