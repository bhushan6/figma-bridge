# figma-bridge

Lets an AI agent (Claude Code) run Figma Plugin API scripts in a file you have open,
through a local development plugin. No Figma MCP quota involved: everything runs on
your machine through the Plugin API.

```
Claude Code ──MCP/stdio──▶ src/mcp.js ──HTTP──▶ bridge (127.0.0.1:3055) ◀──WebSocket── Figma plugin UI ──▶ plugin main thread (figma.*)
             CLI (src/cli.js) ──HTTP──┘
```

## Setup

Step-by-step guide for running the server and sending commands: [plugin/RUNNING.md](plugin/RUNNING.md).

1. `npm install`
2. Start the bridge: `npm start` (or let the MCP server start it; see below).
3. Copy the token: `npm run token` (stored in `~/.figma-bridge/token`).
4. In **Figma desktop**: Plugins → Development → Import plugin from manifest… →
   pick `plugin/manifest.json`.
5. Open the file you want to edit, run Plugins → Development → **Claude Bridge**,
   paste the token, click **Connect**. The token is remembered for next time.

Keep the plugin window open while the agent works, and keep Figma visible on
screen: Figma stops rendering while minimized or fully covered, so PNG exports
wait until it is visible again. The plugin reconnects on its own if
the bridge restarts.

## Use from Claude Code

```
claude mcp add figma-bridge --scope user -- node C:/Users/BHUSHAN/Documents/code/personal/figma-bridge/src/mcp.js
```

Tools:

| Tool | What it does |
| --- | --- |
| `figma_status` | Is a plugin connected, and to which file |
| `figma_run_code` | Runs an async function body with `figma` in scope; returns its JSON result |
| `figma_export_png` | Renders a node (or the selection) to PNG, returned as an image |
| `figma_upload_image` | Creates a Figma image from a local file, optionally filling a node |

If no bridge is running, the MCP server hosts one itself.

## CLI

```
node src/cli.js status
node src/cli.js run script.js            # or pipe code on stdin with "-"
node src/cli.js export 12:34 out.png --scale 2 --max 3000
node src/cli.js export selection out.png
node src/cli.js upload photo.png --node 12:34 --mode FILL
```

## Security

- The bridge listens on `127.0.0.1` only.
- The plugin and every HTTP client must present the token.
- HTTP requests carrying an `Origin` header (that is, from a web page) are rejected.

The plugin runs whatever code the bridge sends it, with full access to the open
file, so only connect it to files you're happy for the agent to edit.

## Config

- `FIGMA_BRIDGE_PORT`: default `3055`. If you change it, update `devAllowedDomains`
  in `plugin/manifest.json` and the URL in `plugin/ui.html`.
- `FIGMA_BRIDGE_TOKEN`: overrides the token file.
