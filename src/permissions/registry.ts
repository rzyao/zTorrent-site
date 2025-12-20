/**
 * 权限注册表（前端侧）
 *
 * 作用：
 * - 在应用启动或扫描阶段，收集所有“页面/按钮”的权限键
 * - 统一去重与整形为批量创建接口所需的 CreatePermissionDto 列表
 *
 * 设计说明：
 * - 使用 Map 以权限 key 为唯一索引，避免重复插入
 * - 对“页面”类型记录可能的路由 path，便于后端构建权限树或反查来源
 * - name 默认与 key 相同，后续可按需要传入更友好的显示名称
 */
import type { BatchCreatePermissionsDto } from "@/api/models/BatchCreatePermissionsDto";
import { CreatePermissionDto } from "@/api/models/CreatePermissionDto";

type PermissionType = CreatePermissionDto["type"];

type RegistryItem = {
  key: string;
  name: string;
  type: PermissionType;
  scope: CreatePermissionDto["scope"];
  description?: string;
  urls?: string;
};

const registry = new Map<string, RegistryItem>();

/**
 * 注册“页面”权限
 * @param keys 页面所需的权限键列表（通常为 'page:*'）
 * @param routePath 该页面对应的路由路径（如 '/torrents'）
 * @param name 可选的显示名称（默认与 key 相同）
 * @param description 可选描述
 */
export function registerPage(
  keys: string[] | undefined,
  routePath?: string,
  name?: string,
  description?: string,
): void {
  if (!keys || keys.length === 0) return;
  for (const key of keys) {
    const prev = registry.get(key);
    const item: RegistryItem = {
      key,
      name: name ?? key,
      type: CreatePermissionDto.type.PAGE,
      scope: CreatePermissionDto.scope.WEB,
      description,
      urls: routePath ? safeAppendUrl(prev?.urls, routePath) : prev?.urls,
    };
    registry.set(key, { ...(prev ?? {}), ...item });
  }
}

/**
 * 注册“按钮”权限
 * @param keys 按钮/操作的权限键列表（如 'review:write'、'user.delete'）
 * @param location 可选：该按钮所在页面路径（用于辅助 urls 追踪）
 * @param name 可选显示名称（默认与 key 相同）
 * @param description 可选描述
 */
export function registerButton(
  keys: string[] | undefined,
  location?: string,
  name?: string,
  description?: string,
): void {
  if (!keys || keys.length === 0) return;
  for (const key of keys) {
    const prev = registry.get(key);
    const item: RegistryItem = {
      key,
      name: name ?? key,
      type: CreatePermissionDto.type.BUTTON,
      scope: CreatePermissionDto.scope.WEB,
      description,
      urls: location ? safeAppendUrl(prev?.urls, location) : prev?.urls,
    };
    registry.set(key, { ...(prev ?? {}), ...item });
  }
}

/**
 * 导出批量创建 DTO
 * @returns 批量创建入参
 */
export function toBatchDto(): BatchCreatePermissionsDto {
  const items: CreatePermissionDto[] = Array.from(registry.values()).map(
    (r) => ({
      key: r.key,
      name: r.name,
      type: r.type,
      scope: r.scope,
      description: r.description,
      urls: r.urls,
    }),
  );
  return { items };
}

/**
 * 清空注册表（可在测试或再次扫描前调用）
 */
export function clearRegistry(): void {
  registry.clear();
}

/**
 * 读取当前已注册的权限项（仅用于调试/验证）
 */
export function getRegistrySnapshot(): RegistryItem[] {
  return Array.from(registry.values());
}

/**
 * 辅助：将路径安全追加到逗号分隔的 urls 字段中
 */
function safeAppendUrl(existing: string | undefined, path: string): string {
  const p = String(path).trim();
  if (!p) return existing ?? "";
  const prev = (existing ?? "").trim();
  if (!prev) return p;
  const set = new Set(prev.split(",").map((s) => s.trim()).filter(Boolean));
  set.add(p);
  return Array.from(set).join(",");
}
