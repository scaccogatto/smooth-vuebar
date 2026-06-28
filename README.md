# smooth-vuebar

[![npm version](https://img.shields.io/npm/v/smooth-vuebar)](https://www.npmjs.com/package/smooth-vuebar)
[![CI](https://github.com/scaccogatto/smooth-vuebar/actions/workflows/ci.yml/badge.svg)](https://github.com/scaccogatto/smooth-vuebar/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

> Vue 3 directive wrapper for [smooth-scrollbar](https://github.com/idiotWu/smooth-scrollbar)

Implements smooth-scrollbar as a Vue 3 directive — the right way to handle this kind of DOM manipulation. Ships full TypeScript types, ESM + CJS builds, and SSR-safe defaults.

## Demo

Refer to the [upstream library demo](https://idiotwu.github.io/smooth-scrollbar/).

## Install

```sh
npm i smooth-vuebar
```

Import the default CSS (sets `max-width/height: 100vw/vh` on the scrollable container):

```js
import 'smooth-vuebar/default.css'
```

## Usage

### Vue 3 (Composition API / `<script setup>`)

```vue
<script setup>
import { ref } from 'vue'

const onScroll = (status) => {
  console.log('scroll offset:', status.offset)
}
</script>

<template>
  <div v-smoothscrollbar="{ listener: onScroll, options: { damping: 0.1 } }">
    <router-view />
  </div>
</template>
```

### Global plugin (main.ts)

```ts
import { createApp } from 'vue'
import SmoothVuebar from 'smooth-vuebar'
import 'smooth-vuebar/default.css'
import App from './App.vue'

createApp(App)
  .use(SmoothVuebar, {
    // optional global defaults (overridden by per-element binding)
    options: { damping: 0.1 },
  })
  .mount('#app')
```

### Nuxt 3 (client-only plugin)

```ts
// plugins/smooth-vuebar.client.ts
import SmoothVuebar from 'smooth-vuebar'
import 'smooth-vuebar/default.css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(SmoothVuebar)
})
```

## Directive binding

```html
<div v-smoothscrollbar="{ listener, options }">
```

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `options` | `Partial<ScrollbarOptions>` | `undefined` | Options forwarded to `Scrollbar.init`. See [smooth-scrollbar docs](https://github.com/idiotWu/smooth-scrollbar/blob/develop/docs/api.md). |
| `listener` | `ScrollListener` | `undefined` | Scroll event listener. Automatically added/removed when the binding changes. |

Global defaults (passed to `app.use(SmoothVuebar, { ... })`) are used only when the per-element binding does not set the corresponding field.

## Events

The directive dispatches native DOM events on the container element:

| Event | When | `event.detail` |
|-------|------|---------------|
| `@insert` | Element mounted and scrollbar initialized | The container `HTMLElement` |
| `@unbind` | Element about to be unmounted | The container `HTMLElement` |

```html
<div v-smoothscrollbar @insert="onInit" @unbind="onDestroy">
```

## Accessing the Scrollbar instance

### Via component property

```ts
// Options API
this.$scrollbar.get(el)

// Composition API — inject the app
import { getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance()!
proxy!.$scrollbar.get(el)
```

### Via named import

```ts
import { Scrollbar } from 'smooth-vuebar'

const instance = Scrollbar.get(el)
```

## Mobile / touch devices

Pass `false` as the binding value to disable initialization on that element while
keeping the directive registered (so Vue does not throw on `v-smoothscrollbar`).
Native momentum scrolling takes over on touch devices.

```vue
<script setup>
const isMobile = () => navigator.maxTouchPoints > 1
</script>

<template>
  <!-- false disables init; truthy value (or no value) enables it -->
  <div v-smoothscrollbar="isMobile() ? false : { options: { damping: 0.1 } }">
    <slot />
  </div>
</template>
```

This resolves [issue #7](https://github.com/scaccogatto/smooth-vuebar/issues/7).

## Migrating from v1 (Vue 2)

v2.0.0 is a **breaking change** — it targets Vue 3 only.

| v1 (Vue 2) | v2 (Vue 3) |
|------------|------------|
| `Vue.use(SmoothVuebar)` | `app.use(SmoothVuebar)` |
| `Vue.prototype.$scrollbar` | `app.config.globalProperties.$scrollbar` or `import { Scrollbar } from 'smooth-vuebar'` |
| `Vue.scrollbar` | `import { Scrollbar } from 'smooth-vuebar'` |
| `smooth-scrollbar ^8.4.0` (lodash-es vuln) | `smooth-scrollbar ^8.8.4` (no lodash-es) |

The directive name (`v-smoothscrollbar`) and binding shape (`{ options, listener }`) are unchanged.

## Releases

- **v2.x** — Vue 3, TypeScript, Vite library mode (this branch)
- **v1.x** — Vue 2 (no longer maintained; Vue 2 reached EOL December 2023)
