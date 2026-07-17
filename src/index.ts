import type { App, ObjectDirective, DirectiveBinding } from 'vue'
import Scrollbar from 'smooth-scrollbar'
import type { SmoothVuebarBindingValue, SmoothVuebarPluginOptions } from './types'
import { bestListener, bestOptions } from './utils'

// Re-export Scrollbar so consumers can import it directly from the package
// instead of depending on smooth-scrollbar separately ("play with the core").
export { default as Scrollbar } from 'smooth-scrollbar'

export type { SmoothVuebarBindingValue, SmoothVuebarPluginOptions }

// Binding can be false to explicitly disable the directive (useful for mobile).
type DirectiveValue = SmoothVuebarBindingValue | false | null | undefined

// `false` / `null` disables the directive — useful for mobile. `undefined`
// (bare `v-smoothscrollbar`, no expression) counts as enabled.
const isDisabled = (value: DirectiveValue): boolean => !value && value !== undefined

const initScrollbar = (
  el: HTMLElement,
  binding: DirectiveBinding<DirectiveValue>,
  globalOptions: SmoothVuebarPluginOptions | undefined,
) => {
  const value = binding.value || undefined
  const possibilities = [value, globalOptions]
  const scrollbar = Scrollbar.init(el, bestOptions(possibilities))

  const listener = bestListener(possibilities)
  if (listener) scrollbar.addListener(listener)

  el.dispatchEvent(new CustomEvent('insert', { detail: el }))
}

const createDirective = (
  globalOptions: SmoothVuebarPluginOptions | undefined,
): ObjectDirective<HTMLElement, DirectiveValue> => ({
  beforeMount(el) {
    el.classList.add('smooth-vuebar')
  },

  mounted(el, binding: DirectiveBinding<DirectiveValue>) {
    if (isDisabled(binding.value)) return

    initScrollbar(el, binding, globalOptions)
  },

  updated(el, binding: DirectiveBinding<DirectiveValue>) {
    const scrollbar = Scrollbar.get(el)
    const disabled = isDisabled(binding.value)

    // Binding toggled falsy→truthy with no existing instance: initialize now.
    if (!scrollbar) {
      if (!disabled) initScrollbar(el, binding, globalOptions)
      return
    }

    // Binding toggled truthy→falsy: tear down (destroy() clears its own listeners).
    if (disabled) {
      scrollbar.destroy()
      return
    }

    const oldValue = binding.oldValue || undefined
    const oldListener = bestListener([oldValue ?? undefined, globalOptions])
    if (oldListener) scrollbar.removeListener(oldListener)

    const value = binding.value || undefined
    const listener = bestListener([value, globalOptions])
    if (listener) scrollbar.addListener(listener)

    scrollbar.update()
  },

  beforeUnmount(el) {
    const scrollbar = Scrollbar.get(el)
    if (scrollbar) scrollbar.destroy()

    el.dispatchEvent(new CustomEvent('unbind', { detail: el }))
  },
})

const SmoothVuebar = {
  install(app: App, options?: SmoothVuebarPluginOptions) {
    app.config.globalProperties.$scrollbar = Scrollbar
    app.directive('smoothscrollbar', createDirective(options))
  },
}

export default SmoothVuebar
