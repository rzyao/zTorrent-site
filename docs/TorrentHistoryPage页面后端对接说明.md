# TorrentHistoryPage 页面后端对接说明

> 目标：为前端 `TorrentHistoryPage` 接入后端数据，统一使用 `POST` + `JSON body` 传参，不做旧兼容；明确缺失接口、参数与响应结构，并标注需补全字段。

- 前端参考：`src/pages/TorrentHistoryPage.tsx:152-171,332-423`
- 当前状态：页面使用本地模拟数据（`mockTorrents`），一次性拉取后在前端进行搜索与状态过滤。

## 页面概述与数据维度
- 功能点
  - 标签切换：`uploaded | seeding | downloading | completed | incomplete`
  - 搜索：按“种子名称/分类”关键字过滤
  - 列表展示字段：名称、分类、大小、上传量、下载量、分享率、进度、做种/下载数、状态、发布时间、完成时间
  - 顶部统计：各状态数量用于标签角标
- 数据维度约定
  - 列表项与统计均以“当前用户维度”返回（上传量、下载量、分享率、进度等与当前用户相关，而非全站聚合）

## 通用约定
- 请求方法：统一使用 `POST`
- 传参位置：统一使用 `JSON body`
- 鉴权：`Authorization: Bearer <token>`（沿用现有 axios/OpenAPI 封装）
- 统一响应包裹结构：
  ```json
  {
    "code": 0,
    "message": "ok",
    "data": { /* 业务数据 */ },
    "path": "/torrents/user/list-torrents",
    "timestamp": "2025-12-05T12:00:00Z"
  }
  ```
- 时间格式：`ISO 8601` 字符串（例如 `2025-12-05T12:00:00Z`）
- 数值单位：
  - 容量/流量：使用字节数（`bytes`，纯数字），前端再格式化为 `XX.X GB`
  - 进度：`0-100` 的整数百分比
  - 分享率：`Number`（服务端计算并返回，前端仅格式化显示）
- 不做旧兼容：仅支持本文档约定的字段与形态

## 数据模型定义
- 列表项 `TorrentHistoryItem`
  ```ts
  interface TorrentHistoryItem {
    id: number;                    // 种子唯一标识
    name: string;                  // 种子名称
    category_name: string;         // 分类展示名（如“电影/剧集/纪录片”）
    category_code?: string;        // 分类编码（建议补充，便于后续筛选）
    size_bytes: number;            // 种子大小（字节）
    upload_bytes: number;          // 用户上传量（字节）
    download_bytes: number;        // 用户下载量（字节）
    ratio: number;                 // 分享率（服务端计算，避免前端边界处理）
    seeders: number;               // 当前做种数
    leechers: number;              // 当前下载数
    progress_percent: number;      // 下载进度（0-100 整数）
    upload_date: string;           // 发布日期（ISO 字符串）
    complete_date?: string;        // 完成日期（ISO 字符串，可为空）
    status: 'uploaded' | 'seeding' | 'downloading' | 'completed' | 'incomplete';
  }
  ```
- 统计 `TorrentHistoryStats`
  ```ts
  interface TorrentHistoryStats {
    uploaded: number;
    seeding: number;
    downloading: number;
    completed: number;
    incomplete: number;
  }
  ```
- 分页 `Pagination`
  ```ts
  interface Pagination {
    page: number;
    page_size: number;
    total: number;
  }
  ```

## 接口清单与形态（统一 POST/JSON body）
### 1) 获取历史列表（含服务端过滤、分页与统计）
- 路径（建议沿用并扩展）：`POST /torrents/user/list-torrents`  
  如需新建也可使用：`POST /torrents/user/history/list`
- 请求 Body：
  ```json
  {
    "status": "seeding",        // 可选：指定状态过滤（不传则返回全部）
    "search": "4K HDR",         // 可选：按名称/分类模糊匹配
    "page": 1,                   // 可选：默认 1
    "page_size": 50              // 可选：默认 50
  }
  ```
- 响应 Data：
  ```json
  {
    "items": [ /* TorrentHistoryItem[] */ ],
    "pagination": { "page": 1, "page_size": 50, "total": 1234 },
    "stats": {                   // 始终返回五类状态的统计，用于标签角标
      "uploaded": 20,
      "seeding": 150,
      "downloading": 8,
      "completed": 63,
      "incomplete": 4
    }
  }
  ```
- 说明：为性能与扩展性，建议由服务端支持 `status/search/page/page_size` 过滤与分页；一次返回 `stats`，避免额外统计请求。

### 2) 可选：独立统计接口（如与列表分离部署）
- 路径：`POST /torrents/user/history/stats`
- 请求 Body：
  ```json
  { "search": "4K HDR" }
  ```
- 响应 Data：
  ```json
  {
    "uploaded": 20,
    "seeding": 150,
    "downloading": 8,
    "completed": 63,
    "incomplete": 4
  }
  ```
- 说明：如列表接口已返回 `stats`，该接口可不实现。

## 字段补全清单（后端需保证）
- `size_bytes`：返回数字字节数，前端格式化为 `XX.X GB`
- `upload_bytes` / `download_bytes`：返回数字字节数，前端格式化为 `XX.X GB`
- `ratio`：建议服务端直接返回，避免前端处理 `download_bytes=0` 的边界
- `seeders` / `leechers`：当前做种/下载人数（对接 tracker/统计源）
- `progress_percent`：下载进度 `0-100` 整数
- `upload_date` / `complete_date`：ISO 时间字符串
- `category_code`：建议补充，支持后续精准筛选（当前仅展示 `category_name`）
- `data.stats`：无论是否按 `status` 过滤，都返回五类状态数量

## 请求与响应示例
### 示例一：获取全部（含搜索与分页）
- 请求：`POST /torrents/user/list-torrents`
- Body：
```json
{
  "search": "4K HDR",
  "page": 1,
  "page_size": 50
}
```
- 响应：
```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "items": [
      {
        "id": 1,
        "name": "星际穿越 4K HDR REMUX 国英双语",
        "category_name": "电影",
        "category_code": "movie",
        "size_bytes": 73566417613,
        "upload_bytes": 135181768704,
        "download_bytes": 73566417613,
        "ratio": 1.84,
        "seeders": 2847,
        "leechers": 156,
        "progress_percent": 100,
        "upload_date": "2024-11-10T00:00:00Z",
        "complete_date": "2024-11-10T03:12:00Z",
        "status": "uploaded"
      }
    ],
    "pagination": { "page": 1, "page_size": 50, "total": 1234 },
    "stats": {
      "uploaded": 20,
      "seeding": 150,
      "downloading": 8,
      "completed": 63,
      "incomplete": 4
    }
  },
  "path": "/torrents/user/list-torrents",
  "timestamp": "2025-12-05T12:00:00Z"
}
```

### 示例二：指定状态
- Body：
```json
{
  "status": "seeding",
  "search": "",
  "page": 1,
  "page_size": 50
}
```
- 响应：同上结构，`data.items` 为指定状态列表，但 `data.stats` 仍返回全量五类状态数量（用于标签角标）。

## 错误返回约定
- 统一结构：
  ```json
  { "code": 401, "message": "unauthorized", "data": null, "path": "/torrents/user/list-torrents", "timestamp": "2025-12-05T12:00:00Z" }
  ```
- 建议错误码：
  - `401` 未认证/Token 失效
  - `403` 无权限
  - `422` 参数校验失败（详细字段错误放入 `data` 内）
  - `500` 内部错误

## 设计说明（为何这样定义）
- 服务端过滤/分页：避免前端在大数据量场景下本地筛选导致性能问题。
- 数值统一为原始类型：容量/流量用 `bytes` 数字，提升显示与国际化的灵活性。
- 一次请求返回统计：减少额外统计接口调用，便于标签角标即时更新。
- 时间统一 ISO：避免不同时区与区域格式解析差异，前端负责本地化展示。
- 分类编码补充：为后续“筛选”能力（页面已有按钮占位）提供稳定的编码基础。

## 与现有服务的对齐建议
- 优先沿用并扩展 `POST /torrents/user/list-torrents`，由服务端补齐本文档列出的字段与 `stats`。
- 如需拆分统计，可增设 `POST /torrents/user/history/stats`。
- 保持统一响应包裹结构 `{ code, message, data, path, timestamp }`，与现有 axios/OpenAPI 封装兼容。

## 附：页面字段映射说明（前端 UI ←→ 后端返回）
- 种子名称 ← `name`
- 分类 ← `category_name`（可选用 `category_code` 做筛选）
- 大小 ← `size_bytes`（前端格式化）
- 上传量 ← `upload_bytes`（前端格式化）
- 下载量 ← `download_bytes`（前端格式化）
- 分享率 ← `ratio`（前端保留两位小数）
- 进度 ← `progress_percent`
- 做种/下载 ← `seeders` / `leechers`
- 状态 ← `status`
- 发布于 ← `upload_date`
- 完成于 ← `complete_date`
- 标签角标 ← `data.stats` 中五类数量

> 以上为 `TorrentHistoryPage` 接口契约与字段规范。如有新增筛选项或排序需求，可在列表接口的 Body 中增补相应参数（保持 POST + JSON body 约定）。
