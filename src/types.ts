import type { ScrollbarOptions, ScrollListener } from 'smooth-scrollbar/interfaces'
import type { Scrollbar } from 'smooth-scrollbar/scrollbar'

export type SmoothVuebarBindingValue = {
  options?: Partial<ScrollbarOptions>
  listener?: ScrollListener
}

export type SmoothVuebarPluginOptions = SmoothVuebarBindingValue

// Augment Vue's ComponentCustomProperties so `this.$scrollbar` is typed
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $scrollbar: typeof Scrollbar
  }
}
