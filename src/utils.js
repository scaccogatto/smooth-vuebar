const extractProp = prop => obj => typeof obj === 'undefined' ? undefined : obj[prop]
const extractOptions = extractProp('options')
const extractListener = extractProp('listener')

const bestMatch = extractor => possibilities => extractor(possibilities.find(p => typeof extractor(p) !== 'undefined'))
export const bestListener = bestMatch(extractListener)
export const bestOptions = bestMatch(extractOptions)
