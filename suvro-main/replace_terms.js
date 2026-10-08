const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            if (!file.includes('node_modules') && !file.includes('.next') && !file.includes('.git')) {
                results = results.concat(walk(file));
            }
        } else {
            if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.json')) {
                if (!file.endsWith('package-lock.json') && !file.endsWith('tsconfig.tsbuildinfo')) {
                    results.push(file);
                }
            }
        }
    });
    return results;
}

const files = walk('/Users/tanvirsamio/Downloads/suvarxnewsoft/frontend');

const replacements = [
    [/apparel/gi, 'accessories'],
    [/clothing/gi, 'car accessories'],
    [/garment/gi, 'gear'],
    [/fashion/gi, 'automotive'],
    [/fabric/gi, 'material'],
    [/tailored/gi, 'engineered'],
    [/wear/gi, 'drive'],
    [/sizes/g, 'options'],
    [/size guide/gi, 'fitment guide'],
    [/Dresses/g, 'Seat Covers'],
    [/Trousers/g, 'Dash Cams'],
    [/Silk/g, 'Floor Mats'],
    [/Knitwear/g, 'Jump Starters'],
    [/demo review/gi, 'review'],
    [/wardrobe/gi, 'vehicle'],
    [/outfit/gi, 'setup'],
];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    replacements.forEach(([regex, replacement]) => {
        // Only replace if it doesn't break code (case by case, but regex global is fine for text)
        // Since we are replacing text, we need to be careful with variable names like `sizes` -> `options`
        content = content.replace(regex, replacement);
    });
    
    // Some specific cases
    content = content.replace(/clothing-specific/g, 'accessory-specific');
    
    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated terms in ${file}`);
    }
});
