// OpenAPI 运行时配置集中初始化
// 目的：
// 1) 统一读取 Vite 环境变量 `VITE_BASE_URL` 作为后端请求基础地址（Base URL）
// 2) 规范化地址（移除尾部斜杠），避免后续路径拼接出现重复斜杠
// 3) （可选）统一令牌读取策略，供生成的 SDK 在请求时附带认证信息
//
// 使用方式：在应用入口或布局模块顶部调用一次 `initOpenAPI()` 即可。
// 注意：按你的要求，此改动不保留对旧变量名 `VITE_API_BASE_URL` 的兼容。
import { OpenAPI } from './core/OpenAPI';

/**
 * 初始化 OpenAPI 运行时配置：BASE 与 TOKEN 读取
 * - BASE：来自 `import.meta.env.VITE_BASE_URL`，并移除尾部斜杠
 * - TOKEN：统一从 localStorage 读取 `accessToken`（如你不需要可删除该段）
 */
export function initOpenAPI(): void {
  // 读取 Vite 环境变量（Vite 在不同 mode 下会自动加载对应的 .env.* 文件）
  const base = import.meta.env?.VITE_BASE_URL ?? '';

  // 规整基础地址，移除尾部单个斜杠，减少 URL 拼接错误概率
  const normalized = String(base).trim().replace(/\/$/, '');

  // 设置 OpenAPI 基础地址（生成的服务会使用该值拼接请求路径）
  OpenAPI.BASE = normalized;

  // 可选：统一令牌读取策略；如项目无需可移除
  OpenAPI.TOKEN = async () => localStorage.getItem('accessToken') || '';

  // 诊断输出：便于在浏览器控制台确认当前 BASE 值
  // 若为空，请检查 .env.development 是否包含 VITE_BASE_URL
  console.debug('[OpenAPI] BASE =', OpenAPI.BASE);
}
