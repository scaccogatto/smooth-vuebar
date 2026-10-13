import type { ScrollbarOptions, ScrollListener } from 'smooth-scrollbar/interfaces/index.js'
import type SmoothScrollbar from 'smooth-scrollbar'

export type SmoothVuebarBindingValue = {
  options?: Partial<ScrollbarOptions>
  listener?: ScrollListener
}

export type SmoothVuebarPluginOptions = SmoothVuebarBindingValue

// Augment Vue's ComponentCustomProperties so `this.$scrollbar` is typed as the
// smooth-scrollbar class (with its static `init` / `get` / `destroy` helpers).
// Augmenting 'vue' (not '@vue/runtime-core') keeps working under strict
// package managers such as pnpm, where only 'vue' is resolvable.
declare module 'vue' {
  interface ComponentCustomProperties {
    $scrollbar: typeof SmoothScrollbar
  }
}
