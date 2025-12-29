/**
 * 论坛模块入口
 *
 * 论坛现在使用独立的布局系统，包含：
 * - ForumLayout: 顶部导航 + 左侧边栏 + 右侧内容区域
 * - 嵌套路由系统，支持多个子页面
 *
 * 路由结构:
 * - /forum          - 论坛首页 (ForumHomePage)
 * - /forum/trending - 热门话题
 * - /forum/latest   - 最新发布
 * - /forum/topic/:topicId - 话题详情 (TopicDetailPage)
 * - /forum/category/:categoryId - 分类页面 (CategoryPage)
 * - /forum/tag/:tagName - 标签页面
 * - /forum/create   - 发布话题 (CreateTopicPage)
 *
 * 组件结构:
 * - layouts/ForumLayout.tsx   - 论坛布局组件
 * - layouts/ForumHeader.tsx   - 顶部导航栏
 * - layouts/ForumSidebar.tsx  - 左侧边栏
 * - pages/ForumHomePage.tsx   - 论坛首页
 * - pages/TopicDetailPage.tsx - 话题详情页
 * - pages/CategoryPage.tsx    - 分类页面
 * - pages/CreateTopicPage.tsx - 发布话题页面
 * - components/               - 共享组件 (ForumList, TopicDetail 等)
 * - context/ForumThemeContext.tsx - 论坛主题上下文
 */

// 导出布局组件
export { ForumLayout, ForumHeader, ForumSidebar } from "./layouts";
export type { ForumOutletContext } from "./layouts";

// 导出页面组件
export { ForumHomePage, TopicDetailPage, CategoryPage, CreateTopicPage } from "./pages";

// 导出共享组件
export { ForumList } from "./components/ForumList";
export { TopicDetail } from "./components/TopicDetail";

// 导出主题上下文
export { ForumThemeProvider, useForumTheme } from "./context/ForumThemeContext";
