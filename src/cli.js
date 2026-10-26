#!/usr/bin/env node
// Command-line client for the bridge. Usage:
//   node src/cli.js token
//   node src/cli.js status
//   node src/cli.js run <script.js | -> [--timeout ms]
//   node src/cli.js export <nodeId | selection> <out.png> [--scale n] [--max n]
//   node src/cli.js upload <image> [--node id] [--mode FILL|FIT|TILE]
import { readFileSync } from "node:fs";
import { rpc } from "./client.js";
import { loadToken } from "./config.js";
import { exportPng, runCode, uploadImage } from "./ops.js";

function parseArgs(argv) {
  const positional = [];
  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith("--")) flags[argv[i].slice(2)] = argv[++i];
    else positional.push(argv[i]);
  }
  return { positional, flags };
}

function readStdin() {
  return readFileSync(0, "utf8");
}

const [command, ...rest] = process.argv.slice(2);
const { positional, flags } = parseArgs(rest);

try {
  switch (command) {
    case "token":
      console.log(loadToken());
      break;
    case "status":
      console.log(JSON.stringify(await rpc("status"), null, 2));
      break;
    case "run": {
      const source = positional[0] === "-" || !positional[0] ? readStdin() : readFileSync(positional[0], "utf8");
      const result = await runCode(source, flags.timeout ? Number(flags.timeout) : undefined);
      console.log(JSON.stringify(result, null, 2));
      break;
    }
    case "export": {
      const [target, out] = positional;
      if (!target || !out) throw new Error("usage: export <nodeId | selection> <out.png> [--scale n] [--max n]");
      const result = await exportPng({
        nodeId: target === "selection" ? undefined : target,
        scale: flags.scale ? Number(flags.scale) : 1,
        maxDimension: flags.max ? Number(flags.max) : 1600,
        savePath: out,
      });
      console.log(JSON.stringify({ saved: out, name: result.name, nodeId: result.nodeId, width: result.width, height: result.height }));
      break;
    }
    case "upload": {
      if (!positional[0]) throw new Error("usage: upload <image> [--node id] [--mode FILL|FIT|TILE]");
      console.log(JSON.stringify(await uploadImage({ path: positional[0], nodeId: flags.node, scaleMode: flags.mode })));
      break;
    }
    default:
      console.error("commands: token | status | run | export | upload");
      process.exit(2);
  }
} catch (err) {
  console.error(`error: ${err.message}`);
  process.exit(1);
}
