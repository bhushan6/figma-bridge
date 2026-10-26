#!/bin/bash
# Usage: rb.sh script.js  — runs lib.js + script in Figma via the bridge.
SP="$(cd "$(dirname "$0")" && pwd)"  # lib_id holds the Components frame id (2:40 in the original file)
LIB_ID=$(cat "$SP/lib_id" 2>/dev/null || echo none)
ROOT_ID=2:39
cat "$SP/lib.js" "$1" | sed "s/__LIB__/$LIB_ID/; s/__ROOT__/$ROOT_ID/" | node /c/Users/BHUSHAN/Documents/code/personal/figma-bridge/src/cli.js run - --timeout 120000
