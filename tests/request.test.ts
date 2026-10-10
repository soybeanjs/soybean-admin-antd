import assert from 'node:assert/strict';
import { test } from 'node:test';
import { AxiosHeaders, CanceledError } from 'axios';
import type { AxiosAdapter, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { createAuthFailureHandler, createRequestState } from '../src/service/request/lifecycle';
import { createFlatRequest } from '../packages/axios/src/index';

function response(config: InternalAxiosRequestConfig, data: unknown): AxiosResponse {
  return { config, data, status: 200, statusText: 'OK', headers: new AxiosHeaders() };
}

for (const value of [false, 0, '']) {
  test(`flat requests await async transformation and preserve ${JSON.stringify(value)}`, async () => {
    const request = createFlatRequest(
      { adapter: async config => response(config, value) },
      {
        transformBackendResponse: async res => {
          await Promise.resolve();
          return res.data;
        }
      }
    );
    const result = await request({ url: '/value' });
    assert.equal(result.error, null);
    assert.equal(result.data, value);
    assert.equal(result.response?.status, 200);
  });
}

test('non-JSON responses retain response metadata', async () => {
  const request = createFlatRequest({ adapter: async config => response(config, 'file') });
  const result = await request({ url: '/file', responseType: 'text' });
  assert.equal(result.data, 'file');
  assert.equal(result.response?.status, 200);
});

test('completed requests release controllers; active requests remain cancellable', async () => {
  const signals: AbortSignal[] = [];
  let release!: () => void;
  const gate = new Promise<void>(resolve => {
    release = resolve;
  });
  const request = createFlatRequest({
    adapter: async config => {
      signals.push(config.signal as AbortSignal);
      if (config.url === '/pending') await gate;
      return response(config, true);
    }
  });
  await request({ url: '/done' });
  const pending = request({ url: '/pending' });
  await new Promise(resolve => {
    setImmediate(resolve);
  });
  request.cancelAllRequest();
  assert.equal(signals[0].aborted, false);
  assert.equal(signals[1].aborted, true);
  release();
  assert.ok((await pending).error);
});

test('request hook rejection releases controllers and cancellation does not show an error', async () => {
  let signal: AbortSignal | undefined;
  let errors = 0;
  const broken = createFlatRequest(
    {},
    {
      onRequest: config => {
        signal = config.signal as AbortSignal;
        throw new Error('hook');
      }
    }
  );
  assert.ok((await broken({ url: '/hook' })).error);
  broken.cancelAllRequest();
  assert.equal(signal?.aborted, false);
  const cancelled = createFlatRequest(
    {
      adapter: async () => {
        throw new CanceledError();
      }
    },
    {
      onError: () => {
        errors += 1;
      }
    }
  );
  assert.ok((await cancelled({ url: '/cancel' })).error);
  assert.equal(errors, 0);
});

function authHarness(adapter: AxiosAdapter, refresh: () => Promise<boolean>) {
  let logouts = 0;
  let current = true;
  const closes: (() => void)[] = [];
  const state = createRequestState();
  const handler = createAuthFailureHandler({
    state,
    logoutCodes: ['logout'],
    modalLogoutCodes: ['modal'],
    expiredTokenCodes: ['expired'],
    refresh,
    logout: () => {
      logouts += 1;
    },
    getAuthorization: () => 'Bearer renewed',
    isCurrentSession: () => current,
    showLogoutModal: (_message, close) => {
      closes.push(close);
    }
  });
  const request = createFlatRequest(
    { adapter },
    {
      isBackendSuccess: res => res.data.code === 'ok',
      onBackendFail: handler,
      transformBackendResponse: res => ('data' in res.data ? res.data.data : null)
    }
  );
  return {
    request,
    handler,
    state,
    closes,
    logouts: () => logouts,
    stale: () => {
      current = false;
    }
  };
}

test('concurrent expired requests share one refresh and replay with the new token', async () => {
  let refreshes = 0;
  let release!: (value: boolean) => void;
  const gate = new Promise<boolean>(resolve => {
    release = resolve;
  });
  const harness = authHarness(
    async config =>
      response(config, {
        code: config.authRetryCount ? 'ok' : 'expired',
        data: config.headers.get('Authorization')
      }),
    () => {
      refreshes += 1;
      return gate;
    }
  );
  const jobs = [harness.request({ url: '/a' }), harness.request({ url: '/b' })];
  await new Promise(resolve => {
    setImmediate(resolve);
  });
  assert.equal(refreshes, 1);
  release(true);
  const results = await Promise.all(jobs);
  assert.deepEqual(
    results.map(result => result.data),
    ['Bearer renewed', 'Bearer renewed']
  );
  assert.equal(harness.state.refreshTokenFn, null);
  assert.equal(harness.logouts(), 0);
});

test('refresh endpoint cannot recursively refresh; expired replay is bounded', async () => {
  let refreshes = 0;
  let requests = 0;
  const harness = authHarness(
    async config => {
      requests += 1;
      return response(config, { code: 'expired' });
    },
    async () => {
      refreshes += 1;
      return true;
    }
  );
  assert.ok((await harness.request({ url: '/refresh', skipAuthRefresh: true })).error);
  assert.equal(refreshes, 0);
  assert.ok((await harness.request({ url: '/resource' })).error);
  assert.equal(refreshes, 1);
  assert.equal(requests, 3);
});

test('failed refresh terminates the request and stale refresh never replays', async () => {
  const adapter: AxiosAdapter = async config => response(config, { code: 'expired' });
  const failed = authHarness(adapter, async () => {
    throw new Error('offline');
  });
  assert.ok((await failed.request({ url: '/resource' })).error);
  assert.equal(failed.logouts(), 1);
  let release!: (value: boolean) => void;
  const stale = authHarness(
    adapter,
    () =>
      new Promise(resolve => {
        release = resolve;
      })
  );
  const pending = stale.request({ url: '/resource' });
  await new Promise(resolve => {
    setImmediate(resolve);
  });
  stale.stale();
  release(true);
  assert.ok((await pending).error);
  assert.equal(stale.logouts(), 0);
});

test('first modal logout is initialized, deduplicates by code, and closes once', async () => {
  const harness = authHarness(
    async config => response(config, { code: 'modal', msg: 'session ended' }),
    async () => true
  );
  await Promise.all([harness.request({ url: '/a' }), harness.request({ url: '/b' })]);
  assert.equal(harness.closes.length, 1);
  harness.closes[0]();
  harness.closes[0]();
  assert.equal(harness.logouts(), 1);
  assert.deepEqual(harness.state.modalLogoutCodes, []);
  const res = response({ headers: new AxiosHeaders() } as InternalAxiosRequestConfig, { code: 'logout' });
  harness.stale();
  await harness.handler(res, {} as AxiosInstance);
  assert.equal(harness.logouts(), 1);
});

test('a modal from an older session cannot log out a newly established session', async () => {
  const harness = authHarness(
    async config => response(config, { code: 'modal', msg: 'expired session' }),
    async () => true
  );
  await harness.request({ url: '/modal' });
  harness.stale();
  harness.closes[0]();
  assert.equal(harness.logouts(), 0);
});

test('hook request delivers falsy data and always ends loading', async () => {
  const { default: createHookRequest } = await import('../packages/hooks/src/use-request');
  const request = createHookRequest({ adapter: async config => response(config, false) });
  const result = request({ url: '/false' });
  await new Promise(resolve => {
    setImmediate(resolve);
  });
  assert.equal(result.data.value, false);
  assert.equal(result.error.value, null);
  assert.equal(result.loading.value, false);
});

test('upstream transform option and initial request state survive the merge', async () => {
  const request = createFlatRequest(
    { adapter: async config => response(config, { value: 7 }) },
    {
      defaultState: { errors: [] as string[] },
      transform: async res => res.data.value
    }
  );
  const result = await request({ url: '/transformed' });
  assert.equal(result.error, null);
  assert.equal(result.data, 7);
  assert.deepEqual(request.state, { errors: [] });
});

test('upstream JSON blob conversion preserves response data and metadata', async () => {
  const request = createFlatRequest({
    adapter: async config => ({
      ...response(config, new Blob([JSON.stringify({ code: 'expired' })], { type: 'application/json' })),
      headers: new AxiosHeaders({ 'content-type': 'application/json' })
    })
  });
  const result = await request({ url: '/download', responseType: 'blob' });
  assert.equal(result.error, null);
  assert.deepEqual(result.data, { code: 'expired' });
  assert.equal(result.response?.status, 200);
});
