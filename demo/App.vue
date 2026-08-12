<script setup lang="ts">
import { ref } from 'vue'
import type { ScrollListener } from 'smooth-scrollbar/interfaces'
import { Scrollbar } from 'smooth-vuebar'

const enabled = ref(true)
const offset = ref(0)
const limit = ref(0)

const onScroll: ScrollListener = (status) => {
  offset.value = Math.round(status.offset.y)
  limit.value = Math.round(status.limit.y)
}

const paragraphs = Array.from({ length: 14 }, (_, i) => i + 1)

// $scrollbar / the re-exported Scrollbar give access to the core API.
const scrollToTop = () => {
  const el = document.querySelector<HTMLElement>('.scroller')
  if (el) Scrollbar.get(el)?.scrollTo(0, 0, 400)
}
</script>

<template>
  <main>
    <h1>smooth-vuebar</h1>
    <p class="lede">
      <code>v-smoothscrollbar</code> turns any overflowing element into a
      <a href="https://github.com/idiotWu/smooth-scrollbar">smooth-scrollbar</a>
      instance. Bind <code>false</code> to disable it (handy on touch devices):
      the directive tears the instance down and gives you the native scrollbar
      back.
    </p>

    <div class="controls">
      <button type="button" @click="enabled = !enabled">
        {{ enabled ? 'Disable directive' : 'Enable directive' }}
      </button>
      <button type="button" :disabled="!enabled" @click="scrollToTop">
        Scrollbar.get(el).scrollTo(0, 0)
      </button>
      <span class="label">{{ offset }} / {{ limit }} px</span>
    </div>

    <div
      v-smoothscrollbar="enabled && { listener: onScroll }"
      class="scroller"
    >
      <p v-for="n in paragraphs" :key="n">
        <strong>{{ n }}.</strong> Momentum scrolling is handled entirely by the
        underlying library; the directive only wires it to the element's
        lifecycle and cleans up on unmount.
      </p>
    </div>

    <h2>Plugin options</h2>
    <p>
      This page installs the plugin with
      <code>{ options: { damping: 0.08 } }</code>, so every directive inherits
      that damping unless its own binding overrides it.
    </p>
  </main>
</template>

<style scoped>
.controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.scroller {
  height: 20rem;
  padding: 0 1rem;
  border: 1px solid var(--line);
  border-radius: 0.5rem;
  overflow-y: auto;
}

.scroller p {
  margin: 1rem 0;
}

a {
  color: var(--accent);
}
</style>
