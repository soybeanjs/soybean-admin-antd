# Dependency-upgrade browser regression tests

The suite tests the real frontend with deterministic synthetic API fixtures.
It does **not** prove the public ApiFox service is available, or verify backend
persistence. All login tokens, users, and email addresses in these fixtures are
synthetic. Unexpected backend requests fail the suite. Iconify requests use the
installed icon dataset rather than the public icon service.

## Automated Chromium suite

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm test:e2e
```

Playwright starts Vite on `127.0.0.1:9527` and intercepts the fixture API calls.
To test an already-running development server or a production preview instead:

```sh
E2E_BASE_URL=http://127.0.0.1:9725 E2E_PRODUCTION=1 pnpm test:e2e
```

The existing server must use static auth routes and one of the fixture-supported
API base URLs (`http://127.0.0.1:9530` or the checked-in ApiFox test URL).
Set `E2E_PRODUCTION=1` only for production builds: the application intentionally
persists theme settings only in production (locale persists in either mode).
Screenshots, runtime error evidence, and failure traces are saved in
`test-results/`; the HTML report is saved in `playwright-report/`.

An existing Chromium installation can be selected explicitly with
`E2E_CHROMIUM_EXECUTABLE_PATH=/path/to/chromium`. The default uses the
Playwright-managed browser installed above.

Coverage: required/invalid login inputs, rejected-login recovery, protected-route
redirects, interrupted password-reset flow, history Back/Forward, dashboard
ECharts canvases and local SVG artwork, refresh with stored auth, theme/locale
changes and persistence, management list filtering/reset/refresh, repeated
add/edit drawer cancellation, logout cancellation/confirmation, dynamic local
SVGs on all exception screens, and expired-token refresh/retry
with the refreshed Authorization header.

The existing invalid-login handler exposes Ant Design form-validation rejections
as browser page errors (`Object`). Required-field and password-format checks
verify the visible messages and that no login API call occurs, and retain those
validation rejections in the evidence. This suite does not claim a globally
error-free browser console.

The isolated `svg-instance.spec.ts` regression also compares standalone and
hidden-first repeated SVG instances, checking pixels and per-instance definition
IDs for `no-icon` and `expectation`. Its test-only HTML fixture requires the Vite
dev server, so that one test is explicitly skipped for production-preview runs.
The application SVG exception-screen checks still run against production.

## Optional manual smoke check with the same fixtures

Run these in separate terminals, then open `http://127.0.0.1:9527`:

```sh
pnpm exec tsx tests/e2e/mock-api.ts
VITE_SERVICE_BASE_URL=http://127.0.0.1:9530 VITE_AUTOMATICALLY_DETECT_UPDATE=N BROWSER=none pnpm dev
```

Use the template's demo username `Soybean` and password `123456`. The synthetic
password `badpass` exercises rejection. The server listens only on loopback and
is not part of the production build. Test data edits in the management UI do not
persist because the template does not implement mutation API calls.
