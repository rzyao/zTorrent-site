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

// 时间格式化：统一在前端显示为本地时间字符串
// 接受 ISO 字符串、时间戳或 Date，解析失败时回退原值的字符串表示
export const formatDateTime = (value: any) => {
  try {
    if (value == null || value === '') return ''
    const d = value instanceof Date ? value : new Date(value)
    if (Number.isNaN(d.getTime())) return String(value ?? '')
    return d.toLocaleString()
  } catch (_) {
    return String(value ?? '')
  }
}

// 时间格式化：统一在前端显示为本地时间字符串
// 接受 ISO 字符串、时间戳或 Date，解析失败时回退原值的字符串表示
export const formatDate = (value: any) => {
  try {
    if (value == null || value === '') return ''
    const d = value instanceof Date ? value : new Date(value)
    if (Number.isNaN(d.getTime())) return String(value ?? '')
    return d.toLocaleDateString()
  } catch (_) {
    return String(value ?? '')
  }
}
