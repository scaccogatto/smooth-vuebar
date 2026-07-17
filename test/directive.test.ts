import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import SmoothVuebar from '../src/index'

// Mock smooth-scrollbar so tests run without a real DOM scroll engine
vi.mock('smooth-scrollbar', () => {
  const mockScrollbarInstance = {
    addListener: vi.fn(),
    removeListener: vi.fn(),
    update: vi.fn(),
    destroy: vi.fn(),
  }

  const MockScrollbar = {
    init: vi.fn(() => mockScrollbarInstance),
    get: vi.fn(() => mockScrollbarInstance),
    default: undefined as unknown,
  }
  MockScrollbar.default = MockScrollbar

  return {
    default: MockScrollbar,
  }
})

// Shared reference to the mock after module resolution
import Scrollbar from 'smooth-scrollbar'
const MockInit = Scrollbar.init as Mock
const MockGet = Scrollbar.get as Mock

const getMockInstance = () => MockInit.mock.results[MockInit.mock.results.length - 1]?.value as {
  addListener: Mock
  removeListener: Mock
  update: Mock
  destroy: Mock
}

describe('v-smoothscrollbar directive', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('adds the smooth-vuebar class in beforeMount', async () => {
    const TestComponent = defineComponent({
      template: '<div v-smoothscrollbar></div>',
    })

    const wrapper = mount(TestComponent, {
      global: { plugins: [SmoothVuebar] },
      attachTo: document.body,
    })

    expect(wrapper.element.classList.contains('smooth-vuebar')).toBe(true)
    wrapper.unmount()
  })

  it('calls Scrollbar.init with the element on mount', async () => {
    const TestComponent = defineComponent({
      template: '<div v-smoothscrollbar></div>',
    })

    const wrapper = mount(TestComponent, {
      global: { plugins: [SmoothVuebar] },
      attachTo: document.body,
    })

    expect(MockInit).toHaveBeenCalledOnce()
    expect(MockInit.mock.calls[0][0]).toBe(wrapper.element)
    wrapper.unmount()
  })

  it('passes binding options to Scrollbar.init', async () => {
    const opts = { damping: 0.05, alwaysShowTracks: true }
    const TestComponent = defineComponent({
      template: `<div v-smoothscrollbar="{ options }"></div>`,
      setup: () => ({ options: opts }),
    })

    const wrapper = mount(TestComponent, {
      global: { plugins: [SmoothVuebar] },
      attachTo: document.body,
    })

    expect(MockInit).toHaveBeenCalledWith(wrapper.element, opts)
    wrapper.unmount()
  })

  it('falls back to global plugin options when binding has none', async () => {
    const globalOpts = { damping: 0.2 }
    const TestComponent = defineComponent({
      template: '<div v-smoothscrollbar></div>',
    })

    const wrapper = mount(TestComponent, {
      global: { plugins: [[SmoothVuebar, { options: globalOpts }]] },
      attachTo: document.body,
    })

    expect(MockInit).toHaveBeenCalledWith(wrapper.element, globalOpts)
    wrapper.unmount()
  })

  it('registers a listener if provided in binding value', async () => {
    const listener = vi.fn()
    const TestComponent = defineComponent({
      template: `<div v-smoothscrollbar="{ listener }"></div>`,
      setup: () => ({ listener }),
    })

    const wrapper = mount(TestComponent, {
      global: { plugins: [SmoothVuebar] },
      attachTo: document.body,
    })

    const instance = getMockInstance()
    expect(instance.addListener).toHaveBeenCalledWith(listener)
    wrapper.unmount()
  })

  it('dispatches an insert event when mounted', async () => {
    const onInsert = vi.fn()
    const TestComponent = defineComponent({
      template: '<div v-smoothscrollbar @insert="onInsert"></div>',
      setup: () => ({ onInsert }),
    })

    const wrapper = mount(TestComponent, {
      global: { plugins: [SmoothVuebar] },
      attachTo: document.body,
    })

    expect(onInsert).toHaveBeenCalledOnce()
    wrapper.unmount()
  })

  it('swaps listeners and calls update on binding change', async () => {
    const listener1 = vi.fn()
    const listener2 = vi.fn()

    const TestComponent = defineComponent({
      props: { listener: Function },
      template: `<div v-smoothscrollbar="{ listener }"></div>`,
    })

    const wrapper = mount(TestComponent, {
      props: { listener: listener1 },
      global: { plugins: [SmoothVuebar] },
      attachTo: document.body,
    })

    const instance = getMockInstance()
    expect(instance.addListener).toHaveBeenCalledWith(listener1)

    // Trigger binding update by changing the listener prop
    await wrapper.setProps({ listener: listener2 })
    await nextTick()

    expect(instance.removeListener).toHaveBeenCalledWith(listener1)
    expect(instance.addListener).toHaveBeenCalledWith(listener2)
    expect(instance.update).toHaveBeenCalledOnce()

    wrapper.unmount()
  })

  it('calls Scrollbar.destroy on beforeUnmount', async () => {
    const TestComponent = defineComponent({
      template: '<div v-smoothscrollbar></div>',
    })

    const wrapper = mount(TestComponent, {
      global: { plugins: [SmoothVuebar] },
      attachTo: document.body,
    })

    const instance = getMockInstance()
    wrapper.unmount()

    expect(instance.destroy).toHaveBeenCalledOnce()
  })

  it('dispatches an unbind event on beforeUnmount', async () => {
    const onUnbind = vi.fn()
    const TestComponent = defineComponent({
      template: '<div v-smoothscrollbar @unbind="onUnbind"></div>',
      setup: () => ({ onUnbind }),
    })

    const wrapper = mount(TestComponent, {
      global: { plugins: [SmoothVuebar] },
      attachTo: document.body,
    })

    wrapper.unmount()
    expect(onUnbind).toHaveBeenCalledOnce()
  })

  it('registers $scrollbar on app globalProperties', async () => {
    const TestComponent = defineComponent({
      template: '<div></div>',
    })

    const wrapper = mount(TestComponent, {
      global: { plugins: [SmoothVuebar] },
    })

    // Access via the component instance's proxy
    expect((wrapper.vm as unknown as { $scrollbar: unknown }).$scrollbar).toBe(Scrollbar)
    wrapper.unmount()
  })

  it('is a no-op in updated when no scrollbar instance exists', async () => {
    MockGet.mockReturnValueOnce(undefined)

    const TestComponent = defineComponent({
      props: { value: Object },
      template: `<div v-smoothscrollbar="value"></div>`,
    })

    const wrapper = mount(TestComponent, {
      props: { value: {} },
      global: { plugins: [SmoothVuebar] },
      attachTo: document.body,
    })

    // Force a re-render with a new binding value
    await wrapper.setProps({ value: { options: { damping: 0.1 } } })
    await nextTick()

    // No errors should be thrown; instance methods were not called
    const instance = getMockInstance()
    expect(instance.update).not.toHaveBeenCalled()

    wrapper.unmount()
  })

  it('skips Scrollbar.init when binding value is false (mobile disable pattern)', async () => {
    const TestComponent = defineComponent({
      template: `<div v-smoothscrollbar="false"></div>`,
    })

    const wrapper = mount(TestComponent, {
      global: { plugins: [SmoothVuebar] },
      attachTo: document.body,
    })

    expect(MockInit).not.toHaveBeenCalled()
    wrapper.unmount()
  })

  it('initializes the scrollbar when a falsy binding toggles truthy', async () => {
    MockGet.mockReturnValueOnce(undefined)

    const TestComponent = defineComponent({
      props: { enabled: Boolean },
      template: `<div v-smoothscrollbar="enabled"></div>`,
    })

    const wrapper = mount(TestComponent, {
      props: { enabled: false },
      global: { plugins: [SmoothVuebar] },
      attachTo: document.body,
    })

    expect(MockInit).not.toHaveBeenCalled()

    await wrapper.setProps({ enabled: true })
    await nextTick()

    expect(MockInit).toHaveBeenCalledOnce()
    expect(MockInit.mock.calls[0][0]).toBe(wrapper.element)

    wrapper.unmount()
  })

  it('does not destroy the scrollbar on re-render when the directive has no binding value', async () => {
    const TestComponent = defineComponent({
      props: { count: Number },
      template: '<div v-smoothscrollbar>{{ count }}</div>',
    })

    const wrapper = mount(TestComponent, {
      props: { count: 0 },
      global: { plugins: [SmoothVuebar] },
      attachTo: document.body,
    })

    const instance = getMockInstance()

    await wrapper.setProps({ count: 1 })
    await nextTick()

    expect(instance.destroy).not.toHaveBeenCalled()
    expect(instance.update).toHaveBeenCalledOnce()

    wrapper.unmount()
  })

  it('destroys the scrollbar when a truthy binding toggles falsy', async () => {
    const TestComponent = defineComponent({
      props: { enabled: Boolean },
      template: `<div v-smoothscrollbar="enabled"></div>`,
    })

    const wrapper = mount(TestComponent, {
      props: { enabled: true },
      global: { plugins: [SmoothVuebar] },
      attachTo: document.body,
    })

    const instance = getMockInstance()

    await wrapper.setProps({ enabled: false })
    await nextTick()

    expect(instance.destroy).toHaveBeenCalledOnce()

    wrapper.unmount()
  })
})
