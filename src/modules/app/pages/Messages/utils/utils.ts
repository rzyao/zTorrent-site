/**
 * 消息中心工具函数
 * - 网络响应解包与错误信息提取
 */

/**
 * 解包后端响应对象
 * - 兼容 `axios` 风格（存在 `data` 字段）与已有裸对象
 */
export function unwrapResponse<T = any>(resp: any): T {
  try {
    if (!resp) return resp as T;
    // axios 响应
    if (typeof resp === 'object' && resp !== null && 'data' in resp) {
      return (resp as any).data as T;
    }
    // 已是目标对象
    return resp as T;
  } catch (_) {
    return resp as T;
  }
}

/**
 * 提取友好的错误信息
 */
export function extractErrorMessage(err: any): string {
  if (!err) return '未知错误';
  // axios 错误：优先后端 message
  const maybeMsg = (err?.response?.data?.message ?? err?.message ?? err?.toString()) as string;
  if (typeof maybeMsg === 'string' && maybeMsg.trim().length > 0) return maybeMsg;
  try {
    return JSON.stringify(err);
  } catch (_) {
    return '发生错误';
  }
}

