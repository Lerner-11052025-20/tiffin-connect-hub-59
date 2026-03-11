const fs = require('fs');
const path = require('path');

function walkSync(dir, filelist = []) {
    if (!fs.existsSync(dir)) return filelist;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            filelist = walkSync(fullPath, filelist);
        } else {
            filelist.push(fullPath);
        }
    }
    return filelist;
}

const files = walkSync('./src');
let changedCount = 0;

for (const file of files) {
    if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.css') || file.endsWith('.jsx') || file.endsWith('.js')) {
        let content = fs.readFileSync(file, 'utf8');
        const originalContent = content;

        // 1. Remove Tailwind 'hover:' prefixed utilities
        // The regex matches 'hover:' plus any non-whitespace, non-quote character
        content = content.replace(/\bhover:[^\s"'`]+(?:\s|$)/g, ' ');
        content = content.replace(/\bgroup-hover:[^\s"'`]+(?:\s|$)/g, ' ');

        // 2. Remove Framer Motion 'whileHover'
        content = content.replace(/\bwhileHover=\{[^\}]+\}/g, '');
        content = content.replace(/whileHover=\{\{(?:[^{}]+|(?:\{[^{}]*\}))*\}\}/g, '');
        content = content.replace(/whileHover=\{[^{}]*\}/g, '');

        // 3. Remove .hover- classes from CSS directly
        if (file.endsWith('.css')) {
            content = content.replace(/\.hover-[a-zA-Z0-9\-]+\s*\{[\s\S]*?\}/g, '');
        }

        // Cleanup excessive spaces in strings
        content = content.replace(/className=(['"`])\s+/g, 'className=$1');
        content = content.replace(/\s+(['"`])/g, '$1');

        if (content !== originalContent) {
            fs.writeFileSync(file, content);
            changedCount++;
        }
    }
}
console.log('Removed hover effects from ' + changedCount + ' files.');
