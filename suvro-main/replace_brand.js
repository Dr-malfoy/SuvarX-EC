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
            if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.json') || file.endsWith('.md')) {
                if (!file.endsWith('package-lock.json') && !file.endsWith('tsconfig.tsbuildinfo')) {
                    results.push(file);
                }
            }
        }
    });
    return results;
}

const files = walk('/Users/tanvirsamio/Downloads/suvarxnewsoft/frontend');
files.push(...walk('/Users/tanvirsamio/Downloads/suvarxnewsoft/backend'));

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    // Replace all variations of aviar/avaire/vaiar
    content = content.replace(/AVIAR/g, 'SUVAR');
    content = content.replace(/Aviar/g, 'SUVAR');
    content = content.replace(/aviar/g, 'suvar');
    
    content = content.replace(/AVAIRE/g, 'SUVAR');
    content = content.replace(/Avaire/g, 'SUVAR');
    content = content.replace(/avaire/g, 'suvar');
    
    content = content.replace(/VAIAR/g, 'SUVAR');
    content = content.replace(/Vaiar/g, 'SUVAR');
    content = content.replace(/vaiar/g, 'suvar');
    
    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated ${file}`);
    }
});
