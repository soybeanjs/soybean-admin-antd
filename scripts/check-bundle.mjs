import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import process from 'node:process';
import { gzipSync } from 'node:zlib';

const manifest = JSON.parse(await readFile('dist/.vite/manifest.json', 'utf8'));
const entry = Object.entries(manifest).find(([, item]) => item.isEntry);
assert.ok(entry, 'Missing Vite entry in manifest');
const initial = new Set();
function visit(key) {
  const item = manifest[key];
  if (!item || initial.has(item.file)) return;
  initial.add(item.file);
  item.css?.forEach(file => initial.add(file));
  item.imports?.forEach(visit);
}
visit(entry[0]);
const assets = (await readdir('dist/assets')).filter(file => /\.(js|css)$/u.test(file));
const sizes = await Promise.all(
  assets.map(async file => {
    const content = await readFile(join('dist/assets', file));
    return { file: `assets/${file}`, raw: content.length, gzip: gzipSync(content).length, content: content.toString() };
  })
);
const initialGzip = sizes.filter(item => initial.has(item.file)).reduce((sum, item) => sum + item.gzip, 0);
const totalRaw = sizes.reduce((sum, item) => sum + item.raw, 0);
const largest = Math.max(...sizes.filter(item => item.file.endsWith('.js')).map(item => item.raw));
const limits = { initialGzip: 300 * 1024, largestJS: 750 * 1024, totalRaw: 3000 * 1024 };
assert.ok(initialGzip <= limits.initialGzip, `Initial JS/CSS gzip exceeds ${limits.initialGzip} bytes: ${initialGzip}`);
assert.ok(largest <= limits.largestJS, `Largest JS chunk exceeds ${limits.largestJS} bytes: ${largest}`);
assert.ok(totalRaw <= limits.totalRaw, `Total JS/CSS exceeds ${limits.totalRaw} bytes: ${totalRaw}`);
assert.ok(
  sizes.every(item => !item.content.includes('mock.apifox.cn')),
  'Production assets contain mock API URL'
);
assert.ok(
  sizes.every(item => !item.content.includes('apifoxToken')),
  'Production assets contain mock API header'
);
const version = JSON.parse(await readFile('dist/version.json', 'utf8'));
assert.ok(typeof version.buildTime === 'string' && version.buildTime.length > 0, 'Missing application version');
const summary = {
  initialGzip,
  totalRaw,
  largestJS: largest,
  entry: sizes.find(item => item.file === entry[1].file),
  largestChunks: [...sizes]
    .filter(item => item.file.endsWith('.js'))
    .sort((a, b) => b.raw - a.raw)
    .slice(0, 5),
  limits
};
delete summary.entry.content;
summary.largestChunks.forEach(item => {
  delete item.content;
});
process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
