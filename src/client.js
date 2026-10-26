import { BASE_URL, loadToken } from "./config.js";

export async function isBridgeUp() {
  try {
    const res = await fetch(`${BASE_URL}/health`);
    return res.ok;
  } catch {
    return false;
  }
}

/** Calls the bridge over HTTP. Throws with the plugin's error message on failure. */
export async function rpc(method, params = {}, timeoutMs) {
  const res = await fetch(`${BASE_URL}/rpc`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-bridge-token": loadToken() },
    body: JSON.stringify({ method, params, timeoutMs }),
  });
  const body = await res.json();
  if (!body.ok) throw new Error(body.error);
  return body.result;
}
