import { randomUUID, timingSafeEqual } from "node:crypto";
import http from "node:http";
import { WebSocketServer } from "ws";
import { HOST, PORT } from "./config.js";

const MAX_BODY_BYTES = 80 * 1024 * 1024;
const HELLO_TIMEOUT_MS = 5000;
const PING_INTERVAL_MS = 20000;
const DEFAULT_TIMEOUT_MS = 60000;

function tokensMatch(given, expected) {
  if (typeof given !== "string") return false;
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

function sendJson(res, status, body) {
  const text = JSON.stringify(body);
  res.writeHead(status, { "content-type": "application/json", "content-length": Buffer.byteLength(text) });
  res.end(text);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(new Error("Request body too large"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

/**
 * Starts the bridge: a WebSocket endpoint the Figma plugin connects to, and an
 * HTTP `POST /rpc` endpoint that agents (MCP server, CLI) call. Each RPC is
 * forwarded to the connected plugin and its reply is returned to the caller.
 */
export function startBridge({ token, log = (...args) => console.error("[figma-bridge]", ...args) }) {
  let plugin = null; // { socket, fileName, connectedAt }
  const pending = new Map();

  function rejectAllPending(reason) {
    for (const [id, entry] of pending) {
      clearTimeout(entry.timer);
      entry.reject(new Error(reason));
      pending.delete(id);
    }
  }

  function callPlugin(method, params, timeoutMs = DEFAULT_TIMEOUT_MS) {
    if (!plugin) {
      return Promise.reject(
        new Error("No Figma plugin connected. Open the file in Figma desktop and run Plugins > Development > Claude Bridge.")
      );
    }
    const id = randomUUID();
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        pending.delete(id);
        reject(new Error(`Timed out after ${timeoutMs} ms waiting for the plugin`));
      }, timeoutMs);
      pending.set(id, { resolve, reject, timer });
      plugin.socket.send(JSON.stringify({ type: "rpc", id, method, params }));
    });
  }

  function status() {
    return plugin
      ? { connected: true, fileName: plugin.fileName, connectedAt: plugin.connectedAt }
      : { connected: false };
  }

  const server = http.createServer(async (req, res) => {
    // Browsers always send Origin; the plugin never uses HTTP and local tools never send it.
    if (req.headers.origin) return sendJson(res, 403, { ok: false, error: "Browser requests are not allowed" });

    if (req.method === "GET" && req.url === "/health") return sendJson(res, 200, { ok: true });

    if (req.method !== "POST" || req.url !== "/rpc") return sendJson(res, 404, { ok: false, error: "Not found" });
    if (!tokensMatch(req.headers["x-bridge-token"], token)) {
      return sendJson(res, 401, { ok: false, error: "Bad or missing x-bridge-token" });
    }

    let body;
    try {
      body = JSON.parse(await readBody(req));
    } catch (err) {
      return sendJson(res, 400, { ok: false, error: `Invalid request: ${err.message}` });
    }

    if (body.method === "status") return sendJson(res, 200, { ok: true, result: status() });

    try {
      const result = await callPlugin(body.method, body.params || {}, body.timeoutMs);
      sendJson(res, 200, { ok: true, result });
    } catch (err) {
      sendJson(res, 200, { ok: false, error: err.message });
    }
  });

  const wss = new WebSocketServer({ server, maxPayload: MAX_BODY_BYTES });

  wss.on("connection", (socket) => {
    let authed = false;
    const helloTimer = setTimeout(() => {
      if (!authed) socket.close(4001, "hello timeout");
    }, HELLO_TIMEOUT_MS);

    socket.on("message", (raw) => {
      let msg;
      try {
        msg = JSON.parse(raw.toString());
      } catch {
        return;
      }

      if (!authed) {
        if (msg.type === "hello" && tokensMatch(msg.token, token)) {
          authed = true;
          clearTimeout(helloTimer);
          if (plugin && plugin.socket !== socket) {
            plugin.socket.close(4000, "replaced by a newer plugin connection");
          }
          plugin = { socket, fileName: msg.fileName || "(unknown file)", connectedAt: new Date().toISOString() };
          socket.send(JSON.stringify({ type: "welcome" }));
          log(`plugin connected: ${plugin.fileName}`);
        } else {
          socket.send(JSON.stringify({ type: "error", error: "Bad token" }));
          socket.close(4003, "bad token");
        }
        return;
      }

      if (msg.type === "rpc-result") {
        const entry = pending.get(msg.id);
        if (!entry) return;
        clearTimeout(entry.timer);
        pending.delete(msg.id);
        if (msg.ok) entry.resolve(msg.result);
        else entry.reject(new Error(msg.error || "Plugin reported an error"));
      }
    });

    socket.on("close", () => {
      clearTimeout(helloTimer);
      if (plugin && plugin.socket === socket) {
        log(`plugin disconnected: ${plugin.fileName}`);
        plugin = null;
        rejectAllPending("Plugin disconnected before replying");
      }
    });
  });

  const pingTimer = setInterval(() => {
    if (plugin) plugin.socket.ping();
  }, PING_INTERVAL_MS);

  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(PORT, HOST, () => {
      server.off("error", reject);
      log(`listening on ${HOST}:${PORT}`);
      resolve({
        status,
        callPlugin,
        close() {
          clearInterval(pingTimer);
          wss.close();
          server.close();
        },
      });
    });
  });
}
