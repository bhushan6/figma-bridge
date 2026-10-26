# Group 164 recreation

Rebuilds Group 164 (39:2667) as editable layers in "Group 164 – Recreated", placed 200 px
below the original. Three panels, each replaced in place by its own script:

| Script | Panel | Source |
| --- | --- | --- |
| `./run.sh panel-sign.js` | Sign dialog (draw signature) | Group 162 (37:2671) |
| `./contract.sh` | Contract page, clauses 24–25 and signatures | Group 163 (37:2668) |
| `./run.sh panel-signers.js` | Signers dialog | 37:2667 |

`run.sh` prepends `../frame-77/lib.js` and `g164.js` (root frame, panel slots, small helpers).
Icons come from the Components frame (2:40). The drawn signature and the cursor are cloned from
the original vectors; the second party's handwritten signature stays an image (`out/sig2.png`,
cut from a 3x export and uploaded by `contract.sh`).

Measuring: `bbox.py` (ink bounds and row/column runs in node units) on 2x exports in `out/`;
`cmp.py <nodeId> <ref.png> <prefix>` stacks a fresh export under the reference.
