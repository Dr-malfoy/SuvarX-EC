const fs = require('fs');
const path = require('path');

const replacements = [
  { search: /\bSize\b/g, replace: 'Variant' },
  { search: /\bsize\b/g, replace: 'variant' },
  { search: /\bSizes\b/g, replace: 'Variants' },
  { search: /\bsizes\b/g, replace: 'variants' },
  { search: /One Variant/g, replace: 'Standard' }, // "One Size" -> "One Variant" -> "Standard"
  { search: /One size/gi, replace: 'Standard' },
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.next') {
        processDirectory(fullPath);
      }
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      for (const r of replacements) {
        if (content.match(r.search)) {
          content = content.replace(r.search, r.replace);
          changed = true;
        }
      }
      if (changed) {
        // Fix some variables that might get renamed incorrectly if they need to map to the cart schema
        // The cart schema uses `size`, so let's keep the internal variable as `size` but UI as Variant
        // Actually, if we just rename everything to variant, the cart schema is in tsx/ts, so it's a safe refactor across the frontend.
        fs.writeFileSync(fullPath, content);
        console.log('Updated:', fullPath);
      }
    }
  }
}

processDirectory('./frontend');

console.log('Done replacing size to variant.');
