# Changelog

## [Unreleased]

### Breaking Changes

- `engines.node` is now `>=24` (Node 20 is end-of-life and CI only tests Node 24). It only affects tooling that enforces `engines`, the browser runtime is unchanged.

### Fixed

- `$scrollbar` is now typed as the smooth-scrollbar class, so the documented `this.$scrollbar.get(el)` and `init` typecheck (it was typed as the instance class without statics).
- The `ComponentCustomProperties` augmentation now targets `'vue'` instead of `'@vue/runtime-core'`, so `$scrollbar` stays typed under pnpm and other strict `node_modules` layouts.
- Emitted declarations use explicit `.js` / `.cjs` relative imports, so `node16` / `nodenext` consumers get typed plugin options instead of `any`.
- CommonJS consumers now resolve CJS-format `.d.cts` declarations, and the `types` condition comes first in each `exports` branch. `./package.json` is exported too.
- The directive keeps a consumer-provided `tabindex` (and inline `outline`) when smooth-scrollbar initializes, so a `tabindex="0"` container stays keyboard reachable. Tearing the scrollbar down (binding toggled falsy or unmount) restores the element's original `tabindex`, `data-scrollbar` and `outline`.

### Documentation

- Accessibility section: keyboard-reachable container (`tabindex="0"`, `role`, `aria-label`) and disabling the directive for `prefers-reduced-motion`.
- Nuxt example is now a universal plugin (`install()` is SSR-safe, a `.client` plugin made server rendering warn `Failed to resolve directive`).
- Fixed the `default.css` description (it sets `max-height: 100vh` only).
- Package `homepage` now points to the live demo.

## [2.0.2] - 2026-07-17

### Fixed

- Directive bound to a value that starts falsy and later toggles truthy (e.g. `v-smoothscrollbar="isEnabled"`) now correctly initializes the scrollbar in `updated()` instead of never mounting it. Conversely, toggling from truthy to falsy now destroys the existing scrollbar instance.

## [2.0.1] - 2026-06-28

Metadata-only release: npm keywords refreshed, code identical to 2.0.0. It was published from an untagged commit, so there is no `v2.0.1` git tag.

## [2.0.0] - 2026-06-28

### Breaking Changes

- **Vue 3 only.** Drops Vue 2 support. The `install` function now receives a Vue 3 `App` instance instead of the Vue constructor.
- Directive hooks rewritten: `bind → beforeMount`, `inserted → mounted`, `componentUpdated → updated`, `unbind → beforeUnmount`.
- `Vue.prototype.$scrollbar` → `app.config.globalProperties.$scrollbar`. Use `import { Scrollbar } from 'smooth-vuebar'` as the portable alternative.
- `Vue.scrollbar` removed (no Vue 3 equivalent); use the named `Scrollbar` export instead.
- CSS is no longer imported automatically. Import `smooth-vuebar/default.css` explicitly.
- Package exports are now ES modules (`"type": "module"`). A CJS build (`smooth-vuebar.cjs`) is still provided for legacy consumers.

### Added

- Full TypeScript source and `.d.ts` declarations via `vite-plugin-dts`.
- Vite library mode build: ESM (`smooth-vuebar.js`) + CJS (`smooth-vuebar.cjs`).
- Proper `exports` map in `package.json` with subpath export for `./default.css`.
- `ComponentCustomProperties` augmentation so `this.$scrollbar` is typed in Vue components.
- Named `Scrollbar` re-export: `import { Scrollbar } from 'smooth-vuebar'`.
- Vitest test suite (11 tests) covering init, options, listener management, update cycle, destroy, and custom events.
- GitHub Actions CI on Node 20 and 22.

### Fixed

- **Issue #6**: Vue 3 compatibility — the directive and plugin are fully rewritten for the Vue 3 API. See [#6](https://github.com/scaccogatto/smooth-vuebar/issues/6).
- **Issue #7**: Passing `false` as the directive binding value (`v-smoothscrollbar="false"`) now skips `Scrollbar.init`, enabling conditional mobile disabling without removing the directive from the template. README documents the `navigator.maxTouchPoints` pattern. See [#7](https://github.com/scaccogatto/smooth-vuebar/issues/7).
- **PR #10 / lodash-es CVE**: Upgraded `smooth-scrollbar` from `^8.4.0` to `^8.8.4`, which drops `lodash-es` as a transitive dependency entirely, eliminating the high-severity prototype-pollution vulnerability. PR #10 (lodash-es lock-file patch) is superseded by this change.

### Changed

- `smooth-scrollbar` upgraded from `^8.4.0` to `^8.8.4`.
- Replaced Travis CI (`.travis.yml`) with GitHub Actions.

---

## [1.4.0] - 2019-06-01

Last Vue 2 release. No longer maintained.
