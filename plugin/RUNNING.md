# Running the bridge server

The Claude Bridge plugin does nothing on its own: it connects to a small server on
your machine, and that server forwards code (and export/upload requests) from the
command line or Claude Code to the plugin. This page covers starting that server,
connecting the plugin, and sending it commands.

```
CLI / Claude Code ──HTTP──▶ bridge server (127.0.0.1:3055) ◀──WebSocket── Claude Bridge plugin ──▶ figma.*
```

## 1. One-time setup

From the `figma-bridge` folder:

```bash
npm install
```

Then load the plugin into **Figma desktop** (development plugins don't run in the browser):
Plugins → Development → Import plugin from manifest… → pick `plugin/manifest.json`.

## 2. Start the server

From the `figma-bridge` folder:

```bash
npm start
```

You should see:

```
[figma-bridge] listening on 127.0.0.1:3055
[figma-bridge] token file: C:\Users\<you>\.figma-bridge\token (run "npm run token" to print it)
```

Leave this terminal open; closing it (or Ctrl+C) stops the server. The plugin
reconnects automatically whenever the server comes back.

If it says `port already in use`, a server is already running (for example one
started by the MCP server in a Claude Code session). You can use that one.

## 3. Connect the plugin

1. Copy the token to the clipboard (Windows):

   ```bash
   node src/cli.js token | clip
   ```

2. In Figma desktop, open the file you want to work on and run
   Plugins → Development → **Claude Bridge**.
3. Paste the token and click **Connect**. The status turns green ("Connected").
   The token is remembered, so next time the plugin connects by itself.

Keep the plugin window open while sending commands.

## 4. Send commands

Check the connection:

```bash
node src/cli.js status
```

Run Plugin API code. The file (or stdin) is the body of an async function with
`figma` in scope; whatever it `return`s is printed as JSON:

```bash
node src/cli.js run my-script.js
```

```bash
echo 'return figma.currentPage.children.map(n => n.name)' | node src/cli.js run -
```

Longer scripts can take more time; raise the timeout (milliseconds):

```bash
node src/cli.js run my-script.js --timeout 120000
```

Export a node (or the current selection) as PNG:

```bash
node src/cli.js export 12:34 out.png --scale 2 --max 3000
```

```bash
node src/cli.js export selection out.png
```

Upload a local image into the file, optionally as a node's fill:

```bash
node src/cli.js upload photo.png --node 12:34 --mode FILL
```

### Writing scripts

- Use top-level `await` and `return`; don't wrap code in an async IIFE.
- Load fonts before editing text: `await figma.loadFontAsync({ family: "Inter", style: "Regular" })`.
- Switch pages with `await figma.setCurrentPageAsync(page)`.
- Colours are 0–1, not 0–255.
- Returned nodes are summarised as `{ id, name, type }`.
- `figma.createAutoLayout` does not exist in the real Plugin API; create a frame and set `layoutMode`.

The scripts in `recreations/frame-77/` are worked examples (`rb.sh` runs one with
the shared `lib.js` helpers prepended).

## 5. Use it from Claude Code (optional)

Register the MCP server once; it starts the bridge server itself if none is running:

```bash
claude mcp add figma-bridge --scope user -- node C:/Users/BHUSHAN/Documents/code/personal/figma-bridge/src/mcp.js
```

New Claude Code sessions then get the `figma_status`, `figma_run_code`,
`figma_export_png` and `figma_upload_image` tools.

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `No Figma plugin connected` | Run the plugin in Figma desktop and click Connect. |
| Plugin says "Waiting for bridge…" | The server isn't running; run `npm start`. |
| Plugin says "Rejected" | Wrong token; copy it again with `node src/cli.js token \| clip`. |
| `export` times out | Figma stops rendering while minimized or fully covered. Keep its window visible on screen and retry. |
| Plugin code changes don't take effect | Close the plugin window and run the plugin again; Figma reloads `code.js` and `ui.html` on each run. |
| "Another file connected to the bridge" | Only one file is connected at a time; the newest one wins. Click Connect in the file you want. |
| Need a different port | Set `FIGMA_BRIDGE_PORT`, and update `devAllowedDomains` in `manifest.json` and the URL in `ui.html` to match. |

## Security

The server listens only on `127.0.0.1`, every request must carry the token
(stored in `~/.figma-bridge/token`), and requests from web pages are refused.
The plugin runs whatever code it's sent with full access to the open file, so
only connect it to files you're happy to have edited.
