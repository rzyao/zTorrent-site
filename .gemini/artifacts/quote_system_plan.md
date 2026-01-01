# 高级引用系统实现计划

## 功能需求

1. **跨话题引用** - 支持引用其他话题中的帖子
2. **展开引用帖子** - 点击可查看完整引用内容
3. **跳转到原帖** - 点击可导航至被引用的帖子
4. **多帖子引用选择器** - 引用多个帖子时选择要回复的目标

## 技术方案

### Phase 1: Quote Block 组件增强

**文件**: `src/pages/Forums/pages/TopicDetail/components/QuoteBlock.tsx`

- 解析 Markdown 引用块中的 @username 和 #floor 信息
- 显示被引用者头像、用户名、楼层号
- 展开/折叠功能（chevron 图标）
- 跳转按钮（同话题滚动到楼层，跨话题导航到新页面）

### Phase 2: 跨话题引用支持

**数据结构扩展**:

```typescript
interface QuoteData {
  topicId: string; // 被引用话题 ID
  postId: string; // 被引用帖子 ID
  floor: number; // 楼层号
  username: string; // 作者用户名
  avatar?: string; // 作者头像
  content: string; // 引用内容片段
  topicTitle?: string; // 跨话题时显示话题标题
  isCrossTopic: boolean; // 是否跨话题
}
```

**API 需求**: 获取帖子详情接口（用于展开时加载完整内容）

### Phase 3: 多引用选择器

**ComposerStore 扩展**:

```typescript
interface ComposerDraft {
  // 现有字段...
  quotes: Array<{
    postId: string;
    username: string;
    floor: number;
    content: string;
  }>;
  selectedReplyTo?: string; // 选中的回复目标 postId
}
```

**UI 组件**: `QuoteTargetPicker`

- 当 quotes.length > 1 时显示
- 下拉菜单列出所有被引用的帖子
- 用户可选择要作为"回复目标"的帖子

### Phase 4: 引用解析器

**工具函数**: `parseQuotes(markdown: string): QuoteData[]`

- 正则匹配 `> **@username**: ...` 或 `[quote="username, post:X, topic:Y"]...[/quote]`
- 提取引用元数据
- 返回结构化的引用数据数组

## 实现顺序

1. ✅ 基础引用 UI (SelectionPopover) - 已完成
2. 🔲 QuoteBlock 组件 - 可展开/折叠的引用块
3. 🔲 引用解析器 - 从 Markdown 提取引用信息
4. 🔲 跳转功能 - 同话题滚动，跨话题导航
5. 🔲 多引用选择器 - ComposerStore 扩展 + QuoteTargetPicker UI

## 预估工作量

- Phase 1: 约 30 分钟
- Phase 2: 约 20 分钟 (主要是数据结构)
- Phase 3: 约 40 分钟 (包含 UI 组件)
- Phase 4: 约 15 分钟

总计: 约 1.5-2 小时
