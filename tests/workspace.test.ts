import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  findPaginatedRecord,
  normalizeWorkspaceDraft,
  parseRecordId,
  resolveAuthEntryURL
} from '../src/utils/workspace';
import { createRecordCache } from '../src/service/cache/users';

test('user detail locates a record beyond the first page and stops when absent', async () => {
  const calls: number[] = [];
  const load = async (current: number) => {
    calls.push(current);
    return { records: [{ id: current }], current, size: 1, total: 3 };
  };
  assert.deepEqual(await findPaginatedRecord(load, 2), { id: 2 });
  assert.deepEqual(calls, [1, 2]);
  calls.length = 0;
  assert.equal(await findPaginatedRecord(load, 4), null);
  assert.deepEqual(calls, [1, 2, 3]);
});
test('user detail rejects incomplete, inconsistent, and unbounded pagination', async () => {
  await assert.rejects(
    findPaginatedRecord(async current => ({ records: [], current, size: 10, total: 20 }), 1),
    /INCOMPLETE_PAGE/
  );
  await assert.rejects(
    findPaginatedRecord(async () => ({ records: [], current: 2, size: 10, total: 0 }), 1),
    /INVALID_PAGINATION/
  );
  let calls = 0;
  await assert.rejects(
    findPaginatedRecord(async current => {
      calls += 1;
      return { records: [{ id: 0 }], current, size: 1, total: 1000 };
    }, 1),
    /DETAIL_LOOKUP_LIMIT/
  );
  assert.equal(calls, 50);
});
test('user detail discards a response when the route request was cancelled', async () => {
  const controller = new AbortController();
  await assert.rejects(
    findPaginatedRecord(
      async current => {
        controller.abort();
        return { records: [{ id: 1 }], current, size: 10, total: 1 };
      },
      1,
      controller.signal
    ),
    { name: 'AbortError' }
  );
  let requested = false;
  await assert.rejects(
    findPaginatedRecord(
      async current => {
        requested = true;
        return { records: [], current, size: 10, total: 0 };
      },
      1,
      controller.signal
    ),
    { name: 'AbortError' }
  );
  assert.equal(requested, false);
});
test('user cache bounds its lifetime, clones records, and clears account data', context => {
  context.mock.timers.enable({ apis: ['Date'], now: 1000 });
  const cache = createRecordCache<{ id: number; roles: string[] }>(2, 100);
  const source = { id: 1, roles: ['R_USER'] };
  cache.set(source);
  source.roles.push('R_SUPER');
  const result = cache.get(1)!;
  result.roles.push('changed');
  assert.deepEqual(cache.get(1)?.roles, ['R_USER']);
  cache.set({ id: 2, roles: [] });
  cache.set({ id: 3, roles: [] });
  assert.equal(cache.get(1), null);
  context.mock.timers.setTime(1100);
  assert.equal(cache.get(2), null);
  cache.set(source);
  cache.clear();
  assert.equal(cache.get(1), null);
});
test('workspace restoration handles corrupted drafts and invalid record identifiers', () => {
  for (const value of ['-1', '1.2', 'Infinity', '9007199254740992', 'abc', ''])
    assert.equal(parseRecordId(value), null);
  assert.equal(parseRecordId('0'), 0);
  assert.equal(parseRecordId('42'), 42);
  assert.deepEqual(normalizeWorkspaceDraft(null), { text: '', count: 0 });
  assert.deepEqual(normalizeWorkspaceDraft({ text: 42, count: -1 }), { text: '', count: 0 });
  assert.deepEqual(normalizeWorkspaceDraft({ text: 'x'.repeat(3000), count: 2_000_000 }), {
    text: 'x'.repeat(2000),
    count: 1_000_000
  });
});
test('wechat authorization requires a configured safe backend entry', () => {
  const origin = 'http://127.0.0.1:9527';
  assert.equal(resolveAuthEntryURL(undefined, origin), null);
  assert.equal(resolveAuthEntryURL('/api/wechat/start', origin), `${origin}/api/wechat/start`);
  assert.equal(resolveAuthEntryURL('https://example.com/oauth', origin), 'https://example.com/oauth');
  for (const value of [
    'javascript:alert(1)',
    'data:text/html,test',
    'https://user:pass@example.com',
    'http://other.example.com'
  ])
    assert.equal(resolveAuthEntryURL(value, origin), null);
});
