# Dependency security upgrade (2026-10-09)

## Scope and update process

Only `soybean-admin-antd` is changed. The main `soybean-admin` repository was
read as a migration reference.

The existing `update-pkg` command (`sa update-pkg`, running
`npm-check-updates --deep -u`) checked all nine workspace manifests. Direct
packages were upgraded first, then transitive dependencies were refreshed with
`pnpm update -r --depth Infinity` and the necessary compatibility fixes applied.

Use Node.js 22.x >=22.22.2, 24.x >=24.15.0, or >=26, and the pinned pnpm 10.34.6.
The raised Node floor comes from the upgraded `npm-check-updates`, `lint-staged`,
and `bumpp` tools. Validation used Node.js 24.19.0.

## Compatibility changes

- Vite 8, Vue Router 5, Pinia 4, VueUse 15, Axios 1.20, and the current compatible
  Vue/ECharts/UnoCSS packages are installed with a regenerated lockfile
- The automatic update selected TypeScript 7.0.2, but both `vue-tsc` and
  `typescript-eslint` require the TypeScript 6 JavaScript compiler API. Use
  `typescript: npm:@typescript/typescript6@6.0.2`, the Microsoft-published
  compatibility package also used by [Vue language-tools](https://github.com/vuejs/language-tools/commit/1ef7ecbd0ab9b475e8e3aed791a1606be8bfa8d1).
  This is an intentional toolchain compatibility exception, not a skipped update
- Port the main repository's [TypeScript configuration migration](https://github.com/soybeanjs/soybean-admin/commit/c0105c55ab2a59fa80c7514011a987a5e797ba9d),
  [Axios named factory import](https://github.com/soybeanjs/soybean-admin/commit/9afa21e42e57df92d8d29abbbf7c1015188c6f55),
  and [ESLint/Oxlint split](https://github.com/soybeanjs/soybean-admin/commit/6ff74c0c9ddcf5101892c64b46be085c3816dd08)
- Replace unmaintained `vite-plugin-svg-icons` and its obsolete SVGO/PostCSS tree
  with `vite-svg-loader`. Local icons retain sizing, color, source fill/stroke,
  nested names, fallback behavior, and per-instance definition references. Vue
  `useId` keeps repeated/hidden instances independent and SSR IDs stable
- Keep narrow pnpm overrides for upstream's exact `micromatch` 4.0.7 pin and
  stale optional Rollup peers. They resolve to fixed compatible releases

## Security audit

Audited against the npm registry on 2026-10-09 with pnpm 10.34.6.
Counts below deduplicate by GitHub advisory URL; one advisory can affect
multiple package versions and dependency paths.

| Scope | Before | After |
| --- | ---: | ---: |
| All dependencies, distinct advisories | 103 | 1 |
| Production dependencies, distinct advisories | 56 | 0 |
| All dependencies, advisory-version records | 123 | 1 |
| Production dependencies, advisory-version records | 61 | 0 |

All fixable audited advisories have been removed from the lockfile. One remains:
[GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), a
stack-exhaustion issue in `braces` <=3.0.3, with **no published patched version**
as of this audit. It is reached through development-time file/glob tooling,
including Elegant Router/Chokidar, and is absent from `pnpm audit --prod`.
Do not feed untrusted glob patterns into development/build tools. This PR does
not suppress the advisory or claim that the complete dependency graph is clean.
An audit finding alone does not establish an exploitable path in the deployed
browser application.

Reproduce the checks:

```sh
pnpm install --frozen-lockfile
pnpm audit --prod --registry=https://registry.npmjs.org
pnpm audit --registry=https://registry.npmjs.org
pnpm typecheck
pnpm lint:check
pnpm test:unit
pnpm build
pnpm build:test
pnpm exec playwright install chromium
pnpm test:e2e
```

The full audit is expected to exit nonzero while the unpatched `braces`
advisory remains. The production audit passes. Browser tests use synthetic API
fixtures and the real frontend; see [the test guide](../tests/README.md) for
coverage and production-preview testing. They do not verify public ApiFox
availability or backend persistence.

## Validation limits

In development, the existing invalid-login path rejects the Ant Design form-validation promise
without catching it. Negative-input browser tests observe two unhandled
`Object` rejections, while the expected inline validation appears and no login
request is sent. That handler is unchanged from the baseline; other exercised
authentication, refresh-token, and navigation flows have no page errors. The
built-preview browser run recorded no page errors.

The live public ApiFox integration was not validated. A read-only route request
returned HTTP 500 in the validation environment; all repeatable browser tests
use the synthetic fixtures described above.
