# smooth-vuebar

> Vue directive wrapper for [smooth-scrollbar](https://github.com/idiotWu/smooth-scrollbar)

## Demo

You can refer to the [wrapped library's demo](https://idiotwu.github.io/smooth-scrollbar/).

## Why

There are many other wrappers for this library but none of them implements the original library as directive.

I think directives are the right way to handle this kind of DOM manipulation, so let it be.

Also, there are so many problems I found while trying SSR that the only available choice for me was doing it by myself.

## Install

`npm i smooth-vuebar`

```js
Vue.use(SmoothVuebar)
```

**SSR (nuxt)**: install as [client plugin](https://nuxtjs.org/guide/plugins/#client-side-only)

**Safari and IE**: this library requires a `CustomEvent` polyfill.

## Usage

Usually this plugin is used app-wide.

### Vue

```html
<template>
  <div>
    <div v-smoothscrollbar="{ listener, options }">
      <router-view />
    </div>
  </div>
</template>
```


### Nuxt & Gridsome

this is a default.vue layout:

```html
<template>
  <div>
    <div
      v-smoothscrollbar="{ listener, options }"
      @insert=".."
      @unbind="..">
      <nuxt />
    </div>
  </div>
</template>
```

However, you can use it where you want, just mind the default css:

```css
.smooth-vuebar {
  max-width: 100vw;
  max-height: 100vh;
}
```

And replace it as you wish.

## Options

The directive can be customized passing an object.

```html
<div v-smoothscrollbar="{ listener, options }">
```

- `listener` (default: `undefined`) => can be a function, it will automatically set as listener.

- `options` (default: `undefined`) => can be an object.

Please refer to the [offical API docs](https://github.com/idiotWu/smooth-scrollbar/blob/develop/docs/api.md).

## Events

The directive implements two extra events, useful when you want to retrieve the Scrollbar istance and use it.

- `@insert` - fired when the DOM element is inserted and the library is loaded on it. The callback may be a `function (e)`.

- `@unbind` - fired when the DOM element is unbound and the library is unloaded. The callback may be a `function (e)`.

### Extra

You can define global default options. They are valid only if you don't set any local option.

Try it:

```js
Vue.use(SmoothVuebar, {
  listener: () => {},
  options: {}
})
```

## Play with the core

If you want to use the actual wrapper library, here is an helper, available in every component:

```js
this.$scrollbar
```

Or project-wide

```js
import Vue from 'vue'

Vue.scrollbar
```

Refer to [offical API docs](https://github.com/idiotWu/smooth-scrollbar/blob/develop/docs/api.md).
