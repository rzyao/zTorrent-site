// 统一响应解包工具：兼容服务返回包裹结构与直出结构
export function unwrap<T = any>(resp: any): T {
  const body = resp?.code !== undefined ? resp : resp?.data ?? resp;
  return (body?.data ?? body) as T;
}

