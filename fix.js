const fs = require('fs');
let c = fs.readFileSync('pnpm-workspace.yaml', 'utf8');
c = c.split('\n').filter(l => !l.includes('win32')).join('\n');
c = c.replace('esbuild: "0.27.3"', 'esbuild: "0.27.7"');
fs.writeFileSync('pnpm-workspace.yaml', c);
