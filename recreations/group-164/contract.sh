#!/bin/bash
# Builds panel B, then fills its handwritten signature with out/sig2.png.
SP="$(cd "$(dirname "$0")" && pwd)"
OUT=$("$SP/run.sh" "$SP/panel-contract.js") || { echo "$OUT"; exit 1; }
echo "$OUT"
SIG=$(echo "$OUT" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>console.log(JSON.parse(s).sig2))')
node "$SP/../../src/cli.js" upload "$SP/out/sig2.png" --node "$SIG" --mode FILL
