/* eslint-disable no-await-in-loop -- Each rendering scenario must use a fresh document. */
import process from 'node:process';
import { test, expect } from './fixtures';

test('a hidden first local SVG does not erase the next instance or duplicate definition IDs', async ({ page }, testInfo) => {
  test.skip(process.env.E2E_PRODUCTION === '1', 'The isolated component fixture is served only by the Vite dev server');
  for (const icon of ['no-icon', 'expectation']) {
    const url = `/tests/e2e/fixtures/svg-instance.html?icon=${icon}`;
    await page.goto(url);
    await page.locator('#visible svg path').first().waitFor();
    const standalone = await page.locator('#visible').screenshot();
    await testInfo.attach(`${icon}-standalone`, { body: standalone, contentType: 'image/png' });
    await page.goto(`${url}&blank=1`);
    await page.locator('#visible svg path').first().waitFor({ state: 'attached' });
    const blank = await page.locator('#visible').screenshot();
    expect(standalone.equals(blank), `${icon} standalone rendering must not be blank`).toBe(false);
    await page.goto(`${url}&repeat=1`);
    await page.locator('#visible svg path').first().waitFor();
    const repeated = await page.locator('#visible').screenshot();
    await testInfo.attach(`${icon}-hidden-first`, { body: repeated, contentType: 'image/png' });
    const ids = await page.locator('svg [id]').evaluateAll(nodes => nodes.map(node => node.id));
    expect(new Set(ids).size, `${icon} definition IDs must be unique across instances`).toBe(ids.length);
    expect(repeated.equals(standalone), `${icon} must render identically when an earlier instance is hidden`).toBe(true);
  }
});
