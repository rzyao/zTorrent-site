export const formatSize = (value: any) => {
  const n = typeof value === 'number' ? value : parseInt(String(value), 10)
  if (!Number.isFinite(n) || n <= 0) return String(value)
  const TB = 1024 ** 4
  const GB = 1024 ** 3
  const MB = 1024 ** 2
  if (n >= TB) return `${(n / TB).toFixed(2)} T`
  if (n >= GB) return `${(n / GB).toFixed(2)} G`
  return `${(n / MB).toFixed(2)} M`
}
