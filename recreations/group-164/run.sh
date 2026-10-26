#!/bin/bash
# Usage: run.sh panel-x.js — runs frame-77/lib.js + g164.js + script in Figma via the bridge (Components frame 2:40).
SP="$(cd "$(dirname "$0")" && pwd)"
cat "$SP/../frame-77/lib.js" "$SP/g164.js" "$1" | sed "s/__LIB__/2:40/; s/__ROOT__/2:39/" | node "$SP/../../src/cli.js" run - --timeout 180000
