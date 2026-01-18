/**
 * 将 ISO 日期字符串格式化为时长（例如：3天前, 1小时前, 刚刚）
 * @param input 日期输入
 * @returns 格式化后的时长字符串
 */
export function formatDuration(input: string | number | Date | null | undefined): string {
  if (input === null || input === undefined) return "-";
  const date = typeof input === "string" || typeof input === "number" ? new Date(input) : input;
  if (!(date instanceof Date) || isNaN(date.getTime())) return "-";

  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return `${years}年前`;
  if (months > 0) return `${months}个月前`;
  if (days > 0) return `${days}天前`;
  if (hours > 0) return `${hours}小时前`;
  if (minutes > 0) return `${minutes}分钟前`;
  return "刚刚";
}

/**
 * 将 ISO 日期字符串格式化为本地时间字符串
 * @param isoString ISO 日期字符串
 * @returns 格式化后的本地时间字符串（YYYY-MM-DD HH:mm:ss）
 */
export function formatDate(input: string | number | Date | null | undefined): string {
  if (input === null || input === undefined) return "-";
  const date = typeof input === "string" || typeof input === "number" ? new Date(input) : input;
  if (!(date instanceof Date) || isNaN(date.getTime())) return "-";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function formatDateYMD(input: string | number | Date | null | undefined): string {
  if (input === null || input === undefined) return "-";
  const date = typeof input === "string" || typeof input === "number" ? new Date(input) : input;
  if (!(date instanceof Date) || isNaN(date.getTime())) return "-";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function formatDateOrDash(
  input: string | number | Date | null | undefined,
  placeholder: string = "-",
): string {
  if (input === null || input === undefined) return placeholder;
  const date = typeof input === "string" || typeof input === "number" ? new Date(input) : input;
  if (!(date instanceof Date) || isNaN(date.getTime())) return placeholder;
  return formatDate(date);
}
