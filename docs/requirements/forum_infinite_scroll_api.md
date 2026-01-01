# 论坛无限滚动适配：后端接口变更需求

## 1. 背景与问题

目前论坛话题详情页（Topic Detail）正在从**一次性加载所有楼层**迁移到**无限滚动（分页加载）**模式。

在原有模式下，前端获取所有帖子后，可以在内存中计算每个帖子的“被回复列表”（`incomingReplies`）。即：如果是 Post A 回复了 Post B，前端会遍历所有帖子找到 Post A 并将其挂载到 Post B 的 UI 下面。

**带来的问题：**
在无限滚动模式下，Post B 可能在第 1 页加载，而回复它的 Post A 可能在第 10 页。
当用户浏览第 1 页时，前端尚未获取第 10 页的数据，因此无法知道 Post A 的存在，导致 Post B 下方无法显示“1 条回复”的提示，也无法展开查看回复内容。

## 2. 需求描述

为了解决上述问题，我们需要**后端**在返回帖子列表时，直接提供每个帖子的**被回复列表**（Incoming Replies）。

这意味着引用关系的数据聚合工作需要从**前端**转移到**后端**。

### 涉及接口

- `GET /api/forums/posts` (或话题详情相关的帖子获取接口)

## 3. 接口变更规范

### 3.1 数据结构变更

在返回的帖子对象 (`ForumPost` / `ExtendedApiPost`) 中，新增 `incoming_replies` 字段。

#### 新增字段定义

```typescript
interface IncomingReply {
  id: string; // 回复贴的 ID
  floor: number; // 回复贴的楼层号
  content: string; // 回复贴的内容 (建议截取前100-200字符，或者完整内容)
  created_at: string; // 回复时间
  author: {
    id: string;
    username: string;
    nickname?: string;
    avatar?: string;
  };
}

// 在原有的 Post 对象中新增
interface ForumPost {
  // ... 原有字段 (id, content, floor, replyTo 等) ...

  /**
   * 显式列出所有回复了当前帖子的帖子列表。
   * 即使这些帖子不在当前分页中，也必须返回。
   * 这允许前端在不加载后续页面的情况下显示楼中楼。
   */
  incoming_replies: IncomingReply[];
}
```

### 3.2 示例 JSON 响应

假设当前请求第 1 页，返回了 `floor: 2` 的帖子。虽然回复它的 `floor: 55` 帖子在第 3 页，但后端必须在 `floor: 2` 的数据中包含它。

```json
{
  "items": [
    {
      "id": "post_original_2",
      "floor": 2,
      "content": "这是一个很棒的观点。",
      "author": { "username": "userA" },
      "replyTo": null,

      // [新增] 即使回复者 userB 的帖子在第 3 页，这里也必须包含
      "incoming_replies": [
        {
          "id": "post_reply_55",
          "floor": 55,
          "content": "我不同意你的看法...",
          "created_at": "2024-01-02T12:00:00Z",
          "author": {
            "id": "user_b_id",
            "username": "userB",
            "nickname": "User B",
            "avatar": "https://..."
          }
        }
      ]
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 20
}
```

## 4. 性能考量

- **N+1 查询问题**：后端在查询帖子列表时，需要格外注意避免 N+1 问题。建议使用 SQL 的 `JOIN` 或子查询，或者在应用层先获取当前页的所有 Post IDs，然后批量查询这些 IDs 的所有回复（`WHERE replyToId IN (...)`）。
- **数据量控制**：如果某个热门帖子的回复非常多（例如几百条），全量返回 `incoming_replies` 可能会导致 payload 过大。
  - **建议策略**：可以限制 `incoming_replies` 最多返回前 3-5 条（用于预览），并提供一个 `incoming_replies_count` 字段。
  - **当前前端实现**：目前前端是直接渲染列表，**建议先全量返回**（Discourse 的做法），或者如果确实太多，后续再讨论增加“加载更多回复”的子接口。目前阶段请优先保证数据的完整性。

## 5. 前端适配状态 (Ready)

前端代码已更新以适配此变更：

- **Types**: 已更新 `ExtendedApiPost` 接口，增加了 `incoming_replies`。
- **UI**: `TopicDetail` 组件已移除前端计算逻辑，改为直接读取 `post.incomingReplies`。

**注意：** 在后端接口就绪前，前端的楼中楼回复将无法显示。
