// OpenAPI 运行时配置集中初始化
// 目的：
// 1) 统一读取 Vite 环境变量 `VITE_BASE_URL` 作为后端请求基础地址（Base URL）
// 2) 规范化地址（移除尾部斜杠），避免后续路径拼接出现重复斜杠
// 3) （可选）统一令牌读取策略，供生成的 SDK 在请求时附带认证信息
//
// 使用方式：在应用入口或布局模块顶部调用一次 `initOpenAPI()` 即可。
// 注意：按你的要求，此改动不保留对旧变量名 `VITE_API_BASE_URL` 的兼容。
//

/**
 * 初始化 OpenAPI 运行时配置：BASE 与 TOKEN 读取
 * - BASE：来自 `import.meta.env.VITE_BASE_URL`，并移除尾部斜杠
 * - TOKEN：统一从 localStorage 读取 `accessToken`（如你不需要可删除该段）
 */
// 通过全局标记确保仅初始化一次，避免在 HMR 或重复导入下污染配置
export async function initOpenAPI(): Promise<void> {
  if (typeof window !== 'undefined') {
    const w = window as any;
    if (w.__openapi_inited) return;
    w.__openapi_inited = true;
  }
  const base = import.meta.env.VITE_BASE_URL || '';
  const normalized = String(base).trim().replace(/\/$/, '');
  const { OpenAPI } = await import('./core/OpenAPI');
  OpenAPI.BASE = normalized;
  OpenAPI.TOKEN = async () => localStorage.getItem('accessToken') || '';
  console.debug('[OpenAPI] BASE =', OpenAPI.BASE);
}
