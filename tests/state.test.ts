import assert from 'node:assert/strict';
import { test } from 'node:test';
import { effectScope } from 'vue';
import { normalizeLocale } from '../src/locales/utils';
import { createStorage } from '../packages/utils/src/storage';
import { getEmbeddedURL } from '../src/utils/url';
import { readAppVersion } from '../src/plugins/version';
import en from '../src/locales/langs/en-us';
import zh from '../src/locales/langs/zh-cn';
import { createAuthSession } from '../src/store/modules/auth/session';
import useCountDown from '../packages/hooks/src/use-count-down';
import useTable from '../packages/hooks/src/use-table';

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<T>((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
}
function tableHarness() {
  const jobs: ReturnType<typeof deferred<number>>[] = [];
  const fetched: number[] = [];
  const scope = effectScope();
  const table = scope.run(() =>
    useTable({
      api: async () => {
        const job = deferred<number>();
        jobs.push(job);
        return job.promise;
      },
      pagination: true,
      immediate: false,
      columns: () => [],
      getColumnChecks: () => [],
      getColumns: () => [],
      transform: value => ({ data: [{ index: value }], pageNum: value, pageSize: 10, total: 20 }),
      onFetched: result => {
        fetched.push(result.pageNum);
      }
    })
  )!;
  return { table, jobs, scope, fetched };
}
for (const newestFirst of [true, false]) {
  test(`tables only accept the latest request, completion order newestFirst=${newestFirst}`, async () => {
    const { table, jobs, scope, fetched } = tableHarness();
    const old = table.getData();
    const latest = table.getData();
    if (newestFirst) {
      jobs[1].resolve(2);
      await latest;
      jobs[0].resolve(1);
      await old;
    } else {
      jobs[0].resolve(1);
      await old;
      assert.equal(table.loading.value, true);
      jobs[1].resolve(2);
      await latest;
    }
    assert.deepEqual(fetched, [2]);
    assert.equal(table.data.value[0].index, 2);
    assert.equal(table.loading.value, false);
    scope.stop();
  });
}
test('table errors clear loading and unmount discards pending results', async () => {
  const { table, jobs, scope } = tableHarness();
  const failed = table.getData();
  jobs[0].reject(new Error('offline'));
  await failed;
  assert.ok(table.error.value);
  assert.equal(table.empty.value, false);
  assert.equal(table.loading.value, false);
  const pending = table.getData();
  scope.stop();
  jobs[1].resolve(2);
  await pending;
  assert.deepEqual(table.data.value, []);
});
test('logout clears startup credentials and uses fresh arrays on every reset', () => {
  let clears = 0;
  const session = createAuthSession('startup-token', () => {
    clears += 1;
  });
  session.userInfo.roles.push('super');
  session.clearSession();
  assert.equal(session.token.value, '');
  assert.equal(session.isLogin.value, false);
  session.userInfo.buttons.push('stale');
  session.clearSession();
  assert.deepEqual(session.userInfo.roles, []);
  assert.deepEqual(session.userInfo.buttons, []);
  assert.equal(session.sessionVersion.value, 2);
  assert.equal(clears, 2);
});
test('countdown uses elapsed wall time and releases its timer on scope disposal', context => {
  context.mock.timers.enable({ apis: ['Date', 'setInterval'], now: 1000 });
  const scope = effectScope();
  const timer = scope.run(() => useCountDown(10))!;
  timer.start();
  context.mock.timers.setTime(9000);
  context.mock.timers.tick(250);
  assert.equal(timer.count.value, 2);
  context.mock.timers.tick(2000);
  assert.equal(timer.isCounting.value, false);
  timer.start();
  scope.stop();
  context.mock.timers.tick(1000);
  assert.equal(timer.count.value, 0);
});
class MemoryStorage {
  items = new Map<string, string>();
  get length() {
    return this.items.size;
  }
  key(index: number) {
    return [...this.items.keys()][index] ?? null;
  }
  getItem(key: string) {
    return this.items.get(key) ?? null;
  }
  setItem(key: string, value: string) {
    this.items.set(key, value);
  }
  removeItem(key: string) {
    this.items.delete(key);
  }
}
test('storage preserves falsy values, removes malformed JSON, and clears only its prefix', context => {
  const stg = new MemoryStorage();
  Object.defineProperty(globalThis, 'window', { configurable: true, get: () => ({ localStorage: stg }) });
  context.after(() => Reflect.deleteProperty(globalThis, 'window'));
  const storage = createStorage<{ value: unknown }>('local', 'app:');
  for (const value of [false, 0, '']) {
    storage.set('value', value);
    assert.equal(storage.get('value'), value);
  }
  stg.setItem('app:value', '{');
  assert.equal(storage.get('value'), null);
  assert.equal(stg.getItem('app:value'), null);
  stg.setItem('other:value', 'keep');
  storage.set('value', true);
  storage.clear();
  assert.equal(stg.getItem('other:value'), 'keep');
  assert.equal(storage.get('value'), null);
});
test('restricted storage retains an in-memory session and remove invalidates it', context => {
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    get: () => {
      throw new Error('disabled');
    }
  });
  context.after(() => Reflect.deleteProperty(globalThis, 'window'));
  const storage = createStorage<{ token: string }>('session', 'app:');
  storage.set('token', 'session-token');
  assert.equal(storage.get('token'), 'session-token');
  storage.remove('token');
  assert.equal(storage.get('token'), null);
});
test('version check accepts only a valid successful response and absorbs network/JSON failures', async () => {
  for (const [body, status, expected] of [
    [{ buildTime: 'new' }, 200, 'new'],
    [{}, 200, null],
    [{ buildTime: 'new' }, 500, null],
    [{ buildTime: '' }, 200, null]
  ] as const) {
    // Independent response cases are intentionally exercised in order.
    assert.equal(
      // eslint-disable-next-line no-await-in-loop
      await readAppVersion('/version.json', async () => new Response(JSON.stringify(body), { status })),
      expected
    );
  }
  assert.equal(await readAppVersion('/version.json', async () => new Response('<html>')), null);
  assert.equal(
    await readAppVersion('/version.json', async () => {
      throw new Error('offline');
    }),
    null
  );
});
function keys(value: object, prefix = ''): string[] {
  return Object.entries(value)
    .flatMap(([key, child]) => (typeof child === 'object' ? keys(child, `${prefix}${key}.`) : [`${prefix}${key}`]))
    .sort();
}
test('supported locales have identical keys and unsupported saved locale falls back', () => {
  assert.deepEqual(keys(en), keys(zh));
  assert.equal(normalizeLocale('en-US'), 'en-US');
  assert.equal(normalizeLocale('en'), 'zh-CN');
});
test('iframe URL rejects executable schemes and URL credentials', () => {
  assert.equal(getEmbeddedURL('https://example.com/docs'), 'https://example.com/docs');
  for (const value of [
    // eslint-disable-next-line no-script-url -- Deliberately invalid input for URL validation.
    'javascript:alert(1)',
    'data:text/html,hello',
    'https://user:secret@example.com',
    '/relative',
    'invalid'
  ])
    assert.equal(getEmbeddedURL(value), null);
});

test('setup-store reset clones defaults on every call and preserves auth-owned reset', async () => {
  const { createApp, ref } = await import('vue');
  const { createPinia, defineStore } = await import('pinia');
  const { resetSetupStore } = await import('../src/store/plugins/index');
  const pinia = createPinia().use(resetSetupStore);
  const app = createApp({});
  app.use(pinia);
  const useTab = defineStore('tab-store', () => ({ tabs: ref<string[]>([]) }));
  const tab = useTab(pinia);
  tab.tabs.push('before');
  tab.$reset();
  tab.tabs.push('after');
  tab.$reset();
  assert.deepEqual(tab.tabs, []);
  let resets = 0;
  const useAuth = defineStore('auth-store', () => ({
    token: ref('startup'),
    $reset: () => {
      resets += 1;
    }
  }));
  useAuth(pinia).$reset();
  assert.equal(resets, 1);
});

test('relative production API stays same-origin and local backend proxy is explicit', async () => {
  const { getServiceBaseURL } = await import('../src/utils/service');
  const { createViteProxy } = await import('../build/config/proxy');
  const env = {
    VITE_SERVICE_BASE_URL: '/api',
    VITE_OTHER_SERVICE_BASE_URL: '{demo:"/api"}',
    VITE_HTTP_PROXY: 'Y'
  } as Env.ImportMeta;
  assert.equal(getServiceBaseURL(env, true).baseURL, '/api');
  assert.deepEqual(createViteProxy(env, true), {});
  const proxy = createViteProxy({ ...env, VITE_DEV_BACKEND: 'http://127.0.0.1:8080' }, true)!;
  assert.equal(proxy['/api'].target, 'http://127.0.0.1:8080');
  assert.equal(proxy['/api'].rewrite?.('/api/auth/login'), '/auth/login');
});

test('successful storage removal allows subsequent external writes; quota fallback overrides stale values', context => {
  const stg = new MemoryStorage();
  Object.defineProperty(globalThis, 'window', { configurable: true, get: () => ({ localStorage: stg }) });
  context.after(() => Reflect.deleteProperty(globalThis, 'window'));
  const storage = createStorage<{ token: string }>('local', 'app:');
  storage.set('token', 'old');
  storage.remove('token');
  stg.setItem('app:token', JSON.stringify('external'));
  assert.equal(storage.get('token'), 'external');
  context.mock.method(stg, 'setItem', () => {
    throw new Error('quota');
  });
  storage.set('token', 'new');
  assert.equal(storage.get('token'), 'new');
});

test('upstream table visibility and fixed-column state survive column reload', () => {
  const scope = effectScope();
  const table = scope.run(() =>
    useTable({
      api: async () => [{ id: 1 }],
      pagination: false,
      transform: records => records,
      immediate: false,
      columns: () => [{ key: 'id' }],
      getColumnChecks: () => [{ key: 'id', title: 'ID', checked: true, visible: true, fixed: 'unFixed' as const }],
      getColumns: columns => columns
    })
  )!;
  table.columnChecks.value[0].checked = false;
  table.columnChecks.value[0].fixed = 'right';
  table.reloadColumns();
  assert.equal(table.columnChecks.value[0].checked, false);
  assert.equal(table.columnChecks.value[0].fixed, 'right');
  assert.equal(table.columnChecks.value[0].visible, true);
  scope.stop();
});
