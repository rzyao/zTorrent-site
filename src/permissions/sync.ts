/**
 * 启动时扫描权限并同步到后端 batch-create 接口
 *
 * 设计要点：
 * - 使用 Vite 的 import.meta.glob 以原始文本方式读取项目内 TSX 文件
 * - 基于正则提取 PermissionRoute / AccessControl / canAccess 的 requiredPermissions
 * - 路由 path 尽量就近匹配 <Route path="...">，用于页面权限的 urls 字段
 * - 去重后构造 BatchCreatePermissionsDto，调用后端接口
 * - 若未登录（无 token），挂载 'authChange' 事件后再尝试同步
 */
import { registerPage, registerButton, toBatchDto, clearRegistry } from "./registry";
import { getPermissionsService } from "@/api/lazy";

/**
 * 公开入口：在应用启动时调用
 */
export async function syncPermissionsOnStartup(): Promise<void> {
  try {
    // 1) 在启动阶段进行一次全项目扫描
    await scanProjectForPermissions();

    // 2) 如果尚未登录，则在登录事件后再同步
    const hasToken = !!localStorage.getItem("accessToken");
    if (!hasToken) {
      const onAuth = () => {
        window.removeEventListener("authChange", onAuth);
        void sendBatchCreate();
      };
      window.addEventListener("authChange", onAuth);
      return;
    }

    // 3) 已登录则直接发送
    await sendBatchCreate();
  } catch (e) {
    console.warn("[permissions-sync] 启动同步异常：", e);
  }
}

/**
 * 执行批量创建/更新
 */
async function sendBatchCreate(): Promise<void> {
  try {
    const PermissionsService = await getPermissionsService();
    const payload = toBatchDto();
    if (!payload.items || payload.items.length === 0) {
      console.info("[permissions-sync] 未发现需要同步的权限项");
      return;
    }
    const resp: any = await PermissionsService.permissionsControllerBatchCreate(payload as any);
    const body = resp?.code !== undefined ? resp : resp?.data;
    console.info(
      "[permissions-sync] 批量创建/更新完成：",
      Array.isArray(body?.data) ? body.data.length : 0,
      "项",
    );
  } catch (e) {
    console.warn("[permissions-sync] 批量创建接口调用失败：", e);
  } finally {
    // 清空注册表，避免后续重复触发导致数据交叉
    clearRegistry();
  }
}

/**
 * 全项目扫描（原始文本）
 *
 * 提取规则：
 * - PermissionRoute: <PermissionRoute requiredPermissions={['a','b']}>，并就近关联前置的 Route path="..."
 * - AccessControl: <AccessControl requiredPermissions={['x','y']}>，记录所在文件名作为位置辅助
 * - canAccess: canAccess(access, { requiredPermissions: ['k','m'] })，记录所在文件名作为位置辅助
 */
async function scanProjectForPermissions(): Promise<void> {
  // as: 'raw' 将文件内容以字符串形式导入；eager: true 做静态展开
  const files = import.meta.glob("../**/*.tsx", { as: "raw", eager: true }) as Record<string, string>;

  for (const [file, src] of Object.entries(files)) {
    try {
      const text = String(src ?? "");
      if (!text) continue;
      const locationHint = file.replace(/^.*src\//, "/").replace(/\\/g, "/");

      // 解析 PermissionRoute block，提取 requiredPermissions 与最近的 Route path
      const routeBlocks = matchAllJsx(text, /<Route[\s\S]*?>[\s\S]*?<PermissionRoute[\s\S]*?>/g);
      for (const block of routeBlocks) {
        const routePath = matchFirst(block, /<Route[^>]*\bpath\s*=\s*["']([^"']+)["']/i);
        const permArray = matchArrayLiterals(block, /\brequiredPermissions\s*=\s*\{(\[[^\]]*\])\}/i);
        if (permArray.length > 0) {
          registerPage(permArray, routePath || undefined, undefined, `from:${locationHint}`);
        }
      }

      // 解析独立的 PermissionRoute（非包裹在 <Route> 内的情况）
      const prPerms = matchArrayLiterals(text, /<PermissionRoute[^>]*\brequiredPermissions\s*=\s*\{(\[[^\]]*\])\}/gi);
      if (prPerms.length > 0) {
        registerPage(prPerms, undefined, undefined, `from:${locationHint}`);
      }

      // 解析 AccessControl
      const acPerms = matchArrayLiterals(text, /<AccessControl[^>]*\brequiredPermissions\s*=\s*\{(\[[^\]]*\])\}/gi);
      if (acPerms.length > 0) {
        registerButton(acPerms, undefined, undefined, `from:${locationHint}`);
      }

      // 解析 canAccess(...) 用法
      const caPerms = matchArrayLiterals(text, /canAccess\([^)]*?\{\s*[^}]*\brequiredPermissions\s*:\s*\[([^\]]*)\][^}]*\}\s*\)/gi);
      if (caPerms.length > 0) {
        registerButton(caPerms, undefined, undefined, `from:${locationHint}`);
      }
    } catch (e) {
      console.warn("[permissions-sync] 扫描文件失败：", file, e);
    }
  }
}

/**
 * 匹配所有片段
 */
function matchAllJsx(text: string, re: RegExp): string[] {
  const out: string[] = [];
  let m: RegExpExecArray | null;
  const rx = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g");
  while ((m = rx.exec(text))) {
    out.push(m[0]);
  }
  return out;
}

/**
 * 匹配首个分组
 */
function matchFirst(text: string, re: RegExp): string | null {
  const m = re.exec(text);
  return m && m[1] ? String(m[1]) : null;
}

/**
 * 提取数组字面量内的字符串（兼容单引号/双引号）
 *
 * @example
 * 输入： requiredPermissions={['home', "review:write"]}
 * 返回： ['home', 'review:write']
 */
function matchArrayLiterals(text: string, re: RegExp): string[] {
  const m = re.exec(text);
  if (!m) return [];
  const raw = String(m[1] ?? "");
  const out: string[] = [];
  // 匹配 'xxx' 或 "xxx"
  const strRe = /['"]([^'"]+)['"]/g;
  let sm: RegExpExecArray | null;
  while ((sm = strRe.exec(raw))) {
    out.push(sm[1]);
  }
  return Array.from(new Set(out));
}

