# Frame 77 recreation scripts

Scripts that rebuilt Frame 77's screenshots as editable layers through the bridge.
Each `screen-*.js` is idempotent: it replaces its own screen inside "Frame 77 – Recreated".

Run one with `./rb.sh screen-editor.js` (prepends `lib.js`; node ids for the
Components frame and the recreated root are substituted in). Build order on a
fresh file: `icons.js`, `comps-editor.js`, `comps-panel.js`, `patch-logo.js`,
then the screen scripts. `cmpnode.sh` exports a screen and puts it next to a
reference image for comparison. Keep Figma visible while exporting.
