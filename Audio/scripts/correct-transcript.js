#!/usr/bin/env node
/**
 * Apply MarketAmerica transcript corrections for speech-to-text errors.
 * Usage: node Audio/scripts/correct-transcript.js <input.txt> [output.txt]
 */

const fs = require('fs');
const path = require('path');

const inputPath = process.argv[2];
const outputPath =
  process.argv[3] ||
  inputPath.replace(/_original(\.[^.]+)$/, '_corrected$1').replace(/(\.[^.]+)$/, '_corrected$1');

if (!inputPath) {
  console.error('Usage: node correct-transcript.js <input.txt> [output.txt]');
  process.exit(1);
}

const CORRECTIONS = [
  // Product names (order matters — longer phrases first)
  [/TLS Teal Light Powder/gi, 'TLS Tea Light Powder'],
  [/selek alu powder/gi, 'Select Aloe Powder'],
  [/selek alfabia/gi, 'Select Aloe Vera'],
  [/selek alu/gi, 'Select Aloe'],
  [/selek alo/gi, 'Select Aloe'],
  [/\btea light powder\b/gi, 'TLS Tea Light Powder'],
  // Indonesian regulatory body
  [/Betom/g, 'BPOM'],
];

let text = fs.readFileSync(inputPath, 'utf8');
for (const [pattern, replacement] of CORRECTIONS) {
  text = text.replace(pattern, replacement);
}
text = text.replace(/TLS TLS Tea Light Powder/gi, 'TLS Tea Light Powder');

const header = `# MarketAmerica Live Transcript (corrected)
# Source: ${path.basename(inputPath)}
# Corrections: Betom→BPOM, TLS Teal Light→TLS Tea Light, selek alo/alu→Select Aloe
#
`;

fs.writeFileSync(outputPath, header + text);
console.log(`Corrected transcript written to ${outputPath}`);
