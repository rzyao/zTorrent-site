/**
 * 论坛模块路由配置
 * 独立于主路由，使用 ForumLayout 布局
 */
import { Route, Navigate } from "react-router-dom";
import { lazy } from "react";
import { AuthRoute } from "./guards";

// 论坛布局与页面懒加载
const ForumLayout = lazy(() =>
  import("@/pages/Forums/layouts/ForumLayout").then((m) => ({ default: m.ForumLayout })),
);
const ForumHomePage = lazy(() =>
  import("@/pages/Forums/pages/ForumHomePage").then((m) => ({ default: m.ForumHomePage })),
);
const TopicDetail = lazy(() =>
  import("@/pages/Forums/pages/TopicDetail/index").then((m) => ({ default: m.TopicDetail })),
);
const CategoryPage = lazy(() =>
  import("@/pages/Forums/pages/CategoryPage/index").then((m) => ({ default: m.CategoryPage })),
);
const CreateTopicPage = lazy(() =>
  import("@/pages/Forums/pages/CreateTopicPage").then((m) => ({ default: m.CreateTopicPage })),
);
const CategoriesPage = lazy(() =>
  import("@/pages/Forums/pages/CategoriesPage").then((m) => ({ default: m.CategoriesPage })),
);
const NewCategoryPage = lazy(() =>
  import("@/pages/Forums/pages/NewCategoryPage").then((m) => ({ default: m.NewCategoryPage })),
);
const EditCategoryPage = lazy(() =>
  import("@/pages/Forums/pages/EditCategoryPage").then((m) => ({ default: m.EditCategoryPage })),
);
const TagsPage = lazy(() =>
  import("@/pages/Forums/pages/TagsPage").then((m) => ({ default: m.TagsPage })),
);
const BookmarksPage = lazy(() =>
  import("@/pages/Forums/pages/BookmarksPage").then((m) => ({ default: m.BookmarksPage })),
);

/**
 * 论坛路由组件
 * 使用 ForumLayout 作为布局容器
 */
export function ForumRoutes() {
  return (
    <Route
      path="/forum"
      element={
        <AuthRoute>
          <ForumLayout />
        </AuthRoute>
      }
    >
      {/* 论坛首页 */}
      <Route index element={<ForumHomePage />} />
      {/* 热门话题（全局） */}
      <Route path="hot" element={<ForumHomePage />} />
      {/* 最新发布（全局） */}
      <Route path="latest" element={<ForumHomePage />} />
      {/* 话题详情 */}
      <Route path="topic/:topicId" element={<TopicDetail />} />
      {/* 话题详情 - 带楼层号跳转 */}
      <Route path="topic/:topicId/:postNumber" element={<TopicDetail />} />
      {/* 分类页面（默认排序） */}
      <Route path="category/:categoryId" element={<CategoryPage />} />
      {/* 分类页面（带排序） */}
      <Route path="category/:categoryId/:sortBy" element={<CategoryPage />} />
      {/* 标签页面 */}
      <Route path="tag/:tagName" element={<CategoryPage />} />
      {/* 类别概览页 */}
      <Route path="categories" element={<CategoriesPage />} />
      {/* 标签概览页 */}
      <Route path="tags" element={<TagsPage />} />
      {/* 新建类别 */}
      <Route path="new-category" element={<NewCategoryPage />} />
      {/* 编辑类别 */}
      <Route path="category/:categoryId/edit" element={<EditCategoryPage />} />
      {/* 发布话题 */}
      <Route path="create" element={<CreateTopicPage />} />
      {/* 我的收藏 */}
      <Route path="bookmarks" element={<BookmarksPage />} />
    </Route>
  );
}
