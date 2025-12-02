# PlaylistsPage 页面后端对接说明

## 文档目的
- 为 `PlaylistsPage` 页面提供后端接口对接规范，明确缺失接口、请求参数、响应结构及需补全字段。
- 目标是用真实接口替换当前模拟数据，保持前端字段命名不变，减少改动成本。

## 页面功能概览
- 标签切换：全部片单、我的片单、我关注的（`src/pages/PlaylistsPage.tsx:22`）。
- 搜索：按标题/描述关键字过滤（`src/pages/PlaylistsPage.tsx:286-297, 206-209`）。
- 排序：最新创建/最受欢迎/评分最高（`src/pages/PlaylistsPage.tsx:298-307, 24`）。
- 列表展示：卡片所需字段详见下文（多处使用，如 `src/pages/PlaylistsPage.tsx:320-347, 352-371, 373-382, 385-407, 410-423`）。
- 操作：关注/取消关注（`src/pages/PlaylistsPage.tsx:410-415, 211-214`）；创建片单入口（`src/pages/PlaylistsPage.tsx:279-283`）；点击进入详情（`src/pages/PlaylistsPage.tsx:316-319, 216-219`）。

## 前端数据模型需求
当前页面使用的数据结构（`src/pages/PlaylistsPage.tsx:4-19`）：
- `id: string`
- `title: string`
- `description: string`
- `coverImage: string`（封面图 URL）
- `creator: string`（创建者显示名）
- `creatorAvatar: string`（头像；可返回头像 URL 或首字母字符串）
- `moviesCount: number`
- `followersCount: number`
- `viewsCount: number`
- `rating: number`（0-10 区间，支持一位小数）
- `isFollowing: boolean`（当前用户是否已关注）
- `createdAt: string`（日期字符串 `YYYY-MM-DD`）
- `updatedAt: string`（日期字符串 `YYYY-MM-DD`）
- `tags: string[]`

> 为减少前端改动，建议后端响应字段沿用上述命名与类型。

## 接口清单与详细规范

### 1）获取片单列表（全部/我的/关注）
- 方法与路径：`GET /api/playlists`
- 查询参数：
  - `scope`: `all | mine | following`（对应前端标签页，`src/pages/PlaylistsPage.tsx:195-204`）
  - `q`: `string`（搜索关键字，命中标题或描述，`src/pages/PlaylistsPage.tsx:206-209`）
  - `sort`: `latest | popular | rating`（`src/pages/PlaylistsPage.tsx:24, 298-307`）
  - `page`: `number`（默认 1）
  - `pageSize`: `number`（默认 20）
- 排序规则映射：
  - `latest` → `createdAt` 倒序
  - `popular` → `followersCount` 倒序（可辅以 `viewsCount` 作为次级排序）
  - `rating` → `rating` 倒序
- 响应：
```json
{
  "items": [
    {
      "id": "1",
      "title": "...",
      "description": "...",
      "coverImage": "https://...",
      "creator": "MovieMaster",
      "creatorAvatar": "MM",
      "moviesCount": 12,
      "followersCount": 2847,
      "viewsCount": 15632,
      "rating": 9.8,
      "isFollowing": true,
      "createdAt": "2024-10-15",
      "updatedAt": "2024-11-20",
      "tags": ["科幻", "悬疑", "大师作品"]
    }
  ],
  "page": 1,
  "pageSize": 20,
  "total": 123
}
```
- 说明：列表接口需在 `scope=all` 情况下也返回 `isFollowing` 字段（基于当前用户关系），以渲染关注按钮状态（`src/pages/PlaylistsPage.tsx:416-423`）。

### 2）关注/取消关注片单
- 方法与路径：`POST /api/playlists/{id}/follow`
- 请求体：
```json
{ "action": "follow" }
```
或
```json
{ "action": "unfollow" }
```
- 响应：
```json
{ "isFollowing": true, "followersCount": 2848 }
```
- 说明：需保证幂等；未登录返回 401；不存在返回 404。

### 3）创建片单
- 方法与路径：`POST /api/playlists`
- 请求体：
```json
{
  "title": "诺兰导演作品全集",
  "description": "...",
  "coverImage": "https://...",
  "tags": ["科幻", "悬疑"]
}
```
- 响应：
```json
{
  "id": "new-id",
  "title": "诺兰导演作品全集",
  "description": "...",
  "coverImage": "https://...",
  "creator": "当前用户昵称",
  "creatorAvatar": "NU",
  "moviesCount": 0,
  "followersCount": 0,
  "viewsCount": 0,
  "rating": 0,
  "isFollowing": false,
  "createdAt": "2024-12-02",
  "updatedAt": "2024-12-02",
  "tags": ["科幻", "悬疑"]
}
```
- 说明：需登录；校验标题唯一性（可选）。

### 4）获取片单详情（供跳转后使用）
- 方法与路径：`GET /api/playlists/{id}`
- 响应：
```json
{
  "id": "1",
  "title": "...",
  "description": "...",
  "coverImage": "https://...",
  "creator": "MovieMaster",
  "creatorAvatar": "MM",
  "moviesCount": 12,
  "followersCount": 2847,
  "viewsCount": 15632,
  "rating": 9.8,
  "isFollowing": true,
  "createdAt": "2024-10-15",
  "updatedAt": "2024-11-20",
  "tags": ["科幻", "悬疑", "大师作品"],
  "movies": [
    { "id": "m1", "title": "盗梦空间" },
    { "id": "m2", "title": "星际穿越" }
  ]
}
```
- 说明：`movies` 为可选扩展；此页仅需基础元数据以完成跳转。

### 5）浏览量上报（可选）
- 方法与路径：`POST /api/playlists/{id}/view`
- 响应：
```json
{ "viewsCount": 15633 }
```
- 说明：也可在详情 `GET` 时由后端自动递增并返回最新值。

## 排序与搜索规则映射
- 搜索：在 `title` 与 `description` 字段进行 `LIKE`/全文检索（`q` 为空则忽略）。
- 排序：`latest`→`createdAt` DESC；`popular`→`followersCount` DESC（可选二级 `viewsCount` DESC）；`rating`→`rating` DESC。

## 鉴权与错误响应规范
- 需要登录：`scope=mine`、`scope=following`、关注/取消关注、创建片单。
- 错误响应统一：
```json
{ "code": "Unauthorized", "message": "未登录" }
```
```json
{ "code": "NotFound", "message": "资源不存在" }
```
```json
{ "code": "InvalidArgument", "message": "参数错误" }
```

## 需要补全的字段清单（后端响应）
- 列表与详情均需包含：`isFollowing`（基于当前用户）、`moviesCount`、`followersCount`、`viewsCount`、`rating`、`tags`、`creator`、`creatorAvatar`、`createdAt`、`updatedAt`、`coverImage`。
- 说明：当前前端的卡片渲染依赖上述字段（见 `src/pages/PlaylistsPage.tsx` 相关行）。若 OpenAPI 现有定义缺少其中任意字段，请补全。

## 示例请求与响应汇总
- 列表：`GET /api/playlists?scope=all&q=诺兰&sort=latest&page=1&pageSize=20`
- 关注：`POST /api/playlists/1/follow` `{ "action": "follow" }`
- 取消关注：`POST /api/playlists/1/follow` `{ "action": "unfollow" }`
- 创建：`POST /api/playlists`
- 详情：`GET /api/playlists/1`
- 浏览量上报：`POST /api/playlists/1/view`

## 备注与建议
- `creatorAvatar` 建议优先返回头像 URL；若为空，前端将以创建者昵称首字母作为占位。
- 日期统一为字符串 `YYYY-MM-DD`，与现有前端直接展示一致，无需额外格式化。
- 若后端已有部分接口（OpenAPI）但字段不全，优先补齐字段，避免前端重构。
