import assert from 'node:assert/strict';
import { cp, mkdir, mkdtemp, readFile, readdir, rm, symlink, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { after, before, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import vue from '@vitejs/plugin-vue';
import { createServer } from 'vite';
import { setupUnplugin } from '../build/plugins/unplugin.ts';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
let fixtureRoot;
let server;
let renderIcon;
let renderIcons;

before(async () => {
  fixtureRoot = await mkdtemp(path.join(os.tmpdir(), 'soybean-svg-icons-'));
  await mkdir(path.join(fixtureRoot, 'src/components/custom'), { recursive: true });
  await cp(path.join(projectRoot, 'src/assets/svg-icon'), path.join(fixtureRoot, 'src/assets/svg-icon'), {
    recursive: true
  });
  await cp(
    path.join(projectRoot, 'src/components/custom/svg-icon.vue'),
    path.join(fixtureRoot, 'src/components/custom/svg-icon.vue')
  );
  await symlink(path.join(projectRoot, 'node_modules'), path.join(fixtureRoot, 'node_modules'), 'dir');

  for (const [folder, color] of [['nested', 'red'], ['other', 'blue']]) {
    await mkdir(path.join(fixtureRoot, 'src/assets/svg-icon', folder), { recursive: true });
    await writeFile(
      path.join(fixtureRoot, 'src/assets/svg-icon', folder, 'sample.svg'),
      `<svg viewBox="0 0 24 24"><defs><linearGradient id="paint"><stop stop-color="${color}"/></linearGradient></defs><path fill="url(#paint)" d="M0 0h24v24H0z"/></svg>`
    );
  }

  await writeFile(
    path.join(fixtureRoot, 'src/assets/svg-icon/references.svg'),
    `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24">
<style>@media (min-width:1px) { #shape { fill:url(#paint);stroke:url(#paint) } }</style>
<defs><linearGradient id="paint"><stop stop-color="red"/></linearGradient>
<path id="shape" d="M0 0h10v10H0z" fill="url(#paint)"/></defs>
<use href="#shape"/><use xlink:href="#shape" x="12"/>
<path d="M0 12h24v12H0z" style="--paints:url(#paint) url(#paint);fill:url(#paint)"/>
</svg>`
  );

  await writeFile(
    path.join(fixtureRoot, 'entry.js'),
    `import { createSSRApp, h } from 'vue';
import { renderToString } from 'vue/server-renderer';
import SvgIcon from './src/components/custom/svg-icon.vue';
export const renderIcon = props => renderToString(createSSRApp({ render: () => h(SvgIcon, props) }));
export const renderIcons = (localIcon = 'no-icon') => renderToString(createSSRApp({ render: () => h('div', [
  h('div', { style: 'display:none' }, [h(SvgIcon, { localIcon })]),
  h(SvgIcon, { localIcon })
]) }));`
  );

  const loader = setupUnplugin({ VITE_ICON_PREFIX: 'icon', VITE_ICON_LOCAL_PREFIX: 'local-icon' }).find(
    plugin => plugin.name === 'svg-loader'
  );
  assert.ok(loader, 'the maintained SVG component loader is configured');
  server = await createServer({
    configFile: false,
    root: fixtureRoot,
    plugins: [vue(), loader],
    server: { middlewareMode: true },
    logLevel: 'error'
  });
  ({ renderIcon, renderIcons } = await server.ssrLoadModule('/entry.js'));
});

after(async () => {
  await server?.close();
  if (fixtureRoot) await rm(fixtureRoot, { recursive: true, force: true });
});

function assertReferencesResolve(html) {
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]));
  for (const match of html.matchAll(/url\(#([^)]+)\)/g)) {
    assert.ok(ids.has(match[1]), `the SVG reference ${match[1]} has a matching definition`);
  }
  return ids;
}

test('local icons retain their size, color, class, style and source fill', async () => {
  const html = await renderIcon({ localIcon: 'wind', class: 'example-icon', style: 'color:red' });
  assert.match(html, /width="1em"/);
  assert.match(html, /height="1em"/);
  assert.match(html, /fill="currentColor"/);
  assert.match(html, /class="example-icon"/);
  assert.match(html, /style="color:red;?"/);
  assert.match(html, /viewBox="0 0 24 24"/);
  assert.match(html, /fill="none"/);
  assert.match(html, /width="100%"/);
  assert.match(html, /height="100%"/);
});

test('missing or empty local icon names fall back to no-icon', async () => {
  const fallback = await renderIcon({ localIcon: 'no-icon' });
  assert.equal(await renderIcon({ localIcon: 'missing-icon' }), fallback);
  assert.equal(await renderIcon({}), fallback);
  assertReferencesResolve(fallback);
});

test('local icons take priority over an Iconify name', async () => {
  assert.equal(
    await renderIcon({ localIcon: 'heart', icon: 'mdi:home' }),
    await renderIcon({ localIcon: 'heart' })
  );
});

test('nested names and identical definition names in different SVGs remain independent', async () => {
  const first = await renderIcon({ localIcon: 'nested-sample' });
  const second = await renderIcon({ localIcon: 'other-sample' });
  assert.match(first, /stop-color="red"/);
  assert.match(second, /stop-color="(?:blue|#00f)"/);
  const firstIds = assertReferencesResolve(first);
  const secondIds = assertReferencesResolve(second);
  assert.ok(firstIds.size > 0);
  assert.ok(secondIds.size > 0);
  for (const id of firstIds) assert.equal(secondIds.has(id), false);
});

test('the legacy vulnerable sprite module is no longer registered', async () => {
  const assets = await readFile(path.join(projectRoot, 'src/plugins/assets.ts'), 'utf8');
  assert.equal(assets.includes('virtual:svg-icons-register'), false);
});


test('all existing local SVGs compile and keep valid definition references', async () => {
  const files = await readdir(path.join(projectRoot, 'src/assets/svg-icon'), { recursive: true });
  for (const file of files.filter(name => name.endsWith('.svg'))) {
    const localIcon = file.slice(0, -4).split(path.sep).join('-');
    const html = await renderIcon({ localIcon });
    assert.match(html, /viewBox="/);
    assert.match(html, /<(?:path|rect|circle|ellipse|polygon|polyline|line)\b/);
    assertReferencesResolve(html);
  }
});

test('ordinary SVG imports remain asset URLs', async () => {
  const asset = await server.ssrLoadModule('/src/assets/svg-icon/logo.svg?url');
  assert.equal(typeof asset.default, 'string');
  assert.match(asset.default, /^(?:data:image\/svg\+xml|\/.*\.svg)/);
  const ordinaryAsset = await server.ssrLoadModule('/src/assets/svg-icon/logo.svg');
  assert.equal(ordinaryAsset.default, asset.default);
});


test('repeated instances have distinct definitions and deterministic SSR IDs', async () => {
  const html = await renderIcons();
  const idValues = [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(idValues.length, 34);
  assert.equal(new Set(idValues).size, idValues.length);
  assertReferencesResolve(html);
  assert.equal(await renderIcons(), html, 'the same SSR tree produces stable IDs for hydration');
});


test('instance IDs also scope href, xlink, multiple style URLs and style selectors', async () => {
  const html = await renderIcons('references');
  const idValues = [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
  assert.ok(idValues.length > 0);
  assert.equal(new Set(idValues).size, idValues.length);
  const ids = assertReferencesResolve(html);
  const hrefs = [...html.matchAll(/(?:xlink:)?href="#([^"]+)"/g)].map(match => match[1]);
  assert.equal(hrefs.length, 4);
  for (const id of hrefs) assert.ok(ids.has(id));
  const styles = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(match => match[1]);
  assert.equal(styles.length, 2);
  assert.notEqual(styles[0], styles[1]);
  for (const css of styles) {
    for (const match of css.matchAll(/#([A-Za-z_][\w-]*)/g)) assert.ok(ids.has(match[1]));
  }
  assert.match(html, /--paints:url\(#v-0-/);
  assert.match(html, /--paints:url\(#v-1-/);
});
