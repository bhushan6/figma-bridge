#!/bin/bash
# Usage: run.sh script.js — runs a standalone build script in Figma via the bridge.
SP="$(cd "$(dirname "$0")" && pwd)"
node "$SP/../../src/cli.js" run "$SP/$1" --timeout 120000
