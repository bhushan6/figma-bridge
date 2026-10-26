import { startBridge } from "./bridge.js";
import { loadToken, TOKEN_PATH } from "./config.js";

try {
  await startBridge({ token: loadToken() });
  console.error(`[figma-bridge] token file: ${TOKEN_PATH} (run "npm run token" to print it)`);
} catch (err) {
  if (err.code === "EADDRINUSE") {
    console.error("[figma-bridge] port already in use; a bridge is probably running already.");
    process.exit(1);
  }
  throw err;
}
