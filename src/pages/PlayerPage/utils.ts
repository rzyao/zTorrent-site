/**
 * 工具函数集合
 * 将纯逻辑工具方法与页面逻辑分离，提升复用性与可测试性
 */

/**
 * 将秒数格式化为 mm:ss 文本
 * @param seconds 秒数
 */
export function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

