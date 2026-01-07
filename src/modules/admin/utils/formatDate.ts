/**
 * 将 ISO 日期字符串格式化为本地时间字符串
 * @param isoString ISO 日期字符串
 * @returns 格式化后的本地时间字符串（YYYY-MM-DD HH:mm:ss）
 */
export function formatDate(input: string | number | Date | null | undefined): string {
  if (input === null || input === undefined) return '-'
  const date = typeof input === 'string' || typeof input === 'number' ? new Date(input) : input
  if (!(date instanceof Date) || isNaN(date.getTime())) return '-'

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

export function formatDateYMD(input: string | number | Date | null | undefined): string {
  if (input === null || input === undefined) return '-'
  const date = typeof input === 'string' || typeof input === 'number' ? new Date(input) : input
  if (!(date instanceof Date) || isNaN(date.getTime())) return '-'

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function formatDateOrDash(input: string | number | Date | null | undefined, placeholder: string = '-'): string {
  if (input === null || input === undefined) return placeholder
  const date = typeof input === 'string' || typeof input === 'number' ? new Date(input) : input
  if (!(date instanceof Date) || isNaN(date.getTime())) return placeholder
  return formatDate(date)
}
