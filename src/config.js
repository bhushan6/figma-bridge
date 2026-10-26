import { randomBytes } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

export const PORT = Number(process.env.FIGMA_BRIDGE_PORT || 3055);
export const HOST = "127.0.0.1";
export const BASE_URL = `http://${HOST}:${PORT}`;

const CONFIG_DIR = join(homedir(), ".figma-bridge");
const TOKEN_FILE = join(CONFIG_DIR, "token");

// The plugin and every client authenticate with this shared secret, so a web
// page in your browser can't talk to the bridge just because it is on localhost.
export function loadToken() {
  if (process.env.FIGMA_BRIDGE_TOKEN) return process.env.FIGMA_BRIDGE_TOKEN;
  if (existsSync(TOKEN_FILE)) {
    const token = readFileSync(TOKEN_FILE, "utf8").trim();
    if (token) return token;
  }
  mkdirSync(CONFIG_DIR, { recursive: true });
  const token = randomBytes(24).toString("hex");
  writeFileSync(TOKEN_FILE, token + "\n", { mode: 0o600 });
  return token;
}

export const TOKEN_PATH = TOKEN_FILE;
