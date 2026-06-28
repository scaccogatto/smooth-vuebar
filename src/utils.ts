import type { SmoothVuebarBindingValue } from './types'

type MaybeValue = SmoothVuebarBindingValue | null | undefined

const extractProp =
  <K extends keyof SmoothVuebarBindingValue>(prop: K) =>
  (obj: MaybeValue): SmoothVuebarBindingValue[K] | undefined =>
    obj == null ? undefined : obj[prop]

const extractOptions = extractProp('options')
const extractListener = extractProp('listener')

const bestMatch =
  <T>(extractor: (obj: MaybeValue) => T | undefined) =>
  (possibilities: Array<MaybeValue>): T | undefined =>
    extractor(possibilities.find((p) => extractor(p) !== undefined))

export const bestListener = bestMatch(extractListener)
export const bestOptions = bestMatch(extractOptions)
