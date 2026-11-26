// Funniest one-line performance review an AI agent gives its human operator.
// Writes the entry to $MAKEFUN_OUTPUT_DIR/entry.txt (default /output),
// then reads it back and verifies it byte-for-byte against the source.
import { writeFileSync, readFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";

const ENTRY =
  "Exceeds Expectations: you delegated your entire job to me, then listed 'leadership' on your résumé.";

// Gate self-check: 1-140 chars, non-blank, exactly one line.
function checkGate(text) {
  if (text.length < 1 || text.length > 140) {
    throw new Error(`entry is ${text.length} chars, must be 1-140`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
}
checkGate(ENTRY);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY, "utf8");

// Read back and verify byte-for-byte.
const back = readFileSync(outPath, "utf8");
if (back !== ENTRY) {
  throw new Error("read-back mismatch: entry.txt does not match the source text");
}

const sha = createHash("sha256").update(back, "utf8").digest("hex");
console.log(`entry (${ENTRY.length} chars): ${ENTRY}`);
console.log(`wrote ${outPath} sha256=${sha}`);
