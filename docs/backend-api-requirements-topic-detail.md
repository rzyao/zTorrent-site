# 论坛话题详情页 - 后端接口需求文档

> 基于 Discourse 实现模式，为实现完整的话题详情页功能所需的后端接口规范。

---

## 1. 功能概述

前端需要实现以下核心功能：

| 功能         | 描述                                 | 当前状态                          |
| ------------ | ------------------------------------ | --------------------------------- |
| 时间轴显示   | 显示当前位置/总帖子数 (如 `5 / 314`) | ✅ 已实现（依赖 `total` 字段）    |
| 双向无限滚动 | 支持向上、向下加载更多帖子           | ✅ 已实现（基于分页）             |
| 跨楼层跳转   | 通过 URL 或时间轴跳转到特定楼层      | ⚠️ 部分实现（需 `nearPost` 支持） |
| 实时更新     | WebSocket/SSE 推送新帖子             | 待实现                            |

---

## 2. 接口规范

### 2.1 获取帖子列表（核心接口）

**当前接口**:

```
GET /api/forums/posts?topicId={topicId}&page={page}&limit={limit}
```

**建议增强**:

```
GET /api/forums/posts?topicId={topicId}&page={page}&limit={limit}&nearPost={postNumber}
```

#### 请求参数

| 参数       | 类型   | 必填 | 描述                                          |
| ---------- | ------ | ---- | --------------------------------------------- |
| `topicId`  | string | ✅   | 话题 ID                                       |
| `page`     | number | 否   | 页码，默认 1                                  |
| `limit`    | number | 否   | 每页数量，默认 20                             |
| `nearPost` | number | 否   | **新增** - 目标楼层号，返回包含该楼层的上下文 |

#### 响应结构

```typescript
interface PostsResponse {
  items: Post[]; // 帖子列表
  total: number; // ⚠️ 重要：话题内帖子总数（用于时间轴）
  page: number; // 当前页码
  limit: number; // 每页数量
  hasNext: boolean; // 是否有下一页
  hasPrevious: boolean; // 是否有上一页（当 nearPost 生效时）
}

interface Post {
  id: string;
  postNumber: number; // ⚠️ 重要：话题内楼层号 (1, 2, 3, ..., N)
  content: string;
  isSystem: boolean;
  createdAt: string;
  likeCount: number;
  repliesCount: number;
  author: {
    id: string;
    username: string;
    nickname?: string;
    avatar?: string;
    role?: string;
  };
  replyTo?: {
    // 回复目标
    id: string;
    postNumber: number; // 被回复帖子的楼层号
    content?: string; // 被回复内容摘要
    author?: {
      username: string;
      avatar?: string;
    };
  };
  incomingReplies?: Post[]; // 回复本帖的帖子列表（可选）
}
```

#### `nearPost` 参数行为

当提供 `nearPost` 参数时：

1. **计算目标页**: `targetPage = Math.ceil(nearPost / limit)`
2. **返回上下文**: 返回包含目标楼层的那一页数据
3. **调整页码**: 响应的 `page` 应该是实际返回的页码

**示例**:

```
请求: GET /posts?topicId=123&nearPost=150&limit=20
预期: 返回第 8 页 (帖子 141-160)，确保 150 楼在结果中
响应: { items: [...], total: 314, page: 8, limit: 20, hasNext: true, hasPrevious: true }
```

---

### 2.2 创建帖子（回复）

**当前接口**:

```
POST /api/forums/posts
```

#### 请求体

```typescript
interface CreatePostRequest {
  topicId: string;
  content: string;
  replyToId?: string; // 回复目标帖子 ID（可选）
}
```

#### 响应结构

```typescript
interface CreatePostResponse {
  id: string;
  postNumber: number;      // ⚠️ 重要：新帖子的楼层号（用于前端跳转）
  content: string;
  createdAt: string;
  author: { ... };
}
```

**关键点**:

- `postNumber` 必须返回，前端依赖此值进行 URL 跳转 (`/forum/topic/{topicId}/{postNumber}`)
- `postNumber` 是话题内的相对楼层号，不是全局序列号

---

### 2.3 获取话题详情

**当前接口**:

```
GET /api/forums/topics/{topicId}
```

#### 响应结构（建议增强）

```typescript
interface TopicResponse {
  id: string;
  title: string;
  content: string;         // 1 楼内容
  postsCount: number;      // ⚠️ 新增：帖子总数（与 posts 接口的 total 一致）
  views: number;
  replyCount: number;
  isPinned: boolean;
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
  lastReplyAt: string;
  highestPostNumber: number; // ⚠️ 新增：最大楼层号
  category: { ... };
  author: { ... };
  tags: { ... }[];
}
```

**新增字段说明**:

- `postsCount`: 帖子总数，用于时间轴初始化
- `highestPostNumber`: 最大楼层号，用于"跳到底部"功能

---

### 2.4 [可选] 获取帖子 ID 列表（Stream）

> 此接口为高级功能，用于精确的时间轴计算。Discourse 使用此模式。

**接口**:

```
GET /api/forums/topics/{topicId}/post-stream
```

#### 响应结构

```typescript
interface PostStreamResponse {
  postIds: number[]; // 所有帖子 ID 的有序列表
  firstPostId: number;
  lastPostId: number;
  highestPostNumber: number;
}
```

**用途**:

- 前端可以根据 `postIds.indexOf(currentPostId)` 精确计算当前位置
- 支持快速跳转到任意楼层

---

## 3. WebSocket/SSE 实时推送（待实现）

### 事件类型

```typescript
type TopicEvent =
  | { type: "post_created"; postId: string; postNumber: number }
  | { type: "post_updated"; postId: string }
  | { type: "post_deleted"; postId: string }
  | { type: "post_liked"; postId: string; likeCount: number };
```

### 订阅方式

```
WS: /ws/topic/{topicId}
SSE: /api/forums/topics/{topicId}/events
```

---

## 4. 实现优先级

| 优先级 | 接口                       | 描述                               |
| ------ | -------------------------- | ---------------------------------- |
| 🔴 高  | `posts` 返回 `postNumber`  | 当前回复后跳转依赖此字段           |
| 🔴 高  | `posts` 返回正确的 `total` | 时间轴显示依赖此字段               |
| 🟡 中  | `nearPost` 参数支持        | 跳转到中间楼层时的数据加载优化     |
| 🟢 低  | `post-stream` 接口         | 精确时间轴计算（当前方案已可接受） |
| 🟢 低  | WebSocket 实时推送         | 实时更新新帖子                     |

---

## 5. 当前问题确认

请后端确认以下问题：

### 5.1 `postNumber` 字段

- **问题**: 当前 `POST /posts` 创建帖子后返回的 `postNumber` 是话题内楼层号还是全局序列号？
- **期望**: 返回话题内楼层号（如 2, 3, 4, ...）

### 5.2 `total` 字段

- **问题**: `GET /posts?topicId=X` 返回的 `total` 是什么含义？
- **期望**: 该话题内的帖子总数（用于时间轴 `X / total` 显示）

### 5.3 `nearPost` 支持

- **问题**: 当前是否支持 `nearPost` 参数？
- **期望**: 如果不支持，评估实现难度

---

## 6. 参考：Discourse API

Discourse 的话题详情接口返回结构（供参考）：

```json
{
  "post_stream": {
    "posts": [...],
    "stream": [1, 2, 3, 4, ...],  // 帖子 ID 列表
  },
  "timeline_lookup": [[1, 0], [20, 1], [40, 2], ...],  // 时间轴快速索引
  "highest_post_number": 314,
  "posts_count": 314
}
```

我们的方案已简化，但核心要素相同。

---

_文档版本: 1.0_  
_更新日期: 2026-01-02_
