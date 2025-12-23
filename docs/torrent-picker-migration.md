# 种子选择器 (Torrent Picker) 接口迁移指南

**版本**: 1.0  
**日期**: 2025-12-24  
**状态**: ✅ 已发布

---

## 1. 变更摘要

原 `/torrents/list` 接口已被重构为更通用的 **/torrents/picker** 接口，用于在各媒体模块（电影、剧集、歌单）中绑定种子。

| 特性         | 旧接口 (`/list`)      | 新接口 (`/picker`)             |
| ------------ | --------------------- | ------------------------------ |
| **路径**     | `POST /torrents/list` | `POST /torrents/picker`        |
| **功能**     | 简单列表查询          | 种子选择器（支持绑定状态标记） |
| **必填参数** | 无                    | `bindMediaId`, `bindMediaType` |
| **绑定状态** | 不支持                | 返回 `isBound: boolean`        |

---

## 2. 接口详情

### 2.1 请求参数

**接口地址**: `POST /torrents/picker`  
**Content-Type**: `application/json`

| 参数名          | 类型   | 必填   | 说明                               | 示例值            |
| --------------- | ------ | ------ | ---------------------------------- | ----------------- |
| `page`          | number | 否     | 页码 (默认 1)                      | `1`               |
| `pageSize`      | number | 否     | 每页条数 (默认 20)                 | `20`              |
| `keyword`       | string | 否     | 搜索关键词 (标题/副标题)           | `"星际穿越"`      |
| `category`      | string | 否     | 分类 KEY                           | `"movie-4k"`      |
| `status`        | string | 否     | 种子状态                           | `"active"`        |
| `uploaderId`    | string | 否     | 上传者 ID                          | `"u123"`          |
| `bindMediaId`   | string | **是** | **目标媒体 ID** (用于判断绑定状态) | `"movie-abc-123"` |
| `bindMediaType` | string | **是** | **目标媒体类型** (枚举值)          | `"movie"`         |

**bindMediaType 枚举值**:

- `movie` (电影)
- `series` (剧集)
- `episode` (分集)
- `playlist` (歌单)

### 2.2 响应结构

**HTTP 状态码**: `200 OK`

```json
{
  "items": [
    {
      "id": "torrent-1",
      "title": "星际穿越 Interstellar 2014 2160p",
      "size": 1024000,
      "uploadedAt": "2024-01-01T12:00:00Z",
      "isBound": true // <--- 关键字段：true 表示已绑定到当前媒体
      // ... 其他种子字段
    },
    {
      "id": "torrent-2",
      "title": "星际穿越 Interstellar 2014 1080p",
      "isBound": false // <--- false 表示未绑定，可选择
      // ...
    }
  ],
  "total": 5
}
```

---

## 3. 前端迁移指南

### 3.1 代码修改示例

**场景**：在电影编辑页面打开“添加种子”弹窗。

**旧代码**：

```typescript
// ❌ 已废弃
const fetchTorrents = async (keyword) => {
  return await api.post("/torrents/list", { page: 1, keyword });
};
```

**新代码**：

```typescript
// ✅ 必须传入当前媒体上下文
const fetchTorrents = async (keyword) => {
  return await api.post("/torrents/picker", {
    page: 1,
    keyword,
    bindMediaId: currentMovieId, // 必填：当前电影ID
    bindMediaType: "movie", // 必填：类型
  });
};
```

### 3.2 渲染逻辑建议

前端应根据 `isBound` 字段调整 UI 显示：

```jsx
// React 示例
{
  items.map((torrent) => (
    <ListItem key={torrent.id}>
      <TorrentInfo data={torrent} />

      {torrent.isBound ? (
        <Button disabled>已添加</Button>
      ) : (
        <Button onClick={() => handleBind(torrent.id)}>添加</Button>
      )}
    </ListItem>
  ));
}
```

---

## 4. TypeScript 类型定义

建议添加到 `src/api/types.ts`：

```typescript
export enum MediaType {
  MOVIE = "movie",
  SERIES = "series",
  EPISODE = "episode",
  PLAYLIST = "playlist",
}

export interface PickerTorrentsRequest {
  page?: number;
  pageSize?: number;
  keyword?: string;
  category?: string;
  status?: string;
  uploaderId?: string;

  // 必填绑定上下文
  bindMediaId: string;
  bindMediaType: MediaType;
}

export interface TorrentItem {
  id: string;
  title: string;
  subTitle?: string;
  size: number;
  // ... 其他基础字段

  // 扩展字段
  isBound: boolean; // 是否已绑定
}

export interface PickerTorrentsResponse {
  items: TorrentItem[];
  total: number;
}
```
