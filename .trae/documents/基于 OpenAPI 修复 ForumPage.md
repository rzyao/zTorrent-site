## 问题诊断
- 不存在的服务方法：页面在 `src/pages/forum/ForumPage.tsx:289` 调用了 `ForumThreadsService.forumThreadsControllerIncViews`，但生成的 `src/api/services/ForumThreadsService.ts` 并未提供该方法（已核验 1–169 行）。这会导致运行时错误。
- 模拟数据未清理：页面仍保留本地 `forumPosts/categories/filteredPosts/sortedPosts` 的模拟与筛选逻辑，但实际列表已改为使用后端线程数据，需删除以避免混淆与后续维护成本。
- 轻微类型与显示一致性问题：个别位置使用 `(post as any).authorUsername` 读取作者名，前端类型已包含 `authorUsername` 可直接使用，保证一致性。

## 修改方案
- 引入底层请求并改造浏览数递增
  - 在 `src/pages/forum/ForumPage.tsx` 头部新增导入：`import { request as __request } from '@/api/core/request';`
  - 将 `selectedThread` 详情拉取之后的浏览数递增逻辑（`src/pages/forum/ForumPage.tsx:289-307`）替换为底层调用：
    - 使用 `__request(OpenAPI, { method: 'POST', url: '/forum/threads/inc-views', body: { id: selectedThread.id }, mediaType: 'application/json' })` 发起递增；
    - 保留现有“本地 TTL 防重复 + 乐观更新 + 出错回滚”的完整流程；
    - 若后端在 `get-thread` 已递增，则以返回的 `viewsCount` 同步 UI 并标记已浏览，不再重复调用递增。
  - 保留可见性变化的后备统计：`sendBeacon(OpenAPI.BASE + '/forum/threads/inc-views')`（`src/pages/forum/ForumPage.tsx:340-353`），仅在 `OpenAPI.BASE` 存在且本地尚未计数时触发。
- 清理模拟数据与旧分类逻辑
  - 删除 `forumPosts`、`categories`、`filteredPosts`、`sortedPosts` 以及对应的未使用 UI 绑定；
  - 全面以后端 `serverCategories` 与 `threads` 驱动列表与交互，避免双源数据。
- 细节优化（不改交互）
  - 列表与详情作者显示统一：直接使用 `post.authorUsername || post.authorId`，移除 `(post as any)`；
  - 保留统一响应解包 `unwrapResponse()` 与错误提取 `extractErrorMessage()`，确保与 OpenAPI 返回的 `{ code, message, data }` 包装兼容。

## 验证与回归
- 列表加载：切换分类与搜索时调用 `forumThreadsControllerListThreads` 并正确分页更新；无数据时显示占位。
- 详情加载：点击进入主题拉取 `get-thread`，若后端已递增视图则 UI 同步；否则仅在 TTL 允许下执行递增并乐观 + 回滚。
- 回帖创建与刷新：调用 `forumPostsControllerCreate` 成功后刷新回帖列表 `forumPostsControllerListPosts`，清空输入态与父楼层引用。
- 后备统计：页面隐藏时触发一次 `sendBeacon`，避免短时间重复计数。

## 注意事项
- `OpenAPI.BASE` 与 `OpenAPI.TOKEN` 已在 `src/layouts/AppLayout.tsx` 初始化；`sendBeacon` 不携带认证，默认视为公共端点统计；若后端改为鉴权端点，主流程仍有效，后备统计可能被拒绝但不影响 UI。
- 按用户要求不做旧代码兼容：删除模拟数据与旧筛选路径；所有数据源均以后端为准。
- 代码内将补充完整注释，解释每个改动的原因与实现方式，便于后续维护。