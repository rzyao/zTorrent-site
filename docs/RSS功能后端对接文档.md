# RSS 功能后端对接文档

## 目标与范围
- 基于 `src/pages/RSSPage.tsx` 的前端实现，设计与之匹配的后端接口规范，用于生成/管理 RSS 订阅地址与用户的 RSS Token 管理。
- 覆盖接口列表、参数与枚举、响应格式、错误码、鉴权、示例、与前端字段映射及设计取舍说明。
- 不做旧代码兼容；以当前 UI 为准进行补齐与规范化。

## 前端代码关联
- 页面：`src/pages/RSSPage.tsx`（生成订阅链接、显示 Token、重置 Token、展示“我的RSS订阅”）
  - 生成链接逻辑：`generateRSSUrl` 函数，路径 `src/pages/RSSPage.tsx:88-113`。
  - 过滤项（按钮/勾选）：
    - 分类：`selectedCategories`（默认全选 `all`；枚举见下）
    - 标签：`selectedTags`
    - 质量：`selectedQuality`
    - 包含字段：`includeFields`（title/description/category/size/seeders/leechers/uploader/uploadDate/tags）
  - Token 显示与复制：`userRSSToken` 显示与 `handleCopyUrl` 复制，路径 `src/pages/RSSPage.tsx:115-119, 180-209`。
  - 我的订阅展示：使用 `mockFeeds`（`id/name/url/description/createdAt/itemCount`），路径 `src/pages/RSSPage.tsx:61-86, 350-399`。

## 统一鉴权
- 管理类接口（Token 管理、我的订阅增删改查）需 `Authorization: Bearer {token}`。
- RSS 拉取接口（供外部阅读器）通过查询参数 `token={rssToken}` 校验，不依赖 Bearer 头，便于第三方阅读器使用。


## 参数枚举与约定
- 分类 `category`（逗号分隔）：`movie|tv|documentary|music|anime|variety|sports`；传 `all` 或不传表示不过滤。
- 标签 `tags`（逗号分隔）：`free|vip|hot|2x`。
- 质量 `quality`（逗号分隔）：`4k|1080p|720p|remux|bluray|web-dl`。
- 字段 `fields`（逗号分隔）：`title|description|category|size|seeders|leechers|uploader|uploadDate|tags`；不传或传全量表示包含全部字段。
- 时间与分页：RSS 拉取不分页（阅读器自行处理）；JSON 列表按统一分页规范（见下）。

## 数据模型
- RSSFeed（我的订阅项）
  - `id`(string)、`name`(string)、`url`(string)、`description`(string)、`createdAt`(ISO)、`itemCount`(number)
- RSS Token
  - `token`(string)、`createdAt`(ISO)、`lastUsedAt?`(ISO)、`status`('active'|'revoked')

## 接口列表

### RSS 拉取（供阅读器）
- GET `/rss`
  - 描述：根据过滤条件生成并返回 RSS（`application/rss+xml`）。
  - Query：
    - `token`(string, 必填)：用户的 RSS Token
    - `category?`(string, 逗号分隔枚举)：`movie,tv,...`
    - `tags?`(string, 逗号分隔枚举)：`free,vip,...`
    - `quality?`(string, 逗号分隔枚举)：`4k,1080p,...`
    - `fields?`(string, 逗号分隔枚举)：限制 RSS item 的扩展字段集
  - 成功：返回 RSS XML 内容；同时响应头可携带 `ETag/Last-Modified` 以便阅读器增量拉取。
  - 示例：`GET /rss?token=a1b2c...&category=movie&tags=free&quality=4k&fields=title,category,seeders`

### Token 管理
- GET `/rss/token`
  - 描述：查询当前用户的 RSS Token 与状态。
  - Headers：`Authorization: Bearer {token}`
  - 200：`{ code:0, data:{ token:string, createdAt:string, lastUsedAt?:string, status:'active'|'revoked' } }`
- POST `/rss/token/reset`
  - 描述：重置并发放新的 RSS Token，旧 Token 立即失效（硬失效）。
  - Headers：`Authorization: Bearer {token}`
  - 200：`{ code:0, data:{ token:string } }`
  - 注意：返回新 Token；建议在服务端记录审计日志与失效原因。

### 我的 RSS 订阅管理
- POST `/rss/feeds/list`
  - 描述：分页查询当前用户保存的订阅项，用于“我的RSS订阅”区块。
  - Headers：`Authorization: Bearer {token}`
  - Body：`{ page?:number(默认1), pageSize?:number(默认20,<=100) }`
  - 200：`{ code:0, data:{ items: RSSFeed[], total:number } }`
- POST `/rss/feeds/create`
  - 描述：保存一个新的订阅项（便于复用与快速复制）。
  - Headers：`Authorization: Bearer {token}`
  - Body：`{ name:string, description?:string, filters:{ category?:string[], tags?:string[], quality?:string[], fields?:string[] } }`
  - 200：`{ code:0, data:{ id:string, url:string } }`
- POST `/rss/feeds/update`
  - 描述：更新订阅项的名称、描述或过滤条件。
  - Body：`{ id:string, name?:string, description?:string, filters?:{ category?:string[], tags?:string[], quality?:string[], fields?:string[] } }`
  - 200：`{ code:0, data:{} }`
- POST `/rss/feeds/delete`
  - 描述：删除订阅项。
  - Body：`{ id:string }`
  - 200：`{ code:0, data:{} }`
- POST `/rss/feeds/stats`
  - 描述：计算某订阅项当前可拉取的条目数（便于展示 `itemCount`）。
  - Body：`{ id:string }`
  - 200：`{ code:0, data:{ itemCount:number } }`

### 统一预览（可选）
- GET `/rss/preview`
  - 描述：在 Web 端以 JSON 预览即将生成的 RSS 项目（用于调试）。
  - Query：同 `/rss`。
  - 200：`{ code:0, data:{ items: Array<{ title:string, category:string, size?:number, seeders?:number, leechers?:number, uploader?:string, uploadDate?:string, tags?:string[] }> } }`

## 关键响应示例
### 我的订阅列表
```json
{
  "code": 0,
  "message": "OK",
  "data": {
    "items": [
      {
        "id": "1",
        "name": "电影 + FREE标签",
        "url": "https://pttracker.example.com/rss?token=a1b2c...&category=movie&tags=free",
        "description": "订阅所有免费电影种子",
        "createdAt": "2025-12-01T00:00:00Z",
        "itemCount": 128
      }
    ],
    "total": 1
  },
  "path": "/rss/feeds/list",
  "timestamp": "2025-12-10T10:00:00Z"
}
```

### 重置 Token
```json
{
  "code": 0,
  "message": "OK",
  "data": {
    "token": "n3w-t0k3n-xxxx"
  },
  "path": "/rss/token/reset",
  "timestamp": "2025-12-10T10:00:00Z"
}
```

## 设计原因与取舍说明
- RSS 接口使用 Query Token：适配外部阅读器使用场景，避免 Bearer 头依赖；安全性通过随机高熵 Token 保证。
- 管理接口使用 Bearer：与站内一致的鉴权方式，便于权限与审计控制。
- 过滤枚举与前端一致：严格对齐 `RSSPage.tsx` 的枚举与字段，减少前后端转换成本。
- `fields` 精简输出：通过限制字段降低 XML 体积与敏感信息暴露风险。
- 订阅项持久化：支持用户保存常用过滤组合，满足“我的RSS订阅”展示与复制需求。
- 统一分页风格：JSON 列表接口遵循现有分页约定，便于复用通用表格组件。

## 集成注意事项
- Token 保密与失效策略：服务端需提供硬失效（立即失效）与软失效（定时轮换）能力；重置后旧 Token 不可用。
- 速率限制：对 `/rss` 建议按 IP 与 Token 双维度加入 429 限流，防抓取与放大攻击。
- 缓存与条件请求：返回 `ETag/Last-Modified`，支持 `If-None-Match/If-Modified-Since` 以减少带宽。
- 校验与错误：对枚举值与组合进行后端校验，返回 422 字段级错误信息；非法 Token 返回 401/403。
- 安全字段：默认返回全部字段；如业务需要，可对 `uploader` 等敏感字段进行角色/等级控制。
- 日志与审计：记录 `/rss/token/reset` 与高频访问的审计日志；对异常抓取行为报警。

## 与前端字段映射
- 生成链接（`generateRSSUrl`）：
  - `selectedCategories` → Query `category`（排除 `all` 时拼接），见 `src/pages/RSSPage.tsx:92-94`。
  - `selectedTags` → Query `tags`，见 `src/pages/RSSPage.tsx:96-98`。
  - `selectedQuality` → Query `quality`，见 `src/pages/RSSPage.tsx:100-102`。
  - `includeFields` → Query `fields`（当非全勾选时拼接），见 `src/pages/RSSPage.tsx:104-111`。
- Token 显示与重置按钮：
  - 显示：`GET /rss/token` 返回 `token` 填充到 `userRSSToken`。
  - 重置：`POST /rss/token/reset` 触发“重置”按钮逻辑（对应 UI 的 `RefreshCw`），刷新页面后替换 `userRSSToken`。
- 我的 RSS 订阅：
  - 列表：`POST /rss/feeds/list` 映射到页面 `mockFeeds` 数据结构。
  - 复制：使用 `feed.url` 对应已保存的订阅地址（页面 `handleCopyUrl`）。
- 推荐阅读器与说明：不涉及接口。

## OpenAPI 分组建议
- 模块：`RSS`（路径 `/rss`, `/rss/token/*`, `/rss/feeds/*`）
- 响应包裹结构与错误码复用现有规范；服务端生成客户端 SDK 后可在前端新增 `RssService` 进行封装（与 `PasskeyService` 风格保持一致）。

> 以上规范可直接用于后端实现与 OpenAPI 文档生成；前端可在完成服务端实现后，将页面的模拟数据与硬编码 Token 替换为对应接口的真实数据流。

