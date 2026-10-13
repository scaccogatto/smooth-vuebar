import { describe, expectTypeOf, it } from 'vitest'
import { createApp, type ComponentCustomProperties } from 'vue'
import SmoothScrollbar from 'smooth-scrollbar'
import type { Scrollbar as ScrollbarInstance } from 'smooth-scrollbar/scrollbar'
import SmoothVuebar, { Scrollbar, type SmoothVuebarPluginOptions } from '../src/index'

describe('public types', () => {
  it('types $scrollbar as the smooth-scrollbar class with its statics', () => {
    expectTypeOf<ComponentCustomProperties['$scrollbar']>().toEqualTypeOf<typeof SmoothScrollbar>()
    expectTypeOf<ComponentCustomProperties['$scrollbar']['get']>()
      .returns.toEqualTypeOf<ScrollbarInstance | undefined>()
    expectTypeOf<ComponentCustomProperties['$scrollbar']['init']>()
      .returns.toEqualTypeOf<ScrollbarInstance>()
  })

  it('re-exports the same Scrollbar class', () => {
    expectTypeOf(Scrollbar).toEqualTypeOf<typeof SmoothScrollbar>()
  })

  it('types the plugin options', () => {
    expectTypeOf(SmoothVuebar.install).parameter(1).toEqualTypeOf<SmoothVuebarPluginOptions | undefined>()
    createApp({}).use(SmoothVuebar, { options: { damping: 0.1 } })
    // @ts-expect-error unknown smooth-scrollbar option
    createApp({}).use(SmoothVuebar, { options: { dampin: 0.1 } })
  })
})
