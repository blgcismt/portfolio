// Run: node scripts/build-tr-wordlist.mjs
// Reads tr-words.json from project root, filters to valid Wordle guesses,
// and writes the VALID_TR set to lib/wordle-valid.ts

import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { join, dirname } from "path";

const __dir = dirname(fileURLToPath(import.meta.url));
const root = join(__dir, "..");

const raw = JSON.parse(readFileSync(join(root, "tr-words.json"), "utf8"));

// Keep only 5-character words (by Unicode codepoint count, not byte length)
// and skip proper nouns (words that start with an uppercase letter)
const words = raw.filter(w => {
  if (typeof w !== "string") return false;
  const chars = [...w]; // spread handles multi-byte Turkish chars correctly
  if (chars.length !== 5) return false;
  if (w[0] !== w[0].toLowerCase()) return false; // skip proper nouns
  return true;
}).map(w => w.toLowerCase());

const unique = [...new Set(words)].sort();
console.log(`Filtered to ${unique.length} valid words.`);

// Read existing file, replace VALID_TR export only
const validPath = join(root, "lib", "wordle-valid.ts");
const existing = readFileSync(validPath, "utf8");

const wordListLiteral = unique.map(w => JSON.stringify(w)).join(",\n  ");
const newExport = `export const VALID_TR: Set<string> = new Set([\n  ${wordListLiteral},\n]);`;

const updated = existing.replace(
  /export const VALID_TR[\s\S]*?;/,
  newExport
);

writeFileSync(validPath, updated, "utf8");
console.log("Updated lib/wordle-valid.ts with new VALID_TR.");
