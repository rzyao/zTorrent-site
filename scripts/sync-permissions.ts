/**
 * 手动同步权限脚本
 *
 * 用法：
 * 1) 配置环境变量：
 *    - API_BASE_URL：后端地址，例如 http://localhost:8890
 *    - ACCESS_TOKEN：管理员账号的 JWT
 *    可在项目根目录创建 .env 文件或通过命令行设置
 *
 * 2) 运行：
 *    - Windows PowerShell:
 *      $env:API_BASE_URL="http://localhost:8890"; $env:ACCESS_TOKEN="<你的token>"; npm run permissions:sync
 *    - 或在 .env 中写入后直接：
 *      npm run permissions:sync
 *
 * 行为：
 * - 递归扫描 src 目录下所有 .tsx 文件，提取页面与按钮的权限键
 * - 页面权限来源：<PermissionRoute requiredPermissions={['page:*']}>
 * - 按钮权限来源：<AccessControl requiredPermissions={['xxx:*']}> 与 canAccess(...requiredPermissions: [...])
 * - 构造 BatchCreatePermissionsDto 并调用 POST /permissions/batch-create
 */
import 'dotenv/config';
import { promises as fs } from 'fs';
import * as path from 'path';
import { OpenAPI } from '../src/api/core/OpenAPI';
import { PermissionsService } from '../src/api/services/PermissionsService';
import { CreatePermissionDto } from '../src/api/models/CreatePermissionDto';
import axios from 'axios';

type RegistryItem = {
  key: string;
  name: string;
  type: CreatePermissionDto.type;
  scope: CreatePermissionDto.scope;
  description?: string;
  urls?: string;
};

const registry = new Map<string, RegistryItem>();
type ServiceIndex = Record<string, { method: string; url: string }>;
type ButtonRecord = {
  file: string;
  line?: number;
  label?: string;
  permission: string;
  apis: Array<{ method: string; url: string; service?: string; fn?: string }>;
};
type PageRecord = {
  path: string;
  permission: string;
  component?: string;
  componentFile?: string;
};
const buttons: ButtonRecord[] = [];
const pages: PageRecord[] = [];
let serviceIndex: ServiceIndex = {};

async function main() {
  const base = (process.env.API_BASE_URL || '').trim() || 'http://localhost:8890';
  const token = (process.env.ACCESS_TOKEN || '').trim();

  OpenAPI.BASE = base.replace(/\/$/, '');
  if (token) {
    OpenAPI.TOKEN = async () => token;
  } else {
    delete (OpenAPI as any).TOKEN;
  }

  // 解析路由与服务索引
  await parseAppRoutes();
  serviceIndex = await buildServiceIndex();

  console.info('[permissions-sync] 扫描项目权限…');
  const srcDir = path.resolve(process.cwd(), 'src');
  await scanDir(srcDir);

  // 额外：从后端获取 API 接口权限记录并并入注册表
  await fetchAndRegisterApiPermissions(base);

  const payload = toBatchDto();
  if (!payload.items.length) {
    console.info('[permissions-sync] 未发现需要同步的权限项');
    return;
  }
  console.info('[permissions-sync] 提交批量创建/更新…', payload.items.length, '项');
  const resp: any = await PermissionsService.permissionsControllerBatchCreate(payload as any);
  const body = resp?.code !== undefined ? resp : resp?.data;
  console.info('[permissions-sync] 完成：', Array.isArray(body?.data) ? body.data.length : 0, '项');

  // 写出页面-按钮-接口权限树
  await writePermissionTree();
}

async function scanDir(dir: string) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      await scanDir(full);
    } else if (e.isFile() && full.endsWith('.tsx')) {
      try {
        const text = await fs.readFile(full, 'utf8');
        scanFile(text, full);
      } catch (err) {
        console.warn('[permissions-sync] 读取失败：', full, err);
      }
    }
  }
}

function scanFile(text: string, filePath: string) {
  const locationHint = filePath.replace(/^.*src[\\/]/, '/').replace(/\\/g, '/');

  // PermissionRoute 联合 Route path 的块
  const routeBlocks = matchAll(text, /<Route[\s\S]*?>[\s\S]*?<PermissionRoute[\s\S]*?>/g);
  for (const block of routeBlocks) {
    const routePath = matchFirst(block, /<Route[^>]*\bpath\s*=\s*["']([^"']+)["']/i);
    const permArray = matchArrayLiterals(block, /\brequiredPermissions\s*=\s*\{(\[[^\]]*\])\}/i);
    if (permArray.length > 0) {
      registerPage(permArray, routePath || undefined, undefined, `from:${locationHint}`);
      if (routePath && permArray[0]) {
        pages.push({ path: routePath, permission: permArray[0] });
      }
    }
  }

  // 独立 PermissionRoute
  const prPerms = matchArrayLiterals(text, /<PermissionRoute[^>]*\brequiredPermissions\s*=\s*\{(\[[^\]]*\])\}/gi);
  if (prPerms.length > 0) {
    registerPage(prPerms, undefined, undefined, `from:${locationHint}`);
  }

  // AccessControl
  const acPerms = matchArrayLiterals(text, /<AccessControl[^>]*\brequiredPermissions\s*=\s*\{(\[[^\]]*\])\}/gi);
  if (acPerms.length > 0) {
    registerButton(acPerms, undefined, undefined, `from:${locationHint}`);
    const labels = matchAll(text, /<Button[^>]*>([\s\S]*?)<\/Button>/g).map((b) => {
      const m = /<Button[^>]*>([\s\S]*?)<\/Button>/.exec(b);
      const raw = m && m[1] ? String(m[1]).replace(/<[^>]+>/g, '').trim() : '';
      return raw || undefined;
    });
    const apis = findApisInFile(text);
    for (const p of acPerms) {
      buttons.push({ file: locationHint, label: labels[0], permission: p, apis });
    }
  }

  // canAccess
  const caPerms = matchArrayLiterals(text, /canAccess\([^)]*?\{\s*[^}]*\brequiredPermissions\s*:\s*\[([^\]]*)\][^}]*\}\s*\)/gi);
  if (caPerms.length > 0) {
    registerButton(caPerms, undefined, undefined, `from:${locationHint}`);
    const labels = matchAll(text, /<Button[^>]*>([\s\S]*?)<\/Button>/g).map((b) => {
      const m = /<Button[^>]*>([\s\S]*?)<\/Button>/.exec(b);
      const raw = m && m[1] ? String(m[1]).replace(/<[^>]+>/g, '').trim() : '';
      return raw || undefined;
    });
    const apis = findApisInFile(text);
    for (const p of caPerms) {
      buttons.push({ file: locationHint, label: labels[0], permission: p, apis });
    }
  }
}

/**
 * 拉取后端 API 权限记录并注册为 type=api 的权限项
 * 优先使用服务端返回的 name/scope/urls；若缺失则填充默认值
 */
async function fetchAndRegisterApiPermissions(baseUrl: string): Promise<void> {
  try {
    const url = `${String(baseUrl).replace(/\/$/, '')}/permissions/all`;
    const resp = await axios.get(url, {
      headers: {},
      validateStatus: () => true,
    });
    const body = resp.data?.code !== undefined ? resp.data : resp.data;
    const list: any[] = Array.isArray(body?.data) ? body.data : Array.isArray(body) ? body : [];
    if (!Array.isArray(list) || list.length === 0) {
      console.info('[permissions-sync] /permissions/all 未返回数据或为空');
      return;
    }
    for (const item of list) {
      const key = String(item?.key ?? '').trim();
      if (!key) continue;
      const name = String(item?.name ?? key);
      // 若服务端带 scope/type 则采用；否则默认 API + ADMIN
      const typeVal: CreatePermissionDto.type =
        item?.type && String(item.type).toLowerCase() === 'page'
          ? CreatePermissionDto.type.PAGE
          : item?.type && String(item.type).toLowerCase() === 'button'
            ? CreatePermissionDto.type.BUTTON
            : CreatePermissionDto.type.API;
      const scopeVal: CreatePermissionDto.scope =
        item?.scope && String(item.scope).toLowerCase() === 'web'
          ? CreatePermissionDto.scope.WEB
          : CreatePermissionDto.scope.ADMIN;
      const urls = typeof item?.urls === 'string' ? item.urls : undefined;
      upsert(key, {
        key,
        name,
        type: typeVal,
        scope: scopeVal,
        description: typeof item?.description === 'string' ? item.description : undefined,
        urls,
      });
    }
    console.info('[permissions-sync] 并入 API 权限记录：', list.length, '项');
  } catch (e) {
    console.warn('[permissions-sync] 拉取 /permissions/all 失败：', e);
  }
}

/**
 * 解析 AppRoutes：建立 path → component 文件映射
 */
async function parseAppRoutes(): Promise<void> {
  try {
    const routesPath = path.resolve(process.cwd(), 'src/routes/AppRoutes.tsx');
    const text = await fs.readFile(routesPath, 'utf8');
    const importMap: Record<string, string> = {};
    const importBlocks = matchAll(text, /import\s+{?\s*([\w,\s]+)\s*}?\s+from\s+["']([^"']+)["'];?/g);
    for (const blk of importBlocks) {
      const m = /import\s+{?\s*([\w,\s]+)\s*}?\s+from\s+["']([^"']+)["']/.exec(blk);
      if (!m) continue;
      const names = m[1].split(',').map((s) => s.trim()).filter(Boolean);
      const rel = m[2];
      const abs = resolveAlias(rel);
      for (const n of names) importMap[n] = abs;
    }
    const routeElems = matchAll(text, /path\s*=\s*["']([^"']+)["'][\s\S]*?element\s*=\s*\{[\s\S]*?<PermissionRoute[\s\S]*?>\s*<([\w]+)[\s/>]/g);
    for (const blk of routeElems) {
      const m = /path\s*=\s*["']([^"']+)["'][\s\S]*?element\s*=\s*\{[\s\S]*?<PermissionRoute[\s\S]*?>\s*<([\w]+)[\s/>]/.exec(blk);
      if (!m) continue;
      const p = m[1];
      const comp = m[2];
      const file = importMap[comp];
      const rec = pages.find((x) => x.path === p);
      if (rec) {
        rec.component = comp;
        rec.componentFile = file;
      } else {
        pages.push({ path: p, permission: 'page:unknown', component: comp, componentFile: file });
      }
    }
  } catch (e) {
    console.warn('[permissions-sync] 解析 AppRoutes 失败：', e);
  }
}

function resolveAlias(rel: string): string {
  const clean = rel.replace(/^@\/?/, 'src/').replace(/^\.\//, 'src/').replace(/\\/g, '/');
  return path.resolve(process.cwd(), clean);
}

/**
 * 构建服务索引：Service.method → {method,url}
 */
async function buildServiceIndex(): Promise<ServiceIndex> {
  const index: ServiceIndex = {};
  const dir = path.resolve(process.cwd(), 'src/api/services');
  let files: string[] = [];
  try {
    files = (await fs.readdir(dir)).filter((f) => f.endsWith('.ts')).map((f) => path.join(dir, f));
  } catch {
    return index;
  }
  for (const f of files) {
    try {
      const t = await fs.readFile(f, 'utf8');
      const className = matchFirst(t, /export\s+class\s+(\w+)/) || path.basename(f, '.ts');
      const blocks = matchAll(t, /public\s+static\s+(\w+)\([\s\S]*?\)\s*:[\s\S]*?__request\([\s\S]*?url:\s*['"]([^'"]+)['"][\s\S]*?method:\s*['"]([^'"]+)['"]/g);
      for (const b of blocks) {
        const m = /public\s+static\s+(\w+)\([\s\S]*?\)\s*:[\s\S]*?__request\([\s\S]*?url:\s*['"]([^'"]+)['"][\s\S]*?method:\s*['"]([^'"]+)['"]/.exec(b);
        if (!m) continue;
        const fn = m[1];
        const url = m[2];
        const method = m[3];
        index[`${className}.${fn}`] = { method, url };
      }
    } catch { }
  }
  return index;
}

/**
 * 查找组件文件内的服务调用/axios请求
 */
function findApisInFile(text: string): Array<{ method: string; url: string; service?: string; fn?: string }> {
  const out: Array<{ method: string; url: string; service?: string; fn?: string }> = [];
  const svcCalls = matchAll(text, /(\w+Service)\.(\w+)\s*\(/g);
  for (const blk of svcCalls) {
    const m = /(\w+Service)\.(\w+)\s*\(/.exec(blk);
    if (!m) continue;
    const svc = m[1];
    const fn = m[2];
    const info = serviceIndex[`${svc}.${fn}`];
    if (info) out.push({ method: info.method, url: info.url, service: svc, fn });
  }
  const axiosCalls = matchAll(text, /axios\.(get|post|put|delete)\s*\(\s*["']([^"']+)["']/g);
  for (const blk of axiosCalls) {
    const m = /axios\.(get|post|put|delete)\s*\(\s*["']([^"']+)["']/.exec(blk);
    if (!m) continue;
    out.push({ method: m[1].toUpperCase(), url: m[2] });
  }
  const uniq = new Map(out.map((a) => [`${a.method} ${a.url}`, a]));
  return Array.from(uniq.values());
}

/**
 * 写出权限树文件
 */
async function writePermissionTree(): Promise<void> {
  const pagePrefixMap: Record<string, string> = {};
  for (const p of pages) {
    if (p.componentFile) {
      pagePrefixMap[p.path] = path.dirname(p.componentFile).replace(/\\/g, '/');
    }
  }
  const tree: Array<{
    path: string;
    permission: string;
    name: string;
    buttons: Array<{ label?: string; permission: string; apis: Array<{ method: string; url: string; service?: string; fn?: string }> }>;
  }> = [];
  for (const p of pages) {
    const prefix = p.componentFile ? path.dirname(p.componentFile).replace(/\\/g, '/') : '';
    const btns = buttons.filter((b) => prefix && b.file.startsWith(prefix.replace(/^.*src\//, '/')));
    tree.push({
      path: p.path,
      permission: p.permission,
      name: p.permission,
      buttons: btns.map((b) => ({ label: b.label, permission: b.permission, apis: b.apis })),
    });
  }
  const outDir = path.resolve(process.cwd(), 'scripts/out');
  try { await fs.mkdir(outDir, { recursive: true }); } catch { }
  const outFile = path.join(outDir, 'permissions-tree.json');
  await fs.writeFile(outFile, JSON.stringify({ pages: tree }, null, 2), 'utf8');
  console.info('[permissions-sync] 已生成权限树：', outFile);
}

function registerPage(keys: string[] | undefined, routePath?: string, name?: string, description?: string): void {
  if (!keys || keys.length === 0) return;
  for (const key of keys) {
    const prev = registry.get(key);
    upsert(key, {
      key,
      name: name ?? key,
      type: CreatePermissionDto.type.PAGE,
      scope: CreatePermissionDto.scope.WEB,
      description,
      urls: routePath ? safeAppendUrl(prev?.urls, routePath) : prev?.urls,
    });
  }
}

function registerButton(keys: string[] | undefined, location?: string, name?: string, description?: string): void {
  if (!keys || keys.length === 0) return;
  for (const key of keys) {
    const prev = registry.get(key);
    upsert(key, {
      key,
      name: name ?? key,
      type: CreatePermissionDto.type.BUTTON,
      scope: CreatePermissionDto.scope.WEB,
      description,
      urls: location ? safeAppendUrl(prev?.urls, location) : prev?.urls,
    });
  }
}

function upsert(key: string, item: RegistryItem) {
  const prev = registry.get(key);
  registry.set(key, { ...(prev ?? {}), ...item });
}

function toBatchDto() {
  return {
    items: Array.from(registry.values()).map((r) => ({
      key: r.key,
      name: r.name,
      type: r.type,
      scope: r.scope,
      description: r.description,
      urls: r.urls,
    })),
  };
}

function matchAll(text: string, re: RegExp): string[] {
  const out: string[] = [];
  let m: RegExpExecArray | null;
  const rx = new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g');
  while ((m = rx.exec(text))) {
    out.push(m[0]);
  }
  return out;
}

function matchFirst(text: string, re: RegExp): string | null {
  const m = re.exec(text);
  return m && m[1] ? String(m[1]) : null;
}

function matchArrayLiterals(text: string, re: RegExp): string[] {
  const m = re.exec(text);
  if (!m) return [];
  const raw = String(m[1] ?? '');
  const out: string[] = [];
  const strRe = /['"]([^'"]+)['"]/g;
  let sm: RegExpExecArray | null;
  while ((sm = strRe.exec(raw))) {
    out.push(sm[1]);
  }
  return Array.from(new Set(out));
}

function safeAppendUrl(existing: string | undefined, p: string): string {
  const pathStr = String(p).trim();
  if (!pathStr) return existing ?? '';
  const prev = (existing ?? '').trim();
  if (!prev) return pathStr;
  const set = new Set(prev.split(',').map((s) => s.trim()).filter(Boolean));
  set.add(pathStr);
  return Array.from(set).join(',');
}

main().catch((e) => {
  console.error('[permissions-sync] 未预期错误：', e);
  process.exitCode = 1;
});
