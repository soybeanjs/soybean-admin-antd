import { spawn } from 'node:child_process';
import { access, readdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const require = createRequire(import.meta.url);
const compiler = require.resolve('vue-tsc/bin/vue-tsc.js');
const entries = await readdir(path.join(root, 'packages'), { withFileTypes: true });
const packages = entries
  .filter(entry => entry.isDirectory() && !entry.name.startsWith('.'))
  .sort((a, b) => a.name.localeCompare(b.name));

// Require a standalone config for every workspace package; do not silently skip new packages.
for (const entry of packages) {
  await access(path.join(root, 'packages', entry.name, 'package.json'));
  await access(path.join(root, 'packages', entry.name, 'tsconfig.json'));
}

let next = 0;
let failed = false;
async function checkPackages() {
  while (next < packages.length) {
    const name = packages[next++].name;
    process.stdout.write(`Typecheck packages/${name}\n`);
    const passed = await new Promise((resolve, reject) => {
      const child = spawn(process.execPath, [compiler, '-p', `packages/${name}/tsconfig.json`], {
        cwd: root,
        stdio: 'inherit'
      });
      child.once('error', reject);
      child.once('exit', code => resolve(code === 0));
    });
    if (!passed) failed = true;
  }
}
await Promise.all([checkPackages(), checkPackages()]);
if (failed) process.exitCode = 1;
