/* eslint-disable no-await-in-loop -- Sequential UI steps intentionally exercise repeated actions and history. */
import process from 'node:process';
import { captureScreenshot, expect, login, test } from './fixtures';

test('login validates fields and survives reset-password interruption and history', async ({ page, api }) => {
  await page.goto('/login');
  await page.getByPlaceholder('Please enter user name', { exact: true }).clear();
  await page.getByPlaceholder('Please enter password', { exact: true }).clear();
  await page.getByRole('button', { name: 'Confirm', exact: true }).click();
  await expect(
    page.locator('.ant-form-item-explain-error').filter({ hasText: 'Please enter user name' })
  ).toBeVisible();
  await expect(page.locator('.ant-form-item-explain-error').filter({ hasText: 'Please enter password' })).toBeVisible();
  expect(api.loginRequests).toBe(0);
  await page.getByPlaceholder('Please enter user name', { exact: true }).fill('Soybean');
  await page.getByPlaceholder('Please enter password', { exact: true }).fill('123');
  await page.getByRole('button', { name: 'Confirm', exact: true }).click();
  await expect(page.getByText('6-18 characters, including letters, numbers, and underscores')).toBeVisible();
  expect(api.loginRequests).toBe(0);
  await page.getByRole('button', { name: 'Forget password?' }).click();
  await expect(page.getByRole('heading', { name: 'Reset Password' })).toBeVisible();
  await page.getByPlaceholder('Please enter phone number').fill('13800000001');
  await page.getByRole('button', { name: 'Back', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Password Login' })).toBeVisible();
  await page.goBack();
  await expect(page.getByRole('heading', { name: 'Reset Password' })).toBeVisible();
  await page.goForward();
  await expect(page.getByRole('heading', { name: 'Password Login' })).toBeVisible();
  expect(api.loginRequests).toBe(0);
});

test('failed login can retry successfully and retains the protected-route redirect', async ({ page, api }) => {
  await page.goto('/manage/user');
  await expect(page).toHaveURL(/\/login\?redirect=/);
  await page.getByPlaceholder('Please enter password', { exact: true }).fill('badpass');
  await page.getByRole('button', { name: 'Confirm', exact: true }).click();
  await expect(page.getByText('Fixture credentials rejected')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Confirm', exact: true })).toBeEnabled();
  expect(api.loginRequests).toBe(1);
  await page.getByPlaceholder('Please enter password', { exact: true }).fill('123456');
  await page.getByRole('button', { name: 'Confirm', exact: true }).click();
  await expect(page).toHaveURL(/\/manage\/user$/);
  await expect(page.getByRole('cell', { name: 'fixture-alice', exact: true })).toBeVisible();
  expect(api.loginRequests).toBe(2);
});

test('dashboard renders both ECharts canvases and migrated local SVG artwork', async ({ page, api }, testInfo) => {
  await login(page);
  await expect(page).toHaveURL(/\/home$/);
  await expect(page.getByRole('heading', { name: /Good morning, E2E Soybean/ })).toBeVisible();
  const charts = page.locator('[_echarts_instance_]');
  await expect(charts).toHaveCount(2);
  for (const [chartIndex, chart] of (await charts.all()).entries()) {
    const canvas = chart.locator('canvas').first();
    await expect(canvas).toBeVisible();
    await expect
      .poll(() =>
        canvas.evaluate(element => {
          const node = element as HTMLCanvasElement;
          const pixels = node.getContext('2d')?.getImageData(0, 0, node.width, node.height).data;
          if (!pixels) return 0;
          let coloredPixels = 0;
          for (let index = 0; index < pixels.length; index += 4) {
            const [red, green, blue, alpha] = pixels.subarray(index, index + 4);
            if (alpha > 0 && Math.max(red, green, blue) - Math.min(red, green, blue) > 30) coloredPixels += 1;
          }
          return coloredPixels;
        })
      )
      .toBeGreaterThan(5000);
    const path = testInfo.outputPath(`dashboard-chart-${chartIndex}.png`);
    await chart.screenshot({ path });
    await testInfo.attach(`dashboard-chart-${chartIndex}`, { path, contentType: 'image/png' });
  }
  const artwork = page.locator('.ant-card').filter({ has: page.getByText('Creativity', { exact: true }) });
  await artwork.scrollIntoViewIfNeeded();
  await expect(artwork.locator('svg')).toBeVisible();
  expect(await artwork.locator('svg path').count()).toBeGreaterThan(0);
  await captureScreenshot(page, testInfo, 'dashboard-local-svg');
  await page.reload();
  await expect(page.getByRole('button', { name: 'E2E Soybean', exact: true })).toBeVisible();
  await expect(charts).toHaveCount(2);
  expect(api.pageErrors).toEqual([]);
});

test('theme and locale handle repeated changes and the correct reload behavior', async ({ page }) => {
  await page.goto('/login');
  // The login header contains the theme button followed by the language dropdown.
  const theme = page.locator('header button').nth(0);
  const language = page.locator('header button').nth(1);
  await theme.click();
  await expect(page.locator('html')).toHaveClass(/dark/);
  await theme.click();
  await expect(page.locator('html')).not.toHaveClass(/dark/);
  await theme.click();
  await theme.click();
  await expect(page.locator('html')).toHaveClass(/dark/);
  await language.hover();
  await page.getByRole('menuitem', { name: '中文', exact: true }).click();
  await expect(page.getByRole('heading', { name: '密码登录', exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: '密码登录', exact: true })).toBeVisible();
  // The application deliberately caches theme settings only in production.
  if (process.env.E2E_PRODUCTION === '1') {
    await expect(page.locator('html')).toHaveClass(/dark/);
  } else {
    await expect(page.locator('html')).not.toHaveClass(/dark/);
  }
  await language.hover();
  await page.getByRole('menuitem', { name: 'English', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Password Login', exact: true })).toBeVisible();
});

test('management lists, filters, refreshes, and cancels repeated add/edit drawers', async ({ page, api }, testInfo) => {
  await login(page, '/manage/user');
  await expect(page.getByRole('cell', { name: 'fixture-alice', exact: true })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'fixture-bob', exact: true })).toBeVisible();
  await page.getByPlaceholder('Please enter user name', { exact: true }).fill('fixture-alice');
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  await expect(page.getByRole('cell', { name: 'fixture-bob', exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Reset', exact: true }).click();
  await expect(page.getByPlaceholder('Please enter user name', { exact: true })).toHaveValue('');
  // Reset clears the fields; Search explicitly reloads the list.
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  await expect(page.getByRole('cell', { name: 'fixture-bob', exact: true })).toBeVisible();
  const requests = api.userListRequests;
  await page.getByRole('button', { name: 'Refresh', exact: true }).click();
  await expect.poll(() => api.userListRequests).toBeGreaterThan(requests);
  for (let attempt = 0; attempt < 2; attempt += 1) {
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    const drawer = page.locator('.ant-drawer-content');
    await expect(drawer.getByText('Add User', { exact: true })).toBeVisible();
    await expect(drawer.getByPlaceholder('Please enter user name')).toHaveValue('');
    await drawer.getByPlaceholder('Please enter user name').fill('discarded-draft');
    await drawer.getByRole('button', { name: 'Cancel', exact: true }).click();
    await expect(drawer).toBeHidden();
    await expect(page).toHaveURL(/\/manage\/user$/);
  }
  await page
    .getByRole('row')
    .filter({ has: page.getByRole('cell', { name: 'fixture-alice', exact: true }) })
    .getByRole('button', { name: 'Edit', exact: true })
    .click();
  await expect(page.locator('.ant-drawer-content').getByPlaceholder('Please enter user name')).toHaveValue('fixture-alice');
  await page.locator('.ant-drawer-content').getByRole('button', { name: 'Close', exact: true }).click();
  await expect(page.locator('.ant-drawer-content')).toBeHidden();
  await captureScreenshot(page, testInfo, 'management-after-cancel');
  expect(api.pageErrors).toEqual([]);
});

test('navigation history and logout cancel/confirm preserve correct auth state', async ({ page, api }) => {
  await login(page);
  await page.getByRole('menuitem', { name: 'About', exact: true }).click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.getByText('Project Info', { exact: true })).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/\/home$/);
  await page.goForward();
  await expect(page).toHaveURL(/\/about$/);
  await page.getByRole('button', { name: 'E2E Soybean', exact: true }).click();
  await page.getByRole('menuitem', { name: 'Logout', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(page).toHaveURL(/\/about$/);
  await page.getByRole('button', { name: 'E2E Soybean', exact: true }).click();
  await page.getByRole('menuitem', { name: 'Logout', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Confirm', exact: true }).click();
  await expect(page).toHaveURL(/\/login/);
  await page.goBack();
  await expect(page.getByRole('heading', { name: 'Password Login', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'E2E Soybean', exact: true })).toHaveCount(0);
  expect(api.pageErrors).toEqual([]);
});

test('dynamic local SVGs render on every exception screen and return to login', async ({ page, api }, testInfo) => {
  for (const code of ['403', '404', '500']) {
    await page.goto(`/${code}`);
    const artwork = page.locator('svg[aria-hidden="true"]');
    await expect(artwork).toBeVisible();
    expect(await artwork.locator('path').count()).toBeGreaterThan(0);
    const bounds = await artwork.boundingBox();
    expect(bounds?.width).toBeGreaterThan(100);
    expect(bounds?.height).toBeGreaterThan(100);
    await captureScreenshot(page, testInfo, `exception-${code}`);
    await page.getByRole('button', { name: 'Back to home', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Password Login', exact: true })).toBeVisible();
  }
  expect(api.pageErrors).toEqual([]);
});

test('expired token refreshes once and retries the request with the new authorization', async ({ page, api }) => {
  await login(page, '/manage/user');
  await expect(page.getByRole('cell', { name: 'fixture-alice', exact: true })).toBeVisible();
  const requests = api.userListRequests;
  api.expireNextUserList = true;
  await page.getByRole('button', { name: 'Refresh', exact: true }).click();
  await expect.poll(() => api.refreshRequests).toBe(1);
  await expect.poll(() => api.userListRequests).toBe(requests + 2);
  await expect.poll(() => api.userListAuthorization.at(-1)).toBe('Bearer e2e-refreshed-token');
  await expect(page.getByRole('cell', { name: 'fixture-alice', exact: true })).toBeVisible();
  await expect(page).toHaveURL(/\/manage\/user$/);
  await expect(page.getByRole('button', { name: 'E2E Soybean', exact: true })).toBeVisible();
  expect(api.loginRequests).toBe(1);
  expect(api.pageErrors).toEqual([]);
});
