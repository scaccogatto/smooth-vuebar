import Scrollbar from 'smooth-scrollbar'
import './default.css'
import { bestListener, bestOptions } from './utils'

export default {
  install (Vue, options) {
    // helpers
    Vue.prototype.$scrollbar = Scrollbar
    Vue.scrollbar = Scrollbar

    // directive
    Vue.directive('smoothscrollbar', {
      bind (el) {
        el.classList.add('smooth-vuebar')
      },
      inserted (el, binding) {
        const possibilities = [binding.value, options]
        const scrollbar = Scrollbar.init(el, bestOptions(possibilities))

        const listener = bestListener(possibilities)
        if (listener) scrollbar.addListener(listener)

        el.dispatchEvent(new CustomEvent('insert', { detail: el }))
      },
      componentUpdated (el, binding) {
        const scrollbar = Scrollbar.get(el)
        if (!scrollbar) return

        // remove old listener, if defined
        const oldListener = bestListener([binding.oldValue, options])
        if (oldListener) scrollbar.removeListener(oldListener)

        // add the new listener, if defined
        const listener = bestListener([binding.value, options])
        if (listener) scrollbar.addListener(listener)

        // refresh
        scrollbar.update()
      },
      unbind (el) {
        const scrollbar = Scrollbar.get(el)
        if (scrollbar) scrollbar.destroy()

        el.dispatchEvent(new CustomEvent('unbind', { detail: el }))
      }
    })
  }
}
