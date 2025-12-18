// 说明：以下几个模块在全局和多个服务中被静态导入，
// 若继续使用动态导入会导致 Rollup/Vite 提示“dynamic import will not move module into another chunk”。
// 因此这里改为静态导入以消除构建噪音，同时保留异步函数接口以兼容现有调用代码。
import { OpenAPI } from './core/OpenAPI';
import { request as __request } from './core/request';
import { TorrentsService } from './services/TorrentsService';
import { ImagesService } from './services/ImagesService';
import { MoviesService } from './services/MoviesService';
import { TicketsService } from './services/TicketsService';

export async function getOpenAPI() {
  // 初始化一次全局 OpenAPI 配置（仅在浏览器环境）
  if (typeof window !== 'undefined') {
    const w = window as any;
    if (!w.__openapi_inited_lazy) {
      w.__openapi_inited_lazy = true;
      const base = (import.meta as any).env?.VITE_BASE_URL || '';
      const normalized = String(base).trim().replace(/\/$/, '');
      OpenAPI.BASE = normalized;
      OpenAPI.TOKEN = async () => localStorage.getItem('accessToken') || '';
    }
  }
  return OpenAPI;
}

export async function getRequest() {
  // 返回静态导入的 request，以避免与全局静态引用混用产生分包警告
  return __request as any;
}

export async function getUsersService() {
  const mod = await import('./services/UsersService');
  return (mod as any).UsersService;
}

export async function getMoviesService() {
  // MoviesService 在多个页面中被静态导入，这里改为静态返回，避免构建警告
  return MoviesService as any;
}

/**
 * @deprecated 使用 getMoviesService 替代
 */
export async function getFilmsService() {
  return MoviesService as any;
}

export async function getAuthService() {
  const mod = await import('./services/AuthService');
  return (mod as any).AuthService;
}

export async function getTorrentsService() {
  // TorrentsService 在多处被静态导入，这里改为静态返回，避免构建警告
  return TorrentsService as any;
}

export async function getImagesService() {
  // ImagesService 在多处被静态导入，这里改为静态返回，避免构建警告
  return ImagesService as any;
}

export async function getPermissionsService() {
  const mod = await import('./services/PermissionsService');
  return (mod as any).PermissionsService;
}

export async function getTicketsService() {
  return TicketsService as any;
}
