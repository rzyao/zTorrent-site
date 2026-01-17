/**
 * 论坛模块路由配置
 * 独立于主路由，使用 ForumLayout 布局
 */
import { Route, Navigate } from "react-router-dom";
import { lazy } from "react";
import { AuthRoute } from "./guards";

// 论坛布局与页面懒加载
const ForumLayout = lazy(() =>
  import("@/modules/forum/layouts/ForumLayout").then((m) => ({ default: m.ForumLayout })),
);
const ForumHomePage = lazy(() =>
  import("@/modules/forum/pages/ForumHomePage").then((m) => ({ default: m.ForumHomePage })),
);
const TopicDetail = lazy(() =>
  import("@/modules/forum/pages/TopicDetail/index").then((m) => ({ default: m.TopicDetail })),
);
const CategoryPage = lazy(() =>
  import("@/modules/forum/pages/CategoryPage/index").then((m) => ({ default: m.CategoryPage })),
);
const CreateTopicPage = lazy(() =>
  import("@/modules/forum/pages/CreateTopicPage").then((m) => ({ default: m.CreateTopicPage })),
);
const CategoriesPage = lazy(() =>
  import("@/modules/forum/pages/CategoriesPage").then((m) => ({ default: m.CategoriesPage })),
);
const NewCategoryPage = lazy(() =>
  import("@/modules/forum/pages/NewCategoryPage").then((m) => ({ default: m.NewCategoryPage })),
);
const EditCategoryPage = lazy(() =>
  import("@/modules/forum/pages/EditCategoryPage").then((m) => ({ default: m.EditCategoryPage })),
);
const TagsPage = lazy(() =>
  import("@/modules/forum/pages/TagsPage").then((m) => ({ default: m.TagsPage })),
);
const BookmarksPage = lazy(() =>
  import("@/modules/forum/pages/BookmarksPage").then((m) => ({ default: m.BookmarksPage })),
);
const TagGroupsPage = lazy(() =>
  import("@/modules/forum/pages/TagGroupsPage").then((m) => ({ default: m.TagGroupsPage })),
);
const TopicBountyCancelRequestsAdminPage = lazy(() =>
  import("@/modules/forum/pages/Admin/TopicBountyCancelRequests").then((m) => ({
    default: m.TopicBountyCancelRequestsAdminPage,
  })),
);

const TestButtonPage = lazy(() =>
  import("@/modules/forum/pages/TestButtonPage").then((m) => ({ default: m.ButtonTestPage })),
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
      <Route path="category/:categoryId/edit/:section" element={<EditCategoryPage />} />
      {/* 发布话题 */}
      <Route path="create" element={<CreateTopicPage />} />
      {/* 我的收藏 */}
      {/* 我的收藏 */}
      <Route path="bookmarks" element={<BookmarksPage />} />
      {/* 标签组管理 */}
      <Route path="admin/tag-groups" element={<TagGroupsPage />} />
      {/* 悬赏取消申请审核（管理员） */}
      <Route path="admin/bounty-cancel-requests" element={<TopicBountyCancelRequestsAdminPage />} />
      {/* 按钮组件测试页 */}
      <Route path="test/buttons" element={<TestButtonPage />} />
    </Route>
  );
}
