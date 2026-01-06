/**
 * Forum 模块导出入口
 * 论坛模块的公共导出
 */

// 布局组件
export { ForumLayout } from "./layouts/ForumLayout";

// 上下文
export { ForumThemeProvider, useForumTheme } from "./context/ForumThemeContext";

// 页面组件 (懒加载时使用 componentRegistry，仅供直接导入)
export { ForumHomePage } from "./pages/ForumHomePage";
export { TopicDetail } from "./pages/TopicDetail";
export { CategoryPage } from "./pages/CategoryPage";
export { CreateTopicPage } from "./pages/CreateTopicPage";
export { CategoriesPage } from "./pages/CategoriesPage";
export { NewCategoryPage } from "./pages/NewCategoryPage";
export { EditCategoryPage } from "./pages/EditCategoryPage";
export { TagsPage } from "./pages/TagsPage";
export { BookmarksPage } from "./pages/BookmarksPage";
