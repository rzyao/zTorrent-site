# 中国大陆访问拦截（CN Geo Block）前端对接文档

本文档说明：当服务端启用「禁止中国大陆（CN）访问」后，前端应如何识别与处理拦截响应，以及如何通过系统设置接口开启/关闭与配置白名单。

## 1. 功能概述

- 服务器可按国家码拦截来自中国大陆（`CN`）的访问。
- 命中拦截时返回 HTTP `451 Unavailable For Legal Reasons`。
- 返回体遵循后端统一错误响应结构（`{ code, message, data, path, timestamp }`）。
- **开关与白名单仅使用数据库系统设置控制**（不读取 env）。

## 2. 默认行为（重要）

- `geo.block.cn.enabled` 默认值：`false`
- 若该键不存在，或读取失败（例如数据库异常），也按 `false` 处理（即 **默认放行**）。

> 结论：只有当系统设置明确设置为 `true` 时，才会拦截 CN。

## 3. 相关系统设置键

| key | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `geo.block.cn.enabled` | boolean | `false` | 是否启用 CN 拦截（命中返回 451） |
| `geo.block.cn.allowlist.ips` | string | `""` | IP 白名单，逗号分隔；命中则放行 |
| `geo.block.cn.allowlist.routes` | string | `""` | 路由前缀白名单，逗号分隔；命中则放行（`startsWith` 匹配） |

白名单匹配说明：
- IP 以服务端提取的“客户端 IP”字符串为准（可能来自 `CF-Connecting-IP` / `X-Forwarded-For` / `req.ip`）。
- routes 为 URL path 前缀匹配，例如：`/api-docs,/public,/health`。

## 4. 拦截响应（HTTP 451）格式

### 4.1 关键特征

- HTTP 状态码：`451`
- `code`：`9451`（业务码，便于前端统一错误处理）
- `message`：**可直接展示给用户的友好提示**

### 4.2 示例响应

```json
{
  "code": 9451,
  "message": "由于法律与政策原因，您的地区无法访问该服务",
  "data": {
    "message": "访问受限：不对中国大陆开放",
    "bizCode": 9451,
    "country": "CN",
    "ip": "203.0.113.10",
    "description": "访问受限：不对中国大陆开放"
  },
  "path": "/some/api/path",
  "timestamp": "2026-01-20T08:00:00.000Z"
}
```

字段建议使用优先级：
- 展示给用户：优先 `message`；其次 `data.description`
- 用于程序判断：优先 HTTP `status===451` 或 `code===9451`

## 5. 前端处理建议

### 5.1 全局拦截处理（推荐）

由于该拦截是全局守卫触发，可能发生在任意接口上（包括未登录请求），建议在 HTTP 客户端全局拦截：

- 若 `status === 451` 或 `code === 9451`：
  - 跳转到“地区不可用”页面，或弹出不可关闭的全局提示
  - 禁用自动重试（避免无限重试）
  - 记录一次埋点（可包含 `path`、`country`）

### 5.2 与登录/鉴权的关系

- 451 拦截发生在鉴权守卫之前，因此：
  - 可能在登录接口直接被拦截
  - 可能在 token 过期刷新前被拦截
- 前端应将 451 作为独立于 401/403 的异常类型处理。

### 5.3 缓存与生效时间

系统设置读取带内存缓存，默认 TTL 约 **60 秒**。
- 管理端修改 `geo.block.cn.*` 后，前端观察到的行为可能延迟最多 ~60 秒才完全生效。

## 6. 管理端/前端如何配置开关（通过 Settings API）

### 6.1 更新设置值（批量）

接口：
- `POST /settings/items/update`
- 需要鉴权，并具备权限：`sys:settings:update:values`

请求体示例（开启拦截 + 设置白名单）：

```json
{
  "items": [
    { "key": "geo.block.cn.enabled", "value": true },
    { "key": "geo.block.cn.allowlist.ips", "value": "203.0.113.10,198.51.100.23" },
    { "key": "geo.block.cn.allowlist.routes", "value": "/api-docs,/public" }
  ]
}
```

关闭拦截示例：

```json
{
  "items": [
    { "key": "geo.block.cn.enabled", "value": false }
  ]
}
```

说明：
- 该接口在键不存在时会自动创建记录（后端实现为 upsert）。
- 返回体遵循统一响应结构，成功时 `code === 1000`。

### 6.2 查询设置（用于管理端展示）

- `POST /settings/list`（需要权限，返回详细列表）
- `POST /settings/groups/list`（按 group 拉取，`group="geo"` 可筛选地理配置）

## 7. 已知限制

- 国家码优先来自边缘/代理头（如 Cloudflare `CF-IPCountry`）。如果没有国家头且未部署本地 GeoIP 库，国家解析可能为 `undefined`，此时不会触发 CN 拦截。
- 若需要强一致的国家识别，建议在边缘/CDN 层配置国家拦截规则作为第一道防线。

