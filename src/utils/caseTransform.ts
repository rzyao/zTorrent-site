export function camelizeKey(key: string): string {
  return key.replace(/[_-]([a-z])/g, (_, c) => c.toUpperCase());
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object') return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

export function toCamelCase<T = unknown>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((v) => toCamelCase(v)) as unknown as T;
  }
  if (isPlainObject(value)) {
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      const ck = camelizeKey(k);
      result[ck] = toCamelCase(v as unknown);
    }
    return result as unknown as T;
  }
  return value;
}

