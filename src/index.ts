import type { App, ObjectDirective, DirectiveBinding } from 'vue'
import Scrollbar from 'smooth-scrollbar'
import type { SmoothVuebarBindingValue, SmoothVuebarPluginOptions } from './types.js'
import { bestListener, bestOptions } from './utils.js'

// Re-export Scrollbar so consumers can import it directly from the package
// instead of depending on smooth-scrollbar separately ("play with the core").
export { default as Scrollbar } from 'smooth-scrollbar'

export type { SmoothVuebarBindingValue, SmoothVuebarPluginOptions }

// Binding can be false to explicitly disable the directive (useful for mobile).
type DirectiveValue = SmoothVuebarBindingValue | false | null | undefined

// `false` / `null` disables the directive — useful for mobile. `undefined`
// (bare `v-smoothscrollbar`, no expression) counts as enabled.
const isDisabled = (value: DirectiveValue): boolean => !value && value !== undefined

// smooth-scrollbar marks the container with `data-scrollbar`, forces
// `tabindex="-1"` (removing it from the tab order) and `outline: none`, and its
// destroy() never reverts those. Snapshot what the element had before init so
// an explicit consumer `tabindex` survives init and teardown restores the
// element exactly.
type ElementSnapshot = {
  tabindex: string | null
  dataScrollbar: string | null
  outline: string
}

const snapshots = new WeakMap<HTMLElement, ElementSnapshot>()

const takeSnapshot = (el: HTMLElement): ElementSnapshot => ({
  tabindex: el.getAttribute('tabindex'),
  dataScrollbar: el.getAttribute('data-scrollbar'),
  outline: el.style.outline,
})

const restoreAttribute = (el: HTMLElement, name: string, value: string | null) => {
  if (value === null) el.removeAttribute(name)
  else el.setAttribute(name, value)
}

// Keep a consumer-provided tabindex (e.g. tabindex="0" for keyboard access)
// and its focus outline, which smooth-scrollbar would otherwise override.
const keepConsumerFocusability = (el: HTMLElement, snapshot: ElementSnapshot) => {
  if (snapshot.tabindex === null) return
  el.setAttribute('tabindex', snapshot.tabindex)
  el.style.outline = snapshot.outline
}

const restoreSnapshot = (el: HTMLElement) => {
  const snapshot = snapshots.get(el)
  if (!snapshot) return
  snapshots.delete(el)
  restoreAttribute(el, 'tabindex', snapshot.tabindex)
  restoreAttribute(el, 'data-scrollbar', snapshot.dataScrollbar)
  el.style.outline = snapshot.outline
}

const destroyScrollbar = (el: HTMLElement, scrollbar: { destroy: () => void }) => {
  scrollbar.destroy()
  restoreSnapshot(el)
}

const initScrollbar = (
  el: HTMLElement,
  binding: DirectiveBinding<DirectiveValue>,
  globalOptions: SmoothVuebarPluginOptions | undefined,
) => {
  const value = binding.value || undefined
  const possibilities = [value, globalOptions]
  const snapshot = takeSnapshot(el)
  snapshots.set(el, snapshot)
  const scrollbar = Scrollbar.init(el, bestOptions(possibilities))
  keepConsumerFocusability(el, snapshot)

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
      destroyScrollbar(el, scrollbar)
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
    if (scrollbar) destroyScrollbar(el, scrollbar)

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
