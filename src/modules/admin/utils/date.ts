export type ISODateString = string

export function isISODateString(value: unknown): value is ISODateString {
  if (typeof value !== 'string') return false
  return /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)
}

export function normalizeDatesDeep<T>(input: T): T {
  if (input === null || input === undefined) return input
  if (input instanceof Date) {
    return input.toISOString() as unknown as T
  }
  if (Array.isArray(input)) {
    return input.map(v => normalizeDatesDeep(v)) as unknown as T
  }
  if (typeof input === 'object') {
    const obj: Record<string, any> = input as unknown as Record<string, any>
    const out: Record<string, any> = {}
    for (const k of Object.keys(obj)) {
      out[k] = normalizeDatesDeep(obj[k])
    }
    return out as unknown as T
  }
  return input
}
