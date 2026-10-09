import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { test as base, expect } from '@playwright/test';
import type { Page, Route, TestInfo } from '@playwright/test';
import { getFixtureResponse } from './api-fixtures';

const require = createRequire(import.meta.url);
const iconCollections = new Map<string, string>();

interface ApiState {
  loginRequests: number;
  userListRequests: number;
  refreshRequests: number;
  expireNextUserList: boolean;
  userListAuthorization: string[];
  unmatchedRequests: string[];
  pageErrors: string[];
}

export const test = base.extend<{ api: ApiState }>({
  api: [
    async ({ page }, use, testInfo) => {
      const api: ApiState = { loginRequests: 0, userListRequests: 0, refreshRequests: 0, expireNextUserList: false, userListAuthorization: [], unmatchedRequests: [], pageErrors: [] };
      page.on('pageerror', error => api.pageErrors.push(error.message));
      await page.addInitScript(() => {
        if (!localStorage.getItem('SOY_lang')) localStorage.setItem('SOY_lang', JSON.stringify('en-US'));
      });
      const handle = async (route: Route) => {
        const request = route.request();
        const url = new URL(request.url());
        const body = request.method() === 'POST' ? request.postDataJSON() : undefined;
        if (url.pathname.endsWith('/auth/login')) api.loginRequests += 1;
        if (url.pathname.endsWith('/auth/refreshToken')) api.refreshRequests += 1;
        if (url.pathname.endsWith('/systemManage/getUserList')) {
          api.userListRequests += 1;
          api.userListAuthorization.push(request.headers().authorization || '');
          if (api.expireNextUserList) {
            api.expireNextUserList = false;
            await route.fulfill({ json: { code: '9999', data: null, msg: 'Fixture token expired' } });
            return;
          }
        }
        const response = getFixtureResponse(url, body);
        if (!response) api.unmatchedRequests.push(request.url());
        await route.fulfill({
          status: response ? 200 : 501,
          json: response || { code: '501', data: null, msg: 'Missing E2E fixture' }
        });
      };
      await page.route('https://mock.apifox.cn/m1/3109515-0-default/**', handle);
      await page.route('http://127.0.0.1:9530/**', handle);
      // Use the installed icon dataset instead of depending on public icon API uptime.
      await page.route(/^https:\/\/api\.(?:iconify\.design|simplesvg\.com|unisvg\.com)\//, async route => {
        const prefix = new URL(route.request().url()).pathname.match(/^\/([a-z0-9-]+)\.json$/)?.[1];
        if (!prefix) {
          await route.abort();
          return;
        }
        let body = iconCollections.get(prefix);
        if (!body) {
          body = await readFile(require.resolve(`@iconify/json/json/${prefix}.json`), 'utf8');
          iconCollections.set(prefix, body);
        }
        await route.fulfill({ contentType: 'application/json', body });
      });
      await use(api);
      await testInfo.attach('frontend-fixture-evidence', {
        body: JSON.stringify({ backend: 'intercepted synthetic fixtures; no live backend verified', browserVersion: page.context().browser()?.version(), ...api }, null, 2),
        contentType: 'application/json'
      });
      expect(api.unmatchedRequests, 'Every backend request must have an explicit deterministic fixture').toEqual([]);
    },
    { auto: true }
  ]
});

export { expect };

export async function login(page: Page, path = '/login') {
  await page.goto(path);
  await page.getByPlaceholder('Please enter user name', { exact: true }).fill('Soybean');
  await page.getByPlaceholder('Please enter password', { exact: true }).fill('123456');
  await page.getByRole('button', { name: 'Confirm', exact: true }).click();
  await expect(page.getByRole('button', { name: 'E2E Soybean', exact: true })).toBeVisible();
}

export async function captureScreenshot(page: Page, testInfo: TestInfo, name: string) {
  const path = testInfo.outputPath(`${name}.png`);
  await page.screenshot({ path, fullPage: true });
  await testInfo.attach(name, { path, contentType: 'image/png' });
}
