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

const createDirective = (
  globalOptions: SmoothVuebarPluginOptions | undefined,
): ObjectDirective<HTMLElement, DirectiveValue> => ({
  beforeMount(el) {
    el.classList.add('smooth-vuebar')
  },

  mounted(el, binding: DirectiveBinding<DirectiveValue>) {
    // `false` / null / undefined disables the directive — useful for mobile.
    if (!binding.value && binding.value !== undefined) return

    const value = binding.value || undefined
    const possibilities = [value, globalOptions]
    const scrollbar = Scrollbar.init(el, bestOptions(possibilities))

    const listener = bestListener(possibilities)
    if (listener) scrollbar.addListener(listener)

    el.dispatchEvent(new CustomEvent('insert', { detail: el }))
  },

  updated(el, binding: DirectiveBinding<DirectiveValue>) {
    const scrollbar = Scrollbar.get(el)
    if (!scrollbar) return

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
